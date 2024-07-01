import { contractABI_JS } from "./Accountability_ABI.js";

let accounts = []; // Empty array to be filled once Metamask is called.
document.getElementById("enableEthereumButton").innerHTML =
  "Connect MetaMask 🦊";

const provider = new ethers.providers.Web3Provider(window.ethereum);
const contractAddress_JS = "0xCe758d0d731b069cD7Ed0aC25E4D4e9F003f0A6c";
// import contract_abi from "./contract_abi.js";
// console.log(contract_abi);

const contractDefined_JS = new ethers.Contract(
  contractAddress_JS,
  contractABI_JS,
  provider
);

document.getElementById("setGoalButton").addEventListener("click", async () => {
  console.log("setGoalButton clicked", contractABI_JS)
  const description = document.getElementById("goalDescription").value;
  const deadline =
    new Date(document.getElementById("goalDeadline").value).getTime() / 1000;
  const validator = document.getElementById("goalValidator").value;
  const amount = document.getElementById("goalAmount").value;
console.log('sdf:', contractDefined_JS)
  if (!description || !deadline || !validator || !amount) {

    alert("Please fill all fields");
    return;
  }


  const signer = await provider.getSigner();
  const contractWithSigner = contractDefined_JS.connect(signer);

  try {
    const tx = await contractWithSigner.createGoal(
      description,
      deadline,
      validator,
      { value: ethers.utils.parseEther(amount) }
    );
    await tx.wait();
    alert("Goal set successfully");
    generateAutomatedMessage(description, validator);
  } catch (error) {
    console.error(error);
    alert("Error setting goal");
  }
});

function generateAutomatedMessage(description, validator) {
  const message = `Hey! I just used your address to validate my goal: "${description}". Thank you for being my validator!`;
  document.getElementById("automatedMessage").innerText = message;
  navigator.clipboard.writeText(message).then(
    () => {
      alert("Message copied to clipboard");
    },
    () => {
      alert("Failed to copy message to clipboard");
    }
  );
}

function detectMetamaskInstalled() {
  if (typeof window.ethereum === "undefined") {
    alert("MetaMask is not detected. Please install MetaMask.");
  }
}

detectMetamaskInstalled();
