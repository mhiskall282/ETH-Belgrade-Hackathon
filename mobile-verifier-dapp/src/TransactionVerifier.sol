// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TransactionVerifier {
    struct Tx {
        uint256 timestamp;
        address user;
        string txType; // deposit, withdrawal
        string vendor;
        uint256 amount;
    }

    Tx[] public transactions;

    function logTx(string calldata _type, string calldata _vendor, uint256 _amount) external {
        transactions.push(Tx(block.timestamp, msg.sender, _type, _vendor, _amount));
    }

    function getUserTxCount(address user) external view returns (uint256 count) {
        for (uint i = 0; i < transactions.length; i++) {
            if (transactions[i].user == user) count++;
        }
    }
}
