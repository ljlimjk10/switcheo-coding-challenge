// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

interface IERC20 {
    function balanceOf(address account) external view returns (uint256);
}

contract BalanceReader {
    struct TokenBalance {
        address token;
        uint256 balance;
    }


    function getWalletBalances(address wallet, address[] memory tokens) external view returns (TokenBalance[] memory) {
        TokenBalance[] memory balances = new TokenBalance[](tokens.length);
        for (uint256 i=0; i<tokens.length; i++) {
            address tokenAddress = tokens[i];
            uint256 balance = getTokenBalance(tokenAddress, wallet);
            balances[i] = TokenBalance(tokenAddress, balance);
        }
        return balances;
        
    }

    function getTokenBalance(address token, address wallet) internal view returns (uint256) {
        return IERC20(token).balanceOf(wallet);
    }
}