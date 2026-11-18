9529(__unused_rspack_module, exports, __webpack_require__) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
                let debugBuild = __webpack_require__(3695),
                    session = __webpack_require__(5649),
                    debugLogger = __webpack_require__(2533),
                    is = __webpack_require__(7431),
                    merge = __webpack_require__(1451),
                    misc = __webpack_require__(735),
                    propagationContext = __webpack_require__(8034),
                    randomSafeContext = __webpack_require__(638),
                    spanOnScope = __webpack_require__(8740),
                    string = __webpack_require__(2634),
                    time = __webpack_require__(602);
                class Scope {
                    constructor() {
                        ((this._notifyingListeners = !1),
                            (this._scopeListeners = []),
                            (this._eventProcessors = []),
                            (this._breadcrumbs = []),
                            (this._attachments = []),
                            (this._user = {}),
                            (this._tags = {}),
                            (this._attributes = {}),
                            (this._extra = {}),
                            (this._contexts = {}),
                            (this._sdkProcessingMetadata = {}),
                            (this._propagationContext = { traceId: propagationContext.generateTraceId(), sampleRand: randomSafeContext.safeMathRandom() }));
                    }
                    clone() {
                        let newScope = new Scope();
                        return (
                            (newScope._breadcrumbs = [...this._breadcrumbs]),
                            (newScope._tags = { ...this._tags }),
                            (newScope._attributes = { ...this._attributes }),
                            (newScope._extra = { ...this._extra }),
                            (newScope._contexts = { ...this._contexts }),
                            this._contexts.flags && (newScope._contexts.flags = { values: [...this._contexts.flags.values] }),
                            (newScope._user = this._user),
                            (newScope._level = this._level),
                            (newScope._session = this._session),
                            (newScope._transactionName = this._transactionName),
                            (newScope._fingerprint = this._fingerprint),
                            (newScope._eventProcessors = [...this._eventProcessors]),
                            (newScope._attachments = [...this._attachments]),
                            (newScope._sdkProcessingMetadata = { ...this._sdkProcessingMetadata }),
                            (newScope._propagationContext = { ...this._propagationContext }),
                            (newScope._client = this._client),
                            (newScope._lastEventId = this._lastEventId),
                            (newScope._conversationId = this._conversationId),
                            spanOnScope._setSpanForScope(newScope, spanOnScope._getSpanForScope(this)),
                            newScope
                        );
                    }
                    setClient(client) {
                        this._client = client;
                    }
                    setLastEventId(lastEventId) {
                        this._lastEventId = lastEventId;
                    }
                    getClient() {
                        return this._client;
                    }
                    lastEventId() {
                        return this._lastEventId;
                    }
                    addScopeListener(callback) {
                        this._scopeListeners.push(callback);
                    }
                    addEventProcessor(callback) {
                        return (this._eventProcessors.push(callback), this);
                    }
                    setUser(user) {
                        return (
                            (this._user = user || { email: void 0, id: void 0, ip_address: void 0, username: void 0 }),
                            this._session && session.updateSession(this._session, { user }),
                            this._notifyScopeListeners(),
                            this
                        );
                    }
                    getUser() {
                        return this._user;
                    }
                    setConversationId(conversationId) {
                        return ((this._conversationId = conversationId || void 0), this._notifyScopeListeners(), this);
                    }
                    setTags(tags) {
                        return ((this._tags = { ...this._tags, ...tags }), this._notifyScopeListeners(), this);
                    }
                    setTag(key, value) {
                        return this.setTags({ [key]: value });
                    }
                    setAttributes(newAttributes) {
                        return ((this._attributes = { ...this._attributes, ...newAttributes }), this._notifyScopeListeners(), this);
                    }
                    setAttribute(key, value) {
                        return this.setAttributes({ [key]: value });
                    }
                    removeAttribute(key) {
                        return (key in this._attributes && (delete this._attributes[key], this._notifyScopeListeners()), this);
                    }
                    setExtras(extras) {
                        return ((this._extra = { ...this._extra, ...extras }), this._notifyScopeListeners(), this);
                    }
                    setExtra(key, extra) {
                        return ((this._extra = { ...this._extra, [key]: extra }), this._notifyScopeListeners(), this);
                    }
                    setFingerprint(fingerprint) {
                        return ((this._fingerprint = fingerprint), this._notifyScopeListeners(), this);
                    }
                    setLevel(level) {
                        return ((this._level = level), this._notifyScopeListeners(), this);
                    }
                    setTransactionName(name) {
                        return ((this._transactionName = name), this._notifyScopeListeners(), this);
                    }
                    setContext(key, context) {
                        return (null === context ? delete this._contexts[key] : (this._contexts[key] = context), this._notifyScopeListeners(), this);
                    }
                    setSession(session) {
                        return (session ? (this._session = session) : delete this._session, this._notifyScopeListeners(), this);
                    }
                    getSession() {
                        return this._session;
                    }
                    update(captureContext) {
                        if (!captureContext) return this;
                        let scopeToMerge = "function" == typeof captureContext ? captureContext(this) : captureContext,
                            {
                                tags,
                                attributes,
                                extra,
                                user,
                                contexts,
                                level,
                                fingerprint = [],
                                propagationContext,
                                conversationId,
                            } = (scopeToMerge instanceof Scope ? scopeToMerge.getScopeData() : is.isPlainObject(scopeToMerge) ? captureContext : void 0) || {};
                        return (
                            (this._tags = { ...this._tags, ...tags }),
                            (this._attributes = { ...this._attributes, ...attributes }),
                            (this._extra = { ...this._extra, ...extra }),
                            (this._contexts = { ...this._contexts, ...contexts }),
                            user && Object.keys(user).length && (this._user = user),
                            level && (this._level = level),
                            fingerprint.length && (this._fingerprint = fingerprint),
                            propagationContext && (this._propagationContext = propagationContext),
                            conversationId && (this._conversationId = conversationId),
                            this
                        );
                    }
                    clear() {
                        return (
                            (this._breadcrumbs = []),
                            (this._tags = {}),
                            (this._attributes = {}),
                            (this._extra = {}),
                            (this._user = {}),
                            (this._contexts = {}),
                            (this._level = void 0),
                            (this._transactionName = void 0),
                            (this._fingerprint = void 0),
                            (this._session = void 0),
                            (this._conversationId = void 0),
                            spanOnScope._setSpanForScope(this, void 0),
                            (this._attachments = []),
                            this.setPropagationContext({ traceId: propagationContext.generateTraceId(), sampleRand: randomSafeContext.safeMathRandom() }),
                            this._notifyScopeListeners(),
                            this
                        );
                    }
                    addBreadcrumb(breadcrumb, maxBreadcrumbs) {
                        let maxCrumbs = "number" == typeof maxBreadcrumbs ? maxBreadcrumbs : 100;
                        if (maxCrumbs <= 0) return this;
                        let mergedBreadcrumb = {
                            timestamp: time.dateTimestampInSeconds(),
                            ...breadcrumb,
                            message: breadcrumb.message ? string.truncate(breadcrumb.message, 2048) : breadcrumb.message,
                        };
                        return (
                            this._breadcrumbs.push(mergedBreadcrumb),
                            this._breadcrumbs.length > maxCrumbs &&
                                ((this._breadcrumbs = this._breadcrumbs.slice(-maxCrumbs)), this._client?.recordDroppedEvent("buffer_overflow", "log_item")),
                            this._notifyScopeListeners(),
                            this
                        );
                    }
                    getLastBreadcrumb() {
                        return this._breadcrumbs[this._breadcrumbs.length - 1];
                    }
                    clearBreadcrumbs() {
                        return ((this._breadcrumbs = []), this._notifyScopeListeners(), this);
                    }
                    addAttachment(attachment) {
                        return (this._attachments.push(attachment), this);
                    }
                    clearAttachments() {
                        return ((this._attachments = []), this);
                    }
                    getScopeData() {
                        return {
                            breadcrumbs: this._breadcrumbs,
                            attachments: this._attachments,
                            contexts: this._contexts,
                            tags: this._tags,
                            attributes: this._attributes,
                            extra: this._extra,
                            user: this._user,
                            level: this._level,
                            fingerprint: this._fingerprint || [],
                            eventProcessors: this._eventProcessors,
                            propagationContext: this._propagationContext,
                            sdkProcessingMetadata: this._sdkProcessingMetadata,
                            transactionName: this._transactionName,
                            span: spanOnScope._getSpanForScope(this),
                            conversationId: this._conversationId,
                        };
                    }
                    setSDKProcessingMetadata(newData) {
                        return ((this._sdkProcessingMetadata = merge.merge(this._sdkProcessingMetadata, newData, 2)), this);
                    }
                    setPropagationContext(context) {
                        return ((this._propagationContext = context), this);
                    }
                    getPropagationContext() {
                        return this._propagationContext;
                    }
                    captureException(exception, hint) {
                        let eventId = hint?.event_id || misc.uuid4();
                        if (!this._client) return (debugBuild.DEBUG_BUILD && debugLogger.debug.warn("No client configured on scope - will not capture exception!"), eventId);
                        let syntheticException = Error("Sentry syntheticException");
                        return (this._client.captureException(exception, { originalException: exception, syntheticException, ...hint, event_id: eventId }, this), eventId);
                    }
                    captureMessage(message, level, hint) {
                        let eventId = hint?.event_id || misc.uuid4();
                        if (!this._client) return (debugBuild.DEBUG_BUILD && debugLogger.debug.warn("No client configured on scope - will not capture message!"), eventId);
                        let syntheticException = hint?.syntheticException ?? Error(message);
                        return (this._client.captureMessage(message, level, { originalException: message, syntheticException, ...hint, event_id: eventId }, this), eventId);
                    }
                    captureEvent(event, hint) {
                        let eventId = event.event_id || hint?.event_id || misc.uuid4();
                        return (
                            this._client
                                ? this._client.captureEvent(event, { ...hint, event_id: eventId }, this)
                                : debugBuild.DEBUG_BUILD && debugLogger.debug.warn("No client configured on scope - will not capture event!"),
                            eventId
                        );
                    }
                    _notifyScopeListeners() {
                        this._notifyingListeners ||
                            ((this._notifyingListeners = !0),
                            this._scopeListeners.forEach((callback) => {
                                callback(this);
                            }),
                            (this._notifyingListeners = !1));
                    }
                }
                exports.Scope = Scope;
            }