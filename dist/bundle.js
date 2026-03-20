(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
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
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

  // node_modules/shimmer/index.js
  var require_shimmer = __commonJS({
    "node_modules/shimmer/index.js"(exports, module) {
      "use strict";
      function isFunction2(funktion) {
        return typeof funktion === "function";
      }
      var logger = console.error.bind(console);
      function defineProperty(obj, name, value) {
        var enumerable = !!obj[name] && obj.propertyIsEnumerable(name);
        Object.defineProperty(obj, name, {
          configurable: true,
          enumerable,
          writable: true,
          value
        });
      }
      function shimmer3(options) {
        if (options && options.logger) {
          if (!isFunction2(options.logger)) logger("new logger isn't a function, not replacing");
          else logger = options.logger;
        }
      }
      function wrap3(nodule, name, wrapper) {
        if (!nodule || !nodule[name]) {
          logger("no original function " + name + " to wrap");
          return;
        }
        if (!wrapper) {
          logger("no wrapper function");
          logger(new Error().stack);
          return;
        }
        if (!isFunction2(nodule[name]) || !isFunction2(wrapper)) {
          logger("original object and wrapper must be functions");
          return;
        }
        var original = nodule[name];
        var wrapped = wrapper(original, name);
        defineProperty(wrapped, "__original", original);
        defineProperty(wrapped, "__unwrap", function() {
          if (nodule[name] === wrapped) defineProperty(nodule, name, original);
        });
        defineProperty(wrapped, "__wrapped", true);
        defineProperty(nodule, name, wrapped);
        return wrapped;
      }
      function massWrap3(nodules, names, wrapper) {
        if (!nodules) {
          logger("must provide one or more modules to patch");
          logger(new Error().stack);
          return;
        } else if (!Array.isArray(nodules)) {
          nodules = [nodules];
        }
        if (!(names && Array.isArray(names))) {
          logger("must provide one or more functions to wrap on modules");
          return;
        }
        nodules.forEach(function(nodule) {
          names.forEach(function(name) {
            wrap3(nodule, name, wrapper);
          });
        });
      }
      function unwrap3(nodule, name) {
        if (!nodule || !nodule[name]) {
          logger("no function to unwrap.");
          logger(new Error().stack);
          return;
        }
        if (!nodule[name].__unwrap) {
          logger("no original to unwrap to -- has " + name + " already been unwrapped?");
        } else {
          return nodule[name].__unwrap();
        }
      }
      function massUnwrap3(nodules, names) {
        if (!nodules) {
          logger("must provide one or more modules to patch");
          logger(new Error().stack);
          return;
        } else if (!Array.isArray(nodules)) {
          nodules = [nodules];
        }
        if (!(names && Array.isArray(names))) {
          logger("must provide one or more functions to unwrap on modules");
          return;
        }
        nodules.forEach(function(nodule) {
          names.forEach(function(name) {
            unwrap3(nodule, name);
          });
        });
      }
      shimmer3.wrap = wrap3;
      shimmer3.massWrap = massWrap3;
      shimmer3.unwrap = unwrap3;
      shimmer3.massUnwrap = massUnwrap3;
      module.exports = shimmer3;
    }
  });

  // src/config.js
  var DEFAULTS = {
    serviceName: "browser-demo",
    serviceVersion: "1.0.0",
    otlpUrl: "http://localhost:4318/v1/traces"
  };
  function parseJson(raw, fallback) {
    if (!raw) return fallback;
    try {
      const parsed = JSON.parse(decodeURIComponent(raw));
      if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
        return parsed;
      }
    } catch {
    }
    return fallback;
  }
  function parseConfigFromQueryString() {
    const qs = new URLSearchParams(location.search);
    return {
      serviceName: qs.get("serviceName") ?? DEFAULTS.serviceName,
      serviceVersion: qs.get("serviceVersion") ?? DEFAULTS.serviceVersion,
      otlpExporterConfig: {
        url: qs.get("otlpUrl") ?? DEFAULTS.otlpUrl,
        headers: parseJson(qs.get("headers"), {})
      },
      customAttributes: parseJson(qs.get("attrs"), {})
    };
  }
  function field(id) {
    return document.getElementById(id)?.value.trim() ?? "";
  }
  function readConfigFromForm() {
    return {
      serviceName: field("ub-sn") || DEFAULTS.serviceName,
      serviceVersion: field("ub-sv") || DEFAULTS.serviceVersion,
      otlpExporterConfig: {
        url: field("ub-url") || DEFAULTS.otlpUrl,
        headers: parseJson(field("ub-hdrs") || null, {})
      },
      customAttributes: {}
      // populated separately via readCustomAttributes()
    };
  }

  // src/ui.js
  var LOG_ICONS = {
    info: "\u2139",
    success: "\u2713",
    error: "\u2717",
    warn: "\u26A0",
    span: "\u25C8",
    nav: "\u2192",
    muted: "\xB7"
  };
  var logCount = 0;
  function escHtml(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function log(type, msg) {
    const body = document.getElementById("log-body");
    if (body.querySelector(".le-msg.muted")) body.innerHTML = "";
    const t = (/* @__PURE__ */ new Date()).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
    const entry = document.createElement("div");
    entry.className = "le";
    entry.innerHTML = `<span class="le-time">${t}</span><span>${LOG_ICONS[type]}</span><span class="le-msg ${type}">${escHtml(msg)}</span>`;
    body.appendChild(entry);
    body.scrollTop = body.scrollHeight;
    document.getElementById("log-count").textContent = `(${++logCount})`;
  }
  function clearLog() {
    logCount = 0;
    document.getElementById("log-body").innerHTML = `
    <div class="le">
      <span class="le-time">\u2014</span>
      <span>\xB7</span>
      <span class="le-msg muted">Log cleared.</span>
    </div>`;
    document.getElementById("log-count").textContent = "(0)";
  }
  function setStatus(state, msg) {
    document.getElementById("dot").className = `dot ${state}`;
    const lbl = document.getElementById("sdk-label");
    lbl.textContent = msg;
    lbl.style.color = state === "ok" ? "var(--green)" : state === "error" ? "var(--red)" : "var(--muted)";
  }
  function enableButtons() {
    document.querySelectorAll("#btn-grid .btn").forEach((b) => {
      b.disabled = false;
    });
  }
  function updateSnippet(config2, customAttrs) {
    let headersStr = "{}";
    try {
      headersStr = JSON.stringify(config2.otlpExporterConfig.headers, null, 2);
    } catch {
    }
    const attrsEntries = Object.entries(customAttrs);
    const attrsStr = attrsEntries.length === 0 ? "" : `,
  <span class="prop">attributes</span>: {
${attrsEntries.map(
      ([k, v]) => `    <span class="prop">${escHtml(k)}</span>: <span class="str">'${escHtml(v)}'</span>`
    ).join(",\n")}
  }`;
    document.getElementById("code-snippet").innerHTML = `<span class="kw">import</span> { <span class="fn">BrowserSDK</span> } <span class="kw">from</span> <span class="str">'@opentelemetry/browser-instrumentation'</span>;

<span class="kw">const</span> sdk = <span class="kw">new</span> <span class="fn">BrowserSDK</span>({
  <span class="prop">serviceName</span>:    <span class="str">'${escHtml(config2.serviceName)}'</span>,
  <span class="prop">serviceVersion</span>: <span class="str">'${escHtml(config2.serviceVersion)}'</span>,
  <span class="prop">otlpExporterConfig</span>: {
    <span class="prop">url</span>:     <span class="str">'${escHtml(config2.otlpExporterConfig.url)}'</span>,
    <span class="prop">headers</span>: ${escHtml(headersStr)},
  }${attrsStr},
});

sdk.<span class="fn">start</span>();`;
  }
  function buildUrl() {
    const sn = document.getElementById("ub-sn").value.trim();
    const sv = document.getElementById("ub-sv").value.trim();
    const url = document.getElementById("ub-url").value.trim();
    const hdrs = document.getElementById("ub-hdrs").value.trim();
    const attrs = readCustomAttributes();
    const p = new URLSearchParams();
    if (sn) p.set("serviceName", sn);
    if (sv) p.set("serviceVersion", sv);
    if (url) p.set("otlpUrl", url);
    if (hdrs) {
      try {
        JSON.parse(hdrs);
        p.set("headers", encodeURIComponent(hdrs));
      } catch {
      }
    }
    const attrsEntries = Object.entries(attrs);
    if (attrsEntries.length > 0) {
      p.set("attrs", encodeURIComponent(JSON.stringify(attrs)));
    }
    const qs = p.toString();
    return location.origin + location.pathname + (qs ? "?" + qs : "");
  }
  function syncUrl() {
    const url = buildUrl();
    history.replaceState(null, "", url);
    const out = document.getElementById("ub-out");
    if (out) out.textContent = url;
  }
  function copyUrl() {
    const url = buildUrl();
    navigator.clipboard.writeText(url).then(() => {
      const btn = document.getElementById("copy-btn");
      btn.textContent = "\u2713 Copied!";
      setTimeout(() => {
        btn.textContent = "Copy";
      }, 1400);
    }).catch(() => {
    });
  }
  function initConfigForm(initialConfig2, onChange) {
    document.getElementById("ub-sn").value = initialConfig2.serviceName;
    document.getElementById("ub-sv").value = initialConfig2.serviceVersion;
    document.getElementById("ub-url").value = initialConfig2.otlpExporterConfig.url;
    const headersRaw = initialConfig2.otlpExporterConfig.headers;
    if (Object.keys(headersRaw).length > 0) {
      document.getElementById("ub-hdrs").value = JSON.stringify(headersRaw);
    }
    const handleChange = () => {
      syncUrl();
      onChange();
    };
    ["ub-sn", "ub-sv", "ub-url", "ub-hdrs"].forEach(
      (id) => document.getElementById(id).addEventListener("input", handleChange)
    );
    const ubResult = document.getElementById("ub-result");
    const copyBtn = document.getElementById("copy-btn");
    const doCopy = (e) => {
      e.stopPropagation();
      copyUrl();
    };
    ubResult?.addEventListener("click", doCopy);
    copyBtn?.addEventListener("click", doCopy);
    syncUrl();
  }
  function readCustomAttributes() {
    const attrs = {};
    document.querySelectorAll(".attr-row").forEach((row) => {
      const key = row.querySelector(".attr-key").value.trim();
      const val = row.querySelector(".attr-val").value.trim();
      if (key) attrs[key] = val;
    });
    return attrs;
  }
  function addAttrRow(key, val, onChange) {
    const list = document.getElementById("custom-attrs-list");
    const row = document.createElement("div");
    row.className = "attr-row";
    row.innerHTML = `
    <input type="text" class="ub-input attr-key" placeholder="attribute-key" value="${escHtml(key)}" />
    <span class="attr-sep">:</span>
    <input type="text" class="ub-input attr-val" placeholder="value" value="${escHtml(val)}" />
    <button class="attr-remove" title="Remove">\xD7</button>`;
    row.querySelector(".attr-remove").addEventListener("click", () => {
      row.remove();
      onChange();
    });
    row.querySelectorAll("input").forEach((i) => i.addEventListener("input", onChange));
    list.appendChild(row);
  }
  function initCustomAttributes(initialAttrs, onChange) {
    const handleChange = () => {
      syncUrl();
      onChange();
    };
    for (const [k, v] of Object.entries(initialAttrs)) {
      addAttrRow(k, v, handleChange);
    }
    document.getElementById("btn-add-attr").addEventListener("click", () => {
      addAttrRow("", "", handleChange);
      handleChange();
    });
  }

  // node_modules/@opentelemetry/api/build/esm/platform/browser/globalThis.js
  var _globalThis = typeof globalThis === "object" ? globalThis : typeof self === "object" ? self : typeof window === "object" ? window : typeof global === "object" ? global : {};

  // node_modules/@opentelemetry/api/build/esm/version.js
  var VERSION = "1.9.0";

  // node_modules/@opentelemetry/api/build/esm/internal/semver.js
  var re = /^(\d+)\.(\d+)\.(\d+)(-(.+))?$/;
  function _makeCompatibilityCheck(ownVersion) {
    var acceptedVersions = /* @__PURE__ */ new Set([ownVersion]);
    var rejectedVersions = /* @__PURE__ */ new Set();
    var myVersionMatch = ownVersion.match(re);
    if (!myVersionMatch) {
      return function() {
        return false;
      };
    }
    var ownVersionParsed = {
      major: +myVersionMatch[1],
      minor: +myVersionMatch[2],
      patch: +myVersionMatch[3],
      prerelease: myVersionMatch[4]
    };
    if (ownVersionParsed.prerelease != null) {
      return function isExactmatch(globalVersion) {
        return globalVersion === ownVersion;
      };
    }
    function _reject(v) {
      rejectedVersions.add(v);
      return false;
    }
    function _accept(v) {
      acceptedVersions.add(v);
      return true;
    }
    return function isCompatible2(globalVersion) {
      if (acceptedVersions.has(globalVersion)) {
        return true;
      }
      if (rejectedVersions.has(globalVersion)) {
        return false;
      }
      var globalVersionMatch = globalVersion.match(re);
      if (!globalVersionMatch) {
        return _reject(globalVersion);
      }
      var globalVersionParsed = {
        major: +globalVersionMatch[1],
        minor: +globalVersionMatch[2],
        patch: +globalVersionMatch[3],
        prerelease: globalVersionMatch[4]
      };
      if (globalVersionParsed.prerelease != null) {
        return _reject(globalVersion);
      }
      if (ownVersionParsed.major !== globalVersionParsed.major) {
        return _reject(globalVersion);
      }
      if (ownVersionParsed.major === 0) {
        if (ownVersionParsed.minor === globalVersionParsed.minor && ownVersionParsed.patch <= globalVersionParsed.patch) {
          return _accept(globalVersion);
        }
        return _reject(globalVersion);
      }
      if (ownVersionParsed.minor <= globalVersionParsed.minor) {
        return _accept(globalVersion);
      }
      return _reject(globalVersion);
    };
  }
  var isCompatible = _makeCompatibilityCheck(VERSION);

  // node_modules/@opentelemetry/api/build/esm/internal/global-utils.js
  var major = VERSION.split(".")[0];
  var GLOBAL_OPENTELEMETRY_API_KEY = Symbol.for("opentelemetry.js.api." + major);
  var _global = _globalThis;
  function registerGlobal(type, instance, diag3, allowOverride) {
    var _a3;
    if (allowOverride === void 0) {
      allowOverride = false;
    }
    var api = _global[GLOBAL_OPENTELEMETRY_API_KEY] = (_a3 = _global[GLOBAL_OPENTELEMETRY_API_KEY]) !== null && _a3 !== void 0 ? _a3 : {
      version: VERSION
    };
    if (!allowOverride && api[type]) {
      var err = new Error("@opentelemetry/api: Attempted duplicate registration of API: " + type);
      diag3.error(err.stack || err.message);
      return false;
    }
    if (api.version !== VERSION) {
      var err = new Error("@opentelemetry/api: Registration of version v" + api.version + " for " + type + " does not match previously registered API v" + VERSION);
      diag3.error(err.stack || err.message);
      return false;
    }
    api[type] = instance;
    diag3.debug("@opentelemetry/api: Registered a global for " + type + " v" + VERSION + ".");
    return true;
  }
  function getGlobal(type) {
    var _a3, _b;
    var globalVersion = (_a3 = _global[GLOBAL_OPENTELEMETRY_API_KEY]) === null || _a3 === void 0 ? void 0 : _a3.version;
    if (!globalVersion || !isCompatible(globalVersion)) {
      return;
    }
    return (_b = _global[GLOBAL_OPENTELEMETRY_API_KEY]) === null || _b === void 0 ? void 0 : _b[type];
  }
  function unregisterGlobal(type, diag3) {
    diag3.debug("@opentelemetry/api: Unregistering a global for " + type + " v" + VERSION + ".");
    var api = _global[GLOBAL_OPENTELEMETRY_API_KEY];
    if (api) {
      delete api[type];
    }
  }

  // node_modules/@opentelemetry/api/build/esm/diag/ComponentLogger.js
  var __read = function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    } catch (error) {
      e = { error };
    } finally {
      try {
        if (r && !r.done && (m = i["return"])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }
    return ar;
  };
  var __spreadArray = function(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
      if (ar || !(i in from)) {
        if (!ar) ar = Array.prototype.slice.call(from, 0, i);
        ar[i] = from[i];
      }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
  var DiagComponentLogger = (
    /** @class */
    function() {
      function DiagComponentLogger2(props) {
        this._namespace = props.namespace || "DiagComponentLogger";
      }
      DiagComponentLogger2.prototype.debug = function() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }
        return logProxy("debug", this._namespace, args);
      };
      DiagComponentLogger2.prototype.error = function() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }
        return logProxy("error", this._namespace, args);
      };
      DiagComponentLogger2.prototype.info = function() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }
        return logProxy("info", this._namespace, args);
      };
      DiagComponentLogger2.prototype.warn = function() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }
        return logProxy("warn", this._namespace, args);
      };
      DiagComponentLogger2.prototype.verbose = function() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }
        return logProxy("verbose", this._namespace, args);
      };
      return DiagComponentLogger2;
    }()
  );
  function logProxy(funcName, namespace, args) {
    var logger = getGlobal("diag");
    if (!logger) {
      return;
    }
    args.unshift(namespace);
    return logger[funcName].apply(logger, __spreadArray([], __read(args), false));
  }

  // node_modules/@opentelemetry/api/build/esm/diag/types.js
  var DiagLogLevel;
  (function(DiagLogLevel2) {
    DiagLogLevel2[DiagLogLevel2["NONE"] = 0] = "NONE";
    DiagLogLevel2[DiagLogLevel2["ERROR"] = 30] = "ERROR";
    DiagLogLevel2[DiagLogLevel2["WARN"] = 50] = "WARN";
    DiagLogLevel2[DiagLogLevel2["INFO"] = 60] = "INFO";
    DiagLogLevel2[DiagLogLevel2["DEBUG"] = 70] = "DEBUG";
    DiagLogLevel2[DiagLogLevel2["VERBOSE"] = 80] = "VERBOSE";
    DiagLogLevel2[DiagLogLevel2["ALL"] = 9999] = "ALL";
  })(DiagLogLevel || (DiagLogLevel = {}));

  // node_modules/@opentelemetry/api/build/esm/diag/internal/logLevelLogger.js
  function createLogLevelDiagLogger(maxLevel, logger) {
    if (maxLevel < DiagLogLevel.NONE) {
      maxLevel = DiagLogLevel.NONE;
    } else if (maxLevel > DiagLogLevel.ALL) {
      maxLevel = DiagLogLevel.ALL;
    }
    logger = logger || {};
    function _filterFunc(funcName, theLevel) {
      var theFunc = logger[funcName];
      if (typeof theFunc === "function" && maxLevel >= theLevel) {
        return theFunc.bind(logger);
      }
      return function() {
      };
    }
    return {
      error: _filterFunc("error", DiagLogLevel.ERROR),
      warn: _filterFunc("warn", DiagLogLevel.WARN),
      info: _filterFunc("info", DiagLogLevel.INFO),
      debug: _filterFunc("debug", DiagLogLevel.DEBUG),
      verbose: _filterFunc("verbose", DiagLogLevel.VERBOSE)
    };
  }

  // node_modules/@opentelemetry/api/build/esm/api/diag.js
  var __read2 = function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    } catch (error) {
      e = { error };
    } finally {
      try {
        if (r && !r.done && (m = i["return"])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }
    return ar;
  };
  var __spreadArray2 = function(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
      if (ar || !(i in from)) {
        if (!ar) ar = Array.prototype.slice.call(from, 0, i);
        ar[i] = from[i];
      }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
  var API_NAME = "diag";
  var DiagAPI = (
    /** @class */
    function() {
      function DiagAPI2() {
        function _logProxy(funcName) {
          return function() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
              args[_i] = arguments[_i];
            }
            var logger = getGlobal("diag");
            if (!logger)
              return;
            return logger[funcName].apply(logger, __spreadArray2([], __read2(args), false));
          };
        }
        var self2 = this;
        var setLogger = function(logger, optionsOrLogLevel) {
          var _a3, _b, _c;
          if (optionsOrLogLevel === void 0) {
            optionsOrLogLevel = { logLevel: DiagLogLevel.INFO };
          }
          if (logger === self2) {
            var err = new Error("Cannot use diag as the logger for itself. Please use a DiagLogger implementation like ConsoleDiagLogger or a custom implementation");
            self2.error((_a3 = err.stack) !== null && _a3 !== void 0 ? _a3 : err.message);
            return false;
          }
          if (typeof optionsOrLogLevel === "number") {
            optionsOrLogLevel = {
              logLevel: optionsOrLogLevel
            };
          }
          var oldLogger = getGlobal("diag");
          var newLogger = createLogLevelDiagLogger((_b = optionsOrLogLevel.logLevel) !== null && _b !== void 0 ? _b : DiagLogLevel.INFO, logger);
          if (oldLogger && !optionsOrLogLevel.suppressOverrideMessage) {
            var stack = (_c = new Error().stack) !== null && _c !== void 0 ? _c : "<failed to generate stacktrace>";
            oldLogger.warn("Current logger will be overwritten from " + stack);
            newLogger.warn("Current logger will overwrite one already registered from " + stack);
          }
          return registerGlobal("diag", newLogger, self2, true);
        };
        self2.setLogger = setLogger;
        self2.disable = function() {
          unregisterGlobal(API_NAME, self2);
        };
        self2.createComponentLogger = function(options) {
          return new DiagComponentLogger(options);
        };
        self2.verbose = _logProxy("verbose");
        self2.debug = _logProxy("debug");
        self2.info = _logProxy("info");
        self2.warn = _logProxy("warn");
        self2.error = _logProxy("error");
      }
      DiagAPI2.instance = function() {
        if (!this._instance) {
          this._instance = new DiagAPI2();
        }
        return this._instance;
      };
      return DiagAPI2;
    }()
  );

  // node_modules/@opentelemetry/api/build/esm/baggage/internal/baggage-impl.js
  var __read3 = function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    } catch (error) {
      e = { error };
    } finally {
      try {
        if (r && !r.done && (m = i["return"])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }
    return ar;
  };
  var __values = function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
      next: function() {
        if (o && i >= o.length) o = void 0;
        return { value: o && o[i++], done: !o };
      }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
  };
  var BaggageImpl = (
    /** @class */
    function() {
      function BaggageImpl2(entries) {
        this._entries = entries ? new Map(entries) : /* @__PURE__ */ new Map();
      }
      BaggageImpl2.prototype.getEntry = function(key) {
        var entry = this._entries.get(key);
        if (!entry) {
          return void 0;
        }
        return Object.assign({}, entry);
      };
      BaggageImpl2.prototype.getAllEntries = function() {
        return Array.from(this._entries.entries()).map(function(_a3) {
          var _b = __read3(_a3, 2), k = _b[0], v = _b[1];
          return [k, v];
        });
      };
      BaggageImpl2.prototype.setEntry = function(key, entry) {
        var newBaggage = new BaggageImpl2(this._entries);
        newBaggage._entries.set(key, entry);
        return newBaggage;
      };
      BaggageImpl2.prototype.removeEntry = function(key) {
        var newBaggage = new BaggageImpl2(this._entries);
        newBaggage._entries.delete(key);
        return newBaggage;
      };
      BaggageImpl2.prototype.removeEntries = function() {
        var e_1, _a3;
        var keys = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          keys[_i] = arguments[_i];
        }
        var newBaggage = new BaggageImpl2(this._entries);
        try {
          for (var keys_1 = __values(keys), keys_1_1 = keys_1.next(); !keys_1_1.done; keys_1_1 = keys_1.next()) {
            var key = keys_1_1.value;
            newBaggage._entries.delete(key);
          }
        } catch (e_1_1) {
          e_1 = { error: e_1_1 };
        } finally {
          try {
            if (keys_1_1 && !keys_1_1.done && (_a3 = keys_1.return)) _a3.call(keys_1);
          } finally {
            if (e_1) throw e_1.error;
          }
        }
        return newBaggage;
      };
      BaggageImpl2.prototype.clear = function() {
        return new BaggageImpl2();
      };
      return BaggageImpl2;
    }()
  );

  // node_modules/@opentelemetry/api/build/esm/baggage/internal/symbol.js
  var baggageEntryMetadataSymbol = Symbol("BaggageEntryMetadata");

  // node_modules/@opentelemetry/api/build/esm/baggage/utils.js
  var diag = DiagAPI.instance();
  function createBaggage(entries) {
    if (entries === void 0) {
      entries = {};
    }
    return new BaggageImpl(new Map(Object.entries(entries)));
  }
  function baggageEntryMetadataFromString(str) {
    if (typeof str !== "string") {
      diag.error("Cannot create baggage metadata from unknown type: " + typeof str);
      str = "";
    }
    return {
      __TYPE__: baggageEntryMetadataSymbol,
      toString: function() {
        return str;
      }
    };
  }

  // node_modules/@opentelemetry/api/build/esm/context/context.js
  function createContextKey(description) {
    return Symbol.for(description);
  }
  var BaseContext = (
    /** @class */
    /* @__PURE__ */ function() {
      function BaseContext2(parentContext) {
        var self2 = this;
        self2._currentContext = parentContext ? new Map(parentContext) : /* @__PURE__ */ new Map();
        self2.getValue = function(key) {
          return self2._currentContext.get(key);
        };
        self2.setValue = function(key, value) {
          var context2 = new BaseContext2(self2._currentContext);
          context2._currentContext.set(key, value);
          return context2;
        };
        self2.deleteValue = function(key) {
          var context2 = new BaseContext2(self2._currentContext);
          context2._currentContext.delete(key);
          return context2;
        };
      }
      return BaseContext2;
    }()
  );
  var ROOT_CONTEXT = new BaseContext();

  // node_modules/@opentelemetry/api/build/esm/metrics/NoopMeter.js
  var __extends = /* @__PURE__ */ function() {
    var extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
        d2.__proto__ = b2;
      } || function(d2, b2) {
        for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
      };
      return extendStatics(d, b);
    };
    return function(d, b) {
      if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
  }();
  var NoopMeter = (
    /** @class */
    function() {
      function NoopMeter2() {
      }
      NoopMeter2.prototype.createGauge = function(_name, _options) {
        return NOOP_GAUGE_METRIC;
      };
      NoopMeter2.prototype.createHistogram = function(_name, _options) {
        return NOOP_HISTOGRAM_METRIC;
      };
      NoopMeter2.prototype.createCounter = function(_name, _options) {
        return NOOP_COUNTER_METRIC;
      };
      NoopMeter2.prototype.createUpDownCounter = function(_name, _options) {
        return NOOP_UP_DOWN_COUNTER_METRIC;
      };
      NoopMeter2.prototype.createObservableGauge = function(_name, _options) {
        return NOOP_OBSERVABLE_GAUGE_METRIC;
      };
      NoopMeter2.prototype.createObservableCounter = function(_name, _options) {
        return NOOP_OBSERVABLE_COUNTER_METRIC;
      };
      NoopMeter2.prototype.createObservableUpDownCounter = function(_name, _options) {
        return NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC;
      };
      NoopMeter2.prototype.addBatchObservableCallback = function(_callback, _observables) {
      };
      NoopMeter2.prototype.removeBatchObservableCallback = function(_callback) {
      };
      return NoopMeter2;
    }()
  );
  var NoopMetric = (
    /** @class */
    /* @__PURE__ */ function() {
      function NoopMetric2() {
      }
      return NoopMetric2;
    }()
  );
  var NoopCounterMetric = (
    /** @class */
    function(_super) {
      __extends(NoopCounterMetric2, _super);
      function NoopCounterMetric2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      NoopCounterMetric2.prototype.add = function(_value, _attributes) {
      };
      return NoopCounterMetric2;
    }(NoopMetric)
  );
  var NoopUpDownCounterMetric = (
    /** @class */
    function(_super) {
      __extends(NoopUpDownCounterMetric2, _super);
      function NoopUpDownCounterMetric2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      NoopUpDownCounterMetric2.prototype.add = function(_value, _attributes) {
      };
      return NoopUpDownCounterMetric2;
    }(NoopMetric)
  );
  var NoopGaugeMetric = (
    /** @class */
    function(_super) {
      __extends(NoopGaugeMetric2, _super);
      function NoopGaugeMetric2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      NoopGaugeMetric2.prototype.record = function(_value, _attributes) {
      };
      return NoopGaugeMetric2;
    }(NoopMetric)
  );
  var NoopHistogramMetric = (
    /** @class */
    function(_super) {
      __extends(NoopHistogramMetric2, _super);
      function NoopHistogramMetric2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      NoopHistogramMetric2.prototype.record = function(_value, _attributes) {
      };
      return NoopHistogramMetric2;
    }(NoopMetric)
  );
  var NoopObservableMetric = (
    /** @class */
    function() {
      function NoopObservableMetric2() {
      }
      NoopObservableMetric2.prototype.addCallback = function(_callback) {
      };
      NoopObservableMetric2.prototype.removeCallback = function(_callback) {
      };
      return NoopObservableMetric2;
    }()
  );
  var NoopObservableCounterMetric = (
    /** @class */
    function(_super) {
      __extends(NoopObservableCounterMetric2, _super);
      function NoopObservableCounterMetric2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      return NoopObservableCounterMetric2;
    }(NoopObservableMetric)
  );
  var NoopObservableGaugeMetric = (
    /** @class */
    function(_super) {
      __extends(NoopObservableGaugeMetric2, _super);
      function NoopObservableGaugeMetric2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      return NoopObservableGaugeMetric2;
    }(NoopObservableMetric)
  );
  var NoopObservableUpDownCounterMetric = (
    /** @class */
    function(_super) {
      __extends(NoopObservableUpDownCounterMetric2, _super);
      function NoopObservableUpDownCounterMetric2() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      return NoopObservableUpDownCounterMetric2;
    }(NoopObservableMetric)
  );
  var NOOP_METER = new NoopMeter();
  var NOOP_COUNTER_METRIC = new NoopCounterMetric();
  var NOOP_GAUGE_METRIC = new NoopGaugeMetric();
  var NOOP_HISTOGRAM_METRIC = new NoopHistogramMetric();
  var NOOP_UP_DOWN_COUNTER_METRIC = new NoopUpDownCounterMetric();
  var NOOP_OBSERVABLE_COUNTER_METRIC = new NoopObservableCounterMetric();
  var NOOP_OBSERVABLE_GAUGE_METRIC = new NoopObservableGaugeMetric();
  var NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC = new NoopObservableUpDownCounterMetric();

  // node_modules/@opentelemetry/api/build/esm/propagation/TextMapPropagator.js
  var defaultTextMapGetter = {
    get: function(carrier, key) {
      if (carrier == null) {
        return void 0;
      }
      return carrier[key];
    },
    keys: function(carrier) {
      if (carrier == null) {
        return [];
      }
      return Object.keys(carrier);
    }
  };
  var defaultTextMapSetter = {
    set: function(carrier, key, value) {
      if (carrier == null) {
        return;
      }
      carrier[key] = value;
    }
  };

  // node_modules/@opentelemetry/api/build/esm/context/NoopContextManager.js
  var __read4 = function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    } catch (error) {
      e = { error };
    } finally {
      try {
        if (r && !r.done && (m = i["return"])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }
    return ar;
  };
  var __spreadArray3 = function(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
      if (ar || !(i in from)) {
        if (!ar) ar = Array.prototype.slice.call(from, 0, i);
        ar[i] = from[i];
      }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
  var NoopContextManager = (
    /** @class */
    function() {
      function NoopContextManager2() {
      }
      NoopContextManager2.prototype.active = function() {
        return ROOT_CONTEXT;
      };
      NoopContextManager2.prototype.with = function(_context, fn, thisArg) {
        var args = [];
        for (var _i = 3; _i < arguments.length; _i++) {
          args[_i - 3] = arguments[_i];
        }
        return fn.call.apply(fn, __spreadArray3([thisArg], __read4(args), false));
      };
      NoopContextManager2.prototype.bind = function(_context, target) {
        return target;
      };
      NoopContextManager2.prototype.enable = function() {
        return this;
      };
      NoopContextManager2.prototype.disable = function() {
        return this;
      };
      return NoopContextManager2;
    }()
  );

  // node_modules/@opentelemetry/api/build/esm/api/context.js
  var __read5 = function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    } catch (error) {
      e = { error };
    } finally {
      try {
        if (r && !r.done && (m = i["return"])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }
    return ar;
  };
  var __spreadArray4 = function(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
      if (ar || !(i in from)) {
        if (!ar) ar = Array.prototype.slice.call(from, 0, i);
        ar[i] = from[i];
      }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
  var API_NAME2 = "context";
  var NOOP_CONTEXT_MANAGER = new NoopContextManager();
  var ContextAPI = (
    /** @class */
    function() {
      function ContextAPI2() {
      }
      ContextAPI2.getInstance = function() {
        if (!this._instance) {
          this._instance = new ContextAPI2();
        }
        return this._instance;
      };
      ContextAPI2.prototype.setGlobalContextManager = function(contextManager) {
        return registerGlobal(API_NAME2, contextManager, DiagAPI.instance());
      };
      ContextAPI2.prototype.active = function() {
        return this._getContextManager().active();
      };
      ContextAPI2.prototype.with = function(context2, fn, thisArg) {
        var _a3;
        var args = [];
        for (var _i = 3; _i < arguments.length; _i++) {
          args[_i - 3] = arguments[_i];
        }
        return (_a3 = this._getContextManager()).with.apply(_a3, __spreadArray4([context2, fn, thisArg], __read5(args), false));
      };
      ContextAPI2.prototype.bind = function(context2, target) {
        return this._getContextManager().bind(context2, target);
      };
      ContextAPI2.prototype._getContextManager = function() {
        return getGlobal(API_NAME2) || NOOP_CONTEXT_MANAGER;
      };
      ContextAPI2.prototype.disable = function() {
        this._getContextManager().disable();
        unregisterGlobal(API_NAME2, DiagAPI.instance());
      };
      return ContextAPI2;
    }()
  );

  // node_modules/@opentelemetry/api/build/esm/trace/trace_flags.js
  var TraceFlags;
  (function(TraceFlags2) {
    TraceFlags2[TraceFlags2["NONE"] = 0] = "NONE";
    TraceFlags2[TraceFlags2["SAMPLED"] = 1] = "SAMPLED";
  })(TraceFlags || (TraceFlags = {}));

  // node_modules/@opentelemetry/api/build/esm/trace/invalid-span-constants.js
  var INVALID_SPANID = "0000000000000000";
  var INVALID_TRACEID = "00000000000000000000000000000000";
  var INVALID_SPAN_CONTEXT = {
    traceId: INVALID_TRACEID,
    spanId: INVALID_SPANID,
    traceFlags: TraceFlags.NONE
  };

  // node_modules/@opentelemetry/api/build/esm/trace/NonRecordingSpan.js
  var NonRecordingSpan = (
    /** @class */
    function() {
      function NonRecordingSpan2(_spanContext) {
        if (_spanContext === void 0) {
          _spanContext = INVALID_SPAN_CONTEXT;
        }
        this._spanContext = _spanContext;
      }
      NonRecordingSpan2.prototype.spanContext = function() {
        return this._spanContext;
      };
      NonRecordingSpan2.prototype.setAttribute = function(_key, _value) {
        return this;
      };
      NonRecordingSpan2.prototype.setAttributes = function(_attributes) {
        return this;
      };
      NonRecordingSpan2.prototype.addEvent = function(_name, _attributes) {
        return this;
      };
      NonRecordingSpan2.prototype.addLink = function(_link) {
        return this;
      };
      NonRecordingSpan2.prototype.addLinks = function(_links) {
        return this;
      };
      NonRecordingSpan2.prototype.setStatus = function(_status) {
        return this;
      };
      NonRecordingSpan2.prototype.updateName = function(_name) {
        return this;
      };
      NonRecordingSpan2.prototype.end = function(_endTime) {
      };
      NonRecordingSpan2.prototype.isRecording = function() {
        return false;
      };
      NonRecordingSpan2.prototype.recordException = function(_exception, _time) {
      };
      return NonRecordingSpan2;
    }()
  );

  // node_modules/@opentelemetry/api/build/esm/trace/context-utils.js
  var SPAN_KEY = createContextKey("OpenTelemetry Context Key SPAN");
  function getSpan(context2) {
    return context2.getValue(SPAN_KEY) || void 0;
  }
  function getActiveSpan() {
    return getSpan(ContextAPI.getInstance().active());
  }
  function setSpan(context2, span) {
    return context2.setValue(SPAN_KEY, span);
  }
  function deleteSpan(context2) {
    return context2.deleteValue(SPAN_KEY);
  }
  function setSpanContext(context2, spanContext) {
    return setSpan(context2, new NonRecordingSpan(spanContext));
  }
  function getSpanContext(context2) {
    var _a3;
    return (_a3 = getSpan(context2)) === null || _a3 === void 0 ? void 0 : _a3.spanContext();
  }

  // node_modules/@opentelemetry/api/build/esm/trace/spancontext-utils.js
  var VALID_TRACEID_REGEX = /^([0-9a-f]{32})$/i;
  var VALID_SPANID_REGEX = /^[0-9a-f]{16}$/i;
  function isValidTraceId(traceId) {
    return VALID_TRACEID_REGEX.test(traceId) && traceId !== INVALID_TRACEID;
  }
  function isValidSpanId(spanId) {
    return VALID_SPANID_REGEX.test(spanId) && spanId !== INVALID_SPANID;
  }
  function isSpanContextValid(spanContext) {
    return isValidTraceId(spanContext.traceId) && isValidSpanId(spanContext.spanId);
  }
  function wrapSpanContext(spanContext) {
    return new NonRecordingSpan(spanContext);
  }

  // node_modules/@opentelemetry/api/build/esm/trace/NoopTracer.js
  var contextApi = ContextAPI.getInstance();
  var NoopTracer = (
    /** @class */
    function() {
      function NoopTracer2() {
      }
      NoopTracer2.prototype.startSpan = function(name, options, context2) {
        if (context2 === void 0) {
          context2 = contextApi.active();
        }
        var root = Boolean(options === null || options === void 0 ? void 0 : options.root);
        if (root) {
          return new NonRecordingSpan();
        }
        var parentFromContext = context2 && getSpanContext(context2);
        if (isSpanContext(parentFromContext) && isSpanContextValid(parentFromContext)) {
          return new NonRecordingSpan(parentFromContext);
        } else {
          return new NonRecordingSpan();
        }
      };
      NoopTracer2.prototype.startActiveSpan = function(name, arg2, arg3, arg4) {
        var opts;
        var ctx;
        var fn;
        if (arguments.length < 2) {
          return;
        } else if (arguments.length === 2) {
          fn = arg2;
        } else if (arguments.length === 3) {
          opts = arg2;
          fn = arg3;
        } else {
          opts = arg2;
          ctx = arg3;
          fn = arg4;
        }
        var parentContext = ctx !== null && ctx !== void 0 ? ctx : contextApi.active();
        var span = this.startSpan(name, opts, parentContext);
        var contextWithSpanSet = setSpan(parentContext, span);
        return contextApi.with(contextWithSpanSet, fn, void 0, span);
      };
      return NoopTracer2;
    }()
  );
  function isSpanContext(spanContext) {
    return typeof spanContext === "object" && typeof spanContext["spanId"] === "string" && typeof spanContext["traceId"] === "string" && typeof spanContext["traceFlags"] === "number";
  }

  // node_modules/@opentelemetry/api/build/esm/trace/ProxyTracer.js
  var NOOP_TRACER = new NoopTracer();
  var ProxyTracer = (
    /** @class */
    function() {
      function ProxyTracer2(_provider, name, version, options) {
        this._provider = _provider;
        this.name = name;
        this.version = version;
        this.options = options;
      }
      ProxyTracer2.prototype.startSpan = function(name, options, context2) {
        return this._getTracer().startSpan(name, options, context2);
      };
      ProxyTracer2.prototype.startActiveSpan = function(_name, _options, _context, _fn) {
        var tracer = this._getTracer();
        return Reflect.apply(tracer.startActiveSpan, tracer, arguments);
      };
      ProxyTracer2.prototype._getTracer = function() {
        if (this._delegate) {
          return this._delegate;
        }
        var tracer = this._provider.getDelegateTracer(this.name, this.version, this.options);
        if (!tracer) {
          return NOOP_TRACER;
        }
        this._delegate = tracer;
        return this._delegate;
      };
      return ProxyTracer2;
    }()
  );

  // node_modules/@opentelemetry/api/build/esm/trace/NoopTracerProvider.js
  var NoopTracerProvider = (
    /** @class */
    function() {
      function NoopTracerProvider2() {
      }
      NoopTracerProvider2.prototype.getTracer = function(_name, _version, _options) {
        return new NoopTracer();
      };
      return NoopTracerProvider2;
    }()
  );

  // node_modules/@opentelemetry/api/build/esm/trace/ProxyTracerProvider.js
  var NOOP_TRACER_PROVIDER = new NoopTracerProvider();
  var ProxyTracerProvider = (
    /** @class */
    function() {
      function ProxyTracerProvider2() {
      }
      ProxyTracerProvider2.prototype.getTracer = function(name, version, options) {
        var _a3;
        return (_a3 = this.getDelegateTracer(name, version, options)) !== null && _a3 !== void 0 ? _a3 : new ProxyTracer(this, name, version, options);
      };
      ProxyTracerProvider2.prototype.getDelegate = function() {
        var _a3;
        return (_a3 = this._delegate) !== null && _a3 !== void 0 ? _a3 : NOOP_TRACER_PROVIDER;
      };
      ProxyTracerProvider2.prototype.setDelegate = function(delegate) {
        this._delegate = delegate;
      };
      ProxyTracerProvider2.prototype.getDelegateTracer = function(name, version, options) {
        var _a3;
        return (_a3 = this._delegate) === null || _a3 === void 0 ? void 0 : _a3.getTracer(name, version, options);
      };
      return ProxyTracerProvider2;
    }()
  );

  // node_modules/@opentelemetry/api/build/esm/trace/SamplingResult.js
  var SamplingDecision;
  (function(SamplingDecision3) {
    SamplingDecision3[SamplingDecision3["NOT_RECORD"] = 0] = "NOT_RECORD";
    SamplingDecision3[SamplingDecision3["RECORD"] = 1] = "RECORD";
    SamplingDecision3[SamplingDecision3["RECORD_AND_SAMPLED"] = 2] = "RECORD_AND_SAMPLED";
  })(SamplingDecision || (SamplingDecision = {}));

  // node_modules/@opentelemetry/api/build/esm/trace/span_kind.js
  var SpanKind;
  (function(SpanKind2) {
    SpanKind2[SpanKind2["INTERNAL"] = 0] = "INTERNAL";
    SpanKind2[SpanKind2["SERVER"] = 1] = "SERVER";
    SpanKind2[SpanKind2["CLIENT"] = 2] = "CLIENT";
    SpanKind2[SpanKind2["PRODUCER"] = 3] = "PRODUCER";
    SpanKind2[SpanKind2["CONSUMER"] = 4] = "CONSUMER";
  })(SpanKind || (SpanKind = {}));

  // node_modules/@opentelemetry/api/build/esm/trace/status.js
  var SpanStatusCode;
  (function(SpanStatusCode2) {
    SpanStatusCode2[SpanStatusCode2["UNSET"] = 0] = "UNSET";
    SpanStatusCode2[SpanStatusCode2["OK"] = 1] = "OK";
    SpanStatusCode2[SpanStatusCode2["ERROR"] = 2] = "ERROR";
  })(SpanStatusCode || (SpanStatusCode = {}));

  // node_modules/@opentelemetry/api/build/esm/context-api.js
  var context = ContextAPI.getInstance();

  // node_modules/@opentelemetry/api/build/esm/diag-api.js
  var diag2 = DiagAPI.instance();

  // node_modules/@opentelemetry/api/build/esm/metrics/NoopMeterProvider.js
  var NoopMeterProvider = (
    /** @class */
    function() {
      function NoopMeterProvider2() {
      }
      NoopMeterProvider2.prototype.getMeter = function(_name, _version, _options) {
        return NOOP_METER;
      };
      return NoopMeterProvider2;
    }()
  );
  var NOOP_METER_PROVIDER = new NoopMeterProvider();

  // node_modules/@opentelemetry/api/build/esm/api/metrics.js
  var API_NAME3 = "metrics";
  var MetricsAPI = (
    /** @class */
    function() {
      function MetricsAPI2() {
      }
      MetricsAPI2.getInstance = function() {
        if (!this._instance) {
          this._instance = new MetricsAPI2();
        }
        return this._instance;
      };
      MetricsAPI2.prototype.setGlobalMeterProvider = function(provider) {
        return registerGlobal(API_NAME3, provider, DiagAPI.instance());
      };
      MetricsAPI2.prototype.getMeterProvider = function() {
        return getGlobal(API_NAME3) || NOOP_METER_PROVIDER;
      };
      MetricsAPI2.prototype.getMeter = function(name, version, options) {
        return this.getMeterProvider().getMeter(name, version, options);
      };
      MetricsAPI2.prototype.disable = function() {
        unregisterGlobal(API_NAME3, DiagAPI.instance());
      };
      return MetricsAPI2;
    }()
  );

  // node_modules/@opentelemetry/api/build/esm/metrics-api.js
  var metrics = MetricsAPI.getInstance();

  // node_modules/@opentelemetry/api/build/esm/propagation/NoopTextMapPropagator.js
  var NoopTextMapPropagator = (
    /** @class */
    function() {
      function NoopTextMapPropagator2() {
      }
      NoopTextMapPropagator2.prototype.inject = function(_context, _carrier) {
      };
      NoopTextMapPropagator2.prototype.extract = function(context2, _carrier) {
        return context2;
      };
      NoopTextMapPropagator2.prototype.fields = function() {
        return [];
      };
      return NoopTextMapPropagator2;
    }()
  );

  // node_modules/@opentelemetry/api/build/esm/baggage/context-helpers.js
  var BAGGAGE_KEY = createContextKey("OpenTelemetry Baggage Key");
  function getBaggage(context2) {
    return context2.getValue(BAGGAGE_KEY) || void 0;
  }
  function getActiveBaggage() {
    return getBaggage(ContextAPI.getInstance().active());
  }
  function setBaggage(context2, baggage) {
    return context2.setValue(BAGGAGE_KEY, baggage);
  }
  function deleteBaggage(context2) {
    return context2.deleteValue(BAGGAGE_KEY);
  }

  // node_modules/@opentelemetry/api/build/esm/api/propagation.js
  var API_NAME4 = "propagation";
  var NOOP_TEXT_MAP_PROPAGATOR = new NoopTextMapPropagator();
  var PropagationAPI = (
    /** @class */
    function() {
      function PropagationAPI2() {
        this.createBaggage = createBaggage;
        this.getBaggage = getBaggage;
        this.getActiveBaggage = getActiveBaggage;
        this.setBaggage = setBaggage;
        this.deleteBaggage = deleteBaggage;
      }
      PropagationAPI2.getInstance = function() {
        if (!this._instance) {
          this._instance = new PropagationAPI2();
        }
        return this._instance;
      };
      PropagationAPI2.prototype.setGlobalPropagator = function(propagator) {
        return registerGlobal(API_NAME4, propagator, DiagAPI.instance());
      };
      PropagationAPI2.prototype.inject = function(context2, carrier, setter) {
        if (setter === void 0) {
          setter = defaultTextMapSetter;
        }
        return this._getGlobalPropagator().inject(context2, carrier, setter);
      };
      PropagationAPI2.prototype.extract = function(context2, carrier, getter) {
        if (getter === void 0) {
          getter = defaultTextMapGetter;
        }
        return this._getGlobalPropagator().extract(context2, carrier, getter);
      };
      PropagationAPI2.prototype.fields = function() {
        return this._getGlobalPropagator().fields();
      };
      PropagationAPI2.prototype.disable = function() {
        unregisterGlobal(API_NAME4, DiagAPI.instance());
      };
      PropagationAPI2.prototype._getGlobalPropagator = function() {
        return getGlobal(API_NAME4) || NOOP_TEXT_MAP_PROPAGATOR;
      };
      return PropagationAPI2;
    }()
  );

  // node_modules/@opentelemetry/api/build/esm/propagation-api.js
  var propagation = PropagationAPI.getInstance();

  // node_modules/@opentelemetry/api/build/esm/api/trace.js
  var API_NAME5 = "trace";
  var TraceAPI = (
    /** @class */
    function() {
      function TraceAPI2() {
        this._proxyTracerProvider = new ProxyTracerProvider();
        this.wrapSpanContext = wrapSpanContext;
        this.isSpanContextValid = isSpanContextValid;
        this.deleteSpan = deleteSpan;
        this.getSpan = getSpan;
        this.getActiveSpan = getActiveSpan;
        this.getSpanContext = getSpanContext;
        this.setSpan = setSpan;
        this.setSpanContext = setSpanContext;
      }
      TraceAPI2.getInstance = function() {
        if (!this._instance) {
          this._instance = new TraceAPI2();
        }
        return this._instance;
      };
      TraceAPI2.prototype.setGlobalTracerProvider = function(provider) {
        var success = registerGlobal(API_NAME5, this._proxyTracerProvider, DiagAPI.instance());
        if (success) {
          this._proxyTracerProvider.setDelegate(provider);
        }
        return success;
      };
      TraceAPI2.prototype.getTracerProvider = function() {
        return getGlobal(API_NAME5) || this._proxyTracerProvider;
      };
      TraceAPI2.prototype.getTracer = function(name, version) {
        return this.getTracerProvider().getTracer(name, version);
      };
      TraceAPI2.prototype.disable = function() {
        unregisterGlobal(API_NAME5, DiagAPI.instance());
        this._proxyTracerProvider = new ProxyTracerProvider();
      };
      return TraceAPI2;
    }()
  );

  // node_modules/@opentelemetry/api/build/esm/trace-api.js
  var trace = TraceAPI.getInstance();

  // node_modules/@opentelemetry/core/build/esm/trace/suppress-tracing.js
  var SUPPRESS_TRACING_KEY = createContextKey("OpenTelemetry SDK Context Key SUPPRESS_TRACING");
  function suppressTracing(context2) {
    return context2.setValue(SUPPRESS_TRACING_KEY, true);
  }
  function isTracingSuppressed(context2) {
    return context2.getValue(SUPPRESS_TRACING_KEY) === true;
  }

  // node_modules/@opentelemetry/core/build/esm/baggage/constants.js
  var BAGGAGE_KEY_PAIR_SEPARATOR = "=";
  var BAGGAGE_PROPERTIES_SEPARATOR = ";";
  var BAGGAGE_ITEMS_SEPARATOR = ",";
  var BAGGAGE_HEADER = "baggage";
  var BAGGAGE_MAX_NAME_VALUE_PAIRS = 180;
  var BAGGAGE_MAX_PER_NAME_VALUE_PAIRS = 4096;
  var BAGGAGE_MAX_TOTAL_LENGTH = 8192;

  // node_modules/@opentelemetry/core/build/esm/baggage/utils.js
  var __read6 = function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    } catch (error) {
      e = { error };
    } finally {
      try {
        if (r && !r.done && (m = i["return"])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }
    return ar;
  };
  function serializeKeyPairs(keyPairs) {
    return keyPairs.reduce(function(hValue, current) {
      var value = "" + hValue + (hValue !== "" ? BAGGAGE_ITEMS_SEPARATOR : "") + current;
      return value.length > BAGGAGE_MAX_TOTAL_LENGTH ? hValue : value;
    }, "");
  }
  function getKeyPairs(baggage) {
    return baggage.getAllEntries().map(function(_a3) {
      var _b = __read6(_a3, 2), key = _b[0], value = _b[1];
      var entry = encodeURIComponent(key) + "=" + encodeURIComponent(value.value);
      if (value.metadata !== void 0) {
        entry += BAGGAGE_PROPERTIES_SEPARATOR + value.metadata.toString();
      }
      return entry;
    });
  }
  function parsePairKeyValue(entry) {
    var valueProps = entry.split(BAGGAGE_PROPERTIES_SEPARATOR);
    if (valueProps.length <= 0)
      return;
    var keyPairPart = valueProps.shift();
    if (!keyPairPart)
      return;
    var separatorIndex = keyPairPart.indexOf(BAGGAGE_KEY_PAIR_SEPARATOR);
    if (separatorIndex <= 0)
      return;
    var key = decodeURIComponent(keyPairPart.substring(0, separatorIndex).trim());
    var value = decodeURIComponent(keyPairPart.substring(separatorIndex + 1).trim());
    var metadata;
    if (valueProps.length > 0) {
      metadata = baggageEntryMetadataFromString(valueProps.join(BAGGAGE_PROPERTIES_SEPARATOR));
    }
    return { key, value, metadata };
  }

  // node_modules/@opentelemetry/core/build/esm/baggage/propagation/W3CBaggagePropagator.js
  var W3CBaggagePropagator = (
    /** @class */
    function() {
      function W3CBaggagePropagator2() {
      }
      W3CBaggagePropagator2.prototype.inject = function(context2, carrier, setter) {
        var baggage = propagation.getBaggage(context2);
        if (!baggage || isTracingSuppressed(context2))
          return;
        var keyPairs = getKeyPairs(baggage).filter(function(pair) {
          return pair.length <= BAGGAGE_MAX_PER_NAME_VALUE_PAIRS;
        }).slice(0, BAGGAGE_MAX_NAME_VALUE_PAIRS);
        var headerValue = serializeKeyPairs(keyPairs);
        if (headerValue.length > 0) {
          setter.set(carrier, BAGGAGE_HEADER, headerValue);
        }
      };
      W3CBaggagePropagator2.prototype.extract = function(context2, carrier, getter) {
        var headerValue = getter.get(carrier, BAGGAGE_HEADER);
        var baggageString = Array.isArray(headerValue) ? headerValue.join(BAGGAGE_ITEMS_SEPARATOR) : headerValue;
        if (!baggageString)
          return context2;
        var baggage = {};
        if (baggageString.length === 0) {
          return context2;
        }
        var pairs = baggageString.split(BAGGAGE_ITEMS_SEPARATOR);
        pairs.forEach(function(entry) {
          var keyPair = parsePairKeyValue(entry);
          if (keyPair) {
            var baggageEntry = { value: keyPair.value };
            if (keyPair.metadata) {
              baggageEntry.metadata = keyPair.metadata;
            }
            baggage[keyPair.key] = baggageEntry;
          }
        });
        if (Object.entries(baggage).length === 0) {
          return context2;
        }
        return propagation.setBaggage(context2, propagation.createBaggage(baggage));
      };
      W3CBaggagePropagator2.prototype.fields = function() {
        return [BAGGAGE_HEADER];
      };
      return W3CBaggagePropagator2;
    }()
  );

  // node_modules/@opentelemetry/core/build/esm/common/attributes.js
  var __values2 = function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
      next: function() {
        if (o && i >= o.length) o = void 0;
        return { value: o && o[i++], done: !o };
      }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
  };
  var __read7 = function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    } catch (error) {
      e = { error };
    } finally {
      try {
        if (r && !r.done && (m = i["return"])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }
    return ar;
  };
  function sanitizeAttributes(attributes) {
    var e_1, _a3;
    var out = {};
    if (typeof attributes !== "object" || attributes == null) {
      return out;
    }
    try {
      for (var _b = __values2(Object.entries(attributes)), _c = _b.next(); !_c.done; _c = _b.next()) {
        var _d = __read7(_c.value, 2), key = _d[0], val = _d[1];
        if (!isAttributeKey(key)) {
          diag2.warn("Invalid attribute key: " + key);
          continue;
        }
        if (!isAttributeValue(val)) {
          diag2.warn("Invalid attribute value set for key: " + key);
          continue;
        }
        if (Array.isArray(val)) {
          out[key] = val.slice();
        } else {
          out[key] = val;
        }
      }
    } catch (e_1_1) {
      e_1 = { error: e_1_1 };
    } finally {
      try {
        if (_c && !_c.done && (_a3 = _b.return)) _a3.call(_b);
      } finally {
        if (e_1) throw e_1.error;
      }
    }
    return out;
  }
  function isAttributeKey(key) {
    return typeof key === "string" && key.length > 0;
  }
  function isAttributeValue(val) {
    if (val == null) {
      return true;
    }
    if (Array.isArray(val)) {
      return isHomogeneousAttributeValueArray(val);
    }
    return isValidPrimitiveAttributeValue(val);
  }
  function isHomogeneousAttributeValueArray(arr) {
    var e_2, _a3;
    var type;
    try {
      for (var arr_1 = __values2(arr), arr_1_1 = arr_1.next(); !arr_1_1.done; arr_1_1 = arr_1.next()) {
        var element = arr_1_1.value;
        if (element == null)
          continue;
        if (!type) {
          if (isValidPrimitiveAttributeValue(element)) {
            type = typeof element;
            continue;
          }
          return false;
        }
        if (typeof element === type) {
          continue;
        }
        return false;
      }
    } catch (e_2_1) {
      e_2 = { error: e_2_1 };
    } finally {
      try {
        if (arr_1_1 && !arr_1_1.done && (_a3 = arr_1.return)) _a3.call(arr_1);
      } finally {
        if (e_2) throw e_2.error;
      }
    }
    return true;
  }
  function isValidPrimitiveAttributeValue(val) {
    switch (typeof val) {
      case "number":
      case "boolean":
      case "string":
        return true;
    }
    return false;
  }

  // node_modules/@opentelemetry/core/build/esm/common/logging-error-handler.js
  function loggingErrorHandler() {
    return function(ex) {
      diag2.error(stringifyException(ex));
    };
  }
  function stringifyException(ex) {
    if (typeof ex === "string") {
      return ex;
    } else {
      return JSON.stringify(flattenException(ex));
    }
  }
  function flattenException(ex) {
    var result = {};
    var current = ex;
    while (current !== null) {
      Object.getOwnPropertyNames(current).forEach(function(propertyName) {
        if (result[propertyName])
          return;
        var value = current[propertyName];
        if (value) {
          result[propertyName] = String(value);
        }
      });
      current = Object.getPrototypeOf(current);
    }
    return result;
  }

  // node_modules/@opentelemetry/core/build/esm/common/global-error-handler.js
  var delegateHandler = loggingErrorHandler();
  function globalErrorHandler(ex) {
    try {
      delegateHandler(ex);
    } catch (_a3) {
    }
  }

  // node_modules/@opentelemetry/core/build/esm/utils/sampling.js
  var TracesSamplerValues;
  (function(TracesSamplerValues2) {
    TracesSamplerValues2["AlwaysOff"] = "always_off";
    TracesSamplerValues2["AlwaysOn"] = "always_on";
    TracesSamplerValues2["ParentBasedAlwaysOff"] = "parentbased_always_off";
    TracesSamplerValues2["ParentBasedAlwaysOn"] = "parentbased_always_on";
    TracesSamplerValues2["ParentBasedTraceIdRatio"] = "parentbased_traceidratio";
    TracesSamplerValues2["TraceIdRatio"] = "traceidratio";
  })(TracesSamplerValues || (TracesSamplerValues = {}));

  // node_modules/@opentelemetry/core/build/esm/utils/environment.js
  var DEFAULT_LIST_SEPARATOR = ",";
  var ENVIRONMENT_BOOLEAN_KEYS = ["OTEL_SDK_DISABLED"];
  function isEnvVarABoolean(key) {
    return ENVIRONMENT_BOOLEAN_KEYS.indexOf(key) > -1;
  }
  var ENVIRONMENT_NUMBERS_KEYS = [
    "OTEL_BSP_EXPORT_TIMEOUT",
    "OTEL_BSP_MAX_EXPORT_BATCH_SIZE",
    "OTEL_BSP_MAX_QUEUE_SIZE",
    "OTEL_BSP_SCHEDULE_DELAY",
    "OTEL_BLRP_EXPORT_TIMEOUT",
    "OTEL_BLRP_MAX_EXPORT_BATCH_SIZE",
    "OTEL_BLRP_MAX_QUEUE_SIZE",
    "OTEL_BLRP_SCHEDULE_DELAY",
    "OTEL_ATTRIBUTE_VALUE_LENGTH_LIMIT",
    "OTEL_ATTRIBUTE_COUNT_LIMIT",
    "OTEL_SPAN_ATTRIBUTE_VALUE_LENGTH_LIMIT",
    "OTEL_SPAN_ATTRIBUTE_COUNT_LIMIT",
    "OTEL_LOGRECORD_ATTRIBUTE_VALUE_LENGTH_LIMIT",
    "OTEL_LOGRECORD_ATTRIBUTE_COUNT_LIMIT",
    "OTEL_SPAN_EVENT_COUNT_LIMIT",
    "OTEL_SPAN_LINK_COUNT_LIMIT",
    "OTEL_SPAN_ATTRIBUTE_PER_EVENT_COUNT_LIMIT",
    "OTEL_SPAN_ATTRIBUTE_PER_LINK_COUNT_LIMIT",
    "OTEL_EXPORTER_OTLP_TIMEOUT",
    "OTEL_EXPORTER_OTLP_TRACES_TIMEOUT",
    "OTEL_EXPORTER_OTLP_METRICS_TIMEOUT",
    "OTEL_EXPORTER_OTLP_LOGS_TIMEOUT",
    "OTEL_EXPORTER_JAEGER_AGENT_PORT"
  ];
  function isEnvVarANumber(key) {
    return ENVIRONMENT_NUMBERS_KEYS.indexOf(key) > -1;
  }
  var ENVIRONMENT_LISTS_KEYS = [
    "OTEL_NO_PATCH_MODULES",
    "OTEL_PROPAGATORS",
    "OTEL_SEMCONV_STABILITY_OPT_IN"
  ];
  function isEnvVarAList(key) {
    return ENVIRONMENT_LISTS_KEYS.indexOf(key) > -1;
  }
  var DEFAULT_ATTRIBUTE_VALUE_LENGTH_LIMIT = Infinity;
  var DEFAULT_ATTRIBUTE_COUNT_LIMIT = 128;
  var DEFAULT_SPAN_ATTRIBUTE_PER_EVENT_COUNT_LIMIT = 128;
  var DEFAULT_SPAN_ATTRIBUTE_PER_LINK_COUNT_LIMIT = 128;
  var DEFAULT_ENVIRONMENT = {
    OTEL_SDK_DISABLED: false,
    CONTAINER_NAME: "",
    ECS_CONTAINER_METADATA_URI_V4: "",
    ECS_CONTAINER_METADATA_URI: "",
    HOSTNAME: "",
    KUBERNETES_SERVICE_HOST: "",
    NAMESPACE: "",
    OTEL_BSP_EXPORT_TIMEOUT: 3e4,
    OTEL_BSP_MAX_EXPORT_BATCH_SIZE: 512,
    OTEL_BSP_MAX_QUEUE_SIZE: 2048,
    OTEL_BSP_SCHEDULE_DELAY: 5e3,
    OTEL_BLRP_EXPORT_TIMEOUT: 3e4,
    OTEL_BLRP_MAX_EXPORT_BATCH_SIZE: 512,
    OTEL_BLRP_MAX_QUEUE_SIZE: 2048,
    OTEL_BLRP_SCHEDULE_DELAY: 5e3,
    OTEL_EXPORTER_JAEGER_AGENT_HOST: "",
    OTEL_EXPORTER_JAEGER_AGENT_PORT: 6832,
    OTEL_EXPORTER_JAEGER_ENDPOINT: "",
    OTEL_EXPORTER_JAEGER_PASSWORD: "",
    OTEL_EXPORTER_JAEGER_USER: "",
    OTEL_EXPORTER_OTLP_ENDPOINT: "",
    OTEL_EXPORTER_OTLP_TRACES_ENDPOINT: "",
    OTEL_EXPORTER_OTLP_METRICS_ENDPOINT: "",
    OTEL_EXPORTER_OTLP_LOGS_ENDPOINT: "",
    OTEL_EXPORTER_OTLP_HEADERS: "",
    OTEL_EXPORTER_OTLP_TRACES_HEADERS: "",
    OTEL_EXPORTER_OTLP_METRICS_HEADERS: "",
    OTEL_EXPORTER_OTLP_LOGS_HEADERS: "",
    OTEL_EXPORTER_OTLP_TIMEOUT: 1e4,
    OTEL_EXPORTER_OTLP_TRACES_TIMEOUT: 1e4,
    OTEL_EXPORTER_OTLP_METRICS_TIMEOUT: 1e4,
    OTEL_EXPORTER_OTLP_LOGS_TIMEOUT: 1e4,
    OTEL_EXPORTER_ZIPKIN_ENDPOINT: "http://localhost:9411/api/v2/spans",
    OTEL_LOG_LEVEL: DiagLogLevel.INFO,
    OTEL_NO_PATCH_MODULES: [],
    OTEL_PROPAGATORS: ["tracecontext", "baggage"],
    OTEL_RESOURCE_ATTRIBUTES: "",
    OTEL_SERVICE_NAME: "",
    OTEL_ATTRIBUTE_VALUE_LENGTH_LIMIT: DEFAULT_ATTRIBUTE_VALUE_LENGTH_LIMIT,
    OTEL_ATTRIBUTE_COUNT_LIMIT: DEFAULT_ATTRIBUTE_COUNT_LIMIT,
    OTEL_SPAN_ATTRIBUTE_VALUE_LENGTH_LIMIT: DEFAULT_ATTRIBUTE_VALUE_LENGTH_LIMIT,
    OTEL_SPAN_ATTRIBUTE_COUNT_LIMIT: DEFAULT_ATTRIBUTE_COUNT_LIMIT,
    OTEL_LOGRECORD_ATTRIBUTE_VALUE_LENGTH_LIMIT: DEFAULT_ATTRIBUTE_VALUE_LENGTH_LIMIT,
    OTEL_LOGRECORD_ATTRIBUTE_COUNT_LIMIT: DEFAULT_ATTRIBUTE_COUNT_LIMIT,
    OTEL_SPAN_EVENT_COUNT_LIMIT: 128,
    OTEL_SPAN_LINK_COUNT_LIMIT: 128,
    OTEL_SPAN_ATTRIBUTE_PER_EVENT_COUNT_LIMIT: DEFAULT_SPAN_ATTRIBUTE_PER_EVENT_COUNT_LIMIT,
    OTEL_SPAN_ATTRIBUTE_PER_LINK_COUNT_LIMIT: DEFAULT_SPAN_ATTRIBUTE_PER_LINK_COUNT_LIMIT,
    OTEL_TRACES_EXPORTER: "",
    OTEL_TRACES_SAMPLER: TracesSamplerValues.ParentBasedAlwaysOn,
    OTEL_TRACES_SAMPLER_ARG: "",
    OTEL_LOGS_EXPORTER: "",
    OTEL_EXPORTER_OTLP_INSECURE: "",
    OTEL_EXPORTER_OTLP_TRACES_INSECURE: "",
    OTEL_EXPORTER_OTLP_METRICS_INSECURE: "",
    OTEL_EXPORTER_OTLP_LOGS_INSECURE: "",
    OTEL_EXPORTER_OTLP_CERTIFICATE: "",
    OTEL_EXPORTER_OTLP_TRACES_CERTIFICATE: "",
    OTEL_EXPORTER_OTLP_METRICS_CERTIFICATE: "",
    OTEL_EXPORTER_OTLP_LOGS_CERTIFICATE: "",
    OTEL_EXPORTER_OTLP_COMPRESSION: "",
    OTEL_EXPORTER_OTLP_TRACES_COMPRESSION: "",
    OTEL_EXPORTER_OTLP_METRICS_COMPRESSION: "",
    OTEL_EXPORTER_OTLP_LOGS_COMPRESSION: "",
    OTEL_EXPORTER_OTLP_CLIENT_KEY: "",
    OTEL_EXPORTER_OTLP_TRACES_CLIENT_KEY: "",
    OTEL_EXPORTER_OTLP_METRICS_CLIENT_KEY: "",
    OTEL_EXPORTER_OTLP_LOGS_CLIENT_KEY: "",
    OTEL_EXPORTER_OTLP_CLIENT_CERTIFICATE: "",
    OTEL_EXPORTER_OTLP_TRACES_CLIENT_CERTIFICATE: "",
    OTEL_EXPORTER_OTLP_METRICS_CLIENT_CERTIFICATE: "",
    OTEL_EXPORTER_OTLP_LOGS_CLIENT_CERTIFICATE: "",
    OTEL_EXPORTER_OTLP_PROTOCOL: "http/protobuf",
    OTEL_EXPORTER_OTLP_TRACES_PROTOCOL: "http/protobuf",
    OTEL_EXPORTER_OTLP_METRICS_PROTOCOL: "http/protobuf",
    OTEL_EXPORTER_OTLP_LOGS_PROTOCOL: "http/protobuf",
    OTEL_EXPORTER_OTLP_METRICS_TEMPORALITY_PREFERENCE: "cumulative",
    OTEL_SEMCONV_STABILITY_OPT_IN: []
  };
  function parseBoolean(key, environment, values) {
    if (typeof values[key] === "undefined") {
      return;
    }
    var value = String(values[key]);
    environment[key] = value.toLowerCase() === "true";
  }
  function parseNumber(name, environment, values, min, max) {
    if (min === void 0) {
      min = -Infinity;
    }
    if (max === void 0) {
      max = Infinity;
    }
    if (typeof values[name] !== "undefined") {
      var value = Number(values[name]);
      if (!isNaN(value)) {
        if (value < min) {
          environment[name] = min;
        } else if (value > max) {
          environment[name] = max;
        } else {
          environment[name] = value;
        }
      }
    }
  }
  function parseStringList(name, output, input, separator) {
    if (separator === void 0) {
      separator = DEFAULT_LIST_SEPARATOR;
    }
    var givenValue = input[name];
    if (typeof givenValue === "string") {
      output[name] = givenValue.split(separator).map(function(v) {
        return v.trim();
      });
    }
  }
  var logLevelMap = {
    ALL: DiagLogLevel.ALL,
    VERBOSE: DiagLogLevel.VERBOSE,
    DEBUG: DiagLogLevel.DEBUG,
    INFO: DiagLogLevel.INFO,
    WARN: DiagLogLevel.WARN,
    ERROR: DiagLogLevel.ERROR,
    NONE: DiagLogLevel.NONE
  };
  function setLogLevelFromEnv(key, environment, values) {
    var value = values[key];
    if (typeof value === "string") {
      var theLevel = logLevelMap[value.toUpperCase()];
      if (theLevel != null) {
        environment[key] = theLevel;
      }
    }
  }
  function parseEnvironment(values) {
    var environment = {};
    for (var env in DEFAULT_ENVIRONMENT) {
      var key = env;
      switch (key) {
        case "OTEL_LOG_LEVEL":
          setLogLevelFromEnv(key, environment, values);
          break;
        default:
          if (isEnvVarABoolean(key)) {
            parseBoolean(key, environment, values);
          } else if (isEnvVarANumber(key)) {
            parseNumber(key, environment, values);
          } else if (isEnvVarAList(key)) {
            parseStringList(key, environment, values);
          } else {
            var value = values[key];
            if (typeof value !== "undefined" && value !== null) {
              environment[key] = String(value);
            }
          }
      }
    }
    return environment;
  }

  // node_modules/@opentelemetry/core/build/esm/platform/browser/globalThis.js
  var _globalThis2 = typeof globalThis === "object" ? globalThis : typeof self === "object" ? self : typeof window === "object" ? window : typeof global === "object" ? global : {};

  // node_modules/@opentelemetry/core/build/esm/platform/browser/environment.js
  function getEnv() {
    var globalEnv = parseEnvironment(_globalThis2);
    return Object.assign({}, DEFAULT_ENVIRONMENT, globalEnv);
  }
  function getEnvWithoutDefaults() {
    return parseEnvironment(_globalThis2);
  }

  // node_modules/@opentelemetry/core/build/esm/platform/browser/performance.js
  var otperformance = performance;

  // node_modules/@opentelemetry/core/build/esm/version.js
  var VERSION2 = "1.30.1";

  // node_modules/@opentelemetry/core/node_modules/@opentelemetry/semantic-conventions/build/esm/resource/SemanticResourceAttributes.js
  var TMP_PROCESS_RUNTIME_NAME = "process.runtime.name";
  var TMP_TELEMETRY_SDK_NAME = "telemetry.sdk.name";
  var TMP_TELEMETRY_SDK_LANGUAGE = "telemetry.sdk.language";
  var TMP_TELEMETRY_SDK_VERSION = "telemetry.sdk.version";
  var SEMRESATTRS_PROCESS_RUNTIME_NAME = TMP_PROCESS_RUNTIME_NAME;
  var SEMRESATTRS_TELEMETRY_SDK_NAME = TMP_TELEMETRY_SDK_NAME;
  var SEMRESATTRS_TELEMETRY_SDK_LANGUAGE = TMP_TELEMETRY_SDK_LANGUAGE;
  var SEMRESATTRS_TELEMETRY_SDK_VERSION = TMP_TELEMETRY_SDK_VERSION;
  var TMP_TELEMETRYSDKLANGUAGEVALUES_WEBJS = "webjs";
  var TELEMETRYSDKLANGUAGEVALUES_WEBJS = TMP_TELEMETRYSDKLANGUAGEVALUES_WEBJS;

  // node_modules/@opentelemetry/core/build/esm/platform/browser/sdk-info.js
  var _a;
  var SDK_INFO = (_a = {}, _a[SEMRESATTRS_TELEMETRY_SDK_NAME] = "opentelemetry", _a[SEMRESATTRS_PROCESS_RUNTIME_NAME] = "browser", _a[SEMRESATTRS_TELEMETRY_SDK_LANGUAGE] = TELEMETRYSDKLANGUAGEVALUES_WEBJS, _a[SEMRESATTRS_TELEMETRY_SDK_VERSION] = VERSION2, _a);

  // node_modules/@opentelemetry/core/build/esm/platform/browser/timer-util.js
  function unrefTimer(_timer) {
  }

  // node_modules/@opentelemetry/core/build/esm/common/time.js
  var NANOSECOND_DIGITS = 9;
  var NANOSECOND_DIGITS_IN_MILLIS = 6;
  var MILLISECONDS_TO_NANOSECONDS = Math.pow(10, NANOSECOND_DIGITS_IN_MILLIS);
  var SECOND_TO_NANOSECONDS = Math.pow(10, NANOSECOND_DIGITS);
  function millisToHrTime(epochMillis) {
    var epochSeconds = epochMillis / 1e3;
    var seconds = Math.trunc(epochSeconds);
    var nanos = Math.round(epochMillis % 1e3 * MILLISECONDS_TO_NANOSECONDS);
    return [seconds, nanos];
  }
  function getTimeOrigin() {
    var timeOrigin = otperformance.timeOrigin;
    if (typeof timeOrigin !== "number") {
      var perf = otperformance;
      timeOrigin = perf.timing && perf.timing.fetchStart;
    }
    return timeOrigin;
  }
  function hrTime(performanceNow) {
    var timeOrigin = millisToHrTime(getTimeOrigin());
    var now = millisToHrTime(typeof performanceNow === "number" ? performanceNow : otperformance.now());
    return addHrTimes(timeOrigin, now);
  }
  function hrTimeDuration(startTime, endTime) {
    var seconds = endTime[0] - startTime[0];
    var nanos = endTime[1] - startTime[1];
    if (nanos < 0) {
      seconds -= 1;
      nanos += SECOND_TO_NANOSECONDS;
    }
    return [seconds, nanos];
  }
  function hrTimeToMicroseconds(time) {
    return time[0] * 1e6 + time[1] / 1e3;
  }
  function isTimeInputHrTime(value) {
    return Array.isArray(value) && value.length === 2 && typeof value[0] === "number" && typeof value[1] === "number";
  }
  function isTimeInput(value) {
    return isTimeInputHrTime(value) || typeof value === "number" || value instanceof Date;
  }
  function addHrTimes(time1, time2) {
    var out = [time1[0] + time2[0], time1[1] + time2[1]];
    if (out[1] >= SECOND_TO_NANOSECONDS) {
      out[1] -= SECOND_TO_NANOSECONDS;
      out[0] += 1;
    }
    return out;
  }

  // node_modules/@opentelemetry/core/build/esm/ExportResult.js
  var ExportResultCode;
  (function(ExportResultCode3) {
    ExportResultCode3[ExportResultCode3["SUCCESS"] = 0] = "SUCCESS";
    ExportResultCode3[ExportResultCode3["FAILED"] = 1] = "FAILED";
  })(ExportResultCode || (ExportResultCode = {}));

  // node_modules/@opentelemetry/core/build/esm/propagation/composite.js
  var __values3 = function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
      next: function() {
        if (o && i >= o.length) o = void 0;
        return { value: o && o[i++], done: !o };
      }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
  };
  var CompositePropagator = (
    /** @class */
    function() {
      function CompositePropagator2(config2) {
        if (config2 === void 0) {
          config2 = {};
        }
        var _a3;
        this._propagators = (_a3 = config2.propagators) !== null && _a3 !== void 0 ? _a3 : [];
        this._fields = Array.from(new Set(this._propagators.map(function(p) {
          return typeof p.fields === "function" ? p.fields() : [];
        }).reduce(function(x, y) {
          return x.concat(y);
        }, [])));
      }
      CompositePropagator2.prototype.inject = function(context2, carrier, setter) {
        var e_1, _a3;
        try {
          for (var _b = __values3(this._propagators), _c = _b.next(); !_c.done; _c = _b.next()) {
            var propagator = _c.value;
            try {
              propagator.inject(context2, carrier, setter);
            } catch (err) {
              diag2.warn("Failed to inject with " + propagator.constructor.name + ". Err: " + err.message);
            }
          }
        } catch (e_1_1) {
          e_1 = { error: e_1_1 };
        } finally {
          try {
            if (_c && !_c.done && (_a3 = _b.return)) _a3.call(_b);
          } finally {
            if (e_1) throw e_1.error;
          }
        }
      };
      CompositePropagator2.prototype.extract = function(context2, carrier, getter) {
        return this._propagators.reduce(function(ctx, propagator) {
          try {
            return propagator.extract(ctx, carrier, getter);
          } catch (err) {
            diag2.warn("Failed to extract with " + propagator.constructor.name + ". Err: " + err.message);
          }
          return ctx;
        }, context2);
      };
      CompositePropagator2.prototype.fields = function() {
        return this._fields.slice();
      };
      return CompositePropagator2;
    }()
  );

  // node_modules/@opentelemetry/core/build/esm/internal/validators.js
  var VALID_KEY_CHAR_RANGE = "[_0-9a-z-*/]";
  var VALID_KEY = "[a-z]" + VALID_KEY_CHAR_RANGE + "{0,255}";
  var VALID_VENDOR_KEY = "[a-z0-9]" + VALID_KEY_CHAR_RANGE + "{0,240}@[a-z]" + VALID_KEY_CHAR_RANGE + "{0,13}";
  var VALID_KEY_REGEX = new RegExp("^(?:" + VALID_KEY + "|" + VALID_VENDOR_KEY + ")$");
  var VALID_VALUE_BASE_REGEX = /^[ -~]{0,255}[!-~]$/;
  var INVALID_VALUE_COMMA_EQUAL_REGEX = /,|=/;
  function validateKey(key) {
    return VALID_KEY_REGEX.test(key);
  }
  function validateValue(value) {
    return VALID_VALUE_BASE_REGEX.test(value) && !INVALID_VALUE_COMMA_EQUAL_REGEX.test(value);
  }

  // node_modules/@opentelemetry/core/build/esm/trace/TraceState.js
  var MAX_TRACE_STATE_ITEMS = 32;
  var MAX_TRACE_STATE_LEN = 512;
  var LIST_MEMBERS_SEPARATOR = ",";
  var LIST_MEMBER_KEY_VALUE_SPLITTER = "=";
  var TraceState = (
    /** @class */
    function() {
      function TraceState2(rawTraceState) {
        this._internalState = /* @__PURE__ */ new Map();
        if (rawTraceState)
          this._parse(rawTraceState);
      }
      TraceState2.prototype.set = function(key, value) {
        var traceState = this._clone();
        if (traceState._internalState.has(key)) {
          traceState._internalState.delete(key);
        }
        traceState._internalState.set(key, value);
        return traceState;
      };
      TraceState2.prototype.unset = function(key) {
        var traceState = this._clone();
        traceState._internalState.delete(key);
        return traceState;
      };
      TraceState2.prototype.get = function(key) {
        return this._internalState.get(key);
      };
      TraceState2.prototype.serialize = function() {
        var _this = this;
        return this._keys().reduce(function(agg, key) {
          agg.push(key + LIST_MEMBER_KEY_VALUE_SPLITTER + _this.get(key));
          return agg;
        }, []).join(LIST_MEMBERS_SEPARATOR);
      };
      TraceState2.prototype._parse = function(rawTraceState) {
        if (rawTraceState.length > MAX_TRACE_STATE_LEN)
          return;
        this._internalState = rawTraceState.split(LIST_MEMBERS_SEPARATOR).reverse().reduce(function(agg, part) {
          var listMember = part.trim();
          var i = listMember.indexOf(LIST_MEMBER_KEY_VALUE_SPLITTER);
          if (i !== -1) {
            var key = listMember.slice(0, i);
            var value = listMember.slice(i + 1, part.length);
            if (validateKey(key) && validateValue(value)) {
              agg.set(key, value);
            } else {
            }
          }
          return agg;
        }, /* @__PURE__ */ new Map());
        if (this._internalState.size > MAX_TRACE_STATE_ITEMS) {
          this._internalState = new Map(Array.from(this._internalState.entries()).reverse().slice(0, MAX_TRACE_STATE_ITEMS));
        }
      };
      TraceState2.prototype._keys = function() {
        return Array.from(this._internalState.keys()).reverse();
      };
      TraceState2.prototype._clone = function() {
        var traceState = new TraceState2();
        traceState._internalState = new Map(this._internalState);
        return traceState;
      };
      return TraceState2;
    }()
  );

  // node_modules/@opentelemetry/core/build/esm/trace/W3CTraceContextPropagator.js
  var TRACE_PARENT_HEADER = "traceparent";
  var TRACE_STATE_HEADER = "tracestate";
  var VERSION3 = "00";
  var VERSION_PART = "(?!ff)[\\da-f]{2}";
  var TRACE_ID_PART = "(?![0]{32})[\\da-f]{32}";
  var PARENT_ID_PART = "(?![0]{16})[\\da-f]{16}";
  var FLAGS_PART = "[\\da-f]{2}";
  var TRACE_PARENT_REGEX = new RegExp("^\\s?(" + VERSION_PART + ")-(" + TRACE_ID_PART + ")-(" + PARENT_ID_PART + ")-(" + FLAGS_PART + ")(-.*)?\\s?$");
  function parseTraceParent(traceParent) {
    var match = TRACE_PARENT_REGEX.exec(traceParent);
    if (!match)
      return null;
    if (match[1] === "00" && match[5])
      return null;
    return {
      traceId: match[2],
      spanId: match[3],
      traceFlags: parseInt(match[4], 16)
    };
  }
  var W3CTraceContextPropagator = (
    /** @class */
    function() {
      function W3CTraceContextPropagator2() {
      }
      W3CTraceContextPropagator2.prototype.inject = function(context2, carrier, setter) {
        var spanContext = trace.getSpanContext(context2);
        if (!spanContext || isTracingSuppressed(context2) || !isSpanContextValid(spanContext))
          return;
        var traceParent = VERSION3 + "-" + spanContext.traceId + "-" + spanContext.spanId + "-0" + Number(spanContext.traceFlags || TraceFlags.NONE).toString(16);
        setter.set(carrier, TRACE_PARENT_HEADER, traceParent);
        if (spanContext.traceState) {
          setter.set(carrier, TRACE_STATE_HEADER, spanContext.traceState.serialize());
        }
      };
      W3CTraceContextPropagator2.prototype.extract = function(context2, carrier, getter) {
        var traceParentHeader = getter.get(carrier, TRACE_PARENT_HEADER);
        if (!traceParentHeader)
          return context2;
        var traceParent = Array.isArray(traceParentHeader) ? traceParentHeader[0] : traceParentHeader;
        if (typeof traceParent !== "string")
          return context2;
        var spanContext = parseTraceParent(traceParent);
        if (!spanContext)
          return context2;
        spanContext.isRemote = true;
        var traceStateHeader = getter.get(carrier, TRACE_STATE_HEADER);
        if (traceStateHeader) {
          var state = Array.isArray(traceStateHeader) ? traceStateHeader.join(",") : traceStateHeader;
          spanContext.traceState = new TraceState(typeof state === "string" ? state : void 0);
        }
        return trace.setSpanContext(context2, spanContext);
      };
      W3CTraceContextPropagator2.prototype.fields = function() {
        return [TRACE_PARENT_HEADER, TRACE_STATE_HEADER];
      };
      return W3CTraceContextPropagator2;
    }()
  );

  // node_modules/@opentelemetry/core/build/esm/utils/lodash.merge.js
  var objectTag = "[object Object]";
  var nullTag = "[object Null]";
  var undefinedTag = "[object Undefined]";
  var funcProto = Function.prototype;
  var funcToString = funcProto.toString;
  var objectCtorString = funcToString.call(Object);
  var getPrototype = overArg(Object.getPrototypeOf, Object);
  var objectProto = Object.prototype;
  var hasOwnProperty = objectProto.hasOwnProperty;
  var symToStringTag = Symbol ? Symbol.toStringTag : void 0;
  var nativeObjectToString = objectProto.toString;
  function overArg(func, transform) {
    return function(arg) {
      return func(transform(arg));
    };
  }
  function isPlainObject(value) {
    if (!isObjectLike(value) || baseGetTag(value) !== objectTag) {
      return false;
    }
    var proto = getPrototype(value);
    if (proto === null) {
      return true;
    }
    var Ctor = hasOwnProperty.call(proto, "constructor") && proto.constructor;
    return typeof Ctor == "function" && Ctor instanceof Ctor && funcToString.call(Ctor) === objectCtorString;
  }
  function isObjectLike(value) {
    return value != null && typeof value == "object";
  }
  function baseGetTag(value) {
    if (value == null) {
      return value === void 0 ? undefinedTag : nullTag;
    }
    return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
  }
  function getRawTag(value) {
    var isOwn = hasOwnProperty.call(value, symToStringTag), tag = value[symToStringTag];
    var unmasked = false;
    try {
      value[symToStringTag] = void 0;
      unmasked = true;
    } catch (e) {
    }
    var result = nativeObjectToString.call(value);
    if (unmasked) {
      if (isOwn) {
        value[symToStringTag] = tag;
      } else {
        delete value[symToStringTag];
      }
    }
    return result;
  }
  function objectToString(value) {
    return nativeObjectToString.call(value);
  }

  // node_modules/@opentelemetry/core/build/esm/utils/merge.js
  var MAX_LEVEL = 20;
  function merge() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }
    var result = args.shift();
    var objects = /* @__PURE__ */ new WeakMap();
    while (args.length > 0) {
      result = mergeTwoObjects(result, args.shift(), 0, objects);
    }
    return result;
  }
  function takeValue(value) {
    if (isArray(value)) {
      return value.slice();
    }
    return value;
  }
  function mergeTwoObjects(one, two, level, objects) {
    if (level === void 0) {
      level = 0;
    }
    var result;
    if (level > MAX_LEVEL) {
      return void 0;
    }
    level++;
    if (isPrimitive(one) || isPrimitive(two) || isFunction(two)) {
      result = takeValue(two);
    } else if (isArray(one)) {
      result = one.slice();
      if (isArray(two)) {
        for (var i = 0, j = two.length; i < j; i++) {
          result.push(takeValue(two[i]));
        }
      } else if (isObject(two)) {
        var keys = Object.keys(two);
        for (var i = 0, j = keys.length; i < j; i++) {
          var key = keys[i];
          result[key] = takeValue(two[key]);
        }
      }
    } else if (isObject(one)) {
      if (isObject(two)) {
        if (!shouldMerge(one, two)) {
          return two;
        }
        result = Object.assign({}, one);
        var keys = Object.keys(two);
        for (var i = 0, j = keys.length; i < j; i++) {
          var key = keys[i];
          var twoValue = two[key];
          if (isPrimitive(twoValue)) {
            if (typeof twoValue === "undefined") {
              delete result[key];
            } else {
              result[key] = twoValue;
            }
          } else {
            var obj1 = result[key];
            var obj2 = twoValue;
            if (wasObjectReferenced(one, key, objects) || wasObjectReferenced(two, key, objects)) {
              delete result[key];
            } else {
              if (isObject(obj1) && isObject(obj2)) {
                var arr1 = objects.get(obj1) || [];
                var arr2 = objects.get(obj2) || [];
                arr1.push({ obj: one, key });
                arr2.push({ obj: two, key });
                objects.set(obj1, arr1);
                objects.set(obj2, arr2);
              }
              result[key] = mergeTwoObjects(result[key], twoValue, level, objects);
            }
          }
        }
      } else {
        result = two;
      }
    }
    return result;
  }
  function wasObjectReferenced(obj, key, objects) {
    var arr = objects.get(obj[key]) || [];
    for (var i = 0, j = arr.length; i < j; i++) {
      var info = arr[i];
      if (info.key === key && info.obj === obj) {
        return true;
      }
    }
    return false;
  }
  function isArray(value) {
    return Array.isArray(value);
  }
  function isFunction(value) {
    return typeof value === "function";
  }
  function isObject(value) {
    return !isPrimitive(value) && !isArray(value) && !isFunction(value) && typeof value === "object";
  }
  function isPrimitive(value) {
    return typeof value === "string" || typeof value === "number" || typeof value === "boolean" || typeof value === "undefined" || value instanceof Date || value instanceof RegExp || value === null;
  }
  function shouldMerge(one, two) {
    if (!isPlainObject(one) || !isPlainObject(two)) {
      return false;
    }
    return true;
  }

  // node_modules/@opentelemetry/core/build/esm/utils/promise.js
  var Deferred = (
    /** @class */
    function() {
      function Deferred2() {
        var _this = this;
        this._promise = new Promise(function(resolve, reject) {
          _this._resolve = resolve;
          _this._reject = reject;
        });
      }
      Object.defineProperty(Deferred2.prototype, "promise", {
        get: function() {
          return this._promise;
        },
        enumerable: false,
        configurable: true
      });
      Deferred2.prototype.resolve = function(val) {
        this._resolve(val);
      };
      Deferred2.prototype.reject = function(err) {
        this._reject(err);
      };
      return Deferred2;
    }()
  );

  // node_modules/@opentelemetry/core/build/esm/utils/callback.js
  var __read8 = function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    } catch (error) {
      e = { error };
    } finally {
      try {
        if (r && !r.done && (m = i["return"])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }
    return ar;
  };
  var __spreadArray5 = function(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
      if (ar || !(i in from)) {
        if (!ar) ar = Array.prototype.slice.call(from, 0, i);
        ar[i] = from[i];
      }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
  var BindOnceFuture = (
    /** @class */
    function() {
      function BindOnceFuture2(_callback, _that) {
        this._callback = _callback;
        this._that = _that;
        this._isCalled = false;
        this._deferred = new Deferred();
      }
      Object.defineProperty(BindOnceFuture2.prototype, "isCalled", {
        get: function() {
          return this._isCalled;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(BindOnceFuture2.prototype, "promise", {
        get: function() {
          return this._deferred.promise;
        },
        enumerable: false,
        configurable: true
      });
      BindOnceFuture2.prototype.call = function() {
        var _a3;
        var _this = this;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }
        if (!this._isCalled) {
          this._isCalled = true;
          try {
            Promise.resolve((_a3 = this._callback).call.apply(_a3, __spreadArray5([this._that], __read8(args), false))).then(function(val) {
              return _this._deferred.resolve(val);
            }, function(err) {
              return _this._deferred.reject(err);
            });
          } catch (err) {
            this._deferred.reject(err);
          }
        }
        return this._deferred.promise;
      };
      return BindOnceFuture2;
    }()
  );

  // node_modules/@opentelemetry/core/build/esm/internal/exporter.js
  function _export(exporter, arg) {
    return new Promise(function(resolve) {
      context.with(suppressTracing(context.active()), function() {
        exporter.export(arg, function(result) {
          resolve(result);
        });
      });
    });
  }

  // node_modules/@opentelemetry/core/build/esm/index.js
  var internal = {
    _export
  };

  // node_modules/@opentelemetry/sdk-trace-base/node_modules/@opentelemetry/semantic-conventions/build/esm/trace/SemanticAttributes.js
  var TMP_EXCEPTION_TYPE = "exception.type";
  var TMP_EXCEPTION_MESSAGE = "exception.message";
  var TMP_EXCEPTION_STACKTRACE = "exception.stacktrace";
  var SEMATTRS_EXCEPTION_TYPE = TMP_EXCEPTION_TYPE;
  var SEMATTRS_EXCEPTION_MESSAGE = TMP_EXCEPTION_MESSAGE;
  var SEMATTRS_EXCEPTION_STACKTRACE = TMP_EXCEPTION_STACKTRACE;

  // node_modules/@opentelemetry/sdk-trace-base/build/esm/enums.js
  var ExceptionEventName = "exception";

  // node_modules/@opentelemetry/sdk-trace-base/build/esm/Span.js
  var __assign = function() {
    __assign = Object.assign || function(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
          t[p] = s[p];
      }
      return t;
    };
    return __assign.apply(this, arguments);
  };
  var __values4 = function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
      next: function() {
        if (o && i >= o.length) o = void 0;
        return { value: o && o[i++], done: !o };
      }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
  };
  var __read9 = function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    } catch (error) {
      e = { error };
    } finally {
      try {
        if (r && !r.done && (m = i["return"])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }
    return ar;
  };
  var __spreadArray6 = function(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
      if (ar || !(i in from)) {
        if (!ar) ar = Array.prototype.slice.call(from, 0, i);
        ar[i] = from[i];
      }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
  var Span = (
    /** @class */
    function() {
      function Span2(parentTracer, context2, spanName, spanContext, kind, parentSpanId, links, startTime, _deprecatedClock, attributes) {
        if (links === void 0) {
          links = [];
        }
        this.attributes = {};
        this.links = [];
        this.events = [];
        this._droppedAttributesCount = 0;
        this._droppedEventsCount = 0;
        this._droppedLinksCount = 0;
        this.status = {
          code: SpanStatusCode.UNSET
        };
        this.endTime = [0, 0];
        this._ended = false;
        this._duration = [-1, -1];
        this.name = spanName;
        this._spanContext = spanContext;
        this.parentSpanId = parentSpanId;
        this.kind = kind;
        this.links = links;
        var now = Date.now();
        this._performanceStartTime = otperformance.now();
        this._performanceOffset = now - (this._performanceStartTime + getTimeOrigin());
        this._startTimeProvided = startTime != null;
        this.startTime = this._getTime(startTime !== null && startTime !== void 0 ? startTime : now);
        this.resource = parentTracer.resource;
        this.instrumentationLibrary = parentTracer.instrumentationLibrary;
        this._spanLimits = parentTracer.getSpanLimits();
        this._attributeValueLengthLimit = this._spanLimits.attributeValueLengthLimit || 0;
        if (attributes != null) {
          this.setAttributes(attributes);
        }
        this._spanProcessor = parentTracer.getActiveSpanProcessor();
        this._spanProcessor.onStart(this, context2);
      }
      Span2.prototype.spanContext = function() {
        return this._spanContext;
      };
      Span2.prototype.setAttribute = function(key, value) {
        if (value == null || this._isSpanEnded())
          return this;
        if (key.length === 0) {
          diag2.warn("Invalid attribute key: " + key);
          return this;
        }
        if (!isAttributeValue(value)) {
          diag2.warn("Invalid attribute value set for key: " + key);
          return this;
        }
        if (Object.keys(this.attributes).length >= this._spanLimits.attributeCountLimit && !Object.prototype.hasOwnProperty.call(this.attributes, key)) {
          this._droppedAttributesCount++;
          return this;
        }
        this.attributes[key] = this._truncateToSize(value);
        return this;
      };
      Span2.prototype.setAttributes = function(attributes) {
        var e_1, _a3;
        try {
          for (var _b = __values4(Object.entries(attributes)), _c = _b.next(); !_c.done; _c = _b.next()) {
            var _d = __read9(_c.value, 2), k = _d[0], v = _d[1];
            this.setAttribute(k, v);
          }
        } catch (e_1_1) {
          e_1 = { error: e_1_1 };
        } finally {
          try {
            if (_c && !_c.done && (_a3 = _b.return)) _a3.call(_b);
          } finally {
            if (e_1) throw e_1.error;
          }
        }
        return this;
      };
      Span2.prototype.addEvent = function(name, attributesOrStartTime, timeStamp) {
        if (this._isSpanEnded())
          return this;
        if (this._spanLimits.eventCountLimit === 0) {
          diag2.warn("No events allowed.");
          this._droppedEventsCount++;
          return this;
        }
        if (this.events.length >= this._spanLimits.eventCountLimit) {
          if (this._droppedEventsCount === 0) {
            diag2.debug("Dropping extra events.");
          }
          this.events.shift();
          this._droppedEventsCount++;
        }
        if (isTimeInput(attributesOrStartTime)) {
          if (!isTimeInput(timeStamp)) {
            timeStamp = attributesOrStartTime;
          }
          attributesOrStartTime = void 0;
        }
        var attributes = sanitizeAttributes(attributesOrStartTime);
        this.events.push({
          name,
          attributes,
          time: this._getTime(timeStamp),
          droppedAttributesCount: 0
        });
        return this;
      };
      Span2.prototype.addLink = function(link) {
        this.links.push(link);
        return this;
      };
      Span2.prototype.addLinks = function(links) {
        var _a3;
        (_a3 = this.links).push.apply(_a3, __spreadArray6([], __read9(links), false));
        return this;
      };
      Span2.prototype.setStatus = function(status) {
        if (this._isSpanEnded())
          return this;
        this.status = __assign({}, status);
        if (this.status.message != null && typeof status.message !== "string") {
          diag2.warn("Dropping invalid status.message of type '" + typeof status.message + "', expected 'string'");
          delete this.status.message;
        }
        return this;
      };
      Span2.prototype.updateName = function(name) {
        if (this._isSpanEnded())
          return this;
        this.name = name;
        return this;
      };
      Span2.prototype.end = function(endTime) {
        if (this._isSpanEnded()) {
          diag2.error(this.name + " " + this._spanContext.traceId + "-" + this._spanContext.spanId + " - You can only call end() on a span once.");
          return;
        }
        this._ended = true;
        this.endTime = this._getTime(endTime);
        this._duration = hrTimeDuration(this.startTime, this.endTime);
        if (this._duration[0] < 0) {
          diag2.warn("Inconsistent start and end time, startTime > endTime. Setting span duration to 0ms.", this.startTime, this.endTime);
          this.endTime = this.startTime.slice();
          this._duration = [0, 0];
        }
        if (this._droppedEventsCount > 0) {
          diag2.warn("Dropped " + this._droppedEventsCount + " events because eventCountLimit reached");
        }
        this._spanProcessor.onEnd(this);
      };
      Span2.prototype._getTime = function(inp) {
        if (typeof inp === "number" && inp <= otperformance.now()) {
          return hrTime(inp + this._performanceOffset);
        }
        if (typeof inp === "number") {
          return millisToHrTime(inp);
        }
        if (inp instanceof Date) {
          return millisToHrTime(inp.getTime());
        }
        if (isTimeInputHrTime(inp)) {
          return inp;
        }
        if (this._startTimeProvided) {
          return millisToHrTime(Date.now());
        }
        var msDuration = otperformance.now() - this._performanceStartTime;
        return addHrTimes(this.startTime, millisToHrTime(msDuration));
      };
      Span2.prototype.isRecording = function() {
        return this._ended === false;
      };
      Span2.prototype.recordException = function(exception, time) {
        var attributes = {};
        if (typeof exception === "string") {
          attributes[SEMATTRS_EXCEPTION_MESSAGE] = exception;
        } else if (exception) {
          if (exception.code) {
            attributes[SEMATTRS_EXCEPTION_TYPE] = exception.code.toString();
          } else if (exception.name) {
            attributes[SEMATTRS_EXCEPTION_TYPE] = exception.name;
          }
          if (exception.message) {
            attributes[SEMATTRS_EXCEPTION_MESSAGE] = exception.message;
          }
          if (exception.stack) {
            attributes[SEMATTRS_EXCEPTION_STACKTRACE] = exception.stack;
          }
        }
        if (attributes[SEMATTRS_EXCEPTION_TYPE] || attributes[SEMATTRS_EXCEPTION_MESSAGE]) {
          this.addEvent(ExceptionEventName, attributes, time);
        } else {
          diag2.warn("Failed to record an exception " + exception);
        }
      };
      Object.defineProperty(Span2.prototype, "duration", {
        get: function() {
          return this._duration;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(Span2.prototype, "ended", {
        get: function() {
          return this._ended;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(Span2.prototype, "droppedAttributesCount", {
        get: function() {
          return this._droppedAttributesCount;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(Span2.prototype, "droppedEventsCount", {
        get: function() {
          return this._droppedEventsCount;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(Span2.prototype, "droppedLinksCount", {
        get: function() {
          return this._droppedLinksCount;
        },
        enumerable: false,
        configurable: true
      });
      Span2.prototype._isSpanEnded = function() {
        if (this._ended) {
          diag2.warn("Can not execute the operation on ended Span {traceId: " + this._spanContext.traceId + ", spanId: " + this._spanContext.spanId + "}");
        }
        return this._ended;
      };
      Span2.prototype._truncateToLimitUtil = function(value, limit) {
        if (value.length <= limit) {
          return value;
        }
        return value.substring(0, limit);
      };
      Span2.prototype._truncateToSize = function(value) {
        var _this = this;
        var limit = this._attributeValueLengthLimit;
        if (limit <= 0) {
          diag2.warn("Attribute value limit must be positive, got " + limit);
          return value;
        }
        if (typeof value === "string") {
          return this._truncateToLimitUtil(value, limit);
        }
        if (Array.isArray(value)) {
          return value.map(function(val) {
            return typeof val === "string" ? _this._truncateToLimitUtil(val, limit) : val;
          });
        }
        return value;
      };
      return Span2;
    }()
  );

  // node_modules/@opentelemetry/sdk-trace-base/build/esm/Sampler.js
  var SamplingDecision2;
  (function(SamplingDecision3) {
    SamplingDecision3[SamplingDecision3["NOT_RECORD"] = 0] = "NOT_RECORD";
    SamplingDecision3[SamplingDecision3["RECORD"] = 1] = "RECORD";
    SamplingDecision3[SamplingDecision3["RECORD_AND_SAMPLED"] = 2] = "RECORD_AND_SAMPLED";
  })(SamplingDecision2 || (SamplingDecision2 = {}));

  // node_modules/@opentelemetry/sdk-trace-base/build/esm/sampler/AlwaysOffSampler.js
  var AlwaysOffSampler = (
    /** @class */
    function() {
      function AlwaysOffSampler2() {
      }
      AlwaysOffSampler2.prototype.shouldSample = function() {
        return {
          decision: SamplingDecision2.NOT_RECORD
        };
      };
      AlwaysOffSampler2.prototype.toString = function() {
        return "AlwaysOffSampler";
      };
      return AlwaysOffSampler2;
    }()
  );

  // node_modules/@opentelemetry/sdk-trace-base/build/esm/sampler/AlwaysOnSampler.js
  var AlwaysOnSampler = (
    /** @class */
    function() {
      function AlwaysOnSampler2() {
      }
      AlwaysOnSampler2.prototype.shouldSample = function() {
        return {
          decision: SamplingDecision2.RECORD_AND_SAMPLED
        };
      };
      AlwaysOnSampler2.prototype.toString = function() {
        return "AlwaysOnSampler";
      };
      return AlwaysOnSampler2;
    }()
  );

  // node_modules/@opentelemetry/sdk-trace-base/build/esm/sampler/ParentBasedSampler.js
  var ParentBasedSampler = (
    /** @class */
    function() {
      function ParentBasedSampler2(config2) {
        var _a3, _b, _c, _d;
        this._root = config2.root;
        if (!this._root) {
          globalErrorHandler(new Error("ParentBasedSampler must have a root sampler configured"));
          this._root = new AlwaysOnSampler();
        }
        this._remoteParentSampled = (_a3 = config2.remoteParentSampled) !== null && _a3 !== void 0 ? _a3 : new AlwaysOnSampler();
        this._remoteParentNotSampled = (_b = config2.remoteParentNotSampled) !== null && _b !== void 0 ? _b : new AlwaysOffSampler();
        this._localParentSampled = (_c = config2.localParentSampled) !== null && _c !== void 0 ? _c : new AlwaysOnSampler();
        this._localParentNotSampled = (_d = config2.localParentNotSampled) !== null && _d !== void 0 ? _d : new AlwaysOffSampler();
      }
      ParentBasedSampler2.prototype.shouldSample = function(context2, traceId, spanName, spanKind, attributes, links) {
        var parentContext = trace.getSpanContext(context2);
        if (!parentContext || !isSpanContextValid(parentContext)) {
          return this._root.shouldSample(context2, traceId, spanName, spanKind, attributes, links);
        }
        if (parentContext.isRemote) {
          if (parentContext.traceFlags & TraceFlags.SAMPLED) {
            return this._remoteParentSampled.shouldSample(context2, traceId, spanName, spanKind, attributes, links);
          }
          return this._remoteParentNotSampled.shouldSample(context2, traceId, spanName, spanKind, attributes, links);
        }
        if (parentContext.traceFlags & TraceFlags.SAMPLED) {
          return this._localParentSampled.shouldSample(context2, traceId, spanName, spanKind, attributes, links);
        }
        return this._localParentNotSampled.shouldSample(context2, traceId, spanName, spanKind, attributes, links);
      };
      ParentBasedSampler2.prototype.toString = function() {
        return "ParentBased{root=" + this._root.toString() + ", remoteParentSampled=" + this._remoteParentSampled.toString() + ", remoteParentNotSampled=" + this._remoteParentNotSampled.toString() + ", localParentSampled=" + this._localParentSampled.toString() + ", localParentNotSampled=" + this._localParentNotSampled.toString() + "}";
      };
      return ParentBasedSampler2;
    }()
  );

  // node_modules/@opentelemetry/sdk-trace-base/build/esm/sampler/TraceIdRatioBasedSampler.js
  var TraceIdRatioBasedSampler = (
    /** @class */
    function() {
      function TraceIdRatioBasedSampler2(_ratio) {
        if (_ratio === void 0) {
          _ratio = 0;
        }
        this._ratio = _ratio;
        this._ratio = this._normalize(_ratio);
        this._upperBound = Math.floor(this._ratio * 4294967295);
      }
      TraceIdRatioBasedSampler2.prototype.shouldSample = function(context2, traceId) {
        return {
          decision: isValidTraceId(traceId) && this._accumulate(traceId) < this._upperBound ? SamplingDecision2.RECORD_AND_SAMPLED : SamplingDecision2.NOT_RECORD
        };
      };
      TraceIdRatioBasedSampler2.prototype.toString = function() {
        return "TraceIdRatioBased{" + this._ratio + "}";
      };
      TraceIdRatioBasedSampler2.prototype._normalize = function(ratio) {
        if (typeof ratio !== "number" || isNaN(ratio))
          return 0;
        return ratio >= 1 ? 1 : ratio <= 0 ? 0 : ratio;
      };
      TraceIdRatioBasedSampler2.prototype._accumulate = function(traceId) {
        var accumulation = 0;
        for (var i = 0; i < traceId.length / 8; i++) {
          var pos = i * 8;
          var part = parseInt(traceId.slice(pos, pos + 8), 16);
          accumulation = (accumulation ^ part) >>> 0;
        }
        return accumulation;
      };
      return TraceIdRatioBasedSampler2;
    }()
  );

  // node_modules/@opentelemetry/sdk-trace-base/build/esm/config.js
  var FALLBACK_OTEL_TRACES_SAMPLER = TracesSamplerValues.AlwaysOn;
  var DEFAULT_RATIO = 1;
  function loadDefaultConfig() {
    var env = getEnv();
    return {
      sampler: buildSamplerFromEnv(env),
      forceFlushTimeoutMillis: 3e4,
      generalLimits: {
        attributeValueLengthLimit: env.OTEL_ATTRIBUTE_VALUE_LENGTH_LIMIT,
        attributeCountLimit: env.OTEL_ATTRIBUTE_COUNT_LIMIT
      },
      spanLimits: {
        attributeValueLengthLimit: env.OTEL_SPAN_ATTRIBUTE_VALUE_LENGTH_LIMIT,
        attributeCountLimit: env.OTEL_SPAN_ATTRIBUTE_COUNT_LIMIT,
        linkCountLimit: env.OTEL_SPAN_LINK_COUNT_LIMIT,
        eventCountLimit: env.OTEL_SPAN_EVENT_COUNT_LIMIT,
        attributePerEventCountLimit: env.OTEL_SPAN_ATTRIBUTE_PER_EVENT_COUNT_LIMIT,
        attributePerLinkCountLimit: env.OTEL_SPAN_ATTRIBUTE_PER_LINK_COUNT_LIMIT
      },
      mergeResourceWithDefaults: true
    };
  }
  function buildSamplerFromEnv(environment) {
    if (environment === void 0) {
      environment = getEnv();
    }
    switch (environment.OTEL_TRACES_SAMPLER) {
      case TracesSamplerValues.AlwaysOn:
        return new AlwaysOnSampler();
      case TracesSamplerValues.AlwaysOff:
        return new AlwaysOffSampler();
      case TracesSamplerValues.ParentBasedAlwaysOn:
        return new ParentBasedSampler({
          root: new AlwaysOnSampler()
        });
      case TracesSamplerValues.ParentBasedAlwaysOff:
        return new ParentBasedSampler({
          root: new AlwaysOffSampler()
        });
      case TracesSamplerValues.TraceIdRatio:
        return new TraceIdRatioBasedSampler(getSamplerProbabilityFromEnv(environment));
      case TracesSamplerValues.ParentBasedTraceIdRatio:
        return new ParentBasedSampler({
          root: new TraceIdRatioBasedSampler(getSamplerProbabilityFromEnv(environment))
        });
      default:
        diag2.error('OTEL_TRACES_SAMPLER value "' + environment.OTEL_TRACES_SAMPLER + " invalid, defaulting to " + FALLBACK_OTEL_TRACES_SAMPLER + '".');
        return new AlwaysOnSampler();
    }
  }
  function getSamplerProbabilityFromEnv(environment) {
    if (environment.OTEL_TRACES_SAMPLER_ARG === void 0 || environment.OTEL_TRACES_SAMPLER_ARG === "") {
      diag2.error("OTEL_TRACES_SAMPLER_ARG is blank, defaulting to " + DEFAULT_RATIO + ".");
      return DEFAULT_RATIO;
    }
    var probability = Number(environment.OTEL_TRACES_SAMPLER_ARG);
    if (isNaN(probability)) {
      diag2.error("OTEL_TRACES_SAMPLER_ARG=" + environment.OTEL_TRACES_SAMPLER_ARG + " was given, but it is invalid, defaulting to " + DEFAULT_RATIO + ".");
      return DEFAULT_RATIO;
    }
    if (probability < 0 || probability > 1) {
      diag2.error("OTEL_TRACES_SAMPLER_ARG=" + environment.OTEL_TRACES_SAMPLER_ARG + " was given, but it is out of range ([0..1]), defaulting to " + DEFAULT_RATIO + ".");
      return DEFAULT_RATIO;
    }
    return probability;
  }

  // node_modules/@opentelemetry/sdk-trace-base/build/esm/utility.js
  function mergeConfig(userConfig) {
    var perInstanceDefaults = {
      sampler: buildSamplerFromEnv()
    };
    var DEFAULT_CONFIG = loadDefaultConfig();
    var target = Object.assign({}, DEFAULT_CONFIG, perInstanceDefaults, userConfig);
    target.generalLimits = Object.assign({}, DEFAULT_CONFIG.generalLimits, userConfig.generalLimits || {});
    target.spanLimits = Object.assign({}, DEFAULT_CONFIG.spanLimits, userConfig.spanLimits || {});
    return target;
  }
  function reconfigureLimits(userConfig) {
    var _a3, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    var spanLimits = Object.assign({}, userConfig.spanLimits);
    var parsedEnvConfig = getEnvWithoutDefaults();
    spanLimits.attributeCountLimit = (_f = (_e = (_d = (_b = (_a3 = userConfig.spanLimits) === null || _a3 === void 0 ? void 0 : _a3.attributeCountLimit) !== null && _b !== void 0 ? _b : (_c = userConfig.generalLimits) === null || _c === void 0 ? void 0 : _c.attributeCountLimit) !== null && _d !== void 0 ? _d : parsedEnvConfig.OTEL_SPAN_ATTRIBUTE_COUNT_LIMIT) !== null && _e !== void 0 ? _e : parsedEnvConfig.OTEL_ATTRIBUTE_COUNT_LIMIT) !== null && _f !== void 0 ? _f : DEFAULT_ATTRIBUTE_COUNT_LIMIT;
    spanLimits.attributeValueLengthLimit = (_m = (_l = (_k = (_h = (_g = userConfig.spanLimits) === null || _g === void 0 ? void 0 : _g.attributeValueLengthLimit) !== null && _h !== void 0 ? _h : (_j = userConfig.generalLimits) === null || _j === void 0 ? void 0 : _j.attributeValueLengthLimit) !== null && _k !== void 0 ? _k : parsedEnvConfig.OTEL_SPAN_ATTRIBUTE_VALUE_LENGTH_LIMIT) !== null && _l !== void 0 ? _l : parsedEnvConfig.OTEL_ATTRIBUTE_VALUE_LENGTH_LIMIT) !== null && _m !== void 0 ? _m : DEFAULT_ATTRIBUTE_VALUE_LENGTH_LIMIT;
    return Object.assign({}, userConfig, { spanLimits });
  }

  // node_modules/@opentelemetry/sdk-trace-base/build/esm/export/BatchSpanProcessorBase.js
  var BatchSpanProcessorBase = (
    /** @class */
    function() {
      function BatchSpanProcessorBase2(_exporter, config2) {
        this._exporter = _exporter;
        this._isExporting = false;
        this._finishedSpans = [];
        this._droppedSpansCount = 0;
        var env = getEnv();
        this._maxExportBatchSize = typeof (config2 === null || config2 === void 0 ? void 0 : config2.maxExportBatchSize) === "number" ? config2.maxExportBatchSize : env.OTEL_BSP_MAX_EXPORT_BATCH_SIZE;
        this._maxQueueSize = typeof (config2 === null || config2 === void 0 ? void 0 : config2.maxQueueSize) === "number" ? config2.maxQueueSize : env.OTEL_BSP_MAX_QUEUE_SIZE;
        this._scheduledDelayMillis = typeof (config2 === null || config2 === void 0 ? void 0 : config2.scheduledDelayMillis) === "number" ? config2.scheduledDelayMillis : env.OTEL_BSP_SCHEDULE_DELAY;
        this._exportTimeoutMillis = typeof (config2 === null || config2 === void 0 ? void 0 : config2.exportTimeoutMillis) === "number" ? config2.exportTimeoutMillis : env.OTEL_BSP_EXPORT_TIMEOUT;
        this._shutdownOnce = new BindOnceFuture(this._shutdown, this);
        if (this._maxExportBatchSize > this._maxQueueSize) {
          diag2.warn("BatchSpanProcessor: maxExportBatchSize must be smaller or equal to maxQueueSize, setting maxExportBatchSize to match maxQueueSize");
          this._maxExportBatchSize = this._maxQueueSize;
        }
      }
      BatchSpanProcessorBase2.prototype.forceFlush = function() {
        if (this._shutdownOnce.isCalled) {
          return this._shutdownOnce.promise;
        }
        return this._flushAll();
      };
      BatchSpanProcessorBase2.prototype.onStart = function(_span, _parentContext) {
      };
      BatchSpanProcessorBase2.prototype.onEnd = function(span) {
        if (this._shutdownOnce.isCalled) {
          return;
        }
        if ((span.spanContext().traceFlags & TraceFlags.SAMPLED) === 0) {
          return;
        }
        this._addToBuffer(span);
      };
      BatchSpanProcessorBase2.prototype.shutdown = function() {
        return this._shutdownOnce.call();
      };
      BatchSpanProcessorBase2.prototype._shutdown = function() {
        var _this = this;
        return Promise.resolve().then(function() {
          return _this.onShutdown();
        }).then(function() {
          return _this._flushAll();
        }).then(function() {
          return _this._exporter.shutdown();
        });
      };
      BatchSpanProcessorBase2.prototype._addToBuffer = function(span) {
        if (this._finishedSpans.length >= this._maxQueueSize) {
          if (this._droppedSpansCount === 0) {
            diag2.debug("maxQueueSize reached, dropping spans");
          }
          this._droppedSpansCount++;
          return;
        }
        if (this._droppedSpansCount > 0) {
          diag2.warn("Dropped " + this._droppedSpansCount + " spans because maxQueueSize reached");
          this._droppedSpansCount = 0;
        }
        this._finishedSpans.push(span);
        this._maybeStartTimer();
      };
      BatchSpanProcessorBase2.prototype._flushAll = function() {
        var _this = this;
        return new Promise(function(resolve, reject) {
          var promises = [];
          var count = Math.ceil(_this._finishedSpans.length / _this._maxExportBatchSize);
          for (var i = 0, j = count; i < j; i++) {
            promises.push(_this._flushOneBatch());
          }
          Promise.all(promises).then(function() {
            resolve();
          }).catch(reject);
        });
      };
      BatchSpanProcessorBase2.prototype._flushOneBatch = function() {
        var _this = this;
        this._clearTimer();
        if (this._finishedSpans.length === 0) {
          return Promise.resolve();
        }
        return new Promise(function(resolve, reject) {
          var timer = setTimeout(function() {
            reject(new Error("Timeout"));
          }, _this._exportTimeoutMillis);
          context.with(suppressTracing(context.active()), function() {
            var spans;
            if (_this._finishedSpans.length <= _this._maxExportBatchSize) {
              spans = _this._finishedSpans;
              _this._finishedSpans = [];
            } else {
              spans = _this._finishedSpans.splice(0, _this._maxExportBatchSize);
            }
            var doExport = function() {
              return _this._exporter.export(spans, function(result) {
                var _a3;
                clearTimeout(timer);
                if (result.code === ExportResultCode.SUCCESS) {
                  resolve();
                } else {
                  reject((_a3 = result.error) !== null && _a3 !== void 0 ? _a3 : new Error("BatchSpanProcessor: span export failed"));
                }
              });
            };
            var pendingResources = null;
            for (var i = 0, len = spans.length; i < len; i++) {
              var span = spans[i];
              if (span.resource.asyncAttributesPending && span.resource.waitForAsyncAttributes) {
                pendingResources !== null && pendingResources !== void 0 ? pendingResources : pendingResources = [];
                pendingResources.push(span.resource.waitForAsyncAttributes());
              }
            }
            if (pendingResources === null) {
              doExport();
            } else {
              Promise.all(pendingResources).then(doExport, function(err) {
                globalErrorHandler(err);
                reject(err);
              });
            }
          });
        });
      };
      BatchSpanProcessorBase2.prototype._maybeStartTimer = function() {
        var _this = this;
        if (this._isExporting)
          return;
        var flush = function() {
          _this._isExporting = true;
          _this._flushOneBatch().finally(function() {
            _this._isExporting = false;
            if (_this._finishedSpans.length > 0) {
              _this._clearTimer();
              _this._maybeStartTimer();
            }
          }).catch(function(e) {
            _this._isExporting = false;
            globalErrorHandler(e);
          });
        };
        if (this._finishedSpans.length >= this._maxExportBatchSize) {
          return flush();
        }
        if (this._timer !== void 0)
          return;
        this._timer = setTimeout(function() {
          return flush();
        }, this._scheduledDelayMillis);
        unrefTimer(this._timer);
      };
      BatchSpanProcessorBase2.prototype._clearTimer = function() {
        if (this._timer !== void 0) {
          clearTimeout(this._timer);
          this._timer = void 0;
        }
      };
      return BatchSpanProcessorBase2;
    }()
  );

  // node_modules/@opentelemetry/sdk-trace-base/build/esm/platform/browser/export/BatchSpanProcessor.js
  var __extends2 = /* @__PURE__ */ function() {
    var extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
        d2.__proto__ = b2;
      } || function(d2, b2) {
        for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
      };
      return extendStatics(d, b);
    };
    return function(d, b) {
      if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
  }();
  var BatchSpanProcessor = (
    /** @class */
    function(_super) {
      __extends2(BatchSpanProcessor2, _super);
      function BatchSpanProcessor2(_exporter, config2) {
        var _this = _super.call(this, _exporter, config2) || this;
        _this.onInit(config2);
        return _this;
      }
      BatchSpanProcessor2.prototype.onInit = function(config2) {
        var _this = this;
        if ((config2 === null || config2 === void 0 ? void 0 : config2.disableAutoFlushOnDocumentHide) !== true && typeof document !== "undefined") {
          this._visibilityChangeListener = function() {
            if (document.visibilityState === "hidden") {
              _this.forceFlush().catch(function(error) {
                globalErrorHandler(error);
              });
            }
          };
          this._pageHideListener = function() {
            _this.forceFlush().catch(function(error) {
              globalErrorHandler(error);
            });
          };
          document.addEventListener("visibilitychange", this._visibilityChangeListener);
          document.addEventListener("pagehide", this._pageHideListener);
        }
      };
      BatchSpanProcessor2.prototype.onShutdown = function() {
        if (typeof document !== "undefined") {
          if (this._visibilityChangeListener) {
            document.removeEventListener("visibilitychange", this._visibilityChangeListener);
          }
          if (this._pageHideListener) {
            document.removeEventListener("pagehide", this._pageHideListener);
          }
        }
      };
      return BatchSpanProcessor2;
    }(BatchSpanProcessorBase)
  );

  // node_modules/@opentelemetry/sdk-trace-base/build/esm/platform/browser/RandomIdGenerator.js
  var SPAN_ID_BYTES = 8;
  var TRACE_ID_BYTES = 16;
  var RandomIdGenerator2 = (
    /** @class */
    /* @__PURE__ */ function() {
      function RandomIdGenerator5() {
        this.generateTraceId = getIdGenerator(TRACE_ID_BYTES);
        this.generateSpanId = getIdGenerator(SPAN_ID_BYTES);
      }
      return RandomIdGenerator5;
    }()
  );
  var SHARED_CHAR_CODES_ARRAY = Array(32);
  function getIdGenerator(bytes) {
    return function generateId() {
      for (var i = 0; i < bytes * 2; i++) {
        SHARED_CHAR_CODES_ARRAY[i] = Math.floor(Math.random() * 16) + 48;
        if (SHARED_CHAR_CODES_ARRAY[i] >= 58) {
          SHARED_CHAR_CODES_ARRAY[i] += 39;
        }
      }
      return String.fromCharCode.apply(null, SHARED_CHAR_CODES_ARRAY.slice(0, bytes * 2));
    };
  }

  // node_modules/@opentelemetry/sdk-trace-base/build/esm/Tracer.js
  var Tracer = (
    /** @class */
    function() {
      function Tracer2(instrumentationLibrary, config2, _tracerProvider) {
        this._tracerProvider = _tracerProvider;
        var localConfig = mergeConfig(config2);
        this._sampler = localConfig.sampler;
        this._generalLimits = localConfig.generalLimits;
        this._spanLimits = localConfig.spanLimits;
        this._idGenerator = config2.idGenerator || new RandomIdGenerator2();
        this.resource = _tracerProvider.resource;
        this.instrumentationLibrary = instrumentationLibrary;
      }
      Tracer2.prototype.startSpan = function(name, options, context2) {
        var _a3, _b, _c;
        if (options === void 0) {
          options = {};
        }
        if (context2 === void 0) {
          context2 = context.active();
        }
        if (options.root) {
          context2 = trace.deleteSpan(context2);
        }
        var parentSpan = trace.getSpan(context2);
        if (isTracingSuppressed(context2)) {
          diag2.debug("Instrumentation suppressed, returning Noop Span");
          var nonRecordingSpan = trace.wrapSpanContext(INVALID_SPAN_CONTEXT);
          return nonRecordingSpan;
        }
        var parentSpanContext = parentSpan === null || parentSpan === void 0 ? void 0 : parentSpan.spanContext();
        var spanId = this._idGenerator.generateSpanId();
        var traceId;
        var traceState;
        var parentSpanId;
        if (!parentSpanContext || !trace.isSpanContextValid(parentSpanContext)) {
          traceId = this._idGenerator.generateTraceId();
        } else {
          traceId = parentSpanContext.traceId;
          traceState = parentSpanContext.traceState;
          parentSpanId = parentSpanContext.spanId;
        }
        var spanKind = (_a3 = options.kind) !== null && _a3 !== void 0 ? _a3 : SpanKind.INTERNAL;
        var links = ((_b = options.links) !== null && _b !== void 0 ? _b : []).map(function(link) {
          return {
            context: link.context,
            attributes: sanitizeAttributes(link.attributes)
          };
        });
        var attributes = sanitizeAttributes(options.attributes);
        var samplingResult = this._sampler.shouldSample(context2, traceId, name, spanKind, attributes, links);
        traceState = (_c = samplingResult.traceState) !== null && _c !== void 0 ? _c : traceState;
        var traceFlags = samplingResult.decision === SamplingDecision.RECORD_AND_SAMPLED ? TraceFlags.SAMPLED : TraceFlags.NONE;
        var spanContext = { traceId, spanId, traceFlags, traceState };
        if (samplingResult.decision === SamplingDecision.NOT_RECORD) {
          diag2.debug("Recording is off, propagating context in a non-recording span");
          var nonRecordingSpan = trace.wrapSpanContext(spanContext);
          return nonRecordingSpan;
        }
        var initAttributes = sanitizeAttributes(Object.assign(attributes, samplingResult.attributes));
        var span = new Span(this, context2, name, spanContext, spanKind, parentSpanId, links, options.startTime, void 0, initAttributes);
        return span;
      };
      Tracer2.prototype.startActiveSpan = function(name, arg2, arg3, arg4) {
        var opts;
        var ctx;
        var fn;
        if (arguments.length < 2) {
          return;
        } else if (arguments.length === 2) {
          fn = arg2;
        } else if (arguments.length === 3) {
          opts = arg2;
          fn = arg3;
        } else {
          opts = arg2;
          ctx = arg3;
          fn = arg4;
        }
        var parentContext = ctx !== null && ctx !== void 0 ? ctx : context.active();
        var span = this.startSpan(name, opts, parentContext);
        var contextWithSpanSet = trace.setSpan(parentContext, span);
        return context.with(contextWithSpanSet, fn, void 0, span);
      };
      Tracer2.prototype.getGeneralLimits = function() {
        return this._generalLimits;
      };
      Tracer2.prototype.getSpanLimits = function() {
        return this._spanLimits;
      };
      Tracer2.prototype.getActiveSpanProcessor = function() {
        return this._tracerProvider.getActiveSpanProcessor();
      };
      return Tracer2;
    }()
  );

  // node_modules/@opentelemetry/resources/node_modules/@opentelemetry/semantic-conventions/build/esm/resource/SemanticResourceAttributes.js
  var TMP_SERVICE_NAME = "service.name";
  var TMP_TELEMETRY_SDK_NAME2 = "telemetry.sdk.name";
  var TMP_TELEMETRY_SDK_LANGUAGE2 = "telemetry.sdk.language";
  var TMP_TELEMETRY_SDK_VERSION2 = "telemetry.sdk.version";
  var SEMRESATTRS_SERVICE_NAME = TMP_SERVICE_NAME;
  var SEMRESATTRS_TELEMETRY_SDK_NAME2 = TMP_TELEMETRY_SDK_NAME2;
  var SEMRESATTRS_TELEMETRY_SDK_LANGUAGE2 = TMP_TELEMETRY_SDK_LANGUAGE2;
  var SEMRESATTRS_TELEMETRY_SDK_VERSION2 = TMP_TELEMETRY_SDK_VERSION2;

  // node_modules/@opentelemetry/resources/build/esm/platform/browser/default-service-name.js
  function defaultServiceName() {
    return "unknown_service";
  }

  // node_modules/@opentelemetry/resources/build/esm/Resource.js
  var __assign2 = function() {
    __assign2 = Object.assign || function(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
          t[p] = s[p];
      }
      return t;
    };
    return __assign2.apply(this, arguments);
  };
  var __awaiter = function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve) {
        resolve(value);
      });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  var __generator = function(thisArg, body) {
    var _ = { label: 0, sent: function() {
      if (t[0] & 1) throw t[1];
      return t[1];
    }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
      return this;
    }), g;
    function verb(n) {
      return function(v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (_) try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];
        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;
          case 4:
            _.label++;
            return { value: op[1], done: false };
          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;
          case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;
          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }
            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            if (t[2]) _.ops.pop();
            _.trys.pop();
            continue;
        }
        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
  var __read10 = function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    } catch (error) {
      e = { error };
    } finally {
      try {
        if (r && !r.done && (m = i["return"])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }
    return ar;
  };
  var Resource = (
    /** @class */
    function() {
      function Resource2(attributes, asyncAttributesPromise) {
        var _this = this;
        var _a3;
        this._attributes = attributes;
        this.asyncAttributesPending = asyncAttributesPromise != null;
        this._syncAttributes = (_a3 = this._attributes) !== null && _a3 !== void 0 ? _a3 : {};
        this._asyncAttributesPromise = asyncAttributesPromise === null || asyncAttributesPromise === void 0 ? void 0 : asyncAttributesPromise.then(function(asyncAttributes) {
          _this._attributes = Object.assign({}, _this._attributes, asyncAttributes);
          _this.asyncAttributesPending = false;
          return asyncAttributes;
        }, function(err) {
          diag2.debug("a resource's async attributes promise rejected: %s", err);
          _this.asyncAttributesPending = false;
          return {};
        });
      }
      Resource2.empty = function() {
        return Resource2.EMPTY;
      };
      Resource2.default = function() {
        var _a3;
        return new Resource2((_a3 = {}, _a3[SEMRESATTRS_SERVICE_NAME] = defaultServiceName(), _a3[SEMRESATTRS_TELEMETRY_SDK_LANGUAGE2] = SDK_INFO[SEMRESATTRS_TELEMETRY_SDK_LANGUAGE2], _a3[SEMRESATTRS_TELEMETRY_SDK_NAME2] = SDK_INFO[SEMRESATTRS_TELEMETRY_SDK_NAME2], _a3[SEMRESATTRS_TELEMETRY_SDK_VERSION2] = SDK_INFO[SEMRESATTRS_TELEMETRY_SDK_VERSION2], _a3));
      };
      Object.defineProperty(Resource2.prototype, "attributes", {
        get: function() {
          var _a3;
          if (this.asyncAttributesPending) {
            diag2.error("Accessing resource attributes before async attributes settled");
          }
          return (_a3 = this._attributes) !== null && _a3 !== void 0 ? _a3 : {};
        },
        enumerable: false,
        configurable: true
      });
      Resource2.prototype.waitForAsyncAttributes = function() {
        return __awaiter(this, void 0, void 0, function() {
          return __generator(this, function(_a3) {
            switch (_a3.label) {
              case 0:
                if (!this.asyncAttributesPending) return [3, 2];
                return [4, this._asyncAttributesPromise];
              case 1:
                _a3.sent();
                _a3.label = 2;
              case 2:
                return [
                  2
                  /*return*/
                ];
            }
          });
        });
      };
      Resource2.prototype.merge = function(other) {
        var _this = this;
        var _a3;
        if (!other)
          return this;
        var mergedSyncAttributes = __assign2(__assign2({}, this._syncAttributes), (_a3 = other._syncAttributes) !== null && _a3 !== void 0 ? _a3 : other.attributes);
        if (!this._asyncAttributesPromise && !other._asyncAttributesPromise) {
          return new Resource2(mergedSyncAttributes);
        }
        var mergedAttributesPromise = Promise.all([
          this._asyncAttributesPromise,
          other._asyncAttributesPromise
        ]).then(function(_a4) {
          var _b;
          var _c = __read10(_a4, 2), thisAsyncAttributes = _c[0], otherAsyncAttributes = _c[1];
          return __assign2(__assign2(__assign2(__assign2({}, _this._syncAttributes), thisAsyncAttributes), (_b = other._syncAttributes) !== null && _b !== void 0 ? _b : other.attributes), otherAsyncAttributes);
        });
        return new Resource2(mergedSyncAttributes, mergedAttributesPromise);
      };
      Resource2.EMPTY = new Resource2({});
      return Resource2;
    }()
  );

  // node_modules/@opentelemetry/sdk-trace-base/build/esm/MultiSpanProcessor.js
  var __values5 = function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
      next: function() {
        if (o && i >= o.length) o = void 0;
        return { value: o && o[i++], done: !o };
      }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
  };
  var MultiSpanProcessor = (
    /** @class */
    function() {
      function MultiSpanProcessor2(_spanProcessors) {
        this._spanProcessors = _spanProcessors;
      }
      MultiSpanProcessor2.prototype.forceFlush = function() {
        var e_1, _a3;
        var promises = [];
        try {
          for (var _b = __values5(this._spanProcessors), _c = _b.next(); !_c.done; _c = _b.next()) {
            var spanProcessor = _c.value;
            promises.push(spanProcessor.forceFlush());
          }
        } catch (e_1_1) {
          e_1 = { error: e_1_1 };
        } finally {
          try {
            if (_c && !_c.done && (_a3 = _b.return)) _a3.call(_b);
          } finally {
            if (e_1) throw e_1.error;
          }
        }
        return new Promise(function(resolve) {
          Promise.all(promises).then(function() {
            resolve();
          }).catch(function(error) {
            globalErrorHandler(error || new Error("MultiSpanProcessor: forceFlush failed"));
            resolve();
          });
        });
      };
      MultiSpanProcessor2.prototype.onStart = function(span, context2) {
        var e_2, _a3;
        try {
          for (var _b = __values5(this._spanProcessors), _c = _b.next(); !_c.done; _c = _b.next()) {
            var spanProcessor = _c.value;
            spanProcessor.onStart(span, context2);
          }
        } catch (e_2_1) {
          e_2 = { error: e_2_1 };
        } finally {
          try {
            if (_c && !_c.done && (_a3 = _b.return)) _a3.call(_b);
          } finally {
            if (e_2) throw e_2.error;
          }
        }
      };
      MultiSpanProcessor2.prototype.onEnd = function(span) {
        var e_3, _a3;
        try {
          for (var _b = __values5(this._spanProcessors), _c = _b.next(); !_c.done; _c = _b.next()) {
            var spanProcessor = _c.value;
            spanProcessor.onEnd(span);
          }
        } catch (e_3_1) {
          e_3 = { error: e_3_1 };
        } finally {
          try {
            if (_c && !_c.done && (_a3 = _b.return)) _a3.call(_b);
          } finally {
            if (e_3) throw e_3.error;
          }
        }
      };
      MultiSpanProcessor2.prototype.shutdown = function() {
        var e_4, _a3;
        var promises = [];
        try {
          for (var _b = __values5(this._spanProcessors), _c = _b.next(); !_c.done; _c = _b.next()) {
            var spanProcessor = _c.value;
            promises.push(spanProcessor.shutdown());
          }
        } catch (e_4_1) {
          e_4 = { error: e_4_1 };
        } finally {
          try {
            if (_c && !_c.done && (_a3 = _b.return)) _a3.call(_b);
          } finally {
            if (e_4) throw e_4.error;
          }
        }
        return new Promise(function(resolve, reject) {
          Promise.all(promises).then(function() {
            resolve();
          }, reject);
        });
      };
      return MultiSpanProcessor2;
    }()
  );

  // node_modules/@opentelemetry/sdk-trace-base/build/esm/export/NoopSpanProcessor.js
  var NoopSpanProcessor = (
    /** @class */
    function() {
      function NoopSpanProcessor2() {
      }
      NoopSpanProcessor2.prototype.onStart = function(_span, _context) {
      };
      NoopSpanProcessor2.prototype.onEnd = function(_span) {
      };
      NoopSpanProcessor2.prototype.shutdown = function() {
        return Promise.resolve();
      };
      NoopSpanProcessor2.prototype.forceFlush = function() {
        return Promise.resolve();
      };
      return NoopSpanProcessor2;
    }()
  );

  // node_modules/@opentelemetry/sdk-trace-base/build/esm/BasicTracerProvider.js
  var __read11 = function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    } catch (error) {
      e = { error };
    } finally {
      try {
        if (r && !r.done && (m = i["return"])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }
    return ar;
  };
  var __spreadArray7 = function(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
      if (ar || !(i in from)) {
        if (!ar) ar = Array.prototype.slice.call(from, 0, i);
        ar[i] = from[i];
      }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
  var ForceFlushState;
  (function(ForceFlushState2) {
    ForceFlushState2[ForceFlushState2["resolved"] = 0] = "resolved";
    ForceFlushState2[ForceFlushState2["timeout"] = 1] = "timeout";
    ForceFlushState2[ForceFlushState2["error"] = 2] = "error";
    ForceFlushState2[ForceFlushState2["unresolved"] = 3] = "unresolved";
  })(ForceFlushState || (ForceFlushState = {}));
  var BasicTracerProvider = (
    /** @class */
    function() {
      function BasicTracerProvider2(config2) {
        if (config2 === void 0) {
          config2 = {};
        }
        var _a3, _b;
        this._registeredSpanProcessors = [];
        this._tracers = /* @__PURE__ */ new Map();
        var mergedConfig = merge({}, loadDefaultConfig(), reconfigureLimits(config2));
        this.resource = (_a3 = mergedConfig.resource) !== null && _a3 !== void 0 ? _a3 : Resource.empty();
        if (mergedConfig.mergeResourceWithDefaults) {
          this.resource = Resource.default().merge(this.resource);
        }
        this._config = Object.assign({}, mergedConfig, {
          resource: this.resource
        });
        if ((_b = config2.spanProcessors) === null || _b === void 0 ? void 0 : _b.length) {
          this._registeredSpanProcessors = __spreadArray7([], __read11(config2.spanProcessors), false);
          this.activeSpanProcessor = new MultiSpanProcessor(this._registeredSpanProcessors);
        } else {
          var defaultExporter = this._buildExporterFromEnv();
          if (defaultExporter !== void 0) {
            var batchProcessor = new BatchSpanProcessor(defaultExporter);
            this.activeSpanProcessor = batchProcessor;
          } else {
            this.activeSpanProcessor = new NoopSpanProcessor();
          }
        }
      }
      BasicTracerProvider2.prototype.getTracer = function(name, version, options) {
        var key = name + "@" + (version || "") + ":" + ((options === null || options === void 0 ? void 0 : options.schemaUrl) || "");
        if (!this._tracers.has(key)) {
          this._tracers.set(key, new Tracer({ name, version, schemaUrl: options === null || options === void 0 ? void 0 : options.schemaUrl }, this._config, this));
        }
        return this._tracers.get(key);
      };
      BasicTracerProvider2.prototype.addSpanProcessor = function(spanProcessor) {
        if (this._registeredSpanProcessors.length === 0) {
          this.activeSpanProcessor.shutdown().catch(function(err) {
            return diag2.error("Error while trying to shutdown current span processor", err);
          });
        }
        this._registeredSpanProcessors.push(spanProcessor);
        this.activeSpanProcessor = new MultiSpanProcessor(this._registeredSpanProcessors);
      };
      BasicTracerProvider2.prototype.getActiveSpanProcessor = function() {
        return this.activeSpanProcessor;
      };
      BasicTracerProvider2.prototype.register = function(config2) {
        if (config2 === void 0) {
          config2 = {};
        }
        trace.setGlobalTracerProvider(this);
        if (config2.propagator === void 0) {
          config2.propagator = this._buildPropagatorFromEnv();
        }
        if (config2.contextManager) {
          context.setGlobalContextManager(config2.contextManager);
        }
        if (config2.propagator) {
          propagation.setGlobalPropagator(config2.propagator);
        }
      };
      BasicTracerProvider2.prototype.forceFlush = function() {
        var timeout = this._config.forceFlushTimeoutMillis;
        var promises = this._registeredSpanProcessors.map(function(spanProcessor) {
          return new Promise(function(resolve) {
            var state;
            var timeoutInterval = setTimeout(function() {
              resolve(new Error("Span processor did not completed within timeout period of " + timeout + " ms"));
              state = ForceFlushState.timeout;
            }, timeout);
            spanProcessor.forceFlush().then(function() {
              clearTimeout(timeoutInterval);
              if (state !== ForceFlushState.timeout) {
                state = ForceFlushState.resolved;
                resolve(state);
              }
            }).catch(function(error) {
              clearTimeout(timeoutInterval);
              state = ForceFlushState.error;
              resolve(error);
            });
          });
        });
        return new Promise(function(resolve, reject) {
          Promise.all(promises).then(function(results) {
            var errors = results.filter(function(result) {
              return result !== ForceFlushState.resolved;
            });
            if (errors.length > 0) {
              reject(errors);
            } else {
              resolve();
            }
          }).catch(function(error) {
            return reject([error]);
          });
        });
      };
      BasicTracerProvider2.prototype.shutdown = function() {
        return this.activeSpanProcessor.shutdown();
      };
      BasicTracerProvider2.prototype._getPropagator = function(name) {
        var _a3;
        return (_a3 = this.constructor._registeredPropagators.get(name)) === null || _a3 === void 0 ? void 0 : _a3();
      };
      BasicTracerProvider2.prototype._getSpanExporter = function(name) {
        var _a3;
        return (_a3 = this.constructor._registeredExporters.get(name)) === null || _a3 === void 0 ? void 0 : _a3();
      };
      BasicTracerProvider2.prototype._buildPropagatorFromEnv = function() {
        var _this = this;
        var uniquePropagatorNames = Array.from(new Set(getEnv().OTEL_PROPAGATORS));
        var propagators = uniquePropagatorNames.map(function(name) {
          var propagator = _this._getPropagator(name);
          if (!propagator) {
            diag2.warn('Propagator "' + name + '" requested through environment variable is unavailable.');
          }
          return propagator;
        });
        var validPropagators = propagators.reduce(function(list, item) {
          if (item) {
            list.push(item);
          }
          return list;
        }, []);
        if (validPropagators.length === 0) {
          return;
        } else if (uniquePropagatorNames.length === 1) {
          return validPropagators[0];
        } else {
          return new CompositePropagator({
            propagators: validPropagators
          });
        }
      };
      BasicTracerProvider2.prototype._buildExporterFromEnv = function() {
        var exporterName = getEnv().OTEL_TRACES_EXPORTER;
        if (exporterName === "none" || exporterName === "")
          return;
        var exporter = this._getSpanExporter(exporterName);
        if (!exporter) {
          diag2.error('Exporter "' + exporterName + '" requested through environment variable is unavailable.');
        }
        return exporter;
      };
      BasicTracerProvider2._registeredPropagators = /* @__PURE__ */ new Map([
        ["tracecontext", function() {
          return new W3CTraceContextPropagator();
        }],
        ["baggage", function() {
          return new W3CBaggagePropagator();
        }]
      ]);
      BasicTracerProvider2._registeredExporters = /* @__PURE__ */ new Map();
      return BasicTracerProvider2;
    }()
  );

  // node_modules/@opentelemetry/sdk-trace-base/build/esm/export/ConsoleSpanExporter.js
  var __values6 = function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
      next: function() {
        if (o && i >= o.length) o = void 0;
        return { value: o && o[i++], done: !o };
      }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
  };
  var ConsoleSpanExporter = (
    /** @class */
    function() {
      function ConsoleSpanExporter2() {
      }
      ConsoleSpanExporter2.prototype.export = function(spans, resultCallback) {
        return this._sendSpans(spans, resultCallback);
      };
      ConsoleSpanExporter2.prototype.shutdown = function() {
        this._sendSpans([]);
        return this.forceFlush();
      };
      ConsoleSpanExporter2.prototype.forceFlush = function() {
        return Promise.resolve();
      };
      ConsoleSpanExporter2.prototype._exportInfo = function(span) {
        var _a3;
        return {
          resource: {
            attributes: span.resource.attributes
          },
          instrumentationScope: span.instrumentationLibrary,
          traceId: span.spanContext().traceId,
          parentId: span.parentSpanId,
          traceState: (_a3 = span.spanContext().traceState) === null || _a3 === void 0 ? void 0 : _a3.serialize(),
          name: span.name,
          id: span.spanContext().spanId,
          kind: span.kind,
          timestamp: hrTimeToMicroseconds(span.startTime),
          duration: hrTimeToMicroseconds(span.duration),
          attributes: span.attributes,
          status: span.status,
          events: span.events,
          links: span.links
        };
      };
      ConsoleSpanExporter2.prototype._sendSpans = function(spans, done) {
        var e_1, _a3;
        try {
          for (var spans_1 = __values6(spans), spans_1_1 = spans_1.next(); !spans_1_1.done; spans_1_1 = spans_1.next()) {
            var span = spans_1_1.value;
            console.dir(this._exportInfo(span), { depth: 3 });
          }
        } catch (e_1_1) {
          e_1 = { error: e_1_1 };
        } finally {
          try {
            if (spans_1_1 && !spans_1_1.done && (_a3 = spans_1.return)) _a3.call(spans_1);
          } finally {
            if (e_1) throw e_1.error;
          }
        }
        if (done) {
          return done({ code: ExportResultCode.SUCCESS });
        }
      };
      return ConsoleSpanExporter2;
    }()
  );

  // node_modules/@opentelemetry/sdk-trace-base/build/esm/export/SimpleSpanProcessor.js
  var __awaiter2 = function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve) {
        resolve(value);
      });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  var __generator2 = function(thisArg, body) {
    var _ = { label: 0, sent: function() {
      if (t[0] & 1) throw t[1];
      return t[1];
    }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
      return this;
    }), g;
    function verb(n) {
      return function(v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (_) try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];
        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;
          case 4:
            _.label++;
            return { value: op[1], done: false };
          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;
          case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;
          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }
            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            if (t[2]) _.ops.pop();
            _.trys.pop();
            continue;
        }
        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
  var SimpleSpanProcessor = (
    /** @class */
    function() {
      function SimpleSpanProcessor2(_exporter) {
        this._exporter = _exporter;
        this._shutdownOnce = new BindOnceFuture(this._shutdown, this);
        this._unresolvedExports = /* @__PURE__ */ new Set();
      }
      SimpleSpanProcessor2.prototype.forceFlush = function() {
        return __awaiter2(this, void 0, void 0, function() {
          return __generator2(this, function(_a3) {
            switch (_a3.label) {
              case 0:
                return [4, Promise.all(Array.from(this._unresolvedExports))];
              case 1:
                _a3.sent();
                if (!this._exporter.forceFlush) return [3, 3];
                return [4, this._exporter.forceFlush()];
              case 2:
                _a3.sent();
                _a3.label = 3;
              case 3:
                return [
                  2
                  /*return*/
                ];
            }
          });
        });
      };
      SimpleSpanProcessor2.prototype.onStart = function(_span, _parentContext) {
      };
      SimpleSpanProcessor2.prototype.onEnd = function(span) {
        var _this = this;
        var _a3, _b;
        if (this._shutdownOnce.isCalled) {
          return;
        }
        if ((span.spanContext().traceFlags & TraceFlags.SAMPLED) === 0) {
          return;
        }
        var doExport = function() {
          return internal._export(_this._exporter, [span]).then(function(result) {
            var _a4;
            if (result.code !== ExportResultCode.SUCCESS) {
              globalErrorHandler((_a4 = result.error) !== null && _a4 !== void 0 ? _a4 : new Error("SimpleSpanProcessor: span export failed (status " + result + ")"));
            }
          }).catch(function(error) {
            globalErrorHandler(error);
          });
        };
        if (span.resource.asyncAttributesPending) {
          var exportPromise_1 = (_b = (_a3 = span.resource).waitForAsyncAttributes) === null || _b === void 0 ? void 0 : _b.call(_a3).then(function() {
            if (exportPromise_1 != null) {
              _this._unresolvedExports.delete(exportPromise_1);
            }
            return doExport();
          }, function(err) {
            return globalErrorHandler(err);
          });
          if (exportPromise_1 != null) {
            this._unresolvedExports.add(exportPromise_1);
          }
        } else {
          void doExport();
        }
      };
      SimpleSpanProcessor2.prototype.shutdown = function() {
        return this._shutdownOnce.call();
      };
      SimpleSpanProcessor2.prototype._shutdown = function() {
        return this._exporter.shutdown();
      };
      return SimpleSpanProcessor2;
    }()
  );

  // node_modules/@opentelemetry/sdk-trace-web/build/esm/StackContextManager.js
  var __read12 = function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    } catch (error) {
      e = { error };
    } finally {
      try {
        if (r && !r.done && (m = i["return"])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }
    return ar;
  };
  var __spreadArray8 = function(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
      if (ar || !(i in from)) {
        if (!ar) ar = Array.prototype.slice.call(from, 0, i);
        ar[i] = from[i];
      }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
  var StackContextManager = (
    /** @class */
    function() {
      function StackContextManager2() {
        this._enabled = false;
        this._currentContext = ROOT_CONTEXT;
      }
      StackContextManager2.prototype._bindFunction = function(context2, target) {
        if (context2 === void 0) {
          context2 = ROOT_CONTEXT;
        }
        var manager = this;
        var contextWrapper = function() {
          var _this = this;
          var args = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
          }
          return manager.with(context2, function() {
            return target.apply(_this, args);
          });
        };
        Object.defineProperty(contextWrapper, "length", {
          enumerable: false,
          configurable: true,
          writable: false,
          value: target.length
        });
        return contextWrapper;
      };
      StackContextManager2.prototype.active = function() {
        return this._currentContext;
      };
      StackContextManager2.prototype.bind = function(context2, target) {
        if (context2 === void 0) {
          context2 = this.active();
        }
        if (typeof target === "function") {
          return this._bindFunction(context2, target);
        }
        return target;
      };
      StackContextManager2.prototype.disable = function() {
        this._currentContext = ROOT_CONTEXT;
        this._enabled = false;
        return this;
      };
      StackContextManager2.prototype.enable = function() {
        if (this._enabled) {
          return this;
        }
        this._enabled = true;
        this._currentContext = ROOT_CONTEXT;
        return this;
      };
      StackContextManager2.prototype.with = function(context2, fn, thisArg) {
        var args = [];
        for (var _i = 3; _i < arguments.length; _i++) {
          args[_i - 3] = arguments[_i];
        }
        var previousContext = this._currentContext;
        this._currentContext = context2 || ROOT_CONTEXT;
        try {
          return fn.call.apply(fn, __spreadArray8([thisArg], __read12(args), false));
        } finally {
          this._currentContext = previousContext;
        }
      };
      return StackContextManager2;
    }()
  );

  // node_modules/@opentelemetry/sdk-trace-web/build/esm/WebTracerProvider.js
  var __extends3 = /* @__PURE__ */ function() {
    var extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
        d2.__proto__ = b2;
      } || function(d2, b2) {
        for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
      };
      return extendStatics(d, b);
    };
    return function(d, b) {
      if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
  }();
  var WebTracerProvider = (
    /** @class */
    function(_super) {
      __extends3(WebTracerProvider2, _super);
      function WebTracerProvider2(config2) {
        if (config2 === void 0) {
          config2 = {};
        }
        var _this = _super.call(this, config2) || this;
        if (config2.contextManager) {
          throw "contextManager should be defined in register method not in constructor";
        }
        if (config2.propagator) {
          throw "propagator should be defined in register method not in constructor";
        }
        return _this;
      }
      WebTracerProvider2.prototype.register = function(config2) {
        if (config2 === void 0) {
          config2 = {};
        }
        if (config2.contextManager === void 0) {
          config2.contextManager = new StackContextManager();
        }
        if (config2.contextManager) {
          config2.contextManager.enable();
        }
        _super.prototype.register.call(this, config2);
      };
      return WebTracerProvider2;
    }(BasicTracerProvider)
  );

  // node_modules/@opentelemetry/sdk-trace-web/build/esm/enums/PerformanceTimingNames.js
  var PerformanceTimingNames;
  (function(PerformanceTimingNames4) {
    PerformanceTimingNames4["CONNECT_END"] = "connectEnd";
    PerformanceTimingNames4["CONNECT_START"] = "connectStart";
    PerformanceTimingNames4["DECODED_BODY_SIZE"] = "decodedBodySize";
    PerformanceTimingNames4["DOM_COMPLETE"] = "domComplete";
    PerformanceTimingNames4["DOM_CONTENT_LOADED_EVENT_END"] = "domContentLoadedEventEnd";
    PerformanceTimingNames4["DOM_CONTENT_LOADED_EVENT_START"] = "domContentLoadedEventStart";
    PerformanceTimingNames4["DOM_INTERACTIVE"] = "domInteractive";
    PerformanceTimingNames4["DOMAIN_LOOKUP_END"] = "domainLookupEnd";
    PerformanceTimingNames4["DOMAIN_LOOKUP_START"] = "domainLookupStart";
    PerformanceTimingNames4["ENCODED_BODY_SIZE"] = "encodedBodySize";
    PerformanceTimingNames4["FETCH_START"] = "fetchStart";
    PerformanceTimingNames4["LOAD_EVENT_END"] = "loadEventEnd";
    PerformanceTimingNames4["LOAD_EVENT_START"] = "loadEventStart";
    PerformanceTimingNames4["NAVIGATION_START"] = "navigationStart";
    PerformanceTimingNames4["REDIRECT_END"] = "redirectEnd";
    PerformanceTimingNames4["REDIRECT_START"] = "redirectStart";
    PerformanceTimingNames4["REQUEST_START"] = "requestStart";
    PerformanceTimingNames4["RESPONSE_END"] = "responseEnd";
    PerformanceTimingNames4["RESPONSE_START"] = "responseStart";
    PerformanceTimingNames4["SECURE_CONNECTION_START"] = "secureConnectionStart";
    PerformanceTimingNames4["UNLOAD_EVENT_END"] = "unloadEventEnd";
    PerformanceTimingNames4["UNLOAD_EVENT_START"] = "unloadEventStart";
  })(PerformanceTimingNames || (PerformanceTimingNames = {}));

  // node_modules/@opentelemetry/sdk-trace-web/node_modules/@opentelemetry/semantic-conventions/build/esm/trace/SemanticAttributes.js
  var TMP_HTTP_RESPONSE_CONTENT_LENGTH = "http.response_content_length";
  var TMP_HTTP_RESPONSE_CONTENT_LENGTH_UNCOMPRESSED = "http.response_content_length_uncompressed";
  var SEMATTRS_HTTP_RESPONSE_CONTENT_LENGTH = TMP_HTTP_RESPONSE_CONTENT_LENGTH;
  var SEMATTRS_HTTP_RESPONSE_CONTENT_LENGTH_UNCOMPRESSED = TMP_HTTP_RESPONSE_CONTENT_LENGTH_UNCOMPRESSED;

  // node_modules/@opentelemetry/sdk-trace-web/build/esm/utils.js
  function hasKey(obj, key) {
    return key in obj;
  }
  function addSpanNetworkEvent(span, performanceName, entries, refPerfName) {
    var perfTime = void 0;
    var refTime = void 0;
    if (hasKey(entries, performanceName) && typeof entries[performanceName] === "number") {
      perfTime = entries[performanceName];
    }
    var refName = refPerfName || PerformanceTimingNames.FETCH_START;
    if (hasKey(entries, refName) && typeof entries[refName] === "number") {
      refTime = entries[refName];
    }
    if (perfTime !== void 0 && refTime !== void 0 && perfTime >= refTime) {
      span.addEvent(performanceName, perfTime);
      return span;
    }
    return void 0;
  }
  function addSpanNetworkEvents(span, resource, ignoreNetworkEvents) {
    if (ignoreNetworkEvents === void 0) {
      ignoreNetworkEvents = false;
    }
    if (!ignoreNetworkEvents) {
      addSpanNetworkEvent(span, PerformanceTimingNames.FETCH_START, resource);
      addSpanNetworkEvent(span, PerformanceTimingNames.DOMAIN_LOOKUP_START, resource);
      addSpanNetworkEvent(span, PerformanceTimingNames.DOMAIN_LOOKUP_END, resource);
      addSpanNetworkEvent(span, PerformanceTimingNames.CONNECT_START, resource);
      if (hasKey(resource, "name") && resource["name"].startsWith("https:")) {
        addSpanNetworkEvent(span, PerformanceTimingNames.SECURE_CONNECTION_START, resource);
      }
      addSpanNetworkEvent(span, PerformanceTimingNames.CONNECT_END, resource);
      addSpanNetworkEvent(span, PerformanceTimingNames.REQUEST_START, resource);
      addSpanNetworkEvent(span, PerformanceTimingNames.RESPONSE_START, resource);
      addSpanNetworkEvent(span, PerformanceTimingNames.RESPONSE_END, resource);
    }
    var encodedLength = resource[PerformanceTimingNames.ENCODED_BODY_SIZE];
    if (encodedLength !== void 0) {
      span.setAttribute(SEMATTRS_HTTP_RESPONSE_CONTENT_LENGTH, encodedLength);
    }
    var decodedLength = resource[PerformanceTimingNames.DECODED_BODY_SIZE];
    if (decodedLength !== void 0 && encodedLength !== decodedLength) {
      span.setAttribute(SEMATTRS_HTTP_RESPONSE_CONTENT_LENGTH_UNCOMPRESSED, decodedLength);
    }
  }

  // node_modules/@opentelemetry/otlp-exporter-base/build/esm/OTLPExporterBase.js
  var OTLPExporterBase = (
    /** @class */
    function() {
      function OTLPExporterBase2(_delegate) {
        this._delegate = _delegate;
      }
      OTLPExporterBase2.prototype.export = function(items, resultCallback) {
        this._delegate.export(items, resultCallback);
      };
      OTLPExporterBase2.prototype.forceFlush = function() {
        return this._delegate.forceFlush();
      };
      OTLPExporterBase2.prototype.shutdown = function() {
        return this._delegate.shutdown();
      };
      return OTLPExporterBase2;
    }()
  );

  // node_modules/@opentelemetry/otlp-exporter-base/build/esm/types.js
  var __extends4 = /* @__PURE__ */ function() {
    var extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
        d2.__proto__ = b2;
      } || function(d2, b2) {
        for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
      };
      return extendStatics(d, b);
    };
    return function(d, b) {
      if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
  }();
  var OTLPExporterError = (
    /** @class */
    function(_super) {
      __extends4(OTLPExporterError2, _super);
      function OTLPExporterError2(message, code, data) {
        var _this = _super.call(this, message) || this;
        _this.name = "OTLPExporterError";
        _this.data = data;
        _this.code = code;
        return _this;
      }
      return OTLPExporterError2;
    }(Error)
  );

  // node_modules/@opentelemetry/otlp-exporter-base/build/esm/configuration/shared-configuration.js
  function validateTimeoutMillis(timeoutMillis) {
    if (!Number.isNaN(timeoutMillis) && Number.isFinite(timeoutMillis) && timeoutMillis > 0) {
      return timeoutMillis;
    }
    throw new Error("Configuration: timeoutMillis is invalid, expected number greater than 0 (actual: '" + timeoutMillis + "')");
  }
  function wrapStaticHeadersInFunction(headers) {
    if (headers == null) {
      return void 0;
    }
    return function() {
      return headers;
    };
  }
  function mergeOtlpSharedConfigurationWithDefaults(userProvidedConfiguration, fallbackConfiguration, defaultConfiguration) {
    var _a3, _b, _c, _d, _e, _f;
    return {
      timeoutMillis: validateTimeoutMillis((_b = (_a3 = userProvidedConfiguration.timeoutMillis) !== null && _a3 !== void 0 ? _a3 : fallbackConfiguration.timeoutMillis) !== null && _b !== void 0 ? _b : defaultConfiguration.timeoutMillis),
      concurrencyLimit: (_d = (_c = userProvidedConfiguration.concurrencyLimit) !== null && _c !== void 0 ? _c : fallbackConfiguration.concurrencyLimit) !== null && _d !== void 0 ? _d : defaultConfiguration.concurrencyLimit,
      compression: (_f = (_e = userProvidedConfiguration.compression) !== null && _e !== void 0 ? _e : fallbackConfiguration.compression) !== null && _f !== void 0 ? _f : defaultConfiguration.compression
    };
  }
  function getSharedConfigurationDefaults() {
    return {
      timeoutMillis: 1e4,
      concurrencyLimit: 30,
      compression: "none"
    };
  }

  // node_modules/@opentelemetry/otlp-exporter-base/build/esm/bounded-queue-export-promise-handler.js
  var __awaiter3 = function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve) {
        resolve(value);
      });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  var __generator3 = function(thisArg, body) {
    var _ = { label: 0, sent: function() {
      if (t[0] & 1) throw t[1];
      return t[1];
    }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
      return this;
    }), g;
    function verb(n) {
      return function(v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (_) try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];
        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;
          case 4:
            _.label++;
            return { value: op[1], done: false };
          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;
          case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;
          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }
            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            if (t[2]) _.ops.pop();
            _.trys.pop();
            continue;
        }
        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
  var BoundedQueueExportPromiseHandler = (
    /** @class */
    function() {
      function BoundedQueueExportPromiseHandler2(concurrencyLimit) {
        this._sendingPromises = [];
        this._concurrencyLimit = concurrencyLimit;
      }
      BoundedQueueExportPromiseHandler2.prototype.pushPromise = function(promise) {
        var _this = this;
        if (this.hasReachedLimit()) {
          throw new Error("Concurrency Limit reached");
        }
        this._sendingPromises.push(promise);
        var popPromise = function() {
          var index = _this._sendingPromises.indexOf(promise);
          _this._sendingPromises.splice(index, 1);
        };
        promise.then(popPromise, popPromise);
      };
      BoundedQueueExportPromiseHandler2.prototype.hasReachedLimit = function() {
        return this._sendingPromises.length >= this._concurrencyLimit;
      };
      BoundedQueueExportPromiseHandler2.prototype.awaitAll = function() {
        return __awaiter3(this, void 0, void 0, function() {
          return __generator3(this, function(_a3) {
            switch (_a3.label) {
              case 0:
                return [4, Promise.all(this._sendingPromises)];
              case 1:
                _a3.sent();
                return [
                  2
                  /*return*/
                ];
            }
          });
        });
      };
      return BoundedQueueExportPromiseHandler2;
    }()
  );
  function createBoundedQueueExportPromiseHandler(options) {
    return new BoundedQueueExportPromiseHandler(options.concurrencyLimit);
  }

  // node_modules/@opentelemetry/otlp-exporter-base/node_modules/@opentelemetry/core/build/esm/ExportResult.js
  var ExportResultCode2;
  (function(ExportResultCode3) {
    ExportResultCode3[ExportResultCode3["SUCCESS"] = 0] = "SUCCESS";
    ExportResultCode3[ExportResultCode3["FAILED"] = 1] = "FAILED";
  })(ExportResultCode2 || (ExportResultCode2 = {}));

  // node_modules/@opentelemetry/otlp-exporter-base/build/esm/logging-response-handler.js
  function isPartialSuccessResponse(response) {
    return Object.prototype.hasOwnProperty.call(response, "partialSuccess");
  }
  function createLoggingPartialSuccessResponseHandler() {
    return {
      handleResponse: function(response) {
        if (response == null || !isPartialSuccessResponse(response) || response.partialSuccess == null || Object.keys(response.partialSuccess).length === 0) {
          return;
        }
        diag2.warn("Received Partial Success response:", JSON.stringify(response.partialSuccess));
      }
    };
  }

  // node_modules/@opentelemetry/otlp-exporter-base/build/esm/otlp-export-delegate.js
  var __awaiter4 = function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve) {
        resolve(value);
      });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  var __generator4 = function(thisArg, body) {
    var _ = { label: 0, sent: function() {
      if (t[0] & 1) throw t[1];
      return t[1];
    }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
      return this;
    }), g;
    function verb(n) {
      return function(v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (_) try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];
        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;
          case 4:
            _.label++;
            return { value: op[1], done: false };
          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;
          case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;
          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }
            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            if (t[2]) _.ops.pop();
            _.trys.pop();
            continue;
        }
        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
  var OTLPExportDelegate = (
    /** @class */
    function() {
      function OTLPExportDelegate2(_transport, _serializer, _responseHandler, _promiseQueue, _timeout) {
        this._transport = _transport;
        this._serializer = _serializer;
        this._responseHandler = _responseHandler;
        this._promiseQueue = _promiseQueue;
        this._timeout = _timeout;
        this._diagLogger = diag2.createComponentLogger({
          namespace: "OTLPExportDelegate"
        });
      }
      OTLPExportDelegate2.prototype.export = function(internalRepresentation, resultCallback) {
        var _this = this;
        this._diagLogger.debug("items to be sent", internalRepresentation);
        if (this._promiseQueue.hasReachedLimit()) {
          resultCallback({
            code: ExportResultCode2.FAILED,
            error: new Error("Concurrent export limit reached")
          });
          return;
        }
        var serializedRequest = this._serializer.serializeRequest(internalRepresentation);
        if (serializedRequest == null) {
          resultCallback({
            code: ExportResultCode2.FAILED,
            error: new Error("Nothing to send")
          });
          return;
        }
        this._promiseQueue.pushPromise(this._transport.send(serializedRequest, this._timeout).then(function(response) {
          if (response.status === "success") {
            if (response.data != null) {
              try {
                _this._responseHandler.handleResponse(_this._serializer.deserializeResponse(response.data));
              } catch (e) {
                _this._diagLogger.warn("Export succeeded but could not deserialize response - is the response specification compliant?", e, response.data);
              }
            }
            resultCallback({
              code: ExportResultCode2.SUCCESS
            });
            return;
          } else if (response.status === "failure" && response.error) {
            resultCallback({
              code: ExportResultCode2.FAILED,
              error: response.error
            });
            return;
          } else if (response.status === "retryable") {
            resultCallback({
              code: ExportResultCode2.FAILED,
              error: new OTLPExporterError("Export failed with retryable status")
            });
          } else {
            resultCallback({
              code: ExportResultCode2.FAILED,
              error: new OTLPExporterError("Export failed with unknown error")
            });
          }
        }, function(reason) {
          return resultCallback({
            code: ExportResultCode2.FAILED,
            error: reason
          });
        }));
      };
      OTLPExportDelegate2.prototype.forceFlush = function() {
        return this._promiseQueue.awaitAll();
      };
      OTLPExportDelegate2.prototype.shutdown = function() {
        return __awaiter4(this, void 0, void 0, function() {
          return __generator4(this, function(_a3) {
            switch (_a3.label) {
              case 0:
                this._diagLogger.debug("shutdown started");
                return [4, this.forceFlush()];
              case 1:
                _a3.sent();
                this._transport.shutdown();
                return [
                  2
                  /*return*/
                ];
            }
          });
        });
      };
      return OTLPExportDelegate2;
    }()
  );
  function createOtlpExportDelegate(components, settings) {
    return new OTLPExportDelegate(components.transport, components.serializer, createLoggingPartialSuccessResponseHandler(), components.promiseHandler, settings.timeout);
  }

  // node_modules/@opentelemetry/otlp-exporter-base/build/esm/otlp-network-export-delegate.js
  function createOtlpNetworkExportDelegate(options, serializer, transport) {
    return createOtlpExportDelegate({
      transport,
      serializer,
      promiseHandler: createBoundedQueueExportPromiseHandler(options)
    }, { timeout: options.timeoutMillis });
  }

  // node_modules/@opentelemetry/otlp-transformer/node_modules/@opentelemetry/core/build/esm/common/hex-to-binary.js
  function intValue(charCode) {
    if (charCode >= 48 && charCode <= 57) {
      return charCode - 48;
    }
    if (charCode >= 97 && charCode <= 102) {
      return charCode - 87;
    }
    return charCode - 55;
  }
  function hexToBinary(hexStr) {
    var buf = new Uint8Array(hexStr.length / 2);
    var offset = 0;
    for (var i = 0; i < hexStr.length; i += 2) {
      var hi = intValue(hexStr.charCodeAt(i));
      var lo = intValue(hexStr.charCodeAt(i + 1));
      buf[offset++] = hi << 4 | lo;
    }
    return buf;
  }

  // node_modules/@opentelemetry/otlp-transformer/node_modules/@opentelemetry/core/build/esm/common/time.js
  var NANOSECOND_DIGITS2 = 9;
  var NANOSECOND_DIGITS_IN_MILLIS2 = 6;
  var MILLISECONDS_TO_NANOSECONDS2 = Math.pow(10, NANOSECOND_DIGITS_IN_MILLIS2);
  var SECOND_TO_NANOSECONDS2 = Math.pow(10, NANOSECOND_DIGITS2);
  function hrTimeToNanoseconds2(time) {
    return time[0] * SECOND_TO_NANOSECONDS2 + time[1];
  }

  // node_modules/@opentelemetry/otlp-transformer/build/esm/common/index.js
  function hrTimeToNanos(hrTime5) {
    var NANOSECONDS = BigInt(1e9);
    return BigInt(hrTime5[0]) * NANOSECONDS + BigInt(hrTime5[1]);
  }
  function toLongBits(value) {
    var low = Number(BigInt.asUintN(32, value));
    var high = Number(BigInt.asUintN(32, value >> BigInt(32)));
    return { low, high };
  }
  function encodeAsLongBits(hrTime5) {
    var nanos = hrTimeToNanos(hrTime5);
    return toLongBits(nanos);
  }
  function encodeAsString(hrTime5) {
    var nanos = hrTimeToNanos(hrTime5);
    return nanos.toString();
  }
  var encodeTimestamp = typeof BigInt !== "undefined" ? encodeAsString : hrTimeToNanoseconds2;
  function identity(value) {
    return value;
  }
  function optionalHexToBinary(str) {
    if (str === void 0)
      return void 0;
    return hexToBinary(str);
  }
  var DEFAULT_ENCODER = {
    encodeHrTime: encodeAsLongBits,
    encodeSpanContext: hexToBinary,
    encodeOptionalSpanContext: optionalHexToBinary
  };
  function getOtlpEncoder(options) {
    var _a3, _b;
    if (options === void 0) {
      return DEFAULT_ENCODER;
    }
    var useLongBits = (_a3 = options.useLongBits) !== null && _a3 !== void 0 ? _a3 : true;
    var useHex = (_b = options.useHex) !== null && _b !== void 0 ? _b : false;
    return {
      encodeHrTime: useLongBits ? encodeAsLongBits : encodeTimestamp,
      encodeSpanContext: useHex ? identity : hexToBinary,
      encodeOptionalSpanContext: useHex ? identity : optionalHexToBinary
    };
  }

  // node_modules/@opentelemetry/otlp-transformer/build/esm/common/internal.js
  var __read13 = function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    } catch (error) {
      e = { error };
    } finally {
      try {
        if (r && !r.done && (m = i["return"])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }
    return ar;
  };
  function createInstrumentationScope(scope) {
    return {
      name: scope.name,
      version: scope.version
    };
  }
  function toAttributes(attributes) {
    return Object.keys(attributes).map(function(key) {
      return toKeyValue(key, attributes[key]);
    });
  }
  function toKeyValue(key, value) {
    return {
      key,
      value: toAnyValue(value)
    };
  }
  function toAnyValue(value) {
    var t = typeof value;
    if (t === "string")
      return { stringValue: value };
    if (t === "number") {
      if (!Number.isInteger(value))
        return { doubleValue: value };
      return { intValue: value };
    }
    if (t === "boolean")
      return { boolValue: value };
    if (value instanceof Uint8Array)
      return { bytesValue: value };
    if (Array.isArray(value))
      return { arrayValue: { values: value.map(toAnyValue) } };
    if (t === "object" && value != null)
      return {
        kvlistValue: {
          values: Object.entries(value).map(function(_a3) {
            var _b = __read13(_a3, 2), k = _b[0], v = _b[1];
            return toKeyValue(k, v);
          })
        }
      };
    return {};
  }

  // node_modules/@opentelemetry/otlp-transformer/build/esm/trace/internal.js
  function sdkSpanToOtlpSpan(span, encoder) {
    var _a3;
    var ctx = span.spanContext();
    var status = span.status;
    return {
      traceId: encoder.encodeSpanContext(ctx.traceId),
      spanId: encoder.encodeSpanContext(ctx.spanId),
      parentSpanId: encoder.encodeOptionalSpanContext(span.parentSpanId),
      traceState: (_a3 = ctx.traceState) === null || _a3 === void 0 ? void 0 : _a3.serialize(),
      name: span.name,
      // Span kind is offset by 1 because the API does not define a value for unset
      kind: span.kind == null ? 0 : span.kind + 1,
      startTimeUnixNano: encoder.encodeHrTime(span.startTime),
      endTimeUnixNano: encoder.encodeHrTime(span.endTime),
      attributes: toAttributes(span.attributes),
      droppedAttributesCount: span.droppedAttributesCount,
      events: span.events.map(function(event) {
        return toOtlpSpanEvent(event, encoder);
      }),
      droppedEventsCount: span.droppedEventsCount,
      status: {
        // API and proto enums share the same values
        code: status.code,
        message: status.message
      },
      links: span.links.map(function(link) {
        return toOtlpLink(link, encoder);
      }),
      droppedLinksCount: span.droppedLinksCount
    };
  }
  function toOtlpLink(link, encoder) {
    var _a3;
    return {
      attributes: link.attributes ? toAttributes(link.attributes) : [],
      spanId: encoder.encodeSpanContext(link.context.spanId),
      traceId: encoder.encodeSpanContext(link.context.traceId),
      traceState: (_a3 = link.context.traceState) === null || _a3 === void 0 ? void 0 : _a3.serialize(),
      droppedAttributesCount: link.droppedAttributesCount || 0
    };
  }
  function toOtlpSpanEvent(timedEvent, encoder) {
    return {
      attributes: timedEvent.attributes ? toAttributes(timedEvent.attributes) : [],
      name: timedEvent.name,
      timeUnixNano: encoder.encodeHrTime(timedEvent.time),
      droppedAttributesCount: timedEvent.droppedAttributesCount || 0
    };
  }

  // node_modules/@opentelemetry/otlp-transformer/build/esm/resource/internal.js
  function createResource(resource) {
    return {
      attributes: toAttributes(resource.attributes),
      droppedAttributesCount: 0
    };
  }

  // node_modules/@opentelemetry/otlp-transformer/build/esm/trace/index.js
  var __values7 = function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
      next: function() {
        if (o && i >= o.length) o = void 0;
        return { value: o && o[i++], done: !o };
      }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
  };
  var __read14 = function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    } catch (error) {
      e = { error };
    } finally {
      try {
        if (r && !r.done && (m = i["return"])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }
    return ar;
  };
  function createExportTraceServiceRequest(spans, options) {
    var encoder = getOtlpEncoder(options);
    return {
      resourceSpans: spanRecordsToResourceSpans(spans, encoder)
    };
  }
  function createResourceMap(readableSpans) {
    var e_1, _a3;
    var resourceMap = /* @__PURE__ */ new Map();
    try {
      for (var readableSpans_1 = __values7(readableSpans), readableSpans_1_1 = readableSpans_1.next(); !readableSpans_1_1.done; readableSpans_1_1 = readableSpans_1.next()) {
        var record = readableSpans_1_1.value;
        var ilmMap = resourceMap.get(record.resource);
        if (!ilmMap) {
          ilmMap = /* @__PURE__ */ new Map();
          resourceMap.set(record.resource, ilmMap);
        }
        var instrumentationLibraryKey = record.instrumentationLibrary.name + "@" + (record.instrumentationLibrary.version || "") + ":" + (record.instrumentationLibrary.schemaUrl || "");
        var records = ilmMap.get(instrumentationLibraryKey);
        if (!records) {
          records = [];
          ilmMap.set(instrumentationLibraryKey, records);
        }
        records.push(record);
      }
    } catch (e_1_1) {
      e_1 = { error: e_1_1 };
    } finally {
      try {
        if (readableSpans_1_1 && !readableSpans_1_1.done && (_a3 = readableSpans_1.return)) _a3.call(readableSpans_1);
      } finally {
        if (e_1) throw e_1.error;
      }
    }
    return resourceMap;
  }
  function spanRecordsToResourceSpans(readableSpans, encoder) {
    var resourceMap = createResourceMap(readableSpans);
    var out = [];
    var entryIterator = resourceMap.entries();
    var entry = entryIterator.next();
    while (!entry.done) {
      var _a3 = __read14(entry.value, 2), resource = _a3[0], ilmMap = _a3[1];
      var scopeResourceSpans = [];
      var ilmIterator = ilmMap.values();
      var ilmEntry = ilmIterator.next();
      while (!ilmEntry.done) {
        var scopeSpans = ilmEntry.value;
        if (scopeSpans.length > 0) {
          var spans = scopeSpans.map(function(readableSpan) {
            return sdkSpanToOtlpSpan(readableSpan, encoder);
          });
          scopeResourceSpans.push({
            scope: createInstrumentationScope(scopeSpans[0].instrumentationLibrary),
            spans,
            schemaUrl: scopeSpans[0].instrumentationLibrary.schemaUrl
          });
        }
        ilmEntry = ilmIterator.next();
      }
      var transformedSpans = {
        resource: createResource(resource),
        scopeSpans: scopeResourceSpans,
        schemaUrl: void 0
      };
      out.push(transformedSpans);
      entry = entryIterator.next();
    }
    return out;
  }

  // node_modules/@opentelemetry/otlp-transformer/build/esm/json/serializers.js
  var JsonTraceSerializer = {
    serializeRequest: function(arg) {
      var request = createExportTraceServiceRequest(arg, {
        useHex: true,
        useLongBits: false
      });
      var encoder = new TextEncoder();
      return encoder.encode(JSON.stringify(request));
    },
    deserializeResponse: function(arg) {
      var decoder = new TextDecoder();
      return JSON.parse(decoder.decode(arg));
    }
  };

  // node_modules/@opentelemetry/otlp-exporter-base/build/esm/retrying-transport.js
  var __awaiter5 = function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve) {
        resolve(value);
      });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  var __generator5 = function(thisArg, body) {
    var _ = { label: 0, sent: function() {
      if (t[0] & 1) throw t[1];
      return t[1];
    }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
      return this;
    }), g;
    function verb(n) {
      return function(v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (_) try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];
        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;
          case 4:
            _.label++;
            return { value: op[1], done: false };
          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;
          case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;
          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }
            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            if (t[2]) _.ops.pop();
            _.trys.pop();
            continue;
        }
        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
  var MAX_ATTEMPTS = 5;
  var INITIAL_BACKOFF = 1e3;
  var MAX_BACKOFF = 5e3;
  var BACKOFF_MULTIPLIER = 1.5;
  var JITTER = 0.2;
  function getJitter() {
    return Math.random() * (2 * JITTER) - JITTER;
  }
  var RetryingTransport = (
    /** @class */
    function() {
      function RetryingTransport2(_transport) {
        this._transport = _transport;
      }
      RetryingTransport2.prototype.retry = function(data, timeoutMillis, inMillis) {
        var _this = this;
        return new Promise(function(resolve, reject) {
          setTimeout(function() {
            _this._transport.send(data, timeoutMillis).then(resolve, reject);
          }, inMillis);
        });
      };
      RetryingTransport2.prototype.send = function(data, timeoutMillis) {
        var _a3;
        return __awaiter5(this, void 0, void 0, function() {
          var deadline, result, attempts, nextBackoff, backoff, retryInMillis, remainingTimeoutMillis;
          return __generator5(this, function(_b) {
            switch (_b.label) {
              case 0:
                deadline = Date.now() + timeoutMillis;
                return [4, this._transport.send(data, timeoutMillis)];
              case 1:
                result = _b.sent();
                attempts = MAX_ATTEMPTS;
                nextBackoff = INITIAL_BACKOFF;
                _b.label = 2;
              case 2:
                if (!(result.status === "retryable" && attempts > 0)) return [3, 4];
                attempts--;
                backoff = Math.max(Math.min(nextBackoff, MAX_BACKOFF) + getJitter(), 0);
                nextBackoff = nextBackoff * BACKOFF_MULTIPLIER;
                retryInMillis = (_a3 = result.retryInMillis) !== null && _a3 !== void 0 ? _a3 : backoff;
                remainingTimeoutMillis = deadline - Date.now();
                if (retryInMillis > remainingTimeoutMillis) {
                  return [2, result];
                }
                return [4, this.retry(data, remainingTimeoutMillis, retryInMillis)];
              case 3:
                result = _b.sent();
                return [3, 2];
              case 4:
                return [2, result];
            }
          });
        });
      };
      RetryingTransport2.prototype.shutdown = function() {
        return this._transport.shutdown();
      };
      return RetryingTransport2;
    }()
  );
  function createRetryingTransport(options) {
    return new RetryingTransport(options.transport);
  }

  // node_modules/@opentelemetry/otlp-exporter-base/build/esm/is-export-retryable.js
  function isExportRetryable(statusCode) {
    var retryCodes = [429, 502, 503, 504];
    return retryCodes.includes(statusCode);
  }
  function parseRetryAfterToMills(retryAfter) {
    if (retryAfter == null) {
      return void 0;
    }
    var seconds = Number.parseInt(retryAfter, 10);
    if (Number.isInteger(seconds)) {
      return seconds > 0 ? seconds * 1e3 : -1;
    }
    var delay = new Date(retryAfter).getTime() - Date.now();
    if (delay >= 0) {
      return delay;
    }
    return 0;
  }

  // node_modules/@opentelemetry/otlp-exporter-base/build/esm/transport/xhr-transport.js
  var __read15 = function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    } catch (error) {
      e = { error };
    } finally {
      try {
        if (r && !r.done && (m = i["return"])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }
    return ar;
  };
  var XhrTransport = (
    /** @class */
    function() {
      function XhrTransport2(_parameters) {
        this._parameters = _parameters;
      }
      XhrTransport2.prototype.send = function(data, timeoutMillis) {
        var _this = this;
        return new Promise(function(resolve) {
          var xhr = new XMLHttpRequest();
          xhr.timeout = timeoutMillis;
          xhr.open("POST", _this._parameters.url);
          var headers = _this._parameters.headers();
          Object.entries(headers).forEach(function(_a3) {
            var _b = __read15(_a3, 2), k = _b[0], v = _b[1];
            xhr.setRequestHeader(k, v);
          });
          xhr.ontimeout = function(_) {
            resolve({
              status: "failure",
              error: new Error("XHR request timed out")
            });
          };
          xhr.onreadystatechange = function() {
            if (xhr.status >= 200 && xhr.status <= 299) {
              diag2.debug("XHR success");
              resolve({
                status: "success"
              });
            } else if (xhr.status && isExportRetryable(xhr.status)) {
              resolve({
                status: "retryable",
                retryInMillis: parseRetryAfterToMills(xhr.getResponseHeader("Retry-After"))
              });
            } else if (xhr.status !== 0) {
              resolve({
                status: "failure",
                error: new Error("XHR request failed with non-retryable status")
              });
            }
          };
          xhr.onabort = function() {
            resolve({
              status: "failure",
              error: new Error("XHR request aborted")
            });
          };
          xhr.onerror = function() {
            resolve({
              status: "failure",
              error: new Error("XHR request errored")
            });
          };
          xhr.send(data);
        });
      };
      XhrTransport2.prototype.shutdown = function() {
      };
      return XhrTransport2;
    }()
  );
  function createXhrTransport(parameters) {
    return new XhrTransport(parameters);
  }

  // node_modules/@opentelemetry/otlp-exporter-base/build/esm/transport/send-beacon-transport.js
  var SendBeaconTransport = (
    /** @class */
    function() {
      function SendBeaconTransport2(_params) {
        this._params = _params;
      }
      SendBeaconTransport2.prototype.send = function(data) {
        var _this = this;
        return new Promise(function(resolve) {
          if (navigator.sendBeacon(_this._params.url, new Blob([data], { type: _this._params.blobType }))) {
            diag2.debug("SendBeacon success");
            resolve({
              status: "success"
            });
          } else {
            resolve({
              status: "failure",
              error: new Error("SendBeacon failed")
            });
          }
        });
      };
      SendBeaconTransport2.prototype.shutdown = function() {
      };
      return SendBeaconTransport2;
    }()
  );
  function createSendBeaconTransport(parameters) {
    return new SendBeaconTransport(parameters);
  }

  // node_modules/@opentelemetry/otlp-exporter-base/build/esm/otlp-browser-http-export-delegate.js
  function createOtlpXhrExportDelegate(options, serializer) {
    return createOtlpNetworkExportDelegate(options, serializer, createRetryingTransport({
      transport: createXhrTransport(options)
    }));
  }
  function createOtlpSendBeaconExportDelegate(options, serializer) {
    return createOtlpNetworkExportDelegate(options, serializer, createRetryingTransport({
      transport: createSendBeaconTransport({
        url: options.url,
        blobType: options.headers()["Content-Type"]
      })
    }));
  }

  // node_modules/@opentelemetry/otlp-exporter-base/build/esm/util.js
  var __read16 = function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    } catch (error) {
      e = { error };
    } finally {
      try {
        if (r && !r.done && (m = i["return"])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }
    return ar;
  };
  function validateAndNormalizeHeaders(partialHeaders) {
    return function() {
      var _a3;
      var headers = {};
      Object.entries((_a3 = partialHeaders === null || partialHeaders === void 0 ? void 0 : partialHeaders()) !== null && _a3 !== void 0 ? _a3 : {}).forEach(function(_a4) {
        var _b = __read16(_a4, 2), key = _b[0], value = _b[1];
        if (typeof value !== "undefined") {
          headers[key] = String(value);
        } else {
          diag2.warn('Header "' + key + '" has invalid value (' + value + ") and will be ignored");
        }
      });
      return headers;
    };
  }

  // node_modules/@opentelemetry/otlp-exporter-base/build/esm/configuration/otlp-http-configuration.js
  var __assign3 = function() {
    __assign3 = Object.assign || function(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
          t[p] = s[p];
      }
      return t;
    };
    return __assign3.apply(this, arguments);
  };
  function mergeHeaders(userProvidedHeaders, fallbackHeaders, defaultHeaders) {
    var requiredHeaders = __assign3({}, defaultHeaders());
    var headers = {};
    return function() {
      if (fallbackHeaders != null) {
        Object.assign(headers, fallbackHeaders());
      }
      if (userProvidedHeaders != null) {
        Object.assign(headers, userProvidedHeaders());
      }
      return Object.assign(headers, requiredHeaders);
    };
  }
  function validateUserProvidedUrl(url) {
    if (url == null) {
      return void 0;
    }
    try {
      new URL(url);
      return url;
    } catch (e) {
      throw new Error("Configuration: Could not parse user-provided export URL: '" + url + "'");
    }
  }
  function mergeOtlpHttpConfigurationWithDefaults(userProvidedConfiguration, fallbackConfiguration, defaultConfiguration) {
    var _a3, _b, _c, _d;
    return __assign3(__assign3({}, mergeOtlpSharedConfigurationWithDefaults(userProvidedConfiguration, fallbackConfiguration, defaultConfiguration)), { headers: mergeHeaders(validateAndNormalizeHeaders(userProvidedConfiguration.headers), fallbackConfiguration.headers, defaultConfiguration.headers), url: (_b = (_a3 = validateUserProvidedUrl(userProvidedConfiguration.url)) !== null && _a3 !== void 0 ? _a3 : fallbackConfiguration.url) !== null && _b !== void 0 ? _b : defaultConfiguration.url, agentOptions: (_d = (_c = userProvidedConfiguration.agentOptions) !== null && _c !== void 0 ? _c : fallbackConfiguration.agentOptions) !== null && _d !== void 0 ? _d : defaultConfiguration.agentOptions });
  }
  function getHttpConfigurationDefaults(requiredHeaders, signalResourcePath) {
    return __assign3(__assign3({}, getSharedConfigurationDefaults()), { headers: function() {
      return requiredHeaders;
    }, url: "http://localhost:4318/" + signalResourcePath, agentOptions: { keepAlive: true } });
  }

  // node_modules/@opentelemetry/otlp-exporter-base/build/esm/configuration/convert-legacy-browser-http-options.js
  function convertLegacyBrowserHttpOptions(config2, signalResourcePath, requiredHeaders) {
    return mergeOtlpHttpConfigurationWithDefaults(
      {
        url: config2.url,
        timeoutMillis: config2.timeoutMillis,
        headers: wrapStaticHeadersInFunction(config2.headers),
        concurrencyLimit: config2.concurrencyLimit
      },
      {},
      // no fallback for browser case
      getHttpConfigurationDefaults(requiredHeaders, signalResourcePath)
    );
  }

  // node_modules/@opentelemetry/otlp-exporter-base/build/esm/configuration/create-legacy-browser-delegate.js
  function createLegacyOtlpBrowserExportDelegate(config2, serializer, signalResourcePath, requiredHeaders) {
    var useXhr = !!config2.headers || typeof navigator.sendBeacon !== "function";
    var options = convertLegacyBrowserHttpOptions(config2, signalResourcePath, requiredHeaders);
    if (useXhr) {
      return createOtlpXhrExportDelegate(options, serializer);
    } else {
      return createOtlpSendBeaconExportDelegate(options, serializer);
    }
  }

  // node_modules/@opentelemetry/exporter-trace-otlp-http/build/esm/platform/browser/OTLPTraceExporter.js
  var __extends5 = /* @__PURE__ */ function() {
    var extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
        d2.__proto__ = b2;
      } || function(d2, b2) {
        for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
      };
      return extendStatics(d, b);
    };
    return function(d, b) {
      if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
  }();
  var OTLPTraceExporter = (
    /** @class */
    function(_super) {
      __extends5(OTLPTraceExporter2, _super);
      function OTLPTraceExporter2(config2) {
        if (config2 === void 0) {
          config2 = {};
        }
        return _super.call(this, createLegacyOtlpBrowserExportDelegate(config2, JsonTraceSerializer, "v1/traces", { "Content-Type": "application/json" })) || this;
      }
      return OTLPTraceExporter2;
    }(OTLPExporterBase)
  );

  // node_modules/@opentelemetry/semantic-conventions/build/esm/trace/SemanticAttributes.js
  var TMP_HTTP_URL = "http.url";
  var TMP_HTTP_USER_AGENT = "http.user_agent";
  var SEMATTRS_HTTP_URL = TMP_HTTP_URL;
  var SEMATTRS_HTTP_USER_AGENT = TMP_HTTP_USER_AGENT;

  // node_modules/@opentelemetry/semantic-conventions/build/esm/stable_attributes.js
  var ATTR_SERVICE_NAME = "service.name";
  var ATTR_SERVICE_VERSION = "service.version";

  // node_modules/@opentelemetry/api-logs/build/esm/NoopLogger.js
  var NoopLogger = (
    /** @class */
    function() {
      function NoopLogger3() {
      }
      NoopLogger3.prototype.emit = function(_logRecord) {
      };
      return NoopLogger3;
    }()
  );
  var NOOP_LOGGER = new NoopLogger();

  // node_modules/@opentelemetry/api-logs/build/esm/NoopLoggerProvider.js
  var NoopLoggerProvider = (
    /** @class */
    function() {
      function NoopLoggerProvider3() {
      }
      NoopLoggerProvider3.prototype.getLogger = function(_name, _version, _options) {
        return new NoopLogger();
      };
      return NoopLoggerProvider3;
    }()
  );
  var NOOP_LOGGER_PROVIDER = new NoopLoggerProvider();

  // node_modules/@opentelemetry/api-logs/build/esm/ProxyLogger.js
  var ProxyLogger = (
    /** @class */
    function() {
      function ProxyLogger3(_provider, name, version, options) {
        this._provider = _provider;
        this.name = name;
        this.version = version;
        this.options = options;
      }
      ProxyLogger3.prototype.emit = function(logRecord) {
        this._getLogger().emit(logRecord);
      };
      ProxyLogger3.prototype._getLogger = function() {
        if (this._delegate) {
          return this._delegate;
        }
        var logger = this._provider.getDelegateLogger(this.name, this.version, this.options);
        if (!logger) {
          return NOOP_LOGGER;
        }
        this._delegate = logger;
        return this._delegate;
      };
      return ProxyLogger3;
    }()
  );

  // node_modules/@opentelemetry/api-logs/build/esm/ProxyLoggerProvider.js
  var ProxyLoggerProvider = (
    /** @class */
    function() {
      function ProxyLoggerProvider3() {
      }
      ProxyLoggerProvider3.prototype.getLogger = function(name, version, options) {
        var _a3;
        return (_a3 = this.getDelegateLogger(name, version, options)) !== null && _a3 !== void 0 ? _a3 : new ProxyLogger(this, name, version, options);
      };
      ProxyLoggerProvider3.prototype.getDelegate = function() {
        var _a3;
        return (_a3 = this._delegate) !== null && _a3 !== void 0 ? _a3 : NOOP_LOGGER_PROVIDER;
      };
      ProxyLoggerProvider3.prototype.setDelegate = function(delegate) {
        this._delegate = delegate;
      };
      ProxyLoggerProvider3.prototype.getDelegateLogger = function(name, version, options) {
        var _a3;
        return (_a3 = this._delegate) === null || _a3 === void 0 ? void 0 : _a3.getLogger(name, version, options);
      };
      return ProxyLoggerProvider3;
    }()
  );

  // node_modules/@opentelemetry/api-logs/build/esm/platform/browser/globalThis.js
  var _globalThis3 = typeof globalThis === "object" ? globalThis : typeof self === "object" ? self : typeof window === "object" ? window : typeof global === "object" ? global : {};

  // node_modules/@opentelemetry/api-logs/build/esm/internal/global-utils.js
  var GLOBAL_LOGS_API_KEY = Symbol.for("io.opentelemetry.js.api.logs");
  var _global2 = _globalThis3;
  function makeGetter(requiredVersion, instance, fallback) {
    return function(version) {
      return version === requiredVersion ? instance : fallback;
    };
  }
  var API_BACKWARDS_COMPATIBILITY_VERSION = 1;

  // node_modules/@opentelemetry/api-logs/build/esm/api/logs.js
  var LogsAPI = (
    /** @class */
    function() {
      function LogsAPI3() {
        this._proxyLoggerProvider = new ProxyLoggerProvider();
      }
      LogsAPI3.getInstance = function() {
        if (!this._instance) {
          this._instance = new LogsAPI3();
        }
        return this._instance;
      };
      LogsAPI3.prototype.setGlobalLoggerProvider = function(provider) {
        if (_global2[GLOBAL_LOGS_API_KEY]) {
          return this.getLoggerProvider();
        }
        _global2[GLOBAL_LOGS_API_KEY] = makeGetter(API_BACKWARDS_COMPATIBILITY_VERSION, provider, NOOP_LOGGER_PROVIDER);
        this._proxyLoggerProvider.setDelegate(provider);
        return provider;
      };
      LogsAPI3.prototype.getLoggerProvider = function() {
        var _a3, _b;
        return (_b = (_a3 = _global2[GLOBAL_LOGS_API_KEY]) === null || _a3 === void 0 ? void 0 : _a3.call(_global2, API_BACKWARDS_COMPATIBILITY_VERSION)) !== null && _b !== void 0 ? _b : this._proxyLoggerProvider;
      };
      LogsAPI3.prototype.getLogger = function(name, version, options) {
        return this.getLoggerProvider().getLogger(name, version, options);
      };
      LogsAPI3.prototype.disable = function() {
        delete _global2[GLOBAL_LOGS_API_KEY];
        this._proxyLoggerProvider = new ProxyLoggerProvider();
      };
      return LogsAPI3;
    }()
  );

  // node_modules/@opentelemetry/api-logs/build/esm/index.js
  var logs = LogsAPI.getInstance();

  // node_modules/@opentelemetry/instrumentation/build/esm/autoLoaderUtils.js
  function enableInstrumentations(instrumentations, tracerProvider, meterProvider, loggerProvider) {
    for (var i = 0, j = instrumentations.length; i < j; i++) {
      var instrumentation = instrumentations[i];
      if (tracerProvider) {
        instrumentation.setTracerProvider(tracerProvider);
      }
      if (meterProvider) {
        instrumentation.setMeterProvider(meterProvider);
      }
      if (loggerProvider && instrumentation.setLoggerProvider) {
        instrumentation.setLoggerProvider(loggerProvider);
      }
      if (!instrumentation.getConfig().enabled) {
        instrumentation.enable();
      }
    }
  }
  function disableInstrumentations(instrumentations) {
    instrumentations.forEach(function(instrumentation) {
      return instrumentation.disable();
    });
  }

  // node_modules/@opentelemetry/instrumentation/build/esm/autoLoader.js
  function registerInstrumentations(options) {
    var _a3, _b;
    var tracerProvider = options.tracerProvider || trace.getTracerProvider();
    var meterProvider = options.meterProvider || metrics.getMeterProvider();
    var loggerProvider = options.loggerProvider || logs.getLoggerProvider();
    var instrumentations = (_b = (_a3 = options.instrumentations) === null || _a3 === void 0 ? void 0 : _a3.flat()) !== null && _b !== void 0 ? _b : [];
    enableInstrumentations(instrumentations, tracerProvider, meterProvider, loggerProvider);
    return function() {
      disableInstrumentations(instrumentations);
    };
  }

  // node_modules/@opentelemetry/instrumentation/build/esm/instrumentation.js
  var shimmer = __toESM(require_shimmer());
  var __assign4 = function() {
    __assign4 = Object.assign || function(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
          t[p] = s[p];
      }
      return t;
    };
    return __assign4.apply(this, arguments);
  };
  var InstrumentationAbstract = (
    /** @class */
    function() {
      function InstrumentationAbstract3(instrumentationName, instrumentationVersion, config2) {
        this.instrumentationName = instrumentationName;
        this.instrumentationVersion = instrumentationVersion;
        this._config = {};
        this._wrap = shimmer.wrap;
        this._unwrap = shimmer.unwrap;
        this._massWrap = shimmer.massWrap;
        this._massUnwrap = shimmer.massUnwrap;
        this.setConfig(config2);
        this._diag = diag2.createComponentLogger({
          namespace: instrumentationName
        });
        this._tracer = trace.getTracer(instrumentationName, instrumentationVersion);
        this._meter = metrics.getMeter(instrumentationName, instrumentationVersion);
        this._logger = logs.getLogger(instrumentationName, instrumentationVersion);
        this._updateMetricInstruments();
      }
      Object.defineProperty(InstrumentationAbstract3.prototype, "meter", {
        /* Returns meter */
        get: function() {
          return this._meter;
        },
        enumerable: false,
        configurable: true
      });
      InstrumentationAbstract3.prototype.setMeterProvider = function(meterProvider) {
        this._meter = meterProvider.getMeter(this.instrumentationName, this.instrumentationVersion);
        this._updateMetricInstruments();
      };
      Object.defineProperty(InstrumentationAbstract3.prototype, "logger", {
        /* Returns logger */
        get: function() {
          return this._logger;
        },
        enumerable: false,
        configurable: true
      });
      InstrumentationAbstract3.prototype.setLoggerProvider = function(loggerProvider) {
        this._logger = loggerProvider.getLogger(this.instrumentationName, this.instrumentationVersion);
      };
      InstrumentationAbstract3.prototype.getModuleDefinitions = function() {
        var _a3;
        var initResult = (_a3 = this.init()) !== null && _a3 !== void 0 ? _a3 : [];
        if (!Array.isArray(initResult)) {
          return [initResult];
        }
        return initResult;
      };
      InstrumentationAbstract3.prototype._updateMetricInstruments = function() {
        return;
      };
      InstrumentationAbstract3.prototype.getConfig = function() {
        return this._config;
      };
      InstrumentationAbstract3.prototype.setConfig = function(config2) {
        this._config = __assign4({ enabled: true }, config2);
      };
      InstrumentationAbstract3.prototype.setTracerProvider = function(tracerProvider) {
        this._tracer = tracerProvider.getTracer(this.instrumentationName, this.instrumentationVersion);
      };
      Object.defineProperty(InstrumentationAbstract3.prototype, "tracer", {
        /* Returns tracer */
        get: function() {
          return this._tracer;
        },
        enumerable: false,
        configurable: true
      });
      InstrumentationAbstract3.prototype._runSpanCustomizationHook = function(hookHandler, triggerName, span, info) {
        if (!hookHandler) {
          return;
        }
        try {
          hookHandler(span, info);
        } catch (e) {
          this._diag.error("Error running span customization hook due to exception in handler", { triggerName }, e);
        }
      };
      return InstrumentationAbstract3;
    }()
  );

  // node_modules/@opentelemetry/instrumentation/build/esm/platform/browser/instrumentation.js
  var __extends6 = /* @__PURE__ */ function() {
    var extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
        d2.__proto__ = b2;
      } || function(d2, b2) {
        for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
      };
      return extendStatics(d, b);
    };
    return function(d, b) {
      if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
  }();
  var InstrumentationBase = (
    /** @class */
    function(_super) {
      __extends6(InstrumentationBase3, _super);
      function InstrumentationBase3(instrumentationName, instrumentationVersion, config2) {
        var _this = _super.call(this, instrumentationName, instrumentationVersion, config2) || this;
        if (_this._config.enabled) {
          _this.enable();
        }
        return _this;
      }
      return InstrumentationBase3;
    }(InstrumentationAbstract)
  );

  // node_modules/@opentelemetry/instrumentation/build/esm/utils.js
  function safeExecuteInTheMiddle(execute, onFinish, preventThrowingError) {
    var error;
    var result;
    try {
      result = execute();
    } catch (e) {
      error = e;
    } finally {
      onFinish(error, result);
      if (error && !preventThrowingError) {
        throw error;
      }
      return result;
    }
  }
  function isWrapped(func) {
    return typeof func === "function" && typeof func.__original === "function" && typeof func.__unwrap === "function" && func.__wrapped === true;
  }

  // node_modules/@opentelemetry/instrumentation-document-load/node_modules/@opentelemetry/api-logs/build/esm/NoopLogger.js
  var NoopLogger2 = (
    /** @class */
    function() {
      function NoopLogger3() {
      }
      NoopLogger3.prototype.emit = function(_logRecord) {
      };
      return NoopLogger3;
    }()
  );
  var NOOP_LOGGER2 = new NoopLogger2();

  // node_modules/@opentelemetry/instrumentation-document-load/node_modules/@opentelemetry/api-logs/build/esm/NoopLoggerProvider.js
  var NoopLoggerProvider2 = (
    /** @class */
    function() {
      function NoopLoggerProvider3() {
      }
      NoopLoggerProvider3.prototype.getLogger = function(_name, _version, _options) {
        return new NoopLogger2();
      };
      return NoopLoggerProvider3;
    }()
  );
  var NOOP_LOGGER_PROVIDER2 = new NoopLoggerProvider2();

  // node_modules/@opentelemetry/instrumentation-document-load/node_modules/@opentelemetry/api-logs/build/esm/ProxyLogger.js
  var ProxyLogger2 = (
    /** @class */
    function() {
      function ProxyLogger3(_provider, name, version, options) {
        this._provider = _provider;
        this.name = name;
        this.version = version;
        this.options = options;
      }
      ProxyLogger3.prototype.emit = function(logRecord) {
        this._getLogger().emit(logRecord);
      };
      ProxyLogger3.prototype._getLogger = function() {
        if (this._delegate) {
          return this._delegate;
        }
        var logger = this._provider.getDelegateLogger(this.name, this.version, this.options);
        if (!logger) {
          return NOOP_LOGGER2;
        }
        this._delegate = logger;
        return this._delegate;
      };
      return ProxyLogger3;
    }()
  );

  // node_modules/@opentelemetry/instrumentation-document-load/node_modules/@opentelemetry/api-logs/build/esm/ProxyLoggerProvider.js
  var ProxyLoggerProvider2 = (
    /** @class */
    function() {
      function ProxyLoggerProvider3() {
      }
      ProxyLoggerProvider3.prototype.getLogger = function(name, version, options) {
        var _a3;
        return (_a3 = this.getDelegateLogger(name, version, options)) !== null && _a3 !== void 0 ? _a3 : new ProxyLogger2(this, name, version, options);
      };
      ProxyLoggerProvider3.prototype.getDelegate = function() {
        var _a3;
        return (_a3 = this._delegate) !== null && _a3 !== void 0 ? _a3 : NOOP_LOGGER_PROVIDER2;
      };
      ProxyLoggerProvider3.prototype.setDelegate = function(delegate) {
        this._delegate = delegate;
      };
      ProxyLoggerProvider3.prototype.getDelegateLogger = function(name, version, options) {
        var _a3;
        return (_a3 = this._delegate) === null || _a3 === void 0 ? void 0 : _a3.getLogger(name, version, options);
      };
      return ProxyLoggerProvider3;
    }()
  );

  // node_modules/@opentelemetry/instrumentation-document-load/node_modules/@opentelemetry/api-logs/build/esm/platform/browser/globalThis.js
  var _globalThis4 = typeof globalThis === "object" ? globalThis : typeof self === "object" ? self : typeof window === "object" ? window : typeof global === "object" ? global : {};

  // node_modules/@opentelemetry/instrumentation-document-load/node_modules/@opentelemetry/api-logs/build/esm/internal/global-utils.js
  var GLOBAL_LOGS_API_KEY2 = Symbol.for("io.opentelemetry.js.api.logs");
  var _global3 = _globalThis4;
  function makeGetter2(requiredVersion, instance, fallback) {
    return function(version) {
      return version === requiredVersion ? instance : fallback;
    };
  }
  var API_BACKWARDS_COMPATIBILITY_VERSION2 = 1;

  // node_modules/@opentelemetry/instrumentation-document-load/node_modules/@opentelemetry/api-logs/build/esm/api/logs.js
  var LogsAPI2 = (
    /** @class */
    function() {
      function LogsAPI3() {
        this._proxyLoggerProvider = new ProxyLoggerProvider2();
      }
      LogsAPI3.getInstance = function() {
        if (!this._instance) {
          this._instance = new LogsAPI3();
        }
        return this._instance;
      };
      LogsAPI3.prototype.setGlobalLoggerProvider = function(provider) {
        if (_global3[GLOBAL_LOGS_API_KEY2]) {
          return this.getLoggerProvider();
        }
        _global3[GLOBAL_LOGS_API_KEY2] = makeGetter2(API_BACKWARDS_COMPATIBILITY_VERSION2, provider, NOOP_LOGGER_PROVIDER2);
        this._proxyLoggerProvider.setDelegate(provider);
        return provider;
      };
      LogsAPI3.prototype.getLoggerProvider = function() {
        var _a3, _b;
        return (_b = (_a3 = _global3[GLOBAL_LOGS_API_KEY2]) === null || _a3 === void 0 ? void 0 : _a3.call(_global3, API_BACKWARDS_COMPATIBILITY_VERSION2)) !== null && _b !== void 0 ? _b : this._proxyLoggerProvider;
      };
      LogsAPI3.prototype.getLogger = function(name, version, options) {
        return this.getLoggerProvider().getLogger(name, version, options);
      };
      LogsAPI3.prototype.disable = function() {
        delete _global3[GLOBAL_LOGS_API_KEY2];
        this._proxyLoggerProvider = new ProxyLoggerProvider2();
      };
      return LogsAPI3;
    }()
  );

  // node_modules/@opentelemetry/instrumentation-document-load/node_modules/@opentelemetry/api-logs/build/esm/index.js
  var logs2 = LogsAPI2.getInstance();

  // node_modules/@opentelemetry/instrumentation-document-load/node_modules/@opentelemetry/instrumentation/build/esm/instrumentation.js
  var shimmer2 = __toESM(require_shimmer());
  var __assign5 = function() {
    __assign5 = Object.assign || function(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
          t[p] = s[p];
      }
      return t;
    };
    return __assign5.apply(this, arguments);
  };
  var InstrumentationAbstract2 = (
    /** @class */
    function() {
      function InstrumentationAbstract3(instrumentationName, instrumentationVersion, config2) {
        this.instrumentationName = instrumentationName;
        this.instrumentationVersion = instrumentationVersion;
        this._config = {};
        this._wrap = shimmer2.wrap;
        this._unwrap = shimmer2.unwrap;
        this._massWrap = shimmer2.massWrap;
        this._massUnwrap = shimmer2.massUnwrap;
        this.setConfig(config2);
        this._diag = diag2.createComponentLogger({
          namespace: instrumentationName
        });
        this._tracer = trace.getTracer(instrumentationName, instrumentationVersion);
        this._meter = metrics.getMeter(instrumentationName, instrumentationVersion);
        this._logger = logs2.getLogger(instrumentationName, instrumentationVersion);
        this._updateMetricInstruments();
      }
      Object.defineProperty(InstrumentationAbstract3.prototype, "meter", {
        /* Returns meter */
        get: function() {
          return this._meter;
        },
        enumerable: false,
        configurable: true
      });
      InstrumentationAbstract3.prototype.setMeterProvider = function(meterProvider) {
        this._meter = meterProvider.getMeter(this.instrumentationName, this.instrumentationVersion);
        this._updateMetricInstruments();
      };
      Object.defineProperty(InstrumentationAbstract3.prototype, "logger", {
        /* Returns logger */
        get: function() {
          return this._logger;
        },
        enumerable: false,
        configurable: true
      });
      InstrumentationAbstract3.prototype.setLoggerProvider = function(loggerProvider) {
        this._logger = loggerProvider.getLogger(this.instrumentationName, this.instrumentationVersion);
      };
      InstrumentationAbstract3.prototype.getModuleDefinitions = function() {
        var _a3;
        var initResult = (_a3 = this.init()) !== null && _a3 !== void 0 ? _a3 : [];
        if (!Array.isArray(initResult)) {
          return [initResult];
        }
        return initResult;
      };
      InstrumentationAbstract3.prototype._updateMetricInstruments = function() {
        return;
      };
      InstrumentationAbstract3.prototype.getConfig = function() {
        return this._config;
      };
      InstrumentationAbstract3.prototype.setConfig = function(config2) {
        this._config = __assign5({ enabled: true }, config2);
      };
      InstrumentationAbstract3.prototype.setTracerProvider = function(tracerProvider) {
        this._tracer = tracerProvider.getTracer(this.instrumentationName, this.instrumentationVersion);
      };
      Object.defineProperty(InstrumentationAbstract3.prototype, "tracer", {
        /* Returns tracer */
        get: function() {
          return this._tracer;
        },
        enumerable: false,
        configurable: true
      });
      InstrumentationAbstract3.prototype._runSpanCustomizationHook = function(hookHandler, triggerName, span, info) {
        if (!hookHandler) {
          return;
        }
        try {
          hookHandler(span, info);
        } catch (e) {
          this._diag.error("Error running span customization hook due to exception in handler", { triggerName }, e);
        }
      };
      return InstrumentationAbstract3;
    }()
  );

  // node_modules/@opentelemetry/instrumentation-document-load/node_modules/@opentelemetry/instrumentation/build/esm/platform/browser/instrumentation.js
  var __extends7 = /* @__PURE__ */ function() {
    var extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
        d2.__proto__ = b2;
      } || function(d2, b2) {
        for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
      };
      return extendStatics(d, b);
    };
    return function(d, b) {
      if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
  }();
  var InstrumentationBase2 = (
    /** @class */
    function(_super) {
      __extends7(InstrumentationBase3, _super);
      function InstrumentationBase3(instrumentationName, instrumentationVersion, config2) {
        var _this = _super.call(this, instrumentationName, instrumentationVersion, config2) || this;
        if (_this._config.enabled) {
          _this.enable();
        }
        return _this;
      }
      return InstrumentationBase3;
    }(InstrumentationAbstract2)
  );

  // node_modules/@opentelemetry/instrumentation-document-load/node_modules/@opentelemetry/instrumentation/build/esm/utils.js
  function safeExecuteInTheMiddle2(execute, onFinish, preventThrowingError) {
    var error;
    var result;
    try {
      result = execute();
    } catch (e) {
      error = e;
    } finally {
      onFinish(error, result);
      if (error && !preventThrowingError) {
        throw error;
      }
      return result;
    }
  }

  // node_modules/@opentelemetry/instrumentation-document-load/build/esm/enums/AttributeNames.js
  var AttributeNames;
  (function(AttributeNames4) {
    AttributeNames4["DOCUMENT_LOAD"] = "documentLoad";
    AttributeNames4["DOCUMENT_FETCH"] = "documentFetch";
    AttributeNames4["RESOURCE_FETCH"] = "resourceFetch";
  })(AttributeNames || (AttributeNames = {}));

  // node_modules/@opentelemetry/instrumentation-document-load/build/esm/version.js
  var PACKAGE_VERSION = "0.42.0";
  var PACKAGE_NAME = "@opentelemetry/instrumentation-document-load";

  // node_modules/@opentelemetry/instrumentation-document-load/build/esm/enums/EventNames.js
  var EventNames;
  (function(EventNames3) {
    EventNames3["FIRST_PAINT"] = "firstPaint";
    EventNames3["FIRST_CONTENTFUL_PAINT"] = "firstContentfulPaint";
  })(EventNames || (EventNames = {}));

  // node_modules/@opentelemetry/instrumentation-document-load/build/esm/utils.js
  var getPerformanceNavigationEntries = function() {
    var _a3, _b;
    var entries = {};
    var performanceNavigationTiming = (_b = (_a3 = otperformance).getEntriesByType) === null || _b === void 0 ? void 0 : _b.call(_a3, "navigation")[0];
    if (performanceNavigationTiming) {
      var keys = Object.values(PerformanceTimingNames);
      keys.forEach(function(key) {
        if (hasKey(performanceNavigationTiming, key)) {
          var value = performanceNavigationTiming[key];
          if (typeof value === "number") {
            entries[key] = value;
          }
        }
      });
    } else {
      var perf = otperformance;
      var performanceTiming_1 = perf.timing;
      if (performanceTiming_1) {
        var keys = Object.values(PerformanceTimingNames);
        keys.forEach(function(key) {
          if (hasKey(performanceTiming_1, key)) {
            var value = performanceTiming_1[key];
            if (typeof value === "number") {
              entries[key] = value;
            }
          }
        });
      }
    }
    return entries;
  };
  var performancePaintNames = {
    "first-paint": EventNames.FIRST_PAINT,
    "first-contentful-paint": EventNames.FIRST_CONTENTFUL_PAINT
  };
  var addSpanPerformancePaintEvents = function(span) {
    var _a3, _b;
    var performancePaintTiming = (_b = (_a3 = otperformance).getEntriesByType) === null || _b === void 0 ? void 0 : _b.call(_a3, "paint");
    if (performancePaintTiming) {
      performancePaintTiming.forEach(function(_a4) {
        var name = _a4.name, startTime = _a4.startTime;
        if (hasKey(performancePaintNames, name)) {
          span.addEvent(performancePaintNames[name], startTime);
        }
      });
    }
  };

  // node_modules/@opentelemetry/instrumentation-document-load/build/esm/instrumentation.js
  var __extends8 = /* @__PURE__ */ function() {
    var extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
        d2.__proto__ = b2;
      } || function(d2, b2) {
        for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
      };
      return extendStatics(d, b);
    };
    return function(d, b) {
      if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
  }();
  var DocumentLoadInstrumentation = (
    /** @class */
    function(_super) {
      __extends8(DocumentLoadInstrumentation2, _super);
      function DocumentLoadInstrumentation2(config2) {
        if (config2 === void 0) {
          config2 = {};
        }
        var _this = _super.call(this, PACKAGE_NAME, PACKAGE_VERSION, config2) || this;
        _this.component = "document-load";
        _this.version = "1";
        _this.moduleName = _this.component;
        return _this;
      }
      DocumentLoadInstrumentation2.prototype.init = function() {
      };
      DocumentLoadInstrumentation2.prototype._onDocumentLoaded = function() {
        var _this = this;
        window.setTimeout(function() {
          _this._collectPerformance();
        });
      };
      DocumentLoadInstrumentation2.prototype._addResourcesSpans = function(rootSpan) {
        var _this = this;
        var _a3, _b;
        var resources = (_b = (_a3 = otperformance).getEntriesByType) === null || _b === void 0 ? void 0 : _b.call(_a3, "resource");
        if (resources) {
          resources.forEach(function(resource) {
            _this._initResourceSpan(resource, rootSpan);
          });
        }
      };
      DocumentLoadInstrumentation2.prototype._collectPerformance = function() {
        var _this = this;
        var metaElement = Array.from(document.getElementsByTagName("meta")).find(function(e) {
          return e.getAttribute("name") === TRACE_PARENT_HEADER;
        });
        var entries = getPerformanceNavigationEntries();
        var traceparent = metaElement && metaElement.content || "";
        context.with(propagation.extract(ROOT_CONTEXT, { traceparent }), function() {
          var _a3;
          var rootSpan = _this._startSpan(AttributeNames.DOCUMENT_LOAD, PerformanceTimingNames.FETCH_START, entries);
          if (!rootSpan) {
            return;
          }
          context.with(trace.setSpan(context.active(), rootSpan), function() {
            var fetchSpan = _this._startSpan(AttributeNames.DOCUMENT_FETCH, PerformanceTimingNames.FETCH_START, entries);
            if (fetchSpan) {
              fetchSpan.setAttribute(SEMATTRS_HTTP_URL, location.href);
              context.with(trace.setSpan(context.active(), fetchSpan), function() {
                var _a4;
                if (!_this.getConfig().ignoreNetworkEvents) {
                  addSpanNetworkEvents(fetchSpan, entries);
                }
                _this._addCustomAttributesOnSpan(fetchSpan, (_a4 = _this.getConfig().applyCustomAttributesOnSpan) === null || _a4 === void 0 ? void 0 : _a4.documentFetch);
                _this._endSpan(fetchSpan, PerformanceTimingNames.RESPONSE_END, entries);
              });
            }
          });
          rootSpan.setAttribute(SEMATTRS_HTTP_URL, location.href);
          rootSpan.setAttribute(SEMATTRS_HTTP_USER_AGENT, navigator.userAgent);
          _this._addResourcesSpans(rootSpan);
          if (!_this.getConfig().ignoreNetworkEvents) {
            addSpanNetworkEvent(rootSpan, PerformanceTimingNames.FETCH_START, entries);
            addSpanNetworkEvent(rootSpan, PerformanceTimingNames.UNLOAD_EVENT_START, entries);
            addSpanNetworkEvent(rootSpan, PerformanceTimingNames.UNLOAD_EVENT_END, entries);
            addSpanNetworkEvent(rootSpan, PerformanceTimingNames.DOM_INTERACTIVE, entries);
            addSpanNetworkEvent(rootSpan, PerformanceTimingNames.DOM_CONTENT_LOADED_EVENT_START, entries);
            addSpanNetworkEvent(rootSpan, PerformanceTimingNames.DOM_CONTENT_LOADED_EVENT_END, entries);
            addSpanNetworkEvent(rootSpan, PerformanceTimingNames.DOM_COMPLETE, entries);
            addSpanNetworkEvent(rootSpan, PerformanceTimingNames.LOAD_EVENT_START, entries);
            addSpanNetworkEvent(rootSpan, PerformanceTimingNames.LOAD_EVENT_END, entries);
          }
          if (!_this.getConfig().ignorePerformancePaintEvents) {
            addSpanPerformancePaintEvents(rootSpan);
          }
          _this._addCustomAttributesOnSpan(rootSpan, (_a3 = _this.getConfig().applyCustomAttributesOnSpan) === null || _a3 === void 0 ? void 0 : _a3.documentLoad);
          _this._endSpan(rootSpan, PerformanceTimingNames.LOAD_EVENT_END, entries);
        });
      };
      DocumentLoadInstrumentation2.prototype._endSpan = function(span, performanceName, entries) {
        if (span) {
          if (hasKey(entries, performanceName)) {
            span.end(entries[performanceName]);
          } else {
            span.end();
          }
        }
      };
      DocumentLoadInstrumentation2.prototype._initResourceSpan = function(resource, parentSpan) {
        var _a3;
        var span = this._startSpan(AttributeNames.RESOURCE_FETCH, PerformanceTimingNames.FETCH_START, resource, parentSpan);
        if (span) {
          span.setAttribute(SEMATTRS_HTTP_URL, resource.name);
          if (!this.getConfig().ignoreNetworkEvents) {
            addSpanNetworkEvents(span, resource);
          }
          this._addCustomAttributesOnResourceSpan(span, resource, (_a3 = this.getConfig().applyCustomAttributesOnSpan) === null || _a3 === void 0 ? void 0 : _a3.resourceFetch);
          this._endSpan(span, PerformanceTimingNames.RESPONSE_END, resource);
        }
      };
      DocumentLoadInstrumentation2.prototype._startSpan = function(spanName, performanceName, entries, parentSpan) {
        if (hasKey(entries, performanceName) && typeof entries[performanceName] === "number") {
          var span = this.tracer.startSpan(spanName, {
            startTime: entries[performanceName]
          }, parentSpan ? trace.setSpan(context.active(), parentSpan) : void 0);
          return span;
        }
        return void 0;
      };
      DocumentLoadInstrumentation2.prototype._waitForPageLoad = function() {
        if (window.document.readyState === "complete") {
          this._onDocumentLoaded();
        } else {
          this._onDocumentLoaded = this._onDocumentLoaded.bind(this);
          window.addEventListener("load", this._onDocumentLoaded);
        }
      };
      DocumentLoadInstrumentation2.prototype._addCustomAttributesOnSpan = function(span, applyCustomAttributesOnSpan) {
        var _this = this;
        if (applyCustomAttributesOnSpan) {
          safeExecuteInTheMiddle2(function() {
            return applyCustomAttributesOnSpan(span);
          }, function(error) {
            if (!error) {
              return;
            }
            _this._diag.error("addCustomAttributesOnSpan", error);
          }, true);
        }
      };
      DocumentLoadInstrumentation2.prototype._addCustomAttributesOnResourceSpan = function(span, resource, applyCustomAttributesOnSpan) {
        var _this = this;
        if (applyCustomAttributesOnSpan) {
          safeExecuteInTheMiddle2(function() {
            return applyCustomAttributesOnSpan(span, resource);
          }, function(error) {
            if (!error) {
              return;
            }
            _this._diag.error("addCustomAttributesOnResourceSpan", error);
          }, true);
        }
      };
      DocumentLoadInstrumentation2.prototype.enable = function() {
        window.removeEventListener("load", this._onDocumentLoaded);
        this._waitForPageLoad();
      };
      DocumentLoadInstrumentation2.prototype.disable = function() {
        window.removeEventListener("load", this._onDocumentLoaded);
      };
      return DocumentLoadInstrumentation2;
    }(InstrumentationBase2)
  );

  // node_modules/@opentelemetry/instrumentation-fetch/node_modules/@opentelemetry/core/build/esm/platform/browser/globalThis.js
  var _globalThis5 = typeof globalThis === "object" ? globalThis : typeof self === "object" ? self : typeof window === "object" ? window : typeof global === "object" ? global : {};

  // node_modules/@opentelemetry/instrumentation-fetch/node_modules/@opentelemetry/core/build/esm/platform/browser/performance.js
  var otperformance2 = performance;

  // node_modules/@opentelemetry/instrumentation-fetch/node_modules/@opentelemetry/semantic-conventions/build/esm/trace/SemanticAttributes.js
  var TMP_HTTP_METHOD = "http.method";
  var TMP_HTTP_URL2 = "http.url";
  var TMP_HTTP_HOST = "http.host";
  var TMP_HTTP_SCHEME = "http.scheme";
  var TMP_HTTP_STATUS_CODE = "http.status_code";
  var TMP_HTTP_USER_AGENT2 = "http.user_agent";
  var TMP_HTTP_REQUEST_CONTENT_LENGTH_UNCOMPRESSED = "http.request_content_length_uncompressed";
  var TMP_HTTP_RESPONSE_CONTENT_LENGTH2 = "http.response_content_length";
  var TMP_HTTP_RESPONSE_CONTENT_LENGTH_UNCOMPRESSED2 = "http.response_content_length_uncompressed";
  var SEMATTRS_HTTP_METHOD = TMP_HTTP_METHOD;
  var SEMATTRS_HTTP_URL2 = TMP_HTTP_URL2;
  var SEMATTRS_HTTP_HOST = TMP_HTTP_HOST;
  var SEMATTRS_HTTP_SCHEME = TMP_HTTP_SCHEME;
  var SEMATTRS_HTTP_STATUS_CODE = TMP_HTTP_STATUS_CODE;
  var SEMATTRS_HTTP_USER_AGENT2 = TMP_HTTP_USER_AGENT2;
  var SEMATTRS_HTTP_REQUEST_CONTENT_LENGTH_UNCOMPRESSED = TMP_HTTP_REQUEST_CONTENT_LENGTH_UNCOMPRESSED;
  var SEMATTRS_HTTP_RESPONSE_CONTENT_LENGTH2 = TMP_HTTP_RESPONSE_CONTENT_LENGTH2;
  var SEMATTRS_HTTP_RESPONSE_CONTENT_LENGTH_UNCOMPRESSED2 = TMP_HTTP_RESPONSE_CONTENT_LENGTH_UNCOMPRESSED2;

  // node_modules/@opentelemetry/instrumentation-fetch/node_modules/@opentelemetry/core/build/esm/common/time.js
  var NANOSECOND_DIGITS3 = 9;
  var NANOSECOND_DIGITS_IN_MILLIS3 = 6;
  var MILLISECONDS_TO_NANOSECONDS3 = Math.pow(10, NANOSECOND_DIGITS_IN_MILLIS3);
  var SECOND_TO_NANOSECONDS3 = Math.pow(10, NANOSECOND_DIGITS3);
  function millisToHrTime3(epochMillis) {
    var epochSeconds = epochMillis / 1e3;
    var seconds = Math.trunc(epochSeconds);
    var nanos = Math.round(epochMillis % 1e3 * MILLISECONDS_TO_NANOSECONDS3);
    return [seconds, nanos];
  }
  function getTimeOrigin3() {
    var timeOrigin = otperformance2.timeOrigin;
    if (typeof timeOrigin !== "number") {
      var perf = otperformance2;
      timeOrigin = perf.timing && perf.timing.fetchStart;
    }
    return timeOrigin;
  }
  function hrTime3(performanceNow) {
    var timeOrigin = millisToHrTime3(getTimeOrigin3());
    var now = millisToHrTime3(typeof performanceNow === "number" ? performanceNow : otperformance2.now());
    return addHrTimes3(timeOrigin, now);
  }
  function timeInputToHrTime3(time) {
    if (isTimeInputHrTime3(time)) {
      return time;
    } else if (typeof time === "number") {
      if (time < getTimeOrigin3()) {
        return hrTime3(time);
      } else {
        return millisToHrTime3(time);
      }
    } else if (time instanceof Date) {
      return millisToHrTime3(time.getTime());
    } else {
      throw TypeError("Invalid input type");
    }
  }
  function hrTimeToNanoseconds3(time) {
    return time[0] * SECOND_TO_NANOSECONDS3 + time[1];
  }
  function isTimeInputHrTime3(value) {
    return Array.isArray(value) && value.length === 2 && typeof value[0] === "number" && typeof value[1] === "number";
  }
  function addHrTimes3(time1, time2) {
    var out = [time1[0] + time2[0], time1[1] + time2[1]];
    if (out[1] >= SECOND_TO_NANOSECONDS3) {
      out[1] -= SECOND_TO_NANOSECONDS3;
      out[0] += 1;
    }
    return out;
  }

  // node_modules/@opentelemetry/instrumentation-fetch/node_modules/@opentelemetry/core/build/esm/utils/url.js
  var __values8 = function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
      next: function() {
        if (o && i >= o.length) o = void 0;
        return { value: o && o[i++], done: !o };
      }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
  };
  function urlMatches(url, urlToMatch) {
    if (typeof urlToMatch === "string") {
      return url === urlToMatch;
    } else {
      return !!url.match(urlToMatch);
    }
  }
  function isUrlIgnored(url, ignoredUrls) {
    var e_1, _a3;
    if (!ignoredUrls) {
      return false;
    }
    try {
      for (var ignoredUrls_1 = __values8(ignoredUrls), ignoredUrls_1_1 = ignoredUrls_1.next(); !ignoredUrls_1_1.done; ignoredUrls_1_1 = ignoredUrls_1.next()) {
        var ignoreUrl = ignoredUrls_1_1.value;
        if (urlMatches(url, ignoreUrl)) {
          return true;
        }
      }
    } catch (e_1_1) {
      e_1 = { error: e_1_1 };
    } finally {
      try {
        if (ignoredUrls_1_1 && !ignoredUrls_1_1.done && (_a3 = ignoredUrls_1.return)) _a3.call(ignoredUrls_1);
      } finally {
        if (e_1) throw e_1.error;
      }
    }
    return false;
  }

  // node_modules/@opentelemetry/instrumentation-fetch/node_modules/@opentelemetry/sdk-trace-web/build/esm/enums/PerformanceTimingNames.js
  var PerformanceTimingNames2;
  (function(PerformanceTimingNames4) {
    PerformanceTimingNames4["CONNECT_END"] = "connectEnd";
    PerformanceTimingNames4["CONNECT_START"] = "connectStart";
    PerformanceTimingNames4["DECODED_BODY_SIZE"] = "decodedBodySize";
    PerformanceTimingNames4["DOM_COMPLETE"] = "domComplete";
    PerformanceTimingNames4["DOM_CONTENT_LOADED_EVENT_END"] = "domContentLoadedEventEnd";
    PerformanceTimingNames4["DOM_CONTENT_LOADED_EVENT_START"] = "domContentLoadedEventStart";
    PerformanceTimingNames4["DOM_INTERACTIVE"] = "domInteractive";
    PerformanceTimingNames4["DOMAIN_LOOKUP_END"] = "domainLookupEnd";
    PerformanceTimingNames4["DOMAIN_LOOKUP_START"] = "domainLookupStart";
    PerformanceTimingNames4["ENCODED_BODY_SIZE"] = "encodedBodySize";
    PerformanceTimingNames4["FETCH_START"] = "fetchStart";
    PerformanceTimingNames4["LOAD_EVENT_END"] = "loadEventEnd";
    PerformanceTimingNames4["LOAD_EVENT_START"] = "loadEventStart";
    PerformanceTimingNames4["NAVIGATION_START"] = "navigationStart";
    PerformanceTimingNames4["REDIRECT_END"] = "redirectEnd";
    PerformanceTimingNames4["REDIRECT_START"] = "redirectStart";
    PerformanceTimingNames4["REQUEST_START"] = "requestStart";
    PerformanceTimingNames4["RESPONSE_END"] = "responseEnd";
    PerformanceTimingNames4["RESPONSE_START"] = "responseStart";
    PerformanceTimingNames4["SECURE_CONNECTION_START"] = "secureConnectionStart";
    PerformanceTimingNames4["UNLOAD_EVENT_END"] = "unloadEventEnd";
    PerformanceTimingNames4["UNLOAD_EVENT_START"] = "unloadEventStart";
  })(PerformanceTimingNames2 || (PerformanceTimingNames2 = {}));

  // node_modules/@opentelemetry/instrumentation-fetch/node_modules/@opentelemetry/sdk-trace-web/build/esm/utils.js
  var urlNormalizingAnchor;
  function getUrlNormalizingAnchor() {
    if (!urlNormalizingAnchor) {
      urlNormalizingAnchor = document.createElement("a");
    }
    return urlNormalizingAnchor;
  }
  function hasKey2(obj, key) {
    return key in obj;
  }
  function addSpanNetworkEvent2(span, performanceName, entries, refPerfName) {
    var perfTime = void 0;
    var refTime = void 0;
    if (hasKey2(entries, performanceName) && typeof entries[performanceName] === "number") {
      perfTime = entries[performanceName];
    }
    var refName = refPerfName || PerformanceTimingNames2.FETCH_START;
    if (hasKey2(entries, refName) && typeof entries[refName] === "number") {
      refTime = entries[refName];
    }
    if (perfTime !== void 0 && refTime !== void 0 && perfTime >= refTime) {
      span.addEvent(performanceName, perfTime);
      return span;
    }
    return void 0;
  }
  function addSpanNetworkEvents2(span, resource) {
    addSpanNetworkEvent2(span, PerformanceTimingNames2.FETCH_START, resource);
    addSpanNetworkEvent2(span, PerformanceTimingNames2.DOMAIN_LOOKUP_START, resource);
    addSpanNetworkEvent2(span, PerformanceTimingNames2.DOMAIN_LOOKUP_END, resource);
    addSpanNetworkEvent2(span, PerformanceTimingNames2.CONNECT_START, resource);
    if (hasKey2(resource, "name") && resource["name"].startsWith("https:")) {
      addSpanNetworkEvent2(span, PerformanceTimingNames2.SECURE_CONNECTION_START, resource);
    }
    addSpanNetworkEvent2(span, PerformanceTimingNames2.CONNECT_END, resource);
    addSpanNetworkEvent2(span, PerformanceTimingNames2.REQUEST_START, resource);
    addSpanNetworkEvent2(span, PerformanceTimingNames2.RESPONSE_START, resource);
    addSpanNetworkEvent2(span, PerformanceTimingNames2.RESPONSE_END, resource);
    var encodedLength = resource[PerformanceTimingNames2.ENCODED_BODY_SIZE];
    if (encodedLength !== void 0) {
      span.setAttribute(SEMATTRS_HTTP_RESPONSE_CONTENT_LENGTH2, encodedLength);
    }
    var decodedLength = resource[PerformanceTimingNames2.DECODED_BODY_SIZE];
    if (decodedLength !== void 0 && encodedLength !== decodedLength) {
      span.setAttribute(SEMATTRS_HTTP_RESPONSE_CONTENT_LENGTH_UNCOMPRESSED2, decodedLength);
    }
  }
  function sortResources2(filteredResources) {
    return filteredResources.slice().sort(function(a, b) {
      var valueA = a[PerformanceTimingNames2.FETCH_START];
      var valueB = b[PerformanceTimingNames2.FETCH_START];
      if (valueA > valueB) {
        return 1;
      } else if (valueA < valueB) {
        return -1;
      }
      return 0;
    });
  }
  function getOrigin() {
    return typeof location !== "undefined" ? location.origin : void 0;
  }
  function getResource2(spanUrl, startTimeHR, endTimeHR, resources, ignoredResources, initiatorType) {
    if (ignoredResources === void 0) {
      ignoredResources = /* @__PURE__ */ new WeakSet();
    }
    var parsedSpanUrl = parseUrl2(spanUrl);
    spanUrl = parsedSpanUrl.toString();
    var filteredResources = filterResourcesForSpan(spanUrl, startTimeHR, endTimeHR, resources, ignoredResources, initiatorType);
    if (filteredResources.length === 0) {
      return {
        mainRequest: void 0
      };
    }
    if (filteredResources.length === 1) {
      return {
        mainRequest: filteredResources[0]
      };
    }
    var sorted = sortResources2(filteredResources);
    if (parsedSpanUrl.origin !== getOrigin() && sorted.length > 1) {
      var corsPreFlightRequest = sorted[0];
      var mainRequest = findMainRequest(sorted, corsPreFlightRequest[PerformanceTimingNames2.RESPONSE_END], endTimeHR);
      var responseEnd = corsPreFlightRequest[PerformanceTimingNames2.RESPONSE_END];
      var fetchStart = mainRequest[PerformanceTimingNames2.FETCH_START];
      if (fetchStart < responseEnd) {
        mainRequest = corsPreFlightRequest;
        corsPreFlightRequest = void 0;
      }
      return {
        corsPreFlightRequest,
        mainRequest
      };
    } else {
      return {
        mainRequest: filteredResources[0]
      };
    }
  }
  function findMainRequest(resources, corsPreFlightRequestEndTime, spanEndTimeHR) {
    var spanEndTime = hrTimeToNanoseconds3(spanEndTimeHR);
    var minTime = hrTimeToNanoseconds3(timeInputToHrTime3(corsPreFlightRequestEndTime));
    var mainRequest = resources[1];
    var bestGap;
    var length = resources.length;
    for (var i = 1; i < length; i++) {
      var resource = resources[i];
      var resourceStartTime = hrTimeToNanoseconds3(timeInputToHrTime3(resource[PerformanceTimingNames2.FETCH_START]));
      var resourceEndTime = hrTimeToNanoseconds3(timeInputToHrTime3(resource[PerformanceTimingNames2.RESPONSE_END]));
      var currentGap = spanEndTime - resourceEndTime;
      if (resourceStartTime >= minTime && (!bestGap || currentGap < bestGap)) {
        bestGap = currentGap;
        mainRequest = resource;
      }
    }
    return mainRequest;
  }
  function filterResourcesForSpan(spanUrl, startTimeHR, endTimeHR, resources, ignoredResources, initiatorType) {
    var startTime = hrTimeToNanoseconds3(startTimeHR);
    var endTime = hrTimeToNanoseconds3(endTimeHR);
    var filteredResources = resources.filter(function(resource) {
      var resourceStartTime = hrTimeToNanoseconds3(timeInputToHrTime3(resource[PerformanceTimingNames2.FETCH_START]));
      var resourceEndTime = hrTimeToNanoseconds3(timeInputToHrTime3(resource[PerformanceTimingNames2.RESPONSE_END]));
      return resource.initiatorType.toLowerCase() === (initiatorType || "xmlhttprequest") && resource.name === spanUrl && resourceStartTime >= startTime && resourceEndTime <= endTime;
    });
    if (filteredResources.length > 0) {
      filteredResources = filteredResources.filter(function(resource) {
        return !ignoredResources.has(resource);
      });
    }
    return filteredResources;
  }
  function parseUrl2(url) {
    if (typeof URL === "function") {
      return new URL(url, typeof document !== "undefined" ? document.baseURI : typeof location !== "undefined" ? location.href : void 0);
    }
    var element = getUrlNormalizingAnchor();
    element.href = url;
    return element;
  }
  function shouldPropagateTraceHeaders2(spanUrl, propagateTraceHeaderCorsUrls) {
    var propagateTraceHeaderUrls = propagateTraceHeaderCorsUrls || [];
    if (typeof propagateTraceHeaderUrls === "string" || propagateTraceHeaderUrls instanceof RegExp) {
      propagateTraceHeaderUrls = [propagateTraceHeaderUrls];
    }
    var parsedSpanUrl = parseUrl2(spanUrl);
    if (parsedSpanUrl.origin === getOrigin()) {
      return true;
    } else {
      return propagateTraceHeaderUrls.some(function(propagateTraceHeaderUrl) {
        return urlMatches(spanUrl, propagateTraceHeaderUrl);
      });
    }
  }

  // node_modules/@opentelemetry/instrumentation-fetch/build/esm/enums/AttributeNames.js
  var AttributeNames2;
  (function(AttributeNames4) {
    AttributeNames4["COMPONENT"] = "component";
    AttributeNames4["HTTP_ERROR_NAME"] = "http.error_name";
    AttributeNames4["HTTP_STATUS_TEXT"] = "http.status_text";
  })(AttributeNames2 || (AttributeNames2 = {}));

  // node_modules/@opentelemetry/instrumentation-fetch/build/esm/utils.js
  var __awaiter6 = function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve) {
        resolve(value);
      });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  var __generator6 = function(thisArg, body) {
    var _ = { label: 0, sent: function() {
      if (t[0] & 1) throw t[1];
      return t[1];
    }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
      return this;
    }), g;
    function verb(n) {
      return function(v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (_) try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];
        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;
          case 4:
            _.label++;
            return { value: op[1], done: false };
          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;
          case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;
          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }
            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            if (t[2]) _.ops.pop();
            _.trys.pop();
            continue;
        }
        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
  var __values9 = function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
      next: function() {
        if (o && i >= o.length) o = void 0;
        return { value: o && o[i++], done: !o };
      }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
  };
  var __read17 = function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    } catch (error) {
      e = { error };
    } finally {
      try {
        if (r && !r.done && (m = i["return"])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }
    return ar;
  };
  var DIAG_LOGGER = diag2.createComponentLogger({
    namespace: "@opentelemetry/opentelemetry-instrumentation-fetch/utils"
  });
  function getFetchBodyLength() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }
    if (args[0] instanceof URL || typeof args[0] === "string") {
      var requestInit = args[1];
      if (!(requestInit === null || requestInit === void 0 ? void 0 : requestInit.body)) {
        return Promise.resolve();
      }
      if (requestInit.body instanceof ReadableStream) {
        var _a3 = _getBodyNonDestructively(requestInit.body), body = _a3.body, length_1 = _a3.length;
        requestInit.body = body;
        return length_1;
      } else {
        return Promise.resolve(getXHRBodyLength(requestInit.body));
      }
    } else {
      var info = args[0];
      if (!(info === null || info === void 0 ? void 0 : info.body)) {
        return Promise.resolve();
      }
      return info.clone().text().then(function(t) {
        return getByteLength(t);
      });
    }
  }
  function _getBodyNonDestructively(body) {
    if (!body.pipeThrough) {
      DIAG_LOGGER.warn("Platform has ReadableStream but not pipeThrough!");
      return {
        body,
        length: Promise.resolve(void 0)
      };
    }
    var length = 0;
    var resolveLength;
    var lengthPromise = new Promise(function(resolve) {
      resolveLength = resolve;
    });
    var transform = new TransformStream({
      start: function() {
      },
      transform: function(chunk, controller) {
        return __awaiter6(this, void 0, void 0, function() {
          var bytearray;
          return __generator6(this, function(_a3) {
            switch (_a3.label) {
              case 0:
                return [4, chunk];
              case 1:
                bytearray = _a3.sent();
                length += bytearray.byteLength;
                controller.enqueue(chunk);
                return [
                  2
                  /*return*/
                ];
            }
          });
        });
      },
      flush: function() {
        resolveLength(length);
      }
    });
    return {
      body: body.pipeThrough(transform),
      length: lengthPromise
    };
  }
  function getXHRBodyLength(body) {
    if (typeof Document !== "undefined" && body instanceof Document) {
      return new XMLSerializer().serializeToString(document).length;
    }
    if (body instanceof Blob) {
      return body.size;
    }
    if (body.byteLength !== void 0) {
      return body.byteLength;
    }
    if (body instanceof FormData) {
      return getFormDataSize(body);
    }
    if (body instanceof URLSearchParams) {
      return getByteLength(body.toString());
    }
    if (typeof body === "string") {
      return getByteLength(body);
    }
    DIAG_LOGGER.warn("unknown body type");
    return void 0;
  }
  var TEXT_ENCODER = new TextEncoder();
  function getByteLength(s) {
    return TEXT_ENCODER.encode(s).byteLength;
  }
  function getFormDataSize(formData) {
    var e_1, _a3;
    var size = 0;
    try {
      for (var _b = __values9(formData.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
        var _d = __read17(_c.value, 2), key = _d[0], value = _d[1];
        size += key.length;
        if (value instanceof Blob) {
          size += value.size;
        } else {
          size += value.length;
        }
      }
    } catch (e_1_1) {
      e_1 = { error: e_1_1 };
    } finally {
      try {
        if (_c && !_c.done && (_a3 = _b.return)) _a3.call(_b);
      } finally {
        if (e_1) throw e_1.error;
      }
    }
    return size;
  }

  // node_modules/@opentelemetry/instrumentation-fetch/build/esm/version.js
  var VERSION4 = "0.56.0";

  // node_modules/@opentelemetry/instrumentation-fetch/build/esm/fetch.js
  var __extends9 = /* @__PURE__ */ function() {
    var extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
        d2.__proto__ = b2;
      } || function(d2, b2) {
        for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
      };
      return extendStatics(d, b);
    };
    return function(d, b) {
      if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
  }();
  var __read18 = function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    } catch (error) {
      e = { error };
    } finally {
      try {
        if (r && !r.done && (m = i["return"])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }
    return ar;
  };
  var __spreadArray9 = function(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
      if (ar || !(i in from)) {
        if (!ar) ar = Array.prototype.slice.call(from, 0, i);
        ar[i] = from[i];
      }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
  var _a2;
  var OBSERVER_WAIT_TIME_MS = 300;
  var isNode = typeof process === "object" && ((_a2 = process.release) === null || _a2 === void 0 ? void 0 : _a2.name) === "node";
  var FetchInstrumentation = (
    /** @class */
    function(_super) {
      __extends9(FetchInstrumentation2, _super);
      function FetchInstrumentation2(config2) {
        if (config2 === void 0) {
          config2 = {};
        }
        var _this = _super.call(this, "@opentelemetry/instrumentation-fetch", VERSION4, config2) || this;
        _this.component = "fetch";
        _this.version = VERSION4;
        _this.moduleName = _this.component;
        _this._usedResources = /* @__PURE__ */ new WeakSet();
        _this._tasksCount = 0;
        return _this;
      }
      FetchInstrumentation2.prototype.init = function() {
      };
      FetchInstrumentation2.prototype._addChildSpan = function(span, corsPreFlightRequest) {
        var childSpan = this.tracer.startSpan("CORS Preflight", {
          startTime: corsPreFlightRequest[PerformanceTimingNames2.FETCH_START]
        }, trace.setSpan(context.active(), span));
        if (!this.getConfig().ignoreNetworkEvents) {
          addSpanNetworkEvents2(childSpan, corsPreFlightRequest);
        }
        childSpan.end(corsPreFlightRequest[PerformanceTimingNames2.RESPONSE_END]);
      };
      FetchInstrumentation2.prototype._addFinalSpanAttributes = function(span, response) {
        var parsedUrl = parseUrl2(response.url);
        span.setAttribute(SEMATTRS_HTTP_STATUS_CODE, response.status);
        if (response.statusText != null) {
          span.setAttribute(AttributeNames2.HTTP_STATUS_TEXT, response.statusText);
        }
        span.setAttribute(SEMATTRS_HTTP_HOST, parsedUrl.host);
        span.setAttribute(SEMATTRS_HTTP_SCHEME, parsedUrl.protocol.replace(":", ""));
        if (typeof navigator !== "undefined") {
          span.setAttribute(SEMATTRS_HTTP_USER_AGENT2, navigator.userAgent);
        }
      };
      FetchInstrumentation2.prototype._addHeaders = function(options, spanUrl) {
        if (!shouldPropagateTraceHeaders2(spanUrl, this.getConfig().propagateTraceHeaderCorsUrls)) {
          var headers = {};
          propagation.inject(context.active(), headers);
          if (Object.keys(headers).length > 0) {
            this._diag.debug("headers inject skipped due to CORS policy");
          }
          return;
        }
        if (options instanceof Request) {
          propagation.inject(context.active(), options.headers, {
            set: function(h, k, v) {
              return h.set(k, typeof v === "string" ? v : String(v));
            }
          });
        } else if (options.headers instanceof Headers) {
          propagation.inject(context.active(), options.headers, {
            set: function(h, k, v) {
              return h.set(k, typeof v === "string" ? v : String(v));
            }
          });
        } else if (options.headers instanceof Map) {
          propagation.inject(context.active(), options.headers, {
            set: function(h, k, v) {
              return h.set(k, typeof v === "string" ? v : String(v));
            }
          });
        } else {
          var headers = {};
          propagation.inject(context.active(), headers);
          options.headers = Object.assign({}, headers, options.headers || {});
        }
      };
      FetchInstrumentation2.prototype._clearResources = function() {
        if (this._tasksCount === 0 && this.getConfig().clearTimingResources) {
          performance.clearResourceTimings();
          this._usedResources = /* @__PURE__ */ new WeakSet();
        }
      };
      FetchInstrumentation2.prototype._createSpan = function(url, options) {
        var _a3;
        if (options === void 0) {
          options = {};
        }
        if (isUrlIgnored(url, this.getConfig().ignoreUrls)) {
          this._diag.debug("ignoring span as url matches ignored url");
          return;
        }
        var method = (options.method || "GET").toUpperCase();
        var spanName = "HTTP " + method;
        return this.tracer.startSpan(spanName, {
          kind: SpanKind.CLIENT,
          attributes: (_a3 = {}, _a3[AttributeNames2.COMPONENT] = this.moduleName, _a3[SEMATTRS_HTTP_METHOD] = method, _a3[SEMATTRS_HTTP_URL2] = url, _a3)
        });
      };
      FetchInstrumentation2.prototype._findResourceAndAddNetworkEvents = function(span, resourcesObserver, endTime) {
        var resources = resourcesObserver.entries;
        if (!resources.length) {
          if (!performance.getEntriesByType) {
            return;
          }
          resources = performance.getEntriesByType("resource");
        }
        var resource = getResource2(resourcesObserver.spanUrl, resourcesObserver.startTime, endTime, resources, this._usedResources, "fetch");
        if (resource.mainRequest) {
          var mainRequest = resource.mainRequest;
          this._markResourceAsUsed(mainRequest);
          var corsPreFlightRequest = resource.corsPreFlightRequest;
          if (corsPreFlightRequest) {
            this._addChildSpan(span, corsPreFlightRequest);
            this._markResourceAsUsed(corsPreFlightRequest);
          }
          if (!this.getConfig().ignoreNetworkEvents) {
            addSpanNetworkEvents2(span, mainRequest);
          }
        }
      };
      FetchInstrumentation2.prototype._markResourceAsUsed = function(resource) {
        this._usedResources.add(resource);
      };
      FetchInstrumentation2.prototype._endSpan = function(span, spanData, response) {
        var _this = this;
        var endTime = millisToHrTime3(Date.now());
        var performanceEndTime = hrTime3();
        this._addFinalSpanAttributes(span, response);
        setTimeout(function() {
          var _a3;
          (_a3 = spanData.observer) === null || _a3 === void 0 ? void 0 : _a3.disconnect();
          _this._findResourceAndAddNetworkEvents(span, spanData, performanceEndTime);
          _this._tasksCount--;
          _this._clearResources();
          span.end(endTime);
        }, OBSERVER_WAIT_TIME_MS);
      };
      FetchInstrumentation2.prototype._patchConstructor = function() {
        var _this = this;
        return function(original) {
          var plugin = _this;
          return function patchConstructor() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
              args[_i] = arguments[_i];
            }
            var self2 = this;
            var url = parseUrl2(args[0] instanceof Request ? args[0].url : String(args[0])).href;
            var options = args[0] instanceof Request ? args[0] : args[1] || {};
            var createdSpan = plugin._createSpan(url, options);
            if (!createdSpan) {
              return original.apply(this, args);
            }
            var spanData = plugin._prepareSpanData(url);
            if (plugin.getConfig().measureRequestSize) {
              getFetchBodyLength.apply(void 0, __spreadArray9([], __read18(args), false)).then(function(length) {
                if (!length)
                  return;
                createdSpan.setAttribute(SEMATTRS_HTTP_REQUEST_CONTENT_LENGTH_UNCOMPRESSED, length);
              }).catch(function(error) {
                plugin._diag.warn("getFetchBodyLength", error);
              });
            }
            function endSpanOnError(span, error) {
              plugin._applyAttributesAfterFetch(span, options, error);
              plugin._endSpan(span, spanData, {
                status: error.status || 0,
                statusText: error.message,
                url
              });
            }
            function endSpanOnSuccess(span, response) {
              plugin._applyAttributesAfterFetch(span, options, response);
              if (response.status >= 200 && response.status < 400) {
                plugin._endSpan(span, spanData, response);
              } else {
                plugin._endSpan(span, spanData, {
                  status: response.status,
                  statusText: response.statusText,
                  url
                });
              }
            }
            function onSuccess(span, resolve, response) {
              try {
                var resClone = response.clone();
                var resClone4Hook_1 = response.clone();
                var body = resClone.body;
                if (body) {
                  var reader_1 = body.getReader();
                  var read_1 = function() {
                    reader_1.read().then(function(_a3) {
                      var done = _a3.done;
                      if (done) {
                        endSpanOnSuccess(span, resClone4Hook_1);
                      } else {
                        read_1();
                      }
                    }, function(error) {
                      endSpanOnError(span, error);
                    });
                  };
                  read_1();
                } else {
                  endSpanOnSuccess(span, response);
                }
              } finally {
                resolve(response);
              }
            }
            function onError(span, reject, error) {
              try {
                endSpanOnError(span, error);
              } finally {
                reject(error);
              }
            }
            return new Promise(function(resolve, reject) {
              return context.with(trace.setSpan(context.active(), createdSpan), function() {
                plugin._addHeaders(options, url);
                plugin._tasksCount++;
                return original.apply(self2, options instanceof Request ? [options] : [url, options]).then(onSuccess.bind(self2, createdSpan, resolve), onError.bind(self2, createdSpan, reject));
              });
            });
          };
        };
      };
      FetchInstrumentation2.prototype._applyAttributesAfterFetch = function(span, request, result) {
        var _this = this;
        var applyCustomAttributesOnSpan = this.getConfig().applyCustomAttributesOnSpan;
        if (applyCustomAttributesOnSpan) {
          safeExecuteInTheMiddle(function() {
            return applyCustomAttributesOnSpan(span, request, result);
          }, function(error) {
            if (!error) {
              return;
            }
            _this._diag.error("applyCustomAttributesOnSpan", error);
          }, true);
        }
      };
      FetchInstrumentation2.prototype._prepareSpanData = function(spanUrl) {
        var startTime = hrTime3();
        var entries = [];
        if (typeof PerformanceObserver !== "function") {
          return { entries, startTime, spanUrl };
        }
        var observer = new PerformanceObserver(function(list) {
          var perfObsEntries = list.getEntries();
          perfObsEntries.forEach(function(entry) {
            if (entry.initiatorType === "fetch" && entry.name === spanUrl) {
              entries.push(entry);
            }
          });
        });
        observer.observe({
          entryTypes: ["resource"]
        });
        return { entries, observer, startTime, spanUrl };
      };
      FetchInstrumentation2.prototype.enable = function() {
        if (isNode) {
          this._diag.warn("this instrumentation is intended for web usage only, it does not instrument Node.js's fetch()");
          return;
        }
        if (isWrapped(fetch)) {
          this._unwrap(_globalThis5, "fetch");
          this._diag.debug("removing previous patch for constructor");
        }
        this._wrap(_globalThis5, "fetch", this._patchConstructor());
      };
      FetchInstrumentation2.prototype.disable = function() {
        if (isNode) {
          return;
        }
        this._unwrap(_globalThis5, "fetch");
        this._usedResources = /* @__PURE__ */ new WeakSet();
      };
      return FetchInstrumentation2;
    }(InstrumentationBase)
  );

  // node_modules/@opentelemetry/instrumentation-xml-http-request/node_modules/@opentelemetry/core/build/esm/platform/browser/performance.js
  var otperformance3 = performance;

  // node_modules/@opentelemetry/instrumentation-xml-http-request/node_modules/@opentelemetry/semantic-conventions/build/esm/trace/SemanticAttributes.js
  var TMP_HTTP_METHOD2 = "http.method";
  var TMP_HTTP_URL3 = "http.url";
  var TMP_HTTP_HOST2 = "http.host";
  var TMP_HTTP_SCHEME2 = "http.scheme";
  var TMP_HTTP_STATUS_CODE2 = "http.status_code";
  var TMP_HTTP_USER_AGENT3 = "http.user_agent";
  var TMP_HTTP_REQUEST_CONTENT_LENGTH_UNCOMPRESSED2 = "http.request_content_length_uncompressed";
  var TMP_HTTP_RESPONSE_CONTENT_LENGTH3 = "http.response_content_length";
  var TMP_HTTP_RESPONSE_CONTENT_LENGTH_UNCOMPRESSED3 = "http.response_content_length_uncompressed";
  var SEMATTRS_HTTP_METHOD2 = TMP_HTTP_METHOD2;
  var SEMATTRS_HTTP_URL3 = TMP_HTTP_URL3;
  var SEMATTRS_HTTP_HOST2 = TMP_HTTP_HOST2;
  var SEMATTRS_HTTP_SCHEME2 = TMP_HTTP_SCHEME2;
  var SEMATTRS_HTTP_STATUS_CODE2 = TMP_HTTP_STATUS_CODE2;
  var SEMATTRS_HTTP_USER_AGENT3 = TMP_HTTP_USER_AGENT3;
  var SEMATTRS_HTTP_REQUEST_CONTENT_LENGTH_UNCOMPRESSED2 = TMP_HTTP_REQUEST_CONTENT_LENGTH_UNCOMPRESSED2;
  var SEMATTRS_HTTP_RESPONSE_CONTENT_LENGTH3 = TMP_HTTP_RESPONSE_CONTENT_LENGTH3;
  var SEMATTRS_HTTP_RESPONSE_CONTENT_LENGTH_UNCOMPRESSED3 = TMP_HTTP_RESPONSE_CONTENT_LENGTH_UNCOMPRESSED3;

  // node_modules/@opentelemetry/instrumentation-xml-http-request/node_modules/@opentelemetry/core/build/esm/common/time.js
  var NANOSECOND_DIGITS4 = 9;
  var NANOSECOND_DIGITS_IN_MILLIS4 = 6;
  var MILLISECONDS_TO_NANOSECONDS4 = Math.pow(10, NANOSECOND_DIGITS_IN_MILLIS4);
  var SECOND_TO_NANOSECONDS4 = Math.pow(10, NANOSECOND_DIGITS4);
  function millisToHrTime4(epochMillis) {
    var epochSeconds = epochMillis / 1e3;
    var seconds = Math.trunc(epochSeconds);
    var nanos = Math.round(epochMillis % 1e3 * MILLISECONDS_TO_NANOSECONDS4);
    return [seconds, nanos];
  }
  function getTimeOrigin4() {
    var timeOrigin = otperformance3.timeOrigin;
    if (typeof timeOrigin !== "number") {
      var perf = otperformance3;
      timeOrigin = perf.timing && perf.timing.fetchStart;
    }
    return timeOrigin;
  }
  function hrTime4(performanceNow) {
    var timeOrigin = millisToHrTime4(getTimeOrigin4());
    var now = millisToHrTime4(typeof performanceNow === "number" ? performanceNow : otperformance3.now());
    return addHrTimes4(timeOrigin, now);
  }
  function timeInputToHrTime4(time) {
    if (isTimeInputHrTime4(time)) {
      return time;
    } else if (typeof time === "number") {
      if (time < getTimeOrigin4()) {
        return hrTime4(time);
      } else {
        return millisToHrTime4(time);
      }
    } else if (time instanceof Date) {
      return millisToHrTime4(time.getTime());
    } else {
      throw TypeError("Invalid input type");
    }
  }
  function hrTimeToNanoseconds4(time) {
    return time[0] * SECOND_TO_NANOSECONDS4 + time[1];
  }
  function isTimeInputHrTime4(value) {
    return Array.isArray(value) && value.length === 2 && typeof value[0] === "number" && typeof value[1] === "number";
  }
  function addHrTimes4(time1, time2) {
    var out = [time1[0] + time2[0], time1[1] + time2[1]];
    if (out[1] >= SECOND_TO_NANOSECONDS4) {
      out[1] -= SECOND_TO_NANOSECONDS4;
      out[0] += 1;
    }
    return out;
  }

  // node_modules/@opentelemetry/instrumentation-xml-http-request/node_modules/@opentelemetry/core/build/esm/utils/url.js
  var __values10 = function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
      next: function() {
        if (o && i >= o.length) o = void 0;
        return { value: o && o[i++], done: !o };
      }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
  };
  function urlMatches2(url, urlToMatch) {
    if (typeof urlToMatch === "string") {
      return url === urlToMatch;
    } else {
      return !!url.match(urlToMatch);
    }
  }
  function isUrlIgnored2(url, ignoredUrls) {
    var e_1, _a3;
    if (!ignoredUrls) {
      return false;
    }
    try {
      for (var ignoredUrls_1 = __values10(ignoredUrls), ignoredUrls_1_1 = ignoredUrls_1.next(); !ignoredUrls_1_1.done; ignoredUrls_1_1 = ignoredUrls_1.next()) {
        var ignoreUrl = ignoredUrls_1_1.value;
        if (urlMatches2(url, ignoreUrl)) {
          return true;
        }
      }
    } catch (e_1_1) {
      e_1 = { error: e_1_1 };
    } finally {
      try {
        if (ignoredUrls_1_1 && !ignoredUrls_1_1.done && (_a3 = ignoredUrls_1.return)) _a3.call(ignoredUrls_1);
      } finally {
        if (e_1) throw e_1.error;
      }
    }
    return false;
  }

  // node_modules/@opentelemetry/instrumentation-xml-http-request/node_modules/@opentelemetry/sdk-trace-web/build/esm/enums/PerformanceTimingNames.js
  var PerformanceTimingNames3;
  (function(PerformanceTimingNames4) {
    PerformanceTimingNames4["CONNECT_END"] = "connectEnd";
    PerformanceTimingNames4["CONNECT_START"] = "connectStart";
    PerformanceTimingNames4["DECODED_BODY_SIZE"] = "decodedBodySize";
    PerformanceTimingNames4["DOM_COMPLETE"] = "domComplete";
    PerformanceTimingNames4["DOM_CONTENT_LOADED_EVENT_END"] = "domContentLoadedEventEnd";
    PerformanceTimingNames4["DOM_CONTENT_LOADED_EVENT_START"] = "domContentLoadedEventStart";
    PerformanceTimingNames4["DOM_INTERACTIVE"] = "domInteractive";
    PerformanceTimingNames4["DOMAIN_LOOKUP_END"] = "domainLookupEnd";
    PerformanceTimingNames4["DOMAIN_LOOKUP_START"] = "domainLookupStart";
    PerformanceTimingNames4["ENCODED_BODY_SIZE"] = "encodedBodySize";
    PerformanceTimingNames4["FETCH_START"] = "fetchStart";
    PerformanceTimingNames4["LOAD_EVENT_END"] = "loadEventEnd";
    PerformanceTimingNames4["LOAD_EVENT_START"] = "loadEventStart";
    PerformanceTimingNames4["NAVIGATION_START"] = "navigationStart";
    PerformanceTimingNames4["REDIRECT_END"] = "redirectEnd";
    PerformanceTimingNames4["REDIRECT_START"] = "redirectStart";
    PerformanceTimingNames4["REQUEST_START"] = "requestStart";
    PerformanceTimingNames4["RESPONSE_END"] = "responseEnd";
    PerformanceTimingNames4["RESPONSE_START"] = "responseStart";
    PerformanceTimingNames4["SECURE_CONNECTION_START"] = "secureConnectionStart";
    PerformanceTimingNames4["UNLOAD_EVENT_END"] = "unloadEventEnd";
    PerformanceTimingNames4["UNLOAD_EVENT_START"] = "unloadEventStart";
  })(PerformanceTimingNames3 || (PerformanceTimingNames3 = {}));

  // node_modules/@opentelemetry/instrumentation-xml-http-request/node_modules/@opentelemetry/sdk-trace-web/build/esm/utils.js
  var urlNormalizingAnchor2;
  function getUrlNormalizingAnchor2() {
    if (!urlNormalizingAnchor2) {
      urlNormalizingAnchor2 = document.createElement("a");
    }
    return urlNormalizingAnchor2;
  }
  function hasKey3(obj, key) {
    return key in obj;
  }
  function addSpanNetworkEvent3(span, performanceName, entries, refPerfName) {
    var perfTime = void 0;
    var refTime = void 0;
    if (hasKey3(entries, performanceName) && typeof entries[performanceName] === "number") {
      perfTime = entries[performanceName];
    }
    var refName = refPerfName || PerformanceTimingNames3.FETCH_START;
    if (hasKey3(entries, refName) && typeof entries[refName] === "number") {
      refTime = entries[refName];
    }
    if (perfTime !== void 0 && refTime !== void 0 && perfTime >= refTime) {
      span.addEvent(performanceName, perfTime);
      return span;
    }
    return void 0;
  }
  function addSpanNetworkEvents3(span, resource) {
    addSpanNetworkEvent3(span, PerformanceTimingNames3.FETCH_START, resource);
    addSpanNetworkEvent3(span, PerformanceTimingNames3.DOMAIN_LOOKUP_START, resource);
    addSpanNetworkEvent3(span, PerformanceTimingNames3.DOMAIN_LOOKUP_END, resource);
    addSpanNetworkEvent3(span, PerformanceTimingNames3.CONNECT_START, resource);
    if (hasKey3(resource, "name") && resource["name"].startsWith("https:")) {
      addSpanNetworkEvent3(span, PerformanceTimingNames3.SECURE_CONNECTION_START, resource);
    }
    addSpanNetworkEvent3(span, PerformanceTimingNames3.CONNECT_END, resource);
    addSpanNetworkEvent3(span, PerformanceTimingNames3.REQUEST_START, resource);
    addSpanNetworkEvent3(span, PerformanceTimingNames3.RESPONSE_START, resource);
    addSpanNetworkEvent3(span, PerformanceTimingNames3.RESPONSE_END, resource);
    var encodedLength = resource[PerformanceTimingNames3.ENCODED_BODY_SIZE];
    if (encodedLength !== void 0) {
      span.setAttribute(SEMATTRS_HTTP_RESPONSE_CONTENT_LENGTH3, encodedLength);
    }
    var decodedLength = resource[PerformanceTimingNames3.DECODED_BODY_SIZE];
    if (decodedLength !== void 0 && encodedLength !== decodedLength) {
      span.setAttribute(SEMATTRS_HTTP_RESPONSE_CONTENT_LENGTH_UNCOMPRESSED3, decodedLength);
    }
  }
  function sortResources3(filteredResources) {
    return filteredResources.slice().sort(function(a, b) {
      var valueA = a[PerformanceTimingNames3.FETCH_START];
      var valueB = b[PerformanceTimingNames3.FETCH_START];
      if (valueA > valueB) {
        return 1;
      } else if (valueA < valueB) {
        return -1;
      }
      return 0;
    });
  }
  function getOrigin2() {
    return typeof location !== "undefined" ? location.origin : void 0;
  }
  function getResource3(spanUrl, startTimeHR, endTimeHR, resources, ignoredResources, initiatorType) {
    if (ignoredResources === void 0) {
      ignoredResources = /* @__PURE__ */ new WeakSet();
    }
    var parsedSpanUrl = parseUrl3(spanUrl);
    spanUrl = parsedSpanUrl.toString();
    var filteredResources = filterResourcesForSpan2(spanUrl, startTimeHR, endTimeHR, resources, ignoredResources, initiatorType);
    if (filteredResources.length === 0) {
      return {
        mainRequest: void 0
      };
    }
    if (filteredResources.length === 1) {
      return {
        mainRequest: filteredResources[0]
      };
    }
    var sorted = sortResources3(filteredResources);
    if (parsedSpanUrl.origin !== getOrigin2() && sorted.length > 1) {
      var corsPreFlightRequest = sorted[0];
      var mainRequest = findMainRequest2(sorted, corsPreFlightRequest[PerformanceTimingNames3.RESPONSE_END], endTimeHR);
      var responseEnd = corsPreFlightRequest[PerformanceTimingNames3.RESPONSE_END];
      var fetchStart = mainRequest[PerformanceTimingNames3.FETCH_START];
      if (fetchStart < responseEnd) {
        mainRequest = corsPreFlightRequest;
        corsPreFlightRequest = void 0;
      }
      return {
        corsPreFlightRequest,
        mainRequest
      };
    } else {
      return {
        mainRequest: filteredResources[0]
      };
    }
  }
  function findMainRequest2(resources, corsPreFlightRequestEndTime, spanEndTimeHR) {
    var spanEndTime = hrTimeToNanoseconds4(spanEndTimeHR);
    var minTime = hrTimeToNanoseconds4(timeInputToHrTime4(corsPreFlightRequestEndTime));
    var mainRequest = resources[1];
    var bestGap;
    var length = resources.length;
    for (var i = 1; i < length; i++) {
      var resource = resources[i];
      var resourceStartTime = hrTimeToNanoseconds4(timeInputToHrTime4(resource[PerformanceTimingNames3.FETCH_START]));
      var resourceEndTime = hrTimeToNanoseconds4(timeInputToHrTime4(resource[PerformanceTimingNames3.RESPONSE_END]));
      var currentGap = spanEndTime - resourceEndTime;
      if (resourceStartTime >= minTime && (!bestGap || currentGap < bestGap)) {
        bestGap = currentGap;
        mainRequest = resource;
      }
    }
    return mainRequest;
  }
  function filterResourcesForSpan2(spanUrl, startTimeHR, endTimeHR, resources, ignoredResources, initiatorType) {
    var startTime = hrTimeToNanoseconds4(startTimeHR);
    var endTime = hrTimeToNanoseconds4(endTimeHR);
    var filteredResources = resources.filter(function(resource) {
      var resourceStartTime = hrTimeToNanoseconds4(timeInputToHrTime4(resource[PerformanceTimingNames3.FETCH_START]));
      var resourceEndTime = hrTimeToNanoseconds4(timeInputToHrTime4(resource[PerformanceTimingNames3.RESPONSE_END]));
      return resource.initiatorType.toLowerCase() === (initiatorType || "xmlhttprequest") && resource.name === spanUrl && resourceStartTime >= startTime && resourceEndTime <= endTime;
    });
    if (filteredResources.length > 0) {
      filteredResources = filteredResources.filter(function(resource) {
        return !ignoredResources.has(resource);
      });
    }
    return filteredResources;
  }
  function parseUrl3(url) {
    if (typeof URL === "function") {
      return new URL(url, typeof document !== "undefined" ? document.baseURI : typeof location !== "undefined" ? location.href : void 0);
    }
    var element = getUrlNormalizingAnchor2();
    element.href = url;
    return element;
  }
  function shouldPropagateTraceHeaders3(spanUrl, propagateTraceHeaderCorsUrls) {
    var propagateTraceHeaderUrls = propagateTraceHeaderCorsUrls || [];
    if (typeof propagateTraceHeaderUrls === "string" || propagateTraceHeaderUrls instanceof RegExp) {
      propagateTraceHeaderUrls = [propagateTraceHeaderUrls];
    }
    var parsedSpanUrl = parseUrl3(spanUrl);
    if (parsedSpanUrl.origin === getOrigin2()) {
      return true;
    } else {
      return propagateTraceHeaderUrls.some(function(propagateTraceHeaderUrl) {
        return urlMatches2(spanUrl, propagateTraceHeaderUrl);
      });
    }
  }

  // node_modules/@opentelemetry/instrumentation-xml-http-request/build/esm/enums/EventNames.js
  var EventNames2;
  (function(EventNames3) {
    EventNames3["METHOD_OPEN"] = "open";
    EventNames3["METHOD_SEND"] = "send";
    EventNames3["EVENT_ABORT"] = "abort";
    EventNames3["EVENT_ERROR"] = "error";
    EventNames3["EVENT_LOAD"] = "loaded";
    EventNames3["EVENT_TIMEOUT"] = "timeout";
  })(EventNames2 || (EventNames2 = {}));

  // node_modules/@opentelemetry/instrumentation-xml-http-request/build/esm/utils.js
  var __values11 = function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
      next: function() {
        if (o && i >= o.length) o = void 0;
        return { value: o && o[i++], done: !o };
      }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
  };
  var __read19 = function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    } catch (error) {
      e = { error };
    } finally {
      try {
        if (r && !r.done && (m = i["return"])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }
    return ar;
  };
  var DIAG_LOGGER2 = diag2.createComponentLogger({
    namespace: "@opentelemetry/opentelemetry-instrumentation-xml-http-request/utils"
  });
  function getXHRBodyLength2(body) {
    if (typeof Document !== "undefined" && body instanceof Document) {
      return new XMLSerializer().serializeToString(document).length;
    }
    if (body instanceof Blob) {
      return body.size;
    }
    if (body.byteLength !== void 0) {
      return body.byteLength;
    }
    if (body instanceof FormData) {
      return getFormDataSize2(body);
    }
    if (body instanceof URLSearchParams) {
      return getByteLength2(body.toString());
    }
    if (typeof body === "string") {
      return getByteLength2(body);
    }
    DIAG_LOGGER2.warn("unknown body type");
    return void 0;
  }
  var TEXT_ENCODER2 = new TextEncoder();
  function getByteLength2(s) {
    return TEXT_ENCODER2.encode(s).byteLength;
  }
  function getFormDataSize2(formData) {
    var e_1, _a3;
    var size = 0;
    try {
      for (var _b = __values11(formData.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
        var _d = __read19(_c.value, 2), key = _d[0], value = _d[1];
        size += key.length;
        if (value instanceof Blob) {
          size += value.size;
        } else {
          size += value.length;
        }
      }
    } catch (e_1_1) {
      e_1 = { error: e_1_1 };
    } finally {
      try {
        if (_c && !_c.done && (_a3 = _b.return)) _a3.call(_b);
      } finally {
        if (e_1) throw e_1.error;
      }
    }
    return size;
  }

  // node_modules/@opentelemetry/instrumentation-xml-http-request/build/esm/version.js
  var VERSION5 = "0.56.0";

  // node_modules/@opentelemetry/instrumentation-xml-http-request/build/esm/enums/AttributeNames.js
  var AttributeNames3;
  (function(AttributeNames4) {
    AttributeNames4["HTTP_STATUS_TEXT"] = "http.status_text";
  })(AttributeNames3 || (AttributeNames3 = {}));

  // node_modules/@opentelemetry/instrumentation-xml-http-request/build/esm/xhr.js
  var __extends10 = /* @__PURE__ */ function() {
    var extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
        d2.__proto__ = b2;
      } || function(d2, b2) {
        for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
      };
      return extendStatics(d, b);
    };
    return function(d, b) {
      if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
  }();
  var OBSERVER_WAIT_TIME_MS2 = 300;
  var XMLHttpRequestInstrumentation = (
    /** @class */
    function(_super) {
      __extends10(XMLHttpRequestInstrumentation2, _super);
      function XMLHttpRequestInstrumentation2(config2) {
        if (config2 === void 0) {
          config2 = {};
        }
        var _this = _super.call(this, "@opentelemetry/instrumentation-xml-http-request", VERSION5, config2) || this;
        _this.component = "xml-http-request";
        _this.version = VERSION5;
        _this.moduleName = _this.component;
        _this._tasksCount = 0;
        _this._xhrMem = /* @__PURE__ */ new WeakMap();
        _this._usedResources = /* @__PURE__ */ new WeakSet();
        return _this;
      }
      XMLHttpRequestInstrumentation2.prototype.init = function() {
      };
      XMLHttpRequestInstrumentation2.prototype._addHeaders = function(xhr, spanUrl) {
        var url = parseUrl3(spanUrl).href;
        if (!shouldPropagateTraceHeaders3(url, this.getConfig().propagateTraceHeaderCorsUrls)) {
          var headers_1 = {};
          propagation.inject(context.active(), headers_1);
          if (Object.keys(headers_1).length > 0) {
            this._diag.debug("headers inject skipped due to CORS policy");
          }
          return;
        }
        var headers = {};
        propagation.inject(context.active(), headers);
        Object.keys(headers).forEach(function(key) {
          xhr.setRequestHeader(key, String(headers[key]));
        });
      };
      XMLHttpRequestInstrumentation2.prototype._addChildSpan = function(span, corsPreFlightRequest) {
        var _this = this;
        context.with(trace.setSpan(context.active(), span), function() {
          var childSpan = _this.tracer.startSpan("CORS Preflight", {
            startTime: corsPreFlightRequest[PerformanceTimingNames3.FETCH_START]
          });
          if (!_this.getConfig().ignoreNetworkEvents) {
            addSpanNetworkEvents3(childSpan, corsPreFlightRequest);
          }
          childSpan.end(corsPreFlightRequest[PerformanceTimingNames3.RESPONSE_END]);
        });
      };
      XMLHttpRequestInstrumentation2.prototype._addFinalSpanAttributes = function(span, xhrMem, spanUrl) {
        if (typeof spanUrl === "string") {
          var parsedUrl = parseUrl3(spanUrl);
          if (xhrMem.status !== void 0) {
            span.setAttribute(SEMATTRS_HTTP_STATUS_CODE2, xhrMem.status);
          }
          if (xhrMem.statusText !== void 0) {
            span.setAttribute(AttributeNames3.HTTP_STATUS_TEXT, xhrMem.statusText);
          }
          span.setAttribute(SEMATTRS_HTTP_HOST2, parsedUrl.host);
          span.setAttribute(SEMATTRS_HTTP_SCHEME2, parsedUrl.protocol.replace(":", ""));
          span.setAttribute(SEMATTRS_HTTP_USER_AGENT3, navigator.userAgent);
        }
      };
      XMLHttpRequestInstrumentation2.prototype._applyAttributesAfterXHR = function(span, xhr) {
        var _this = this;
        var applyCustomAttributesOnSpan = this.getConfig().applyCustomAttributesOnSpan;
        if (typeof applyCustomAttributesOnSpan === "function") {
          safeExecuteInTheMiddle(function() {
            return applyCustomAttributesOnSpan(span, xhr);
          }, function(error) {
            if (!error) {
              return;
            }
            _this._diag.error("applyCustomAttributesOnSpan", error);
          }, true);
        }
      };
      XMLHttpRequestInstrumentation2.prototype._addResourceObserver = function(xhr, spanUrl) {
        var xhrMem = this._xhrMem.get(xhr);
        if (!xhrMem || typeof PerformanceObserver !== "function" || typeof PerformanceResourceTiming !== "function") {
          return;
        }
        xhrMem.createdResources = {
          observer: new PerformanceObserver(function(list) {
            var entries = list.getEntries();
            var parsedUrl = parseUrl3(spanUrl);
            entries.forEach(function(entry) {
              if (entry.initiatorType === "xmlhttprequest" && entry.name === parsedUrl.href) {
                if (xhrMem.createdResources) {
                  xhrMem.createdResources.entries.push(entry);
                }
              }
            });
          }),
          entries: []
        };
        xhrMem.createdResources.observer.observe({
          entryTypes: ["resource"]
        });
      };
      XMLHttpRequestInstrumentation2.prototype._clearResources = function() {
        if (this._tasksCount === 0 && this.getConfig().clearTimingResources) {
          otperformance3.clearResourceTimings();
          this._xhrMem = /* @__PURE__ */ new WeakMap();
          this._usedResources = /* @__PURE__ */ new WeakSet();
        }
      };
      XMLHttpRequestInstrumentation2.prototype._findResourceAndAddNetworkEvents = function(xhrMem, span, spanUrl, startTime, endTime) {
        if (!spanUrl || !startTime || !endTime || !xhrMem.createdResources) {
          return;
        }
        var resources = xhrMem.createdResources.entries;
        if (!resources || !resources.length) {
          resources = otperformance3.getEntriesByType("resource");
        }
        var resource = getResource3(parseUrl3(spanUrl).href, startTime, endTime, resources, this._usedResources);
        if (resource.mainRequest) {
          var mainRequest = resource.mainRequest;
          this._markResourceAsUsed(mainRequest);
          var corsPreFlightRequest = resource.corsPreFlightRequest;
          if (corsPreFlightRequest) {
            this._addChildSpan(span, corsPreFlightRequest);
            this._markResourceAsUsed(corsPreFlightRequest);
          }
          if (!this.getConfig().ignoreNetworkEvents) {
            addSpanNetworkEvents3(span, mainRequest);
          }
        }
      };
      XMLHttpRequestInstrumentation2.prototype._cleanPreviousSpanInformation = function(xhr) {
        var xhrMem = this._xhrMem.get(xhr);
        if (xhrMem) {
          var callbackToRemoveEvents = xhrMem.callbackToRemoveEvents;
          if (callbackToRemoveEvents) {
            callbackToRemoveEvents();
          }
          this._xhrMem.delete(xhr);
        }
      };
      XMLHttpRequestInstrumentation2.prototype._createSpan = function(xhr, url, method) {
        var _a3;
        if (isUrlIgnored2(url, this.getConfig().ignoreUrls)) {
          this._diag.debug("ignoring span as url matches ignored url");
          return;
        }
        var spanName = method.toUpperCase();
        var currentSpan = this.tracer.startSpan(spanName, {
          kind: SpanKind.CLIENT,
          attributes: (_a3 = {}, _a3[SEMATTRS_HTTP_METHOD2] = method, _a3[SEMATTRS_HTTP_URL3] = parseUrl3(url).toString(), _a3)
        });
        currentSpan.addEvent(EventNames2.METHOD_OPEN);
        this._cleanPreviousSpanInformation(xhr);
        this._xhrMem.set(xhr, {
          span: currentSpan,
          spanUrl: url
        });
        return currentSpan;
      };
      XMLHttpRequestInstrumentation2.prototype._markResourceAsUsed = function(resource) {
        this._usedResources.add(resource);
      };
      XMLHttpRequestInstrumentation2.prototype._patchOpen = function() {
        var _this = this;
        return function(original) {
          var plugin = _this;
          return function patchOpen() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
              args[_i] = arguments[_i];
            }
            var method = args[0];
            var url = args[1];
            plugin._createSpan(this, url, method);
            return original.apply(this, args);
          };
        };
      };
      XMLHttpRequestInstrumentation2.prototype._patchSend = function() {
        var plugin = this;
        function endSpanTimeout(eventName, xhrMem, performanceEndTime, endTime) {
          var callbackToRemoveEvents = xhrMem.callbackToRemoveEvents;
          if (typeof callbackToRemoveEvents === "function") {
            callbackToRemoveEvents();
          }
          var span = xhrMem.span, spanUrl = xhrMem.spanUrl, sendStartTime = xhrMem.sendStartTime;
          if (span) {
            plugin._findResourceAndAddNetworkEvents(xhrMem, span, spanUrl, sendStartTime, performanceEndTime);
            span.addEvent(eventName, endTime);
            plugin._addFinalSpanAttributes(span, xhrMem, spanUrl);
            span.end(endTime);
            plugin._tasksCount--;
          }
          plugin._clearResources();
        }
        function endSpan(eventName, xhr) {
          var xhrMem = plugin._xhrMem.get(xhr);
          if (!xhrMem) {
            return;
          }
          xhrMem.status = xhr.status;
          xhrMem.statusText = xhr.statusText;
          plugin._xhrMem.delete(xhr);
          if (xhrMem.span) {
            plugin._applyAttributesAfterXHR(xhrMem.span, xhr);
          }
          var performanceEndTime = hrTime4();
          var endTime = Date.now();
          setTimeout(function() {
            endSpanTimeout(eventName, xhrMem, performanceEndTime, endTime);
          }, OBSERVER_WAIT_TIME_MS2);
        }
        function onError() {
          endSpan(EventNames2.EVENT_ERROR, this);
        }
        function onAbort() {
          endSpan(EventNames2.EVENT_ABORT, this);
        }
        function onTimeout() {
          endSpan(EventNames2.EVENT_TIMEOUT, this);
        }
        function onLoad() {
          if (this.status < 299) {
            endSpan(EventNames2.EVENT_LOAD, this);
          } else {
            endSpan(EventNames2.EVENT_ERROR, this);
          }
        }
        function unregister(xhr) {
          xhr.removeEventListener("abort", onAbort);
          xhr.removeEventListener("error", onError);
          xhr.removeEventListener("load", onLoad);
          xhr.removeEventListener("timeout", onTimeout);
          var xhrMem = plugin._xhrMem.get(xhr);
          if (xhrMem) {
            xhrMem.callbackToRemoveEvents = void 0;
          }
        }
        return function(original) {
          return function patchSend() {
            var _this = this;
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
              args[_i] = arguments[_i];
            }
            var xhrMem = plugin._xhrMem.get(this);
            if (!xhrMem) {
              return original.apply(this, args);
            }
            var currentSpan = xhrMem.span;
            var spanUrl = xhrMem.spanUrl;
            if (currentSpan && spanUrl) {
              if (plugin.getConfig().measureRequestSize && (args === null || args === void 0 ? void 0 : args[0])) {
                var body = args[0];
                var bodyLength = getXHRBodyLength2(body);
                if (bodyLength !== void 0) {
                  currentSpan.setAttribute(SEMATTRS_HTTP_REQUEST_CONTENT_LENGTH_UNCOMPRESSED2, bodyLength);
                }
              }
              context.with(trace.setSpan(context.active(), currentSpan), function() {
                plugin._tasksCount++;
                xhrMem.sendStartTime = hrTime4();
                currentSpan.addEvent(EventNames2.METHOD_SEND);
                _this.addEventListener("abort", onAbort);
                _this.addEventListener("error", onError);
                _this.addEventListener("load", onLoad);
                _this.addEventListener("timeout", onTimeout);
                xhrMem.callbackToRemoveEvents = function() {
                  unregister(_this);
                  if (xhrMem.createdResources) {
                    xhrMem.createdResources.observer.disconnect();
                  }
                };
                plugin._addHeaders(_this, spanUrl);
                plugin._addResourceObserver(_this, spanUrl);
              });
            }
            return original.apply(this, args);
          };
        };
      };
      XMLHttpRequestInstrumentation2.prototype.enable = function() {
        this._diag.debug("applying patch to", this.moduleName, this.version);
        if (isWrapped(XMLHttpRequest.prototype.open)) {
          this._unwrap(XMLHttpRequest.prototype, "open");
          this._diag.debug("removing previous patch from method open");
        }
        if (isWrapped(XMLHttpRequest.prototype.send)) {
          this._unwrap(XMLHttpRequest.prototype, "send");
          this._diag.debug("removing previous patch from method send");
        }
        this._wrap(XMLHttpRequest.prototype, "open", this._patchOpen());
        this._wrap(XMLHttpRequest.prototype, "send", this._patchSend());
      };
      XMLHttpRequestInstrumentation2.prototype.disable = function() {
        this._diag.debug("removing patch from", this.moduleName, this.version);
        this._unwrap(XMLHttpRequest.prototype, "open");
        this._unwrap(XMLHttpRequest.prototype, "send");
        this._tasksCount = 0;
        this._xhrMem = /* @__PURE__ */ new WeakMap();
        this._usedResources = /* @__PURE__ */ new WeakSet();
      };
      return XMLHttpRequestInstrumentation2;
    }(InstrumentationBase)
  );

  // src/otel.js
  var UISpanExporter = class {
    export(spans, resultCallback) {
      for (const span of spans) {
        const [secs, nanos] = span.duration;
        const durationMs = (secs * 1e3 + nanos / 1e6).toFixed(1);
        const isError = span.status.code === 2;
        const icon = isError ? "\u{1F534}" : "\u{1F7E2}";
        const traceId = span.spanContext().traceId.slice(0, 16) + "\u2026";
        log("span", `${icon} [span] ${span.name} \xB7 ${durationMs}ms \xB7 trace=${traceId}`);
      }
      resultCallback({ code: ExportResultCode.SUCCESS });
    }
    shutdown() {
      return Promise.resolve();
    }
  };
  var CustomAttributesProcessor = class {
    constructor() {
      __publicField(this, "attrs", {});
    }
    update(attrs) {
      this.attrs = { ...attrs };
    }
    onStart(span) {
      for (const [k, v] of Object.entries(this.attrs)) {
        span.setAttribute(k, v);
      }
    }
    onEnd() {
    }
    shutdown() {
      return Promise.resolve();
    }
    forceFlush() {
      return Promise.resolve();
    }
  };
  function initOtel(config2) {
    const customAttrsProcessor = new CustomAttributesProcessor();
    const otlpExporter = new OTLPTraceExporter(config2.otlpExporterConfig);
    const provider = new WebTracerProvider({
      resource: new Resource({
        [ATTR_SERVICE_NAME]: config2.serviceName,
        [ATTR_SERVICE_VERSION]: config2.serviceVersion
      })
    });
    provider.addSpanProcessor(new BatchSpanProcessor(otlpExporter, {
      maxExportBatchSize: 10,
      scheduledDelayMillis: 1e3
    }));
    provider.addSpanProcessor(new SimpleSpanProcessor(new UISpanExporter()));
    provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));
    provider.addSpanProcessor(customAttrsProcessor);
    provider.register();
    registerInstrumentations({
      instrumentations: [
        new DocumentLoadInstrumentation(),
        new FetchInstrumentation({
          propagateTraceHeaderCorsUrls: [/.*/],
          clearTimingResources: true
        }),
        new XMLHttpRequestInstrumentation({
          propagateTraceHeaderCorsUrls: [/.*/]
        })
      ]
    });
    return {
      tracer: trace.getTracer(config2.serviceName, config2.serviceVersion),
      customAttrsProcessor
    };
  }

  // src/actions.js
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  function createActions(tracer) {
    const fetchOk = async () => {
      const url = "https://jsonplaceholder.typicode.com/posts/1";
      log("info", `GET ${url} \u2026`);
      try {
        const r = await fetch(url);
        const d = await r.json();
        log("success", `200 OK \u2014 post #${d.id}: "${d.title.slice(0, 60)}"`);
      } catch (e) {
        log("error", `Fetch failed: ${e.message}`);
      }
    };
    const fetch404 = async () => {
      const url = "https://jsonplaceholder.typicode.com/posts/999999";
      log("info", `GET ${url} (expect 404) \u2026`);
      try {
        const r = await fetch(url);
        log("warn", `Response: HTTP ${r.status} ${r.statusText}`);
      } catch (e) {
        log("error", `Fetch error: ${e.message}`);
      }
    };
    const fetchNetErr = async () => {
      const url = "https://this-host-definitely-does-not-exist.invalid/api/data";
      log("info", `GET ${url} (expect network error) \u2026`);
      try {
        await fetch(url);
      } catch (e) {
        log("error", `Network error (expected): ${e.message}`);
      }
    };
    const xhr = () => {
      const url = "https://jsonplaceholder.typicode.com/users/1";
      log("info", `XHR GET ${url} \u2026`);
      const req = new XMLHttpRequest();
      req.open("GET", url);
      req.onload = () => {
        try {
          const d = JSON.parse(req.responseText);
          log("success", `XHR 200 \u2014 user: ${d.name} <${d.email}>`);
        } catch {
          log("warn", `XHR ${req.status} \u2014 non-JSON response`);
        }
      };
      req.onerror = () => log("error", "XHR network error");
      req.send();
    };
    const jsError = () => {
      log("warn", "Triggering a JS TypeError\u2026");
      const errorSpan = tracer.startSpan("js-error-event");
      try {
        void null.undefinedProperty;
      } catch (e) {
        log("error", `${e.name}: ${e.message}`);
        errorSpan.recordException(e);
        errorSpan.setStatus({ code: SpanStatusCode.ERROR, message: e.message });
      } finally {
        errorSpan.end();
      }
    };
    const navigation = () => {
      const routes = ["/home", "/about", "/dashboard", "/settings", "/profile", "/search"];
      const to = routes[Math.floor(Math.random() * routes.length)];
      history.pushState({ page: to }, "", to + "?otelDemo=1");
      log("nav", `history.pushState \u2192 ${to}`);
      const span = tracer.startSpan("navigation");
      span.setAttribute("navigation.to", to);
      span.setAttribute("navigation.type", "pushState");
      span.setAttribute("navigation.from", document.referrer || "/");
      span.end();
    };
    const customSpan = async () => {
      const span = tracer.startSpan("user-interaction");
      span.setAttribute("interaction.type", "button-click");
      span.setAttribute("interaction.component", "custom-span-button");
      span.setAttribute("interaction.timestamp", Date.now());
      log("span", "Started span: user-interaction");
      await sleep(80 + Math.random() * 120);
      span.end();
      log("success", "Ended span: user-interaction");
    };
    const nestedSpans = async () => {
      const root = tracer.startSpan("workflow.execute");
      root.setAttribute("workflow.name", "demo-pipeline");
      root.setAttribute("workflow.steps", 3);
      log("span", "Started root span: workflow.execute");
      await sleep(40);
      const stepNames = ["validate", "process", "commit"];
      for (let i = 0; i < stepNames.length; i++) {
        const step = tracer.startSpan(`workflow.step-${i + 1}`);
        step.setAttribute("step.index", i + 1);
        step.setAttribute("step.name", stepNames[i]);
        log("span", `  \u21B3 step span: workflow.step-${i + 1}`);
        await sleep(50 + (i + 1) * 30);
        step.end();
      }
      root.end();
      log("success", "Workflow complete \u2014 4 spans created");
    };
    return { fetchOk, fetch404, fetchNetErr, xhr, jsError, navigation, customSpan, nestedSpans };
  }

  // src/main.js
  var initialConfig = parseConfigFromQueryString();
  function onConfigChange() {
    const config2 = readConfigFromForm();
    const customAttrs = readCustomAttributes();
    updateSnippet(config2, customAttrs);
    if (handle) handle.customAttrsProcessor.update(customAttrs);
  }
  initConfigForm(initialConfig, onConfigChange);
  initCustomAttributes(initialConfig.customAttributes, onConfigChange);
  var config = readConfigFromForm();
  updateSnippet(config, initialConfig.customAttributes);
  setStatus("loading", "Initialising SDK\u2026");
  var handle = null;
  try {
    handle = initOtel(config);
    setStatus("ok", `SDK ready \xB7 ${config.otlpExporterConfig.url}`);
    log("info", `SDK initialised \u2014 service="${config.serviceName}" v${config.serviceVersion}`);
    log("info", `OTLP endpoint \u2192 ${config.otlpExporterConfig.url}`);
    const headerKeys = Object.keys(config.otlpExporterConfig.headers);
    if (headerKeys.length > 0) log("info", `Headers: ${headerKeys.join(", ")}`);
    log("muted", "Open DevTools \u2192 Console to see full span objects");
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    setStatus("error", "SDK init failed \u2014 check console");
    log("error", `SDK init error: ${msg}`);
    console.error("[OTel Demo] SDK init failed:", err);
  }
  var noopSpan = {
    setAttribute: () => noopSpan,
    setAttributes: () => noopSpan,
    addEvent: () => noopSpan,
    addLink: () => noopSpan,
    addLinks: () => noopSpan,
    setStatus: () => noopSpan,
    recordException: () => {
    },
    end: () => {
    },
    isRecording: () => false,
    spanContext: () => ({ traceId: "0".repeat(32), spanId: "", traceFlags: 0 })
  };
  var noopTracer = {
    startSpan: () => noopSpan,
    startActiveSpan: (_n, fn) => fn(noopSpan)
  };
  var actions = createActions(handle?.tracer ?? noopTracer);
  function on(id, handler) {
    document.getElementById(id)?.addEventListener("click", () => {
      void handler();
    });
  }
  on("btn-fetch-ok", actions.fetchOk);
  on("btn-fetch-404", actions.fetch404);
  on("btn-fetch-net", actions.fetchNetErr);
  on("btn-xhr", actions.xhr);
  on("btn-jserr", actions.jsError);
  on("btn-nav", actions.navigation);
  on("btn-custom", actions.customSpan);
  on("btn-nested", actions.nestedSpans);
  on("btn-clear-log", clearLog);
  enableButtons();
})();
//# sourceMappingURL=bundle.js.map
