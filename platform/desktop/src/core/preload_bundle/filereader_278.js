278(__unused_rspack_module, exports, __webpack_require__) {
                "use strict";
                var __importDefault =
                    (this && this.__importDefault) ||
                    function (mod) {
                        return mod && mod.__esModule ? mod : { default: mod };
                    };
                (Object.defineProperty(exports, "__esModule", { value: !0 }), (exports.readMinidump = readMinidump));
                let promises_1 = __importDefault(__webpack_require__(1943)),
                    util_1 = __importDefault(__webpack_require__(9023)),
                    native_crash_codes_1 = __webpack_require__(6908),
                    codeIntegrityStream_1 = __webpack_require__(5264),
                    minidumpReader_1 = __webpack_require__(8888);
                class FileReader {
                    handle;
                    buffer;
                    utf16Decoder = new util_1.default.TextDecoder("utf-16");
                    constructor(path, bufferSize = 2048) {
                        ((this.handle = promises_1.default.open(path, "r")), (this.buffer = new Uint8Array(bufferSize)));
                    }
                    async read(u32toReadCount, position) {
                        let byteSize = 4 * u32toReadCount;
                        return (await this.readCore(byteSize, position), new minidumpReader_1.ReadResult(this.buffer.buffer.slice(0, byteSize)));
                    }
                    async readMinidumpString(rva) {
                        if (0 === rva) return "";
                        await this.readCore(4, rva);
                        let length = this.buffer[0] | (this.buffer[1] << 8) | (this.buffer[2] << 16) | (this.buffer[3] << 24);
                        return (await this.readCore(Math.min(length, this.buffer.byteLength), rva + 4), this.utf16Decoder.decode(this.buffer.slice(0, length)));
                    }
                    async readCore(byteLength, position) {
                        if (byteLength > this.buffer.byteLength) throw Error(`Requested nuber of bytes ${byteLength} exceeds buffer size ${this.buffer.byteLength}.`);
                        if (null == this.handle) throw Error("Cannot use FileReader once closed.");
                        let handle = await this.handle,
                            bytesRead = 0;
                        for (; bytesRead < byteLength;) {
                            let readResult = await handle.read(this.buffer, bytesRead, byteLength - bytesRead, position + bytesRead);
                            if (0 === readResult.bytesRead) throw Error("Unexpected end of file");
                            bytesRead += readResult.bytesRead;
                        }
                    }
                    get bufferByteLength() {
                        return this.buffer.byteLength;
                    }
                    async close() {
                        if (null != this.handle)
                            try {
                                let handle = await this.handle;
                                await handle.close();
                            } finally {
                                this.handle = null;
                            }
                    }
                }
                class MINIDUMP_HEADER {
                    static U32_SIZE = 4;
                    signature;
                    version;
                    numberOfStreams;
                    streamDirectoryOffset;
                    constructor(reader) {
                        ((this.signature = reader.readuint32()),
                            (this.version = reader.readuint32()),
                            (this.numberOfStreams = reader.readuint32()),
                            (this.streamDirectoryOffset = reader.readuint32()));
                    }
                    static async read(reader, position) {
                        return new MINIDUMP_HEADER(await reader.read(MINIDUMP_HEADER.U32_SIZE, position));
                    }
                }
                class MINIDUMP_DIRECTORY {
                    static U32_SIZE = 3;
                    streamType;
                    dataSize;
                    dataOffset;
                    constructor(reader) {
                        ((this.streamType = reader.readuint32()), (this.dataSize = reader.readuint32()), (this.dataOffset = reader.readuint32()));
                    }
                    static async read(reader, position) {
                        return new MINIDUMP_DIRECTORY(await reader.read(MINIDUMP_DIRECTORY.U32_SIZE, position));
                    }
                }
                class MINIDUMP_EXCEPTION_STREAM {
                    static U32_SIZE = 8;
                    threadId;
                    alignment;
                    exceptionCode;
                    exceptionFlags;
                    exceptionRecord;
                    exceptionAddress;
                    constructor(reader) {
                        ((this.threadId = reader.readuint32()),
                            (this.alignment = reader.readuint32()),
                            (this.exceptionCode = reader.readuint32()),
                            (this.exceptionFlags = reader.readuint32()),
                            (this.exceptionRecord = reader.readuint64()),
                            (this.exceptionAddress = reader.readuint64()));
                    }
                    static async read(reader, position) {
                        return new MINIDUMP_EXCEPTION_STREAM(await reader.read(MINIDUMP_EXCEPTION_STREAM.U32_SIZE, position));
                    }
                    getExceptionCodeString() {
                        return (0, native_crash_codes_1.getExceptionCode)(this.exceptionCode);
                    }
                }
                async function readCodeIntegrity(reader, entry) {
                    return entry.dataSize < codeIntegrityStream_1.CODE_INTEGRITY_BYTE_SIZE
                        ? null
                        : (0, codeIntegrityStream_1.readCodeIntegrityRecord)(await reader.read(codeIntegrityStream_1.CODE_INTEGRITY_U32_SIZE, entry.dataOffset));
                }
                class MINIDUMP_LOCATION_DESCRIPTOR {
                    dataSize;
                    rva;
                    constructor(reader) {
                        ((this.dataSize = reader.readuint32()), (this.rva = reader.readuint32()));
                    }
                }
                class MINIDUMP_MEMORY_DESCRIPTOR {
                    startOfMemoryRange;
                    memory;
                    constructor(reader) {
                        ((this.startOfMemoryRange = reader.readuint64()), (this.memory = new MINIDUMP_LOCATION_DESCRIPTOR(reader)));
                    }
                }
                class MINIDUMP_MEMORY_INFO_LIST {
                    static U32_SIZE = 4;
                    sizeOfHeader;
                    sizeOfEntry;
                    numberOfEntries;
                    constructor(reader) {
                        ((this.sizeOfHeader = reader.readuint32()), (this.sizeOfEntry = reader.readuint32()), (this.numberOfEntries = reader.readuint64()));
                    }
                    static async read(reader, position) {
                        return new MINIDUMP_MEMORY_INFO_LIST(await reader.read(MINIDUMP_MEMORY_INFO_LIST.U32_SIZE, position));
                    }
                }
                class MINIDUMP_MEMORY_INFO {
                    static BYTE_SIZE = 48;
                    static PAGE_EXECUTE_ANY = 240;
                    static MEM_COMMIT = 4096;
                    baseAddress;
                    allocationBase;
                    allocationProtect;
                    alignment1;
                    regionSize;
                    state;
                    protect;
                    type;
                    constructor(reader) {
                        ((this.baseAddress = reader.readuint64()),
                            (this.allocationBase = reader.readuint64()),
                            (this.allocationProtect = reader.readuint32()),
                            (this.alignment1 = reader.readuint32()),
                            (this.regionSize = reader.readuint64()),
                            (this.state = reader.readuint32()),
                            (this.protect = reader.readuint32()),
                            (this.type = reader.readuint32()));
                    }
                    get isExecutable() {
                        return this.state === MINIDUMP_MEMORY_INFO.MEM_COMMIT && (this.protect & MINIDUMP_MEMORY_INFO.PAGE_EXECUTE_ANY) != 0;
                    }
                    get startAddress() {
                        return this.baseAddress;
                    }
                    containsAddress(address) {
                        return this.baseAddress <= address && this.baseAddress + this.regionSize > address;
                    }
                }
                class MINIDUMP_THREAD_LIST {
                    static U32_SIZE = 1;
                    numberOfThreads;
                    constructor(reader) {
                        this.numberOfThreads = reader.readuint32();
                    }
                    static async read(reader, position) {
                        return new MINIDUMP_THREAD_LIST(await reader.read(MINIDUMP_THREAD_LIST.U32_SIZE, position));
                    }
                }
                class MINIDUMP_THREAD {
                    static U32_SIZE = 12;
                    threadId;
                    suspendCount;
                    priorityClass;
                    priority;
                    teb;
                    stack;
                    threadContext;
                    constructor(reader) {
                        ((this.threadId = reader.readuint32()),
                            (this.suspendCount = reader.readuint32()),
                            (this.priorityClass = reader.readuint32()),
                            (this.priority = reader.readuint32()),
                            (this.teb = reader.readuint64()),
                            (this.stack = new MINIDUMP_MEMORY_DESCRIPTOR(reader)),
                            (this.threadContext = new MINIDUMP_LOCATION_DESCRIPTOR(reader)));
                    }
                    static async read(reader, position) {
                        return new MINIDUMP_THREAD(await reader.read(MINIDUMP_THREAD.U32_SIZE, position));
                    }
                }
                class CONTEXT_AMD64 {
                    static CONTEXT_FLAGS_OFFSET = 48;
                    static RSP_OFFSET = 152;
                    static AMD64_FLAG = 1048576;
                    static BYTE_SIZE = CONTEXT_AMD64.RSP_OFFSET + 8;
                    static U32_SIZE = CONTEXT_AMD64.BYTE_SIZE / 4;
                    contextFlags;
                    rsp;
                    constructor(reader) {
                        (reader.seek(CONTEXT_AMD64.CONTEXT_FLAGS_OFFSET),
                            (this.contextFlags = reader.readuint32()),
                            reader.seek(CONTEXT_AMD64.RSP_OFFSET),
                            (this.rsp = reader.readuint64()));
                    }
                    static async read(reader, location) {
                        if (0 === location.rva || location.dataSize < CONTEXT_AMD64.BYTE_SIZE) return null;
                        let context = new CONTEXT_AMD64(await reader.read(CONTEXT_AMD64.U32_SIZE, location.rva));
                        return (context.contextFlags & CONTEXT_AMD64.AMD64_FLAG) === CONTEXT_AMD64.AMD64_FLAG ? context : null;
                    }
                }
                class MINIDUMP_THREAD_NAME_LIST {
                    static U32_SIZE = 1;
                    numberOfThreadNames;
                    constructor(reader) {
                        this.numberOfThreadNames = reader.readuint32();
                    }
                    static async read(reader, position) {
                        return new MINIDUMP_THREAD_NAME_LIST(await reader.read(MINIDUMP_THREAD_NAME_LIST.U32_SIZE, position));
                    }
                }
                class MINIDUMP_THREAD_NAME {
                    static U32_SIZE = 3;
                    threadId;
                    threadNameRva;
                    constructor(reader) {
                        ((this.threadId = reader.readuint32()), (this.threadNameRva = reader.readuint64()));
                    }
                    static async read(reader, position) {
                        return new MINIDUMP_THREAD_NAME(await reader.read(MINIDUMP_THREAD_NAME.U32_SIZE, position));
                    }
                }
                class MINIDUMP_MODULE_LIST {
                    static U32_SIZE = 1;
                    numberOfModules;
                    constructor(reader) {
                        this.numberOfModules = reader.readuint32();
                    }
                    static async read(reader, position) {
                        return new MINIDUMP_MODULE_LIST(await reader.read(MINIDUMP_MODULE_LIST.U32_SIZE, position));
                    }
                }
                class MINIDUMP_MODULE {
                    static U32_SIZE = 27;
                    baseOfImage;
                    sizeOfImage;
                    checkSum;
                    timeDateStamp;
                    moduleNameRva;
                    versionInfo;
                    cvRecord;
                    miscRecord;
                    reserved0;
                    reserved1;
                    constructor(reader) {
                        ((this.baseOfImage = reader.readuint64()),
                            (this.sizeOfImage = reader.readuint32()),
                            (this.checkSum = reader.readuint32()),
                            (this.timeDateStamp = reader.readuint32()),
                            (this.moduleNameRva = reader.readuint32()),
                            (this.versionInfo = new VS_FIXEDFILEINFO(reader)),
                            (this.cvRecord = new MINIDUMP_LOCATION_DESCRIPTOR(reader)),
                            (this.miscRecord = new MINIDUMP_LOCATION_DESCRIPTOR(reader)),
                            (this.reserved0 = reader.readuint64()),
                            (this.reserved1 = reader.readuint64()));
                    }
                    static async read(reader, position) {
                        return new MINIDUMP_MODULE(await reader.read(MINIDUMP_MODULE.U32_SIZE, position));
                    }
                    get startAddress() {
                        return this.baseOfImage;
                    }
                    containsAddress(address) {
                        let endAddress = this.baseOfImage + BigInt(this.sizeOfImage);
                        return this.baseOfImage <= address && endAddress > address;
                    }
                    async getModuleFileName(reader) {
                        let moduleName = await reader.readMinidumpString(this.moduleNameRva),
                            dirPos = moduleName.lastIndexOf("\\");
                        return (-1 === dirPos && (dirPos = moduleName.lastIndexOf("/")), (dirPos = -1 === dirPos ? 0 : dirPos + 1), moduleName.slice(dirPos));
                    }
                    async getCVInfoIdString(reader) {
                        return (await CV_INFO.read(reader, this.cvRecord.rva)).getIdString();
                    }
                    getCodeIdString() {
                        return this.timeDateStamp.toString(16).toUpperCase().padStart(8, "0") + this.sizeOfImage.toString(16);
                    }
                }
                class VS_FIXEDFILEINFO {
                    dwSignature;
                    dwStrucVersion;
                    dwFileVersionMS;
                    dwFileVersionLS;
                    dwProductVersionMS;
                    dwProductVersionLS;
                    dwFileFlagsMask;
                    dwFileFlags;
                    dwFileOS;
                    dwFileType;
                    dwFileSubtype;
                    dwFileDateMS;
                    dwFileDateLS;
                    constructor(reader) {
                        ((this.dwSignature = reader.readuint32()),
                            (this.dwStrucVersion = reader.readuint32()),
                            (this.dwFileVersionMS = reader.readuint32()),
                            (this.dwFileVersionLS = reader.readuint32()),
                            (this.dwProductVersionMS = reader.readuint32()),
                            (this.dwProductVersionLS = reader.readuint32()),
                            (this.dwFileFlagsMask = reader.readuint32()),
                            (this.dwFileFlags = reader.readuint32()),
                            (this.dwFileOS = reader.readuint32()),
                            (this.dwFileType = reader.readuint32()),
                            (this.dwFileSubtype = reader.readuint32()),
                            (this.dwFileDateMS = reader.readuint32()),
                            (this.dwFileDateLS = reader.readuint32()));
                    }
                    getVersionString() {
                        let first = (this.dwProductVersionMS >> 16) & 65535,
                            second = 65535 & this.dwProductVersionMS,
                            third = (this.dwProductVersionLS >> 16) & 65535,
                            fourth = 65535 & this.dwProductVersionLS;
                        return `${first}.${second}.${third}.${fourth}`;
                    }
                }
                class CV_INFO {
                    static async read(reader, position) {
                        if (0 === position) return new CV_INFO_UNKNOWN(0);
                        let readResult = await reader.read(6, position),
                            cvSignature = readResult.readuint32();
                        switch (cvSignature) {
                            case CV_INFO_PDB20.SIGNATURE:
                                return new CV_INFO_PDB20(readResult);
                            case CV_INFO_PDB70.SIGNATURE:
                                return new CV_INFO_PDB70(readResult);
                            case CV_INFO_ELF.SIGNATURE:
                                return new CV_INFO_ELF();
                            default:
                                return new CV_INFO_UNKNOWN(cvSignature);
                        }
                    }
                }
                class CV_INFO_PDB20 {
                    static SIGNATURE = 0x3031424e;
                    cvOffset;
                    signature;
                    age;
                    constructor(reader) {
                        ((this.cvOffset = reader.readuint32()), (this.signature = reader.readuint32()), (this.age = reader.readuint32()));
                    }
                    getIdString() {
                        return "CV_INFO_PDB20";
                    }
                }
                class GUID {
                    data1;
                    data2;
                    data3;
                    data4;
                    constructor(reader) {
                        ((this.data1 = reader.readuint32()), (this.data2 = reader.readuint16()), (this.data3 = reader.readuint16()), (this.data4 = reader.readByteArray(8)));
                    }
                    toString() {
                        return 8 !== this.data4.length
                            ? "Invalid"
                            : this.data1.toString(16).padStart(4, "0") +
                                  this.data2.toString(16).padStart(2, "0") +
                                  this.data3.toString(16).padStart(2, "0") +
                                  this.data4.map((b) => b.toString(16).padStart(2, "0")).join("");
                    }
                }
                class CV_INFO_PDB70 {
                    static SIGNATURE = 0x53445352;
                    signature;
                    age;
                    constructor(reader) {
                        ((this.signature = new GUID(reader)), (this.age = reader.readuint32()));
                    }
                    getIdString() {
                        return (this.signature.toString() + this.age.toString(16)).toUpperCase();
                    }
                }
                class CV_INFO_ELF {
                    static SIGNATURE = 0x4270454c;
                    getIdString() {
                        return "CV_INFO_ELF";
                    }
                }
                class CV_INFO_UNKNOWN {
                    cvSignature;
                    constructor(cvSignature) {
                        this.cvSignature = cvSignature;
                    }
                    getIdString() {
                        return "CV_INFO_UNKNOWN:" + this.cvSignature.toString(16).padStart(4, "0");
                    }
                }
                class AddressRangeLookup {
                    ranges;
                    constructor(ranges) {
                        this.ranges = [...ranges].sort((a, b) => (a.startAddress < b.startAddress ? -1 : 1));
                    }
                    find(address) {
                        let low = 0,
                            high = this.ranges.length - 1;
                        for (; low <= high;) {
                            let middle = (low + high) >> 1,
                                range = this.ranges[middle];
                            if (address < range.startAddress) high = middle - 1;
                            else {
                                if (range.containsAddress(address)) return range;
                                low = middle + 1;
                            }
                        }
                        return null;
                    }
                }
                async function readNonExecutableRanges(reader, memoryInfoListStreamEntry) {
                    let list = await MINIDUMP_MEMORY_INFO_LIST.read(reader, memoryInfoListStreamEntry.dataOffset),
                        numberOfEntries = Number(list.numberOfEntries);
                    if (numberOfEntries <= 0 || numberOfEntries > 262144 || list.sizeOfEntry < MINIDUMP_MEMORY_INFO.BYTE_SIZE || list.sizeOfEntry % 4 != 0) return null;
                    let entriesPerRead = Math.floor(reader.bufferByteLength / list.sizeOfEntry);
                    if (0 === entriesPerRead) return null;
                    let regions = [];
                    try {
                        for (let i = 0; i < numberOfEntries; i += entriesPerRead) {
                            let readEntryCount = Math.min(entriesPerRead, numberOfEntries - i),
                                chunk = await reader.read((readEntryCount * list.sizeOfEntry) / 4, memoryInfoListStreamEntry.dataOffset + list.sizeOfHeader + i * list.sizeOfEntry);
                            for (let j = 0; j < readEntryCount; ++j) {
                                chunk.seek(j * list.sizeOfEntry);
                                let region = new MINIDUMP_MEMORY_INFO(chunk);
                                region.isExecutable || regions.push(region);
                            }
                        }
                    } catch (e) {
                        console.log(`readMinidump: Error reading memory regions: ${e}`);
                    }
                    return 0 === regions.length ? null : new AddressRangeLookup(regions);
                }
                async function getStackFrameString(reader, module1, address, moduleNames) {
                    let moduleName = moduleNames.get(module1);
                    return (
                        null == moduleName && ((moduleName = await module1.getModuleFileName(reader)), moduleNames.set(module1, moduleName)),
                        `${moduleName}!${module1.getCodeIdString()}+${(address - module1.baseOfImage).toString(16)}`
                    );
                }
                async function getThreadStack(reader, threadListStreamEntry, threadId) {
                    let threadList = await MINIDUMP_THREAD_LIST.read(reader, threadListStreamEntry.dataOffset);
                    if (threadList.numberOfThreads > 4096) return null;
                    let threadOffset = threadListStreamEntry.dataOffset + 4;
                    for (let i = 0; i < threadList.numberOfThreads; ++i) {
                        let thread = await MINIDUMP_THREAD.read(reader, threadOffset);
                        if (((threadOffset += 4 * MINIDUMP_THREAD.U32_SIZE), thread.threadId === threadId)) return thread.stack;
                    }
                    return null;
                }
                async function readExceptionStacktrace(reader, streamLookup, exceptionStream, modules) {
                    let exceptionStreamEntry = streamLookup[6],
                        threadListStreamEntry = streamLookup[3];
                    if (null == exceptionStreamEntry || null == threadListStreamEntry || 0 === modules.length) return null;
                    let contextLocation = new MINIDUMP_LOCATION_DESCRIPTOR(await reader.read(2, exceptionStreamEntry.dataOffset + 160)),
                        context = await CONTEXT_AMD64.read(reader, contextLocation);
                    if (null == context) return null;
                    let stack = await getThreadStack(reader, threadListStreamEntry, exceptionStream.threadId);
                    if (null == stack || 0 === stack.memory.dataSize) return null;
                    let moduleLookup = new AddressRangeLookup(modules),
                        memoryInfoListStreamEntry = streamLookup[16],
                        nonExecutableLookup = null == memoryInfoListStreamEntry ? null : await readNonExecutableRanges(reader, memoryInfoListStreamEntry),
                        moduleNames = new Map(),
                        frames = [];
                    if (exceptionStream.exceptionAddress !== BigInt(0)) {
                        let module1 = moduleLookup.find(exceptionStream.exceptionAddress);
                        null != module1 && frames.push(await getStackFrameString(reader, module1, exceptionStream.exceptionAddress, moduleNames));
                    }
                    let stackEnd = stack.startOfMemoryRange + BigInt(stack.memory.dataSize),
                        scanOffset = 0;
                    context.rsp >= stack.startOfMemoryRange && context.rsp < stackEnd && (scanOffset = -8 & Number(context.rsp - stack.startOfMemoryRange));
                    let scanEnd = -8 & Math.min(stack.memory.dataSize, scanOffset + 65536),
                        chunkByteLength = -8 & reader.bufferByteLength,
                        previousAddress = BigInt(0);
                    for (let offset = scanOffset; offset < scanEnd && frames.length < 64; offset += chunkByteLength) {
                        let readByteLength = Math.min(chunkByteLength, scanEnd - offset),
                            chunk = await reader.read(readByteLength / 4, stack.memory.rva + offset);
                        for (let i = 0; i < readByteLength && frames.length < 64; i += 8) {
                            let address = chunk.readuint64();
                            if (address === previousAddress) continue;
                            let module1 = moduleLookup.find(address);
                            null != module1 &&
                                nonExecutableLookup?.find(address) == null &&
                                ((previousAddress = address), frames.push(await getStackFrameString(reader, module1, address, moduleNames)));
                        }
                    }
                    return 0 === frames.length ? null : frames;
                }
                async function readMinidump(file) {
                    if (null == file || !/\.dmp$/i.test(file)) return null;
                    let reader = null,
                        info = {};
                    try {
                        reader = new FileReader(file);
                        let header = await MINIDUMP_HEADER.read(reader, 0);
                        if (0x504d444d !== header.signature) return (console.log(`readMinidump Bad signature: 0x${header.signature.toString(16)}`), null);
                        if (header.numberOfStreams > 256) return (console.log(`readMinidump Bad numberOfStreams: 0x${header.numberOfStreams.toString(16)}`), null);
                        let streamLookup = {};
                        for (let i = 0; i < header.numberOfStreams; ++i) {
                            let streamOffset = header.streamDirectoryOffset + 12 * i,
                                entry = await MINIDUMP_DIRECTORY.read(reader, streamOffset);
                            switch (entry.streamType) {
                                case 6:
                                case 4:
                                case 3:
                                case 24:
                                case 16:
                                case 0xd15c0d01:
                                    break;
                                default:
                                    continue;
                            }
                            streamLookup[entry.streamType] = entry;
                        }
                        let exceptionStreamEntry = streamLookup[6];
                        if (null == exceptionStreamEntry) return (console.log("readMinidump: No ExceptionStream found."), null);
                        let exceptionStream = await MINIDUMP_EXCEPTION_STREAM.read(reader, exceptionStreamEntry.dataOffset);
                        info.exceptionString = exceptionStream.getExceptionCodeString();
                        let exceptionAddrString = exceptionStream.exceptionAddress.toString(16);
                        console.log(`readMinidump exceptionCode: ${info.exceptionString}, exceptionAddress ${exceptionAddrString}`);
                        let threadNamesStreamEntry = streamLookup[24];
                        if (null != threadNamesStreamEntry)
                            try {
                                let threadNamesList = await MINIDUMP_THREAD_NAME_LIST.read(reader, threadNamesStreamEntry.dataOffset);
                                if (threadNamesList.numberOfThreadNames > 0 && threadNamesList.numberOfThreadNames <= 1024) {
                                    let threadNameOffset = threadNamesStreamEntry.dataOffset + 4;
                                    for (let i = 0; i < threadNamesList.numberOfThreadNames; ++i) {
                                        let threadName = await MINIDUMP_THREAD_NAME.read(reader, threadNameOffset);
                                        if (((threadNameOffset += 4 * MINIDUMP_THREAD_NAME.U32_SIZE), threadName.threadId === exceptionStream.threadId)) {
                                            let nameRva = Number(threadName.threadNameRva);
                                            0 !== nameRva && (info.exceptionThreadName = await reader.readMinidumpString(nameRva));
                                            break;
                                        }
                                    }
                                }
                            } catch (e) {
                                console.log(`readMinidump: Error reading thread names: ${e}`);
                            }
                        let codeIntegrityStreamEntry = streamLookup[0xd15c0d01];
                        if (null != codeIntegrityStreamEntry)
                            try {
                                let codeIntegrity = await readCodeIntegrity(reader, codeIntegrityStreamEntry);
                                null != codeIntegrity && (info.codeIntegrity = codeIntegrity);
                            } catch (e) {
                                console.log(`readMinidump: Error reading the code integrity stream: ${e}`);
                            }
                        let moduleStreamEntry = streamLookup[4];
                        if (null == moduleStreamEntry) return info;
                        let moduleList = await MINIDUMP_MODULE_LIST.read(reader, moduleStreamEntry.dataOffset);
                        if (moduleList.numberOfModules > 512)
                            return (console.log(`readMinidump ModuleListstream Bad numberOfModules: 0x${moduleList.numberOfModules.toString(16)}`), info);
                        let moduleEntryOffset = moduleStreamEntry.dataOffset + 4,
                            firstModule = await MINIDUMP_MODULE.read(reader, moduleEntryOffset);
                        info.processName = await firstModule.getModuleFileName(reader);
                        let modules = [];
                        for (let i = 0; i < moduleList.numberOfModules; ++i)
                            (modules.push(await MINIDUMP_MODULE.read(reader, moduleEntryOffset)), (moduleEntryOffset += 4 * MINIDUMP_MODULE.U32_SIZE));
                        if (exceptionStream.exceptionAddress !== BigInt(0)) {
                            for (let module1 of modules)
                                if (module1.containsAddress(exceptionStream.exceptionAddress)) {
                                    ((info.exceptionModuleName = await module1.getModuleFileName(reader)),
                                        (info.exceptionModuleVersion = module1.versionInfo.getVersionString()),
                                        (info.relativeCrashAddress = (exceptionStream.exceptionAddress - module1.baseOfImage).toString(16)),
                                        (info.exceptionModuleCodeId = module1.getCodeIdString().toUpperCase()));
                                    break;
                                }
                        }
                        try {
                            let stacktrace = await readExceptionStacktrace(reader, streamLookup, exceptionStream, modules);
                            null != stacktrace && (info.exceptionStacktrace = stacktrace);
                        } catch (e) {
                            console.log(`readMinidump: Error reading the exception stacktrace: ${e}`);
                        }
                    } catch (e) {
                        return (console.log(`readMinidump exception: ${e} ${e?.stack}`), null);
                    } finally {
                        reader?.close();
                    }
                    return (console.log(`readMinidump result ${JSON.stringify(info)}`), info);
                }
            }