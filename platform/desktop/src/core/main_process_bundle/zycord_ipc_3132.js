3132(__unused_rspack_module, exports, __webpack_require__) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: !0 });
                let electron = __webpack_require__(1288),
                    ZycordIPC_1 = __webpack_require__(1999),
                    _learnedWords = new Set(),
                    _hasLoadedLearnedWords = !1;
                (ZycordIPC_1.ZycordIPC.main.handle(
                    ZycordIPC_1.IPCEvents.SPELLCHECK_REPLACE_MISSPELLING,
                    (event, correction) => (event.sender.replaceMisspelling(correction), Promise.resolve()),
                ),
                    ZycordIPC_1.ZycordIPC.main.handle(ZycordIPC_1.IPCEvents.SPELLCHECK_GET_AVAILABLE_DICTIONARIES, (_) =>
                        Promise.resolve(electron.session.defaultSession.availableSpellCheckerLanguages),
                    ),
                    ZycordIPC_1.ZycordIPC.main.handle(ZycordIPC_1.IPCEvents.SPELLCHECK_SET_LOCALE, (_, locale) => {
                        try {
                            electron.session.defaultSession.setSpellCheckerLanguages([locale]);
                        } catch (_) {
                            console.error(`Failed to set the spellcheck locale: ${locale}`);
                        }
                        return Promise.resolve();
                    }),
                    ZycordIPC_1.ZycordIPC.main.handle(ZycordIPC_1.IPCEvents.SPELLCHECK_SET_LANGUAGES, (_, languages) => {
                        try {
                            electron.session.defaultSession.setSpellCheckerLanguages([...languages]);
                        } catch (_) {
                            return (console.error(`Failed to set spellcheck languages: ${languages.join(", ")}`), Promise.resolve(!1));
                        }
                        return Promise.resolve(!0);
                    }),
                    electron.session.defaultSession.on("spellcheck-dictionary-download-failure", (_event, languageCode) => {
                        console.error(`Failed to download spellcheck dictionary: ${languageCode}`);
                    }),
                    electron.session.defaultSession.on("spellcheck-dictionary-download-success", (_event, languageCode) => {
                        console.log(`Downloaded spellcheck dictionary: ${languageCode}`);
                    }),
                    ZycordIPC_1.ZycordIPC.main.handle(ZycordIPC_1.IPCEvents.SPELLCHECK_SET_LEARNED_WORDS, async (_, newLearnedWords) => {
                        let session = electron.session.defaultSession;
                        (_hasLoadedLearnedWords || ((_learnedWords = new Set(await session.listWordsInSpellCheckerDictionary())), (_hasLoadedLearnedWords = !0)),
                            _learnedWords.forEach((word) => {
                                newLearnedWords.has(word) || session.removeWordFromSpellCheckerDictionary(word);
                            }),
                            newLearnedWords.forEach((word) => {
                                _learnedWords.has(word) || session.addWordToSpellCheckerDictionary(word);
                            }),
                            (_learnedWords = new Set(newLearnedWords)));
                    }));
            }