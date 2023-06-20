import { ethers } from "ethers";

const bscUrl = "https://bsc-dataseed1.defibit.io";

const bscNetwork = {
	name: "BSC",
	chainId: 56,
};

const contractABI = ["function balanceOf(address) view returns (uint256)"];

const provider = new ethers.JsonRpcProvider(bscUrl, bscNetwork);

const contract: ethers.ContractInterface = new ethers.Contract(
	"0xc0ecb8499d8da2771abcbf4091db7f65158f1468",
	contractABI,
	provider
);

async function retrieveSpecifiedHoldersOfToken() {
	const specifiedHolders = [
		"0xb5d4f343412dc8efb6ff599d790074d0f1e8d430",
		"0x0020c5222a24e4a96b720c06b803fb8d34adc0af",
		"0xd1d8b2aae2ebb2acf013b803bc3c24ca1303a392",
	];

	for (const specifiedHolder of specifiedHolders) {
		try {
			const balance: ethers.BigNumberish = await contract.balanceOf(
				specifiedHolder
			);
			const holderAndBalance: string =
				specifiedHolder + " " + balance.toString();
			console.log(holderAndBalance);
		} catch (err) {
			console.error(
				`Error retrieving balance for address ${specifiedHolder}:`,
				err
			);
		}
	}
}

retrieveSpecifiedHoldersOfToken();
