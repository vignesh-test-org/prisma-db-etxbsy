import { Store } from '../db.utils';

export const test = async function() {
    let store = new Store();
    let db = store.getStore();

    await db.channelAuths.findMany({});
};

export const test1 = async function() {
    let store = new Store();
    let db = store.getStore();

    await db.auditLogs.findMany({});
};
