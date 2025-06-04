// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract YieldVault {
    mapping(address => uint256) public balances;

    function deposit() external payable {
        balances[msg.sender] += msg.value;
    }

    function simulateYield() external {
        // simulate 5% yield increase
        balances[msg.sender] = balances[msg.sender] * 105 / 100;
    }

    function withdraw() external {
        uint256 amt = balances[msg.sender];
        balances[msg.sender] = 0;
        payable(msg.sender).transfer(amt);
    }

    receive() external payable {}
}
