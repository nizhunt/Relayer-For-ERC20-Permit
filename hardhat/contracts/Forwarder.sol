// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./IToken.sol";
import "./ForwarderDatatype.sol";
import "./RelayerVerifier.sol";

contract Forwarder is ForwarderDatatype, RelayerVerifier {
    function payViaSignature(PaymentInput[] calldata paymentInputs) external {
        for (uint i = 0; i < paymentInputs.length; ) {
            PaymentInput memory paymentInput = paymentInputs[i];

            relayerVerification(
                paymentInput.sender,
                paymentInput.receiver,
                paymentInput.token,
                paymentInput.value,
                paymentInput.deadline,
                paymentInput.v2,
                paymentInput.r2,
                paymentInput.s2
            );

            permitAndTransfer(paymentInput);

            // @optimization using unchecked in loop
            unchecked {
                i++;
            }
        }
    }

    function permitAndTransfer(PaymentInput memory paymentInput) internal {
        IToken token = IToken(paymentInput.token);

        try
            token.permit(
                paymentInput.sender,
                address(this),
                paymentInput.value,
                paymentInput.deadline,
                paymentInput.v1,
                paymentInput.r1,
                paymentInput.s1
            )
        {
            emit PermitSucceeded(paymentInput);
        } catch {
            emit PermitFailed(paymentInput);
        }

        try
            token.transferFrom{gas: 100000}(
                paymentInput.sender,
                paymentInput.receiver,
                paymentInput.value
            )
        returns (bool success) {
            if (success) {
                emit TransferSucceeded(paymentInput);
            } else {
                emit TransferFailed(paymentInput);
            }
        } catch {
            emit TransferFailed(paymentInput);
        }
    }
}
