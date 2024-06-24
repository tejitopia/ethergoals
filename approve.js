// Example goals data, replace with actual data fetching logic
const goals = [
  {
    id: 1,
    description: "Goal 1",
    amount: "0.5",
    deadline: "2024-06-30T18:30:00Z",
  },
  {
    id: 2,
    description: "Goal 2",
    amount: "1.0",
    deadline: "2024-07-15T12:00:00Z",
  },
];

function fetchGoals() {
  const goalsList = document.getElementById("goalsList");
  goalsList.innerHTML = "";

  goals.forEach((goal) => {
    const goalContainer = document.createElement("div");
    goalContainer.className = "goal";

    const goalHeader = document.createElement("h3");
    goalHeader.textContent = goal.description;
    goalContainer.appendChild(goalHeader);

    const goalDetails = document.createElement("p");
    goalDetails.textContent = `Amount Staked: ${
      goal.amount
    } ETH\nCompletion Date: ${new Date(goal.deadline).toLocaleString()}`;
    goalContainer.appendChild(goalDetails);

    const goalQuestion = document.createElement("p");
    goalQuestion.textContent = "Has your friend completed their goal?";
    goalContainer.appendChild(goalQuestion);

    const buttonContainer = document.createElement("div");
    buttonContainer.className = "button-container";

    const approveButton = document.createElement("button");
    approveButton.className = "btn buttonHighContrast";
    approveButton.textContent = "Yes";
    approveButton.onclick = () => validateGoal(goal.id, true);
    buttonContainer.appendChild(approveButton);

    const declineButton = document.createElement("button");
    declineButton.className = "btn buttonHighContrast";
    declineButton.textContent = "No";
    declineButton.onclick = () => validateGoal(goal.id, false);
    buttonContainer.appendChild(declineButton);

    goalContainer.appendChild(buttonContainer);
    goalsList.appendChild(goalContainer);
  });
}

function validateGoal(goalId, isCompleted) {
  // Implement goal validation logic here
  console.log(`Goal ${goalId} completed: ${isCompleted}`);
}

document
  .getElementById("fetchGoalsButton")
  .addEventListener("click", fetchGoals);
