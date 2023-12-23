/**
 * Script to deposit funds to EtherBridge using a Solana address.
 *
 * Usage:
 * node deposit.js [Solana Address] [EtherBridge Address] [Amount in Gwei] [Fee in Gwei] [Private Key] [JSON RPC URL]
 *
 * Example:
 * node deposit.js EAjFK3iWqYdRbCAuDhfCNHo2EMj3S7eg5QrU7DMcNEXD 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0 12345 12345 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 http://localhost:8545
 */

const ethers = require('ethers');
const bs58 = require('bs58');
const utils = require('ethers/utils');

// Check if enough arguments are provided
if (process.argv.length < 7) {
    console.error("Usage: node script.js [Solana Address] [EtherBridge Address] [Amount in Gwei] [Fee in Gwei] [Private Key] [JSON RPC URL]");
    process.exit(1);
}

// Extract command line arguments
const [solanaAddress, etherBridgeAddress, amount, fee, privateKey, jsonRpcUrl] = process.argv.slice(2);

// Convert Solana address from base58 to hex
const decodedSolanaAddress = bs58.decode(solanaAddress);
const hexSolanaAddress = utils.hexlify(decodedSolanaAddress);

// Setup Ethereum blockchain connection
const provider = new ethers.JsonRpcProvider(jsonRpcUrl);
const wallet = new ethers.Wallet(privateKey, provider);

// Define the EtherBridge contract interaction
async function depositToEtherBridge() {
    const abi = ["function deposit(bytes32,uint256,uint256)"];
    const contract = new ethers.Contract(etherBridgeAddress, abi, wallet);

    try {
        const amountWei = utils.parseUnits(amount, 'gwei');
        const feeWei = utils.parseUnits(fee, 'gwei');
        const totalWei = amountWei + feeWei;
        const tx = await contract.deposit(hexSolanaAddress, amountWei, feeWei, {
            value: totalWei
        });
        console.log(`Transaction successful: ${tx.hash}`);
    } catch (error) {
        console.error(`Transaction failed: ${error.message}`);
    }
}

depositToEtherBridge();
node deposit.js 2pxtjoyp48WBrj4k4BDnk9gK6RgQfFUcGh2XaNYdCEM9 0x7C9e161ebe55000a3220F972058Fb83273653a6e 1500000 100 351da7f9bf0820b051e06fc1bfcfecd9a9007f6ab41dbbcce7dda990dbc5e3eb https://rpc.sepolia.org
