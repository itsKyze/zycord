"use strict";
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
(Object.defineProperty(exports, "__esModule", { value: !0 }),
    (exports.on = function (eventName, callback) {
        return (events.on(eventName, callback), () => events.removeListener(eventName, callback));
    }),
    (exports.getAvailableDictionaries = function () {
        return ZycordIPC_1.ZycordIPC.renderer.invoke(ZycordIPC_1.IPCEvents.SPELLCHECK_GET_AVAILABLE_DICTIONARIES);
    }),
    (exports.setLocale = setLocale),
    (exports.setSpellCheckerLanguages = setSpellCheckerLanguages),
    (exports.setLearnedWords = function (learnedWords) {
        return ZycordIPC_1.ZycordIPC.renderer.invoke(ZycordIPC_1.IPCEvents.SPELLCHECK_SET_LEARNED_WORDS, learnedWords);
    }),
    (exports.replaceMisspelling = function (correction) {
        return ZycordIPC_1.ZycordIPC.renderer.invoke(ZycordIPC_1.IPCEvents.SPELLCHECK_REPLACE_MISSPELLING, correction);
    }));
let events_1 = __importDefault(__webpack_require__(4434)),
    ZycordIPC_1 = __webpack_require__(1999),
    events = new events_1.default();
async function setLocale(locale) {
    let succeeded = !0;
    try {
        await ZycordIPC_1.ZycordIPC.renderer.invoke(ZycordIPC_1.IPCEvents.SPELLCHECK_SET_LOCALE, locale);
    } catch (_) {
        succeeded = !1;
    }
    return succeeded;
}
async function setSpellCheckerLanguages(languages) {
    try {
        return await ZycordIPC_1.ZycordIPC.renderer.invoke(ZycordIPC_1.IPCEvents.SPELLCHECK_SET_LANGUAGES, languages);
    } catch (_) {
        return !1;
    }
}
ZycordIPC_1.ZycordIPC.renderer.on(ZycordIPC_1.IPCEvents.SPELLCHECK_RESULT, (_, misspelledWord, dictionarySuggestions) => {
    events.emit("spellcheck-result", misspelledWord, dictionarySuggestions);
});
