"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routerTransition = routerTransition;
exports.noTransition = noTransition;
exports.fadeInAnimation = fadeInAnimation;
exports.slideToRight = slideToRight;
exports.slideToLeft = slideToLeft;
exports.slideToBottom = slideToBottom;
exports.slideToTop = slideToTop;
var animations_1 = require("@angular/animations");
function routerTransition() {
    return fadeInAnimation();
}
function noTransition() {
    return (0, animations_1.trigger)('routerTransition', []);
}
function fadeInAnimation() {
    return (0, animations_1.trigger)('routerTransition', [
        (0, animations_1.state)('void', (0, animations_1.style)({})),
        (0, animations_1.state)('*', (0, animations_1.style)({})),
        (0, animations_1.transition)(':enter', [(0, animations_1.style)({ opacity: 0 }), (0, animations_1.animate)(500, (0, animations_1.style)({ opacity: 1 }))]),
        (0, animations_1.transition)(':leave', [(0, animations_1.animate)(500, (0, animations_1.style)({ opacity: 0 }))])
    ]);
}
function slideToRight() {
    return (0, animations_1.trigger)('routerTransition', [
        (0, animations_1.state)('void', (0, animations_1.style)({})),
        (0, animations_1.state)('*', (0, animations_1.style)({})),
        (0, animations_1.transition)(':enter', [
            (0, animations_1.style)({ transform: 'translateX(-100%)' }),
            (0, animations_1.animate)('0.5s ease-in-out', (0, animations_1.style)({ transform: 'translateX(0%)' }))
        ]),
        (0, animations_1.transition)(':leave', [
            (0, animations_1.style)({ transform: 'translateX(0%)' }),
            (0, animations_1.animate)('0.5s ease-in-out', (0, animations_1.style)({ transform: 'translateX(100%)' }))
        ])
    ]);
}
function slideToLeft() {
    return (0, animations_1.trigger)('routerTransition', [
        (0, animations_1.state)('void', (0, animations_1.style)({})),
        (0, animations_1.state)('*', (0, animations_1.style)({})),
        (0, animations_1.transition)(':enter', [
            (0, animations_1.style)({ transform: 'translateX(100%)' }),
            (0, animations_1.animate)('0.5s ease-in-out', (0, animations_1.style)({ transform: 'translateX(0%)' }))
        ]),
        (0, animations_1.transition)(':leave', [
            (0, animations_1.style)({ transform: 'translateX(0%)' }),
            (0, animations_1.animate)('0.5s ease-in-out', (0, animations_1.style)({ transform: 'translateX(-100%)' }))
        ])
    ]);
}
function slideToBottom() {
    return (0, animations_1.trigger)('routerTransition', [
        (0, animations_1.state)('void', (0, animations_1.style)({})),
        (0, animations_1.state)('*', (0, animations_1.style)({})),
        (0, animations_1.transition)(':enter', [
            (0, animations_1.style)({ transform: 'translateY(-100%)' }),
            (0, animations_1.animate)('0.5s ease-in-out', (0, animations_1.style)({ transform: 'translateY(0%)' }))
        ]),
        (0, animations_1.transition)(':leave', [
            (0, animations_1.style)({ transform: 'translateY(0%)' }),
            (0, animations_1.animate)('0.5s ease-in-out', (0, animations_1.style)({ transform: 'translateY(100%)' }))
        ])
    ]);
}
function slideToTop() {
    return (0, animations_1.trigger)('routerTransition', [
        (0, animations_1.state)('void', (0, animations_1.style)({})),
        (0, animations_1.state)('*', (0, animations_1.style)({})),
        (0, animations_1.transition)(':enter', [
            (0, animations_1.style)({ transform: 'translateY(100%)' }),
            (0, animations_1.animate)('0.5s ease-in-out', (0, animations_1.style)({ transform: 'translateY(0%)' }))
        ]),
        (0, animations_1.transition)(':leave', [
            (0, animations_1.style)({ transform: 'translateY(0%)' }),
            (0, animations_1.animate)('0.5s ease-in-out', (0, animations_1.style)({ transform: 'translateY(-100%)' }))
        ])
    ]);
}
