(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("rxjs"), require("rxjs/operators"));
	else if(typeof define === 'function' && define.amd)
		define(["rxjs", "rxjs/operators"], factory);
	else if(typeof exports === 'object')
		exports["rxentity"] = factory(require("rxjs"), require("rxjs/operators"));
	else
		root["rxentity"] = factory(root["rxjs"], root["rxjs"]["operators"]);
})(window, function(__WEBPACK_EXTERNAL_MODULE_rxjs__, __WEBPACK_EXTERNAL_MODULE_rxjs_operators__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./source/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/altern-map/dist/esm/altern-map.js":
/*!********************************************************!*\
  !*** ./node_modules/altern-map/dist/esm/altern-map.js ***!
  \********************************************************/
/*! exports provided: alternMap */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "alternMap", function() { return alternMap; });
/* harmony import */ var rxjs_internal_OuterSubscriber__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs/internal/OuterSubscriber */ "./node_modules/rxjs/internal/OuterSubscriber.js");
/* harmony import */ var rxjs_internal_OuterSubscriber__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(rxjs_internal_OuterSubscriber__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var rxjs_internal_InnerSubscriber__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/internal/InnerSubscriber */ "./node_modules/rxjs/internal/InnerSubscriber.js");
/* harmony import */ var rxjs_internal_InnerSubscriber__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(rxjs_internal_InnerSubscriber__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var rxjs_internal_util_subscribeToResult__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/internal/util/subscribeToResult */ "./node_modules/rxjs/internal/util/subscribeToResult.js");
/* harmony import */ var rxjs_internal_util_subscribeToResult__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(rxjs_internal_util_subscribeToResult__WEBPACK_IMPORTED_MODULE_2__);



function alternMap(...args) {
    const [project, options] = args;
    const op = (source) => source.lift(new AlternMapOperator(project, options || {}));
    if (!args[2])
        return op;
    const p = args[0];
    return (source) => Object.defineProperty(op(source), 'value', {
        get: () => p(source.value, -1).value
    });
}
class AlternMapOperator {
    constructor(project, options) {
        this.project = project;
        this.options = options;
    }
    call(subscriber, source) {
        return source.subscribe(new AlternMapSubscriber(subscriber, this.project, this.options));
    }
}
class AlternMapSubscriber extends rxjs_internal_OuterSubscriber__WEBPACK_IMPORTED_MODULE_0__["OuterSubscriber"] {
    constructor(destination, project, options) {
        super(destination);
        this.project = project;
        this.options = options;
        this.index = 0;
    }
    _next(value) {
        let result;
        const index = this.index++;
        try {
            result = this.project(value, index);
        }
        catch (error) {
            this.destination.error(error);
            return;
        }
        this._innerSub(result, value, index);
    }
    _innerSub(result, value, index) {
        const innerSubscription = this.innerSubscription;
        const innerSubscriber = new rxjs_internal_InnerSubscriber__WEBPACK_IMPORTED_MODULE_1__["InnerSubscriber"](this, value, index);
        const destination = this.destination;
        destination.add(innerSubscriber);
        this.innerSubscription = Object(rxjs_internal_util_subscribeToResult__WEBPACK_IMPORTED_MODULE_2__["subscribeToResult"])(this, result, undefined, undefined, innerSubscriber);
        if (this.innerSubscription !== innerSubscriber) {
            destination.add(this.innerSubscription);
        }
        if (innerSubscription) {
            innerSubscription.unsubscribe();
        }
    }
    _complete() {
        const { innerSubscription } = this;
        if (!innerSubscription || innerSubscription.closed || this.options.completeWithSource) {
            super._complete();
        }
        this.unsubscribe();
    }
    _unsubscribe() {
        this.innerSubscription = null;
    }
    notifyComplete(innerSub) {
        const destination = this.destination;
        destination.remove(innerSub);
        this.innerSubscription = null;
        if (this.isStopped || this.options.completeWithInner) {
            super._complete();
        }
    }
    notifyNext(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.destination.next(innerValue);
    }
}
//# sourceMappingURL=altern-map.js.map

/***/ }),

/***/ "./node_modules/altern-map/dist/esm/index.js":
/*!***************************************************!*\
  !*** ./node_modules/altern-map/dist/esm/index.js ***!
  \***************************************************/
/*! exports provided: alternMap */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _altern_map__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./altern-map */ "./node_modules/altern-map/dist/esm/altern-map.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "alternMap", function() { return _altern_map__WEBPACK_IMPORTED_MODULE_0__["alternMap"]; });


//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/rxjs/internal/InnerSubscriber.js":
/*!*******************************************************!*\
  !*** ./node_modules/rxjs/internal/InnerSubscriber.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Subscriber_1 = __webpack_require__(/*! ./Subscriber */ "./node_modules/rxjs/internal/Subscriber.js");
var InnerSubscriber = (function (_super) {
    __extends(InnerSubscriber, _super);
    function InnerSubscriber(parent, outerValue, outerIndex) {
        var _this = _super.call(this) || this;
        _this.parent = parent;
        _this.outerValue = outerValue;
        _this.outerIndex = outerIndex;
        _this.index = 0;
        return _this;
    }
    InnerSubscriber.prototype._next = function (value) {
        this.parent.notifyNext(this.outerValue, value, this.outerIndex, this.index++, this);
    };
    InnerSubscriber.prototype._error = function (error) {
        this.parent.notifyError(error, this);
        this.unsubscribe();
    };
    InnerSubscriber.prototype._complete = function () {
        this.parent.notifyComplete(this);
        this.unsubscribe();
    };
    return InnerSubscriber;
}(Subscriber_1.Subscriber));
exports.InnerSubscriber = InnerSubscriber;
//# sourceMappingURL=InnerSubscriber.js.map

/***/ }),

/***/ "./node_modules/rxjs/internal/Observable.js":
/*!**************************************************!*\
  !*** ./node_modules/rxjs/internal/Observable.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var canReportError_1 = __webpack_require__(/*! ./util/canReportError */ "./node_modules/rxjs/internal/util/canReportError.js");
var toSubscriber_1 = __webpack_require__(/*! ./util/toSubscriber */ "./node_modules/rxjs/internal/util/toSubscriber.js");
var observable_1 = __webpack_require__(/*! ./symbol/observable */ "./node_modules/rxjs/internal/symbol/observable.js");
var pipe_1 = __webpack_require__(/*! ./util/pipe */ "./node_modules/rxjs/internal/util/pipe.js");
var config_1 = __webpack_require__(/*! ./config */ "./node_modules/rxjs/internal/config.js");
var Observable = (function () {
    function Observable(subscribe) {
        this._isScalar = false;
        if (subscribe) {
            this._subscribe = subscribe;
        }
    }
    Observable.prototype.lift = function (operator) {
        var observable = new Observable();
        observable.source = this;
        observable.operator = operator;
        return observable;
    };
    Observable.prototype.subscribe = function (observerOrNext, error, complete) {
        var operator = this.operator;
        var sink = toSubscriber_1.toSubscriber(observerOrNext, error, complete);
        if (operator) {
            sink.add(operator.call(sink, this.source));
        }
        else {
            sink.add(this.source || (config_1.config.useDeprecatedSynchronousErrorHandling && !sink.syncErrorThrowable) ?
                this._subscribe(sink) :
                this._trySubscribe(sink));
        }
        if (config_1.config.useDeprecatedSynchronousErrorHandling) {
            if (sink.syncErrorThrowable) {
                sink.syncErrorThrowable = false;
                if (sink.syncErrorThrown) {
                    throw sink.syncErrorValue;
                }
            }
        }
        return sink;
    };
    Observable.prototype._trySubscribe = function (sink) {
        try {
            return this._subscribe(sink);
        }
        catch (err) {
            if (config_1.config.useDeprecatedSynchronousErrorHandling) {
                sink.syncErrorThrown = true;
                sink.syncErrorValue = err;
            }
            if (canReportError_1.canReportError(sink)) {
                sink.error(err);
            }
            else {
                console.warn(err);
            }
        }
    };
    Observable.prototype.forEach = function (next, promiseCtor) {
        var _this = this;
        promiseCtor = getPromiseCtor(promiseCtor);
        return new promiseCtor(function (resolve, reject) {
            var subscription;
            subscription = _this.subscribe(function (value) {
                try {
                    next(value);
                }
                catch (err) {
                    reject(err);
                    if (subscription) {
                        subscription.unsubscribe();
                    }
                }
            }, reject, resolve);
        });
    };
    Observable.prototype._subscribe = function (subscriber) {
        var source = this.source;
        return source && source.subscribe(subscriber);
    };
    Observable.prototype[observable_1.observable] = function () {
        return this;
    };
    Observable.prototype.pipe = function () {
        var operations = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            operations[_i] = arguments[_i];
        }
        if (operations.length === 0) {
            return this;
        }
        return pipe_1.pipeFromArray(operations)(this);
    };
    Observable.prototype.toPromise = function (promiseCtor) {
        var _this = this;
        promiseCtor = getPromiseCtor(promiseCtor);
        return new promiseCtor(function (resolve, reject) {
            var value;
            _this.subscribe(function (x) { return value = x; }, function (err) { return reject(err); }, function () { return resolve(value); });
        });
    };
    Observable.create = function (subscribe) {
        return new Observable(subscribe);
    };
    return Observable;
}());
exports.Observable = Observable;
function getPromiseCtor(promiseCtor) {
    if (!promiseCtor) {
        promiseCtor = config_1.config.Promise || Promise;
    }
    if (!promiseCtor) {
        throw new Error('no Promise impl found');
    }
    return promiseCtor;
}
//# sourceMappingURL=Observable.js.map

/***/ }),

/***/ "./node_modules/rxjs/internal/Observer.js":
/*!************************************************!*\
  !*** ./node_modules/rxjs/internal/Observer.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = __webpack_require__(/*! ./config */ "./node_modules/rxjs/internal/config.js");
var hostReportError_1 = __webpack_require__(/*! ./util/hostReportError */ "./node_modules/rxjs/internal/util/hostReportError.js");
exports.empty = {
    closed: true,
    next: function (value) { },
    error: function (err) {
        if (config_1.config.useDeprecatedSynchronousErrorHandling) {
            throw err;
        }
        else {
            hostReportError_1.hostReportError(err);
        }
    },
    complete: function () { }
};
//# sourceMappingURL=Observer.js.map

/***/ }),

/***/ "./node_modules/rxjs/internal/OuterSubscriber.js":
/*!*******************************************************!*\
  !*** ./node_modules/rxjs/internal/OuterSubscriber.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Subscriber_1 = __webpack_require__(/*! ./Subscriber */ "./node_modules/rxjs/internal/Subscriber.js");
var OuterSubscriber = (function (_super) {
    __extends(OuterSubscriber, _super);
    function OuterSubscriber() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    OuterSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.destination.next(innerValue);
    };
    OuterSubscriber.prototype.notifyError = function (error, innerSub) {
        this.destination.error(error);
    };
    OuterSubscriber.prototype.notifyComplete = function (innerSub) {
        this.destination.complete();
    };
    return OuterSubscriber;
}(Subscriber_1.Subscriber));
exports.OuterSubscriber = OuterSubscriber;
//# sourceMappingURL=OuterSubscriber.js.map

/***/ }),

/***/ "./node_modules/rxjs/internal/Subscriber.js":
/*!**************************************************!*\
  !*** ./node_modules/rxjs/internal/Subscriber.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var isFunction_1 = __webpack_require__(/*! ./util/isFunction */ "./node_modules/rxjs/internal/util/isFunction.js");
var Observer_1 = __webpack_require__(/*! ./Observer */ "./node_modules/rxjs/internal/Observer.js");
var Subscription_1 = __webpack_require__(/*! ./Subscription */ "./node_modules/rxjs/internal/Subscription.js");
var rxSubscriber_1 = __webpack_require__(/*! ../internal/symbol/rxSubscriber */ "./node_modules/rxjs/internal/symbol/rxSubscriber.js");
var config_1 = __webpack_require__(/*! ./config */ "./node_modules/rxjs/internal/config.js");
var hostReportError_1 = __webpack_require__(/*! ./util/hostReportError */ "./node_modules/rxjs/internal/util/hostReportError.js");
var Subscriber = (function (_super) {
    __extends(Subscriber, _super);
    function Subscriber(destinationOrNext, error, complete) {
        var _this = _super.call(this) || this;
        _this.syncErrorValue = null;
        _this.syncErrorThrown = false;
        _this.syncErrorThrowable = false;
        _this.isStopped = false;
        switch (arguments.length) {
            case 0:
                _this.destination = Observer_1.empty;
                break;
            case 1:
                if (!destinationOrNext) {
                    _this.destination = Observer_1.empty;
                    break;
                }
                if (typeof destinationOrNext === 'object') {
                    if (destinationOrNext instanceof Subscriber) {
                        _this.syncErrorThrowable = destinationOrNext.syncErrorThrowable;
                        _this.destination = destinationOrNext;
                        destinationOrNext.add(_this);
                    }
                    else {
                        _this.syncErrorThrowable = true;
                        _this.destination = new SafeSubscriber(_this, destinationOrNext);
                    }
                    break;
                }
            default:
                _this.syncErrorThrowable = true;
                _this.destination = new SafeSubscriber(_this, destinationOrNext, error, complete);
                break;
        }
        return _this;
    }
    Subscriber.prototype[rxSubscriber_1.rxSubscriber] = function () { return this; };
    Subscriber.create = function (next, error, complete) {
        var subscriber = new Subscriber(next, error, complete);
        subscriber.syncErrorThrowable = false;
        return subscriber;
    };
    Subscriber.prototype.next = function (value) {
        if (!this.isStopped) {
            this._next(value);
        }
    };
    Subscriber.prototype.error = function (err) {
        if (!this.isStopped) {
            this.isStopped = true;
            this._error(err);
        }
    };
    Subscriber.prototype.complete = function () {
        if (!this.isStopped) {
            this.isStopped = true;
            this._complete();
        }
    };
    Subscriber.prototype.unsubscribe = function () {
        if (this.closed) {
            return;
        }
        this.isStopped = true;
        _super.prototype.unsubscribe.call(this);
    };
    Subscriber.prototype._next = function (value) {
        this.destination.next(value);
    };
    Subscriber.prototype._error = function (err) {
        this.destination.error(err);
        this.unsubscribe();
    };
    Subscriber.prototype._complete = function () {
        this.destination.complete();
        this.unsubscribe();
    };
    Subscriber.prototype._unsubscribeAndRecycle = function () {
        var _parentOrParents = this._parentOrParents;
        this._parentOrParents = null;
        this.unsubscribe();
        this.closed = false;
        this.isStopped = false;
        this._parentOrParents = _parentOrParents;
        return this;
    };
    return Subscriber;
}(Subscription_1.Subscription));
exports.Subscriber = Subscriber;
var SafeSubscriber = (function (_super) {
    __extends(SafeSubscriber, _super);
    function SafeSubscriber(_parentSubscriber, observerOrNext, error, complete) {
        var _this = _super.call(this) || this;
        _this._parentSubscriber = _parentSubscriber;
        var next;
        var context = _this;
        if (isFunction_1.isFunction(observerOrNext)) {
            next = observerOrNext;
        }
        else if (observerOrNext) {
            next = observerOrNext.next;
            error = observerOrNext.error;
            complete = observerOrNext.complete;
            if (observerOrNext !== Observer_1.empty) {
                context = Object.create(observerOrNext);
                if (isFunction_1.isFunction(context.unsubscribe)) {
                    _this.add(context.unsubscribe.bind(context));
                }
                context.unsubscribe = _this.unsubscribe.bind(_this);
            }
        }
        _this._context = context;
        _this._next = next;
        _this._error = error;
        _this._complete = complete;
        return _this;
    }
    SafeSubscriber.prototype.next = function (value) {
        if (!this.isStopped && this._next) {
            var _parentSubscriber = this._parentSubscriber;
            if (!config_1.config.useDeprecatedSynchronousErrorHandling || !_parentSubscriber.syncErrorThrowable) {
                this.__tryOrUnsub(this._next, value);
            }
            else if (this.__tryOrSetError(_parentSubscriber, this._next, value)) {
                this.unsubscribe();
            }
        }
    };
    SafeSubscriber.prototype.error = function (err) {
        if (!this.isStopped) {
            var _parentSubscriber = this._parentSubscriber;
            var useDeprecatedSynchronousErrorHandling = config_1.config.useDeprecatedSynchronousErrorHandling;
            if (this._error) {
                if (!useDeprecatedSynchronousErrorHandling || !_parentSubscriber.syncErrorThrowable) {
                    this.__tryOrUnsub(this._error, err);
                    this.unsubscribe();
                }
                else {
                    this.__tryOrSetError(_parentSubscriber, this._error, err);
                    this.unsubscribe();
                }
            }
            else if (!_parentSubscriber.syncErrorThrowable) {
                this.unsubscribe();
                if (useDeprecatedSynchronousErrorHandling) {
                    throw err;
                }
                hostReportError_1.hostReportError(err);
            }
            else {
                if (useDeprecatedSynchronousErrorHandling) {
                    _parentSubscriber.syncErrorValue = err;
                    _parentSubscriber.syncErrorThrown = true;
                }
                else {
                    hostReportError_1.hostReportError(err);
                }
                this.unsubscribe();
            }
        }
    };
    SafeSubscriber.prototype.complete = function () {
        var _this = this;
        if (!this.isStopped) {
            var _parentSubscriber = this._parentSubscriber;
            if (this._complete) {
                var wrappedComplete = function () { return _this._complete.call(_this._context); };
                if (!config_1.config.useDeprecatedSynchronousErrorHandling || !_parentSubscriber.syncErrorThrowable) {
                    this.__tryOrUnsub(wrappedComplete);
                    this.unsubscribe();
                }
                else {
                    this.__tryOrSetError(_parentSubscriber, wrappedComplete);
                    this.unsubscribe();
                }
            }
            else {
                this.unsubscribe();
            }
        }
    };
    SafeSubscriber.prototype.__tryOrUnsub = function (fn, value) {
        try {
            fn.call(this._context, value);
        }
        catch (err) {
            this.unsubscribe();
            if (config_1.config.useDeprecatedSynchronousErrorHandling) {
                throw err;
            }
            else {
                hostReportError_1.hostReportError(err);
            }
        }
    };
    SafeSubscriber.prototype.__tryOrSetError = function (parent, fn, value) {
        if (!config_1.config.useDeprecatedSynchronousErrorHandling) {
            throw new Error('bad call');
        }
        try {
            fn.call(this._context, value);
        }
        catch (err) {
            if (config_1.config.useDeprecatedSynchronousErrorHandling) {
                parent.syncErrorValue = err;
                parent.syncErrorThrown = true;
                return true;
            }
            else {
                hostReportError_1.hostReportError(err);
                return true;
            }
        }
        return false;
    };
    SafeSubscriber.prototype._unsubscribe = function () {
        var _parentSubscriber = this._parentSubscriber;
        this._context = null;
        this._parentSubscriber = null;
        _parentSubscriber.unsubscribe();
    };
    return SafeSubscriber;
}(Subscriber));
exports.SafeSubscriber = SafeSubscriber;
//# sourceMappingURL=Subscriber.js.map

/***/ }),

/***/ "./node_modules/rxjs/internal/Subscription.js":
/*!****************************************************!*\
  !*** ./node_modules/rxjs/internal/Subscription.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var isArray_1 = __webpack_require__(/*! ./util/isArray */ "./node_modules/rxjs/internal/util/isArray.js");
var isObject_1 = __webpack_require__(/*! ./util/isObject */ "./node_modules/rxjs/internal/util/isObject.js");
var isFunction_1 = __webpack_require__(/*! ./util/isFunction */ "./node_modules/rxjs/internal/util/isFunction.js");
var UnsubscriptionError_1 = __webpack_require__(/*! ./util/UnsubscriptionError */ "./node_modules/rxjs/internal/util/UnsubscriptionError.js");
var Subscription = (function () {
    function Subscription(unsubscribe) {
        this.closed = false;
        this._parentOrParents = null;
        this._subscriptions = null;
        if (unsubscribe) {
            this._ctorUnsubscribe = true;
            this._unsubscribe = unsubscribe;
        }
    }
    Subscription.prototype.unsubscribe = function () {
        var errors;
        if (this.closed) {
            return;
        }
        var _a = this, _parentOrParents = _a._parentOrParents, _ctorUnsubscribe = _a._ctorUnsubscribe, _unsubscribe = _a._unsubscribe, _subscriptions = _a._subscriptions;
        this.closed = true;
        this._parentOrParents = null;
        this._subscriptions = null;
        if (_parentOrParents instanceof Subscription) {
            _parentOrParents.remove(this);
        }
        else if (_parentOrParents !== null) {
            for (var index = 0; index < _parentOrParents.length; ++index) {
                var parent_1 = _parentOrParents[index];
                parent_1.remove(this);
            }
        }
        if (isFunction_1.isFunction(_unsubscribe)) {
            if (_ctorUnsubscribe) {
                this._unsubscribe = undefined;
            }
            try {
                _unsubscribe.call(this);
            }
            catch (e) {
                errors = e instanceof UnsubscriptionError_1.UnsubscriptionError ? flattenUnsubscriptionErrors(e.errors) : [e];
            }
        }
        if (isArray_1.isArray(_subscriptions)) {
            var index = -1;
            var len = _subscriptions.length;
            while (++index < len) {
                var sub = _subscriptions[index];
                if (isObject_1.isObject(sub)) {
                    try {
                        sub.unsubscribe();
                    }
                    catch (e) {
                        errors = errors || [];
                        if (e instanceof UnsubscriptionError_1.UnsubscriptionError) {
                            errors = errors.concat(flattenUnsubscriptionErrors(e.errors));
                        }
                        else {
                            errors.push(e);
                        }
                    }
                }
            }
        }
        if (errors) {
            throw new UnsubscriptionError_1.UnsubscriptionError(errors);
        }
    };
    Subscription.prototype.add = function (teardown) {
        var subscription = teardown;
        if (!teardown) {
            return Subscription.EMPTY;
        }
        switch (typeof teardown) {
            case 'function':
                subscription = new Subscription(teardown);
            case 'object':
                if (subscription === this || subscription.closed || typeof subscription.unsubscribe !== 'function') {
                    return subscription;
                }
                else if (this.closed) {
                    subscription.unsubscribe();
                    return subscription;
                }
                else if (!(subscription instanceof Subscription)) {
                    var tmp = subscription;
                    subscription = new Subscription();
                    subscription._subscriptions = [tmp];
                }
                break;
            default: {
                throw new Error('unrecognized teardown ' + teardown + ' added to Subscription.');
            }
        }
        var _parentOrParents = subscription._parentOrParents;
        if (_parentOrParents === null) {
            subscription._parentOrParents = this;
        }
        else if (_parentOrParents instanceof Subscription) {
            if (_parentOrParents === this) {
                return subscription;
            }
            subscription._parentOrParents = [_parentOrParents, this];
        }
        else if (_parentOrParents.indexOf(this) === -1) {
            _parentOrParents.push(this);
        }
        else {
            return subscription;
        }
        var subscriptions = this._subscriptions;
        if (subscriptions === null) {
            this._subscriptions = [subscription];
        }
        else {
            subscriptions.push(subscription);
        }
        return subscription;
    };
    Subscription.prototype.remove = function (subscription) {
        var subscriptions = this._subscriptions;
        if (subscriptions) {
            var subscriptionIndex = subscriptions.indexOf(subscription);
            if (subscriptionIndex !== -1) {
                subscriptions.splice(subscriptionIndex, 1);
            }
        }
    };
    Subscription.EMPTY = (function (empty) {
        empty.closed = true;
        return empty;
    }(new Subscription()));
    return Subscription;
}());
exports.Subscription = Subscription;
function flattenUnsubscriptionErrors(errors) {
    return errors.reduce(function (errs, err) { return errs.concat((err instanceof UnsubscriptionError_1.UnsubscriptionError) ? err.errors : err); }, []);
}
//# sourceMappingURL=Subscription.js.map

/***/ }),

/***/ "./node_modules/rxjs/internal/config.js":
/*!**********************************************!*\
  !*** ./node_modules/rxjs/internal/config.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var _enable_super_gross_mode_that_will_cause_bad_things = false;
exports.config = {
    Promise: undefined,
    set useDeprecatedSynchronousErrorHandling(value) {
        if (value) {
            var error = new Error();
            console.warn('DEPRECATED! RxJS was set to use deprecated synchronous error handling behavior by code at: \n' + error.stack);
        }
        else if (_enable_super_gross_mode_that_will_cause_bad_things) {
            console.log('RxJS: Back to a better error behavior. Thank you. <3');
        }
        _enable_super_gross_mode_that_will_cause_bad_things = value;
    },
    get useDeprecatedSynchronousErrorHandling() {
        return _enable_super_gross_mode_that_will_cause_bad_things;
    },
};
//# sourceMappingURL=config.js.map

/***/ }),

/***/ "./node_modules/rxjs/internal/symbol/iterator.js":
/*!*******************************************************!*\
  !*** ./node_modules/rxjs/internal/symbol/iterator.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function getSymbolIterator() {
    if (typeof Symbol !== 'function' || !Symbol.iterator) {
        return '@@iterator';
    }
    return Symbol.iterator;
}
exports.getSymbolIterator = getSymbolIterator;
exports.iterator = getSymbolIterator();
exports.$$iterator = exports.iterator;
//# sourceMappingURL=iterator.js.map

/***/ }),

/***/ "./node_modules/rxjs/internal/symbol/observable.js":
/*!*********************************************************!*\
  !*** ./node_modules/rxjs/internal/symbol/observable.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.observable = (function () { return typeof Symbol === 'function' && Symbol.observable || '@@observable'; })();
//# sourceMappingURL=observable.js.map

/***/ }),

/***/ "./node_modules/rxjs/internal/symbol/rxSubscriber.js":
/*!***********************************************************!*\
  !*** ./node_modules/rxjs/internal/symbol/rxSubscriber.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.rxSubscriber = (function () {
    return typeof Symbol === 'function'
        ? Symbol('rxSubscriber')
        : '@@rxSubscriber_' + Math.random();
})();
exports.$$rxSubscriber = exports.rxSubscriber;
//# sourceMappingURL=rxSubscriber.js.map

/***/ }),

/***/ "./node_modules/rxjs/internal/util/UnsubscriptionError.js":
/*!****************************************************************!*\
  !*** ./node_modules/rxjs/internal/util/UnsubscriptionError.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var UnsubscriptionErrorImpl = (function () {
    function UnsubscriptionErrorImpl(errors) {
        Error.call(this);
        this.message = errors ?
            errors.length + " errors occurred during unsubscription:\n" + errors.map(function (err, i) { return i + 1 + ") " + err.toString(); }).join('\n  ') : '';
        this.name = 'UnsubscriptionError';
        this.errors = errors;
        return this;
    }
    UnsubscriptionErrorImpl.prototype = Object.create(Error.prototype);
    return UnsubscriptionErrorImpl;
})();
exports.UnsubscriptionError = UnsubscriptionErrorImpl;
//# sourceMappingURL=UnsubscriptionError.js.map

/***/ }),

/***/ "./node_modules/rxjs/internal/util/canReportError.js":
/*!***********************************************************!*\
  !*** ./node_modules/rxjs/internal/util/canReportError.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Subscriber_1 = __webpack_require__(/*! ../Subscriber */ "./node_modules/rxjs/internal/Subscriber.js");
function canReportError(observer) {
    while (observer) {
        var _a = observer, closed_1 = _a.closed, destination = _a.destination, isStopped = _a.isStopped;
        if (closed_1 || isStopped) {
            return false;
        }
        else if (destination && destination instanceof Subscriber_1.Subscriber) {
            observer = destination;
        }
        else {
            observer = null;
        }
    }
    return true;
}
exports.canReportError = canReportError;
//# sourceMappingURL=canReportError.js.map

/***/ }),

/***/ "./node_modules/rxjs/internal/util/hostReportError.js":
/*!************************************************************!*\
  !*** ./node_modules/rxjs/internal/util/hostReportError.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function hostReportError(err) {
    setTimeout(function () { throw err; }, 0);
}
exports.hostReportError = hostReportError;
//# sourceMappingURL=hostReportError.js.map

/***/ }),

/***/ "./node_modules/rxjs/internal/util/identity.js":
/*!*****************************************************!*\
  !*** ./node_modules/rxjs/internal/util/identity.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function identity(x) {
    return x;
}
exports.identity = identity;
//# sourceMappingURL=identity.js.map

/***/ }),

/***/ "./node_modules/rxjs/internal/util/isArray.js":
/*!****************************************************!*\
  !*** ./node_modules/rxjs/internal/util/isArray.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.isArray = (function () { return Array.isArray || (function (x) { return x && typeof x.length === 'number'; }); })();
//# sourceMappingURL=isArray.js.map

/***/ }),

/***/ "./node_modules/rxjs/internal/util/isArrayLike.js":
/*!********************************************************!*\
  !*** ./node_modules/rxjs/internal/util/isArrayLike.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.isArrayLike = (function (x) { return x && typeof x.length === 'number' && typeof x !== 'function'; });
//# sourceMappingURL=isArrayLike.js.map

/***/ }),

/***/ "./node_modules/rxjs/internal/util/isFunction.js":
/*!*******************************************************!*\
  !*** ./node_modules/rxjs/internal/util/isFunction.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function isFunction(x) {
    return typeof x === 'function';
}
exports.isFunction = isFunction;
//# sourceMappingURL=isFunction.js.map

/***/ }),

/***/ "./node_modules/rxjs/internal/util/isObject.js":
/*!*****************************************************!*\
  !*** ./node_modules/rxjs/internal/util/isObject.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function isObject(x) {
    return x !== null && typeof x === 'object';
}
exports.isObject = isObject;
//# sourceMappingURL=isObject.js.map

/***/ }),

/***/ "./node_modules/rxjs/internal/util/isPromise.js":
/*!******************************************************!*\
  !*** ./node_modules/rxjs/internal/util/isPromise.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function isPromise(value) {
    return !!value && typeof value.subscribe !== 'function' && typeof value.then === 'function';
}
exports.isPromise = isPromise;
//# sourceMappingURL=isPromise.js.map

/***/ }),

/***/ "./node_modules/rxjs/internal/util/pipe.js":
/*!*************************************************!*\
  !*** ./node_modules/rxjs/internal/util/pipe.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var identity_1 = __webpack_require__(/*! ./identity */ "./node_modules/rxjs/internal/util/identity.js");
function pipe() {
    var fns = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        fns[_i] = arguments[_i];
    }
    return pipeFromArray(fns);
}
exports.pipe = pipe;
function pipeFromArray(fns) {
    if (fns.length === 0) {
        return identity_1.identity;
    }
    if (fns.length === 1) {
        return fns[0];
    }
    return function piped(input) {
        return fns.reduce(function (prev, fn) { return fn(prev); }, input);
    };
}
exports.pipeFromArray = pipeFromArray;
//# sourceMappingURL=pipe.js.map

/***/ }),

/***/ "./node_modules/rxjs/internal/util/subscribeTo.js":
/*!********************************************************!*\
  !*** ./node_modules/rxjs/internal/util/subscribeTo.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var subscribeToArray_1 = __webpack_require__(/*! ./subscribeToArray */ "./node_modules/rxjs/internal/util/subscribeToArray.js");
var subscribeToPromise_1 = __webpack_require__(/*! ./subscribeToPromise */ "./node_modules/rxjs/internal/util/subscribeToPromise.js");
var subscribeToIterable_1 = __webpack_require__(/*! ./subscribeToIterable */ "./node_modules/rxjs/internal/util/subscribeToIterable.js");
var subscribeToObservable_1 = __webpack_require__(/*! ./subscribeToObservable */ "./node_modules/rxjs/internal/util/subscribeToObservable.js");
var isArrayLike_1 = __webpack_require__(/*! ./isArrayLike */ "./node_modules/rxjs/internal/util/isArrayLike.js");
var isPromise_1 = __webpack_require__(/*! ./isPromise */ "./node_modules/rxjs/internal/util/isPromise.js");
var isObject_1 = __webpack_require__(/*! ./isObject */ "./node_modules/rxjs/internal/util/isObject.js");
var iterator_1 = __webpack_require__(/*! ../symbol/iterator */ "./node_modules/rxjs/internal/symbol/iterator.js");
var observable_1 = __webpack_require__(/*! ../symbol/observable */ "./node_modules/rxjs/internal/symbol/observable.js");
exports.subscribeTo = function (result) {
    if (!!result && typeof result[observable_1.observable] === 'function') {
        return subscribeToObservable_1.subscribeToObservable(result);
    }
    else if (isArrayLike_1.isArrayLike(result)) {
        return subscribeToArray_1.subscribeToArray(result);
    }
    else if (isPromise_1.isPromise(result)) {
        return subscribeToPromise_1.subscribeToPromise(result);
    }
    else if (!!result && typeof result[iterator_1.iterator] === 'function') {
        return subscribeToIterable_1.subscribeToIterable(result);
    }
    else {
        var value = isObject_1.isObject(result) ? 'an invalid object' : "'" + result + "'";
        var msg = "You provided " + value + " where a stream was expected."
            + ' You can provide an Observable, Promise, Array, or Iterable.';
        throw new TypeError(msg);
    }
};
//# sourceMappingURL=subscribeTo.js.map

/***/ }),

/***/ "./node_modules/rxjs/internal/util/subscribeToArray.js":
/*!*************************************************************!*\
  !*** ./node_modules/rxjs/internal/util/subscribeToArray.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.subscribeToArray = function (array) { return function (subscriber) {
    for (var i = 0, len = array.length; i < len && !subscriber.closed; i++) {
        subscriber.next(array[i]);
    }
    subscriber.complete();
}; };
//# sourceMappingURL=subscribeToArray.js.map

/***/ }),

/***/ "./node_modules/rxjs/internal/util/subscribeToIterable.js":
/*!****************************************************************!*\
  !*** ./node_modules/rxjs/internal/util/subscribeToIterable.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var iterator_1 = __webpack_require__(/*! ../symbol/iterator */ "./node_modules/rxjs/internal/symbol/iterator.js");
exports.subscribeToIterable = function (iterable) { return function (subscriber) {
    var iterator = iterable[iterator_1.iterator]();
    do {
        var item = void 0;
        try {
            item = iterator.next();
        }
        catch (err) {
            subscriber.error(err);
            return subscriber;
        }
        if (item.done) {
            subscriber.complete();
            break;
        }
        subscriber.next(item.value);
        if (subscriber.closed) {
            break;
        }
    } while (true);
    if (typeof iterator.return === 'function') {
        subscriber.add(function () {
            if (iterator.return) {
                iterator.return();
            }
        });
    }
    return subscriber;
}; };
//# sourceMappingURL=subscribeToIterable.js.map

/***/ }),

/***/ "./node_modules/rxjs/internal/util/subscribeToObservable.js":
/*!******************************************************************!*\
  !*** ./node_modules/rxjs/internal/util/subscribeToObservable.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var observable_1 = __webpack_require__(/*! ../symbol/observable */ "./node_modules/rxjs/internal/symbol/observable.js");
exports.subscribeToObservable = function (obj) { return function (subscriber) {
    var obs = obj[observable_1.observable]();
    if (typeof obs.subscribe !== 'function') {
        throw new TypeError('Provided object does not correctly implement Symbol.observable');
    }
    else {
        return obs.subscribe(subscriber);
    }
}; };
//# sourceMappingURL=subscribeToObservable.js.map

/***/ }),

/***/ "./node_modules/rxjs/internal/util/subscribeToPromise.js":
/*!***************************************************************!*\
  !*** ./node_modules/rxjs/internal/util/subscribeToPromise.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var hostReportError_1 = __webpack_require__(/*! ./hostReportError */ "./node_modules/rxjs/internal/util/hostReportError.js");
exports.subscribeToPromise = function (promise) { return function (subscriber) {
    promise.then(function (value) {
        if (!subscriber.closed) {
            subscriber.next(value);
            subscriber.complete();
        }
    }, function (err) { return subscriber.error(err); })
        .then(null, hostReportError_1.hostReportError);
    return subscriber;
}; };
//# sourceMappingURL=subscribeToPromise.js.map

/***/ }),

/***/ "./node_modules/rxjs/internal/util/subscribeToResult.js":
/*!**************************************************************!*\
  !*** ./node_modules/rxjs/internal/util/subscribeToResult.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var InnerSubscriber_1 = __webpack_require__(/*! ../InnerSubscriber */ "./node_modules/rxjs/internal/InnerSubscriber.js");
var subscribeTo_1 = __webpack_require__(/*! ./subscribeTo */ "./node_modules/rxjs/internal/util/subscribeTo.js");
var Observable_1 = __webpack_require__(/*! ../Observable */ "./node_modules/rxjs/internal/Observable.js");
function subscribeToResult(outerSubscriber, result, outerValue, outerIndex, innerSubscriber) {
    if (innerSubscriber === void 0) { innerSubscriber = new InnerSubscriber_1.InnerSubscriber(outerSubscriber, outerValue, outerIndex); }
    if (innerSubscriber.closed) {
        return undefined;
    }
    if (result instanceof Observable_1.Observable) {
        return result.subscribe(innerSubscriber);
    }
    return subscribeTo_1.subscribeTo(result)(innerSubscriber);
}
exports.subscribeToResult = subscribeToResult;
//# sourceMappingURL=subscribeToResult.js.map

/***/ }),

/***/ "./node_modules/rxjs/internal/util/toSubscriber.js":
/*!*********************************************************!*\
  !*** ./node_modules/rxjs/internal/util/toSubscriber.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Subscriber_1 = __webpack_require__(/*! ../Subscriber */ "./node_modules/rxjs/internal/Subscriber.js");
var rxSubscriber_1 = __webpack_require__(/*! ../symbol/rxSubscriber */ "./node_modules/rxjs/internal/symbol/rxSubscriber.js");
var Observer_1 = __webpack_require__(/*! ../Observer */ "./node_modules/rxjs/internal/Observer.js");
function toSubscriber(nextOrObserver, error, complete) {
    if (nextOrObserver) {
        if (nextOrObserver instanceof Subscriber_1.Subscriber) {
            return nextOrObserver;
        }
        if (nextOrObserver[rxSubscriber_1.rxSubscriber]) {
            return nextOrObserver[rxSubscriber_1.rxSubscriber]();
        }
    }
    if (!nextOrObserver && !error && !complete) {
        return new Subscriber_1.Subscriber(Observer_1.empty);
    }
    return new Subscriber_1.Subscriber(nextOrObserver, error, complete);
}
exports.toSubscriber = toSubscriber;
//# sourceMappingURL=toSubscriber.js.map

/***/ }),

/***/ "./node_modules/rxvalue/dist/esm/index.js":
/*!************************************************!*\
  !*** ./node_modules/rxvalue/dist/esm/index.js ***!
  \************************************************/
/*! exports provided: of, map, distinctUntilChanged, combine, idem, startWith, fromPromise */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _rxvalue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./rxvalue */ "./node_modules/rxvalue/dist/esm/rxvalue.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "of", function() { return _rxvalue__WEBPACK_IMPORTED_MODULE_0__["of"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "map", function() { return _rxvalue__WEBPACK_IMPORTED_MODULE_0__["map"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "distinctUntilChanged", function() { return _rxvalue__WEBPACK_IMPORTED_MODULE_0__["distinctUntilChanged"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "combine", function() { return _rxvalue__WEBPACK_IMPORTED_MODULE_0__["combine"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "idem", function() { return _rxvalue__WEBPACK_IMPORTED_MODULE_0__["idem"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "startWith", function() { return _rxvalue__WEBPACK_IMPORTED_MODULE_0__["startWith"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "fromPromise", function() { return _rxvalue__WEBPACK_IMPORTED_MODULE_0__["fromPromise"]; });


//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/rxvalue/dist/esm/rxvalue.js":
/*!**************************************************!*\
  !*** ./node_modules/rxvalue/dist/esm/rxvalue.js ***!
  \**************************************************/
/*! exports provided: of, map, distinctUntilChanged, combine, idem, startWith, fromPromise */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "of", function() { return of; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "map", function() { return map; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "distinctUntilChanged", function() { return distinctUntilChanged; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "combine", function() { return combine; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "idem", function() { return idem; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "startWith", function() { return startWith; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fromPromise", function() { return fromPromise; });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs */ "rxjs");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(rxjs__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ "rxjs/operators");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__);


const of = (value) => Object.assign(Object(rxjs__WEBPACK_IMPORTED_MODULE_0__["of"])(value), { value });
function map(p, thisArg, valued) {
    const map = Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["map"])(p, thisArg);
    return valued ? (source) => {
        const obs = map(source);
        return Object.defineProperty(obs, 'value', { get: () => p.call(thisArg, source.value, -1) });
    } : map;
}
function distinctUntilChanged(compare, keySelector, valued) {
    const op = compare && keySelector ? Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["distinctUntilChanged"])(compare, keySelector) : Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["distinctUntilChanged"])(compare);
    return valued ? (source) => {
        const obs = source.pipe(op);
        return Object.defineProperty(obs, 'value', { get: () => source.value });
    } : op;
}
const combine = (sources) => Object.defineProperty(Object(rxjs__WEBPACK_IMPORTED_MODULE_0__["combineLatest"])(sources), 'value', { get: () => sources.map(s => s.value) });
const idem = (op) => (o) => Object.defineProperty(o.pipe(op), 'value', { get: () => o.value });
const startWith = (source, value) => {
    const bs = new rxjs__WEBPACK_IMPORTED_MODULE_0__["BehaviorSubject"](value);
    return Object.defineProperty(source.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["multicast"])(bs), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["refCount"])()), 'value', { get: () => bs.value });
};
const fromPromise = (p, value) => {
    const observable = new rxjs__WEBPACK_IMPORTED_MODULE_0__["Observable"](subs => {
        let done = false;
        subs.next(value);
        p.then(v => {
            if (!done)
                subs.next(value = v);
            subs.complete();
        }, err => subs.error(err));
        return () => { done = true; };
    });
    return Object.defineProperty(observable, 'value', () => value);
};
//# sourceMappingURL=rxvalue.js.map

/***/ }),

/***/ "./source/common.ts":
/*!**************************!*\
  !*** ./source/common.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Keys = exports.guard = exports.asAsync = exports.wait = exports.runit = void 0;
exports.runit = (gen, promiseCtr) => {
    const runThen = (...args) => {
        const v = args.length == 1 ? gen.next(args[0]) : args.length ? gen.throw(args[1]) : gen.next();
        if (v.done)
            return promiseCtr.resolve(v.value);
        return promiseCtr.resolve(v.value).then(runThen, err => runThen(null, err));
    };
    return runThen();
};
function* wait(x) {
    return yield x;
}
exports.wait = wait;
function asAsync(f, promiseCtr, thisArg) {
    return (...args) => exports.runit(f.call(thisArg, ...args), promiseCtr);
}
exports.asAsync = asAsync;
exports.guard = (x, cond) => cond;
class Keys {
    constructor(o) { this.keys = Object.keys(o) /*.sort()*/; }
    mapTo(mapper) {
        const object = {};
        this.keys.forEach((k, i) => object[k] = mapper(k, i));
        return object;
    }
    asyncMapTo(mapper, promiseCtr) {
        const object = {};
        return promiseCtr.all(this.keys.map(k => mapper(k).then(v => object[k] = v))).then(() => object);
    }
}
exports.Keys = Keys;


/***/ }),

/***/ "./source/entity/entity-abstract.ts":
/*!******************************************!*\
  !*** ./source/entity/entity-abstract.ts ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.LinkedBehaviorSubject = exports.EntityAbstract = void 0;
const rxvalue_1 = __webpack_require__(/*! rxvalue */ "./node_modules/rxvalue/dist/esm/index.js");
const rxjs_1 = __webpack_require__(/*! rxjs */ "rxjs");
/**
 * Entity base class
 * @template T map of fields output types
 * @template V map of fields input types
 * @template S store type
 */
class EntityAbstract {
    /** `function` that returns the `ValuedSubject` for the givin `field` */
    constructor(store) {
        this.store = store;
        this.unlinkAll = () => {
            Object.keys(this.rxMap).forEach(k => this.rxMap[k].unlink());
        };
        /** updates some fields of the entity */
        this.update = (e) => {
            const rx = this.rx;
            Object.keys(e).forEach((k) => {
                rx(k).next(e[k]);
            });
        };
        /** undo local changes in the entity */
        this.rewind = (_field) => { };
        /** define the parent of the entity */
        this.setParent = () => { };
        /** get the number of entities between the actual and the source of the field */
        this.levelOf = (_field) => rxvalue_1.of(0);
    }
    /** a `getter` snapshot for all the entity `fields` */
    get snapshot() {
        const snapshot = {};
        const rx = this.rx;
        for (const k of Object.keys(this.rxMap)) {
            snapshot[k] = rx(k).value;
        }
        return snapshot;
    }
}
exports.EntityAbstract = EntityAbstract;
class LinkedBehaviorSubject extends rxjs_1.BehaviorSubject {
    unlink() {
        var _a;
        (_a = this._subs) === null || _a === void 0 ? void 0 : _a.unsubscribe();
    }
    next(v) {
        this.unlink();
        if (rxjs_1.isObservable(v))
            this._subs = v.subscribe(() => { });
        super.next(v);
    }
}
exports.LinkedBehaviorSubject = LinkedBehaviorSubject;


/***/ }),

/***/ "./source/entity/entity-child-impl.ts":
/*!********************************************!*\
  !*** ./source/entity/entity-child-impl.ts ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ChildEntityImpl = void 0;
const rxjs_1 = __webpack_require__(/*! rxjs */ "rxjs");
const entity_abstract_1 = __webpack_require__(/*! ./entity-abstract */ "./source/entity/entity-abstract.ts");
const rxvalue_1 = __webpack_require__(/*! rxvalue */ "./node_modules/rxvalue/dist/esm/index.js");
const entity_proxies_1 = __webpack_require__(/*! ./entity-proxies */ "./source/entity/entity-proxies.ts");
const altern_map_1 = __webpack_require__(/*! altern-map */ "./node_modules/altern-map/dist/esm/index.js");
/**
 * Child entity class
 * @template T map of fields output types
 * @template P map of fields parent output types
 * @template V map of fields input types
 * @template I union of initial field keys
 */
class ChildEntityImpl extends entity_abstract_1.EntityAbstract {
    constructor(params) {
        super(params.store);
        this.rx = (k) => {
            return this.rxMap[k] || (this.rxMap[k] = this.createRx(k));
        };
        this.rxSource = (k) => {
            return this.rxSourceMap[k] || (this.rxSourceMap[k] = new rxjs_1.BehaviorSubject(this._parent
                ? entity_proxies_1.$rx(this._parent, k)
                : new rxjs_1.BehaviorSubject(undefined)));
        };
        this._parent = undefined;
        this.setParent = (parent) => {
            const oldParent = this.parent;
            this._parent = parent;
            const rxSourceMap = this.rxSourceMap;
            if (parent)
                Object.keys(rxSourceMap).forEach((k) => {
                    if (rxSourceMap[k].value === undefined) {
                        rxSourceMap[k].next(entity_proxies_1.$rx(parent, k));
                    }
                });
            if (!oldParent)
                return;
            Object.keys(entity_proxies_1.$rxMap(oldParent)).forEach((k) => {
                var _a;
                if (((_a = rxSourceMap[k]) === null || _a === void 0 ? void 0 : _a.value) === entity_proxies_1.$rxMap(oldParent)[k]) {
                    if (parent)
                        rxSourceMap[k].next(entity_proxies_1.$rx(parent, k));
                    else {
                        rxSourceMap[k].next(new rxjs_1.BehaviorSubject(entity_proxies_1.$rxMap(oldParent)[k].value));
                    }
                }
            });
        };
        this.rewind = (field) => {
            const parent = this._parent;
            if (!parent)
                return;
            (field ? [field] : Object.keys(this.rxSourceMap)).forEach(field => {
                this.rx(field).unlink();
                this.rxSource(field).next(entity_proxies_1.$rx(parent, field));
            });
        };
        this.levelOf = (field) => this.rxSource(field).pipe(altern_map_1.alternMap((src) => { var _a; return src === ((_a = this._parent) === null || _a === void 0 ? void 0 : _a[field]) ? entity_proxies_1.$levelOf(this._parent, field).pipe(rxvalue_1.map(l => l + 1, 0, true)) : rxvalue_1.of(0); }, {}, true));
        const rxMap = this.rxMap = {};
        const rxSourceMap = this.rxSourceMap = {};
        let keys;
        if (params.ready) {
            const { data, parent } = params;
            this._parent = parent;
            keys = Object.keys(entity_proxies_1.$rxMap(parent));
            keys.forEach((k) => {
                const next = k in data
                    ? new rxjs_1.BehaviorSubject(data[k])
                    : entity_proxies_1.$rx(parent, k);
                rxSourceMap[k] = new rxjs_1.BehaviorSubject(next);
            });
        }
        else {
            const { data, parentPromise } = params;
            keys = Object.keys(data);
            parentPromise.then(this.setParent);
            keys.forEach((k) => {
                rxSourceMap[k] = new rxjs_1.BehaviorSubject(new rxjs_1.BehaviorSubject(data[k]));
            });
        }
        keys.forEach((k) => rxMap[k] = this.createRx(k));
    }
    createRx(k) {
        const rxSource = this.rxSource(k);
        const clone = altern_map_1.alternMap(rxjs_1.identity, {}, true);
        let subs;
        const unlink = () => subs === null || subs === void 0 ? void 0 : subs.unsubscribe();
        const next = (x) => {
            let old = subs;
            if (rxjs_1.isObservable(x))
                subs = x.subscribe(() => { });
            old === null || old === void 0 ? void 0 : old.unsubscribe();
            if (this._parent && rxSource.value === entity_proxies_1.$rx(this._parent, k)) {
                rxSource.next(new rxjs_1.BehaviorSubject(x));
            }
            else {
                rxSource.value.next(x);
            }
        };
        return Object.assign(rxSource.pipe(clone), { next, unlink });
    }
    get parent() { return this._parent; }
    ;
    get local() {
        if (!this._parent)
            return this.snapshot;
        const parent = this._parent;
        const snapshot = {};
        const rxSourceMap = this.rxSourceMap;
        for (const k of Object.keys(rxSourceMap)) {
            const source = rxSourceMap[k].value;
            if (source !== entity_proxies_1.$rxMap(parent)[k])
                snapshot[k] = source.value;
        }
        return snapshot;
    }
}
exports.ChildEntityImpl = ChildEntityImpl;


/***/ }),

/***/ "./source/entity/entity-impl.ts":
/*!**************************************!*\
  !*** ./source/entity/entity-impl.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityImpl = void 0;
const entity_abstract_1 = __webpack_require__(/*! ./entity-abstract */ "./source/entity/entity-abstract.ts");
/**
 * Top level entity class
 * @template T map of fields output types
 * @template V map of fields input types
 */
class EntityImpl extends entity_abstract_1.EntityAbstract {
    constructor(e, store) {
        super(store);
        this.rx = (k) => {
            return this.rxMap[k] || (this.rxMap[k] = new entity_abstract_1.LinkedBehaviorSubject(undefined));
        };
        const rxMap = this.rxMap = {};
        Object.keys(e).forEach(k => {
            rxMap[k] = new entity_abstract_1.LinkedBehaviorSubject(e[k]);
        });
    }
    get local() { return this.snapshot; }
}
exports.EntityImpl = EntityImpl;
;


/***/ }),

/***/ "./source/entity/entity-proxies.ts":
/*!*****************************************!*\
  !*** ./source/entity/entity-proxies.ts ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.$local = exports.$snapshot = exports.$update = exports.$rewind = exports.$levelOf = exports.$rxMap = exports.$rx = exports.toEntity = exports.entityFlow = exports.getEntity = void 0;
const altern_map_1 = __webpack_require__(/*! altern-map */ "./node_modules/altern-map/dist/esm/index.js");
const entities = new WeakMap();
function getEntity(e) {
    if (!e)
        return;
    return entities.get(e);
}
exports.getEntity = getEntity;
/** Extracts the field observable from the entity flow */
const fieldRX = (entity, field) => {
    return entity.pipe(altern_map_1.alternMap(e => getEntity(e).rx(field)));
};
/**
 * Creates an `EntityFlow` from an observable
 * @param observable the observable being proxified
 * @param {Record<Observable>} [field] optional external impl of the field observables proxy
 * @see {EntityFlow}
 */
exports.entityFlow = (observable, field) => new Proxy({}, {
    get(_target, key) {
        if (key === 'observable')
            return observable;
        if (key === 'field')
            return field || (field = new Proxy({}, {
                get(_, k) { return fieldRX(observable, k); }
            }));
        return fieldRX(observable, key);
    }
});
/**
 * Creates a proxified `Entity` from an `EntityAbstract`
 * @see {Entity}
 */
exports.toEntity = (entity) => {
    const proxy = new Proxy(Object.prototype, {
        get(_, key) {
            return entity.rx(key);
        },
        ownKeys() {
            return Object.keys(entity.rxMap);
        }
    });
    entities.set(proxy, entity);
    return proxy;
};
exports.$rx = (entity, k) => getEntity(entity).rx(k);
exports.$rxMap = (entity) => getEntity(entity).rxMap;
exports.$levelOf = (entity, k) => getEntity(entity).levelOf(k);
exports.$rewind = (entity, k) => getEntity(entity).rewind(k);
exports.$update = (entity, e) => getEntity(entity).update(e);
exports.$snapshot = (entity) => getEntity(entity).snapshot;
exports.$local = (entity) => getEntity(entity).local;


/***/ }),

/***/ "./source/entity/index.ts":
/*!********************************!*\
  !*** ./source/entity/index.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(__webpack_require__(/*! ./entity-abstract */ "./source/entity/entity-abstract.ts"), exports);
__exportStar(__webpack_require__(/*! ./entity-child-impl */ "./source/entity/entity-child-impl.ts"), exports);
__exportStar(__webpack_require__(/*! ./entity-impl */ "./source/entity/entity-impl.ts"), exports);
__exportStar(__webpack_require__(/*! ./entity-proxies */ "./source/entity/entity-proxies.ts"), exports);


/***/ }),

/***/ "./source/index.ts":
/*!*************************!*\
  !*** ./source/index.ts ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(__webpack_require__(/*! ./entity */ "./source/entity/index.ts"), exports);
__exportStar(__webpack_require__(/*! ./list */ "./source/list/index.ts"), exports);
__exportStar(__webpack_require__(/*! ./common */ "./source/common.ts"), exports);
__exportStar(__webpack_require__(/*! ./store */ "./source/store.ts"), exports);


/***/ }),

/***/ "./source/list/index.ts":
/*!******************************!*\
  !*** ./source/list/index.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(__webpack_require__(/*! ./stored-list */ "./source/list/stored-list.ts"), exports);
__exportStar(__webpack_require__(/*! ./types */ "./source/list/types.ts"), exports);


/***/ }),

/***/ "./source/list/stored-list.ts":
/*!************************************!*\
  !*** ./source/list/stored-list.ts ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ChildStoredList = exports.TopStoredList = exports.AbstractStoredList = void 0;
const rxjs_1 = __webpack_require__(/*! rxjs */ "rxjs");
const operators_1 = __webpack_require__(/*! rxjs/operators */ "rxjs/operators");
const entity_1 = __webpack_require__(/*! ../entity */ "./source/entity/index.ts");
const common_1 = __webpack_require__(/*! ../common */ "./source/common.ts");
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
                var _a, _b;
                (_a = this.parentSubsctiption) === null || _a === void 0 ? void 0 : _a.unsubscribe();
                this.parentSubsctiption = undefined;
                this.subscriber = null;
                (_b = this.list) === null || _b === void 0 ? void 0 : _b.data.forEach(e => e.subscription.unsubscribe());
                this.list = null;
            };
        }).pipe(operators_1.shareReplay({ bufferSize: 1, refCount: true }));
        this._exec = (n, err, from, to) => common_1.asAsync(function* () {
            var _a, _b;
            let done = [];
            try {
                console.log(1, { n, err, from, to, this: this });
                if (!this._setDone(n, done, this.list))
                    return yield* common_1.wait(done[0]);
                console.log(2, { n, err, from, to, this: this });
                const oldList = n ? this.list.data : [];
                [from, to] = [from || ((_a = oldList[0]) === null || _a === void 0 ? void 0 : _a.entity), to || ((_b = oldList[oldList.length - 1]) === null || _b === void 0 ? void 0 : _b.entity)];
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
        var _a;
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
        (_a = this.subscriber) === null || _a === void 0 ? void 0 : _a.next({ list: this.list.data.map(e => e.entity), status: this.list.status });
    }
    remove(entity) {
        var _a;
        if (this.list === null)
            return;
        const index = this.list.data.findIndex(e => e.entity[this.key] === entity);
        if (index !== -1) {
            const list = this.list;
            this.removeFromParent(entity);
            list.data[index].subscription.unsubscribe();
            list.data.splice(index, 1);
            (_a = this.subscriber) === null || _a === void 0 ? void 0 : _a.next({ list: list.data.map(e => e.entity), status: list.status });
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
        return child === null ? null : child !== null && child !== void 0 ? child : parent;
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
        let p = this.donePromises[n], done = false;
        if (p)
            return p;
        (p = this._exec(n, err, from, to)).then(() => done = true);
        if (!done)
            this.donePromises[n] = p;
        return p;
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
            var _a;
            this.parentSubsctiption = (_a = this.parent) === null || _a === void 0 ? void 0 : _a.entities.subscribe(parentList => common_1.asAsync(function* () {
                var _a, _b;
                const key = this.key;
                const flowList = parentList.list.map(e => this.keys.mapTo((k) => {
                    const stores = this.stores;
                    return stores[k].get(this.keyofEntity(k, e[k]));
                }));
                const entitiesSet = new Set((_a = this.list) === null || _a === void 0 ? void 0 : _a.data.map(u => u.entity[key]));
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
                (_b = this.subscriber) === null || _b === void 0 ? void 0 : _b.next({ list: this.list.data.map(({ entity }) => entity), status: this.list.status });
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


/***/ }),

/***/ "./source/list/types.ts":
/*!******************************!*\
  !*** ./source/list/types.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });


/***/ }),

/***/ "./source/store.ts":
/*!*************************!*\
  !*** ./source/store.ts ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.TopStore = exports.ChildStore = exports.AbstractStore = void 0;
const rxjs_1 = __webpack_require__(/*! rxjs */ "rxjs");
const entity_1 = __webpack_require__(/*! ./entity */ "./source/entity/index.ts");
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
        var _a;
        const item = this._items.get(id);
        (_a = entity_1.getEntity(item === null || item === void 0 ? void 0 : item.entity)) === null || _a === void 0 ? void 0 : _a.rewind();
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
            const subscription = entityFlow.observable.subscribe(subscriber);
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
                    return handler(item.id, { get ready() { return i.ready; } }, subs => subscription.add(subs));
                }
            });
            next.then(undefined, () => { });
            return subscription;
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
        var _a, _b;
        /** @TODO consider when newId is taken */
        if (this._items.get(newId))
            throw new Error('New Id "' + newId + '" is taken');
        const item = this._items.get(oldId);
        if (!item)
            return;
        item.id = newId;
        this._items.delete(oldId);
        this._items.set(newId, item);
        (_a = entity_1.getEntity(item.entity)) === null || _a === void 0 ? void 0 : _a.setParent();
        (_b = item.parentSubscription) === null || _b === void 0 ? void 0 : _b.unsubscribe();
        this.linkParentNewId(oldId, newId, item);
    }
    update(id, data) {
        var _a, _b;
        (_b = entity_1.getEntity((_a = this._items.get(id)) === null || _a === void 0 ? void 0 : _a.entity)) === null || _b === void 0 ? void 0 : _b.update(data);
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
                    if (item.entity) {
                        entity_1.getEntity(item.entity).unlinkAll();
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
                    var _a;
                    const subscription = parentFlow.observable.subscribe(parent => setParent(parent));
                    (_a = item.parentSubscription) === null || _a === void 0 ? void 0 : _a.unsubscribe();
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


/***/ }),

/***/ "rxjs":
/*!************************************************************************************!*\
  !*** external {"root":["rxjs"],"commonjs":"rxjs","commonjs2":"rxjs","amd":"rxjs"} ***!
  \************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_rxjs__;

/***/ }),

/***/ "rxjs/operators":
/*!******************************************************************************************************************************!*\
  !*** external {"root":["rxjs","operators"],"commonjs":"rxjs/operators","commonjs2":"rxjs/operators","amd":"rxjs/operators"} ***!
  \******************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_rxjs_operators__;

/***/ })

/******/ });
});
//# sourceMappingURL=rxentity.umd.js.map