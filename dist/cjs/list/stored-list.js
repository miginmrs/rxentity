"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChildStoredList = exports.TopStoredList = exports.AbstractStoredList = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const entity_1 = require("../entity");
const common_1 = require("../common");
class AbstractStoredList {
    /**
     * @param {Params} params
     */
    constructor(params) {
        /** list is null when `entities` has no subscription */
        this.list = null;
        this.subscriber = null;
        this.donePromises = [];
        this.entities = new rxjs_1.Observable(subscriber => {
            this.list = { data: [], status: undefined };
            this.subscriber = subscriber;
            this.reload();
            return () => {
                this.parentSubsctiption?.unsubscribe();
                this.parentSubsctiption = undefined;
                this.subscriber = null;
                this.list?.data.forEach(e => e.subscription.unsubscribe());
                this.list = null;
            };
        }).pipe(operators_1.shareReplay({ bufferSize: 1, refCount: true }));
        this._exec = (n, err, from, to) => common_1.asAsync(function* () {
            let done = [];
            try {
                console.log(1, { n, err, from, to, this: this });
                if (!this._setDone(n, done, this.list))
                    return yield* common_1.wait(done[0]);
                console.log(2, { n, err, from, to, this: this });
                const oldList = n ? this.list.data : [];
                [from, to] = [from || oldList[0]?.entity, to || oldList[oldList.length - 1]?.entity];
                const retrieved = yield* common_1.wait(this.retrieve(from, to, err));
                console.log(3, { n, err, from, to, this: this, retrieved });
                if (!this._setDone(n, done, this.list))
                    return yield* common_1.wait(done[0]);
                console.log(4, { n, err, from, to, this: this });
                const list = yield* common_1.wait(this._populate(retrieved.data));
                console.log(5, { n, err, from, to, this: this });
                if (!this._setDone(n, done, this.list))
                    return yield* common_1.wait(done[0]);
                console.log(6, { n, err, from, to, this: this });
                // if reload, unsubscribe from old entities
                if (!n)
                    this.list.data.forEach(e => e.subscription.unsubscribe());
                this.list = { data: oldList.concat(list), status: retrieved.done };
                const process = () => {
                    if (!this.list)
                        throw new Error('Unexpected state');
                    this.subscriber.next({ list: this.list.data.map(e => e.entity), status: this.list.status });
                    return retrieved.done;
                };
                console.log(7, { n, err, from, to, this: this });
                return retrieved.done === undefined ? yield* this.fromParent(n, process) : process();
            }
            catch (e) {
                if (!this._setDone(n, done, this.list))
                    return yield* common_1.wait(done[0]);
                console.log(8, { n, err, from, to, this: this });
                this.list.status = null;
                return yield* this.handleError(n, e);
            }
            finally {
                console.log(9, { n, err, from, to, this: this });
                this.donePromises[n] = undefined;
            }
        }, this.promiseCtr, this)();
        const { key, merge, retrieve, keyof, keyofEntity, stores, promiseCtr } = params;
        this.keyof = keyof;
        this.keyofEntity = keyofEntity;
        this.stores = stores;
        this.keys = new common_1.Keys(stores);
        this.retrieve = retrieve;
        this.key = key;
        this.merge = merge;
        this.promiseCtr = promiseCtr;
    }
    add(entity) {
        const key = this.key;
        const id = this.keyofEntity(key, entity[key]);
        if (this.list === null || this.list.data.find(e => this.keyofEntity(key, e.entity[key]) === id))
            return;
        const subscription = new rxjs_1.Subscription();
        const stores = this.stores;
        new common_1.Keys(entity).keys.forEach(k => {
            const obs = stores[k].get(id).observable;
            subscription.add(obs.subscribe());
        });
        this.list = { data: [{ entity, subscription }, ...this.list.data], status: this.list.status };
        this.subscriber?.next({ list: this.list.data.map(e => e.entity), status: this.list.status });
    }
    remove(entity) {
        if (this.list === null)
            return;
        const index = this.list.data.findIndex(e => e.entity[this.key] === entity);
        if (index !== -1) {
            const list = this.list;
            this.removeFromParent(entity);
            list.data[index].subscription.unsubscribe();
            list.data.splice(index, 1);
            this.subscriber?.next({ list: list.data.map(e => e.entity), status: list.status });
        }
    }
    toPromise(flowList) {
        const entitiesWithSubs = flowList.map(common_1.asAsync(function* (entitiesFlow) {
            const subscription = new rxjs_1.Subscription();
            const entity = this.keys.asyncMapTo((k) => new this.promiseCtr(res => subscription.add(entitiesFlow[k].observable.subscribe(res))), this.promiseCtr);
            return yield* common_1.wait(entity.then((entity) => ({ subscription, entity })));
        }, this.promiseCtr, this));
        return this.promiseCtr.all(entitiesWithSubs);
    }
    _status(child, parent) {
        return child === null ? null : child ?? parent;
    }
    _populate(retrieved) {
        const flowList = retrieved.map(p => this.keys.mapTo(k => this.stores[k].get(this.keyof(k, p[k]))));
        const entitiesPromise = this.toPromise(flowList);
        this.keys.keys.forEach(k => this.stores[k].nextBulk(retrieved.map(p => ({ id: this.keyof(k, p[k]), data: p[k] }))));
        return entitiesPromise;
    }
    reload(err) {
        return this.exec(0, err);
    }
    more(err) {
        return this.exec(1, err);
    }
    _setDone(n, done, v) {
        if (v === null) {
            done[0] = this.promiseCtr.resolve(true);
            return false;
        }
        if (n > 0) {
            const prev = this.donePromises[n - 1];
            if (prev) {
                done[0] = prev;
                return false;
            }
        }
        return true;
    }
    exec(n, err, from, to) {
        return (this.donePromises[n] || (this.donePromises[n] = this._exec(n, err, from, to)));
    }
}
exports.AbstractStoredList = AbstractStoredList;
class TopStoredList extends AbstractStoredList {
    *handleError(_n, e) { throw e; }
    *fromParent(_n, process) { return process(); }
    removeFromParent() { }
}
exports.TopStoredList = TopStoredList;
class ChildStoredList extends AbstractStoredList {
    constructor(params) {
        super(params);
        this.parentSubscriber = () => new this.promiseCtr((resolve, reject) => {
            this.parentSubsctiption = this.parent?.entities.subscribe(parentList => common_1.asAsync(function* () {
                const key = this.key;
                const flowList = parentList.list.map(e => this.keys.mapTo((k) => {
                    const stores = this.stores;
                    return stores[k].get(this.keyofEntity(k, e[k]));
                }));
                const entitiesSet = new Set(this.list?.data.map(u => u.entity[key]));
                const parentEntities = yield* common_1.wait(this.toPromise(flowList));
                const newIds = parentEntities.filter(e => !entitiesSet.has(e.entity[key])).map(e => this.keys.mapTo(k => this.keyofEntity(k, e.entity[k])));
                // console.log('newIds', newIds, this.store);
                const newEntities = yield* common_1.wait(this.toPromise(newIds.map(id => this.keys.mapTo((k) => this.stores[k].get(id[k])))));
                // unsubscribe after new subscription made to reuse recently created entities
                parentEntities.forEach(s => s.subscription.unsubscribe());
                if (!this.list)
                    return reject();
                const newList = this.merge(key, this.list.data, newEntities);
                this.list = { data: newList, status: this._status(this.list.status, parentList.status) };
                this.subscriber?.next({ list: this.list.data.map(({ entity }) => entity), status: this.list.status });
                return resolve(this.list.status);
            }, this.promiseCtr, this)());
        });
        this.parent = params.parent;
    }
    *fromParent(n) {
        try {
            const parentDone = yield* common_1.wait(this.parentSubsctiption ? this.parent.exec(n, null) : this.parentSubscriber());
            return parentDone;
        }
        catch (e) {
            // unsubscribed while retrieving data from parent
            return true;
        }
    }
    *handleError(n, e) {
        try {
            const parentDone = yield* common_1.wait(this.parentSubsctiption ? this.parent.exec(n, e) : this.parentSubscriber());
            return this._status(null, parentDone);
        }
        catch (e) {
            // unsubscribed while retrieving data from parent
            return true;
        }
    }
    removeFromParent(entity) {
        const entityImpl = entity_1.getEntity(entity);
        if (entityImpl instanceof entity_1.ChildEntityImpl) {
            const childEntityImpl = entityImpl;
            if (childEntityImpl.parent)
                this.parent.remove(childEntityImpl.parent);
        }
    }
}
exports.ChildStoredList = ChildStoredList;
//# sourceMappingURL=stored-list.js.map