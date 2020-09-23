import { Subscription, Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { asAsync, Keys, wait } from '../common';
export class StoredList {
    /**
     * @param {Params} params
     */
    constructor(params) {
        /** list is null when `entities` has no subscription */
        this.list = null;
        this.subscriber = null;
        this.donePromises = [];
        this.parentSubscriber = () => new this.promiseCtr((resolve, reject) => {
            this.parentSubsctiption = this.parent?.entities.subscribe(async (parentList) => {
                const key = this.key;
                const flowList = parentList.list.map(e => this.keys.mapTo(k => this.stores[k].get(this.keyofEntity(k, e[k]))));
                const entitiesSet = new Set(this.list?.data.map(u => u.entity[key]));
                const parentEntities = await this.toPromise(flowList);
                const newIds = parentEntities.filter(e => !entitiesSet.has(e.entity[key])).map(e => this.keys.mapTo(k => this.keyofEntity(k, e.entity[k])));
                // console.log('newIds', newIds, this.store);
                const newEntities = await this.toPromise(newIds.map(id => this.keys.mapTo((k) => this.stores[k].get(id[k]))));
                // unsubscribe after new subscription made to reuse recently created entities
                parentEntities.forEach(s => s.subscription.unsubscribe());
                if (!this.list)
                    return reject();
                const newList = this.merge(key, this.list.data, newEntities);
                this.list = { data: newList, status: this._status(this.list.status, parentList.status) };
                this.subscriber?.next({ list: this.list.data.map(({ entity }) => entity), status: this.list.status });
                return resolve(this.list.status);
            });
        });
        this.entities = new Observable(subscriber => {
            console.log('+++ subscribing', this.stores);
            this.list = { data: [], status: undefined };
            this.subscriber = subscriber;
            this.reload();
            return () => {
                this.parentSubsctiption?.unsubscribe();
                this.parentSubsctiption = undefined;
                this.subscriber = null;
                this.list?.data.forEach(e => e.subscription.unsubscribe());
                this.list = null;
                console.log('xxx unsubscribed', this.stores);
            };
        }).pipe(shareReplay({ bufferSize: 1, refCount: true }));
        this._exec = (n, err, from, to) => asAsync(function* () {
            let done = [];
            try {
                if (!this._setDone(n, done, this.list))
                    return yield* wait(done[0]);
                const oldList = n ? this.list.data : [];
                [from, to] = [from || oldList[0]?.entity, to || oldList[oldList.length - 1]?.entity];
                const retrieved = yield* wait(this.retrieve(from, to, err));
                if (!this._setDone(n, done, this.list))
                    return yield* wait(done[0]);
                const list = yield* wait(this._populate(retrieved.data));
                if (!this._setDone(n, done, this.list))
                    return yield* wait(done[0]);
                // if reload, unsubscribe from old entities
                if (!n)
                    this.list.data.forEach(e => e.subscription.unsubscribe());
                this.list = { data: oldList.concat(list), status: retrieved.done };
                if (retrieved.done === undefined && this.parent)
                    try {
                        const parentDone = yield* wait(this.parentSubsctiption ? this.parent.exec(n, null) : this.parentSubscriber());
                        return parentDone;
                    }
                    catch (e) {
                        // unsubscribed while retrieving data from parent
                        return true;
                    }
                else {
                    this.subscriber.next({ list: this.list.data.map(e => e.entity), status: this.list.status });
                    return retrieved.done;
                }
            }
            catch (e) {
                if (!this._setDone(n, done, this.list))
                    return yield* wait(done[0]);
                this.list.status = null;
                if (!this.parent)
                    throw e;
                try {
                    const parentDone = yield* wait(this.parentSubsctiption ? this.parent.exec(n, e) : this.parentSubscriber());
                    return this._status(null, parentDone);
                }
                catch (e) {
                    // unsubscribed while retrieving data from parent
                    return true;
                }
            }
            finally {
                this.donePromises[n] = undefined;
            }
        }, this.promiseCtr, this)();
        const { key, merge, retrieve, parent, keyof, keyofEntity, stores, promiseCtr } = params;
        this.keyof = keyof;
        this.keyofEntity = keyofEntity;
        this.stores = stores;
        this.keys = new Keys(stores);
        this.retrieve = retrieve;
        this.key = key;
        this.merge = merge;
        this.parent = parent;
        this.promiseCtr = promiseCtr;
    }
    add(entity) {
        const key = this.key;
        const id = this.keyofEntity(key, entity[key]);
        if (this.list === null || this.list.data.find(e => this.keyofEntity(key, e.entity[key]) === id))
            return;
        const subscription = new Subscription();
        const stores = this.stores;
        new Keys(entity).keys.forEach(k => {
            subscription.add(stores[k].get(id).observable.subscribe());
        });
        this.list = { data: [{ entity, subscription }, ...this.list.data], status: this.list.status };
        this.subscriber?.next({ list: this.list.data.map(e => e.entity), status: this.list.status });
    }
    remove(entity) {
        if (this.list === null)
            return;
        const index = this.list.data.findIndex(e => e.entity === entity);
        if (index !== -1) {
            const list = this.list;
            list.data[index].subscription.unsubscribe();
            list.data.splice(index, 1);
            this.subscriber?.next({ list: list.data.map(e => e.entity), status: list.status });
        }
    }
    toPromise(flowList) {
        return this.promiseCtr.all(flowList.map(async (entitiesFlow) => {
            const subscription = new Subscription();
            const entity = this.keys.asyncMapTo((k) => new this.promiseCtr(res => entitiesFlow[k].observable.subscribe(res)), this.promiseCtr);
            return entity.then((entity) => ({ subscription, entity }));
        }));
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
//# sourceMappingURL=stored-list.js.map