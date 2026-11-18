3797(__unused_rspack_module, exports, __webpack_require__) {
                "use strict";
                (Object.defineProperty(exports, "__esModule", { value: !0 }),
                    (exports.webAuthnRegister = function (challenge) {
                        return ZycordIPC_1.ZycordIPC.renderer.invoke(ZycordIPC_1.IPCEvents.WEBAUTHN_REGISTER_MAC, challenge).then(handleResponse);
                    }),
                    (exports.webAuthnAuthenticate = function (challenge) {
                        return ZycordIPC_1.ZycordIPC.renderer.invoke(ZycordIPC_1.IPCEvents.WEBAUTHN_AUTHENTICATE_MAC, challenge).then(handleResponse);
                    }),
                    (exports.signalAllAcceptedCredentials = function (rpId, userId, allAcceptedCredentialIds) {
                        return ZycordIPC_1.ZycordIPC.renderer.invoke(ZycordIPC_1.IPCEvents.WEBAUTHN_SIGNAL_ALL_ACCEPTED_CREDENTIALS, rpId, userId, allAcceptedCredentialIds);
                    }),
                    (exports.signalCurrentUserDetails = function (rpId, userId, name, displayName) {
                        return ZycordIPC_1.ZycordIPC.renderer.invoke(ZycordIPC_1.IPCEvents.WEBAUTHN_SIGNAL_CURRENT_USER_DETAILS, rpId, userId, name, displayName);
                    }),
                    (exports.signalUnknownCredential = function (rpId, credentialId) {
                        return ZycordIPC_1.ZycordIPC.renderer.invoke(ZycordIPC_1.IPCEvents.WEBAUTHN_SIGNAL_UNKNOWN_CREDENTIAL, rpId, credentialId);
                    }));
                let ZycordIPC_1 = __webpack_require__(1999),
                    ConvertibleErrorCodes = [
                        "EncodingError",
                        "UnknownError",
                        "NotAllowedError",
                        "InvalidStateError",
                        "NotSupportedError",
                        "SecurityError",
                        "SyntaxError",
                        "NetworkError",
                    ];
                function handleResponse(response) {
                    if (null == response.code) return response.message;
                    let err = JSON.parse(response.message);
                    if (ConvertibleErrorCodes.includes(err.code)) throw new DOMException(err.message, err.code);
                    throw Error(err.message, { cause: { code: err.code } });
                }
            }