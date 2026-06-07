const RECEIVER_WALLET = "0xC8B09e2610C8218A7887A70d691f743b4b635332";

async function connectWallet() {
  if (!window.ethereum) {
    alert("Please install MetaMask first.");
    return;
  }

  try {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts"
    });

    await switchToSepolia();

    document.querySelectorAll(".connect-wallet").forEach((btn) => {
      btn.innerText = accounts[0].slice(0, 6) + "..." + accounts[0].slice(-4);
    });

    alert("Wallet connected successfully.");
  } catch (error) {
    alert("Wallet connection failed.");
  }
}

async function switchToSepolia() {
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0xaa36a7" }]
    });
  } catch (error) {
    if (error.code === 4902) {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: "0xaa36a7",
            chainName: "Sepolia Test Network",
            nativeCurrency: {
              name: "Sepolia ETH",
              symbol: "ETH",
              decimals: 18
            },
            rpcUrls: ["https://ethereum-sepolia-rpc.publicnode.com"],
            blockExplorerUrls: ["https://sepolia.etherscan.io"]
          }
        ]
      });
    }
  }
}

async function payDigitalCard() {
  await sendPayment("0.003", "Digital Credit Card payment successful.");
}

async function payPhysicalCard() {
  await sendPayment("0.036", "Physical Crypto Card advance booking successful.");
}

async function sendPayment(amountEth, successMessage) {
  if (!window.ethereum) {
    alert("Please install MetaMask first.");
    return;
  }

  try {
    await switchToSepolia();

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts"
    });

    const value =
      "0x" + BigInt(Math.floor(Number(amountEth) * 1e18)).toString(16);

    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [
        {
          from: accounts[0],
          to: RECEIVER_WALLET,
          value: value
        }
      ]
    });

    alert(successMessage + "\n\nTransaction Hash:\n" + txHash);
  } catch (error) {
    alert("Payment failed or cancelled.");
  }
}
