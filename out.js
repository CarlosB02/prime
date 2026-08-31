(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/react/cjs/react.development.js
  var require_react_development = __commonJS({
    "node_modules/react/cjs/react.development.js"(exports, module) {
      "use strict";
      (function() {
        function defineDeprecationWarning(methodName, info) {
          Object.defineProperty(Component.prototype, methodName, {
            get: function() {
              console.warn(
                "%s(...) is deprecated in plain JavaScript React classes. %s",
                info[0],
                info[1]
              );
            }
          });
        }
        function getIteratorFn(maybeIterable) {
          if (null === maybeIterable || "object" !== typeof maybeIterable)
            return null;
          maybeIterable = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable["@@iterator"];
          return "function" === typeof maybeIterable ? maybeIterable : null;
        }
        function warnNoop(publicInstance, callerName) {
          publicInstance = (publicInstance = publicInstance.constructor) && (publicInstance.displayName || publicInstance.name) || "ReactClass";
          var warningKey = publicInstance + "." + callerName;
          didWarnStateUpdateForUnmountedComponent[warningKey] || (console.error(
            "Can't call %s on a component that is not yet mounted. This is a no-op, but it might indicate a bug in your application. Instead, assign to `this.state` directly or define a `state = {};` class property with the desired state in the %s component.",
            callerName,
            publicInstance
          ), didWarnStateUpdateForUnmountedComponent[warningKey] = true);
        }
        function Component(props, context, updater) {
          this.props = props;
          this.context = context;
          this.refs = emptyObject;
          this.updater = updater || ReactNoopUpdateQueue;
        }
        function ComponentDummy() {
        }
        function PureComponent(props, context, updater) {
          this.props = props;
          this.context = context;
          this.refs = emptyObject;
          this.updater = updater || ReactNoopUpdateQueue;
        }
        function noop() {
        }
        function testStringCoercion(value) {
          return "" + value;
        }
        function checkKeyStringCoercion(value) {
          try {
            testStringCoercion(value);
            var JSCompiler_inline_result = false;
          } catch (e) {
            JSCompiler_inline_result = true;
          }
          if (JSCompiler_inline_result) {
            JSCompiler_inline_result = console;
            var JSCompiler_temp_const = JSCompiler_inline_result.error;
            var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
            JSCompiler_temp_const.call(
              JSCompiler_inline_result,
              "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
              JSCompiler_inline_result$jscomp$0
            );
            return testStringCoercion(value);
          }
        }
        function getComponentNameFromType(type) {
          if (null == type) return null;
          if ("function" === typeof type)
            return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
          if ("string" === typeof type) return type;
          switch (type) {
            case REACT_FRAGMENT_TYPE:
              return "Fragment";
            case REACT_PROFILER_TYPE:
              return "Profiler";
            case REACT_STRICT_MODE_TYPE:
              return "StrictMode";
            case REACT_SUSPENSE_TYPE:
              return "Suspense";
            case REACT_SUSPENSE_LIST_TYPE:
              return "SuspenseList";
            case REACT_ACTIVITY_TYPE:
              return "Activity";
          }
          if ("object" === typeof type)
            switch ("number" === typeof type.tag && console.error(
              "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
            ), type.$$typeof) {
              case REACT_PORTAL_TYPE:
                return "Portal";
              case REACT_CONTEXT_TYPE:
                return type.displayName || "Context";
              case REACT_CONSUMER_TYPE:
                return (type._context.displayName || "Context") + ".Consumer";
              case REACT_FORWARD_REF_TYPE:
                var innerType = type.render;
                type = type.displayName;
                type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
                return type;
              case REACT_MEMO_TYPE:
                return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
              case REACT_LAZY_TYPE:
                innerType = type._payload;
                type = type._init;
                try {
                  return getComponentNameFromType(type(innerType));
                } catch (x) {
                }
            }
          return null;
        }
        function getTaskName(type) {
          if (type === REACT_FRAGMENT_TYPE) return "<>";
          if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE)
            return "<...>";
          try {
            var name = getComponentNameFromType(type);
            return name ? "<" + name + ">" : "<...>";
          } catch (x) {
            return "<...>";
          }
        }
        function getOwner() {
          var dispatcher = ReactSharedInternals.A;
          return null === dispatcher ? null : dispatcher.getOwner();
        }
        function UnknownOwner() {
          return Error("react-stack-top-frame");
        }
        function hasValidKey(config) {
          if (hasOwnProperty.call(config, "key")) {
            var getter = Object.getOwnPropertyDescriptor(config, "key").get;
            if (getter && getter.isReactWarning) return false;
          }
          return void 0 !== config.key;
        }
        function defineKeyPropWarningGetter(props, displayName) {
          function warnAboutAccessingKey() {
            specialPropKeyWarningShown || (specialPropKeyWarningShown = true, console.error(
              "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
              displayName
            ));
          }
          warnAboutAccessingKey.isReactWarning = true;
          Object.defineProperty(props, "key", {
            get: warnAboutAccessingKey,
            configurable: true
          });
        }
        function elementRefGetterWithDeprecationWarning() {
          var componentName = getComponentNameFromType(this.type);
          didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = true, console.error(
            "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
          ));
          componentName = this.props.ref;
          return void 0 !== componentName ? componentName : null;
        }
        function ReactElement(type, key, props, owner, debugStack, debugTask) {
          var refProp = props.ref;
          type = {
            $$typeof: REACT_ELEMENT_TYPE,
            type,
            key,
            props,
            _owner: owner
          };
          null !== (void 0 !== refProp ? refProp : null) ? Object.defineProperty(type, "ref", {
            enumerable: false,
            get: elementRefGetterWithDeprecationWarning
          }) : Object.defineProperty(type, "ref", { enumerable: false, value: null });
          type._store = {};
          Object.defineProperty(type._store, "validated", {
            configurable: false,
            enumerable: false,
            writable: true,
            value: 0
          });
          Object.defineProperty(type, "_debugInfo", {
            configurable: false,
            enumerable: false,
            writable: true,
            value: null
          });
          Object.defineProperty(type, "_debugStack", {
            configurable: false,
            enumerable: false,
            writable: true,
            value: debugStack
          });
          Object.defineProperty(type, "_debugTask", {
            configurable: false,
            enumerable: false,
            writable: true,
            value: debugTask
          });
          Object.freeze && (Object.freeze(type.props), Object.freeze(type));
          return type;
        }
        function cloneAndReplaceKey(oldElement, newKey) {
          newKey = ReactElement(
            oldElement.type,
            newKey,
            oldElement.props,
            oldElement._owner,
            oldElement._debugStack,
            oldElement._debugTask
          );
          oldElement._store && (newKey._store.validated = oldElement._store.validated);
          return newKey;
        }
        function validateChildKeys(node) {
          isValidElement(node) ? node._store && (node._store.validated = 1) : "object" === typeof node && null !== node && node.$$typeof === REACT_LAZY_TYPE && ("fulfilled" === node._payload.status ? isValidElement(node._payload.value) && node._payload.value._store && (node._payload.value._store.validated = 1) : node._store && (node._store.validated = 1));
        }
        function isValidElement(object) {
          return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
        }
        function escape(key) {
          var escaperLookup = { "=": "=0", ":": "=2" };
          return "$" + key.replace(/[=:]/g, function(match) {
            return escaperLookup[match];
          });
        }
        function getElementKey(element, index) {
          return "object" === typeof element && null !== element && null != element.key ? (checkKeyStringCoercion(element.key), escape("" + element.key)) : index.toString(36);
        }
        function resolveThenable(thenable) {
          switch (thenable.status) {
            case "fulfilled":
              return thenable.value;
            case "rejected":
              throw thenable.reason;
            default:
              switch ("string" === typeof thenable.status ? thenable.then(noop, noop) : (thenable.status = "pending", thenable.then(
                function(fulfilledValue) {
                  "pending" === thenable.status && (thenable.status = "fulfilled", thenable.value = fulfilledValue);
                },
                function(error) {
                  "pending" === thenable.status && (thenable.status = "rejected", thenable.reason = error);
                }
              )), thenable.status) {
                case "fulfilled":
                  return thenable.value;
                case "rejected":
                  throw thenable.reason;
              }
          }
          throw thenable;
        }
        function mapIntoArray(children, array, escapedPrefix, nameSoFar, callback) {
          var type = typeof children;
          if ("undefined" === type || "boolean" === type) children = null;
          var invokeCallback = false;
          if (null === children) invokeCallback = true;
          else
            switch (type) {
              case "bigint":
              case "string":
              case "number":
                invokeCallback = true;
                break;
              case "object":
                switch (children.$$typeof) {
                  case REACT_ELEMENT_TYPE:
                  case REACT_PORTAL_TYPE:
                    invokeCallback = true;
                    break;
                  case REACT_LAZY_TYPE:
                    return invokeCallback = children._init, mapIntoArray(
                      invokeCallback(children._payload),
                      array,
                      escapedPrefix,
                      nameSoFar,
                      callback
                    );
                }
            }
          if (invokeCallback) {
            invokeCallback = children;
            callback = callback(invokeCallback);
            var childKey = "" === nameSoFar ? "." + getElementKey(invokeCallback, 0) : nameSoFar;
            isArrayImpl(callback) ? (escapedPrefix = "", null != childKey && (escapedPrefix = childKey.replace(userProvidedKeyEscapeRegex, "$&/") + "/"), mapIntoArray(callback, array, escapedPrefix, "", function(c) {
              return c;
            })) : null != callback && (isValidElement(callback) && (null != callback.key && (invokeCallback && invokeCallback.key === callback.key || checkKeyStringCoercion(callback.key)), escapedPrefix = cloneAndReplaceKey(
              callback,
              escapedPrefix + (null == callback.key || invokeCallback && invokeCallback.key === callback.key ? "" : ("" + callback.key).replace(
                userProvidedKeyEscapeRegex,
                "$&/"
              ) + "/") + childKey
            ), "" !== nameSoFar && null != invokeCallback && isValidElement(invokeCallback) && null == invokeCallback.key && invokeCallback._store && !invokeCallback._store.validated && (escapedPrefix._store.validated = 2), callback = escapedPrefix), array.push(callback));
            return 1;
          }
          invokeCallback = 0;
          childKey = "" === nameSoFar ? "." : nameSoFar + ":";
          if (isArrayImpl(children))
            for (var i = 0; i < children.length; i++)
              nameSoFar = children[i], type = childKey + getElementKey(nameSoFar, i), invokeCallback += mapIntoArray(
                nameSoFar,
                array,
                escapedPrefix,
                type,
                callback
              );
          else if (i = getIteratorFn(children), "function" === typeof i)
            for (i === children.entries && (didWarnAboutMaps || console.warn(
              "Using Maps as children is not supported. Use an array of keyed ReactElements instead."
            ), didWarnAboutMaps = true), children = i.call(children), i = 0; !(nameSoFar = children.next()).done; )
              nameSoFar = nameSoFar.value, type = childKey + getElementKey(nameSoFar, i++), invokeCallback += mapIntoArray(
                nameSoFar,
                array,
                escapedPrefix,
                type,
                callback
              );
          else if ("object" === type) {
            if ("function" === typeof children.then)
              return mapIntoArray(
                resolveThenable(children),
                array,
                escapedPrefix,
                nameSoFar,
                callback
              );
            array = String(children);
            throw Error(
              "Objects are not valid as a React child (found: " + ("[object Object]" === array ? "object with keys {" + Object.keys(children).join(", ") + "}" : array) + "). If you meant to render a collection of children, use an array instead."
            );
          }
          return invokeCallback;
        }
        function mapChildren(children, func, context) {
          if (null == children) return children;
          var result = [], count = 0;
          mapIntoArray(children, result, "", "", function(child) {
            return func.call(context, child, count++);
          });
          return result;
        }
        function lazyInitializer(payload) {
          if (-1 === payload._status) {
            var ioInfo = payload._ioInfo;
            null != ioInfo && (ioInfo.start = ioInfo.end = performance.now());
            ioInfo = payload._result;
            var thenable = ioInfo();
            thenable.then(
              function(moduleObject) {
                if (0 === payload._status || -1 === payload._status) {
                  payload._status = 1;
                  payload._result = moduleObject;
                  var _ioInfo = payload._ioInfo;
                  null != _ioInfo && (_ioInfo.end = performance.now());
                  void 0 === thenable.status && (thenable.status = "fulfilled", thenable.value = moduleObject);
                }
              },
              function(error) {
                if (0 === payload._status || -1 === payload._status) {
                  payload._status = 2;
                  payload._result = error;
                  var _ioInfo2 = payload._ioInfo;
                  null != _ioInfo2 && (_ioInfo2.end = performance.now());
                  void 0 === thenable.status && (thenable.status = "rejected", thenable.reason = error);
                }
              }
            );
            ioInfo = payload._ioInfo;
            if (null != ioInfo) {
              ioInfo.value = thenable;
              var displayName = thenable.displayName;
              "string" === typeof displayName && (ioInfo.name = displayName);
            }
            -1 === payload._status && (payload._status = 0, payload._result = thenable);
          }
          if (1 === payload._status)
            return ioInfo = payload._result, void 0 === ioInfo && console.error(
              "lazy: Expected the result of a dynamic import() call. Instead received: %s\n\nYour code should look like: \n  const MyComponent = lazy(() => import('./MyComponent'))\n\nDid you accidentally put curly braces around the import?",
              ioInfo
            ), "default" in ioInfo || console.error(
              "lazy: Expected the result of a dynamic import() call. Instead received: %s\n\nYour code should look like: \n  const MyComponent = lazy(() => import('./MyComponent'))",
              ioInfo
            ), ioInfo.default;
          throw payload._result;
        }
        function resolveDispatcher() {
          var dispatcher = ReactSharedInternals.H;
          null === dispatcher && console.error(
            "Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://react.dev/link/invalid-hook-call for tips about how to debug and fix this problem."
          );
          return dispatcher;
        }
        function releaseAsyncTransition() {
          ReactSharedInternals.asyncTransitions--;
        }
        function enqueueTask(task) {
          if (null === enqueueTaskImpl)
            try {
              var requireString = ("require" + Math.random()).slice(0, 7);
              enqueueTaskImpl = (module && module[requireString]).call(
                module,
                "timers"
              ).setImmediate;
            } catch (_err) {
              enqueueTaskImpl = function(callback) {
                false === didWarnAboutMessageChannel && (didWarnAboutMessageChannel = true, "undefined" === typeof MessageChannel && console.error(
                  "This browser does not have a MessageChannel implementation, so enqueuing tasks via await act(async () => ...) will fail. Please file an issue at https://github.com/facebook/react/issues if you encounter this warning."
                ));
                var channel = new MessageChannel();
                channel.port1.onmessage = callback;
                channel.port2.postMessage(void 0);
              };
            }
          return enqueueTaskImpl(task);
        }
        function aggregateErrors(errors) {
          return 1 < errors.length && "function" === typeof AggregateError ? new AggregateError(errors) : errors[0];
        }
        function popActScope(prevActQueue, prevActScopeDepth) {
          prevActScopeDepth !== actScopeDepth - 1 && console.error(
            "You seem to have overlapping act() calls, this is not supported. Be sure to await previous act() calls before making a new one. "
          );
          actScopeDepth = prevActScopeDepth;
        }
        function recursivelyFlushAsyncActWork(returnValue, resolve, reject) {
          var queue = ReactSharedInternals.actQueue;
          if (null !== queue)
            if (0 !== queue.length)
              try {
                flushActQueue(queue);
                enqueueTask(function() {
                  return recursivelyFlushAsyncActWork(returnValue, resolve, reject);
                });
                return;
              } catch (error) {
                ReactSharedInternals.thrownErrors.push(error);
              }
            else ReactSharedInternals.actQueue = null;
          0 < ReactSharedInternals.thrownErrors.length ? (queue = aggregateErrors(ReactSharedInternals.thrownErrors), ReactSharedInternals.thrownErrors.length = 0, reject(queue)) : resolve(returnValue);
        }
        function flushActQueue(queue) {
          if (!isFlushing) {
            isFlushing = true;
            var i = 0;
            try {
              for (; i < queue.length; i++) {
                var callback = queue[i];
                do {
                  ReactSharedInternals.didUsePromise = false;
                  var continuation = callback(false);
                  if (null !== continuation) {
                    if (ReactSharedInternals.didUsePromise) {
                      queue[i] = callback;
                      queue.splice(0, i);
                      return;
                    }
                    callback = continuation;
                  } else break;
                } while (1);
              }
              queue.length = 0;
            } catch (error) {
              queue.splice(0, i + 1), ReactSharedInternals.thrownErrors.push(error);
            } finally {
              isFlushing = false;
            }
          }
        }
        "undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
        var REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = Symbol.for("react.activity"), MAYBE_ITERATOR_SYMBOL = Symbol.iterator, didWarnStateUpdateForUnmountedComponent = {}, ReactNoopUpdateQueue = {
          isMounted: function() {
            return false;
          },
          enqueueForceUpdate: function(publicInstance) {
            warnNoop(publicInstance, "forceUpdate");
          },
          enqueueReplaceState: function(publicInstance) {
            warnNoop(publicInstance, "replaceState");
          },
          enqueueSetState: function(publicInstance) {
            warnNoop(publicInstance, "setState");
          }
        }, assign = Object.assign, emptyObject = {};
        Object.freeze(emptyObject);
        Component.prototype.isReactComponent = {};
        Component.prototype.setState = function(partialState, callback) {
          if ("object" !== typeof partialState && "function" !== typeof partialState && null != partialState)
            throw Error(
              "takes an object of state variables to update or a function which returns an object of state variables."
            );
          this.updater.enqueueSetState(this, partialState, callback, "setState");
        };
        Component.prototype.forceUpdate = function(callback) {
          this.updater.enqueueForceUpdate(this, callback, "forceUpdate");
        };
        var deprecatedAPIs = {
          isMounted: [
            "isMounted",
            "Instead, make sure to clean up subscriptions and pending requests in componentWillUnmount to prevent memory leaks."
          ],
          replaceState: [
            "replaceState",
            "Refactor your code to use setState instead (see https://github.com/facebook/react/issues/3236)."
          ]
        };
        for (fnName in deprecatedAPIs)
          deprecatedAPIs.hasOwnProperty(fnName) && defineDeprecationWarning(fnName, deprecatedAPIs[fnName]);
        ComponentDummy.prototype = Component.prototype;
        deprecatedAPIs = PureComponent.prototype = new ComponentDummy();
        deprecatedAPIs.constructor = PureComponent;
        assign(deprecatedAPIs, Component.prototype);
        deprecatedAPIs.isPureReactComponent = true;
        var isArrayImpl = Array.isArray, REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference"), ReactSharedInternals = {
          H: null,
          A: null,
          T: null,
          S: null,
          actQueue: null,
          asyncTransitions: 0,
          isBatchingLegacy: false,
          didScheduleLegacyUpdate: false,
          didUsePromise: false,
          thrownErrors: [],
          getCurrentStack: null,
          recentlyCreatedOwnerStacks: 0
        }, hasOwnProperty = Object.prototype.hasOwnProperty, createTask = console.createTask ? console.createTask : function() {
          return null;
        };
        deprecatedAPIs = {
          react_stack_bottom_frame: function(callStackForError) {
            return callStackForError();
          }
        };
        var specialPropKeyWarningShown, didWarnAboutOldJSXRuntime;
        var didWarnAboutElementRef = {};
        var unknownOwnerDebugStack = deprecatedAPIs.react_stack_bottom_frame.bind(
          deprecatedAPIs,
          UnknownOwner
        )();
        var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
        var didWarnAboutMaps = false, userProvidedKeyEscapeRegex = /\/+/g, reportGlobalError = "function" === typeof reportError ? reportError : function(error) {
          if ("object" === typeof window && "function" === typeof window.ErrorEvent) {
            var event = new window.ErrorEvent("error", {
              bubbles: true,
              cancelable: true,
              message: "object" === typeof error && null !== error && "string" === typeof error.message ? String(error.message) : String(error),
              error
            });
            if (!window.dispatchEvent(event)) return;
          } else if ("object" === typeof process && "function" === typeof process.emit) {
            process.emit("uncaughtException", error);
            return;
          }
          console.error(error);
        }, didWarnAboutMessageChannel = false, enqueueTaskImpl = null, actScopeDepth = 0, didWarnNoAwaitAct = false, isFlushing = false, queueSeveralMicrotasks = "function" === typeof queueMicrotask ? function(callback) {
          queueMicrotask(function() {
            return queueMicrotask(callback);
          });
        } : enqueueTask;
        deprecatedAPIs = Object.freeze({
          __proto__: null,
          c: function(size) {
            return resolveDispatcher().useMemoCache(size);
          }
        });
        var fnName = {
          map: mapChildren,
          forEach: function(children, forEachFunc, forEachContext) {
            mapChildren(
              children,
              function() {
                forEachFunc.apply(this, arguments);
              },
              forEachContext
            );
          },
          count: function(children) {
            var n = 0;
            mapChildren(children, function() {
              n++;
            });
            return n;
          },
          toArray: function(children) {
            return mapChildren(children, function(child) {
              return child;
            }) || [];
          },
          only: function(children) {
            if (!isValidElement(children))
              throw Error(
                "React.Children.only expected to receive a single React element child."
              );
            return children;
          }
        };
        exports.Activity = REACT_ACTIVITY_TYPE;
        exports.Children = fnName;
        exports.Component = Component;
        exports.Fragment = REACT_FRAGMENT_TYPE;
        exports.Profiler = REACT_PROFILER_TYPE;
        exports.PureComponent = PureComponent;
        exports.StrictMode = REACT_STRICT_MODE_TYPE;
        exports.Suspense = REACT_SUSPENSE_TYPE;
        exports.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = ReactSharedInternals;
        exports.__COMPILER_RUNTIME = deprecatedAPIs;
        exports.act = function(callback) {
          var prevActQueue = ReactSharedInternals.actQueue, prevActScopeDepth = actScopeDepth;
          actScopeDepth++;
          var queue = ReactSharedInternals.actQueue = null !== prevActQueue ? prevActQueue : [], didAwaitActCall = false;
          try {
            var result = callback();
          } catch (error) {
            ReactSharedInternals.thrownErrors.push(error);
          }
          if (0 < ReactSharedInternals.thrownErrors.length)
            throw popActScope(prevActQueue, prevActScopeDepth), callback = aggregateErrors(ReactSharedInternals.thrownErrors), ReactSharedInternals.thrownErrors.length = 0, callback;
          if (null !== result && "object" === typeof result && "function" === typeof result.then) {
            var thenable = result;
            queueSeveralMicrotasks(function() {
              didAwaitActCall || didWarnNoAwaitAct || (didWarnNoAwaitAct = true, console.error(
                "You called act(async () => ...) without await. This could lead to unexpected testing behaviour, interleaving multiple act calls and mixing their scopes. You should - await act(async () => ...);"
              ));
            });
            return {
              then: function(resolve, reject) {
                didAwaitActCall = true;
                thenable.then(
                  function(returnValue) {
                    popActScope(prevActQueue, prevActScopeDepth);
                    if (0 === prevActScopeDepth) {
                      try {
                        flushActQueue(queue), enqueueTask(function() {
                          return recursivelyFlushAsyncActWork(
                            returnValue,
                            resolve,
                            reject
                          );
                        });
                      } catch (error$0) {
                        ReactSharedInternals.thrownErrors.push(error$0);
                      }
                      if (0 < ReactSharedInternals.thrownErrors.length) {
                        var _thrownError = aggregateErrors(
                          ReactSharedInternals.thrownErrors
                        );
                        ReactSharedInternals.thrownErrors.length = 0;
                        reject(_thrownError);
                      }
                    } else resolve(returnValue);
                  },
                  function(error) {
                    popActScope(prevActQueue, prevActScopeDepth);
                    0 < ReactSharedInternals.thrownErrors.length ? (error = aggregateErrors(
                      ReactSharedInternals.thrownErrors
                    ), ReactSharedInternals.thrownErrors.length = 0, reject(error)) : reject(error);
                  }
                );
              }
            };
          }
          var returnValue$jscomp$0 = result;
          popActScope(prevActQueue, prevActScopeDepth);
          0 === prevActScopeDepth && (flushActQueue(queue), 0 !== queue.length && queueSeveralMicrotasks(function() {
            didAwaitActCall || didWarnNoAwaitAct || (didWarnNoAwaitAct = true, console.error(
              "A component suspended inside an `act` scope, but the `act` call was not awaited. When testing React components that depend on asynchronous data, you must await the result:\n\nawait act(() => ...)"
            ));
          }), ReactSharedInternals.actQueue = null);
          if (0 < ReactSharedInternals.thrownErrors.length)
            throw callback = aggregateErrors(ReactSharedInternals.thrownErrors), ReactSharedInternals.thrownErrors.length = 0, callback;
          return {
            then: function(resolve, reject) {
              didAwaitActCall = true;
              0 === prevActScopeDepth ? (ReactSharedInternals.actQueue = queue, enqueueTask(function() {
                return recursivelyFlushAsyncActWork(
                  returnValue$jscomp$0,
                  resolve,
                  reject
                );
              })) : resolve(returnValue$jscomp$0);
            }
          };
        };
        exports.cache = function(fn) {
          return function() {
            return fn.apply(null, arguments);
          };
        };
        exports.cacheSignal = function() {
          return null;
        };
        exports.captureOwnerStack = function() {
          var getCurrentStack = ReactSharedInternals.getCurrentStack;
          return null === getCurrentStack ? null : getCurrentStack();
        };
        exports.cloneElement = function(element, config, children) {
          if (null === element || void 0 === element)
            throw Error(
              "The argument must be a React element, but you passed " + element + "."
            );
          var props = assign({}, element.props), key = element.key, owner = element._owner;
          if (null != config) {
            var JSCompiler_inline_result;
            a: {
              if (hasOwnProperty.call(config, "ref") && (JSCompiler_inline_result = Object.getOwnPropertyDescriptor(
                config,
                "ref"
              ).get) && JSCompiler_inline_result.isReactWarning) {
                JSCompiler_inline_result = false;
                break a;
              }
              JSCompiler_inline_result = void 0 !== config.ref;
            }
            JSCompiler_inline_result && (owner = getOwner());
            hasValidKey(config) && (checkKeyStringCoercion(config.key), key = "" + config.key);
            for (propName in config)
              !hasOwnProperty.call(config, propName) || "key" === propName || "__self" === propName || "__source" === propName || "ref" === propName && void 0 === config.ref || (props[propName] = config[propName]);
          }
          var propName = arguments.length - 2;
          if (1 === propName) props.children = children;
          else if (1 < propName) {
            JSCompiler_inline_result = Array(propName);
            for (var i = 0; i < propName; i++)
              JSCompiler_inline_result[i] = arguments[i + 2];
            props.children = JSCompiler_inline_result;
          }
          props = ReactElement(
            element.type,
            key,
            props,
            owner,
            element._debugStack,
            element._debugTask
          );
          for (key = 2; key < arguments.length; key++)
            validateChildKeys(arguments[key]);
          return props;
        };
        exports.createContext = function(defaultValue) {
          defaultValue = {
            $$typeof: REACT_CONTEXT_TYPE,
            _currentValue: defaultValue,
            _currentValue2: defaultValue,
            _threadCount: 0,
            Provider: null,
            Consumer: null
          };
          defaultValue.Provider = defaultValue;
          defaultValue.Consumer = {
            $$typeof: REACT_CONSUMER_TYPE,
            _context: defaultValue
          };
          defaultValue._currentRenderer = null;
          defaultValue._currentRenderer2 = null;
          return defaultValue;
        };
        exports.createElement = function(type, config, children) {
          for (var i = 2; i < arguments.length; i++)
            validateChildKeys(arguments[i]);
          i = {};
          var key = null;
          if (null != config)
            for (propName in didWarnAboutOldJSXRuntime || !("__self" in config) || "key" in config || (didWarnAboutOldJSXRuntime = true, console.warn(
              "Your app (or one of its dependencies) is using an outdated JSX transform. Update to the modern JSX transform for faster performance: https://react.dev/link/new-jsx-transform"
            )), hasValidKey(config) && (checkKeyStringCoercion(config.key), key = "" + config.key), config)
              hasOwnProperty.call(config, propName) && "key" !== propName && "__self" !== propName && "__source" !== propName && (i[propName] = config[propName]);
          var childrenLength = arguments.length - 2;
          if (1 === childrenLength) i.children = children;
          else if (1 < childrenLength) {
            for (var childArray = Array(childrenLength), _i = 0; _i < childrenLength; _i++)
              childArray[_i] = arguments[_i + 2];
            Object.freeze && Object.freeze(childArray);
            i.children = childArray;
          }
          if (type && type.defaultProps)
            for (propName in childrenLength = type.defaultProps, childrenLength)
              void 0 === i[propName] && (i[propName] = childrenLength[propName]);
          key && defineKeyPropWarningGetter(
            i,
            "function" === typeof type ? type.displayName || type.name || "Unknown" : type
          );
          var propName = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
          return ReactElement(
            type,
            key,
            i,
            getOwner(),
            propName ? Error("react-stack-top-frame") : unknownOwnerDebugStack,
            propName ? createTask(getTaskName(type)) : unknownOwnerDebugTask
          );
        };
        exports.createRef = function() {
          var refObject = { current: null };
          Object.seal(refObject);
          return refObject;
        };
        exports.forwardRef = function(render) {
          null != render && render.$$typeof === REACT_MEMO_TYPE ? console.error(
            "forwardRef requires a render function but received a `memo` component. Instead of forwardRef(memo(...)), use memo(forwardRef(...))."
          ) : "function" !== typeof render ? console.error(
            "forwardRef requires a render function but was given %s.",
            null === render ? "null" : typeof render
          ) : 0 !== render.length && 2 !== render.length && console.error(
            "forwardRef render functions accept exactly two parameters: props and ref. %s",
            1 === render.length ? "Did you forget to use the ref parameter?" : "Any additional parameter will be undefined."
          );
          null != render && null != render.defaultProps && console.error(
            "forwardRef render functions do not support defaultProps. Did you accidentally pass a React component?"
          );
          var elementType = { $$typeof: REACT_FORWARD_REF_TYPE, render }, ownName;
          Object.defineProperty(elementType, "displayName", {
            enumerable: false,
            configurable: true,
            get: function() {
              return ownName;
            },
            set: function(name) {
              ownName = name;
              render.name || render.displayName || (Object.defineProperty(render, "name", { value: name }), render.displayName = name);
            }
          });
          return elementType;
        };
        exports.isValidElement = isValidElement;
        exports.lazy = function(ctor) {
          ctor = { _status: -1, _result: ctor };
          var lazyType = {
            $$typeof: REACT_LAZY_TYPE,
            _payload: ctor,
            _init: lazyInitializer
          }, ioInfo = {
            name: "lazy",
            start: -1,
            end: -1,
            value: null,
            owner: null,
            debugStack: Error("react-stack-top-frame"),
            debugTask: console.createTask ? console.createTask("lazy()") : null
          };
          ctor._ioInfo = ioInfo;
          lazyType._debugInfo = [{ awaited: ioInfo }];
          return lazyType;
        };
        exports.memo = function(type, compare) {
          null == type && console.error(
            "memo: The first argument must be a component. Instead received: %s",
            null === type ? "null" : typeof type
          );
          compare = {
            $$typeof: REACT_MEMO_TYPE,
            type,
            compare: void 0 === compare ? null : compare
          };
          var ownName;
          Object.defineProperty(compare, "displayName", {
            enumerable: false,
            configurable: true,
            get: function() {
              return ownName;
            },
            set: function(name) {
              ownName = name;
              type.name || type.displayName || (Object.defineProperty(type, "name", { value: name }), type.displayName = name);
            }
          });
          return compare;
        };
        exports.startTransition = function(scope) {
          var prevTransition = ReactSharedInternals.T, currentTransition = {};
          currentTransition._updatedFibers = /* @__PURE__ */ new Set();
          ReactSharedInternals.T = currentTransition;
          try {
            var returnValue = scope(), onStartTransitionFinish = ReactSharedInternals.S;
            null !== onStartTransitionFinish && onStartTransitionFinish(currentTransition, returnValue);
            "object" === typeof returnValue && null !== returnValue && "function" === typeof returnValue.then && (ReactSharedInternals.asyncTransitions++, returnValue.then(releaseAsyncTransition, releaseAsyncTransition), returnValue.then(noop, reportGlobalError));
          } catch (error) {
            reportGlobalError(error);
          } finally {
            null === prevTransition && currentTransition._updatedFibers && (scope = currentTransition._updatedFibers.size, currentTransition._updatedFibers.clear(), 10 < scope && console.warn(
              "Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."
            )), null !== prevTransition && null !== currentTransition.types && (null !== prevTransition.types && prevTransition.types !== currentTransition.types && console.error(
              "We expected inner Transitions to have transferred the outer types set and that you cannot add to the outer Transition while inside the inner.This is a bug in React."
            ), prevTransition.types = currentTransition.types), ReactSharedInternals.T = prevTransition;
          }
        };
        exports.unstable_useCacheRefresh = function() {
          return resolveDispatcher().useCacheRefresh();
        };
        exports.use = function(usable) {
          return resolveDispatcher().use(usable);
        };
        exports.useActionState = function(action, initialState, permalink) {
          return resolveDispatcher().useActionState(
            action,
            initialState,
            permalink
          );
        };
        exports.useCallback = function(callback, deps) {
          return resolveDispatcher().useCallback(callback, deps);
        };
        exports.useContext = function(Context) {
          var dispatcher = resolveDispatcher();
          Context.$$typeof === REACT_CONSUMER_TYPE && console.error(
            "Calling useContext(Context.Consumer) is not supported and will cause bugs. Did you mean to call useContext(Context) instead?"
          );
          return dispatcher.useContext(Context);
        };
        exports.useDebugValue = function(value, formatterFn) {
          return resolveDispatcher().useDebugValue(value, formatterFn);
        };
        exports.useDeferredValue = function(value, initialValue) {
          return resolveDispatcher().useDeferredValue(value, initialValue);
        };
        exports.useEffect = function(create, deps) {
          null == create && console.warn(
            "React Hook useEffect requires an effect callback. Did you forget to pass a callback to the hook?"
          );
          return resolveDispatcher().useEffect(create, deps);
        };
        exports.useEffectEvent = function(callback) {
          return resolveDispatcher().useEffectEvent(callback);
        };
        exports.useId = function() {
          return resolveDispatcher().useId();
        };
        exports.useImperativeHandle = function(ref, create, deps) {
          return resolveDispatcher().useImperativeHandle(ref, create, deps);
        };
        exports.useInsertionEffect = function(create, deps) {
          null == create && console.warn(
            "React Hook useInsertionEffect requires an effect callback. Did you forget to pass a callback to the hook?"
          );
          return resolveDispatcher().useInsertionEffect(create, deps);
        };
        exports.useLayoutEffect = function(create, deps) {
          null == create && console.warn(
            "React Hook useLayoutEffect requires an effect callback. Did you forget to pass a callback to the hook?"
          );
          return resolveDispatcher().useLayoutEffect(create, deps);
        };
        exports.useMemo = function(create, deps) {
          return resolveDispatcher().useMemo(create, deps);
        };
        exports.useOptimistic = function(passthrough, reducer) {
          return resolveDispatcher().useOptimistic(passthrough, reducer);
        };
        exports.useReducer = function(reducer, initialArg, init) {
          return resolveDispatcher().useReducer(reducer, initialArg, init);
        };
        exports.useRef = function(initialValue) {
          return resolveDispatcher().useRef(initialValue);
        };
        exports.useState = function(initialState) {
          return resolveDispatcher().useState(initialState);
        };
        exports.useSyncExternalStore = function(subscribe, getSnapshot, getServerSnapshot) {
          return resolveDispatcher().useSyncExternalStore(
            subscribe,
            getSnapshot,
            getServerSnapshot
          );
        };
        exports.useTransition = function() {
          return resolveDispatcher().useTransition();
        };
        exports.version = "19.2.4";
        "undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
      })();
    }
  });

  // node_modules/react/index.js
  var require_react = __commonJS({
    "node_modules/react/index.js"(exports, module) {
      "use strict";
      if (false) {
        module.exports = null;
      } else {
        module.exports = require_react_development();
      }
    }
  });

  // node_modules/lucide-react/dist/esm/createLucideIcon.js
  var import_react2 = __toESM(require_react());

  // node_modules/lucide-react/dist/esm/shared/src/utils/mergeClasses.js
  var mergeClasses = (...classes) => classes.filter((className, index, array) => {
    return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
  }).join(" ").trim();

  // node_modules/lucide-react/dist/esm/shared/src/utils/toKebabCase.js
  var toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

  // node_modules/lucide-react/dist/esm/shared/src/utils/toCamelCase.js
  var toCamelCase = (string) => string.replace(
    /^([A-Z])|[\s-_]+(\w)/g,
    (match, p1, p2) => p2 ? p2.toUpperCase() : p1.toLowerCase()
  );

  // node_modules/lucide-react/dist/esm/shared/src/utils/toPascalCase.js
  var toPascalCase = (string) => {
    const camelCase = toCamelCase(string);
    return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
  };

  // node_modules/lucide-react/dist/esm/Icon.js
  var import_react = __toESM(require_react());

  // node_modules/lucide-react/dist/esm/defaultAttributes.js
  var defaultAttributes = {
    xmlns: "http://www.w3.org/2000/svg",
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  };

  // node_modules/lucide-react/dist/esm/shared/src/utils/hasA11yProp.js
  var hasA11yProp = (props) => {
    for (const prop in props) {
      if (prop.startsWith("aria-") || prop === "role" || prop === "title") {
        return true;
      }
    }
    return false;
  };

  // node_modules/lucide-react/dist/esm/Icon.js
  var Icon = (0, import_react.forwardRef)(
    ({
      color = "currentColor",
      size = 24,
      strokeWidth = 2,
      absoluteStrokeWidth,
      className = "",
      children,
      iconNode,
      ...rest
    }, ref) => (0, import_react.createElement)(
      "svg",
      {
        ref,
        ...defaultAttributes,
        width: size,
        height: size,
        stroke: color,
        strokeWidth: absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
        className: mergeClasses("lucide", className),
        ...!children && !hasA11yProp(rest) && { "aria-hidden": "true" },
        ...rest
      },
      [
        ...iconNode.map(([tag, attrs]) => (0, import_react.createElement)(tag, attrs)),
        ...Array.isArray(children) ? children : [children]
      ]
    )
  );

  // node_modules/lucide-react/dist/esm/createLucideIcon.js
  var createLucideIcon = (iconName, iconNode) => {
    const Component = (0, import_react2.forwardRef)(
      ({ className, ...props }, ref) => (0, import_react2.createElement)(Icon, {
        ref,
        iconNode,
        className: mergeClasses(
          `lucide-${toKebabCase(toPascalCase(iconName))}`,
          `lucide-${iconName}`,
          className
        ),
        ...props
      })
    );
    Component.displayName = toPascalCase(iconName);
    return Component;
  };

  // node_modules/lucide-react/dist/esm/icons/activity.js
  var __iconNode = [
    [
      "path",
      {
        d: "M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",
        key: "169zse"
      }
    ]
  ];
  var Activity = createLucideIcon("activity", __iconNode);

  // node_modules/lucide-react/dist/esm/icons/apple.js
  var __iconNode2 = [
    ["path", { d: "M12 6.528V3a1 1 0 0 1 1-1h0", key: "11qiee" }],
    [
      "path",
      {
        d: "M18.237 21A15 15 0 0 0 22 11a6 6 0 0 0-10-4.472A6 6 0 0 0 2 11a15.1 15.1 0 0 0 3.763 10 3 3 0 0 0 3.648.648 5.5 5.5 0 0 1 5.178 0A3 3 0 0 0 18.237 21",
        key: "110c12"
      }
    ]
  ];
  var Apple = createLucideIcon("apple", __iconNode2);

  // node_modules/lucide-react/dist/esm/icons/bell.js
  var __iconNode3 = [
    ["path", { d: "M10.268 21a2 2 0 0 0 3.464 0", key: "vwvbt9" }],
    [
      "path",
      {
        d: "M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",
        key: "11g9vi"
      }
    ]
  ];
  var Bell = createLucideIcon("bell", __iconNode3);

  // node_modules/lucide-react/dist/esm/icons/circle-question-mark.js
  var __iconNode4 = [
    ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
    ["path", { d: "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3", key: "1u773s" }],
    ["path", { d: "M12 17h.01", key: "p32p05" }]
  ];
  var CircleQuestionMark = createLucideIcon("circle-question-mark", __iconNode4);

  // node_modules/lucide-react/dist/esm/icons/clipboard-check.js
  var __iconNode5 = [
    ["rect", { width: "8", height: "4", x: "8", y: "2", rx: "1", ry: "1", key: "tgr4d6" }],
    [
      "path",
      {
        d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",
        key: "116196"
      }
    ],
    ["path", { d: "m9 14 2 2 4-4", key: "df797q" }]
  ];
  var ClipboardCheck = createLucideIcon("clipboard-check", __iconNode5);

  // node_modules/lucide-react/dist/esm/icons/credit-card.js
  var __iconNode6 = [
    ["rect", { width: "20", height: "14", x: "2", y: "5", rx: "2", key: "ynyp8z" }],
    ["line", { x1: "2", x2: "22", y1: "10", y2: "10", key: "1b3vmo" }]
  ];
  var CreditCard = createLucideIcon("credit-card", __iconNode6);

  // node_modules/lucide-react/dist/esm/icons/dumbbell.js
  var __iconNode7 = [
    [
      "path",
      {
        d: "M17.596 12.768a2 2 0 1 0 2.829-2.829l-1.768-1.767a2 2 0 0 0 2.828-2.829l-2.828-2.828a2 2 0 0 0-2.829 2.828l-1.767-1.768a2 2 0 1 0-2.829 2.829z",
        key: "9m4mmf"
      }
    ],
    ["path", { d: "m2.5 21.5 1.4-1.4", key: "17g3f0" }],
    ["path", { d: "m20.1 3.9 1.4-1.4", key: "1qn309" }],
    [
      "path",
      {
        d: "M5.343 21.485a2 2 0 1 0 2.829-2.828l1.767 1.768a2 2 0 1 0 2.829-2.829l-6.364-6.364a2 2 0 1 0-2.829 2.829l1.768 1.767a2 2 0 0 0-2.828 2.829z",
        key: "1t2c92"
      }
    ],
    ["path", { d: "m9.6 14.4 4.8-4.8", key: "6umqxw" }]
  ];
  var Dumbbell = createLucideIcon("dumbbell", __iconNode7);

  // node_modules/lucide-react/dist/esm/icons/file-text.js
  var __iconNode8 = [
    [
      "path",
      {
        d: "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",
        key: "1oefj6"
      }
    ],
    ["path", { d: "M14 2v5a1 1 0 0 0 1 1h5", key: "wfsgrz" }],
    ["path", { d: "M10 9H8", key: "b1mrlr" }],
    ["path", { d: "M16 13H8", key: "t4e002" }],
    ["path", { d: "M16 17H8", key: "z1uh3a" }]
  ];
  var FileText = createLucideIcon("file-text", __iconNode8);

  // node_modules/lucide-react/dist/esm/icons/layout-dashboard.js
  var __iconNode9 = [
    ["rect", { width: "7", height: "9", x: "3", y: "3", rx: "1", key: "10lvy0" }],
    ["rect", { width: "7", height: "5", x: "14", y: "3", rx: "1", key: "16une8" }],
    ["rect", { width: "7", height: "9", x: "14", y: "12", rx: "1", key: "1hutg5" }],
    ["rect", { width: "7", height: "5", x: "3", y: "16", rx: "1", key: "ldoo1y" }]
  ];
  var LayoutDashboard = createLucideIcon("layout-dashboard", __iconNode9);

  // node_modules/lucide-react/dist/esm/icons/pill.js
  var __iconNode10 = [
    [
      "path",
      { d: "m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z", key: "wa1lgi" }
    ],
    ["path", { d: "m8.5 8.5 7 7", key: "rvfmvr" }]
  ];
  var Pill = createLucideIcon("pill", __iconNode10);

  // node_modules/lucide-react/dist/esm/icons/tag.js
  var __iconNode11 = [
    [
      "path",
      {
        d: "M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z",
        key: "vktsd0"
      }
    ],
    ["circle", { cx: "7.5", cy: "7.5", r: ".5", fill: "currentColor", key: "kqv944" }]
  ];
  var Tag = createLucideIcon("tag", __iconNode11);

  // node_modules/lucide-react/dist/esm/icons/users.js
  var __iconNode12 = [
    ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
    ["path", { d: "M16 3.128a4 4 0 0 1 0 7.744", key: "16gr8j" }],
    ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
    ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
  ];
  var Users = createLucideIcon("users", __iconNode12);

  // node_modules/lucide-react/dist/esm/icons/utensils.js
  var __iconNode13 = [
    ["path", { d: "M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2", key: "cjf0a3" }],
    ["path", { d: "M7 2v20", key: "1473qp" }],
    ["path", { d: "M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7", key: "j28e5" }]
  ];
  var Utensils = createLucideIcon("utensils", __iconNode13);

  // node_modules/lucide-react/dist/esm/icons/wallet.js
  var __iconNode14 = [
    [
      "path",
      {
        d: "M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1",
        key: "18etb6"
      }
    ],
    ["path", { d: "M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4", key: "xoc0q4" }]
  ];
  var Wallet = createLucideIcon("wallet", __iconNode14);

  // constants.ts
  var MENU_ITEMS = [
    { label: "Dashboard", icon: LayoutDashboard, id: "dashboard" },
    { label: "Clientes", icon: Users, id: "clients" },
    { label: "Financeiro", icon: Wallet, id: "finance" },
    { label: "Planos de Treino", icon: Dumbbell, id: "workouts" },
    { label: "Alimentos", icon: Apple, id: "nutrition" },
    { label: "Planos de Nutri\xE7\xE3o", icon: Utensils, id: "nutrition_plans" },
    { label: "Exerc\xEDcios", icon: Activity, id: "exercises" },
    { label: "Avalia\xE7\xF5es F\xEDsicas", icon: ClipboardCheck, id: "assessments" },
    { label: "Suplementa\xE7\xE3o", icon: Pill, id: "supplements" },
    { label: "Conte\xFAdos", icon: FileText, id: "content" },
    { label: "Planos de Pagamento", icon: CreditCard, id: "payments" },
    { label: "C\xF3digos Promo", icon: Tag, id: "promos" },
    { label: "Question\xE1rios", icon: CircleQuestionMark, id: "questionnaires" },
    { label: "Notifica\xE7\xF5es", icon: Bell, id: "notifications" }
  ];
  var MOCK_CLIENTS = [
    { id: "1", name: "Ana Silva", avatar: "https://picsum.photos/100/100?random=1", plan: "Premium Transformation", status: "active", lastActive: "2h atr\xE1s", contact: "+351 912 345 678", progress: 85, evaluationStatus: "concluida", isNew: false, paymentStatus: "pago", birthday: "03-12", age: 28, paymentExpiryDate: "2026-04-12", isPaying: true, hasSubscription: true, nextEvaluationDate: "2026-03-20" },
    { id: "2", name: "Carlos Mendes", avatar: "https://picsum.photos/100/100?random=2", plan: "Hipertrofia Basic", status: "warning", lastActive: "3d atr\xE1s", contact: "+351 912 345 679", progress: 42, evaluationStatus: "pendente", isNew: false, paymentStatus: "a_expirar", age: 34, paymentExpiryDate: "2026-03-15", isPaying: true, hasSubscription: false, nextEvaluationDate: "2026-03-14" },
    { id: "3", name: "Beatriz Costa", avatar: "https://picsum.photos/100/100?random=3", plan: "Perda de Peso", status: "pending", lastActive: "1d atr\xE1s", contact: "+351 912 345 670", progress: 12, evaluationStatus: "por_validar", isNew: true, paymentStatus: "pago", age: 25, paymentExpiryDate: "2026-04-01", isPaying: true, hasSubscription: true },
    { id: "4", name: "Jo\xE3o Pereira", avatar: "https://picsum.photos/100/100?random=4", plan: "Premium Transformation", status: "active", lastActive: "5h atr\xE1s", contact: "+351 912 345 671", progress: 91, evaluationStatus: "concluida", isNew: false, paymentStatus: "pago", age: 41, paymentExpiryDate: "2026-05-10", isPaying: true, hasSubscription: true, nextEvaluationDate: "2026-04-10" },
    { id: "5", name: "Sofia Oliveira", avatar: "https://picsum.photos/100/100?random=5", plan: "Manuten\xE7\xE3o", status: "inactive", lastActive: "1sem atr\xE1s", contact: "+351 912 345 672", progress: 65, evaluationStatus: "concluida", isNew: false, paymentStatus: "expirado", age: 31, paymentExpiryDate: "2026-02-28", isPaying: false, hasSubscription: false },
    { id: "6", name: "Miguel Santos", avatar: "https://picsum.photos/100/100?random=6", plan: "Hipertrofia Basic", status: "pending", lastActive: "1h atr\xE1s", contact: "+351 912 345 673", progress: 0, evaluationStatus: "por_validar", isNew: true, paymentStatus: "pago", age: 22, paymentExpiryDate: "2026-04-05", isPaying: true, hasSubscription: false, nextEvaluationDate: "2026-03-18" },
    { id: "7", name: "Catarina Lima", avatar: "https://picsum.photos/100/100?random=7", plan: "Perda de Peso", status: "active", lastActive: "Agora", contact: "+351 912 345 674", progress: 30, evaluationStatus: "pendente", isNew: false, paymentStatus: "pago", age: 37, paymentExpiryDate: "2026-04-20", isPaying: true, hasSubscription: true, nextEvaluationDate: "2026-03-25" }
  ];
  var MOCK_EVENTS = [
    { id: "1", type: "birthday", clientId: "1", clientName: "Ana Silva", title: "Anivers\xE1rio", time: "Hoje", isUrgent: false },
    { id: "2", type: "check-in", clientId: "4", clientName: "Jo\xE3o Pereira", title: "Check-in Semanal", time: "09:00", isUrgent: true },
    { id: "3", type: "goal", clientId: "2", clientName: "Carlos Mendes", title: "Meta 80kg Atingida", time: "10:30", isUrgent: false },
    { id: "4", type: "payment", clientId: "5", clientName: "Sofia Oliveira", title: "Pagamento em Atraso", time: "Ontem", isUrgent: true }
  ];
  var MOCK_PENDING = [
    { id: "101", type: "workout_submission", clientId: "3", clientName: "Beatriz Costa", date: "2023-10-24", status: "pending", details: "Treino A - Pernas" },
    { id: "102", type: "physical_assessment", clientId: "4", clientName: "Jo\xE3o Pereira", date: "2023-10-24", status: "pending", details: "Fotos e Medidas Mensais" },
    { id: "103", type: "nutrition_update", clientId: "1", clientName: "Ana Silva", date: "2023-10-23", status: "pending", details: "Pedido de altera\xE7\xE3o no pequeno-almo\xE7o" }
  ];
  var MOCK_FEEDBACK = [
    { id: "f1", clientId: "1", clientName: "Ana Silva", avatar: "https://picsum.photos/100/100?random=1", rating: 5, comment: "Adorei o novo plano de treino! Sinto-me muito mais energizada.", date: "2h atr\xE1s", read: false },
    { id: "f2", clientId: "2", clientName: "Carlos Mendes", avatar: "https://picsum.photos/100/100?random=2", rating: 4, comment: "O treino de pernas est\xE1 muito intenso, mas estou a aguentar.", date: "1d atr\xE1s", read: true }
  ];
  var MOCK_METRICS = [
    { label: "Receita Mensal", value: "\u20AC4,250", trend: 12.5, trendLabel: "vs m\xEAs passado" },
    { label: "Clientes Ativos", value: "42", trend: 5.2, trendLabel: "novos este m\xEAs" },
    { label: "Taxa de Reten\xE7\xE3o", value: "94%", trend: -1.1, trendLabel: "ligeira descida" }
  ];
  var CHART_DATA = [
    { name: "Seg", treinos: 12, checkins: 4 },
    { name: "Ter", treinos: 19, checkins: 8 },
    { name: "Qua", treinos: 15, checkins: 12 },
    { name: "Qui", treinos: 22, checkins: 6 },
    { name: "Sex", treinos: 28, checkins: 14 },
    { name: "Sab", treinos: 18, checkins: 2 },
    { name: "Dom", treinos: 10, checkins: 1 }
  ];
  var MOCK_EXERCISES = [
    {
      id: "1",
      name: "Supino Plano com Barra",
      muscleGroup: "Peitoral",
      secondaryMuscleGroups: ["Tr\xEDceps", "Ombros"],
      type: "For\xE7a",
      image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=200&h=200",
      videos: [{ type: "link", url: "https://youtube.com" }],
      description: "Deite-se no banco, segure a barra e empurre para cima.",
      isDeleted: false
    },
    {
      id: "2",
      name: "Agachamento Livre",
      muscleGroup: "Quadr\xEDceps",
      secondaryMuscleGroups: ["Gl\xFAteos", "Isquiotibiais"],
      type: "For\xE7a",
      image: "https://images.unsplash.com/photo-1574680096141-1cddd32e04ca?auto=format&fit=crop&q=80&w=200&h=200",
      videos: [{ type: "link", url: "https://youtube.com" }],
      description: "Mantenha as costas retas e agache at\xE9 a paralela.",
      isDeleted: false
    },
    {
      id: "3",
      name: "Puxada Alta",
      muscleGroup: "Dorsal",
      secondaryMuscleGroups: ["B\xEDceps"],
      type: "For\xE7a",
      image: "https://images.unsplash.com/photo-1598575435213-3958e5346d1e?auto=format&fit=crop&q=80&w=200&h=200",
      videos: [{ type: "link", url: "https://youtube.com" }],
      description: "Puxe a barra em dire\xE7\xE3o ao peito superior.",
      isDeleted: false
    },
    {
      id: "4",
      name: "Eleva\xE7\xE3o Lateral",
      muscleGroup: "Ombros",
      secondaryMuscleGroups: [],
      type: "For\xE7a",
      image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=200&h=200",
      videos: [{ type: "link", url: "https://youtube.com" }],
      description: "Eleve os bra\xE7os lateralmente at\xE9 a altura dos ombros.",
      isDeleted: true
    }
  ];
  var MOCK_FOODS = [
    {
      id: "1",
      name: "Peito de Frango Grelhado",
      category: "Prote\xEDna",
      image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=200&h=200",
      unit: "g",
      baseQuantity: 100,
      calories: 165,
      protein: 31,
      carbs: 0,
      fat: 3.6,
      isDeleted: false
    },
    {
      id: "2",
      name: "Arroz Basmati Cozido",
      category: "Hidratos",
      image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=200&h=200",
      unit: "g",
      baseQuantity: 100,
      calories: 130,
      protein: 2.7,
      carbs: 28,
      fat: 0.3,
      isDeleted: false
    },
    {
      id: "3",
      name: "Abacate",
      category: "Gordura",
      image: "https://images.unsplash.com/photo-1523049673856-356c64cf11d9?auto=format&fit=crop&q=80&w=200&h=200",
      unit: "g",
      baseQuantity: 100,
      calories: 160,
      protein: 2,
      carbs: 8.5,
      fat: 14.7,
      isDeleted: false
    },
    {
      id: "4",
      name: "Whey Protein (Scoop)",
      category: "Suplementos",
      image: "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&q=80&w=200&h=200",
      unit: "unidade",
      baseQuantity: 1,
      calories: 120,
      protein: 24,
      carbs: 3,
      fat: 1,
      isDeleted: false
    },
    {
      id: "5",
      name: "Br\xF3colos Cozidos",
      category: "Vegetais",
      image: "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&q=80&w=200&h=200",
      unit: "g",
      baseQuantity: 100,
      calories: 35,
      protein: 2.8,
      carbs: 7,
      fat: 0.4,
      isDeleted: true
    }
  ];
  var MOCK_SUPPLEMENTS = [
    {
      id: "1",
      name: "Gold Standard 100% Whey",
      brand: "Optimum Nutrition",
      image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&q=80&w=200&h=200",
      description: "Isolado de prote\xEDna de soro de leite de alta qualidade. Ideal para recupera\xE7\xE3o p\xF3s-treino e constru\xE7\xE3o muscular.",
      link: "https://www.optimumnutrition.com",
      isDeleted: false
    },
    {
      id: "2",
      name: "Creatina Monohidratada",
      brand: "Prozis",
      image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=200&h=200",
      description: "Creatina pura para aumento de for\xE7a explosiva e volume celular. Essencial para treinos de hipertrofia.",
      link: "https://www.prozis.com",
      isDeleted: false
    },
    {
      id: "3",
      name: "C4 Original Pre-Workout",
      brand: "Cellucor",
      image: "https://images.unsplash.com/photo-1550572017-4fcd95616f9a?auto=format&fit=crop&q=80&w=200&h=200",
      description: "Energia explosiva, foco agu\xE7ado e pump muscular. Cont\xE9m cafe\xEDna, beta-alanina e nitrato de creatina.",
      link: "https://cellucor.com",
      isDeleted: false
    },
    {
      id: "4",
      name: "Multivitam\xEDnico Daily",
      brand: "MyProtein",
      image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=200&h=200",
      description: "Mistura completa de 7 vitaminas essenciais incluindo vitamina A, C, D3, E, Tiamina, Riboflavina e Niacina.",
      link: "https://www.myprotein.com",
      isDeleted: true
    }
  ];
  var MOCK_CONTENT = [
    {
      id: "1",
      title: "T\xE9cnica Perfeita de Agachamento",
      thumbnail: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=600&h=400",
      type: "video",
      category: "Treino",
      description: "Aprende os 5 erros mais comuns no agachamento e como corrigir a tua postura para evitar les\xF5es e maximizar a hipertrofia.",
      url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      // Example Embed
      createdAt: "2023-10-15",
      isDeleted: false
    },
    {
      id: "2",
      title: "Guia Completo de Hipertrofia",
      thumbnail: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=600&h=400",
      type: "pdf",
      category: "Treino",
      description: "Ebook com 20 p\xE1ginas sobre os princ\xEDpios fundamentais da hipertrofia, volume de treino e sele\xE7\xE3o de exerc\xEDcios.",
      url: "https://example.com/guide.pdf",
      createdAt: "2023-10-10",
      isDeleted: false
    },
    {
      id: "3",
      title: "5 Receitas P\xF3s-Treino R\xE1pidas",
      thumbnail: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600&h=400",
      type: "article",
      category: "Receitas",
      description: "Refei\xE7\xF5es ricas em prote\xEDna que podes preparar em menos de 15 minutos para otimizar a tua recupera\xE7\xE3o.",
      url: "https://example.com/blog/recipies",
      createdAt: "2023-10-05",
      isDeleted: false
    },
    {
      id: "4",
      title: "Mindset de Campe\xE3o",
      thumbnail: "https://images.unsplash.com/photo-1552674605-1e9513e5efb9?auto=format&fit=crop&q=80&w=600&h=400",
      type: "audio",
      category: "Mindset",
      description: "Podcast sobre como manter a motiva\xE7\xE3o e disciplina nos dias mais dif\xEDceis.",
      url: "https://example.com/audio.mp3",
      createdAt: "2023-09-28",
      isDeleted: true
    }
  ];
  var MOCK_PLANS = [
    {
      id: "1",
      name: "Plano Mensal",
      durationMonths: 1,
      price: 49.99,
      isSubscription: true,
      allowOneTimePayment: false,
      allowInstallments: false,
      isTemporary: false,
      hasContentAccess: true,
      startDate: "2023-01-01",
      isActive: true,
      visibility: "P\xFAblico",
      isDeleted: false
    },
    {
      id: "2",
      name: "Transforma\xE7\xE3o Trimestral",
      durationMonths: 3,
      price: 135,
      isSubscription: true,
      allowOneTimePayment: true,
      allowInstallments: true,
      isTemporary: false,
      hasContentAccess: true,
      startDate: "2023-01-01",
      isActive: true,
      visibility: "P\xFAblico",
      isDeleted: false
    },
    {
      id: "3",
      name: "Pack Ver\xE3o (Semestral)",
      durationMonths: 6,
      price: 250,
      isSubscription: false,
      allowOneTimePayment: true,
      allowInstallments: true,
      isTemporary: true,
      hasContentAccess: true,
      startDate: "2023-06-01",
      endDate: "2023-09-30",
      isActive: true,
      visibility: "P\xFAblico",
      isDeleted: false
    },
    {
      id: "4",
      name: "Consultoria Online Anual",
      durationMonths: 12,
      price: 480,
      isSubscription: true,
      allowOneTimePayment: true,
      allowInstallments: true,
      isTemporary: false,
      hasContentAccess: true,
      startDate: "2023-01-01",
      isActive: true,
      visibility: "Privado",
      isDeleted: false
    },
    {
      id: "5",
      name: "Plano Basic",
      durationMonths: 1,
      price: 29.99,
      isSubscription: true,
      allowOneTimePayment: false,
      allowInstallments: false,
      isTemporary: false,
      hasContentAccess: false,
      startDate: "2023-01-01",
      isActive: false,
      visibility: "P\xFAblico",
      isDeleted: true
    }
  ];
  var MOCK_PROMOS = [
    {
      id: "1",
      code: "BEMVINDO20",
      type: "percent",
      value: 20,
      planIds: ["1", "2"],
      validityMinutes: 1440,
      // 24h
      validUntil: "2024-12-31",
      usageCount: 15,
      maxUsage: 50,
      applyToRecurring: true,
      createdAt: "2023-10-01",
      isDeleted: false
    },
    {
      id: "2",
      code: "VERAO50",
      type: "fixed_amount",
      value: 50,
      planIds: ["3"],
      validityMinutes: 60,
      // Flash sale 1h
      validUntil: "2023-08-31",
      usageCount: 42,
      maxUsage: 42,
      applyToRecurring: false,
      createdAt: "2023-06-01",
      isDeleted: false
    },
    {
      id: "3",
      code: "BLACKFRIDAY",
      type: "percent",
      value: 30,
      planIds: ["1", "2", "3", "4"],
      validityMinutes: 4320,
      // 3 days
      validUntil: "2023-11-27",
      usageCount: 128,
      maxUsage: 200,
      applyToRecurring: true,
      createdAt: "2023-11-01",
      isDeleted: false
    },
    {
      id: "4",
      code: "AMIGO10",
      type: "fixed_amount",
      value: 10,
      planIds: ["1"],
      validityMinutes: 0,
      validUntil: "2025-01-01",
      usageCount: 5,
      maxUsage: 1e3,
      applyToRecurring: false,
      createdAt: "2023-09-15",
      isDeleted: true
    },
    {
      id: "5",
      code: "PRECOFIXO",
      type: "fixed_price",
      value: 25,
      planIds: ["1"],
      validityMinutes: 0,
      validUntil: "2024-06-01",
      usageCount: 2,
      maxUsage: 10,
      applyToRecurring: true,
      createdAt: "2024-01-01",
      isDeleted: false
    }
  ];
  var MUSCLE_GROUPS = [
    "Peitoral",
    "Dorsal",
    "Quadr\xEDceps",
    "Isquiotibiais",
    "Gl\xFAteo",
    "Ombros",
    "B\xEDceps",
    "Tr\xEDceps",
    "Abdominais",
    "Cardio"
  ];
  var EQUIPMENT_TYPES = [
    "Peso Livre",
    "M\xE1quina",
    "Cabo",
    "Peso Corporal",
    "El\xE1sticos",
    "Cardio"
  ];
  var DIFFICULTY_LEVELS = [
    "Iniciante",
    "Interm\xE9dio",
    "Avan\xE7ado"
  ];
  var EXERCISE_TYPES = [
    "Indefinido",
    "Alongamento",
    "Mobilidade",
    "For\xE7a"
  ];
  var FOOD_CATEGORIES = ["Prote\xEDna", "Hidratos", "Gordura", "Vegetais", "Fruta", "Latic\xEDnios", "Suplementos", "Bebidas", "Outros"];
  var FOOD_UNITS = ["g", "ml", "unidade"];
  var SUPPLEMENT_CATEGORIES = ["Prote\xEDna", "Creatina", "Pr\xE9-Treino", "Vitaminas", "Recupera\xE7\xE3o", "Perda de Peso", "Sa\xFAde Geral", "Outros"];
  var CONTENT_TYPES = ["video", "article", "pdf", "audio"];
  var CONTENT_CATEGORIES = ["Nutri\xE7\xE3o", "Treino", "Mindset", "Receitas", "Tutorial", "Outros"];
  var DESCRIPTION_TEMPLATES = {
    default: `1. Posi\xE7\xE3o Inicial:
- 

2. Execu\xE7\xE3o:
- 

3. Pontos Chave:
- `,
    strength: `1. Prepara\xE7\xE3o:
- Ajuste o equipamento para...
- Posicione-se com...

2. Execu\xE7\xE3o:
- Inicie o movimento controlando a carga.
- Expire ao realizar esfor\xE7o.
- Retorne \xE0 posi\xE7\xE3o inicial de forma controlada.

3. Dicas de Seguran\xE7a:
- Mantenha a coluna neutra.`,
    mobility: `1. Objetivo:
- Aumentar a amplitude de movimento em...

2. Como fazer:
- Mova-se suavemente at\xE9 o limite da amplitude.
- Mantenha a respira\xE7\xE3o fluida.

3. Tempo/Repeti\xE7\xF5es:
- Realize por 30-60 segundos.`
  };
  var MOCK_QUESTIONNAIRES = [
    {
      id: "1",
      title: "Avalia\xE7\xE3o Inicial",
      description: "Question\xE1rio para conhecer o cliente antes de iniciar o plano.",
      type: "Avalia\xE7\xE3o inicial",
      questions: [
        { id: "q1", text: "Qual \xE9 o seu objetivo principal?", type: "text", required: true },
        { id: "q2", text: "Quantas vezes por semana pretende treinar?", type: "number", required: true },
        { id: "q3", text: "Tem alguma les\xE3o?", type: "boolean", required: true }
      ],
      createdAt: "2024-01-10",
      isDeleted: false
    },
    {
      id: "2",
      title: "Check-in Semanal",
      description: "Acompanhamento peri\xF3dico do progresso.",
      type: "Peri\xF3dico",
      frequency: 7,
      questions: [
        { id: "q4", text: "Como avalia a sua energia esta semana?", type: "multiple_choice", options: ["Baixa", "M\xE9dia", "Alta"], required: true },
        { id: "q5", text: "Cumpriu o plano alimentar?", type: "boolean", required: true },
        { id: "q6", text: "Peso atual (kg)", type: "number", required: false }
      ],
      createdAt: "2024-01-15",
      isDeleted: false
    },
    {
      id: "3",
      title: "Registo de H\xE1bitos",
      description: "Acompanhamento di\xE1rio de h\xE1bitos e rotinas.",
      type: "Registo di\xE1rio",
      frequency: 1,
      questions: [
        { id: "q7", text: "Bebeu 2L de \xE1gua hoje?", type: "boolean", required: true },
        { id: "q8", text: "Dormiu pelo menos 7 horas?", type: "boolean", required: true }
      ],
      createdAt: "2024-03-01",
      isDeleted: false
    }
  ];
})();
/*! Bundled license information:

react/cjs/react.development.js:
  (**
   * @license React
   * react.development.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

lucide-react/dist/esm/shared/src/utils/mergeClasses.js:
lucide-react/dist/esm/shared/src/utils/toKebabCase.js:
lucide-react/dist/esm/shared/src/utils/toCamelCase.js:
lucide-react/dist/esm/shared/src/utils/toPascalCase.js:
lucide-react/dist/esm/defaultAttributes.js:
lucide-react/dist/esm/shared/src/utils/hasA11yProp.js:
lucide-react/dist/esm/Icon.js:
lucide-react/dist/esm/createLucideIcon.js:
lucide-react/dist/esm/icons/activity.js:
lucide-react/dist/esm/icons/apple.js:
lucide-react/dist/esm/icons/bell.js:
lucide-react/dist/esm/icons/circle-question-mark.js:
lucide-react/dist/esm/icons/clipboard-check.js:
lucide-react/dist/esm/icons/credit-card.js:
lucide-react/dist/esm/icons/dumbbell.js:
lucide-react/dist/esm/icons/file-text.js:
lucide-react/dist/esm/icons/layout-dashboard.js:
lucide-react/dist/esm/icons/pill.js:
lucide-react/dist/esm/icons/tag.js:
lucide-react/dist/esm/icons/users.js:
lucide-react/dist/esm/icons/utensils.js:
lucide-react/dist/esm/icons/wallet.js:
lucide-react/dist/esm/lucide-react.js:
  (**
   * @license lucide-react v0.564.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)
*/
