// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EtherGoals {
    struct Goal {
        string description;
        uint256 amount;
        uint256 deadline;
        address validator;
        address owner;
        bool isCompleted;
        bool isApproved;
    }

    mapping(address => Goal[]) public goals;

    event GoalCreated(address indexed owner, string description, uint256 amount, uint256 deadline, address validator);
    event GoalApproved(address indexed owner, uint256 goalIndex);
    event GoalDenied(address indexed owner, uint256 goalIndex);

    function createGoal(string memory _description, uint256 _deadline, address _validator) public payable {
        require(msg.value > 0, "ETH must be staked");
        require(_deadline > block.timestamp, "Deadline must be in the future");

        Goal memory newGoal = Goal({
            description: _description,
            amount: msg.value,
            deadline: _deadline,
            validator: _validator,
            owner: msg.sender,
            isCompleted: false,
            isApproved: false
        });

        goals[msg.sender].push(newGoal);

        emit GoalCreated(msg.sender, _description, msg.value, _deadline, _validator);
    }

    function approveGoal(address _owner, uint256 _goalIndex) public {
        Goal storage goal = goals[_owner][_goalIndex];
        require(msg.sender == goal.validator, "Only the assigned validator can approve this goal");
        require(block.timestamp > goal.deadline, "Goal deadline has not yet passed");
        require(!goal.isApproved, "Goal already approved");
        require(goal.isCompleted, "Goal must be marked as completed by the owner");

        goal.isApproved = true;

        payable(goal.owner).transfer(goal.amount);

        emit GoalApproved(_owner, _goalIndex);
    }

    function denyGoal(address _owner, uint256 _goalIndex) public {
        Goal storage goal = goals[_owner][_goalIndex];
        require(msg.sender == goal.validator, "Only the assigned validator can deny this goal");
        require(block.timestamp > goal.deadline, "Goal deadline has not yet passed");
        require(!goal.isApproved, "Goal already approved");

        goal.isApproved = false;

        // Optionally: Burn the ETH
        // payable(address(0)).transfer(goal.amount);

        emit GoalDenied(_owner, _goalIndex);
    }

    function markGoalCompleted(uint256 _goalIndex) public {
        Goal storage goal = goals[msg.sender][_goalIndex];
        require(block.timestamp <= goal.deadline, "Cannot mark goal as completed after the deadline");
        require(!goal.isApproved, "Goal already approved or denied");

        goal.isCompleted = true;
    }

    function getGoalsForValidator(address _validator) public view returns (Goal[] memory) {
        uint256 totalGoals = 0;
        for (uint256 i = 0; i < goals[_validator].length; i++) {
            if (goals[_validator][i].validator == msg.sender) {
                totalGoals++;
            }
        }

        Goal[] memory validatorGoals = new Goal[](totalGoals);
        uint256 index = 0;
        for (uint256 i = 0; i < goals[_validator].length; i++) {
            if (goals[_validator][i].validator == msg.sender) {
                validatorGoals[index] = goals[_validator][i];
                index++;
            }
        }

        return validatorGoals;
    }
}
