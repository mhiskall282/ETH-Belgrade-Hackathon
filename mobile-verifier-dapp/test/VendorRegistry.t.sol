// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/VendorRegistry.sol";

contract VendorRegistryTest is Test {
    VendorRegistry registry;

    function setUp() public {
        registry = new VendorRegistry();
    }

    function testRegisterAndGetVendor() public {
        registry.registerVendor("vendor1", address(0x123));
        address vendor = registry.getVendorAddress("vendor1");
        assertEq(vendor, address(0x123));
    }
}
