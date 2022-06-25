// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract WakandaToken is ERC20 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC20("WakandaToken", "WKND") {}

    function createNewToken(address _address) public {
        _tokenIds.increment();
        _mint(_address, 1 * 10**decimals());
    }

    function getTokenBalance() public view returns (uint256) {
        return balanceOf(msg.sender);
    }
}
