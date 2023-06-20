const { ethers } = require("ethers");

const ADDR = "0x7DEA24571f7b56d80aECDdeB1c0d71b0fdD772c9"; // Your deployed contract address
const ABI = [
	{
		inputs: [
			{
				internalType: "address",
				name: "wallet",
				type: "address",
			},
			{
				internalType: "address[]",
				name: "tokens",
				type: "address[]",
			},
		],
		name: "getWalletBalances",
		outputs: [
			{
				components: [
					{
						internalType: "address",
						name: "token",
						type: "address",
					},
					{
						internalType: "uint256",
						name: "balance",
						type: "uint256",
					},
				],
				internalType: "struct BalanceReader.TokenBalance[]",
				name: "",
				type: "tuple[]",
			},
		],
		stateMutability: "view",
		type: "function",
	},
];

const ADDRESS = "0x8ca1Efa1e5E8992a24Fe9D8dB5EA5eAa7930b195"; // Some wallet address with token balance
const TOKENS = [
	// Token contract addresses
	"0x779877A7B0D9E8603169DdbD7836e478b4624789",
];

// You can use your own RPC provider url (no need to deploy to mainnet)
const provider = ethers.getDefaultProvider();

const test = async () => {
	const contract = new ethers.Contract(ADDR, ABI, provider);

	const [tokenAddresses, balances] = await contract.getWalletBalances(
		ADDRESS,
		TOKENS
	);

	let walletBalances = tokenAddresses.map((address, index) => {
		return {
			token: address,
			balance: balances[index],
		};
	});

	return walletBalances;
};

test().then(console.log);
