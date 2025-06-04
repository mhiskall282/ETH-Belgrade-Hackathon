// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/YieldVault.sol";

contract YieldVaultTest is Test {
    YieldVault vault;

    function setUp() public {
        vault = new YieldVault();
    }

    function testDepositAndYield() public {
        vault.deposit{value: 1 ether}();
        vault.simulateYield();
        uint256 balance = vault.balances(address(this));
        assertGt(balance, 1 ether); // Expect increased
    }
}
