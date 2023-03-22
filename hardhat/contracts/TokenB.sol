// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";

contract TokenB is ERC20, Ownable, ERC20Permit {
    constructor() ERC20("TokenB", "TB") ERC20Permit("TokenB") {
        address airdrop = 0x0B950D128F6a33651257F95cbAF59c02b7F6019F;
        _mint(airdrop, 100 * 10 ** decimals());
    }

    function mint(address to, uint256 value) public onlyOwner {
        _mint(to, value);
    }
}
