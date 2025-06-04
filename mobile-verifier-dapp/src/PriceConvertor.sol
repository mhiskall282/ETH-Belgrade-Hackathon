// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface AggregatorV3Interface {
    function latestRoundData()
        external
        view
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        );
}

contract PriceConverter {
    AggregatorV3Interface internal priceFeed;

    constructor(address _priceFeed) {
        priceFeed = AggregatorV3Interface(_priceFeed);
    }

    function getLatestPrice() public view returns (int256) {
        (
            ,
            int256 answer,
            ,
            ,
            
        ) = priceFeed.latestRoundData();
        return answer; // e.g. 2000.00000000 (1e8 scaled)
    }

    function convertFiatToCrypto(uint256 fiatAmountInUSD) public view returns (uint256) {
        int256 price = getLatestPrice(); // USD price of 1 ETH
        require(price > 0, "Invalid price feed value");

        // Convert to ETH: (fiat * 1e18) / price
        return (fiatAmountInUSD * 1e18) / uint256(price);
    }
}
