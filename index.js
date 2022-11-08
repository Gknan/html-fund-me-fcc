// use import, require does not work
// https://docs.ethers.io/v5/getting-started/#installing
import { ethers } from "./ethers.5.6.js"

import { abi, contractAddress } from "./constants.js"

const connectBtn = document.getElementById("connectBtn")
const fundBtn = document.getElementById("fundBtn")
const balanceBtn = document.getElementById("balanceBtn")
const withdrawBtn = document.getElementById("withdrawBtn")
connectBtn.onclick = connect
fundBtn.onclick = fund
balanceBtn.onclick = getBalance
withdrawBtn.onclick = withdraw

async function connect() {
    if (typeof window.ethereum !== "undefined") {
        window.ethereum.request({ method: "eth_requestAccounts" })
        connectBtn.innerHTML = "Connected"
        console.log("connected")
    } else {
        connectBtn.innerHTML = "Please install Metamask"
        console.log("no metamask")
    }
}

async function fund() {
    const ethAmount = document.getElementById("ethAmount").value
    console.log(`Funding with ${ethAmount}...`)
    if (typeof window.ethereum !== "undefined") {
        // provider / connection to the blockchain
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        console.log(signer)
        const contract = new ethers.Contract(contractAddress, abi, signer) //
        // signer / wallet / someone with some gas
        // contract that we are interacting with
        // ABI & interface
        try {
            const trasactionResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount),
            })
            // listen for the tx to be mined, wait for tx complete
            // listen for an event
            await listenForTransactionMinne(trasactionResponse, provider)
            console.log("Done!")
        } catch (error) {
            console.log(error)
        }
    }
}

function listenForTransactionMinne(trasactionResponse, provider) {
    console.log(`Mining ${trasactionResponse.hash}...`)
    // return new Promise()
    // listen for this tx to finish
    // wait listener finished, how ? use promise
    return new Promise((resolve, reject) => {
        provider.once(trasactionResponse.hash, (transactionReciept) => {
            console.log(
                `Completed with ${transactionReciept.confirmations} confirmations`
            )
            resolve()
        })
    })
}

async function getBalance() {
    if (typeof window.ethereum != "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        console.log(ethers.utils.formatEther(balance))
    }
}

// fund function

// withraw
async function withdraw() {
    if (typeof window.ethereum !== "undefined") {
        console.log("Withdrawing...")
        // provider / connection to the blockchain
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer) //
        // signer / wallet / someone with some gas
        // contract that we are interacting with
        // ABI & interface
        try {
            const trasactionResponse = await contract.withdraw()
            // listen for the tx to be mined, wait for tx complete
            // listen for an event
            await listenForTransactionMinne(trasactionResponse, provider)
            console.log("Withdraw Done!")
        } catch (error) {
            console.log(error)
        }
    }
}
