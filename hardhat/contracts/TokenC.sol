// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";

contract TokenC is ERC20, Ownable, ERC20Permit {
    constructor() ERC20("TokenC", "TC") ERC20Permit("TokenC") {}

    function mint(address to, uint256 value) public onlyOwner {
        _mint(to, value);
    }

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public virtual override returns (bool) {
        revert();
    }
}
