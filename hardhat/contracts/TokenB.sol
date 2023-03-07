// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";

contract TokenB is ERC20, Ownable, ERC20Permit {
    constructor() ERC20("TokenB", "TB") ERC20Permit("TokenB") {
        address[3] memory airdrop = [
            0x2546BcD3c84621e976D8185a91A922aE77ECEc30,
            0xbDA5747bFD65F08deb54cb465eB87D40e51B197E,
            0xdD2FD4581271e230360230F9337D5c0430Bf44C0
        ];
        for (uint i = 0; i < airdrop.length; i++) {
            _mint(airdrop[i], 100 * 10 ** decimals());
        }
    }

    function mint(address to, uint256 value) public onlyOwner {
        _mint(to, value);
    }
}
