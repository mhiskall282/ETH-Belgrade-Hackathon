// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

interface IManager {
    // Functions
    function addwhiteListTokens(address _tokenAddrr) external;
    function addOracle(address _oracleAddress) external;
    function setManager(bytes calldata _manager) external;
    function setMinDeposit(uint256 _min) external;
    function setUserRolesGoverner(bytes calldata _userGov) external;

    // View/Pure functions (if needed you can add)
    function tokenAddressToInfo(address _token) external view returns (uint256 heartbeat, uint256 lastechangeRate);
    function whitelistTokens(address _token) external view returns (bool);
}
