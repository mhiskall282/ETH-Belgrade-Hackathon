// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/RandomnessGame.sol";

contract MockVRFCoordinator {
    function requestRandomWords(
        bytes32, // keyHash
        uint64,  // subId
        uint16,  // requestConfirmations
        uint32,  // callbackGasLimit
        uint32   // numWords
    ) external pure returns (uint256) {
        return 1; // Mock request ID
    }
}

contract RandomnessGameTest is Test {
    RandomnessGame game;
    MockVRFCoordinator mockCoordinator;

    function setUp() public {
        mockCoordinator = new MockVRFCoordinator();
        game = new RandomnessGame(address(mockCoordinator), bytes32("key"), 1);
    }

    function testOwnerSetCorrectly() public view {
        assertEq(game.s_owner(), address(this));
    }

    function testRequestRandomWords() public {
        game.requestRandomWords();
        assertEq(game.s_requestId(), 1);
    }
}
