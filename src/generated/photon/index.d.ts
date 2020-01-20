import { DMMF, DMMFClass, Engine } from './runtime';
/**
 * Utility Types
 */
export declare type Enumerable<T> = T | Array<T>;
export declare type MergeTruthyValues<R extends object, S extends object> = {
    [key in keyof S | keyof R]: key extends false ? never : key extends keyof S ? S[key] extends false ? never : S[key] : key extends keyof R ? R[key] : never;
};
export declare type CleanupNever<T> = {
    [key in keyof T]: T[key] extends never ? never : key;
}[keyof T];
/**
 * Subset
 * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
 */
export declare type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
};
/**
 * A PhotonRequestError is an error that is thrown in conjunction to a concrete query that has been performed with Photon.js.
 */
export declare class PhotonRequestError extends Error {
    message: string;
    code?: string | undefined;
    meta?: any;
    constructor(message: string, code?: string | undefined, meta?: any);
}
declare class PhotonFetcher {
    private readonly photon;
    private readonly engine;
    private readonly debug;
    private readonly hooks?;
    constructor(photon: Photon, engine: Engine, debug?: boolean, hooks?: Hooks | undefined);
    request<T>(document: any, path?: string[], rootField?: string, typeName?: string, isList?: boolean, callsite?: string): Promise<T>;
    protected unpack(document: any, data: any, path: string[], rootField?: string, isList?: boolean): any;
}
/**
 * Client
**/
export declare type Datasources = {
    postgres?: string;
};
export declare type LogLevel = 'INFO' | 'WARN' | 'QUERY';
export declare type LogOption = LogLevel | {
    level: LogLevel;
    /**
     * @default 'stdout'
     */
    emit?: 'event' | 'stdout';
};
export interface PhotonOptions {
    datasources?: Datasources;
    /**
     * @default false
     */
    log?: boolean | LogOption[];
    debug?: any;
    /**
     * You probably don't want to use this. `__internal` is used by internal tooling.
     */
    __internal?: {
        debug?: boolean;
        hooks?: Hooks;
        engine?: {
            cwd?: string;
            binaryPath?: string;
        };
    };
}
export declare type Hooks = {
    beforeRequest?: (options: {
        query: string;
        path: string[];
        rootField?: string;
        typeName?: string;
        document: any;
    }) => any;
};
export declare class Photon {
    private fetcher;
    private readonly dmmf;
    private readonly engine;
    private connectionPromise?;
    constructor(options?: PhotonOptions);
    private connectEngine;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    get timecampusAuths(): TimecampusAuthDelegate;
    get channelAuths(): ChannelAuthDelegate;
    get auditLogs(): AuditLogsDelegate;
}
export declare const OrderByArg: {
    asc: "asc";
    desc: "desc";
};
export declare type OrderByArg = (typeof OrderByArg)[keyof typeof OrderByArg];
/**
 * Model TimecampusAuth
 */
export declare type TimecampusAuth = {
    id: string;
    scope: string;
};
export declare type TimecampusAuthScalars = 'id' | 'scope';
export declare type TimecampusAuthSelect = {
    id?: boolean;
    scope?: boolean;
    channelAuth?: boolean | ChannelAuthSelectArgsOptional;
};
export declare type TimecampusAuthInclude = {
    channelAuth?: boolean | ChannelAuthIncludeArgsOptional;
};
declare type TimecampusAuthDefault = {
    id: true;
    scope: true;
};
declare type TimecampusAuthGetSelectPayload<S extends boolean | TimecampusAuthSelect> = S extends true ? TimecampusAuth : S extends TimecampusAuthSelect ? {
    [P in CleanupNever<MergeTruthyValues<{}, S>>]: P extends TimecampusAuthScalars ? TimecampusAuth[P] : P extends 'channelAuth' ? ChannelAuthGetSelectPayload<ExtractChannelAuthSelectArgs<S[P]>> | null : never;
} : never;
declare type TimecampusAuthGetIncludePayload<S extends boolean | TimecampusAuthInclude> = S extends true ? TimecampusAuth : S extends TimecampusAuthInclude ? {
    [P in CleanupNever<MergeTruthyValues<TimecampusAuthDefault, S>>]: P extends TimecampusAuthScalars ? TimecampusAuth[P] : P extends 'channelAuth' ? ChannelAuthGetIncludePayload<ExtractChannelAuthIncludeArgs<S[P]>> | null : never;
} : never;
export interface TimecampusAuthDelegate {
    <T extends FindManyTimecampusAuthArgs>(args?: Subset<T, FindManyTimecampusAuthArgs>): T extends FindManyTimecampusAuthArgsRequired ? 'Please either choose `select` or `include`' : T extends FindManyTimecampusAuthSelectArgs ? Promise<Array<TimecampusAuthGetSelectPayload<ExtractFindManyTimecampusAuthSelectArgs<T>>>> : T extends FindManyTimecampusAuthIncludeArgs ? Promise<Array<TimecampusAuthGetIncludePayload<ExtractFindManyTimecampusAuthIncludeArgs<T>>>> : Promise<Array<TimecampusAuth>>;
    findOne<T extends FindOneTimecampusAuthArgs>(args: Subset<T, FindOneTimecampusAuthArgs>): T extends FindOneTimecampusAuthArgsRequired ? 'Please either choose `select` or `include`' : T extends FindOneTimecampusAuthSelectArgs ? Promise<TimecampusAuthGetSelectPayload<ExtractFindOneTimecampusAuthSelectArgs<T>> | null> : T extends FindOneTimecampusAuthIncludeArgs ? Promise<TimecampusAuthGetIncludePayload<ExtractFindOneTimecampusAuthIncludeArgs<T>> | null> : TimecampusAuthClient<TimecampusAuth | null>;
    findMany<T extends FindManyTimecampusAuthArgs>(args?: Subset<T, FindManyTimecampusAuthArgs>): T extends FindManyTimecampusAuthArgsRequired ? 'Please either choose `select` or `include`' : T extends FindManyTimecampusAuthSelectArgs ? Promise<Array<TimecampusAuthGetSelectPayload<ExtractFindManyTimecampusAuthSelectArgs<T>>>> : T extends FindManyTimecampusAuthIncludeArgs ? Promise<Array<TimecampusAuthGetIncludePayload<ExtractFindManyTimecampusAuthIncludeArgs<T>>>> : Promise<Array<TimecampusAuth>>;
    create<T extends TimecampusAuthCreateArgs>(args: Subset<T, TimecampusAuthCreateArgs>): T extends TimecampusAuthCreateArgsRequired ? 'Please either choose `select` or `include`' : T extends TimecampusAuthSelectCreateArgs ? Promise<TimecampusAuthGetSelectPayload<ExtractTimecampusAuthSelectCreateArgs<T>>> : T extends TimecampusAuthIncludeCreateArgs ? Promise<TimecampusAuthGetIncludePayload<ExtractTimecampusAuthIncludeCreateArgs<T>>> : TimecampusAuthClient<TimecampusAuth>;
    delete<T extends TimecampusAuthDeleteArgs>(args: Subset<T, TimecampusAuthDeleteArgs>): T extends TimecampusAuthDeleteArgsRequired ? 'Please either choose `select` or `include`' : T extends TimecampusAuthSelectDeleteArgs ? Promise<TimecampusAuthGetSelectPayload<ExtractTimecampusAuthSelectDeleteArgs<T>>> : T extends TimecampusAuthIncludeDeleteArgs ? Promise<TimecampusAuthGetIncludePayload<ExtractTimecampusAuthIncludeDeleteArgs<T>>> : TimecampusAuthClient<TimecampusAuth>;
    update<T extends TimecampusAuthUpdateArgs>(args: Subset<T, TimecampusAuthUpdateArgs>): T extends TimecampusAuthUpdateArgsRequired ? 'Please either choose `select` or `include`' : T extends TimecampusAuthSelectUpdateArgs ? Promise<TimecampusAuthGetSelectPayload<ExtractTimecampusAuthSelectUpdateArgs<T>>> : T extends TimecampusAuthIncludeUpdateArgs ? Promise<TimecampusAuthGetIncludePayload<ExtractTimecampusAuthIncludeUpdateArgs<T>>> : TimecampusAuthClient<TimecampusAuth>;
    deleteMany<T extends TimecampusAuthDeleteManyArgs>(args: Subset<T, TimecampusAuthDeleteManyArgs>): Promise<BatchPayload>;
    updateMany<T extends TimecampusAuthUpdateManyArgs>(args: Subset<T, TimecampusAuthUpdateManyArgs>): Promise<BatchPayload>;
    upsert<T extends TimecampusAuthUpsertArgs>(args: Subset<T, TimecampusAuthUpsertArgs>): T extends TimecampusAuthUpsertArgsRequired ? 'Please either choose `select` or `include`' : T extends TimecampusAuthSelectUpsertArgs ? Promise<TimecampusAuthGetSelectPayload<ExtractTimecampusAuthSelectUpsertArgs<T>>> : T extends TimecampusAuthIncludeUpsertArgs ? Promise<TimecampusAuthGetIncludePayload<ExtractTimecampusAuthIncludeUpsertArgs<T>>> : TimecampusAuthClient<TimecampusAuth>;
    count(): Promise<number>;
}
export declare class TimecampusAuthClient<T> implements Promise<T> {
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _path;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(_dmmf: DMMFClass, _fetcher: PhotonFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _path: string[], _isList?: boolean);
    readonly [Symbol.toStringTag]: 'PhotonPromise';
    channelAuth<T extends ChannelAuthArgs = {}>(args?: Subset<T, ChannelAuthArgs>): T extends FindOneChannelAuthArgsRequired ? 'Please either choose `select` or `include`' : T extends ChannelAuthSelectArgs ? Promise<ChannelAuthGetSelectPayload<ExtractChannelAuthSelectArgs<T>> | null> : T extends ChannelAuthIncludeArgs ? Promise<ChannelAuthGetIncludePayload<ExtractChannelAuthIncludeArgs<T>> | null> : ChannelAuthClient<ChannelAuth | null>;
    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | Promise<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | Promise<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | Promise<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
}
/**
 * TimecampusAuth findOne
 */
export declare type FindOneTimecampusAuthArgs = {
    select?: TimecampusAuthSelect | null;
    include?: TimecampusAuthInclude | null;
    where: TimecampusAuthWhereUniqueInput;
};
export declare type FindOneTimecampusAuthArgsRequired = {
    select: TimecampusAuthSelect;
    include: TimecampusAuthInclude;
    where: TimecampusAuthWhereUniqueInput;
};
export declare type FindOneTimecampusAuthSelectArgs = {
    select: TimecampusAuthSelect;
    where: TimecampusAuthWhereUniqueInput;
};
export declare type FindOneTimecampusAuthSelectArgsOptional = {
    select?: TimecampusAuthSelect | null;
    where: TimecampusAuthWhereUniqueInput;
};
export declare type FindOneTimecampusAuthIncludeArgs = {
    include: TimecampusAuthInclude;
    where: TimecampusAuthWhereUniqueInput;
};
export declare type FindOneTimecampusAuthIncludeArgsOptional = {
    include?: TimecampusAuthInclude | null;
    where: TimecampusAuthWhereUniqueInput;
};
export declare type ExtractFindOneTimecampusAuthSelectArgs<S extends undefined | boolean | FindOneTimecampusAuthSelectArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends FindOneTimecampusAuthSelectArgs ? S['select'] : true;
export declare type ExtractFindOneTimecampusAuthIncludeArgs<S extends undefined | boolean | FindOneTimecampusAuthIncludeArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends FindOneTimecampusAuthIncludeArgs ? S['include'] : true;
/**
 * TimecampusAuth findMany
 */
export declare type FindManyTimecampusAuthArgs = {
    select?: TimecampusAuthSelect | null;
    include?: TimecampusAuthInclude | null;
    where?: TimecampusAuthWhereInput | null;
    orderBy?: TimecampusAuthOrderByInput | null;
    skip?: number | null;
    after?: string | null;
    before?: string | null;
    first?: number | null;
    last?: number | null;
};
export declare type FindManyTimecampusAuthArgsRequired = {
    select: TimecampusAuthSelect;
    include: TimecampusAuthInclude;
    where?: TimecampusAuthWhereInput | null;
    orderBy?: TimecampusAuthOrderByInput | null;
    skip?: number | null;
    after?: string | null;
    before?: string | null;
    first?: number | null;
    last?: number | null;
};
export declare type FindManyTimecampusAuthSelectArgs = {
    select: TimecampusAuthSelect;
    where?: TimecampusAuthWhereInput | null;
    orderBy?: TimecampusAuthOrderByInput | null;
    skip?: number | null;
    after?: string | null;
    before?: string | null;
    first?: number | null;
    last?: number | null;
};
export declare type FindManyTimecampusAuthSelectArgsOptional = {
    select?: TimecampusAuthSelect | null;
    where?: TimecampusAuthWhereInput | null;
    orderBy?: TimecampusAuthOrderByInput | null;
    skip?: number | null;
    after?: string | null;
    before?: string | null;
    first?: number | null;
    last?: number | null;
};
export declare type FindManyTimecampusAuthIncludeArgs = {
    include: TimecampusAuthInclude;
    where?: TimecampusAuthWhereInput | null;
    orderBy?: TimecampusAuthOrderByInput | null;
    skip?: number | null;
    after?: string | null;
    before?: string | null;
    first?: number | null;
    last?: number | null;
};
export declare type FindManyTimecampusAuthIncludeArgsOptional = {
    include?: TimecampusAuthInclude | null;
    where?: TimecampusAuthWhereInput | null;
    orderBy?: TimecampusAuthOrderByInput | null;
    skip?: number | null;
    after?: string | null;
    before?: string | null;
    first?: number | null;
    last?: number | null;
};
export declare type ExtractFindManyTimecampusAuthSelectArgs<S extends undefined | boolean | FindManyTimecampusAuthSelectArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends FindManyTimecampusAuthSelectArgs ? S['select'] : true;
export declare type ExtractFindManyTimecampusAuthIncludeArgs<S extends undefined | boolean | FindManyTimecampusAuthIncludeArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends FindManyTimecampusAuthIncludeArgs ? S['include'] : true;
/**
 * TimecampusAuth create
 */
export declare type TimecampusAuthCreateArgs = {
    select?: TimecampusAuthSelect | null;
    include?: TimecampusAuthInclude | null;
    data: TimecampusAuthCreateInput;
};
export declare type TimecampusAuthCreateArgsRequired = {
    select: TimecampusAuthSelect;
    include: TimecampusAuthInclude;
    data: TimecampusAuthCreateInput;
};
export declare type TimecampusAuthSelectCreateArgs = {
    select: TimecampusAuthSelect;
    data: TimecampusAuthCreateInput;
};
export declare type TimecampusAuthSelectCreateArgsOptional = {
    select?: TimecampusAuthSelect | null;
    data: TimecampusAuthCreateInput;
};
export declare type TimecampusAuthIncludeCreateArgs = {
    include: TimecampusAuthInclude;
    data: TimecampusAuthCreateInput;
};
export declare type TimecampusAuthIncludeCreateArgsOptional = {
    include?: TimecampusAuthInclude | null;
    data: TimecampusAuthCreateInput;
};
export declare type ExtractTimecampusAuthSelectCreateArgs<S extends undefined | boolean | TimecampusAuthSelectCreateArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends TimecampusAuthSelectCreateArgs ? S['select'] : true;
export declare type ExtractTimecampusAuthIncludeCreateArgs<S extends undefined | boolean | TimecampusAuthIncludeCreateArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends TimecampusAuthIncludeCreateArgs ? S['include'] : true;
/**
 * TimecampusAuth update
 */
export declare type TimecampusAuthUpdateArgs = {
    select?: TimecampusAuthSelect | null;
    include?: TimecampusAuthInclude | null;
    data: TimecampusAuthUpdateInput;
    where: TimecampusAuthWhereUniqueInput;
};
export declare type TimecampusAuthUpdateArgsRequired = {
    select: TimecampusAuthSelect;
    include: TimecampusAuthInclude;
    data: TimecampusAuthUpdateInput;
    where: TimecampusAuthWhereUniqueInput;
};
export declare type TimecampusAuthSelectUpdateArgs = {
    select: TimecampusAuthSelect;
    data: TimecampusAuthUpdateInput;
    where: TimecampusAuthWhereUniqueInput;
};
export declare type TimecampusAuthSelectUpdateArgsOptional = {
    select?: TimecampusAuthSelect | null;
    data: TimecampusAuthUpdateInput;
    where: TimecampusAuthWhereUniqueInput;
};
export declare type TimecampusAuthIncludeUpdateArgs = {
    include: TimecampusAuthInclude;
    data: TimecampusAuthUpdateInput;
    where: TimecampusAuthWhereUniqueInput;
};
export declare type TimecampusAuthIncludeUpdateArgsOptional = {
    include?: TimecampusAuthInclude | null;
    data: TimecampusAuthUpdateInput;
    where: TimecampusAuthWhereUniqueInput;
};
export declare type ExtractTimecampusAuthSelectUpdateArgs<S extends undefined | boolean | TimecampusAuthSelectUpdateArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends TimecampusAuthSelectUpdateArgs ? S['select'] : true;
export declare type ExtractTimecampusAuthIncludeUpdateArgs<S extends undefined | boolean | TimecampusAuthIncludeUpdateArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends TimecampusAuthIncludeUpdateArgs ? S['include'] : true;
/**
 * TimecampusAuth updateMany
 */
export declare type TimecampusAuthUpdateManyArgs = {
    data: TimecampusAuthUpdateManyMutationInput;
    where?: TimecampusAuthWhereInput | null;
};
/**
 * TimecampusAuth upsert
 */
export declare type TimecampusAuthUpsertArgs = {
    select?: TimecampusAuthSelect | null;
    include?: TimecampusAuthInclude | null;
    where: TimecampusAuthWhereUniqueInput;
    create: TimecampusAuthCreateInput;
    update: TimecampusAuthUpdateInput;
};
export declare type TimecampusAuthUpsertArgsRequired = {
    select: TimecampusAuthSelect;
    include: TimecampusAuthInclude;
    where: TimecampusAuthWhereUniqueInput;
    create: TimecampusAuthCreateInput;
    update: TimecampusAuthUpdateInput;
};
export declare type TimecampusAuthSelectUpsertArgs = {
    select: TimecampusAuthSelect;
    where: TimecampusAuthWhereUniqueInput;
    create: TimecampusAuthCreateInput;
    update: TimecampusAuthUpdateInput;
};
export declare type TimecampusAuthSelectUpsertArgsOptional = {
    select?: TimecampusAuthSelect | null;
    where: TimecampusAuthWhereUniqueInput;
    create: TimecampusAuthCreateInput;
    update: TimecampusAuthUpdateInput;
};
export declare type TimecampusAuthIncludeUpsertArgs = {
    include: TimecampusAuthInclude;
    where: TimecampusAuthWhereUniqueInput;
    create: TimecampusAuthCreateInput;
    update: TimecampusAuthUpdateInput;
};
export declare type TimecampusAuthIncludeUpsertArgsOptional = {
    include?: TimecampusAuthInclude | null;
    where: TimecampusAuthWhereUniqueInput;
    create: TimecampusAuthCreateInput;
    update: TimecampusAuthUpdateInput;
};
export declare type ExtractTimecampusAuthSelectUpsertArgs<S extends undefined | boolean | TimecampusAuthSelectUpsertArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends TimecampusAuthSelectUpsertArgs ? S['select'] : true;
export declare type ExtractTimecampusAuthIncludeUpsertArgs<S extends undefined | boolean | TimecampusAuthIncludeUpsertArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends TimecampusAuthIncludeUpsertArgs ? S['include'] : true;
/**
 * TimecampusAuth delete
 */
export declare type TimecampusAuthDeleteArgs = {
    select?: TimecampusAuthSelect | null;
    include?: TimecampusAuthInclude | null;
    where: TimecampusAuthWhereUniqueInput;
};
export declare type TimecampusAuthDeleteArgsRequired = {
    select: TimecampusAuthSelect;
    include: TimecampusAuthInclude;
    where: TimecampusAuthWhereUniqueInput;
};
export declare type TimecampusAuthSelectDeleteArgs = {
    select: TimecampusAuthSelect;
    where: TimecampusAuthWhereUniqueInput;
};
export declare type TimecampusAuthSelectDeleteArgsOptional = {
    select?: TimecampusAuthSelect | null;
    where: TimecampusAuthWhereUniqueInput;
};
export declare type TimecampusAuthIncludeDeleteArgs = {
    include: TimecampusAuthInclude;
    where: TimecampusAuthWhereUniqueInput;
};
export declare type TimecampusAuthIncludeDeleteArgsOptional = {
    include?: TimecampusAuthInclude | null;
    where: TimecampusAuthWhereUniqueInput;
};
export declare type ExtractTimecampusAuthSelectDeleteArgs<S extends undefined | boolean | TimecampusAuthSelectDeleteArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends TimecampusAuthSelectDeleteArgs ? S['select'] : true;
export declare type ExtractTimecampusAuthIncludeDeleteArgs<S extends undefined | boolean | TimecampusAuthIncludeDeleteArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends TimecampusAuthIncludeDeleteArgs ? S['include'] : true;
/**
 * TimecampusAuth deleteMany
 */
export declare type TimecampusAuthDeleteManyArgs = {
    where?: TimecampusAuthWhereInput | null;
};
/**
 * TimecampusAuth without action
 */
export declare type TimecampusAuthArgs = {
    select?: TimecampusAuthSelect | null;
    include?: TimecampusAuthInclude | null;
};
export declare type TimecampusAuthArgsRequired = {
    select: TimecampusAuthSelect;
    include: TimecampusAuthInclude;
};
export declare type TimecampusAuthSelectArgs = {
    select: TimecampusAuthSelect;
};
export declare type TimecampusAuthSelectArgsOptional = {
    select?: TimecampusAuthSelect | null;
};
export declare type TimecampusAuthIncludeArgs = {
    include: TimecampusAuthInclude;
};
export declare type TimecampusAuthIncludeArgsOptional = {
    include?: TimecampusAuthInclude | null;
};
export declare type ExtractTimecampusAuthSelectArgs<S extends undefined | boolean | TimecampusAuthSelectArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends TimecampusAuthSelectArgs ? S['select'] : true;
export declare type ExtractTimecampusAuthIncludeArgs<S extends undefined | boolean | TimecampusAuthIncludeArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends TimecampusAuthIncludeArgs ? S['include'] : true;
/**
 * Model ChannelAuth
 */
export declare type ChannelAuth = {
    id: string;
    userID: string;
    channelID: string;
    whatsappno: string | null;
    status: string;
    providerData: string | null;
    providerToken: string | null;
    userConfig: string | null;
    createdDate: Date;
    updatedDate: Date;
};
export declare type ChannelAuthScalars = 'id' | 'userID' | 'channelID' | 'whatsappno' | 'status' | 'providerData' | 'providerToken' | 'userConfig' | 'createdDate' | 'updatedDate';
export declare type ChannelAuthSelect = {
    id?: boolean;
    userID?: boolean;
    channelID?: boolean;
    whatsappno?: boolean;
    status?: boolean;
    providerData?: boolean;
    providerToken?: boolean;
    userConfig?: boolean;
    scopes?: boolean | FindManyTimecampusAuthSelectArgsOptional;
    createdDate?: boolean;
    updatedDate?: boolean;
};
export declare type ChannelAuthInclude = {
    scopes?: boolean | FindManyTimecampusAuthIncludeArgsOptional;
};
declare type ChannelAuthDefault = {
    id: true;
    userID: true;
    channelID: true;
    whatsappno: true;
    status: true;
    providerData: true;
    providerToken: true;
    userConfig: true;
    createdDate: true;
    updatedDate: true;
};
declare type ChannelAuthGetSelectPayload<S extends boolean | ChannelAuthSelect> = S extends true ? ChannelAuth : S extends ChannelAuthSelect ? {
    [P in CleanupNever<MergeTruthyValues<{}, S>>]: P extends ChannelAuthScalars ? ChannelAuth[P] : P extends 'scopes' ? Array<TimecampusAuthGetSelectPayload<ExtractFindManyTimecampusAuthSelectArgs<S[P]>>> : never;
} : never;
declare type ChannelAuthGetIncludePayload<S extends boolean | ChannelAuthInclude> = S extends true ? ChannelAuth : S extends ChannelAuthInclude ? {
    [P in CleanupNever<MergeTruthyValues<ChannelAuthDefault, S>>]: P extends ChannelAuthScalars ? ChannelAuth[P] : P extends 'scopes' ? Array<TimecampusAuthGetIncludePayload<ExtractFindManyTimecampusAuthIncludeArgs<S[P]>>> : never;
} : never;
export interface ChannelAuthDelegate {
    <T extends FindManyChannelAuthArgs>(args?: Subset<T, FindManyChannelAuthArgs>): T extends FindManyChannelAuthArgsRequired ? 'Please either choose `select` or `include`' : T extends FindManyChannelAuthSelectArgs ? Promise<Array<ChannelAuthGetSelectPayload<ExtractFindManyChannelAuthSelectArgs<T>>>> : T extends FindManyChannelAuthIncludeArgs ? Promise<Array<ChannelAuthGetIncludePayload<ExtractFindManyChannelAuthIncludeArgs<T>>>> : Promise<Array<ChannelAuth>>;
    findOne<T extends FindOneChannelAuthArgs>(args: Subset<T, FindOneChannelAuthArgs>): T extends FindOneChannelAuthArgsRequired ? 'Please either choose `select` or `include`' : T extends FindOneChannelAuthSelectArgs ? Promise<ChannelAuthGetSelectPayload<ExtractFindOneChannelAuthSelectArgs<T>> | null> : T extends FindOneChannelAuthIncludeArgs ? Promise<ChannelAuthGetIncludePayload<ExtractFindOneChannelAuthIncludeArgs<T>> | null> : ChannelAuthClient<ChannelAuth | null>;
    findMany<T extends FindManyChannelAuthArgs>(args?: Subset<T, FindManyChannelAuthArgs>): T extends FindManyChannelAuthArgsRequired ? 'Please either choose `select` or `include`' : T extends FindManyChannelAuthSelectArgs ? Promise<Array<ChannelAuthGetSelectPayload<ExtractFindManyChannelAuthSelectArgs<T>>>> : T extends FindManyChannelAuthIncludeArgs ? Promise<Array<ChannelAuthGetIncludePayload<ExtractFindManyChannelAuthIncludeArgs<T>>>> : Promise<Array<ChannelAuth>>;
    create<T extends ChannelAuthCreateArgs>(args: Subset<T, ChannelAuthCreateArgs>): T extends ChannelAuthCreateArgsRequired ? 'Please either choose `select` or `include`' : T extends ChannelAuthSelectCreateArgs ? Promise<ChannelAuthGetSelectPayload<ExtractChannelAuthSelectCreateArgs<T>>> : T extends ChannelAuthIncludeCreateArgs ? Promise<ChannelAuthGetIncludePayload<ExtractChannelAuthIncludeCreateArgs<T>>> : ChannelAuthClient<ChannelAuth>;
    delete<T extends ChannelAuthDeleteArgs>(args: Subset<T, ChannelAuthDeleteArgs>): T extends ChannelAuthDeleteArgsRequired ? 'Please either choose `select` or `include`' : T extends ChannelAuthSelectDeleteArgs ? Promise<ChannelAuthGetSelectPayload<ExtractChannelAuthSelectDeleteArgs<T>>> : T extends ChannelAuthIncludeDeleteArgs ? Promise<ChannelAuthGetIncludePayload<ExtractChannelAuthIncludeDeleteArgs<T>>> : ChannelAuthClient<ChannelAuth>;
    update<T extends ChannelAuthUpdateArgs>(args: Subset<T, ChannelAuthUpdateArgs>): T extends ChannelAuthUpdateArgsRequired ? 'Please either choose `select` or `include`' : T extends ChannelAuthSelectUpdateArgs ? Promise<ChannelAuthGetSelectPayload<ExtractChannelAuthSelectUpdateArgs<T>>> : T extends ChannelAuthIncludeUpdateArgs ? Promise<ChannelAuthGetIncludePayload<ExtractChannelAuthIncludeUpdateArgs<T>>> : ChannelAuthClient<ChannelAuth>;
    deleteMany<T extends ChannelAuthDeleteManyArgs>(args: Subset<T, ChannelAuthDeleteManyArgs>): Promise<BatchPayload>;
    updateMany<T extends ChannelAuthUpdateManyArgs>(args: Subset<T, ChannelAuthUpdateManyArgs>): Promise<BatchPayload>;
    upsert<T extends ChannelAuthUpsertArgs>(args: Subset<T, ChannelAuthUpsertArgs>): T extends ChannelAuthUpsertArgsRequired ? 'Please either choose `select` or `include`' : T extends ChannelAuthSelectUpsertArgs ? Promise<ChannelAuthGetSelectPayload<ExtractChannelAuthSelectUpsertArgs<T>>> : T extends ChannelAuthIncludeUpsertArgs ? Promise<ChannelAuthGetIncludePayload<ExtractChannelAuthIncludeUpsertArgs<T>>> : ChannelAuthClient<ChannelAuth>;
    count(): Promise<number>;
}
export declare class ChannelAuthClient<T> implements Promise<T> {
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _path;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(_dmmf: DMMFClass, _fetcher: PhotonFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _path: string[], _isList?: boolean);
    readonly [Symbol.toStringTag]: 'PhotonPromise';
    scopes<T extends FindManyTimecampusAuthArgs = {}>(args?: Subset<T, FindManyTimecampusAuthArgs>): T extends FindManyTimecampusAuthArgsRequired ? 'Please either choose `select` or `include`' : T extends FindManyTimecampusAuthSelectArgs ? Promise<Array<TimecampusAuthGetSelectPayload<ExtractFindManyTimecampusAuthSelectArgs<T>>>> : T extends FindManyTimecampusAuthIncludeArgs ? Promise<Array<TimecampusAuthGetIncludePayload<ExtractFindManyTimecampusAuthIncludeArgs<T>>>> : Promise<Array<TimecampusAuth>>;
    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | Promise<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | Promise<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | Promise<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
}
/**
 * ChannelAuth findOne
 */
export declare type FindOneChannelAuthArgs = {
    select?: ChannelAuthSelect | null;
    include?: ChannelAuthInclude | null;
    where: ChannelAuthWhereUniqueInput;
};
export declare type FindOneChannelAuthArgsRequired = {
    select: ChannelAuthSelect;
    include: ChannelAuthInclude;
    where: ChannelAuthWhereUniqueInput;
};
export declare type FindOneChannelAuthSelectArgs = {
    select: ChannelAuthSelect;
    where: ChannelAuthWhereUniqueInput;
};
export declare type FindOneChannelAuthSelectArgsOptional = {
    select?: ChannelAuthSelect | null;
    where: ChannelAuthWhereUniqueInput;
};
export declare type FindOneChannelAuthIncludeArgs = {
    include: ChannelAuthInclude;
    where: ChannelAuthWhereUniqueInput;
};
export declare type FindOneChannelAuthIncludeArgsOptional = {
    include?: ChannelAuthInclude | null;
    where: ChannelAuthWhereUniqueInput;
};
export declare type ExtractFindOneChannelAuthSelectArgs<S extends undefined | boolean | FindOneChannelAuthSelectArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends FindOneChannelAuthSelectArgs ? S['select'] : true;
export declare type ExtractFindOneChannelAuthIncludeArgs<S extends undefined | boolean | FindOneChannelAuthIncludeArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends FindOneChannelAuthIncludeArgs ? S['include'] : true;
/**
 * ChannelAuth findMany
 */
export declare type FindManyChannelAuthArgs = {
    select?: ChannelAuthSelect | null;
    include?: ChannelAuthInclude | null;
    where?: ChannelAuthWhereInput | null;
    orderBy?: ChannelAuthOrderByInput | null;
    skip?: number | null;
    after?: string | null;
    before?: string | null;
    first?: number | null;
    last?: number | null;
};
export declare type FindManyChannelAuthArgsRequired = {
    select: ChannelAuthSelect;
    include: ChannelAuthInclude;
    where?: ChannelAuthWhereInput | null;
    orderBy?: ChannelAuthOrderByInput | null;
    skip?: number | null;
    after?: string | null;
    before?: string | null;
    first?: number | null;
    last?: number | null;
};
export declare type FindManyChannelAuthSelectArgs = {
    select: ChannelAuthSelect;
    where?: ChannelAuthWhereInput | null;
    orderBy?: ChannelAuthOrderByInput | null;
    skip?: number | null;
    after?: string | null;
    before?: string | null;
    first?: number | null;
    last?: number | null;
};
export declare type FindManyChannelAuthSelectArgsOptional = {
    select?: ChannelAuthSelect | null;
    where?: ChannelAuthWhereInput | null;
    orderBy?: ChannelAuthOrderByInput | null;
    skip?: number | null;
    after?: string | null;
    before?: string | null;
    first?: number | null;
    last?: number | null;
};
export declare type FindManyChannelAuthIncludeArgs = {
    include: ChannelAuthInclude;
    where?: ChannelAuthWhereInput | null;
    orderBy?: ChannelAuthOrderByInput | null;
    skip?: number | null;
    after?: string | null;
    before?: string | null;
    first?: number | null;
    last?: number | null;
};
export declare type FindManyChannelAuthIncludeArgsOptional = {
    include?: ChannelAuthInclude | null;
    where?: ChannelAuthWhereInput | null;
    orderBy?: ChannelAuthOrderByInput | null;
    skip?: number | null;
    after?: string | null;
    before?: string | null;
    first?: number | null;
    last?: number | null;
};
export declare type ExtractFindManyChannelAuthSelectArgs<S extends undefined | boolean | FindManyChannelAuthSelectArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends FindManyChannelAuthSelectArgs ? S['select'] : true;
export declare type ExtractFindManyChannelAuthIncludeArgs<S extends undefined | boolean | FindManyChannelAuthIncludeArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends FindManyChannelAuthIncludeArgs ? S['include'] : true;
/**
 * ChannelAuth create
 */
export declare type ChannelAuthCreateArgs = {
    select?: ChannelAuthSelect | null;
    include?: ChannelAuthInclude | null;
    data: ChannelAuthCreateInput;
};
export declare type ChannelAuthCreateArgsRequired = {
    select: ChannelAuthSelect;
    include: ChannelAuthInclude;
    data: ChannelAuthCreateInput;
};
export declare type ChannelAuthSelectCreateArgs = {
    select: ChannelAuthSelect;
    data: ChannelAuthCreateInput;
};
export declare type ChannelAuthSelectCreateArgsOptional = {
    select?: ChannelAuthSelect | null;
    data: ChannelAuthCreateInput;
};
export declare type ChannelAuthIncludeCreateArgs = {
    include: ChannelAuthInclude;
    data: ChannelAuthCreateInput;
};
export declare type ChannelAuthIncludeCreateArgsOptional = {
    include?: ChannelAuthInclude | null;
    data: ChannelAuthCreateInput;
};
export declare type ExtractChannelAuthSelectCreateArgs<S extends undefined | boolean | ChannelAuthSelectCreateArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends ChannelAuthSelectCreateArgs ? S['select'] : true;
export declare type ExtractChannelAuthIncludeCreateArgs<S extends undefined | boolean | ChannelAuthIncludeCreateArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends ChannelAuthIncludeCreateArgs ? S['include'] : true;
/**
 * ChannelAuth update
 */
export declare type ChannelAuthUpdateArgs = {
    select?: ChannelAuthSelect | null;
    include?: ChannelAuthInclude | null;
    data: ChannelAuthUpdateInput;
    where: ChannelAuthWhereUniqueInput;
};
export declare type ChannelAuthUpdateArgsRequired = {
    select: ChannelAuthSelect;
    include: ChannelAuthInclude;
    data: ChannelAuthUpdateInput;
    where: ChannelAuthWhereUniqueInput;
};
export declare type ChannelAuthSelectUpdateArgs = {
    select: ChannelAuthSelect;
    data: ChannelAuthUpdateInput;
    where: ChannelAuthWhereUniqueInput;
};
export declare type ChannelAuthSelectUpdateArgsOptional = {
    select?: ChannelAuthSelect | null;
    data: ChannelAuthUpdateInput;
    where: ChannelAuthWhereUniqueInput;
};
export declare type ChannelAuthIncludeUpdateArgs = {
    include: ChannelAuthInclude;
    data: ChannelAuthUpdateInput;
    where: ChannelAuthWhereUniqueInput;
};
export declare type ChannelAuthIncludeUpdateArgsOptional = {
    include?: ChannelAuthInclude | null;
    data: ChannelAuthUpdateInput;
    where: ChannelAuthWhereUniqueInput;
};
export declare type ExtractChannelAuthSelectUpdateArgs<S extends undefined | boolean | ChannelAuthSelectUpdateArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends ChannelAuthSelectUpdateArgs ? S['select'] : true;
export declare type ExtractChannelAuthIncludeUpdateArgs<S extends undefined | boolean | ChannelAuthIncludeUpdateArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends ChannelAuthIncludeUpdateArgs ? S['include'] : true;
/**
 * ChannelAuth updateMany
 */
export declare type ChannelAuthUpdateManyArgs = {
    data: ChannelAuthUpdateManyMutationInput;
    where?: ChannelAuthWhereInput | null;
};
/**
 * ChannelAuth upsert
 */
export declare type ChannelAuthUpsertArgs = {
    select?: ChannelAuthSelect | null;
    include?: ChannelAuthInclude | null;
    where: ChannelAuthWhereUniqueInput;
    create: ChannelAuthCreateInput;
    update: ChannelAuthUpdateInput;
};
export declare type ChannelAuthUpsertArgsRequired = {
    select: ChannelAuthSelect;
    include: ChannelAuthInclude;
    where: ChannelAuthWhereUniqueInput;
    create: ChannelAuthCreateInput;
    update: ChannelAuthUpdateInput;
};
export declare type ChannelAuthSelectUpsertArgs = {
    select: ChannelAuthSelect;
    where: ChannelAuthWhereUniqueInput;
    create: ChannelAuthCreateInput;
    update: ChannelAuthUpdateInput;
};
export declare type ChannelAuthSelectUpsertArgsOptional = {
    select?: ChannelAuthSelect | null;
    where: ChannelAuthWhereUniqueInput;
    create: ChannelAuthCreateInput;
    update: ChannelAuthUpdateInput;
};
export declare type ChannelAuthIncludeUpsertArgs = {
    include: ChannelAuthInclude;
    where: ChannelAuthWhereUniqueInput;
    create: ChannelAuthCreateInput;
    update: ChannelAuthUpdateInput;
};
export declare type ChannelAuthIncludeUpsertArgsOptional = {
    include?: ChannelAuthInclude | null;
    where: ChannelAuthWhereUniqueInput;
    create: ChannelAuthCreateInput;
    update: ChannelAuthUpdateInput;
};
export declare type ExtractChannelAuthSelectUpsertArgs<S extends undefined | boolean | ChannelAuthSelectUpsertArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends ChannelAuthSelectUpsertArgs ? S['select'] : true;
export declare type ExtractChannelAuthIncludeUpsertArgs<S extends undefined | boolean | ChannelAuthIncludeUpsertArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends ChannelAuthIncludeUpsertArgs ? S['include'] : true;
/**
 * ChannelAuth delete
 */
export declare type ChannelAuthDeleteArgs = {
    select?: ChannelAuthSelect | null;
    include?: ChannelAuthInclude | null;
    where: ChannelAuthWhereUniqueInput;
};
export declare type ChannelAuthDeleteArgsRequired = {
    select: ChannelAuthSelect;
    include: ChannelAuthInclude;
    where: ChannelAuthWhereUniqueInput;
};
export declare type ChannelAuthSelectDeleteArgs = {
    select: ChannelAuthSelect;
    where: ChannelAuthWhereUniqueInput;
};
export declare type ChannelAuthSelectDeleteArgsOptional = {
    select?: ChannelAuthSelect | null;
    where: ChannelAuthWhereUniqueInput;
};
export declare type ChannelAuthIncludeDeleteArgs = {
    include: ChannelAuthInclude;
    where: ChannelAuthWhereUniqueInput;
};
export declare type ChannelAuthIncludeDeleteArgsOptional = {
    include?: ChannelAuthInclude | null;
    where: ChannelAuthWhereUniqueInput;
};
export declare type ExtractChannelAuthSelectDeleteArgs<S extends undefined | boolean | ChannelAuthSelectDeleteArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends ChannelAuthSelectDeleteArgs ? S['select'] : true;
export declare type ExtractChannelAuthIncludeDeleteArgs<S extends undefined | boolean | ChannelAuthIncludeDeleteArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends ChannelAuthIncludeDeleteArgs ? S['include'] : true;
/**
 * ChannelAuth deleteMany
 */
export declare type ChannelAuthDeleteManyArgs = {
    where?: ChannelAuthWhereInput | null;
};
/**
 * ChannelAuth without action
 */
export declare type ChannelAuthArgs = {
    select?: ChannelAuthSelect | null;
    include?: ChannelAuthInclude | null;
};
export declare type ChannelAuthArgsRequired = {
    select: ChannelAuthSelect;
    include: ChannelAuthInclude;
};
export declare type ChannelAuthSelectArgs = {
    select: ChannelAuthSelect;
};
export declare type ChannelAuthSelectArgsOptional = {
    select?: ChannelAuthSelect | null;
};
export declare type ChannelAuthIncludeArgs = {
    include: ChannelAuthInclude;
};
export declare type ChannelAuthIncludeArgsOptional = {
    include?: ChannelAuthInclude | null;
};
export declare type ExtractChannelAuthSelectArgs<S extends undefined | boolean | ChannelAuthSelectArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends ChannelAuthSelectArgs ? S['select'] : true;
export declare type ExtractChannelAuthIncludeArgs<S extends undefined | boolean | ChannelAuthIncludeArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends ChannelAuthIncludeArgs ? S['include'] : true;
/**
 * Model AuditLogs
 */
export declare type AuditLogs = {
    id: string;
    userID: string;
    whatsappno: string;
    message: string;
    direction: string;
    metadata: string | null;
    createdDate: Date;
    updatedDate: Date;
};
export declare type AuditLogsScalars = 'id' | 'userID' | 'whatsappno' | 'message' | 'direction' | 'metadata' | 'createdDate' | 'updatedDate';
export declare type AuditLogsSelect = {
    id?: boolean;
    userID?: boolean;
    whatsappno?: boolean;
    message?: boolean;
    direction?: boolean;
    metadata?: boolean;
    createdDate?: boolean;
    updatedDate?: boolean;
};
export declare type AuditLogsInclude = {};
declare type AuditLogsDefault = {
    id: true;
    userID: true;
    whatsappno: true;
    message: true;
    direction: true;
    metadata: true;
    createdDate: true;
    updatedDate: true;
};
declare type AuditLogsGetSelectPayload<S extends boolean | AuditLogsSelect> = S extends true ? AuditLogs : S extends AuditLogsSelect ? {
    [P in CleanupNever<MergeTruthyValues<{}, S>>]: P extends AuditLogsScalars ? AuditLogs[P] : never;
} : never;
declare type AuditLogsGetIncludePayload<S extends boolean | AuditLogsInclude> = S extends true ? AuditLogs : S extends AuditLogsInclude ? {
    [P in CleanupNever<MergeTruthyValues<AuditLogsDefault, S>>]: P extends AuditLogsScalars ? AuditLogs[P] : never;
} : never;
export interface AuditLogsDelegate {
    <T extends FindManyAuditLogsArgs>(args?: Subset<T, FindManyAuditLogsArgs>): T extends FindManyAuditLogsArgsRequired ? 'Please either choose `select` or `include`' : T extends FindManyAuditLogsSelectArgs ? Promise<Array<AuditLogsGetSelectPayload<ExtractFindManyAuditLogsSelectArgs<T>>>> : T extends FindManyAuditLogsIncludeArgs ? Promise<Array<AuditLogsGetIncludePayload<ExtractFindManyAuditLogsIncludeArgs<T>>>> : Promise<Array<AuditLogs>>;
    findOne<T extends FindOneAuditLogsArgs>(args: Subset<T, FindOneAuditLogsArgs>): T extends FindOneAuditLogsArgsRequired ? 'Please either choose `select` or `include`' : T extends FindOneAuditLogsSelectArgs ? Promise<AuditLogsGetSelectPayload<ExtractFindOneAuditLogsSelectArgs<T>> | null> : T extends FindOneAuditLogsIncludeArgs ? Promise<AuditLogsGetIncludePayload<ExtractFindOneAuditLogsIncludeArgs<T>> | null> : AuditLogsClient<AuditLogs | null>;
    findMany<T extends FindManyAuditLogsArgs>(args?: Subset<T, FindManyAuditLogsArgs>): T extends FindManyAuditLogsArgsRequired ? 'Please either choose `select` or `include`' : T extends FindManyAuditLogsSelectArgs ? Promise<Array<AuditLogsGetSelectPayload<ExtractFindManyAuditLogsSelectArgs<T>>>> : T extends FindManyAuditLogsIncludeArgs ? Promise<Array<AuditLogsGetIncludePayload<ExtractFindManyAuditLogsIncludeArgs<T>>>> : Promise<Array<AuditLogs>>;
    create<T extends AuditLogsCreateArgs>(args: Subset<T, AuditLogsCreateArgs>): T extends AuditLogsCreateArgsRequired ? 'Please either choose `select` or `include`' : T extends AuditLogsSelectCreateArgs ? Promise<AuditLogsGetSelectPayload<ExtractAuditLogsSelectCreateArgs<T>>> : T extends AuditLogsIncludeCreateArgs ? Promise<AuditLogsGetIncludePayload<ExtractAuditLogsIncludeCreateArgs<T>>> : AuditLogsClient<AuditLogs>;
    delete<T extends AuditLogsDeleteArgs>(args: Subset<T, AuditLogsDeleteArgs>): T extends AuditLogsDeleteArgsRequired ? 'Please either choose `select` or `include`' : T extends AuditLogsSelectDeleteArgs ? Promise<AuditLogsGetSelectPayload<ExtractAuditLogsSelectDeleteArgs<T>>> : T extends AuditLogsIncludeDeleteArgs ? Promise<AuditLogsGetIncludePayload<ExtractAuditLogsIncludeDeleteArgs<T>>> : AuditLogsClient<AuditLogs>;
    update<T extends AuditLogsUpdateArgs>(args: Subset<T, AuditLogsUpdateArgs>): T extends AuditLogsUpdateArgsRequired ? 'Please either choose `select` or `include`' : T extends AuditLogsSelectUpdateArgs ? Promise<AuditLogsGetSelectPayload<ExtractAuditLogsSelectUpdateArgs<T>>> : T extends AuditLogsIncludeUpdateArgs ? Promise<AuditLogsGetIncludePayload<ExtractAuditLogsIncludeUpdateArgs<T>>> : AuditLogsClient<AuditLogs>;
    deleteMany<T extends AuditLogsDeleteManyArgs>(args: Subset<T, AuditLogsDeleteManyArgs>): Promise<BatchPayload>;
    updateMany<T extends AuditLogsUpdateManyArgs>(args: Subset<T, AuditLogsUpdateManyArgs>): Promise<BatchPayload>;
    upsert<T extends AuditLogsUpsertArgs>(args: Subset<T, AuditLogsUpsertArgs>): T extends AuditLogsUpsertArgsRequired ? 'Please either choose `select` or `include`' : T extends AuditLogsSelectUpsertArgs ? Promise<AuditLogsGetSelectPayload<ExtractAuditLogsSelectUpsertArgs<T>>> : T extends AuditLogsIncludeUpsertArgs ? Promise<AuditLogsGetIncludePayload<ExtractAuditLogsIncludeUpsertArgs<T>>> : AuditLogsClient<AuditLogs>;
    count(): Promise<number>;
}
export declare class AuditLogsClient<T> implements Promise<T> {
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _path;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(_dmmf: DMMFClass, _fetcher: PhotonFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _path: string[], _isList?: boolean);
    readonly [Symbol.toStringTag]: 'PhotonPromise';
    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | Promise<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | Promise<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | Promise<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
}
/**
 * AuditLogs findOne
 */
export declare type FindOneAuditLogsArgs = {
    select?: AuditLogsSelect | null;
    include?: AuditLogsInclude | null;
    where: AuditLogsWhereUniqueInput;
};
export declare type FindOneAuditLogsArgsRequired = {
    select: AuditLogsSelect;
    include: AuditLogsInclude;
    where: AuditLogsWhereUniqueInput;
};
export declare type FindOneAuditLogsSelectArgs = {
    select: AuditLogsSelect;
    where: AuditLogsWhereUniqueInput;
};
export declare type FindOneAuditLogsSelectArgsOptional = {
    select?: AuditLogsSelect | null;
    where: AuditLogsWhereUniqueInput;
};
export declare type FindOneAuditLogsIncludeArgs = {
    include: AuditLogsInclude;
    where: AuditLogsWhereUniqueInput;
};
export declare type FindOneAuditLogsIncludeArgsOptional = {
    include?: AuditLogsInclude | null;
    where: AuditLogsWhereUniqueInput;
};
export declare type ExtractFindOneAuditLogsSelectArgs<S extends undefined | boolean | FindOneAuditLogsSelectArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends FindOneAuditLogsSelectArgs ? S['select'] : true;
export declare type ExtractFindOneAuditLogsIncludeArgs<S extends undefined | boolean | FindOneAuditLogsIncludeArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends FindOneAuditLogsIncludeArgs ? S['include'] : true;
/**
 * AuditLogs findMany
 */
export declare type FindManyAuditLogsArgs = {
    select?: AuditLogsSelect | null;
    include?: AuditLogsInclude | null;
    where?: AuditLogsWhereInput | null;
    orderBy?: AuditLogsOrderByInput | null;
    skip?: number | null;
    after?: string | null;
    before?: string | null;
    first?: number | null;
    last?: number | null;
};
export declare type FindManyAuditLogsArgsRequired = {
    select: AuditLogsSelect;
    include: AuditLogsInclude;
    where?: AuditLogsWhereInput | null;
    orderBy?: AuditLogsOrderByInput | null;
    skip?: number | null;
    after?: string | null;
    before?: string | null;
    first?: number | null;
    last?: number | null;
};
export declare type FindManyAuditLogsSelectArgs = {
    select: AuditLogsSelect;
    where?: AuditLogsWhereInput | null;
    orderBy?: AuditLogsOrderByInput | null;
    skip?: number | null;
    after?: string | null;
    before?: string | null;
    first?: number | null;
    last?: number | null;
};
export declare type FindManyAuditLogsSelectArgsOptional = {
    select?: AuditLogsSelect | null;
    where?: AuditLogsWhereInput | null;
    orderBy?: AuditLogsOrderByInput | null;
    skip?: number | null;
    after?: string | null;
    before?: string | null;
    first?: number | null;
    last?: number | null;
};
export declare type FindManyAuditLogsIncludeArgs = {
    include: AuditLogsInclude;
    where?: AuditLogsWhereInput | null;
    orderBy?: AuditLogsOrderByInput | null;
    skip?: number | null;
    after?: string | null;
    before?: string | null;
    first?: number | null;
    last?: number | null;
};
export declare type FindManyAuditLogsIncludeArgsOptional = {
    include?: AuditLogsInclude | null;
    where?: AuditLogsWhereInput | null;
    orderBy?: AuditLogsOrderByInput | null;
    skip?: number | null;
    after?: string | null;
    before?: string | null;
    first?: number | null;
    last?: number | null;
};
export declare type ExtractFindManyAuditLogsSelectArgs<S extends undefined | boolean | FindManyAuditLogsSelectArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends FindManyAuditLogsSelectArgs ? S['select'] : true;
export declare type ExtractFindManyAuditLogsIncludeArgs<S extends undefined | boolean | FindManyAuditLogsIncludeArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends FindManyAuditLogsIncludeArgs ? S['include'] : true;
/**
 * AuditLogs create
 */
export declare type AuditLogsCreateArgs = {
    select?: AuditLogsSelect | null;
    include?: AuditLogsInclude | null;
    data: AuditLogsCreateInput;
};
export declare type AuditLogsCreateArgsRequired = {
    select: AuditLogsSelect;
    include: AuditLogsInclude;
    data: AuditLogsCreateInput;
};
export declare type AuditLogsSelectCreateArgs = {
    select: AuditLogsSelect;
    data: AuditLogsCreateInput;
};
export declare type AuditLogsSelectCreateArgsOptional = {
    select?: AuditLogsSelect | null;
    data: AuditLogsCreateInput;
};
export declare type AuditLogsIncludeCreateArgs = {
    include: AuditLogsInclude;
    data: AuditLogsCreateInput;
};
export declare type AuditLogsIncludeCreateArgsOptional = {
    include?: AuditLogsInclude | null;
    data: AuditLogsCreateInput;
};
export declare type ExtractAuditLogsSelectCreateArgs<S extends undefined | boolean | AuditLogsSelectCreateArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends AuditLogsSelectCreateArgs ? S['select'] : true;
export declare type ExtractAuditLogsIncludeCreateArgs<S extends undefined | boolean | AuditLogsIncludeCreateArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends AuditLogsIncludeCreateArgs ? S['include'] : true;
/**
 * AuditLogs update
 */
export declare type AuditLogsUpdateArgs = {
    select?: AuditLogsSelect | null;
    include?: AuditLogsInclude | null;
    data: AuditLogsUpdateInput;
    where: AuditLogsWhereUniqueInput;
};
export declare type AuditLogsUpdateArgsRequired = {
    select: AuditLogsSelect;
    include: AuditLogsInclude;
    data: AuditLogsUpdateInput;
    where: AuditLogsWhereUniqueInput;
};
export declare type AuditLogsSelectUpdateArgs = {
    select: AuditLogsSelect;
    data: AuditLogsUpdateInput;
    where: AuditLogsWhereUniqueInput;
};
export declare type AuditLogsSelectUpdateArgsOptional = {
    select?: AuditLogsSelect | null;
    data: AuditLogsUpdateInput;
    where: AuditLogsWhereUniqueInput;
};
export declare type AuditLogsIncludeUpdateArgs = {
    include: AuditLogsInclude;
    data: AuditLogsUpdateInput;
    where: AuditLogsWhereUniqueInput;
};
export declare type AuditLogsIncludeUpdateArgsOptional = {
    include?: AuditLogsInclude | null;
    data: AuditLogsUpdateInput;
    where: AuditLogsWhereUniqueInput;
};
export declare type ExtractAuditLogsSelectUpdateArgs<S extends undefined | boolean | AuditLogsSelectUpdateArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends AuditLogsSelectUpdateArgs ? S['select'] : true;
export declare type ExtractAuditLogsIncludeUpdateArgs<S extends undefined | boolean | AuditLogsIncludeUpdateArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends AuditLogsIncludeUpdateArgs ? S['include'] : true;
/**
 * AuditLogs updateMany
 */
export declare type AuditLogsUpdateManyArgs = {
    data: AuditLogsUpdateManyMutationInput;
    where?: AuditLogsWhereInput | null;
};
/**
 * AuditLogs upsert
 */
export declare type AuditLogsUpsertArgs = {
    select?: AuditLogsSelect | null;
    include?: AuditLogsInclude | null;
    where: AuditLogsWhereUniqueInput;
    create: AuditLogsCreateInput;
    update: AuditLogsUpdateInput;
};
export declare type AuditLogsUpsertArgsRequired = {
    select: AuditLogsSelect;
    include: AuditLogsInclude;
    where: AuditLogsWhereUniqueInput;
    create: AuditLogsCreateInput;
    update: AuditLogsUpdateInput;
};
export declare type AuditLogsSelectUpsertArgs = {
    select: AuditLogsSelect;
    where: AuditLogsWhereUniqueInput;
    create: AuditLogsCreateInput;
    update: AuditLogsUpdateInput;
};
export declare type AuditLogsSelectUpsertArgsOptional = {
    select?: AuditLogsSelect | null;
    where: AuditLogsWhereUniqueInput;
    create: AuditLogsCreateInput;
    update: AuditLogsUpdateInput;
};
export declare type AuditLogsIncludeUpsertArgs = {
    include: AuditLogsInclude;
    where: AuditLogsWhereUniqueInput;
    create: AuditLogsCreateInput;
    update: AuditLogsUpdateInput;
};
export declare type AuditLogsIncludeUpsertArgsOptional = {
    include?: AuditLogsInclude | null;
    where: AuditLogsWhereUniqueInput;
    create: AuditLogsCreateInput;
    update: AuditLogsUpdateInput;
};
export declare type ExtractAuditLogsSelectUpsertArgs<S extends undefined | boolean | AuditLogsSelectUpsertArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends AuditLogsSelectUpsertArgs ? S['select'] : true;
export declare type ExtractAuditLogsIncludeUpsertArgs<S extends undefined | boolean | AuditLogsIncludeUpsertArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends AuditLogsIncludeUpsertArgs ? S['include'] : true;
/**
 * AuditLogs delete
 */
export declare type AuditLogsDeleteArgs = {
    select?: AuditLogsSelect | null;
    include?: AuditLogsInclude | null;
    where: AuditLogsWhereUniqueInput;
};
export declare type AuditLogsDeleteArgsRequired = {
    select: AuditLogsSelect;
    include: AuditLogsInclude;
    where: AuditLogsWhereUniqueInput;
};
export declare type AuditLogsSelectDeleteArgs = {
    select: AuditLogsSelect;
    where: AuditLogsWhereUniqueInput;
};
export declare type AuditLogsSelectDeleteArgsOptional = {
    select?: AuditLogsSelect | null;
    where: AuditLogsWhereUniqueInput;
};
export declare type AuditLogsIncludeDeleteArgs = {
    include: AuditLogsInclude;
    where: AuditLogsWhereUniqueInput;
};
export declare type AuditLogsIncludeDeleteArgsOptional = {
    include?: AuditLogsInclude | null;
    where: AuditLogsWhereUniqueInput;
};
export declare type ExtractAuditLogsSelectDeleteArgs<S extends undefined | boolean | AuditLogsSelectDeleteArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends AuditLogsSelectDeleteArgs ? S['select'] : true;
export declare type ExtractAuditLogsIncludeDeleteArgs<S extends undefined | boolean | AuditLogsIncludeDeleteArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends AuditLogsIncludeDeleteArgs ? S['include'] : true;
/**
 * AuditLogs deleteMany
 */
export declare type AuditLogsDeleteManyArgs = {
    where?: AuditLogsWhereInput | null;
};
/**
 * AuditLogs without action
 */
export declare type AuditLogsArgs = {
    select?: AuditLogsSelect | null;
    include?: AuditLogsInclude | null;
};
export declare type AuditLogsArgsRequired = {
    select: AuditLogsSelect;
    include: AuditLogsInclude;
};
export declare type AuditLogsSelectArgs = {
    select: AuditLogsSelect;
};
export declare type AuditLogsSelectArgsOptional = {
    select?: AuditLogsSelect | null;
};
export declare type AuditLogsIncludeArgs = {
    include: AuditLogsInclude;
};
export declare type AuditLogsIncludeArgsOptional = {
    include?: AuditLogsInclude | null;
};
export declare type ExtractAuditLogsSelectArgs<S extends undefined | boolean | AuditLogsSelectArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends AuditLogsSelectArgs ? S['select'] : true;
export declare type ExtractAuditLogsIncludeArgs<S extends undefined | boolean | AuditLogsIncludeArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends AuditLogsIncludeArgs ? S['include'] : true;
/**
 * Deep Input Types
 */
export declare type ChannelAuthWhereInput = {
    id?: string | StringFilter | null;
    userID?: string | StringFilter | null;
    channelID?: string | StringFilter | null;
    whatsappno?: string | NullableStringFilter | null | null;
    status?: string | StringFilter | null;
    providerData?: string | NullableStringFilter | null | null;
    providerToken?: string | NullableStringFilter | null | null;
    userConfig?: string | NullableStringFilter | null | null;
    scopes?: TimecampusAuthFilter | null;
    createdDate?: Date | string | DateTimeFilter | null;
    updatedDate?: Date | string | DateTimeFilter | null;
    AND?: Enumerable<ChannelAuthWhereInput> | null;
    OR?: Enumerable<ChannelAuthWhereInput> | null;
    NOT?: Enumerable<ChannelAuthWhereInput> | null;
};
export declare type TimecampusAuthWhereInput = {
    id?: string | StringFilter | null;
    scope?: string | StringFilter | null;
    AND?: Enumerable<TimecampusAuthWhereInput> | null;
    OR?: Enumerable<TimecampusAuthWhereInput> | null;
    NOT?: Enumerable<TimecampusAuthWhereInput> | null;
    channelAuth?: ChannelAuthWhereInput | null;
};
export declare type TimecampusAuthWhereUniqueInput = {
    id?: string | null;
};
export declare type ChannelAuthWhereUniqueInput = {
    id?: string | null;
    userID?: string | null;
    channelID?: string | null;
};
export declare type AuditLogsWhereInput = {
    id?: string | StringFilter | null;
    userID?: string | StringFilter | null;
    whatsappno?: string | StringFilter | null;
    message?: string | StringFilter | null;
    direction?: string | StringFilter | null;
    metadata?: string | NullableStringFilter | null | null;
    createdDate?: Date | string | DateTimeFilter | null;
    updatedDate?: Date | string | DateTimeFilter | null;
    AND?: Enumerable<AuditLogsWhereInput> | null;
    OR?: Enumerable<AuditLogsWhereInput> | null;
    NOT?: Enumerable<AuditLogsWhereInput> | null;
};
export declare type AuditLogsWhereUniqueInput = {
    id?: string | null;
    userID?: string | null;
};
export declare type ChannelAuthCreateWithoutScopesInput = {
    id?: string | null;
    userID: string;
    channelID: string;
    whatsappno?: string | null;
    status: string;
    providerData?: string | null;
    providerToken?: string | null;
    userConfig?: string | null;
    createdDate?: Date | string | null;
    updatedDate?: Date | string | null;
};
export declare type ChannelAuthCreateOneWithoutChannelAuthInput = {
    create?: ChannelAuthCreateWithoutScopesInput | null;
    connect?: ChannelAuthWhereUniqueInput | null;
};
export declare type TimecampusAuthCreateInput = {
    id?: string | null;
    scope: string;
    channelAuth?: ChannelAuthCreateOneWithoutChannelAuthInput | null;
};
export declare type ChannelAuthUpdateWithoutScopesDataInput = {
    id?: string | null;
    userID?: string | null;
    channelID?: string | null;
    whatsappno?: string | null;
    status?: string | null;
    providerData?: string | null;
    providerToken?: string | null;
    userConfig?: string | null;
    createdDate?: Date | string | null;
    updatedDate?: Date | string | null;
};
export declare type ChannelAuthUpsertWithoutScopesInput = {
    update: ChannelAuthUpdateWithoutScopesDataInput;
    create: ChannelAuthCreateWithoutScopesInput;
};
export declare type ChannelAuthUpdateOneWithoutScopesInput = {
    create?: ChannelAuthCreateWithoutScopesInput | null;
    connect?: ChannelAuthWhereUniqueInput | null;
    disconnect?: boolean | null;
    delete?: boolean | null;
    update?: ChannelAuthUpdateWithoutScopesDataInput | null;
    upsert?: ChannelAuthUpsertWithoutScopesInput | null;
};
export declare type TimecampusAuthUpdateInput = {
    id?: string | null;
    scope?: string | null;
    channelAuth?: ChannelAuthUpdateOneWithoutScopesInput | null;
};
export declare type TimecampusAuthUpdateManyMutationInput = {
    id?: string | null;
    scope?: string | null;
};
export declare type TimecampusAuthCreateWithoutChannelAuthInput = {
    id?: string | null;
    scope: string;
};
export declare type TimecampusAuthCreateManyWithoutScopesInput = {
    create?: Enumerable<TimecampusAuthCreateWithoutChannelAuthInput> | null;
    connect?: Enumerable<TimecampusAuthWhereUniqueInput> | null;
};
export declare type ChannelAuthCreateInput = {
    id?: string | null;
    userID: string;
    channelID: string;
    whatsappno?: string | null;
    status: string;
    providerData?: string | null;
    providerToken?: string | null;
    userConfig?: string | null;
    createdDate?: Date | string | null;
    updatedDate?: Date | string | null;
    scopes?: TimecampusAuthCreateManyWithoutScopesInput | null;
};
export declare type TimecampusAuthUpdateWithoutChannelAuthDataInput = {
    id?: string | null;
    scope?: string | null;
};
export declare type TimecampusAuthUpdateWithWhereUniqueWithoutChannelAuthInput = {
    where: TimecampusAuthWhereUniqueInput;
    data: TimecampusAuthUpdateWithoutChannelAuthDataInput;
};
export declare type TimecampusAuthScalarWhereInput = {
    id?: string | StringFilter | null;
    scope?: string | StringFilter | null;
    AND?: Enumerable<TimecampusAuthScalarWhereInput> | null;
    OR?: Enumerable<TimecampusAuthScalarWhereInput> | null;
    NOT?: Enumerable<TimecampusAuthScalarWhereInput> | null;
};
export declare type TimecampusAuthUpdateManyDataInput = {
    id?: string | null;
    scope?: string | null;
};
export declare type TimecampusAuthUpdateManyWithWhereNestedInput = {
    where: TimecampusAuthScalarWhereInput;
    data: TimecampusAuthUpdateManyDataInput;
};
export declare type TimecampusAuthUpsertWithWhereUniqueWithoutChannelAuthInput = {
    where: TimecampusAuthWhereUniqueInput;
    update: TimecampusAuthUpdateWithoutChannelAuthDataInput;
    create: TimecampusAuthCreateWithoutChannelAuthInput;
};
export declare type TimecampusAuthUpdateManyWithoutChannelAuthInput = {
    create?: Enumerable<TimecampusAuthCreateWithoutChannelAuthInput> | null;
    connect?: Enumerable<TimecampusAuthWhereUniqueInput> | null;
    set?: Enumerable<TimecampusAuthWhereUniqueInput> | null;
    disconnect?: Enumerable<TimecampusAuthWhereUniqueInput> | null;
    delete?: Enumerable<TimecampusAuthWhereUniqueInput> | null;
    update?: Enumerable<TimecampusAuthUpdateWithWhereUniqueWithoutChannelAuthInput> | null;
    updateMany?: Enumerable<TimecampusAuthUpdateManyWithWhereNestedInput> | null;
    deleteMany?: Enumerable<TimecampusAuthScalarWhereInput> | null;
    upsert?: Enumerable<TimecampusAuthUpsertWithWhereUniqueWithoutChannelAuthInput> | null;
};
export declare type ChannelAuthUpdateInput = {
    id?: string | null;
    userID?: string | null;
    channelID?: string | null;
    whatsappno?: string | null;
    status?: string | null;
    providerData?: string | null;
    providerToken?: string | null;
    userConfig?: string | null;
    createdDate?: Date | string | null;
    updatedDate?: Date | string | null;
    scopes?: TimecampusAuthUpdateManyWithoutChannelAuthInput | null;
};
export declare type ChannelAuthUpdateManyMutationInput = {
    id?: string | null;
    userID?: string | null;
    channelID?: string | null;
    whatsappno?: string | null;
    status?: string | null;
    providerData?: string | null;
    providerToken?: string | null;
    userConfig?: string | null;
    createdDate?: Date | string | null;
    updatedDate?: Date | string | null;
};
export declare type AuditLogsCreateInput = {
    id?: string | null;
    userID: string;
    whatsappno: string;
    message: string;
    direction: string;
    metadata?: string | null;
    createdDate?: Date | string | null;
    updatedDate?: Date | string | null;
};
export declare type AuditLogsUpdateInput = {
    id?: string | null;
    userID?: string | null;
    whatsappno?: string | null;
    message?: string | null;
    direction?: string | null;
    metadata?: string | null;
    createdDate?: Date | string | null;
    updatedDate?: Date | string | null;
};
export declare type AuditLogsUpdateManyMutationInput = {
    id?: string | null;
    userID?: string | null;
    whatsappno?: string | null;
    message?: string | null;
    direction?: string | null;
    metadata?: string | null;
    createdDate?: Date | string | null;
    updatedDate?: Date | string | null;
};
export declare type StringFilter = {
    equals?: string | null;
    not?: string | StringFilter | null;
    in?: Enumerable<string> | null;
    notIn?: Enumerable<string> | null;
    lt?: string | null;
    lte?: string | null;
    gt?: string | null;
    gte?: string | null;
    contains?: string | null;
    startsWith?: string | null;
    endsWith?: string | null;
};
export declare type NullableStringFilter = {
    equals?: string | null | null;
    not?: string | null | NullableStringFilter | null;
    in?: Enumerable<string> | null;
    notIn?: Enumerable<string> | null;
    lt?: string | null;
    lte?: string | null;
    gt?: string | null;
    gte?: string | null;
    contains?: string | null;
    startsWith?: string | null;
    endsWith?: string | null;
};
export declare type TimecampusAuthFilter = {
    every?: TimecampusAuthWhereInput | null;
    some?: TimecampusAuthWhereInput | null;
    none?: TimecampusAuthWhereInput | null;
};
export declare type DateTimeFilter = {
    equals?: Date | string | null;
    not?: Date | string | DateTimeFilter | null;
    in?: Enumerable<Date | string> | null;
    notIn?: Enumerable<Date | string> | null;
    lt?: Date | string | null;
    lte?: Date | string | null;
    gt?: Date | string | null;
    gte?: Date | string | null;
};
export declare type TimecampusAuthOrderByInput = {
    id?: OrderByArg | null;
    scope?: OrderByArg | null;
};
export declare type ChannelAuthOrderByInput = {
    id?: OrderByArg | null;
    userID?: OrderByArg | null;
    channelID?: OrderByArg | null;
    whatsappno?: OrderByArg | null;
    status?: OrderByArg | null;
    providerData?: OrderByArg | null;
    providerToken?: OrderByArg | null;
    userConfig?: OrderByArg | null;
    createdDate?: OrderByArg | null;
    updatedDate?: OrderByArg | null;
};
export declare type AuditLogsOrderByInput = {
    id?: OrderByArg | null;
    userID?: OrderByArg | null;
    whatsappno?: OrderByArg | null;
    message?: OrderByArg | null;
    direction?: OrderByArg | null;
    metadata?: OrderByArg | null;
    createdDate?: OrderByArg | null;
    updatedDate?: OrderByArg | null;
};
/**
 * Batch Payload for updateMany & deleteMany
 */
export declare type BatchPayload = {
    count: number;
};
/**
 * DMMF
 */
export declare const dmmf: DMMF.Document;
export {};
