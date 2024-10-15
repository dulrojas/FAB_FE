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
exports.ChartsComponent = void 0;
var core_1 = require("@angular/core");
var router_animations_1 = require("../../router.animations");
var ChartsComponent = function () {
    var _classDecorators = [(0, core_1.Component)({
            selector: 'app-charts',
            templateUrl: './charts.component.html',
            styleUrls: ['./charts.component.scss'],
            animations: [(0, router_animations_1.routerTransition)()]
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ChartsComponent = _classThis = /** @class */ (function () {
        function ChartsComponent_1() {
            // bar chart
            this.barChartOptions = {
                scaleShowVerticalLines: false,
                responsive: true
            };
            this.barChartLabels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
            this.barChartData = [
                { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
                { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
            ];
            // Doughnut
            this.doughnutChartLabels = ['Download Sales', 'In-Store Sales', 'Mail-Order Sales'];
            this.doughnutChartData = {
                labels: this.doughnutChartLabels,
                datasets: [
                    { data: [350, 450, 100] },
                    { data: [50, 150, 120] },
                    { data: [250, 130, 70] }
                ]
            };
            this.doughnutChartType = 'doughnut';
            // Radar
            this.radarChartLabels = ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running'];
            this.radarChartData = [
                { data: [65, 59, 90, 81, 56, 55, 40], label: 'Series A' },
                { data: [28, 48, 40, 19, 96, 27, 100], label: 'Series B' }
            ];
            // Pie
            // public pieChartLabels: string[] = ['Download Sales', 'In-Store Sales', 'Mail Sales'];
            // public pieChartData: number[] = [300, 500, 100];
            this.pieChartData = {
                labels: [['Download', 'Sales'], ['In', 'Store', 'Sales'], 'Mail Sales'],
                datasets: [{
                        data: [300, 500, 100]
                    }]
            };
            // PolarArea
            this.polarAreaChartLabels = [
                'Download Sales',
                'In-Store Sales',
                'Mail Sales',
                'Telesales',
                'Corporate Sales'
            ];
            this.polarAreaChartData = {
                labels: this.polarAreaChartLabels,
                datasets: [{
                        data: [300, 500, 100, 40, 120],
                        label: 'Series 1'
                    }]
            };
            // lineChart
            this.lineChartData = [
                { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
                { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' },
                { data: [18, 48, 77, 9, 100, 27, 40], label: 'Series C' }
            ];
            this.lineChartLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
            this.lineChartOptions = {
                responsive: true
            };
            this.lineChartColors = [
                {
                    // grey
                    backgroundColor: 'rgba(148,159,177,0.2)',
                    borderColor: 'rgba(148,159,177,1)',
                    pointBackgroundColor: 'rgba(148,159,177,1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(148,159,177,0.8)'
                },
                {
                    // dark grey
                    backgroundColor: 'rgba(77,83,96,0.2)',
                    borderColor: 'rgba(77,83,96,1)',
                    pointBackgroundColor: 'rgba(77,83,96,1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(77,83,96,1)'
                },
                {
                    // grey
                    backgroundColor: 'rgba(148,159,177,0.2)',
                    borderColor: 'rgba(148,159,177,1)',
                    pointBackgroundColor: 'rgba(148,159,177,1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(148,159,177,0.8)'
                }
            ];
        }
        // events
        ChartsComponent_1.prototype.chartClicked = function (e) {
            // console.log(e);
        };
        ChartsComponent_1.prototype.chartHovered = function (e) {
            // console.log(e);
        };
        ChartsComponent_1.prototype.randomize = function () {
            // Only Change 3 values
            var data = [Math.round(Math.random() * 100), 59, 80, Math.random() * 100, 56, Math.random() * 100, 40];
            var clone = JSON.parse(JSON.stringify(this.barChartData));
            clone[0].data = data;
            this.barChartData = clone;
            /**
             * (My guess), for Angular to recognize the change in the dataset
             * it has to change the dataset variable directly,
             * so one way around it, is to clone the data, change it and then
             * assign it;
             */
        };
        ChartsComponent_1.prototype.ngOnInit = function () {
            this.barChartType = 'bar';
            this.barChartLegend = true;
            // this.doughnutChartType = 'doughnut';
            this.radarChartType = 'radar';
            this.pieChartType = 'pie';
            this.polarAreaLegend = true;
            this.polarAreaChartType = 'polarArea';
            this.lineChartLegend = true;
            this.lineChartType = 'line';
        };
        return ChartsComponent_1;
    }());
    __setFunctionName(_classThis, "ChartsComponent");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ChartsComponent = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ChartsComponent = _classThis;
}();
exports.ChartsComponent = ChartsComponent;
