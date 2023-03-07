// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface ForwarderDatatype {
    struct PaymentInput {
        address sender;
        address receiver;
        uint256 value;
        uint256 deadline;
        address token;
        /* ERC20 Permit Signature */
        uint8 v1;
        bytes32 r1;
        bytes32 s1;
        /* Relayer verification signature */
        uint8 v2;
        bytes32 r2;
        bytes32 s2;
    }

    event PermitSucceeded(PaymentInput);
    event PermitFailed(PaymentInput);

    event TransferSucceeded(PaymentInput);
    event TransferFailed(PaymentInput);
}
