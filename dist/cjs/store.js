"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TopStore = exports.ChildStore = exports.AbstractStore = void 0;
const rxjs_1 = require("rxjs");
const entity_1 = require("./entity");
class AbstractStore {
    constructor(name, finalize, promiseCtr) {
        this.name = name;
        this.finalize = finalize;
        this.promiseCtr = promiseCtr;
        this._items = new Map();
        this.insersions = new rxjs_1.Subject();
        this.emptyInsersions = new rxjs_1.Subject();
    }
    rewind(id) {
        const item = this._items.get(id);
        entity_1.getEntity(item?.entity)?.rewind();
    }
    /**
     * Ensures the existance of an entity with a givin id using a givin construction logic
     * @param id id of the item to be prepared
     * @param handler the asynchronous function to be executed in order to prepare the item
     * @returns an observable that holds the logic behind the entity construction
     */
    prepare(id, handler) {
        const entityFlow = this.get(id);
        return new rxjs_1.Observable(subscriber => {
            const subsciption = entityFlow.observable.subscribe(subscriber);
            const item = this._items.get(id);
            if (!item)
                return; // assert item is not null (unless id has changed)
            // if the item exists but not because of `prepare` call, execute the handler anyway
            const next = item.next = (item.next || {
                then: (_, catcher) => {
                    try {
                        return this.promiseCtr.resolve(catcher());
                    }
                    catch (e) {
                        return this.promiseCtr.reject(e);
                    }
                }
            }).then(undefined, () => {
                const i = item;
                if (!item.closed && !item.ready) {
                    return handler(item.id, { get ready() { return i.ready; } }, subs => subsciption.add(subs));
                }
            });
            next.then(undefined, () => { });
            return subsciption;
        });
    }
    nextBulk(items) {
        const insersions = items.filter(({ id, data }) => this._next(id, data)).map(({ id }) => id);
        this.insersions.next(insersions);
    }
    next(id, data) {
        if (this._next(id, data))
            this.insersions.next([id]);
    }
    _next(id, data) {
        const item = this._items.get(id);
        if (!item)
            return;
        if (item.entity) {
            entity_1.$update(item.entity, data);
            item.ready = true;
            return false;
        }
        else {
            this.setItemEntity(id, data, item);
            const entity = item.entity;
            item.ready = true;
            item.observers.forEach(subscriber => subscriber.next(entity));
            return true;
        }
    }
    updateId(oldId, newId) {
        /** @TODO consider when newId is taken */
        if (this._items.get(newId))
            throw new Error('New Id "' + newId + '" is taken');
        const item = this._items.get(oldId);
        if (!item)
            return;
        item.id = newId;
        this._items.delete(oldId);
        this._items.set(newId, item);
        entity_1.getEntity(item.entity)?.setParent();
        item.parentSubscription?.unsubscribe();
        this.linkParentNewId(oldId, newId, item);
    }
    update(id, data) {
        entity_1.getEntity(this._items.get(id)?.entity)?.update(data);
    }
    item(id, observer) {
        let item = this._items.get(id);
        if (!item)
            this._items.set(id, item = { id, observers: [observer] });
        else
            item.observers.push(observer);
        return item;
    }
    get(id, skipCurrent) {
        return entity_1.entityFlow(new rxjs_1.Observable((subscriber) => {
            const item = this.item(id, subscriber);
            const observers = item.observers;
            if (item.entity) {
                if (!skipCurrent)
                    subscriber.next(item.entity);
            }
            else {
                this.subscribeToParent(id, item, skipCurrent);
            }
            return () => {
                const id = item.id, i = observers.indexOf(subscriber);
                if (i !== -1)
                    observers.splice(i, 1);
                if (!observers.length) {
                    const subscription = item.parentSubscription;
                    this._items.delete(id);
                    item.closed = true;
                    // debugger;
                    if (item.entity) {
                        this.finalize(id, item.entity);
                    }
                    if (subscription) {
                        subscription.unsubscribe();
                    }
                }
            };
        }));
    }
}
exports.AbstractStore = AbstractStore;
class ChildStore extends AbstractStore {
    constructor(name, finalize, promiseCtr, parent) {
        super(name, finalize, promiseCtr);
        this.parent = parent;
    }
    setItemEntity(id, data, item) {
        const parentFlow = this.parent.get(id);
        item.entity = entity_1.toEntity(new entity_1.ChildEntityImpl({
            store: this, data, ready: false,
            parentPromise: {
                then: (setParent) => {
                    const subscription = parentFlow.observable.subscribe(parent => setParent(parent));
                    item.parentSubscription?.unsubscribe();
                    item.parentSubscription = subscription;
                }
            }
        }));
    }
    linkParentNewId(_oldId, newId, item) {
        const parentFlow = this.parent.get(newId);
        const entity = item.entity;
        if (!entity)
            return;
        item.parentSubscription = parentFlow.observable.subscribe(parent => {
            entity_1.getEntity(entity).setParent(parent);
        });
    }
    subscribeToParent(id, item, skipCurrent) {
        if (!item.parentSubscription) {
            const observers = item.observers;
            let run = !skipCurrent;
            // this._entities.set will not be runned when .next is invoked because it will be already unsubscribed
            item.parentSubscription = this.parent.get(id).observable.subscribe(parent => {
                item.entity = entity_1.toEntity(new entity_1.ChildEntityImpl({ data: {}, parent, ready: true, store: this }));
                this.emptyInsersions.next(item.id);
                if (run)
                    observers.forEach(subscriber => subscriber.next(item.entity));
            });
            run = true;
        }
    }
}
exports.ChildStore = ChildStore;
class TopStore extends AbstractStore {
    constructor(name, finalize, promiseCtr) { super(name, finalize, promiseCtr); }
    setItemEntity(_id, data, item) {
        item.entity = entity_1.toEntity(new entity_1.EntityImpl(data, this));
    }
    linkParentNewId() { }
    subscribeToParent() { }
}
exports.TopStore = TopStore;
//# sourceMappingURL=store.js.map