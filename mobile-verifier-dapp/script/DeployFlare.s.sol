// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/RandomnessGame.sol";
import "../src/TransactionVerifier.sol";
import "../src/UserProfile.sol";
import "../src/VendorRegistry.sol";
import "../src/YieldVault.sol";

contract DeployFlareScript is Script {
    // Flare VRF Coordinator addresses
    address constant FLARE_VRF_COORDINATOR = 0x0000000000000000000000000000000000000000; // Replace with actual address
    bytes32 constant FLARE_KEY_HASH = 0x0000000000000000000000000000000000000000000000000000000000000000; // Replace with actual key hash
    uint64 constant FLARE_SUBSCRIPTION_ID = 0; // Replace with your subscription ID

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Deploy RandomnessGame
        RandomnessGame randomnessGame = new RandomnessGame(
            FLARE_VRF_COORDINATOR,
            FLARE_KEY_HASH,
            FLARE_SUBSCRIPTION_ID
        );

        // Deploy TransactionVerifier
        TransactionVerifier transactionVerifier = new TransactionVerifier();

        // Deploy UserProfile
        UserProfile userProfile = new UserProfile();

        // Deploy VendorRegistry
        VendorRegistry vendorRegistry = new VendorRegistry();

        // Deploy YieldVault
        YieldVault yieldVault = new YieldVault();

        vm.stopBroadcast();

        // Log deployed addresses
        console.log("RandomnessGame deployed to:", address(randomnessGame));
        console.log("TransactionVerifier deployed to:", address(transactionVerifier));
        console.log("UserProfile deployed to:", address(userProfile));
        console.log("VendorRegistry deployed to:", address(vendorRegistry));
        console.log("YieldVault deployed to:", address(yieldVault));
    }
}