// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract UserProfile {
    struct User {
        address userAddress;
        string phoneNumber;
        bool isRegistered;
    }

    mapping(address => User) public users;

    function register(string calldata phoneNumber) external {
        require(!users[msg.sender].isRegistered, "Already registered");
        users[msg.sender] = User(msg.sender, phoneNumber, true);
    }

    function isUserRegistered(address user) external view returns (bool) {
        return users[user].isRegistered;
    }
}
