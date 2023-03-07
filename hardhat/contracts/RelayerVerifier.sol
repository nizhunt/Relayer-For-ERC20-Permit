// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract RelayerVerifier is EIP712 {
    using Counters for Counters.Counter;

    mapping(address => Counters.Counter) private _nonces;

    // solhint-disable-next-line var-name-mixedcase
    bytes32 private constant _TYPEHASH =
        keccak256(
            "RelayerVerification(address sender,address receiver,address forwarder,address token,uint256 value,uint256 nonce,uint256 deadline)"
        );

    constructor() EIP712("RelayerVerification", "1") {}

    function relayerVerification(
        address sender,
        address receiver,
        address token,
        uint256 value,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public virtual {
        require(
            block.timestamp <= deadline,
            "RelayerVerifier: expired deadline"
        );

        bytes32 structHash = keccak256(
            abi.encode(
                _TYPEHASH,
                sender,
                receiver,
                address(this),
                token,
                value,
                _useNonce(sender),
                deadline
            )
        );

        bytes32 hash = _hashTypedDataV4(structHash);

        address signer = ECDSA.recover(hash, v, r, s);
        require(signer == sender, "RelayerVerification: invalid signature");
    }

    function nonces(address owner) public view virtual returns (uint256) {
        return _nonces[owner].current();
    }

    // solhint-disable-next-line func-name-mixedcase
    function DOMAIN_SEPARATOR() external view returns (bytes32) {
        return _domainSeparatorV4();
    }

    function _useNonce(
        address owner
    ) internal virtual returns (uint256 current) {
        Counters.Counter storage nonce = _nonces[owner];
        current = nonce.current();
        nonce.increment();
    }
}
