"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const bscUrl = "https://bsc-dataseed1.defibit.io";
const bscNetwork = {
    name: "BSC",
    chainId: 56,
};
const contractABI = ["function balanceOf(address) view returns (uint256)"];
const provider = new ethers_1.ethers.JsonRpcProvider(bscUrl, bscNetwork);
const contract = new ethers_1.ethers.Contract("0xc0ecb8499d8da2771abcbf4091db7f65158f1468", contractABI, provider);
function retrieveSpecifiedHoldersOfToken() {
    return __awaiter(this, void 0, void 0, function* () {
        const specifiedHolders = [
            "0xb5d4f343412dc8efb6ff599d790074d0f1e8d430",
            "0x0020c5222a24e4a96b720c06b803fb8d34adc0af",
            "0xd1d8b2aae2ebb2acf013b803bc3c24ca1303a392",
        ];
        for (const specifiedHolder of specifiedHolders) {
            try {
                const balance = yield contract.balanceOf(specifiedHolder);
                const holderAndBalance = specifiedHolder + " " + balance.toString();
                console.log(holderAndBalance);
            }
            catch (err) {
                console.error(`Error retrieving balance for address ${specifiedHolder}:`, err);
            }
        }
    });
}
retrieveSpecifiedHoldersOfToken();
