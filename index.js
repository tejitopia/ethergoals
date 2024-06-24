detectMetamaskInstalled(); // When the page is opened check for error handling issues.

let accounts = []; // Empty array to be filled once Metamask is called.
document.getElementById("enableEthereumButton").innerHTML =
  "Connect MetaMask 🦊";

const sepoliaChainId = 11155111;

const provider = new ethers.providers.Web3Provider(window.ethereum);

const contractAddress_JS = "0xBBE97Afb978E19033e0BDa692E6034F5b3B91312";
const contractABI_JS = [
  {
    anonymous: false,
    inputs: [],
    name: "setEvent",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_description",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_deadline",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_validator",
        type: "address",
      },
    ],
    name: "setGoal",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "completeGoal",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_user",
        type: "address",
      },
    ],
    name: "approveGoal",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "storedData",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const contractDefined_JS = new ethers.Contract(
  contractAddress_JS,
  contractABI_JS,
  provider
);

document.getElementById("setGoalButton").addEventListener("click", async () => {
  const description = document.getElementById("goalDescription").value;
  const deadline =
    new Date(document.getElementById("goalDeadline").value).getTime() / 1000;
  const validator = document.getElementById("goalValidator").value;
  const amount = document.getElementById("goalAmount").value;

  if (!description || !deadline || !validator || !amount) {
    alert("Please fill all fields");
    return;
  }

  const signer = provider.getSigner();
  const contractWithSigner = contractDefined_JS.connect(signer);

  try {
    const tx = await contractWithSigner.setGoal(
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

document
  .getElementById("completeGoalButton")
  .addEventListener("click", async () => {
    const signer = provider.getSigner();
    const contractWithSigner = contractDefined_JS.connect(signer);

    try {
      const tx = await contractWithSigner.completeGoal();
      await tx.wait();
      alert("Goal marked as completed");
    } catch (error) {
      console.error(error);
      alert("Error marking goal as completed");
    }
  });

document
  .getElementById("approveGoalButton")
  .addEventListener("click", async () => {
    const userAddress = document.getElementById("userAddress").value;

    if (!userAddress) {
      alert("Please enter the user address");
      return;
    }

    const signer = provider.getSigner();
    const contractWithSigner = contractDefined_JS.connect(signer);

    try {
      const tx = await contractWithSigner.approveGoal(userAddress);
      await tx.wait();
      alert("Goal approved");
    } catch (error) {
      console.error(error);
      alert("Error approving goal");
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

async function getAccount() {
  accounts = await ethereum.request({ method: "eth_requestAccounts" });
  const signer = provider.getSigner();
  document.getElementById("enableEthereumButton").innerText =
    accounts[0].substr(0, 5) + "..." + accounts[0].substr(38, 4);
}

async function enableMetamaskOnSepolia() {
  await getAccount();
  if (window.ethereum.networkVersion != sepoliaChainId) {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0xaa36a7" }],
      });
      location.reload();
    } catch (error) {
      alert("Failed to switch to Sepolia testnet. Add the network manually.");
    }
  }
}

function detectMetamaskInstalled() {
  try {
    ethereum.isMetaMask;
  } catch (missingMetamask) {
    alert(
      "Metamask not detected in browser! Install Metamask browser extension, then refresh page!"
    );
  }
}

async function getChainIdConnected() {
  const connectedNetworkObject = await provider.getNetwork();
  const chainIdConnected = connectedNetworkObject.chainId;
  return chainIdConnected;
}
