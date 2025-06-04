// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/UserProfile.sol";

contract UserProfileTest is Test {
    UserProfile userProfile;

    function setUp() public {
        userProfile = new UserProfile();
    }

    function testRegisterAndCheckUser() public {
        userProfile.register("0551234567");
        bool registered = userProfile.isUserRegistered(address(this));
        assertTrue(registered);
    }
}
