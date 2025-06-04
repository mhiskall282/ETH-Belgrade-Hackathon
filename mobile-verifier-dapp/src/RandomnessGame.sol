// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@chainlink/contracts/src/v0.8/vrf/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol";

contract RandomnessGame is VRFConsumerBaseV2 {
    VRFCoordinatorV2Interface COORDINATOR;
    uint64 public s_subscriptionId;
    bytes32 public s_keyHash;
    uint32 public callbackGasLimit = 100000;
    uint16 public requestConfirmations = 3;
    uint32 public numWords = 1;

    address public s_owner;
    uint256 public s_randomWord;
    uint256 public s_requestId;

    constructor(
        address vrfCoordinator,
        bytes32 keyHash,
        uint64 subscriptionId
    ) VRFConsumerBaseV2(vrfCoordinator) {
        COORDINATOR = VRFCoordinatorV2Interface(vrfCoordinator);
        s_keyHash = keyHash;
        s_subscriptionId = subscriptionId;
        s_owner = msg.sender;
    }

    function requestRandomWords() external onlyOwner {
        s_requestId = COORDINATOR.requestRandomWords(
            s_keyHash,
            s_subscriptionId,
            requestConfirmations,
            callbackGasLimit,
            numWords
        );
    }

    function fulfillRandomWords(
        uint256, /* requestId */
        uint256[] memory randomWords
    ) internal override {
        s_randomWord = randomWords[0];
    }

    modifier onlyOwner() {
        require(msg.sender == s_owner, "Not owner");
        _;
    }
}