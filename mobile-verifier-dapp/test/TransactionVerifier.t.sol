// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/TransactionVerifier.sol";

contract TransactionVerifierTest is Test {
    TransactionVerifier txVerifier;

    function setUp() public {
        txVerifier = new TransactionVerifier();
    }

    function testLogTxAndCount() public {
        txVerifier.logTx("withdrawal", "vendor1", 1000);
        uint256 count = txVerifier.getUserTxCount(address(this));
        assertEq(count, 1);
    }
}
