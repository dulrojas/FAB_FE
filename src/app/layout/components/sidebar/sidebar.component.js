"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SidebarComponent = void 0;
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var SidebarComponent = function () {
    var _classDecorators = [(0, core_1.Component)({
            selector: 'app-sidebar',
            templateUrl: './sidebar.component.html',
            styleUrls: ['./sidebar.component.scss']
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _collapsedEvent_decorators;
    var _collapsedEvent_initializers = [];
    var _collapsedEvent_extraInitializers = [];
    var SidebarComponent = _classThis = /** @class */ (function () {
        function SidebarComponent_1(translate, router) {
            var _this = this;
            this.translate = translate;
            this.router = router;
            this.collapsedEvent = __runInitializers(this, _collapsedEvent_initializers, new core_1.EventEmitter());
            __runInitializers(this, _collapsedEvent_extraInitializers);
            this.translate = translate;
            this.router = router;
            this.router.events.subscribe(function (val) {
                if (val instanceof router_1.NavigationEnd && window.innerWidth <= 992 && _this.isToggled()) {
                    _this.toggleSidebar();
                }
            });
        }
        SidebarComponent_1.prototype.ngOnInit = function () {
            this.isActive = false;
            this.collapsed = false;
            this.showMenu = '';
            this.pushRightClass = 'push-right';
        };
        SidebarComponent_1.prototype.eventCalled = function () {
            this.isActive = !this.isActive;
        };
        SidebarComponent_1.prototype.addExpandClass = function (element) {
            if (element === this.showMenu) {
                this.showMenu = '0';
            }
            else {
                this.showMenu = element;
            }
        };
        SidebarComponent_1.prototype.toggleCollapsed = function () {
            this.collapsed = !this.collapsed;
            this.collapsedEvent.emit(this.collapsed);
        };
        SidebarComponent_1.prototype.isToggled = function () {
            var dom = document.querySelector('body');
            return dom.classList.contains(this.pushRightClass);
        };
        SidebarComponent_1.prototype.toggleSidebar = function () {
            var dom = document.querySelector('body');
            dom.classList.toggle(this.pushRightClass);
        };
        SidebarComponent_1.prototype.rltAndLtr = function () {
            var dom = document.querySelector('body');
            dom.classList.toggle('rtl');
        };
        SidebarComponent_1.prototype.changeLang = function (language) {
            this.translate.use(language);
        };
        SidebarComponent_1.prototype.onLoggedout = function () {
            localStorage.removeItem('isLoggedin');
        };
        return SidebarComponent_1;
    }());
    __setFunctionName(_classThis, "SidebarComponent");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _collapsedEvent_decorators = [(0, core_1.Output)()];
        __esDecorate(null, null, _collapsedEvent_decorators, { kind: "field", name: "collapsedEvent", static: false, private: false, access: { has: function (obj) { return "collapsedEvent" in obj; }, get: function (obj) { return obj.collapsedEvent; }, set: function (obj, value) { obj.collapsedEvent = value; } }, metadata: _metadata }, _collapsedEvent_initializers, _collapsedEvent_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SidebarComponent = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SidebarComponent = _classThis;
}();
exports.SidebarComponent = SidebarComponent;
