// metaMask.js

async function connectMetaMask() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  try {
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const userAddress = await signer.getAddress();
    document.getElementById("enableEthereumButton").innerText =
      userAddress.substr(0, 5) + "..." + userAddress.substr(-4);
  } catch (error) {
    console.error(error);
  }
}

async function checkMetaMaskConnection() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  try {
    const accounts = await provider.listAccounts();
    if (accounts.length > 0) {
      const userAddress = accounts[0];
      document.getElementById("enableEthereumButton").innerText =
        userAddress.substr(0, 5) + "..." + userAddress.substr(-4);
    } else {
      document.getElementById("enableEthereumButton").innerText =
        "Connect Wallet";
    }
  } catch (error) {
    console.error(error);
  }
}

document
  .getElementById("enableEthereumButton")
  .addEventListener("click", connectMetaMask);

window.addEventListener("load", checkMetaMaskConnection);
