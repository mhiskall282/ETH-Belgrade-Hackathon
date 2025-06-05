//SPDX-License-Identifier:MIT

pragma solidity 0.8.26;
import{Structss} from "../DataTypes/Structs.sol";
import{ErrorLib} from "../DataTypes/Errors.sol";
import{Manager} from "../src/Core/manager.sol";
contract Entry{

Structss.UserInfoMation infoForUser;
mapping(address => infoForUser) private userStuff;

 function registerUser(bool enterMarket) public{
    require(userStuff[msg.sender].mAddr == address(0), ErrorLib.Entry__already_Registered());
    address _mAddr = activate(msg.sender);

    userStuff[msg.sender] = infoForUser({
        mAddr: _mAddr,
        balance:0,
        tokenBalance:0
    });

    if(enterMarket){

    }

 } 



 function enterMarket(uint256 ) public{

 }



////Withdraw all funds from yield sources and swap for token
 function existMarket() public{

 }


function activate(address UserAdminAddress)  internal returns(address mAddr){
      mAddr = Clones.clone(manager(UserAdminAddress));
      return mAddr;

}



}