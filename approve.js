// Example goals data, replace with actual data fetching logic
import { contractABI_JS } from "./Accountability_ABI.js";

const provider = new ethers.providers.Web3Provider(window.ethereum);
const contractAddress_JS = "0xCe758d0d731b069cD7Ed0aC25E4D4e9F003f0A6c";
// import contract_abi from "./contract_abi.js";
// console.log(contract_abi);

const contractDefined_JS = new ethers.Contract(
  contractAddress_JS,
  contractABI_JS,
  provider
);


let goals = [
  // {
  //   id: 1,
  //   description: "Goal 1",
  //   amount: "0.5",
  //   deadline: "2024-06-30T18:30:00Z",
  //   charity: "Charity A",
  // },
  // {
  //   id: 2,
  //   description: "Goal 2",
  //   amount: "1.0",
  //   deadline: "2024-07-15T12:00:00Z",
  //   charity: "DAO B",
  // },
];

async function fetchGoals() {

  console.log("fetchGoals clicked")
  const goalsList = document.getElementById("goalsList");
  const validator_address = document.getElementById("userAddress").value;
  const signer = await provider.getSigner();
  const contractWithSigner = contractDefined_JS.connect(signer);
  goals = await contractWithSigner.getGoalsForValidator(validator_address);
  console.log("golas:",goals)
  goalsList.innerHTML = "";

  goals.forEach((index, goal) => {
    const goalContainer = document.createElement("div");
    goalContainer.className = "goal";

    const goalHeader = document.createElement("h3");
    goalHeader.textContent = goal.description;
    goalContainer.appendChild(goalHeader);

    const goalDetailsAmount = document.createElement("p");
    goalDetailsAmount.textContent = `Amount Staked: ${(goal.amount / 10 ** 18)} ETH`;
    goalContainer.appendChild(goalDetailsAmount);

    const goalDetailsDeadline = document.createElement("p");

    console.log('goal.deadline:', goal.deadline._hex)
    const timeStamp = parseInt(goal.deadline._hex, 16);
    console.log('timeStamp:', timeStamp)
    goalDetailsDeadline.textContent = `Deadline: ${new Date(
      timeStamp * 1000
    ).toLocaleString()}`;

    goalContainer.appendChild(goalDetailsDeadline);

    const goalQuestion = document.createElement("p");
    goalQuestion.textContent = "Has your friend completed their goal?";
    goalContainer.appendChild(goalQuestion);

    const buttonContainer = document.createElement("div");
    buttonContainer.className = "button-container";

    const approveButton = document.createElement("button");
    approveButton.className = "btn buttonHighContrast";
    approveButton.textContent = "Yes";
    approveButton.onclick = () => validateGoal(index, true);
    buttonContainer.appendChild(approveButton);

    const declineButton = document.createElement("button");
    declineButton.className = "btn buttonHighContrast";
    declineButton.textContent = "No";
    declineButton.onclick = () => validateGoal(index, false);
    buttonContainer.appendChild(declineButton);

    const supportButton = document.createElement("button");
    supportButton.className = "btn buttonHighContrast";
    supportButton.textContent = "Support";
    supportButton.onclick = () => supportGoal(goal.id);
    buttonContainer.appendChild(supportButton);

    goalContainer.appendChild(buttonContainer);
    goalsList.appendChild(goalContainer);
  });
}

function validateGoal(goalId, isCompleted) {

  console.log('validateGoal:', goalId, isCompleted)
  const signer = provider.getSigner();
  const contractWithSigner = contractDefined_JS.connect(signer);
  if (isCompleted == true) {
    console.log(`Goal ${goalId} completed: ${isCompleted}`);
    const owner_address = document.getElementById("userAddress").value;
    console.log('asd', owner_address)
   
    try {
      console.log('yes')
      const tx = contractWithSigner.approveGoal(owner_address, 0);
      alert("Goal marked as completed");
    } catch (error) {
      console.error(error);
      alert("Error marking goal as completed");
    }
  }
  if (isCompleted == false) {
    console.log(`Goal ${goalId} completed: ${isCompleted}`);
    const owner_address = document.getElementById("userAddress").value;
    console.log('asd', owner_address)
   
    try {
      console.log('No')
      const tx = contractWithSigner.denyGoal(owner_address, 0);
      alert("Denied goal");
    } catch (error) {
      console.error(error);
      alert("Error marking goal as completed");
    }
  }
  // Implement goal validation logic here
  
}

function supportGoal(goalId) {
  // Implement goal support logic here
  console.log(`Supporting goal ${goalId}`);
}

document
  .getElementById("fetchGoalsButton")
  .addEventListener("click", fetchGoals);
