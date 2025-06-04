// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract VendorRegistry {
    address public admin;

    constructor() {
        admin = msg.sender;
    }

    mapping(string => address) public verifiedVendors;

    function registerVendor(string calldata vendorID, address wallet) external {
        require(msg.sender == admin, "Only admin");
        verifiedVendors[vendorID] = wallet;
    }

    function getVendorAddress(string calldata vendorID) external view returns (address) {
        return verifiedVendors[vendorID];
    }
}
