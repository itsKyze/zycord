6773(__unused_rspack_module, exports) {
                function isContentMedia(part) {
                    var part1, part2, part3, part4, part5, part6, part7, part8;
                    return (
                        !!part &&
                        "object" == typeof part &&
                        (("type" in (part1 = part) && "string" == typeof part1.type && "source" in part1 && isContentMedia(part1.source)) ||
                            hasInlineData(part) ||
                            ("image_url" in (part2 = part) && ("string" == typeof part2.image_url ? part2.image_url.startsWith("data:") : hasNestedImageUrl(part2))) ||
                            hasInputAudio(part) ||
                            hasFileData(part) ||
                            ("media_type" in (part3 = part) && "string" == typeof part3.media_type && "data" in part3) ||
                            ("type" in (part4 = part) &&
                                "file" === part4.type &&
                                "mediaType" in part4 &&
                                "string" == typeof part4.mediaType &&
                                "data" in part4 &&
                                "string" == typeof part4.data &&
                                !part4.data.startsWith("http://") &&
                                !part4.data.startsWith("https://")) ||
                            ("type" in (part5 = part) &&
                                "image" === part5.type &&
                                "image" in part5 &&
                                "string" == typeof part5.image &&
                                !part5.image.startsWith("http://") &&
                                !part5.image.startsWith("https://")) ||
                            ("type" in (part6 = part) && ("blob" === part6.type || "base64" === part6.type)) ||
                            "b64_json" in part ||
                            ("type" in (part7 = part) && "result" in part7 && "image_generation" === part7.type) ||
                            ("uri" in (part8 = part) && "string" == typeof part8.uri && part8.uri.startsWith("data:")))
                    );
                }
                function hasNestedImageUrl(part) {
                    return (
                        "image_url" in part &&
                        !!part.image_url &&
                        "object" == typeof part.image_url &&
                        "url" in part.image_url &&
                        "string" == typeof part.image_url.url &&
                        part.image_url.url.startsWith("data:")
                    );
                }
                function hasInlineData(part) {
                    return "inlineData" in part && !!part.inlineData && "object" == typeof part.inlineData && "data" in part.inlineData && "string" == typeof part.inlineData.data;
                }
                function hasInputAudio(part) {
                    return (
                        "type" in part &&
                        "input_audio" === part.type &&
                        "input_audio" in part &&
                        !!part.input_audio &&
                        "object" == typeof part.input_audio &&
                        "data" in part.input_audio &&
                        "string" == typeof part.input_audio.data
                    );
                }
                function hasFileData(part) {
                    return (
                        "type" in part &&
                        "file" === part.type &&
                        "file" in part &&
                        !!part.file &&
                        "object" == typeof part.file &&
                        "file_data" in part.file &&
                        "string" == typeof part.file.file_data
                    );
                }
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let REMOVED_STRING = "[Blob substitute]",
                    MEDIA_FIELDS = ["image_url", "data", "content", "b64_json", "result", "uri", "image"];
                ((exports.isContentMedia = isContentMedia),
                    (exports.stripInlineMediaFromSingleMessage = function stripInlineMediaFromSingleMessage(part) {
                        let strip = { ...part };
                        for (let field of (isContentMedia(strip.source) && (strip.source = stripInlineMediaFromSingleMessage(strip.source)),
                        hasInlineData(part) && (strip.inlineData = { ...part.inlineData, data: REMOVED_STRING }),
                        hasNestedImageUrl(part) && (strip.image_url = { ...part.image_url, url: REMOVED_STRING }),
                        hasInputAudio(part) && (strip.input_audio = { ...part.input_audio, data: REMOVED_STRING }),
                        hasFileData(part) && (strip.file = { ...part.file, file_data: REMOVED_STRING }),
                        MEDIA_FIELDS))
                            "string" == typeof strip[field] && (strip[field] = REMOVED_STRING);
                        return strip;
                    }));
            }