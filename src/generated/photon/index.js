"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const runtime_1 = require("./runtime");
/**
 * Query Engine version: latest
 */
const path = require("path");
const debug = runtime_1.debugLib('photon');
/**
 * A PhotonRequestError is an error that is thrown in conjunction to a concrete query that has been performed with Photon.js.
 */
class PhotonRequestError extends Error {
    constructor(message, code, meta) {
        super(message);
        this.message = message;
        this.code = code;
        this.meta = meta;
        this.code = code;
        this.meta = meta;
    }
}
exports.PhotonRequestError = PhotonRequestError;
class PhotonFetcher {
    constructor(photon, engine, debug = false, hooks) {
        this.photon = photon;
        this.engine = engine;
        this.debug = debug;
        this.hooks = hooks;
    }
    request(document, path = [], rootField, typeName, isList, callsite) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = String(document);
            debug('Request:');
            debug(query);
            if (this.hooks && this.hooks.beforeRequest) {
                this.hooks.beforeRequest({ query, path, rootField, typeName, document });
            }
            try {
                yield this.photon.connect();
                const result = yield this.engine.request(query, typeName);
                debug('Response:');
                debug(result);
                return this.unpack(document, result, path, rootField, isList);
            }
            catch (e) {
                if (callsite) {
                    const { stack } = runtime_1.printStack({
                        callsite,
                        originalMethod: path.join('.'),
                        onUs: e.isPanic
                    });
                    const message = stack + '\n\n' + e.message;
                    if (e.code) {
                        throw new PhotonRequestError(message, e.code, e.meta);
                    }
                    throw new Error(message);
                }
                else {
                    if (e.isPanic) {
                        throw e;
                    }
                    else {
                        throw new Error(`Error in Photon${path}: \n` + e.stack);
                    }
                }
            }
        });
    }
    unpack(document, data, path, rootField, isList) {
        const getPath = [];
        if (rootField) {
            getPath.push(rootField);
        }
        getPath.push(...path.filter(p => p !== 'select' && p !== 'include'));
        return runtime_1.unpack({ document, path: getPath, data });
    }
}
/**
 * Build tool annotations
 * In order to make `ncc` and `node-file-trace` happy.
**/
path.join(__dirname, 'runtime/query-engine-debian-openssl-1.1.x');
class Photon {
    constructor(options = {}) {
        const useDebug = options.debug === true ? true : typeof options.debug === 'object' ? Boolean(options.debug.library) : false;
        if (useDebug) {
            runtime_1.debugLib.enable('photon');
        }
        const debugEngine = options.debug === true ? true : typeof options.debug === 'object' ? Boolean(options.debug.engine) : false;
        // datamodel = datamodel without datasources + printed datasources
        const predefinedDatasources = [
            {
                "name": "db",
                "url": 'file:' + path.resolve(__dirname, '../../app/db/prisma/dev.db')
            }
        ];
        const inputDatasources = Object.entries(options.datasources || {}).map(([name, url]) => ({ name, url: url }));
        const datasources = runtime_1.mergeBy(predefinedDatasources, inputDatasources, (source) => source.name);
        const internal = options.__internal || {};
        const engineConfig = internal.engine || {};
        this.engine = new runtime_1.Engine({
            cwd: engineConfig.cwd || path.resolve(__dirname, "../../app/db/prisma"),
            debug: debugEngine,
            datamodelPath: path.resolve(__dirname, 'schema.prisma'),
            prismaPath: engineConfig.binaryPath || undefined,
            datasources,
            generator: { "name": "photon", "provider": "photonjs", "output": "/opt/timecampus/products/channels/timecampus-channel-whatsapp/src/generated/photon", "binaryTargets": [], "config": {} },
        });
        this.dmmf = new runtime_1.DMMFClass(exports.dmmf);
        this.fetcher = new PhotonFetcher(this, this.engine, false, internal.hooks);
    }
    connectEngine(publicCall) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.engine.start();
        });
    }
    connect() {
        if (this.connectionPromise) {
            return this.connectionPromise;
        }
        this.connectionPromise = this.connectEngine(true);
        return this.connectionPromise;
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.engine.stop();
        });
    }
    // won't be generated for now
    // private _query?: QueryDelegate
    // get query(): QueryDelegate {
    //   return this._query ? this._query: (this._query = QueryDelegate(this.dmmf, this.fetcher))
    // }
    get timecampusAuths() {
        return TimecampusAuthDelegate(this.dmmf, this.fetcher);
    }
    get channelAuths() {
        return ChannelAuthDelegate(this.dmmf, this.fetcher);
    }
    get auditLogs() {
        return AuditLogsDelegate(this.dmmf, this.fetcher);
    }
}
exports.Photon = Photon;
/**
 * Enums
 */
// Based on
// https://github.com/microsoft/TypeScript/issues/3192#issuecomment-261720275
function makeEnum(x) { return x; }
exports.OrderByArg = makeEnum({
    asc: 'asc',
    desc: 'desc'
});
function TimecampusAuthDelegate(dmmf, fetcher) {
    const TimecampusAuth = (args) => new TimecampusAuthClient(dmmf, fetcher, 'query', 'findManyTimecampusAuth', 'timecampusAuths', args, []);
    TimecampusAuth.findOne = (args) => args.select ? new TimecampusAuthClient(dmmf, fetcher, 'query', 'findOneTimecampusAuth', 'timecampusAuths.findOne', args, []) : new TimecampusAuthClient(dmmf, fetcher, 'query', 'findOneTimecampusAuth', 'timecampusAuths.findOne', args, []);
    TimecampusAuth.findMany = (args) => new TimecampusAuthClient(dmmf, fetcher, 'query', 'findManyTimecampusAuth', 'timecampusAuths.findMany', args, []);
    TimecampusAuth.create = (args) => args.select ? new TimecampusAuthClient(dmmf, fetcher, 'mutation', 'createOneTimecampusAuth', 'timecampusAuths.create', args, []) : new TimecampusAuthClient(dmmf, fetcher, 'mutation', 'createOneTimecampusAuth', 'timecampusAuths.create', args, []);
    TimecampusAuth.delete = (args) => args.select ? new TimecampusAuthClient(dmmf, fetcher, 'mutation', 'deleteOneTimecampusAuth', 'timecampusAuths.delete', args, []) : new TimecampusAuthClient(dmmf, fetcher, 'mutation', 'deleteOneTimecampusAuth', 'timecampusAuths.delete', args, []);
    TimecampusAuth.update = (args) => args.select ? new TimecampusAuthClient(dmmf, fetcher, 'mutation', 'updateOneTimecampusAuth', 'timecampusAuths.update', args, []) : new TimecampusAuthClient(dmmf, fetcher, 'mutation', 'updateOneTimecampusAuth', 'timecampusAuths.update', args, []);
    TimecampusAuth.deleteMany = (args) => new TimecampusAuthClient(dmmf, fetcher, 'mutation', 'deleteManyTimecampusAuth', 'timecampusAuths.deleteMany', args, []);
    TimecampusAuth.updateMany = (args) => new TimecampusAuthClient(dmmf, fetcher, 'mutation', 'updateManyTimecampusAuth', 'timecampusAuths.updateMany', args, []);
    TimecampusAuth.upsert = (args) => args.select ? new TimecampusAuthClient(dmmf, fetcher, 'mutation', 'upsertOneTimecampusAuth', 'timecampusAuths.upsert', args, []) : new TimecampusAuthClient(dmmf, fetcher, 'mutation', 'upsertOneTimecampusAuth', 'timecampusAuths.upsert', args, []);
    TimecampusAuth.count = () => new TimecampusAuthClient(dmmf, fetcher, 'query', 'aggregateTimecampusAuth', 'timecampusAuths.count', {}, ['count']);
    return TimecampusAuth; // any needed until https://github.com/microsoft/TypeScript/issues/31335 is resolved
}
class TimecampusAuthClient {
    constructor(_dmmf, _fetcher, _queryType, _rootField, _clientMethod, _args, _path, _isList = false) {
        this._dmmf = _dmmf;
        this._fetcher = _fetcher;
        this._queryType = _queryType;
        this._rootField = _rootField;
        this._clientMethod = _clientMethod;
        this._args = _args;
        this._path = _path;
        this._isList = _isList;
        // @ts-ignore
        if (typeof window === 'undefined' && process.env.NODE_ENV !== 'production') {
            const error = new Error();
            if (error && error.stack) {
                const stack = error.stack;
                this._callsite = stack;
            }
        }
    }
    channelAuth(args) {
        const prefix = this._path.includes('select') ? 'select' : this._path.includes('include') ? 'include' : 'select';
        const path = [...this._path, prefix, 'channelAuth'];
        const newArgs = runtime_1.deepSet(this._args, path, args || true);
        this._isList = false;
        return new ChannelAuthClient(this._dmmf, this._fetcher, this._queryType, this._rootField, this._clientMethod, newArgs, path, this._isList);
    }
    get _document() {
        const { _rootField: rootField } = this;
        const document = runtime_1.makeDocument({
            dmmf: this._dmmf,
            rootField,
            rootTypeName: this._queryType,
            select: this._args
        });
        try {
            document.validate(this._args, false, this._clientMethod);
        }
        catch (e) {
            const x = e;
            if (x.render) {
                if (this._callsite) {
                    e.message = x.render(this._callsite);
                }
            }
            throw e;
        }
        return runtime_1.transformDocument(document);
    }
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then(onfulfilled, onrejected) {
        if (!this._requestPromise) {
            this._requestPromise = this._fetcher.request(this._document, this._path, this._rootField, 'TimecampusAuth', this._isList, this._callsite);
        }
        return this._requestPromise.then(onfulfilled, onrejected);
    }
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch(onrejected) {
        if (!this._requestPromise) {
            this._requestPromise = this._fetcher.request(this._document, this._path, this._rootField, 'TimecampusAuth', this._isList, this._callsite);
        }
        return this._requestPromise.catch(onrejected);
    }
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally) {
        if (!this._requestPromise) {
            this._requestPromise = this._fetcher.request(this._document, this._path, this._rootField, 'TimecampusAuth', this._isList, this._callsite);
        }
        return this._requestPromise.finally(onfinally);
    }
}
exports.TimecampusAuthClient = TimecampusAuthClient;
function ChannelAuthDelegate(dmmf, fetcher) {
    const ChannelAuth = (args) => new ChannelAuthClient(dmmf, fetcher, 'query', 'findManyChannelAuth', 'channelAuths', args, []);
    ChannelAuth.findOne = (args) => args.select ? new ChannelAuthClient(dmmf, fetcher, 'query', 'findOneChannelAuth', 'channelAuths.findOne', args, []) : new ChannelAuthClient(dmmf, fetcher, 'query', 'findOneChannelAuth', 'channelAuths.findOne', args, []);
    ChannelAuth.findMany = (args) => new ChannelAuthClient(dmmf, fetcher, 'query', 'findManyChannelAuth', 'channelAuths.findMany', args, []);
    ChannelAuth.create = (args) => args.select ? new ChannelAuthClient(dmmf, fetcher, 'mutation', 'createOneChannelAuth', 'channelAuths.create', args, []) : new ChannelAuthClient(dmmf, fetcher, 'mutation', 'createOneChannelAuth', 'channelAuths.create', args, []);
    ChannelAuth.delete = (args) => args.select ? new ChannelAuthClient(dmmf, fetcher, 'mutation', 'deleteOneChannelAuth', 'channelAuths.delete', args, []) : new ChannelAuthClient(dmmf, fetcher, 'mutation', 'deleteOneChannelAuth', 'channelAuths.delete', args, []);
    ChannelAuth.update = (args) => args.select ? new ChannelAuthClient(dmmf, fetcher, 'mutation', 'updateOneChannelAuth', 'channelAuths.update', args, []) : new ChannelAuthClient(dmmf, fetcher, 'mutation', 'updateOneChannelAuth', 'channelAuths.update', args, []);
    ChannelAuth.deleteMany = (args) => new ChannelAuthClient(dmmf, fetcher, 'mutation', 'deleteManyChannelAuth', 'channelAuths.deleteMany', args, []);
    ChannelAuth.updateMany = (args) => new ChannelAuthClient(dmmf, fetcher, 'mutation', 'updateManyChannelAuth', 'channelAuths.updateMany', args, []);
    ChannelAuth.upsert = (args) => args.select ? new ChannelAuthClient(dmmf, fetcher, 'mutation', 'upsertOneChannelAuth', 'channelAuths.upsert', args, []) : new ChannelAuthClient(dmmf, fetcher, 'mutation', 'upsertOneChannelAuth', 'channelAuths.upsert', args, []);
    ChannelAuth.count = () => new ChannelAuthClient(dmmf, fetcher, 'query', 'aggregateChannelAuth', 'channelAuths.count', {}, ['count']);
    return ChannelAuth; // any needed until https://github.com/microsoft/TypeScript/issues/31335 is resolved
}
class ChannelAuthClient {
    constructor(_dmmf, _fetcher, _queryType, _rootField, _clientMethod, _args, _path, _isList = false) {
        this._dmmf = _dmmf;
        this._fetcher = _fetcher;
        this._queryType = _queryType;
        this._rootField = _rootField;
        this._clientMethod = _clientMethod;
        this._args = _args;
        this._path = _path;
        this._isList = _isList;
        // @ts-ignore
        if (typeof window === 'undefined' && process.env.NODE_ENV !== 'production') {
            const error = new Error();
            if (error && error.stack) {
                const stack = error.stack;
                this._callsite = stack;
            }
        }
    }
    scopes(args) {
        const prefix = this._path.includes('select') ? 'select' : this._path.includes('include') ? 'include' : 'select';
        const path = [...this._path, prefix, 'scopes'];
        const newArgs = runtime_1.deepSet(this._args, path, args || true);
        this._isList = true;
        return new TimecampusAuthClient(this._dmmf, this._fetcher, this._queryType, this._rootField, this._clientMethod, newArgs, path, this._isList);
    }
    get _document() {
        const { _rootField: rootField } = this;
        const document = runtime_1.makeDocument({
            dmmf: this._dmmf,
            rootField,
            rootTypeName: this._queryType,
            select: this._args
        });
        try {
            document.validate(this._args, false, this._clientMethod);
        }
        catch (e) {
            const x = e;
            if (x.render) {
                if (this._callsite) {
                    e.message = x.render(this._callsite);
                }
            }
            throw e;
        }
        return runtime_1.transformDocument(document);
    }
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then(onfulfilled, onrejected) {
        if (!this._requestPromise) {
            this._requestPromise = this._fetcher.request(this._document, this._path, this._rootField, 'ChannelAuth', this._isList, this._callsite);
        }
        return this._requestPromise.then(onfulfilled, onrejected);
    }
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch(onrejected) {
        if (!this._requestPromise) {
            this._requestPromise = this._fetcher.request(this._document, this._path, this._rootField, 'ChannelAuth', this._isList, this._callsite);
        }
        return this._requestPromise.catch(onrejected);
    }
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally) {
        if (!this._requestPromise) {
            this._requestPromise = this._fetcher.request(this._document, this._path, this._rootField, 'ChannelAuth', this._isList, this._callsite);
        }
        return this._requestPromise.finally(onfinally);
    }
}
exports.ChannelAuthClient = ChannelAuthClient;
function AuditLogsDelegate(dmmf, fetcher) {
    const AuditLogs = (args) => new AuditLogsClient(dmmf, fetcher, 'query', 'findManyAuditLogs', 'auditLogs', args, []);
    AuditLogs.findOne = (args) => args.select ? new AuditLogsClient(dmmf, fetcher, 'query', 'findOneAuditLogs', 'auditLogs.findOne', args, []) : new AuditLogsClient(dmmf, fetcher, 'query', 'findOneAuditLogs', 'auditLogs.findOne', args, []);
    AuditLogs.findMany = (args) => new AuditLogsClient(dmmf, fetcher, 'query', 'findManyAuditLogs', 'auditLogs.findMany', args, []);
    AuditLogs.create = (args) => args.select ? new AuditLogsClient(dmmf, fetcher, 'mutation', 'createOneAuditLogs', 'auditLogs.create', args, []) : new AuditLogsClient(dmmf, fetcher, 'mutation', 'createOneAuditLogs', 'auditLogs.create', args, []);
    AuditLogs.delete = (args) => args.select ? new AuditLogsClient(dmmf, fetcher, 'mutation', 'deleteOneAuditLogs', 'auditLogs.delete', args, []) : new AuditLogsClient(dmmf, fetcher, 'mutation', 'deleteOneAuditLogs', 'auditLogs.delete', args, []);
    AuditLogs.update = (args) => args.select ? new AuditLogsClient(dmmf, fetcher, 'mutation', 'updateOneAuditLogs', 'auditLogs.update', args, []) : new AuditLogsClient(dmmf, fetcher, 'mutation', 'updateOneAuditLogs', 'auditLogs.update', args, []);
    AuditLogs.deleteMany = (args) => new AuditLogsClient(dmmf, fetcher, 'mutation', 'deleteManyAuditLogs', 'auditLogs.deleteMany', args, []);
    AuditLogs.updateMany = (args) => new AuditLogsClient(dmmf, fetcher, 'mutation', 'updateManyAuditLogs', 'auditLogs.updateMany', args, []);
    AuditLogs.upsert = (args) => args.select ? new AuditLogsClient(dmmf, fetcher, 'mutation', 'upsertOneAuditLogs', 'auditLogs.upsert', args, []) : new AuditLogsClient(dmmf, fetcher, 'mutation', 'upsertOneAuditLogs', 'auditLogs.upsert', args, []);
    AuditLogs.count = () => new AuditLogsClient(dmmf, fetcher, 'query', 'aggregateAuditLogs', 'auditLogs.count', {}, ['count']);
    return AuditLogs; // any needed until https://github.com/microsoft/TypeScript/issues/31335 is resolved
}
class AuditLogsClient {
    constructor(_dmmf, _fetcher, _queryType, _rootField, _clientMethod, _args, _path, _isList = false) {
        this._dmmf = _dmmf;
        this._fetcher = _fetcher;
        this._queryType = _queryType;
        this._rootField = _rootField;
        this._clientMethod = _clientMethod;
        this._args = _args;
        this._path = _path;
        this._isList = _isList;
        // @ts-ignore
        if (typeof window === 'undefined' && process.env.NODE_ENV !== 'production') {
            const error = new Error();
            if (error && error.stack) {
                const stack = error.stack;
                this._callsite = stack;
            }
        }
    }
    get _document() {
        const { _rootField: rootField } = this;
        const document = runtime_1.makeDocument({
            dmmf: this._dmmf,
            rootField,
            rootTypeName: this._queryType,
            select: this._args
        });
        try {
            document.validate(this._args, false, this._clientMethod);
        }
        catch (e) {
            const x = e;
            if (x.render) {
                if (this._callsite) {
                    e.message = x.render(this._callsite);
                }
            }
            throw e;
        }
        return runtime_1.transformDocument(document);
    }
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then(onfulfilled, onrejected) {
        if (!this._requestPromise) {
            this._requestPromise = this._fetcher.request(this._document, this._path, this._rootField, 'AuditLogs', this._isList, this._callsite);
        }
        return this._requestPromise.then(onfulfilled, onrejected);
    }
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch(onrejected) {
        if (!this._requestPromise) {
            this._requestPromise = this._fetcher.request(this._document, this._path, this._rootField, 'AuditLogs', this._isList, this._callsite);
        }
        return this._requestPromise.catch(onrejected);
    }
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally) {
        if (!this._requestPromise) {
            this._requestPromise = this._fetcher.request(this._document, this._path, this._rootField, 'AuditLogs', this._isList, this._callsite);
        }
        return this._requestPromise.finally(onfinally);
    }
}
exports.AuditLogsClient = AuditLogsClient;
/**
 * DMMF
 */
exports.dmmf = { "datamodel": { "enums": [], "models": [{ "name": "TimecampusAuth", "isEmbedded": false, "dbName": null, "fields": [{ "name": "id", "kind": "scalar", "dbName": null, "isList": false, "isRequired": true, "isUnique": false, "isId": true, "type": "String", "default": { "name": "cuid", "returnType": "String", "args": [] }, "isGenerated": false, "isUpdatedAt": false }, { "name": "scope", "kind": "scalar", "dbName": null, "isList": false, "isRequired": true, "isUnique": false, "isId": false, "type": "String", "isGenerated": false, "isUpdatedAt": false }, { "name": "channelAuth", "kind": "object", "dbName": null, "isList": false, "isRequired": false, "isUnique": false, "isId": false, "type": "ChannelAuth", "relationName": "ChannelAuthToTimecampusAuth", "relationToFields": ["id"], "relationOnDelete": "NONE", "isGenerated": true, "isUpdatedAt": false }], "isGenerated": false, "idFields": [] }, { "name": "ChannelAuth", "isEmbedded": false, "dbName": null, "fields": [{ "name": "id", "kind": "scalar", "dbName": null, "isList": false, "isRequired": true, "isUnique": false, "isId": true, "type": "String", "default": { "name": "cuid", "returnType": "String", "args": [] }, "isGenerated": false, "isUpdatedAt": false }, { "name": "userID", "kind": "scalar", "dbName": null, "isList": false, "isRequired": true, "isUnique": true, "isId": false, "type": "String", "isGenerated": false, "isUpdatedAt": false }, { "name": "channelID", "kind": "scalar", "dbName": null, "isList": false, "isRequired": true, "isUnique": true, "isId": false, "type": "String", "isGenerated": false, "isUpdatedAt": false }, { "name": "whatsappno", "kind": "scalar", "dbName": null, "isList": false, "isRequired": false, "isUnique": false, "isId": false, "type": "String", "isGenerated": false, "isUpdatedAt": false }, { "name": "status", "kind": "scalar", "dbName": null, "isList": false, "isRequired": true, "isUnique": false, "isId": false, "type": "String", "isGenerated": false, "isUpdatedAt": false }, { "name": "providerData", "kind": "scalar", "dbName": null, "isList": false, "isRequired": false, "isUnique": false, "isId": false, "type": "String", "isGenerated": false, "isUpdatedAt": false }, { "name": "providerToken", "kind": "scalar", "dbName": null, "isList": false, "isRequired": false, "isUnique": false, "isId": false, "type": "String", "isGenerated": false, "isUpdatedAt": false }, { "name": "userConfig", "kind": "scalar", "dbName": null, "isList": false, "isRequired": false, "isUnique": false, "isId": false, "type": "String", "isGenerated": false, "isUpdatedAt": false }, { "name": "scopes", "kind": "object", "dbName": null, "isList": true, "isRequired": false, "isUnique": false, "isId": false, "type": "TimecampusAuth", "relationName": "ChannelAuthToTimecampusAuth", "relationToFields": [], "relationOnDelete": "NONE", "isGenerated": false, "isUpdatedAt": false }, { "name": "createdDate", "kind": "scalar", "dbName": null, "isList": false, "isRequired": true, "isUnique": false, "isId": false, "type": "DateTime", "default": { "name": "now", "returnType": "DateTime", "args": [] }, "isGenerated": false, "isUpdatedAt": false }, { "name": "updatedDate", "kind": "scalar", "dbName": null, "isList": false, "isRequired": true, "isUnique": false, "isId": false, "type": "DateTime", "isGenerated": false, "isUpdatedAt": true }], "isGenerated": false, "idFields": [] }, { "name": "AuditLogs", "isEmbedded": false, "dbName": null, "fields": [{ "name": "id", "kind": "scalar", "dbName": null, "isList": false, "isRequired": true, "isUnique": false, "isId": true, "type": "String", "default": { "name": "cuid", "returnType": "String", "args": [] }, "isGenerated": false, "isUpdatedAt": false }, { "name": "userID", "kind": "scalar", "dbName": null, "isList": false, "isRequired": true, "isUnique": true, "isId": false, "type": "String", "isGenerated": false, "isUpdatedAt": false }, { "name": "whatsappno", "kind": "scalar", "dbName": null, "isList": false, "isRequired": true, "isUnique": false, "isId": false, "type": "String", "isGenerated": false, "isUpdatedAt": false }, { "name": "message", "kind": "scalar", "dbName": null, "isList": false, "isRequired": true, "isUnique": false, "isId": false, "type": "String", "isGenerated": false, "isUpdatedAt": false }, { "name": "direction", "kind": "scalar", "dbName": null, "isList": false, "isRequired": true, "isUnique": false, "isId": false, "type": "String", "isGenerated": false, "isUpdatedAt": false }, { "name": "metadata", "kind": "scalar", "dbName": null, "isList": false, "isRequired": false, "isUnique": false, "isId": false, "type": "String", "isGenerated": false, "isUpdatedAt": false }, { "name": "createdDate", "kind": "scalar", "dbName": null, "isList": false, "isRequired": true, "isUnique": false, "isId": false, "type": "DateTime", "default": { "name": "now", "returnType": "DateTime", "args": [] }, "isGenerated": false, "isUpdatedAt": false }, { "name": "updatedDate", "kind": "scalar", "dbName": null, "isList": false, "isRequired": true, "isUnique": false, "isId": false, "type": "DateTime", "isGenerated": false, "isUpdatedAt": true }], "isGenerated": false, "idFields": [] }] }, "mappings": [{ "model": "TimecampusAuth", "plural": "timecampusAuths", "findOne": "findOneTimecampusAuth", "findMany": "findManyTimecampusAuth", "create": "createOneTimecampusAuth", "delete": "deleteOneTimecampusAuth", "update": "updateOneTimecampusAuth", "deleteMany": "deleteManyTimecampusAuth", "updateMany": "updateManyTimecampusAuth", "upsert": "upsertOneTimecampusAuth", "aggregate": "aggregateTimecampusAuth" }, { "model": "ChannelAuth", "plural": "channelAuths", "findOne": "findOneChannelAuth", "findMany": "findManyChannelAuth", "create": "createOneChannelAuth", "delete": "deleteOneChannelAuth", "update": "updateOneChannelAuth", "deleteMany": "deleteManyChannelAuth", "updateMany": "updateManyChannelAuth", "upsert": "upsertOneChannelAuth", "aggregate": "aggregateChannelAuth" }, { "model": "AuditLogs", "plural": "auditLogs", "findOne": "findOneAuditLogs", "findMany": "findManyAuditLogs", "create": "createOneAuditLogs", "delete": "deleteOneAuditLogs", "update": "updateOneAuditLogs", "deleteMany": "deleteManyAuditLogs", "updateMany": "updateManyAuditLogs", "upsert": "upsertOneAuditLogs", "aggregate": "aggregateAuditLogs" }], "schema": { "enums": [{ "name": "OrderByArg", "values": ["asc", "desc"] }], "outputTypes": [{ "name": "ChannelAuth", "fields": [{ "name": "id", "args": [], "outputType": { "type": "ID", "kind": "scalar", "isRequired": true, "isList": false } }, { "name": "userID", "args": [], "outputType": { "type": "String", "kind": "scalar", "isRequired": true, "isList": false } }, { "name": "channelID", "args": [], "outputType": { "type": "String", "kind": "scalar", "isRequired": true, "isList": false } }, { "name": "whatsappno", "args": [], "outputType": { "type": "String", "kind": "scalar", "isRequired": false, "isList": false } }, { "name": "status", "args": [], "outputType": { "type": "String", "kind": "scalar", "isRequired": true, "isList": false } }, { "name": "providerData", "args": [], "outputType": { "type": "String", "kind": "scalar", "isRequired": false, "isList": false } }, { "name": "providerToken", "args": [], "outputType": { "type": "String", "kind": "scalar", "isRequired": false, "isList": false } }, { "name": "userConfig", "args": [], "outputType": { "type": "String", "kind": "scalar", "isRequired": false, "isList": false } }, { "name": "scopes", "args": [{ "name": "where", "inputType": [{ "type": "TimecampusAuthWhereInput", "kind": "object", "isRequired": false, "isList": false }] }, { "name": "orderBy", "inputType": [{ "isList": false, "isRequired": false, "type": "TimecampusAuthOrderByInput", "kind": "object" }] }, { "name": "skip", "inputType": [{ "type": "Int", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "after", "inputType": [{ "type": "ID", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "before", "inputType": [{ "type": "ID", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "first", "inputType": [{ "type": "Int", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "last", "inputType": [{ "type": "Int", "kind": "scalar", "isRequired": false, "isList": false }] }], "outputType": { "type": "TimecampusAuth", "kind": "object", "isRequired": false, "isList": true } }, { "name": "createdDate", "args": [], "outputType": { "type": "DateTime", "kind": "scalar", "isRequired": true, "isList": false } }, { "name": "updatedDate", "args": [], "outputType": { "type": "DateTime", "kind": "scalar", "isRequired": true, "isList": false } }] }, { "name": "TimecampusAuth", "fields": [{ "name": "id", "args": [], "outputType": { "type": "ID", "kind": "scalar", "isRequired": true, "isList": false } }, { "name": "scope", "args": [], "outputType": { "type": "String", "kind": "scalar", "isRequired": true, "isList": false } }, { "name": "channelAuth", "args": [], "outputType": { "type": "ChannelAuth", "kind": "object", "isRequired": false, "isList": false } }] }, { "name": "AggregateTimecampusAuth", "fields": [{ "name": "count", "args": [], "outputType": { "type": "Int", "kind": "scalar", "isRequired": true, "isList": false } }] }, { "name": "AggregateChannelAuth", "fields": [{ "name": "count", "args": [], "outputType": { "type": "Int", "kind": "scalar", "isRequired": true, "isList": false } }] }, { "name": "AuditLogs", "fields": [{ "name": "id", "args": [], "outputType": { "type": "ID", "kind": "scalar", "isRequired": true, "isList": false } }, { "name": "userID", "args": [], "outputType": { "type": "String", "kind": "scalar", "isRequired": true, "isList": false } }, { "name": "whatsappno", "args": [], "outputType": { "type": "String", "kind": "scalar", "isRequired": true, "isList": false } }, { "name": "message", "args": [], "outputType": { "type": "String", "kind": "scalar", "isRequired": true, "isList": false } }, { "name": "direction", "args": [], "outputType": { "type": "String", "kind": "scalar", "isRequired": true, "isList": false } }, { "name": "metadata", "args": [], "outputType": { "type": "String", "kind": "scalar", "isRequired": false, "isList": false } }, { "name": "createdDate", "args": [], "outputType": { "type": "DateTime", "kind": "scalar", "isRequired": true, "isList": false } }, { "name": "updatedDate", "args": [], "outputType": { "type": "DateTime", "kind": "scalar", "isRequired": true, "isList": false } }] }, { "name": "AggregateAuditLogs", "fields": [{ "name": "count", "args": [], "outputType": { "type": "Int", "kind": "scalar", "isRequired": true, "isList": false } }] }, { "name": "Query", "fields": [{ "name": "findManyTimecampusAuth", "args": [{ "name": "where", "inputType": [{ "type": "TimecampusAuthWhereInput", "kind": "object", "isRequired": false, "isList": false }] }, { "name": "orderBy", "inputType": [{ "isList": false, "isRequired": false, "type": "TimecampusAuthOrderByInput", "kind": "object" }] }, { "name": "skip", "inputType": [{ "type": "Int", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "after", "inputType": [{ "type": "ID", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "before", "inputType": [{ "type": "ID", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "first", "inputType": [{ "type": "Int", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "last", "inputType": [{ "type": "Int", "kind": "scalar", "isRequired": false, "isList": false }] }], "outputType": { "type": "TimecampusAuth", "kind": "object", "isRequired": true, "isList": true } }, { "name": "aggregateTimecampusAuth", "args": [], "outputType": { "type": "AggregateTimecampusAuth", "kind": "object", "isRequired": true, "isList": false } }, { "name": "findOneTimecampusAuth", "args": [{ "name": "where", "inputType": [{ "type": "TimecampusAuthWhereUniqueInput", "kind": "object", "isRequired": true, "isList": false }] }], "outputType": { "type": "TimecampusAuth", "kind": "object", "isRequired": false, "isList": false } }, { "name": "findManyChannelAuth", "args": [{ "name": "where", "inputType": [{ "type": "ChannelAuthWhereInput", "kind": "object", "isRequired": false, "isList": false }] }, { "name": "orderBy", "inputType": [{ "isList": false, "isRequired": false, "type": "ChannelAuthOrderByInput", "kind": "object" }] }, { "name": "skip", "inputType": [{ "type": "Int", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "after", "inputType": [{ "type": "ID", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "before", "inputType": [{ "type": "ID", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "first", "inputType": [{ "type": "Int", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "last", "inputType": [{ "type": "Int", "kind": "scalar", "isRequired": false, "isList": false }] }], "outputType": { "type": "ChannelAuth", "kind": "object", "isRequired": true, "isList": true } }, { "name": "aggregateChannelAuth", "args": [], "outputType": { "type": "AggregateChannelAuth", "kind": "object", "isRequired": true, "isList": false } }, { "name": "findOneChannelAuth", "args": [{ "name": "where", "inputType": [{ "type": "ChannelAuthWhereUniqueInput", "kind": "object", "isRequired": true, "isList": false }] }], "outputType": { "type": "ChannelAuth", "kind": "object", "isRequired": false, "isList": false } }, { "name": "findManyAuditLogs", "args": [{ "name": "where", "inputType": [{ "type": "AuditLogsWhereInput", "kind": "object", "isRequired": false, "isList": false }] }, { "name": "orderBy", "inputType": [{ "isList": false, "isRequired": false, "type": "AuditLogsOrderByInput", "kind": "object" }] }, { "name": "skip", "inputType": [{ "type": "Int", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "after", "inputType": [{ "type": "ID", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "before", "inputType": [{ "type": "ID", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "first", "inputType": [{ "type": "Int", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "last", "inputType": [{ "type": "Int", "kind": "scalar", "isRequired": false, "isList": false }] }], "outputType": { "type": "AuditLogs", "kind": "object", "isRequired": true, "isList": true } }, { "name": "aggregateAuditLogs", "args": [], "outputType": { "type": "AggregateAuditLogs", "kind": "object", "isRequired": true, "isList": false } }, { "name": "findOneAuditLogs", "args": [{ "name": "where", "inputType": [{ "type": "AuditLogsWhereUniqueInput", "kind": "object", "isRequired": true, "isList": false }] }], "outputType": { "type": "AuditLogs", "kind": "object", "isRequired": false, "isList": false } }] }, { "name": "BatchPayload", "fields": [{ "name": "count", "args": [], "outputType": { "type": "Int", "kind": "scalar", "isRequired": true, "isList": false } }] }, { "name": "Mutation", "fields": [{ "name": "createOneTimecampusAuth", "args": [{ "name": "data", "inputType": [{ "type": "TimecampusAuthCreateInput", "kind": "object", "isRequired": true, "isList": false }] }], "outputType": { "type": "TimecampusAuth", "kind": "object", "isRequired": true, "isList": false } }, { "name": "deleteOneTimecampusAuth", "args": [{ "name": "where", "inputType": [{ "type": "TimecampusAuthWhereUniqueInput", "kind": "object", "isRequired": true, "isList": false }] }], "outputType": { "type": "TimecampusAuth", "kind": "object", "isRequired": false, "isList": false } }, { "name": "updateOneTimecampusAuth", "args": [{ "name": "data", "inputType": [{ "type": "TimecampusAuthUpdateInput", "kind": "object", "isRequired": true, "isList": false }] }, { "name": "where", "inputType": [{ "type": "TimecampusAuthWhereUniqueInput", "kind": "object", "isRequired": true, "isList": false }] }], "outputType": { "type": "TimecampusAuth", "kind": "object", "isRequired": false, "isList": false } }, { "name": "upsertOneTimecampusAuth", "args": [{ "name": "where", "inputType": [{ "type": "TimecampusAuthWhereUniqueInput", "kind": "object", "isRequired": true, "isList": false }] }, { "name": "create", "inputType": [{ "type": "TimecampusAuthCreateInput", "kind": "object", "isRequired": true, "isList": false }] }, { "name": "update", "inputType": [{ "type": "TimecampusAuthUpdateInput", "kind": "object", "isRequired": true, "isList": false }] }], "outputType": { "type": "TimecampusAuth", "kind": "object", "isRequired": true, "isList": false } }, { "name": "updateManyTimecampusAuth", "args": [{ "name": "data", "inputType": [{ "type": "TimecampusAuthUpdateManyMutationInput", "kind": "object", "isRequired": true, "isList": false }] }, { "name": "where", "inputType": [{ "type": "TimecampusAuthWhereInput", "kind": "object", "isRequired": false, "isList": false }] }], "outputType": { "type": "BatchPayload", "kind": "object", "isRequired": true, "isList": false } }, { "name": "deleteManyTimecampusAuth", "args": [{ "name": "where", "inputType": [{ "type": "TimecampusAuthWhereInput", "kind": "object", "isRequired": false, "isList": false }] }], "outputType": { "type": "BatchPayload", "kind": "object", "isRequired": true, "isList": false } }, { "name": "createOneChannelAuth", "args": [{ "name": "data", "inputType": [{ "type": "ChannelAuthCreateInput", "kind": "object", "isRequired": true, "isList": false }] }], "outputType": { "type": "ChannelAuth", "kind": "object", "isRequired": true, "isList": false } }, { "name": "deleteOneChannelAuth", "args": [{ "name": "where", "inputType": [{ "type": "ChannelAuthWhereUniqueInput", "kind": "object", "isRequired": true, "isList": false }] }], "outputType": { "type": "ChannelAuth", "kind": "object", "isRequired": false, "isList": false } }, { "name": "updateOneChannelAuth", "args": [{ "name": "data", "inputType": [{ "type": "ChannelAuthUpdateInput", "kind": "object", "isRequired": true, "isList": false }] }, { "name": "where", "inputType": [{ "type": "ChannelAuthWhereUniqueInput", "kind": "object", "isRequired": true, "isList": false }] }], "outputType": { "type": "ChannelAuth", "kind": "object", "isRequired": false, "isList": false } }, { "name": "upsertOneChannelAuth", "args": [{ "name": "where", "inputType": [{ "type": "ChannelAuthWhereUniqueInput", "kind": "object", "isRequired": true, "isList": false }] }, { "name": "create", "inputType": [{ "type": "ChannelAuthCreateInput", "kind": "object", "isRequired": true, "isList": false }] }, { "name": "update", "inputType": [{ "type": "ChannelAuthUpdateInput", "kind": "object", "isRequired": true, "isList": false }] }], "outputType": { "type": "ChannelAuth", "kind": "object", "isRequired": true, "isList": false } }, { "name": "updateManyChannelAuth", "args": [{ "name": "data", "inputType": [{ "type": "ChannelAuthUpdateManyMutationInput", "kind": "object", "isRequired": true, "isList": false }] }, { "name": "where", "inputType": [{ "type": "ChannelAuthWhereInput", "kind": "object", "isRequired": false, "isList": false }] }], "outputType": { "type": "BatchPayload", "kind": "object", "isRequired": true, "isList": false } }, { "name": "deleteManyChannelAuth", "args": [{ "name": "where", "inputType": [{ "type": "ChannelAuthWhereInput", "kind": "object", "isRequired": false, "isList": false }] }], "outputType": { "type": "BatchPayload", "kind": "object", "isRequired": true, "isList": false } }, { "name": "createOneAuditLogs", "args": [{ "name": "data", "inputType": [{ "type": "AuditLogsCreateInput", "kind": "object", "isRequired": true, "isList": false }] }], "outputType": { "type": "AuditLogs", "kind": "object", "isRequired": true, "isList": false } }, { "name": "deleteOneAuditLogs", "args": [{ "name": "where", "inputType": [{ "type": "AuditLogsWhereUniqueInput", "kind": "object", "isRequired": true, "isList": false }] }], "outputType": { "type": "AuditLogs", "kind": "object", "isRequired": false, "isList": false } }, { "name": "updateOneAuditLogs", "args": [{ "name": "data", "inputType": [{ "type": "AuditLogsUpdateInput", "kind": "object", "isRequired": true, "isList": false }] }, { "name": "where", "inputType": [{ "type": "AuditLogsWhereUniqueInput", "kind": "object", "isRequired": true, "isList": false }] }], "outputType": { "type": "AuditLogs", "kind": "object", "isRequired": false, "isList": false } }, { "name": "upsertOneAuditLogs", "args": [{ "name": "where", "inputType": [{ "type": "AuditLogsWhereUniqueInput", "kind": "object", "isRequired": true, "isList": false }] }, { "name": "create", "inputType": [{ "type": "AuditLogsCreateInput", "kind": "object", "isRequired": true, "isList": false }] }, { "name": "update", "inputType": [{ "type": "AuditLogsUpdateInput", "kind": "object", "isRequired": true, "isList": false }] }], "outputType": { "type": "AuditLogs", "kind": "object", "isRequired": true, "isList": false } }, { "name": "updateManyAuditLogs", "args": [{ "name": "data", "inputType": [{ "type": "AuditLogsUpdateManyMutationInput", "kind": "object", "isRequired": true, "isList": false }] }, { "name": "where", "inputType": [{ "type": "AuditLogsWhereInput", "kind": "object", "isRequired": false, "isList": false }] }], "outputType": { "type": "BatchPayload", "kind": "object", "isRequired": true, "isList": false } }, { "name": "deleteManyAuditLogs", "args": [{ "name": "where", "inputType": [{ "type": "AuditLogsWhereInput", "kind": "object", "isRequired": false, "isList": false }] }], "outputType": { "type": "BatchPayload", "kind": "object", "isRequired": true, "isList": false } }] }], "inputTypes": [{ "name": "ChannelAuthWhereInput", "fields": [{ "name": "id", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }, { "type": "StringFilter", "isList": false, "isRequired": false, "kind": "object" }], "isRelationFilter": false }, { "name": "userID", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }, { "type": "StringFilter", "isList": false, "isRequired": false, "kind": "object" }], "isRelationFilter": false }, { "name": "channelID", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }, { "type": "StringFilter", "isList": false, "isRequired": false, "kind": "object" }], "isRelationFilter": false }, { "name": "whatsappno", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }, { "type": "NullableStringFilter", "isList": false, "isRequired": false, "kind": "object" }, { "type": "null", "isList": false, "isRequired": false, "kind": "scalar" }], "isRelationFilter": false }, { "name": "status", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }, { "type": "StringFilter", "isList": false, "isRequired": false, "kind": "object" }], "isRelationFilter": false }, { "name": "providerData", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }, { "type": "NullableStringFilter", "isList": false, "isRequired": false, "kind": "object" }, { "type": "null", "isList": false, "isRequired": false, "kind": "scalar" }], "isRelationFilter": false }, { "name": "providerToken", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }, { "type": "NullableStringFilter", "isList": false, "isRequired": false, "kind": "object" }, { "type": "null", "isList": false, "isRequired": false, "kind": "scalar" }], "isRelationFilter": false }, { "name": "userConfig", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }, { "type": "NullableStringFilter", "isList": false, "isRequired": false, "kind": "object" }, { "type": "null", "isList": false, "isRequired": false, "kind": "scalar" }], "isRelationFilter": false }, { "name": "scopes", "inputType": [{ "type": "TimecampusAuthFilter", "isList": false, "isRequired": false, "kind": "object" }], "isRelationFilter": false }, { "name": "createdDate", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "DateTime" }, { "type": "DateTimeFilter", "isList": false, "isRequired": false, "kind": "object" }], "isRelationFilter": false }, { "name": "updatedDate", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "DateTime" }, { "type": "DateTimeFilter", "isList": false, "isRequired": false, "kind": "object" }], "isRelationFilter": false }, { "name": "AND", "inputType": [{ "type": "ChannelAuthWhereInput", "kind": "object", "isRequired": false, "isList": true }], "isRelationFilter": true }, { "name": "OR", "inputType": [{ "type": "ChannelAuthWhereInput", "kind": "object", "isRequired": false, "isList": true }], "isRelationFilter": true }, { "name": "NOT", "inputType": [{ "type": "ChannelAuthWhereInput", "kind": "object", "isRequired": false, "isList": true }], "isRelationFilter": true }], "isWhereType": true, "atLeastOne": false }, { "name": "TimecampusAuthWhereInput", "fields": [{ "name": "id", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }, { "type": "StringFilter", "isList": false, "isRequired": false, "kind": "object" }], "isRelationFilter": false }, { "name": "scope", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }, { "type": "StringFilter", "isList": false, "isRequired": false, "kind": "object" }], "isRelationFilter": false }, { "name": "AND", "inputType": [{ "type": "TimecampusAuthWhereInput", "kind": "object", "isRequired": false, "isList": true }], "isRelationFilter": true }, { "name": "OR", "inputType": [{ "type": "TimecampusAuthWhereInput", "kind": "object", "isRequired": false, "isList": true }], "isRelationFilter": true }, { "name": "NOT", "inputType": [{ "type": "TimecampusAuthWhereInput", "kind": "object", "isRequired": false, "isList": true }], "isRelationFilter": true }, { "name": "channelAuth", "inputType": [{ "type": "ChannelAuthWhereInput", "kind": "object", "isRequired": false, "isList": false }], "isRelationFilter": true }], "isWhereType": true, "atLeastOne": false }, { "name": "TimecampusAuthWhereUniqueInput", "fields": [{ "name": "id", "inputType": [{ "type": "ID", "kind": "scalar", "isRequired": false, "isList": false }] }], "atLeastOne": true }, { "name": "ChannelAuthWhereUniqueInput", "fields": [{ "name": "id", "inputType": [{ "type": "ID", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "userID", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "channelID", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }], "atLeastOne": true }, { "name": "AuditLogsWhereInput", "fields": [{ "name": "id", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }, { "type": "StringFilter", "isList": false, "isRequired": false, "kind": "object" }], "isRelationFilter": false }, { "name": "userID", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }, { "type": "StringFilter", "isList": false, "isRequired": false, "kind": "object" }], "isRelationFilter": false }, { "name": "whatsappno", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }, { "type": "StringFilter", "isList": false, "isRequired": false, "kind": "object" }], "isRelationFilter": false }, { "name": "message", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }, { "type": "StringFilter", "isList": false, "isRequired": false, "kind": "object" }], "isRelationFilter": false }, { "name": "direction", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }, { "type": "StringFilter", "isList": false, "isRequired": false, "kind": "object" }], "isRelationFilter": false }, { "name": "metadata", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }, { "type": "NullableStringFilter", "isList": false, "isRequired": false, "kind": "object" }, { "type": "null", "isList": false, "isRequired": false, "kind": "scalar" }], "isRelationFilter": false }, { "name": "createdDate", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "DateTime" }, { "type": "DateTimeFilter", "isList": false, "isRequired": false, "kind": "object" }], "isRelationFilter": false }, { "name": "updatedDate", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "DateTime" }, { "type": "DateTimeFilter", "isList": false, "isRequired": false, "kind": "object" }], "isRelationFilter": false }, { "name": "AND", "inputType": [{ "type": "AuditLogsWhereInput", "kind": "object", "isRequired": false, "isList": true }], "isRelationFilter": true }, { "name": "OR", "inputType": [{ "type": "AuditLogsWhereInput", "kind": "object", "isRequired": false, "isList": true }], "isRelationFilter": true }, { "name": "NOT", "inputType": [{ "type": "AuditLogsWhereInput", "kind": "object", "isRequired": false, "isList": true }], "isRelationFilter": true }], "isWhereType": true, "atLeastOne": false }, { "name": "AuditLogsWhereUniqueInput", "fields": [{ "name": "id", "inputType": [{ "type": "ID", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "userID", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }], "atLeastOne": true }, { "name": "ChannelAuthCreateWithoutScopesInput", "fields": [{ "name": "id", "inputType": [{ "type": "ID", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "userID", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": true, "isList": false }] }, { "name": "channelID", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": true, "isList": false }] }, { "name": "whatsappno", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "status", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": true, "isList": false }] }, { "name": "providerData", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "providerToken", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "userConfig", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "createdDate", "inputType": [{ "type": "DateTime", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "updatedDate", "inputType": [{ "type": "DateTime", "kind": "scalar", "isRequired": false, "isList": false }] }] }, { "name": "ChannelAuthCreateOneWithoutChannelAuthInput", "fields": [{ "name": "create", "inputType": [{ "type": "ChannelAuthCreateWithoutScopesInput", "kind": "object", "isRequired": false, "isList": false }] }, { "name": "connect", "inputType": [{ "type": "ChannelAuthWhereUniqueInput", "kind": "object", "isRequired": false, "isList": false }] }] }, { "name": "TimecampusAuthCreateInput", "fields": [{ "name": "id", "inputType": [{ "type": "ID", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "scope", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": true, "isList": false }] }, { "name": "channelAuth", "inputType": [{ "type": "ChannelAuthCreateOneWithoutChannelAuthInput", "kind": "object", "isRequired": false, "isList": false }] }] }, { "name": "ChannelAuthUpdateWithoutScopesDataInput", "fields": [{ "name": "id", "inputType": [{ "type": "ID", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "userID", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "channelID", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "whatsappno", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "status", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "providerData", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "providerToken", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "userConfig", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "createdDate", "inputType": [{ "type": "DateTime", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "updatedDate", "inputType": [{ "type": "DateTime", "kind": "scalar", "isRequired": false, "isList": false }] }] }, { "name": "ChannelAuthUpsertWithoutScopesInput", "fields": [{ "name": "update", "inputType": [{ "type": "ChannelAuthUpdateWithoutScopesDataInput", "kind": "object", "isRequired": true, "isList": false }] }, { "name": "create", "inputType": [{ "type": "ChannelAuthCreateWithoutScopesInput", "kind": "object", "isRequired": true, "isList": false }] }] }, { "name": "ChannelAuthUpdateOneWithoutScopesInput", "fields": [{ "name": "create", "inputType": [{ "type": "ChannelAuthCreateWithoutScopesInput", "kind": "object", "isRequired": false, "isList": false }] }, { "name": "connect", "inputType": [{ "type": "ChannelAuthWhereUniqueInput", "kind": "object", "isRequired": false, "isList": false }] }, { "name": "disconnect", "inputType": [{ "type": "Boolean", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "delete", "inputType": [{ "type": "Boolean", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "update", "inputType": [{ "type": "ChannelAuthUpdateWithoutScopesDataInput", "kind": "object", "isRequired": false, "isList": false }] }, { "name": "upsert", "inputType": [{ "type": "ChannelAuthUpsertWithoutScopesInput", "kind": "object", "isRequired": false, "isList": false }] }] }, { "name": "TimecampusAuthUpdateInput", "fields": [{ "name": "id", "inputType": [{ "type": "ID", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "scope", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "channelAuth", "inputType": [{ "type": "ChannelAuthUpdateOneWithoutScopesInput", "kind": "object", "isRequired": false, "isList": false }] }] }, { "name": "TimecampusAuthUpdateManyMutationInput", "fields": [{ "name": "id", "inputType": [{ "type": "ID", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "scope", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }] }, { "name": "TimecampusAuthCreateWithoutChannelAuthInput", "fields": [{ "name": "id", "inputType": [{ "type": "ID", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "scope", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": true, "isList": false }] }] }, { "name": "TimecampusAuthCreateManyWithoutScopesInput", "fields": [{ "name": "create", "inputType": [{ "type": "TimecampusAuthCreateWithoutChannelAuthInput", "kind": "object", "isRequired": false, "isList": true }] }, { "name": "connect", "inputType": [{ "type": "TimecampusAuthWhereUniqueInput", "kind": "object", "isRequired": false, "isList": true }] }] }, { "name": "ChannelAuthCreateInput", "fields": [{ "name": "id", "inputType": [{ "type": "ID", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "userID", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": true, "isList": false }] }, { "name": "channelID", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": true, "isList": false }] }, { "name": "whatsappno", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "status", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": true, "isList": false }] }, { "name": "providerData", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "providerToken", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "userConfig", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "createdDate", "inputType": [{ "type": "DateTime", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "updatedDate", "inputType": [{ "type": "DateTime", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "scopes", "inputType": [{ "type": "TimecampusAuthCreateManyWithoutScopesInput", "kind": "object", "isRequired": false, "isList": false }] }] }, { "name": "TimecampusAuthUpdateWithoutChannelAuthDataInput", "fields": [{ "name": "id", "inputType": [{ "type": "ID", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "scope", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }] }, { "name": "TimecampusAuthUpdateWithWhereUniqueWithoutChannelAuthInput", "fields": [{ "name": "where", "inputType": [{ "type": "TimecampusAuthWhereUniqueInput", "kind": "object", "isRequired": true, "isList": false }] }, { "name": "data", "inputType": [{ "type": "TimecampusAuthUpdateWithoutChannelAuthDataInput", "kind": "object", "isRequired": true, "isList": false }] }] }, { "name": "TimecampusAuthScalarWhereInput", "fields": [{ "name": "id", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }, { "type": "StringFilter", "isList": false, "isRequired": false, "kind": "object" }], "isRelationFilter": false }, { "name": "scope", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }, { "type": "StringFilter", "isList": false, "isRequired": false, "kind": "object" }], "isRelationFilter": false }, { "name": "AND", "inputType": [{ "type": "TimecampusAuthScalarWhereInput", "kind": "object", "isRequired": false, "isList": true }], "isRelationFilter": true }, { "name": "OR", "inputType": [{ "type": "TimecampusAuthScalarWhereInput", "kind": "object", "isRequired": false, "isList": true }], "isRelationFilter": true }, { "name": "NOT", "inputType": [{ "type": "TimecampusAuthScalarWhereInput", "kind": "object", "isRequired": false, "isList": true }], "isRelationFilter": true }], "isWhereType": true, "atLeastOne": false }, { "name": "TimecampusAuthUpdateManyDataInput", "fields": [{ "name": "id", "inputType": [{ "type": "ID", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "scope", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }] }, { "name": "TimecampusAuthUpdateManyWithWhereNestedInput", "fields": [{ "name": "where", "inputType": [{ "type": "TimecampusAuthScalarWhereInput", "kind": "object", "isRequired": true, "isList": false }] }, { "name": "data", "inputType": [{ "type": "TimecampusAuthUpdateManyDataInput", "kind": "object", "isRequired": true, "isList": false }] }] }, { "name": "TimecampusAuthUpsertWithWhereUniqueWithoutChannelAuthInput", "fields": [{ "name": "where", "inputType": [{ "type": "TimecampusAuthWhereUniqueInput", "kind": "object", "isRequired": true, "isList": false }] }, { "name": "update", "inputType": [{ "type": "TimecampusAuthUpdateWithoutChannelAuthDataInput", "kind": "object", "isRequired": true, "isList": false }] }, { "name": "create", "inputType": [{ "type": "TimecampusAuthCreateWithoutChannelAuthInput", "kind": "object", "isRequired": true, "isList": false }] }] }, { "name": "TimecampusAuthUpdateManyWithoutChannelAuthInput", "fields": [{ "name": "create", "inputType": [{ "type": "TimecampusAuthCreateWithoutChannelAuthInput", "kind": "object", "isRequired": false, "isList": true }] }, { "name": "connect", "inputType": [{ "type": "TimecampusAuthWhereUniqueInput", "kind": "object", "isRequired": false, "isList": true }] }, { "name": "set", "inputType": [{ "type": "TimecampusAuthWhereUniqueInput", "kind": "object", "isRequired": false, "isList": true }] }, { "name": "disconnect", "inputType": [{ "type": "TimecampusAuthWhereUniqueInput", "kind": "object", "isRequired": false, "isList": true }] }, { "name": "delete", "inputType": [{ "type": "TimecampusAuthWhereUniqueInput", "kind": "object", "isRequired": false, "isList": true }] }, { "name": "update", "inputType": [{ "type": "TimecampusAuthUpdateWithWhereUniqueWithoutChannelAuthInput", "kind": "object", "isRequired": false, "isList": true }] }, { "name": "updateMany", "inputType": [{ "type": "TimecampusAuthUpdateManyWithWhereNestedInput", "kind": "object", "isRequired": false, "isList": true }] }, { "name": "deleteMany", "inputType": [{ "type": "TimecampusAuthScalarWhereInput", "kind": "object", "isRequired": false, "isList": true }] }, { "name": "upsert", "inputType": [{ "type": "TimecampusAuthUpsertWithWhereUniqueWithoutChannelAuthInput", "kind": "object", "isRequired": false, "isList": true }] }] }, { "name": "ChannelAuthUpdateInput", "fields": [{ "name": "id", "inputType": [{ "type": "ID", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "userID", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "channelID", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "whatsappno", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "status", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "providerData", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "providerToken", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "userConfig", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "createdDate", "inputType": [{ "type": "DateTime", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "updatedDate", "inputType": [{ "type": "DateTime", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "scopes", "inputType": [{ "type": "TimecampusAuthUpdateManyWithoutChannelAuthInput", "kind": "object", "isRequired": false, "isList": false }] }] }, { "name": "ChannelAuthUpdateManyMutationInput", "fields": [{ "name": "id", "inputType": [{ "type": "ID", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "userID", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "channelID", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "whatsappno", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "status", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "providerData", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "providerToken", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "userConfig", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "createdDate", "inputType": [{ "type": "DateTime", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "updatedDate", "inputType": [{ "type": "DateTime", "kind": "scalar", "isRequired": false, "isList": false }] }] }, { "name": "AuditLogsCreateInput", "fields": [{ "name": "id", "inputType": [{ "type": "ID", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "userID", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": true, "isList": false }] }, { "name": "whatsappno", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": true, "isList": false }] }, { "name": "message", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": true, "isList": false }] }, { "name": "direction", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": true, "isList": false }] }, { "name": "metadata", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "createdDate", "inputType": [{ "type": "DateTime", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "updatedDate", "inputType": [{ "type": "DateTime", "kind": "scalar", "isRequired": false, "isList": false }] }] }, { "name": "AuditLogsUpdateInput", "fields": [{ "name": "id", "inputType": [{ "type": "ID", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "userID", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "whatsappno", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "message", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "direction", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "metadata", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "createdDate", "inputType": [{ "type": "DateTime", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "updatedDate", "inputType": [{ "type": "DateTime", "kind": "scalar", "isRequired": false, "isList": false }] }] }, { "name": "AuditLogsUpdateManyMutationInput", "fields": [{ "name": "id", "inputType": [{ "type": "ID", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "userID", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "whatsappno", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "message", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "direction", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "metadata", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "createdDate", "inputType": [{ "type": "DateTime", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "updatedDate", "inputType": [{ "type": "DateTime", "kind": "scalar", "isRequired": false, "isList": false }] }] }, { "name": "StringFilter", "fields": [{ "name": "equals", "isRelationFilter": false, "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }] }, { "name": "not", "isRelationFilter": false, "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }, { "isList": false, "isRequired": false, "kind": "scalar", "type": "StringFilter" }] }, { "name": "in", "isRelationFilter": false, "inputType": [{ "isList": true, "isRequired": false, "kind": "scalar", "type": "String" }] }, { "name": "notIn", "isRelationFilter": false, "inputType": [{ "isList": true, "isRequired": false, "kind": "scalar", "type": "String" }] }, { "name": "lt", "isRelationFilter": false, "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }] }, { "name": "lte", "isRelationFilter": false, "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }] }, { "name": "gt", "isRelationFilter": false, "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }] }, { "name": "gte", "isRelationFilter": false, "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }] }, { "name": "contains", "isRelationFilter": false, "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }] }, { "name": "startsWith", "isRelationFilter": false, "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }] }, { "name": "endsWith", "isRelationFilter": false, "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }] }], "atLeastOne": false }, { "name": "NullableStringFilter", "fields": [{ "name": "equals", "isRelationFilter": false, "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }, { "isList": false, "isRequired": false, "kind": "scalar", "type": "null" }] }, { "name": "not", "isRelationFilter": false, "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }, { "isList": false, "isRequired": false, "kind": "scalar", "type": "null" }, { "isList": false, "isRequired": false, "kind": "scalar", "type": "NullableStringFilter" }] }, { "name": "in", "isRelationFilter": false, "inputType": [{ "isList": true, "isRequired": false, "kind": "scalar", "type": "String" }] }, { "name": "notIn", "isRelationFilter": false, "inputType": [{ "isList": true, "isRequired": false, "kind": "scalar", "type": "String" }] }, { "name": "lt", "isRelationFilter": false, "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }] }, { "name": "lte", "isRelationFilter": false, "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }] }, { "name": "gt", "isRelationFilter": false, "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }] }, { "name": "gte", "isRelationFilter": false, "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }] }, { "name": "contains", "isRelationFilter": false, "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }] }, { "name": "startsWith", "isRelationFilter": false, "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }] }, { "name": "endsWith", "isRelationFilter": false, "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }] }], "atLeastOne": false }, { "name": "TimecampusAuthFilter", "fields": [{ "name": "every", "isRelationFilter": true, "inputType": [{ "isList": false, "isRequired": false, "kind": "object", "type": "TimecampusAuthWhereInput" }] }, { "name": "some", "isRelationFilter": true, "inputType": [{ "isList": false, "isRequired": false, "kind": "object", "type": "TimecampusAuthWhereInput" }] }, { "name": "none", "isRelationFilter": true, "inputType": [{ "isList": false, "isRequired": false, "kind": "object", "type": "TimecampusAuthWhereInput" }] }], "atLeastOne": false }, { "name": "DateTimeFilter", "fields": [{ "name": "equals", "isRelationFilter": false, "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "DateTime" }] }, { "name": "not", "isRelationFilter": false, "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "DateTime" }, { "isList": false, "isRequired": false, "kind": "scalar", "type": "DateTimeFilter" }] }, { "name": "in", "isRelationFilter": false, "inputType": [{ "isList": true, "isRequired": false, "kind": "scalar", "type": "DateTime" }] }, { "name": "notIn", "isRelationFilter": false, "inputType": [{ "isList": true, "isRequired": false, "kind": "scalar", "type": "DateTime" }] }, { "name": "lt", "isRelationFilter": false, "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "DateTime" }] }, { "name": "lte", "isRelationFilter": false, "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "DateTime" }] }, { "name": "gt", "isRelationFilter": false, "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "DateTime" }] }, { "name": "gte", "isRelationFilter": false, "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "DateTime" }] }], "atLeastOne": false }, { "name": "TimecampusAuthOrderByInput", "atLeastOne": true, "atMostOne": true, "isOrderType": true, "fields": [{ "name": "id", "inputType": [{ "type": "OrderByArg", "isList": false, "isRequired": false, "kind": "enum" }], "isRelationFilter": false }, { "name": "scope", "inputType": [{ "type": "OrderByArg", "isList": false, "isRequired": false, "kind": "enum" }], "isRelationFilter": false }] }, { "name": "ChannelAuthOrderByInput", "atLeastOne": true, "atMostOne": true, "isOrderType": true, "fields": [{ "name": "id", "inputType": [{ "type": "OrderByArg", "isList": false, "isRequired": false, "kind": "enum" }], "isRelationFilter": false }, { "name": "userID", "inputType": [{ "type": "OrderByArg", "isList": false, "isRequired": false, "kind": "enum" }], "isRelationFilter": false }, { "name": "channelID", "inputType": [{ "type": "OrderByArg", "isList": false, "isRequired": false, "kind": "enum" }], "isRelationFilter": false }, { "name": "whatsappno", "inputType": [{ "type": "OrderByArg", "isList": false, "isRequired": false, "kind": "enum" }], "isRelationFilter": false }, { "name": "status", "inputType": [{ "type": "OrderByArg", "isList": false, "isRequired": false, "kind": "enum" }], "isRelationFilter": false }, { "name": "providerData", "inputType": [{ "type": "OrderByArg", "isList": false, "isRequired": false, "kind": "enum" }], "isRelationFilter": false }, { "name": "providerToken", "inputType": [{ "type": "OrderByArg", "isList": false, "isRequired": false, "kind": "enum" }], "isRelationFilter": false }, { "name": "userConfig", "inputType": [{ "type": "OrderByArg", "isList": false, "isRequired": false, "kind": "enum" }], "isRelationFilter": false }, { "name": "createdDate", "inputType": [{ "type": "OrderByArg", "isList": false, "isRequired": false, "kind": "enum" }], "isRelationFilter": false }, { "name": "updatedDate", "inputType": [{ "type": "OrderByArg", "isList": false, "isRequired": false, "kind": "enum" }], "isRelationFilter": false }] }, { "name": "AuditLogsOrderByInput", "atLeastOne": true, "atMostOne": true, "isOrderType": true, "fields": [{ "name": "id", "inputType": [{ "type": "OrderByArg", "isList": false, "isRequired": false, "kind": "enum" }], "isRelationFilter": false }, { "name": "userID", "inputType": [{ "type": "OrderByArg", "isList": false, "isRequired": false, "kind": "enum" }], "isRelationFilter": false }, { "name": "whatsappno", "inputType": [{ "type": "OrderByArg", "isList": false, "isRequired": false, "kind": "enum" }], "isRelationFilter": false }, { "name": "message", "inputType": [{ "type": "OrderByArg", "isList": false, "isRequired": false, "kind": "enum" }], "isRelationFilter": false }, { "name": "direction", "inputType": [{ "type": "OrderByArg", "isList": false, "isRequired": false, "kind": "enum" }], "isRelationFilter": false }, { "name": "metadata", "inputType": [{ "type": "OrderByArg", "isList": false, "isRequired": false, "kind": "enum" }], "isRelationFilter": false }, { "name": "createdDate", "inputType": [{ "type": "OrderByArg", "isList": false, "isRequired": false, "kind": "enum" }], "isRelationFilter": false }, { "name": "updatedDate", "inputType": [{ "type": "OrderByArg", "isList": false, "isRequired": false, "kind": "enum" }], "isRelationFilter": false }] }] } };
