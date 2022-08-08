import { Animation, Browser, ChildProperty, Collection, Complex, Component, Draggable, Droppable, Event, EventHandler, KeyboardEvents, L10n, NotifyPropertyChanges, Property, SanitizeHtmlHelper, Touch, addClass, append, attributes, blazorTemplates, classList, closest, compile, createElement, detach, extend, formatUnit, getElement, getInstance, getRandomId, getUniqueID, getValue, isBlazor, isNullOrUndefined, isRippleEnabled, isUndefined, isVisible, matches, merge, remove, removeClass, resetBlazorTemplate, rippleEffect, select, selectAll, setStyleAttribute, setValue, updateBlazorTemplate } from './ej2-base.es2015.js';
import { ListBase } from './ej2-lists.es2015.js';
import { Popup, calculatePosition, createSpinner, fit, getScrollableParent, getZindexPartial, hideSpinner, isCollide, showSpinner } from './ej2-popups.es2015.js';
import { Button, createCheckBox, rippleMouseHandler } from './ej2-buttons.es2015.js';
import { DataManager, Query } from './ej2-data.es2015.js';
import { Input } from './ej2-inputs.es2015.js';

var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const CLS_ROOT = 'e-hscroll';
const CLS_RTL = 'e-rtl';
const CLS_DISABLE = 'e-overlay';
const CLS_HSCROLLBAR = 'e-hscroll-bar';
const CLS_HSCROLLCON = 'e-hscroll-content';
const CLS_NAVARROW = 'e-nav-arrow';
const CLS_NAVRIGHTARROW = 'e-nav-right-arrow';
const CLS_NAVLEFTARROW = 'e-nav-left-arrow';
const CLS_HSCROLLNAV = 'e-scroll-nav';
const CLS_HSCROLLNAVRIGHT = 'e-scroll-right-nav';
const CLS_HSCROLLNAVLEFT = 'e-scroll-left-nav';
const CLS_DEVICE = 'e-scroll-device';
const CLS_OVERLAY = 'e-scroll-overlay';
const CLS_RIGHTOVERLAY = 'e-scroll-right-overlay';
const CLS_LEFTOVERLAY = 'e-scroll-left-overlay';
const OVERLAY_MAXWID = 40;
/**
 * HScroll module is introduces horizontal scroller when content exceeds the current viewing area.
 * It can be useful for the components like Toolbar, Tab which needs horizontal scrolling alone.
 * Hidden content can be view by touch moving or icon click.
 * ```html
 * <div id="scroll"/>
 * <script>
 *   var scrollObj = new HScroll();
 *   scrollObj.appendTo("#scroll");
 * </script>
 * ```
 */
let HScroll = class HScroll extends Component {
    /**
     * Initializes a new instance of the HScroll class.
     *
     * @param {HScrollModel} options  - Specifies HScroll model properties as options.
     * @param {string | HTMLElement} element  - Specifies the element for which horizontal scrolling applies.
     */
    constructor(options, element) {
        super(options, element);
    }
    /**
     * Initialize the event handler
     *
     * @private
     * @returns {void}
     */
    preRender() {
        this.browser = Browser.info.name;
        this.browserCheck = this.browser === 'mozilla';
        this.isDevice = Browser.isDevice;
        this.customStep = true;
        const element = this.element;
        this.ieCheck = this.browser === 'edge' || this.browser === 'msie';
        this.initialize();
        if (element.id === '') {
            element.id = getUniqueID('hscroll');
            this.uniqueId = true;
        }
        element.style.display = 'block';
        if (this.enableRtl) {
            element.classList.add(CLS_RTL);
        }
    }
    /**
     * To Initialize the horizontal scroll  rendering
     *
     * @private
     * @returns {void}
     */
    render() {
        this.touchModule = new Touch(this.element, { scroll: this.touchHandler.bind(this), swipe: this.swipeHandler.bind(this) });
        EventHandler.add(this.scrollEle, 'scroll', this.scrollHandler, this);
        if (!this.isDevice) {
            this.createNavIcon(this.element);
        }
        else {
            this.element.classList.add(CLS_DEVICE);
            this.createOverlay(this.element);
        }
        this.setScrollState();
    }
    setScrollState() {
        if (isNullOrUndefined(this.scrollStep) || this.scrollStep < 0) {
            this.scrollStep = this.scrollEle.offsetWidth;
            this.customStep = false;
        }
        else {
            this.customStep = true;
        }
    }
    initialize() {
        const scrollEle = this.createElement('div', { className: CLS_HSCROLLCON });
        const scrollDiv = this.createElement('div', { className: CLS_HSCROLLBAR });
        scrollDiv.setAttribute('tabindex', '-1');
        const ele = this.element;
        const innerEle = [].slice.call(ele.children);
        for (const ele of innerEle) {
            scrollEle.appendChild(ele);
        }
        scrollDiv.appendChild(scrollEle);
        ele.appendChild(scrollDiv);
        scrollDiv.style.overflowX = 'hidden';
        this.scrollEle = scrollDiv;
        this.scrollItems = scrollEle;
    }
    getPersistData() {
        const keyEntity = ['scrollStep'];
        return this.addOnPersist(keyEntity);
    }
    /**
     * Returns the current module name.
     *
     * @returns {string} - It returns the current module name.
     * @private
     */
    getModuleName() {
        return 'hScroll';
    }
    /**
     * Removes the control from the DOM and also removes all its related events.
     *
     * @returns {void}
     */
    destroy() {
        const ele = this.element;
        ele.style.display = '';
        ele.classList.remove(CLS_ROOT);
        ele.classList.remove(CLS_DEVICE);
        const nav = selectAll('.e-' + ele.id + '_nav.' + CLS_HSCROLLNAV, ele);
        const overlay = selectAll('.' + CLS_OVERLAY, ele);
        [].slice.call(overlay).forEach((ele) => {
            detach(ele);
        });
        for (const elem of [].slice.call(this.scrollItems.children)) {
            ele.appendChild(elem);
        }
        if (this.uniqueId) {
            this.element.removeAttribute('id');
        }
        detach(this.scrollEle);
        if (nav.length > 0) {
            detach(nav[0]);
            if (!isNullOrUndefined(nav[1])) {
                detach(nav[1]);
            }
        }
        EventHandler.remove(this.scrollEle, 'scroll', this.scrollHandler);
        this.touchModule.destroy();
        this.touchModule = null;
        super.destroy();
    }
    /**
     * Specifies the value to disable/enable the HScroll component.
     * When set to `true` , the component will be disabled.
     *
     * @param  {boolean} value - Based on this Boolean value, HScroll will be enabled (false) or disabled (true).
     * @returns {void}.
     */
    disable(value) {
        const navEles = selectAll('.e-scroll-nav:not(.' + CLS_DISABLE + ')', this.element);
        if (value) {
            this.element.classList.add(CLS_DISABLE);
        }
        else {
            this.element.classList.remove(CLS_DISABLE);
        }
        [].slice.call(navEles).forEach((el) => {
            el.setAttribute('tabindex', !value ? '0' : '-1');
        });
    }
    createOverlay(element) {
        const id = element.id.concat('_nav');
        const rightOverlayEle = this.createElement('div', { className: CLS_OVERLAY + ' ' + CLS_RIGHTOVERLAY });
        const clsRight = 'e-' + element.id.concat('_nav ' + CLS_HSCROLLNAV + ' ' + CLS_HSCROLLNAVRIGHT);
        const rightEle = this.createElement('div', { id: id.concat('_right'), className: clsRight });
        const navItem = this.createElement('div', { className: CLS_NAVRIGHTARROW + ' ' + CLS_NAVARROW + ' e-icons' });
        rightEle.appendChild(navItem);
        const leftEle = this.createElement('div', { className: CLS_OVERLAY + ' ' + CLS_LEFTOVERLAY });
        if (this.ieCheck) {
            rightEle.classList.add('e-ie-align');
        }
        element.appendChild(rightOverlayEle);
        element.appendChild(rightEle);
        element.insertBefore(leftEle, element.firstChild);
        this.eventBinding([rightEle]);
    }
    createNavIcon(element) {
        const id = element.id.concat('_nav');
        const clsRight = 'e-' + element.id.concat('_nav ' + CLS_HSCROLLNAV + ' ' + CLS_HSCROLLNAVRIGHT);
        const nav = this.createElement('div', { id: id.concat('_right'), className: clsRight });
        nav.setAttribute('aria-disabled', 'false');
        const navItem = this.createElement('div', { className: CLS_NAVRIGHTARROW + ' ' + CLS_NAVARROW + ' e-icons' });
        const clsLeft = 'e-' + element.id.concat('_nav ' + CLS_HSCROLLNAV + ' ' + CLS_HSCROLLNAVLEFT);
        const navEle = this.createElement('div', { id: id.concat('_left'), className: clsLeft + ' ' + CLS_DISABLE });
        navEle.setAttribute('aria-disabled', 'true');
        const navLeftItem = this.createElement('div', { className: CLS_NAVLEFTARROW + ' ' + CLS_NAVARROW + ' e-icons' });
        navEle.appendChild(navLeftItem);
        nav.appendChild(navItem);
        element.appendChild(nav);
        element.insertBefore(navEle, element.firstChild);
        if (this.ieCheck) {
            nav.classList.add('e-ie-align');
            navEle.classList.add('e-ie-align');
        }
        this.eventBinding([nav, navEle]);
    }
    onKeyPress(e) {
        if (e.key === 'Enter') {
            const timeoutFun = () => {
                this.keyTimeout = true;
                this.eleScrolling(10, e.target, true);
            };
            this.keyTimer = window.setTimeout(() => {
                timeoutFun();
            }, 100);
        }
    }
    onKeyUp(e) {
        if (e.key !== 'Enter') {
            return;
        }
        if (this.keyTimeout) {
            this.keyTimeout = false;
        }
        else {
            e.target.click();
        }
        clearTimeout(this.keyTimer);
    }
    eventBinding(ele) {
        [].slice.call(ele).forEach((el) => {
            new Touch(el, { tapHold: this.tabHoldHandler.bind(this), tapHoldThreshold: 500 });
            el.addEventListener('keydown', this.onKeyPress.bind(this));
            el.addEventListener('keyup', this.onKeyUp.bind(this));
            el.addEventListener('mouseup', this.repeatScroll.bind(this));
            el.addEventListener('touchend', this.repeatScroll.bind(this));
            el.addEventListener('contextmenu', (e) => {
                e.preventDefault();
            });
            EventHandler.add(el, 'click', this.clickEventHandler, this);
        });
    }
    repeatScroll() {
        clearInterval(this.timeout);
    }
    tabHoldHandler(e) {
        let trgt = e.originalEvent.target;
        trgt = this.contains(trgt, CLS_HSCROLLNAV) ? trgt.firstElementChild : trgt;
        const scrollDis = 10;
        const timeoutFun = () => {
            this.eleScrolling(scrollDis, trgt, true);
        };
        this.timeout = window.setInterval(() => {
            timeoutFun();
        }, 50);
    }
    contains(ele, className) {
        return ele.classList.contains(className);
    }
    eleScrolling(scrollDis, trgt, isContinuous) {
        const rootEle = this.element;
        let classList$$1 = trgt.classList;
        if (classList$$1.contains(CLS_HSCROLLNAV)) {
            classList$$1 = trgt.querySelector('.' + CLS_NAVARROW).classList;
        }
        if (this.contains(rootEle, CLS_RTL) && this.browserCheck) {
            scrollDis = -scrollDis;
        }
        if ((!this.contains(rootEle, CLS_RTL) || this.browserCheck) || this.ieCheck) {
            if (classList$$1.contains(CLS_NAVRIGHTARROW)) {
                this.frameScrollRequest(scrollDis, 'add', isContinuous);
            }
            else {
                this.frameScrollRequest(scrollDis, '', isContinuous);
            }
        }
        else {
            if (classList$$1.contains(CLS_NAVLEFTARROW)) {
                this.frameScrollRequest(scrollDis, 'add', isContinuous);
            }
            else {
                this.frameScrollRequest(scrollDis, '', isContinuous);
            }
        }
    }
    clickEventHandler(e) {
        this.eleScrolling(this.scrollStep, e.target, false);
    }
    swipeHandler(e) {
        const swipeEle = this.scrollEle;
        let distance;
        if (e.velocity <= 1) {
            distance = e.distanceX / (e.velocity * 10);
        }
        else {
            distance = e.distanceX / e.velocity;
        }
        let start = 0.5;
        const animate = () => {
            const step = Math.sin(start);
            if (step <= 0) {
                window.cancelAnimationFrame(step);
            }
            else {
                if (e.swipeDirection === 'Left') {
                    swipeEle.scrollLeft += distance * step;
                }
                else if (e.swipeDirection === 'Right') {
                    swipeEle.scrollLeft -= distance * step;
                }
                start -= 0.5;
                window.requestAnimationFrame(animate);
            }
        };
        animate();
    }
    scrollUpdating(scrollVal, action) {
        if (action === 'add') {
            this.scrollEle.scrollLeft += scrollVal;
        }
        else {
            this.scrollEle.scrollLeft -= scrollVal;
        }
    }
    frameScrollRequest(scrollVal, action, isContinuous) {
        const step = 10;
        if (isContinuous) {
            this.scrollUpdating(scrollVal, action);
            return;
        }
        if (!this.customStep) {
            [].slice.call(selectAll('.' + CLS_OVERLAY, this.element)).forEach((el) => {
                scrollVal -= el.offsetWidth;
            });
        }
        const animate = () => {
            let scrollValue;
            let scrollStep;
            if (this.contains(this.element, CLS_RTL) && this.browserCheck) {
                scrollValue = -scrollVal;
                scrollStep = -step;
            }
            else {
                scrollValue = scrollVal;
                scrollStep = step;
            }
            if (scrollValue < step) {
                window.cancelAnimationFrame(scrollStep);
            }
            else {
                this.scrollUpdating(scrollStep, action);
                scrollVal -= scrollStep;
                window.requestAnimationFrame(animate);
            }
        };
        animate();
    }
    touchHandler(e) {
        const ele = this.scrollEle;
        let distance = e.distanceX;
        if ((this.ieCheck) && this.contains(this.element, CLS_RTL)) {
            distance = -distance;
        }
        if (e.scrollDirection === 'Left') {
            ele.scrollLeft = ele.scrollLeft + distance;
        }
        else if (e.scrollDirection === 'Right') {
            ele.scrollLeft = ele.scrollLeft - distance;
        }
    }
    arrowDisabling(addDisable, removeDisable) {
        if (this.isDevice) {
            const arrowEle = isNullOrUndefined(addDisable) ? removeDisable : addDisable;
            const arrowIcon = arrowEle.querySelector('.' + CLS_NAVARROW);
            if (isNullOrUndefined(addDisable)) {
                classList(arrowIcon, [CLS_NAVRIGHTARROW], [CLS_NAVLEFTARROW]);
            }
            else {
                classList(arrowIcon, [CLS_NAVLEFTARROW], [CLS_NAVRIGHTARROW]);
            }
        }
        else {
            addDisable.classList.add(CLS_DISABLE);
            addDisable.setAttribute('aria-disabled', 'true');
            addDisable.removeAttribute('tabindex');
            removeDisable.classList.remove(CLS_DISABLE);
            removeDisable.setAttribute('aria-disabled', 'false');
            removeDisable.setAttribute('tabindex', '0');
        }
        this.repeatScroll();
    }
    scrollHandler(e) {
        const target = e.target;
        const width = target.offsetWidth;
        const rootEle = this.element;
        const navLeftEle = this.element.querySelector('.' + CLS_HSCROLLNAVLEFT);
        const navRightEle = this.element.querySelector('.' + CLS_HSCROLLNAVRIGHT);
        let leftOverlay = this.element.querySelector('.' + CLS_LEFTOVERLAY);
        let rightOverlay = this.element.querySelector('.' + CLS_RIGHTOVERLAY);
        let scrollLeft = target.scrollLeft;
        if (scrollLeft <= 0) {
            scrollLeft = -scrollLeft;
        }
        if (this.isDevice) {
            if (this.enableRtl && !(this.browserCheck || this.ieCheck)) {
                leftOverlay = this.element.querySelector('.' + CLS_RIGHTOVERLAY);
                rightOverlay = this.element.querySelector('.' + CLS_LEFTOVERLAY);
            }
            if (scrollLeft < OVERLAY_MAXWID) {
                leftOverlay.style.width = scrollLeft + 'px';
            }
            else {
                leftOverlay.style.width = '40px';
            }
            if ((target.scrollWidth - Math.ceil(width + scrollLeft)) < OVERLAY_MAXWID) {
                rightOverlay.style.width = (target.scrollWidth - Math.ceil(width + scrollLeft)) + 'px';
            }
            else {
                rightOverlay.style.width = '40px';
            }
        }
        if (scrollLeft === 0) {
            if ((!this.contains(rootEle, CLS_RTL) || this.browserCheck) || this.ieCheck) {
                this.arrowDisabling(navLeftEle, navRightEle);
            }
            else {
                this.arrowDisabling(navRightEle, navLeftEle);
            }
        }
        else if (Math.ceil(width + scrollLeft + .1) >= target.scrollWidth) {
            if ((!this.contains(rootEle, CLS_RTL) || this.browserCheck) || this.ieCheck) {
                this.arrowDisabling(navRightEle, navLeftEle);
            }
            else {
                this.arrowDisabling(navLeftEle, navRightEle);
            }
        }
        else {
            const disEle = this.element.querySelector('.' + CLS_HSCROLLNAV + '.' + CLS_DISABLE);
            if (disEle) {
                disEle.classList.remove(CLS_DISABLE);
                disEle.setAttribute('aria-disabled', 'false');
                disEle.setAttribute('tabindex', '0');
            }
        }
    }
    /**
     * Gets called when the model property changes.The data that describes the old and new values of property that changed.
     *
     * @param  {HScrollModel} newProp - It contains the new value of data.
     * @param  {HScrollModel} oldProp - It contains the old value of data.
     * @returns {void}
     * @private
     */
    onPropertyChanged(newProp, oldProp) {
        for (const prop of Object.keys(newProp)) {
            switch (prop) {
                case 'scrollStep':
                    this.setScrollState();
                    break;
                case 'enableRtl':
                    newProp.enableRtl ? this.element.classList.add(CLS_RTL) : this.element.classList.remove(CLS_RTL);
                    break;
            }
        }
    }
};
__decorate([
    Property(null)
], HScroll.prototype, "scrollStep", void 0);
HScroll = __decorate([
    NotifyPropertyChanges
], HScroll);

var __decorate$1 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const CLS_ROOT$1 = 'e-vscroll';
const CLS_RTL$1 = 'e-rtl';
const CLS_DISABLE$1 = 'e-overlay';
const CLS_VSCROLLBAR = 'e-vscroll-bar';
const CLS_VSCROLLCON = 'e-vscroll-content';
const CLS_NAVARROW$1 = 'e-nav-arrow';
const CLS_NAVUPARROW = 'e-nav-up-arrow';
const CLS_NAVDOWNARROW = 'e-nav-down-arrow';
const CLS_VSCROLLNAV = 'e-scroll-nav';
const CLS_VSCROLLNAVUP = 'e-scroll-up-nav';
const CLS_VSCROLLNAVDOWN = 'e-scroll-down-nav';
const CLS_DEVICE$1 = 'e-scroll-device';
const CLS_OVERLAY$1 = 'e-scroll-overlay';
const CLS_UPOVERLAY = 'e-scroll-up-overlay';
const CLS_DOWNOVERLAY = 'e-scroll-down-overlay';
const OVERLAY_MAXWID$1 = 40;
/**
 * VScroll module is introduces vertical scroller when content exceeds the current viewing area.
 * It can be useful for the components like Toolbar, Tab which needs vertical scrolling alone.
 * Hidden content can be view by touch moving or icon click.
 * ```html
 * <div id="scroll"/>
 * <script>
 *   var scrollObj = new VScroll();
 *   scrollObj.appendTo("#scroll");
 * </script>
 * ```
 */
let VScroll = class VScroll extends Component {
    /**
     * Initializes a new instance of the VScroll class.
     *
     * @param {VScrollModel} options  - Specifies VScroll model properties as options.
     * @param {string | HTMLElement} element  - Specifies the element for which vertical scrolling applies.
     */
    constructor(options, element) {
        super(options, element);
    }
    /**
     * Initialize the event handler
     *
     * @private
     * @returns {void}
     */
    preRender() {
        this.browser = Browser.info.name;
        this.browserCheck = this.browser === 'mozilla';
        this.isDevice = Browser.isDevice;
        this.customStep = true;
        const ele = this.element;
        this.ieCheck = this.browser === 'edge' || this.browser === 'msie';
        this.initialize();
        if (ele.id === '') {
            ele.id = getUniqueID('vscroll');
            this.uniqueId = true;
        }
        ele.style.display = 'block';
        if (this.enableRtl) {
            ele.classList.add(CLS_RTL$1);
        }
    }
    /**
     * To Initialize the vertical scroll rendering
     *
     * @private
     * @returns {void}
     */
    render() {
        this.touchModule = new Touch(this.element, { scroll: this.touchHandler.bind(this), swipe: this.swipeHandler.bind(this) });
        EventHandler.add(this.scrollEle, 'scroll', this.scrollEventHandler, this);
        if (!this.isDevice) {
            this.createNavIcon(this.element);
        }
        else {
            this.element.classList.add(CLS_DEVICE$1);
            this.createOverlayElement(this.element);
        }
        this.setScrollState();
        EventHandler.add(this.element, 'wheel', this.wheelEventHandler, this);
    }
    setScrollState() {
        if (isNullOrUndefined(this.scrollStep) || this.scrollStep < 0) {
            this.scrollStep = this.scrollEle.offsetHeight;
            this.customStep = false;
        }
        else {
            this.customStep = true;
        }
    }
    initialize() {
        const scrollCnt = createElement('div', { className: CLS_VSCROLLCON });
        const scrollBar = createElement('div', { className: CLS_VSCROLLBAR });
        scrollBar.setAttribute('tabindex', '-1');
        const ele = this.element;
        const innerEle = [].slice.call(ele.children);
        for (const ele of innerEle) {
            scrollCnt.appendChild(ele);
        }
        scrollBar.appendChild(scrollCnt);
        ele.appendChild(scrollBar);
        scrollBar.style.overflowY = 'hidden';
        this.scrollEle = scrollBar;
        this.scrollItems = scrollCnt;
    }
    getPersistData() {
        const keyEntity = ['scrollStep'];
        return this.addOnPersist(keyEntity);
    }
    /**
     * Returns the current module name.
     *
     * @returns {string} - It returns the current module name.
     * @private
     */
    getModuleName() {
        return 'vScroll';
    }
    /**
     * Removes the control from the DOM and also removes all its related events.
     *
     * @returns {void}
     */
    destroy() {
        const el = this.element;
        el.style.display = '';
        removeClass([this.element], [CLS_ROOT$1, CLS_DEVICE$1]);
        const navs = selectAll('.e-' + el.id + '_nav.' + CLS_VSCROLLNAV, el);
        const overlays = selectAll('.' + CLS_OVERLAY$1, el);
        [].slice.call(overlays).forEach((ele) => {
            detach(ele);
        });
        for (const elem of [].slice.call(this.scrollItems.children)) {
            el.appendChild(elem);
        }
        if (this.uniqueId) {
            this.element.removeAttribute('id');
        }
        detach(this.scrollEle);
        if (navs.length > 0) {
            detach(navs[0]);
            if (!isNullOrUndefined(navs[1])) {
                detach(navs[1]);
            }
        }
        EventHandler.remove(this.scrollEle, 'scroll', this.scrollEventHandler);
        this.touchModule.destroy();
        this.touchModule = null;
        super.destroy();
    }
    /**
     * Specifies the value to disable/enable the VScroll component.
     * When set to `true` , the component will be disabled.
     *
     * @param  {boolean} value - Based on this Boolean value, VScroll will be enabled (false) or disabled (true).
     * @returns {void}.
     */
    disable(value) {
        const navEle = selectAll('.e-scroll-nav:not(.' + CLS_DISABLE$1 + ')', this.element);
        if (value) {
            this.element.classList.add(CLS_DISABLE$1);
        }
        else {
            this.element.classList.remove(CLS_DISABLE$1);
        }
        [].slice.call(navEle).forEach((el) => {
            el.setAttribute('tabindex', !value ? '0' : '-1');
        });
    }
    createOverlayElement(element) {
        const id = element.id.concat('_nav');
        const downOverlayEle = createElement('div', { className: CLS_OVERLAY$1 + ' ' + CLS_DOWNOVERLAY });
        const clsDown = 'e-' + element.id.concat('_nav ' + CLS_VSCROLLNAV + ' ' + CLS_VSCROLLNAVDOWN);
        const downEle = createElement('div', { id: id.concat('down'), className: clsDown });
        const navItem = createElement('div', { className: CLS_NAVDOWNARROW + ' ' + CLS_NAVARROW$1 + ' e-icons' });
        downEle.appendChild(navItem);
        const upEle = createElement('div', { className: CLS_OVERLAY$1 + ' ' + CLS_UPOVERLAY });
        if (this.ieCheck) {
            downEle.classList.add('e-ie-align');
        }
        element.appendChild(downOverlayEle);
        element.appendChild(downEle);
        element.insertBefore(upEle, element.firstChild);
        this.eventBinding([downEle]);
    }
    createNavIcon(element) {
        const id = element.id.concat('_nav');
        const clsDown = 'e-' + element.id.concat('_nav ' + CLS_VSCROLLNAV + ' ' + CLS_VSCROLLNAVDOWN);
        const nav = createElement('div', { id: id.concat('_down'), className: clsDown });
        nav.setAttribute('aria-disabled', 'false');
        const navItem = createElement('div', { className: CLS_NAVDOWNARROW + ' ' + CLS_NAVARROW$1 + ' e-icons' });
        const clsUp = 'e-' + element.id.concat('_nav ' + CLS_VSCROLLNAV + ' ' + CLS_VSCROLLNAVUP);
        const navElement = createElement('div', { id: id.concat('_up'), className: clsUp + ' ' + CLS_DISABLE$1 });
        navElement.setAttribute('aria-disabled', 'true');
        const navUpItem = createElement('div', { className: CLS_NAVUPARROW + ' ' + CLS_NAVARROW$1 + ' e-icons' });
        navElement.appendChild(navUpItem);
        nav.appendChild(navItem);
        nav.setAttribute('tabindex', '0');
        element.appendChild(nav);
        element.insertBefore(navElement, element.firstChild);
        if (this.ieCheck) {
            nav.classList.add('e-ie-align');
            navElement.classList.add('e-ie-align');
        }
        this.eventBinding([nav, navElement]);
    }
    onKeyPress(ev) {
        if (ev.key === 'Enter') {
            const timeoutFun = () => {
                this.keyTimeout = true;
                this.eleScrolling(10, ev.target, true);
            };
            this.keyTimer = window.setTimeout(() => {
                timeoutFun();
            }, 100);
        }
    }
    onKeyUp(ev) {
        if (ev.key !== 'Enter') {
            return;
        }
        if (this.keyTimeout) {
            this.keyTimeout = false;
        }
        else {
            ev.target.click();
        }
        clearTimeout(this.keyTimer);
    }
    eventBinding(element) {
        [].slice.call(element).forEach((ele) => {
            new Touch(ele, { tapHold: this.tabHoldHandler.bind(this), tapHoldThreshold: 500 });
            ele.addEventListener('keydown', this.onKeyPress.bind(this));
            ele.addEventListener('keyup', this.onKeyUp.bind(this));
            ele.addEventListener('mouseup', this.repeatScroll.bind(this));
            ele.addEventListener('touchend', this.repeatScroll.bind(this));
            ele.addEventListener('contextmenu', (e) => {
                e.preventDefault();
            });
            EventHandler.add(ele, 'click', this.clickEventHandler, this);
        });
    }
    repeatScroll() {
        clearInterval(this.timeout);
    }
    tabHoldHandler(ev) {
        let trgt = ev.originalEvent.target;
        trgt = this.contains(trgt, CLS_VSCROLLNAV) ? trgt.firstElementChild : trgt;
        const scrollDistance = 10;
        const timeoutFun = () => {
            this.eleScrolling(scrollDistance, trgt, true);
        };
        this.timeout = window.setInterval(() => {
            timeoutFun();
        }, 50);
    }
    contains(element, className) {
        return element.classList.contains(className);
    }
    eleScrolling(scrollDis, trgt, isContinuous) {
        let classList$$1 = trgt.classList;
        if (classList$$1.contains(CLS_VSCROLLNAV)) {
            classList$$1 = trgt.querySelector('.' + CLS_NAVARROW$1).classList;
        }
        if (classList$$1.contains(CLS_NAVDOWNARROW)) {
            this.frameScrollRequest(scrollDis, 'add', isContinuous);
        }
        else if (classList$$1.contains(CLS_NAVUPARROW)) {
            this.frameScrollRequest(scrollDis, '', isContinuous);
        }
    }
    clickEventHandler(event) {
        this.eleScrolling(this.scrollStep, event.target, false);
    }
    wheelEventHandler(e) {
        e.preventDefault();
        this.frameScrollRequest(this.scrollStep, (e.deltaY > 0 ? 'add' : ''), false);
    }
    swipeHandler(e) {
        const swipeElement = this.scrollEle;
        let distance;
        if (e.velocity <= 1) {
            distance = e.distanceY / (e.velocity * 10);
        }
        else {
            distance = e.distanceY / e.velocity;
        }
        let start = 0.5;
        const animate = () => {
            const step = Math.sin(start);
            if (step <= 0) {
                window.cancelAnimationFrame(step);
            }
            else {
                if (e.swipeDirection === 'Up') {
                    swipeElement.scrollTop += distance * step;
                }
                else if (e.swipeDirection === 'Down') {
                    swipeElement.scrollTop -= distance * step;
                }
                start -= 0.02;
                window.requestAnimationFrame(animate);
            }
        };
        animate();
    }
    scrollUpdating(scrollVal, action) {
        if (action === 'add') {
            this.scrollEle.scrollTop += scrollVal;
        }
        else {
            this.scrollEle.scrollTop -= scrollVal;
        }
    }
    frameScrollRequest(scrollValue, action, isContinuous) {
        const step = 10;
        if (isContinuous) {
            this.scrollUpdating(scrollValue, action);
            return;
        }
        if (!this.customStep) {
            [].slice.call(selectAll('.' + CLS_OVERLAY$1, this.element)).forEach((el) => {
                scrollValue -= el.offsetHeight;
            });
        }
        const animate = () => {
            if (scrollValue < step) {
                window.cancelAnimationFrame(step);
            }
            else {
                this.scrollUpdating(step, action);
                scrollValue -= step;
                window.requestAnimationFrame(animate);
            }
        };
        animate();
    }
    touchHandler(e) {
        const el = this.scrollEle;
        const distance = e.distanceY;
        if (e.scrollDirection === 'Up') {
            el.scrollTop = el.scrollTop + distance;
        }
        else if (e.scrollDirection === 'Down') {
            el.scrollTop = el.scrollTop - distance;
        }
    }
    arrowDisabling(addDisableCls, removeDisableCls) {
        if (this.isDevice) {
            const arrowEle = isNullOrUndefined(addDisableCls) ? removeDisableCls : addDisableCls;
            const arrowIcon = arrowEle.querySelector('.' + CLS_NAVARROW$1);
            if (isNullOrUndefined(addDisableCls)) {
                classList(arrowIcon, [CLS_NAVDOWNARROW], [CLS_NAVUPARROW]);
            }
            else {
                classList(arrowIcon, [CLS_NAVUPARROW], [CLS_NAVDOWNARROW]);
            }
        }
        else {
            addDisableCls.classList.add(CLS_DISABLE$1);
            addDisableCls.setAttribute('aria-disabled', 'true');
            addDisableCls.removeAttribute('tabindex');
            removeDisableCls.classList.remove(CLS_DISABLE$1);
            removeDisableCls.setAttribute('aria-disabled', 'false');
            removeDisableCls.setAttribute('tabindex', '0');
        }
        this.repeatScroll();
    }
    scrollEventHandler(e) {
        const target = e.target;
        const height = target.offsetHeight;
        const navUpEle = this.element.querySelector('.' + CLS_VSCROLLNAVUP);
        const navDownEle = this.element.querySelector('.' + CLS_VSCROLLNAVDOWN);
        const upOverlay = this.element.querySelector('.' + CLS_UPOVERLAY);
        const downOverlay = this.element.querySelector('.' + CLS_DOWNOVERLAY);
        let scrollTop = target.scrollTop;
        if (scrollTop <= 0) {
            scrollTop = -scrollTop;
        }
        if (this.isDevice) {
            if (scrollTop < OVERLAY_MAXWID$1) {
                upOverlay.style.height = scrollTop + 'px';
            }
            else {
                upOverlay.style.height = '40px';
            }
            if ((target.scrollHeight - Math.ceil(height + scrollTop)) < OVERLAY_MAXWID$1) {
                downOverlay.style.height = (target.scrollHeight - Math.ceil(height + scrollTop)) + 'px';
            }
            else {
                downOverlay.style.height = '40px';
            }
        }
        if (scrollTop === 0) {
            this.arrowDisabling(navUpEle, navDownEle);
        }
        else if (Math.ceil(height + scrollTop + .1) >= target.scrollHeight) {
            this.arrowDisabling(navDownEle, navUpEle);
        }
        else {
            const disEle = this.element.querySelector('.' + CLS_VSCROLLNAV + '.' + CLS_DISABLE$1);
            if (disEle) {
                disEle.classList.remove(CLS_DISABLE$1);
                disEle.setAttribute('aria-disabled', 'false');
                disEle.setAttribute('tabindex', '0');
            }
        }
    }
    /**
     * Gets called when the model property changes.The data that describes the old and new values of property that changed.
     *
     * @param  {VScrollModel} newProp - It contains the new value of data.
     * @param  {VScrollModel} oldProp - It contains the old value of data.
     * @returns {void}
     * @private
     */
    onPropertyChanged(newProp, oldProp) {
        for (const prop of Object.keys(newProp)) {
            switch (prop) {
                case 'scrollStep':
                    this.setScrollState();
                    break;
                case 'enableRtl':
                    if (newProp.enableRtl) {
                        this.element.classList.add(CLS_RTL$1);
                    }
                    else {
                        this.element.classList.remove(CLS_RTL$1);
                    }
                    break;
            }
        }
    }
};
__decorate$1([
    Property(null)
], VScroll.prototype, "scrollStep", void 0);
VScroll = __decorate$1([
    NotifyPropertyChanges
], VScroll);

/**
 * Used to add scroll in menu.
 *
 * @param {createElementType} createElement - Specifies the create element model
 * @param {HTMLElement} container - Specifies the element container
 * @param {HTMLElement} content - Specifies the content element
 * @param {string} scrollType - Specifies the scroll type
 * @param {boolean} enableRtl - Specifies the enable RTL property
 * @param {boolean} offset - Specifies the offset value
 * @returns {HTMLElement} - Element
 * @hidden
 */
function addScrolling(createElement$$1, container, content, scrollType, enableRtl, offset) {
    let containerOffset;
    let contentOffset;
    const parentElem = container.parentElement;
    if (scrollType === 'vscroll') {
        containerOffset = offset || container.getBoundingClientRect().height;
        contentOffset = content.getBoundingClientRect().height;
    }
    else {
        containerOffset = container.getBoundingClientRect().width;
        contentOffset = content.getBoundingClientRect().width;
    }
    if (containerOffset < contentOffset) {
        return createScrollbar(createElement$$1, container, content, scrollType, enableRtl, offset);
    }
    else if (parentElem) {
        const width = parentElem.getBoundingClientRect().width;
        if (width < containerOffset && scrollType === 'hscroll') {
            contentOffset = width;
            container.style.maxWidth = width + 'px';
            return createScrollbar(createElement$$1, container, content, scrollType, enableRtl, offset);
        }
        return content;
    }
    else {
        return content;
    }
}
/**
 * Used to create scroll bar in menu.
 *
 * @param {createElementType} createElement - Specifies the create element model
 * @param {HTMLElement} container - Specifies the element container
 * @param {HTMLElement} content - Specifies the content element
 * @param {string} scrollType - Specifies the scroll type
 * @param {boolean} enableRtl - Specifies the enable RTL property
 * @param {boolean} offset - Specifies the offset value
 * @returns {HTMLElement} - Element
 * @hidden
 */
function createScrollbar(createElement$$1, container, content, scrollType, enableRtl, offset) {
    const scrollEle = createElement$$1('div', { className: 'e-menu-' + scrollType });
    container.appendChild(scrollEle);
    scrollEle.appendChild(content);
    if (offset) {
        scrollEle.style.overflow = 'hidden';
        scrollEle.style.height = offset + 'px';
    }
    else {
        scrollEle.style.maxHeight = container.style.maxHeight;
        container.style.overflow = 'hidden';
    }
    let scrollObj;
    if (scrollType === 'vscroll') {
        scrollObj = new VScroll({ enableRtl: enableRtl }, scrollEle);
        scrollObj.scrollStep = select('.e-' + scrollType + '-bar', container).offsetHeight / 2;
    }
    else {
        scrollObj = new HScroll({ enableRtl: enableRtl }, scrollEle);
        scrollObj.scrollStep = select('.e-' + scrollType + '-bar', container).offsetWidth;
    }
    return scrollEle;
}
/**
 * Used to destroy the scroll option.
 *
 * @param {VScroll | HScroll} scrollObj - Specifies the scroller object
 * @param {Element} element - Specifies the element
 * @param {HTMLElement} skipEle - Specifies the skip  element
 * @returns {void}
 * @hidden
 */
function destroyScroll(scrollObj, element, skipEle) {
    if (scrollObj) {
        const menu = select('.e-menu-parent', element);
        if (menu) {
            if (!skipEle || skipEle === menu) {
                scrollObj.destroy();
                element.parentElement.appendChild(menu);
                detach(element);
            }
        }
        else {
            scrollObj.destroy();
            detach(element);
        }
    }
}

var __decorate$2 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const ENTER = 'enter';
const ESCAPE = 'escape';
const FOCUSED = 'e-focused';
const HEADER = 'e-menu-header';
const SELECTED = 'e-selected';
const SEPARATOR = 'e-separator';
const UPARROW = 'uparrow';
const DOWNARROW = 'downarrow';
const LEFTARROW = 'leftarrow';
const RIGHTARROW = 'rightarrow';
const HOME = 'home';
const END = 'end';
const CARET = 'e-caret';
const ITEM = 'e-menu-item';
const DISABLED = 'e-disabled';
const HIDE = 'e-menu-hide';
const ICONS = 'e-icons';
const RTL = 'e-rtl';
const POPUP = 'e-menu-popup';
const TEMPLATE_PROPERTY = 'Template';
/**
 * Configures the field options of the Menu.
 */
class FieldSettings extends ChildProperty {
}
__decorate$2([
    Property('id')
], FieldSettings.prototype, "itemId", void 0);
__decorate$2([
    Property('parentId')
], FieldSettings.prototype, "parentId", void 0);
__decorate$2([
    Property('text')
], FieldSettings.prototype, "text", void 0);
__decorate$2([
    Property('iconCss')
], FieldSettings.prototype, "iconCss", void 0);
__decorate$2([
    Property('url')
], FieldSettings.prototype, "url", void 0);
__decorate$2([
    Property('separator')
], FieldSettings.prototype, "separator", void 0);
__decorate$2([
    Property('items')
], FieldSettings.prototype, "children", void 0);
/**
 * Specifies menu items.
 */
class MenuItem extends ChildProperty {
}
__decorate$2([
    Property(null)
], MenuItem.prototype, "iconCss", void 0);
__decorate$2([
    Property('')
], MenuItem.prototype, "id", void 0);
__decorate$2([
    Property(false)
], MenuItem.prototype, "separator", void 0);
__decorate$2([
    Collection([], MenuItem)
], MenuItem.prototype, "items", void 0);
__decorate$2([
    Property('')
], MenuItem.prototype, "text", void 0);
__decorate$2([
    Property('')
], MenuItem.prototype, "url", void 0);
/**
 * Animation configuration settings.
 */
class MenuAnimationSettings extends ChildProperty {
}
__decorate$2([
    Property('SlideDown')
], MenuAnimationSettings.prototype, "effect", void 0);
__decorate$2([
    Property(400)
], MenuAnimationSettings.prototype, "duration", void 0);
__decorate$2([
    Property('ease')
], MenuAnimationSettings.prototype, "easing", void 0);
/**
 * Base class for Menu and ContextMenu components.
 *
 *  @private
 */
let MenuBase = class MenuBase extends Component {
    /**
     * Constructor for creating the widget.
     *
     * @private
     * @param {MenuBaseModel} options - Specifies the menu base model
     * @param {string | HTMLUListElement} element - Specifies the element
     */
    constructor(options, element) {
        super(options, element);
        this.navIdx = [];
        this.animation = new Animation({});
        this.isTapHold = false;
        this.tempItem = [];
        this.showSubMenuOn = 'Auto';
    }
    /**
     * Initialized third party configuration settings.
     *
     * @private
     * @returns {void}
     */
    preRender() {
        if (!this.isMenu) {
            let ul;
            if (this.element.tagName === 'EJS-CONTEXTMENU') {
                ul = this.createElement('ul', {
                    id: getUniqueID(this.getModuleName()), className: 'e-control e-lib e-' + this.getModuleName()
                });
                const ejInst = getValue('ej2_instances', this.element);
                removeClass([this.element], ['e-control', 'e-lib', 'e-' + this.getModuleName()]);
                this.clonedElement = this.element;
                this.element = ul;
                setValue('ej2_instances', ejInst, this.element);
            }
            else {
                ul = this.createElement('ul', { id: getUniqueID(this.getModuleName()) });
                append([].slice.call(this.element.cloneNode(true).children), ul);
                const refEle = this.element.nextElementSibling;
                if (refEle) {
                    this.element.parentElement.insertBefore(ul, refEle);
                }
                else {
                    this.element.parentElement.appendChild(ul);
                }
                this.clonedElement = ul;
            }
            this.clonedElement.style.display = 'none';
        }
        if (this.element.tagName === 'EJS-MENU') {
            let ele = this.element;
            const ejInstance = getValue('ej2_instances', ele);
            const ul = this.createElement('ul');
            const wrapper = this.createElement('EJS-MENU', { className: 'e-' + this.getModuleName() + '-wrapper' });
            for (let idx = 0, len = ele.attributes.length; idx < len; idx++) {
                ul.setAttribute(ele.attributes[idx].nodeName, ele.attributes[idx].nodeValue);
            }
            ele.parentNode.insertBefore(wrapper, ele);
            detach(ele);
            ele = ul;
            wrapper.appendChild(ele);
            setValue('ej2_instances', ejInstance, ele);
            this.clonedElement = wrapper;
            this.element = ele;
            if (!this.element.id) {
                this.element.id = getUniqueID(this.getModuleName());
            }
        }
    }
    /**
     * Initialize the control rendering.
     *
     * @private
     * @returns {void}
     */
    render() {
        this.initialize();
        this.renderItems();
        if (this.isMenu && this.template && isBlazor()) {
            const menuTemplateId = this.element.id + TEMPLATE_PROPERTY;
            resetBlazorTemplate(menuTemplateId, TEMPLATE_PROPERTY);
            if (Object.keys(blazorTemplates).length) {
                extend(this.tempItem, blazorTemplates[menuTemplateId], [], true);
            }
            updateBlazorTemplate(menuTemplateId, TEMPLATE_PROPERTY, this);
        }
        this.wireEvents();
        this.renderComplete();
        const wrapper = this.getWrapper();
        if (this.template && this.enableScrolling && (this.isReact || this.isAngular)) {
            requestAnimationFrame(() => {
                addScrolling(this.createElement, wrapper, this.element, 'hscroll', this.enableRtl);
            });
        }
    }
    initialize() {
        let wrapper = this.getWrapper();
        if (!wrapper) {
            wrapper = this.createElement('div', { className: 'e-' + this.getModuleName() + '-wrapper' });
            if (this.isMenu) {
                this.element.parentElement.insertBefore(wrapper, this.element);
            }
            else {
                document.body.appendChild(wrapper);
            }
        }
        if (this.cssClass) {
            addClass([wrapper], this.cssClass.split(' '));
        }
        if (this.enableRtl) {
            wrapper.classList.add(RTL);
        }
        wrapper.appendChild(this.element);
        if (this.isMenu && this.hamburgerMode) {
            if (!this.target) {
                this.createHeaderContainer(wrapper);
            }
        }
        this.defaultOption = this.showItemOnClick;
    }
    renderItems() {
        if (!this.items.length) {
            const items = ListBase.createJsonFromElement(this.element, { fields: { child: 'items' } });
            this.setProperties({ items: items }, true);
            if (isBlazor()) {
                this.element = this.removeChildElement(this.element);
            }
            else {
                this.element.innerHTML = '';
            }
        }
        const ul = this.createItems(this.items);
        append(Array.prototype.slice.call(ul.children), this.element);
        this.element.classList.add('e-menu-parent');
        if (this.isMenu) {
            if (!this.hamburgerMode && this.element.classList.contains('e-vertical')) {
                this.setBlankIconStyle(this.element);
            }
            if (this.enableScrolling) {
                const wrapper = this.getWrapper();
                if (this.element.classList.contains('e-vertical')) {
                    addScrolling(this.createElement, wrapper, this.element, 'vscroll', this.enableRtl);
                }
                else {
                    addScrolling(this.createElement, wrapper, this.element, 'hscroll', this.enableRtl);
                }
            }
        }
    }
    wireEvents() {
        const wrapper = this.getWrapper();
        if (this.target) {
            let target;
            const targetElems = selectAll(this.target);
            for (let i = 0, len = targetElems.length; i < len; i++) {
                target = targetElems[i];
                if (this.isMenu) {
                    EventHandler.add(target, 'click', this.menuHeaderClickHandler, this);
                }
                else {
                    if (Browser.isIos) {
                        new Touch(target, { tapHold: this.touchHandler.bind(this) });
                    }
                    else {
                        EventHandler.add(target, 'contextmenu', this.cmenuHandler, this);
                    }
                }
            }
            this.targetElement = target;
            if (!this.isMenu) {
                EventHandler.add(this.targetElement, 'scroll', this.scrollHandler, this);
                for (const parent of getScrollableParent(this.targetElement)) {
                    EventHandler.add(parent, 'scroll', this.scrollHandler, this);
                }
            }
        }
        if (!Browser.isDevice) {
            this.delegateMoverHandler = this.moverHandler.bind(this);
            this.delegateMouseDownHandler = this.mouseDownHandler.bind(this);
            EventHandler.add(this.isMenu ? document : wrapper, 'mouseover', this.delegateMoverHandler, this);
            EventHandler.add(document, 'mousedown', this.delegateMouseDownHandler, this);
        }
        this.delegateClickHandler = this.clickHandler.bind(this);
        EventHandler.add(document, 'click', this.delegateClickHandler, this);
        this.wireKeyboardEvent(wrapper);
        this.rippleFn = rippleEffect(wrapper, { selector: '.' + ITEM });
    }
    wireKeyboardEvent(element) {
        const keyConfigs = {
            downarrow: DOWNARROW,
            uparrow: UPARROW,
            enter: ENTER,
            leftarrow: LEFTARROW,
            rightarrow: RIGHTARROW,
            escape: ESCAPE
        };
        if (this.isMenu) {
            keyConfigs.home = HOME;
            keyConfigs.end = END;
        }
        new KeyboardEvents(element, {
            keyAction: this.keyBoardHandler.bind(this),
            keyConfigs: keyConfigs
        });
    }
    mouseDownHandler(e) {
        if (closest(e.target, '.e-' + this.getModuleName() + '-wrapper') !== this.getWrapper()
            && (!closest(e.target, '.e-' + this.getModuleName() + '-popup'))) {
            this.closeMenu(this.isMenu ? null : this.navIdx.length, e);
        }
    }
    keyBoardHandler(e) {
        let actionName = '';
        const trgt = e.target;
        let actionNeeded = this.isMenu && !this.hamburgerMode && !this.element.classList.contains('e-vertical')
            && this.navIdx.length < 1;
        e.preventDefault();
        if (this.enableScrolling && e.keyCode === 13 && trgt.classList.contains('e-scroll-nav')) {
            this.removeLIStateByClass([FOCUSED, SELECTED], [closest(trgt, '.e-' + this.getModuleName() + '-wrapper')]);
        }
        if (actionNeeded) {
            switch (e.action) {
                case RIGHTARROW:
                    actionName = RIGHTARROW;
                    e.action = DOWNARROW;
                    break;
                case LEFTARROW:
                    actionName = LEFTARROW;
                    e.action = UPARROW;
                    break;
                case DOWNARROW:
                    actionName = DOWNARROW;
                    e.action = RIGHTARROW;
                    break;
                case UPARROW:
                    actionName = UPARROW;
                    e.action = '';
                    break;
            }
        }
        else if (this.enableRtl) {
            switch (e.action) {
                case LEFTARROW:
                    actionNeeded = true;
                    actionName = LEFTARROW;
                    e.action = RIGHTARROW;
                    break;
                case RIGHTARROW:
                    actionNeeded = true;
                    actionName = RIGHTARROW;
                    e.action = LEFTARROW;
                    break;
            }
        }
        switch (e.action) {
            case DOWNARROW:
            case UPARROW:
            case END:
            case HOME:
                this.upDownKeyHandler(e);
                break;
            case RIGHTARROW:
                this.rightEnterKeyHandler(e);
                break;
            case LEFTARROW:
                this.leftEscKeyHandler(e);
                break;
            case ENTER:
                if (this.hamburgerMode && trgt.tagName === 'SPAN' && trgt.classList.contains('e-menu-icon')) {
                    this.menuHeaderClickHandler(e);
                }
                else {
                    this.rightEnterKeyHandler(e);
                }
                break;
            case ESCAPE:
                this.leftEscKeyHandler(e);
                break;
        }
        if (actionNeeded) {
            e.action = actionName;
        }
    }
    upDownKeyHandler(e) {
        const cul = this.getUlByNavIdx();
        const defaultIdx = (e.action === DOWNARROW || e.action === HOME) ? 0 : cul.childElementCount - 1;
        let fliIdx = defaultIdx;
        const fli = this.getLIByClass(cul, FOCUSED);
        if (fli) {
            if (e.action !== END && e.action !== HOME) {
                fliIdx = this.getIdx(cul, fli);
            }
            fli.classList.remove(FOCUSED);
            if (e.action !== END && e.action !== HOME) {
                if (e.action === DOWNARROW) {
                    fliIdx++;
                }
                else {
                    fliIdx--;
                }
                if (fliIdx === (e.action === DOWNARROW ? cul.childElementCount : -1)) {
                    fliIdx = defaultIdx;
                }
            }
        }
        const cli = cul.children[fliIdx];
        fliIdx = this.isValidLI(cli, fliIdx, e.action);
        cul.children[fliIdx].classList.add(FOCUSED);
        cul.children[fliIdx].focus();
    }
    isValidLI(cli, index, action) {
        const cul = this.getUlByNavIdx();
        if (cli.classList.contains(SEPARATOR) || cli.classList.contains(DISABLED) || cli.classList.contains(HIDE)) {
            if ((action === DOWNARROW) || (action === RIGHTARROW)) {
                index++;
            }
            else {
                index--;
            }
        }
        cli = cul.children[index];
        if (cli.classList.contains(SEPARATOR) || cli.classList.contains(DISABLED) || cli.classList.contains(HIDE)) {
            index = this.isValidLI(cli, index, action);
        }
        return index;
    }
    getUlByNavIdx(navIdxLen = this.navIdx.length) {
        if (this.isMenu) {
            const popup = [this.getWrapper()].concat([].slice.call(selectAll('.' + POPUP)))[navIdxLen];
            return isNullOrUndefined(popup) ? null : select('.e-menu-parent', popup);
        }
        else {
            return this.getWrapper().children[navIdxLen];
        }
    }
    rightEnterKeyHandler(e) {
        let eventArgs;
        const cul = this.getUlByNavIdx();
        const fli = this.getLIByClass(cul, FOCUSED);
        if (fli) {
            const fliIdx = this.getIdx(cul, fli);
            const navIdx = this.navIdx.concat(fliIdx);
            const item = this.getItem(navIdx);
            if (item.items.length) {
                this.navIdx.push(fliIdx);
                this.keyType = 'right';
                this.action = e.action;
                this.openMenu(fli, item, -1, -1, e);
            }
            else {
                if (e.action === ENTER) {
                    if (this.isMenu && this.navIdx.length === 0) {
                        this.removeLIStateByClass([SELECTED], [this.getWrapper()]);
                    }
                    else {
                        fli.classList.remove(FOCUSED);
                    }
                    fli.classList.add(SELECTED);
                    eventArgs = { element: fli, item: item, event: e };
                    this.trigger('select', eventArgs);
                    this.closeMenu(null, e);
                }
            }
        }
    }
    leftEscKeyHandler(e) {
        if (this.navIdx.length) {
            this.keyType = 'left';
            this.closeMenu(this.navIdx.length, e);
        }
        else {
            if (e.action === ESCAPE) {
                this.closeMenu(null, e);
            }
        }
    }
    scrollHandler(e) {
        this.closeMenu(null, e);
    }
    touchHandler(e) {
        this.isTapHold = true;
        this.cmenuHandler(e.originalEvent);
    }
    cmenuHandler(e) {
        e.preventDefault();
        this.isCMenu = true;
        this.pageX = e.changedTouches ? e.changedTouches[0].pageX + 1 : e.pageX + 1;
        this.pageY = e.changedTouches ? e.changedTouches[0].pageY + 1 : e.pageY + 1;
        this.closeMenu(null, e);
        if (this.isCMenu) {
            if (this.canOpen(e.target)) {
                this.openMenu(null, null, this.pageY, this.pageX, e);
            }
            this.isCMenu = false;
        }
    }
    // eslint:disable-next-line:max-func-body-length
    closeMenu(ulIndex = 0, e = null, isIterated) {
        if (this.isMenuVisible()) {
            let sli;
            let item;
            const wrapper = this.getWrapper();
            let beforeCloseArgs;
            let items;
            const popups = this.getPopups();
            let isClose = false;
            const cnt = this.isMenu ? popups.length + 1 : wrapper.childElementCount;
            const ul = this.isMenu && cnt !== 1 ? select('.e-ul', popups[cnt - 2])
                : selectAll('.e-menu-parent', wrapper)[cnt - 1];
            if (this.isMenu && ul.classList.contains('e-menu')) {
                sli = this.getLIByClass(ul, SELECTED);
                if (sli) {
                    sli.classList.remove(SELECTED);
                }
                isClose = true;
            }
            if (!isClose) {
                const liElem = e && e.target && this.getLI(e.target);
                item = this.navIdx.length ? this.getItem(this.navIdx) : null;
                items = item ? item.items : this.items;
                beforeCloseArgs = { element: ul, parentItem: this.isMenu && isBlazor() ? this.getMenuItemModel(item, ulIndex) : item,
                    items: items, event: e, cancel: false, isFocused: true };
                this.trigger('beforeClose', beforeCloseArgs, (observedCloseArgs) => {
                    let popupEle;
                    let closeArgs;
                    let popupId = '';
                    let popupObj;
                    const isOpen = !observedCloseArgs.cancel;
                    if (isOpen || this.isCMenu) {
                        if (this.isMenu) {
                            popupEle = closest(ul, '.' + POPUP);
                            if (this.hamburgerMode) {
                                popupEle.parentElement.style.minHeight = '';
                                closest(ul, '.e-menu-item').setAttribute('aria-expanded', 'false');
                            }
                            this.unWireKeyboardEvent(popupEle);
                            destroyScroll(getInstance(popupEle.children[0], VScroll), popupEle.children[0]);
                            popupObj = getInstance(popupEle, Popup);
                            popupObj.hide();
                            popupId = popupEle.id;
                            popupObj.destroy();
                            detach(popupEle);
                        }
                        else {
                            this.toggleAnimation(ul, false);
                        }
                        closeArgs = { element: ul, parentItem: item, items: items };
                        this.trigger('onClose', closeArgs);
                        this.navIdx.pop();
                    }
                    this.updateReactTemplate();
                    let trgtliId;
                    let closedLi;
                    let trgtLi;
                    const trgtpopUp = this.getWrapper() && this.getUlByNavIdx();
                    if (this.isCMenu) {
                        if (this.canOpen(e.target)) {
                            this.openMenu(null, null, this.pageY, this.pageX, e);
                        }
                        this.isCMenu = false;
                    }
                    if (this.isMenu && trgtpopUp && popupId.length) {
                        trgtliId = new RegExp('(.*)-ej2menu-' + this.element.id + '-popup').exec(popupId)[1];
                        closedLi = trgtpopUp.querySelector('[id="' + trgtliId + '"]');
                        trgtLi = (liElem && trgtpopUp.querySelector('[id="' + liElem.id + '"]'));
                    }
                    const submenus = liElem && liElem.querySelectorAll('.e-menu-item');
                    if (isOpen && this.hamburgerMode && ulIndex && !(submenus.length)) {
                        this.afterCloseMenu(e);
                    }
                    else if (isOpen && !this.hamburgerMode && this.navIdx.length && closedLi && !trgtLi) {
                        let ele = (e && e.target.classList.contains('e-vscroll'))
                            ? closest(e.target, '.e-menu-wrapper') : null;
                        if (ele) {
                            ele = ele.querySelector('.e-menu-item');
                            if (this.showItemOnClick || (ele && this.getIndex(ele.id, true).length <= this.navIdx.length)) {
                                this.closeMenu(this.navIdx[this.navIdx.length - 1], e, true);
                            }
                        }
                        else {
                            this.closeMenu(this.navIdx[this.navIdx.length - 1], e);
                        }
                    }
                    else if (isOpen && !isIterated && !ulIndex && ((this.hamburgerMode && this.navIdx.length) ||
                        this.navIdx.length === 1)) {
                        this.closeMenu(null, e);
                    }
                    else if (isOpen && isNullOrUndefined(ulIndex) && this.navIdx.length) {
                        this.closeMenu(null, e);
                    }
                    else if (isOpen && !this.isMenu && !ulIndex && this.navIdx.length === 0 && !this.isMenusClosed) {
                        this.isMenusClosed = true;
                        this.closeMenu(0, e);
                    }
                    else if (isOpen && this.isMenu && e && e.target &&
                        this.navIdx.length !== 0 && closest(e.target, '.e-menu-parent.e-control')) {
                        this.closeMenu(0, e);
                    }
                    else {
                        if (isOpen && (this.keyType === 'right' || this.keyType === 'click')) {
                            this.afterCloseMenu(e);
                        }
                        else {
                            const cul = this.getUlByNavIdx();
                            const sli = this.getLIByClass(cul, SELECTED);
                            if (sli) {
                                sli.setAttribute('aria-expanded', 'false');
                                sli.classList.remove(SELECTED);
                                if (observedCloseArgs.isFocused && liElem) {
                                    sli.classList.add(FOCUSED);
                                    sli.focus();
                                }
                            }
                            if (!isOpen && this.hamburgerMode && liElem && liElem.getAttribute('aria-expanded') === 'false' &&
                                liElem.getAttribute('aria-haspopup') === 'true') {
                                if (closest(liElem, '.e-menu-parent.e-control')) {
                                    this.navIdx = [];
                                }
                                else {
                                    this.navIdx.pop();
                                }
                                this.navIdx.push(this.cliIdx);
                                const item = this.getItem(this.navIdx);
                                liElem.setAttribute('aria-expanded', 'true');
                                this.openMenu(liElem, item, -1, -1, e);
                            }
                        }
                        if (this.navIdx.length < 1) {
                            if (this.showSubMenuOn === 'Hover' || this.showSubMenuOn === 'Click') {
                                this.showItemOnClick = this.defaultOption;
                                this.showSubMenuOn = 'Auto';
                            }
                        }
                    }
                    this.removeStateWrapper();
                });
            }
        }
    }
    updateReactTemplate() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (this.isReact && this.template && this.navIdx.length === 0) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const portals = this.portals.splice(0, this.items.length);
            this.clearTemplate(['template']);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            this.portals = portals;
            this.renderReactTemplates();
        }
    }
    getMenuItemModel(item, level) {
        if (isNullOrUndefined(item)) {
            return null;
        }
        if (isNullOrUndefined(level)) {
            level = 0;
        }
        const fields = this.getFields(level);
        return { text: item[fields.text], id: item[fields.id], items: item[fields.child], separator: item[fields.separator],
            iconCss: item[fields.iconCss], url: item[fields.url] };
    }
    getPopups() {
        const popups = [];
        [].slice.call(document.querySelectorAll('.' + POPUP)).forEach((elem) => {
            if (!isNullOrUndefined(elem.querySelector('.' + ITEM)) && this.getIndex(elem.querySelector('.' + ITEM).id, true).length) {
                popups.push(elem);
            }
        });
        return popups;
    }
    isMenuVisible() {
        return (this.navIdx.length > 0 || (this.element.classList.contains('e-contextmenu') && isVisible(this.element).valueOf()));
    }
    canOpen(target) {
        let canOpen = true;
        if (this.filter) {
            canOpen = false;
            const filter = this.filter.split(' ');
            for (let i = 0, len = filter.length; i < len; i++) {
                if (closest(target, '.' + filter[i])) {
                    canOpen = true;
                    break;
                }
            }
        }
        return canOpen;
    }
    openMenu(li, item, top = 0, left = 0, e = null, target = this.targetElement) {
        const wrapper = this.getWrapper();
        this.lItem = li;
        const elemId = this.element.id !== '' ? this.element.id : 'menu';
        this.isMenusClosed = false;
        if (isNullOrUndefined(top)) {
            top = -1;
        }
        if (isNullOrUndefined(left)) {
            left = -1;
        }
        if (li) {
            this.uList = this.createItems(item[this.getField('children', this.navIdx.length - 1)]);
            if (!this.isMenu && Browser.isDevice) {
                wrapper.lastChild.style.display = 'none';
                const data = {
                    text: item[this.getField('text')].toString(), iconCss: ICONS + ' e-previous'
                };
                const hdata = new MenuItem(this.items[0], 'items', data, true);
                const hli = this.createItems([hdata]).children[0];
                hli.classList.add(HEADER);
                this.uList.insertBefore(hli, this.uList.children[0]);
            }
            if (this.isMenu) {
                this.popupWrapper = this.createElement('div', {
                    className: 'e-' + this.getModuleName() + '-wrapper ' + POPUP, id: li.id + '-ej2menu-' + elemId + '-popup'
                });
                if (this.hamburgerMode) {
                    top = li.offsetHeight;
                    li.appendChild(this.popupWrapper);
                }
                else {
                    document.body.appendChild(this.popupWrapper);
                }
                this.isNestedOrVertical = this.element.classList.contains('e-vertical') || this.navIdx.length !== 1;
                this.popupObj = this.generatePopup(this.popupWrapper, this.uList, li, this.isNestedOrVertical);
                if (this.template) {
                    this.renderReactTemplates();
                }
                if (this.hamburgerMode) {
                    this.calculateIndentSize(this.uList, li);
                }
                else {
                    if (this.cssClass) {
                        addClass([this.popupWrapper], this.cssClass.split(' '));
                    }
                    this.popupObj.hide();
                }
                if (!this.hamburgerMode && !this.showItemOnClick && this.hoverDelay) {
                    window.clearInterval(this.timer);
                    this.timer = window.setTimeout(() => { this.triggerBeforeOpen(li, this.uList, item, e, 0, 0, 'menu'); }, this.hoverDelay);
                }
                else {
                    this.triggerBeforeOpen(li, this.uList, item, e, 0, 0, 'menu');
                }
            }
            else {
                this.uList.style.zIndex = this.element.style.zIndex;
                wrapper.appendChild(this.uList);
                if (!this.showItemOnClick && this.hoverDelay) {
                    window.clearInterval(this.timer);
                    this.timer = window.setTimeout(() => { this.triggerBeforeOpen(li, this.uList, item, e, top, left, 'none'); }, this.hoverDelay);
                }
                else {
                    this.triggerBeforeOpen(li, this.uList, item, e, top, left, 'none');
                }
            }
        }
        else {
            this.uList = this.element;
            this.uList.style.zIndex = getZindexPartial(target ? target : this.element).toString();
            this.triggerBeforeOpen(li, this.uList, item, e, top, left, 'none');
        }
        if (this.isMenu && this.template && isBlazor()) {
            const menuTemplateId = this.element.id + TEMPLATE_PROPERTY;
            if (Object.keys(blazorTemplates).length) {
                const itemFromBlazorTemplate = blazorTemplates[menuTemplateId];
                this.tempItem = this.tempItem.concat(itemFromBlazorTemplate);
                blazorTemplates[menuTemplateId] = this.tempItem;
            }
            updateBlazorTemplate(menuTemplateId, TEMPLATE_PROPERTY, this);
        }
    }
    calculateIndentSize(ul, li) {
        const liStyle = getComputedStyle(li);
        let liIndent = parseInt(liStyle.textIndent, 10);
        if (this.navIdx.length < 2 && !li.classList.contains('e-blankicon')) {
            liIndent *= 2;
        }
        else {
            liIndent += (liIndent / 4);
        }
        ul.style.textIndent = liIndent + 'px';
        const blankIconElem = ul.querySelectorAll('.e-blankicon');
        if (blankIconElem && blankIconElem.length) {
            const menuIconElem = ul.querySelector('.e-menu-icon');
            const menuIconElemStyle = getComputedStyle(menuIconElem);
            const blankIconIndent = (parseInt(menuIconElemStyle.marginRight, 10) + menuIconElem.offsetWidth + liIndent);
            for (let i = 0; i < blankIconElem.length; i++) {
                blankIconElem[i].style.textIndent = blankIconIndent + 'px';
            }
        }
    }
    generatePopup(popupWrapper, ul, li, isNestedOrVertical) {
        const popupObj = new Popup(popupWrapper, {
            actionOnScroll: this.hamburgerMode ? 'none' : 'reposition',
            relateTo: li,
            collision: this.hamburgerMode ? { X: 'none', Y: 'none' } : { X: isNestedOrVertical ||
                    this.enableRtl ? 'none' : 'flip', Y: 'fit' },
            position: (isNestedOrVertical && !this.hamburgerMode) ? { X: 'right', Y: 'top' } : { X: 'left', Y: 'bottom' },
            targetType: 'relative',
            enableRtl: this.enableRtl,
            content: ul,
            open: () => {
                const scrollEle = select('.e-menu-vscroll', popupObj.element);
                if (scrollEle) {
                    scrollEle.style.height = 'inherit';
                    scrollEle.style.maxHeight = '';
                }
                const ul = select('.e-ul', popupObj.element);
                popupObj.element.style.maxHeight = '';
                ul.focus();
                this.triggerOpen(ul);
            }
        });
        return popupObj;
    }
    createHeaderContainer(wrapper) {
        wrapper = wrapper || this.getWrapper();
        const spanElem = this.createElement('span', { className: 'e-' + this.getModuleName() + '-header' });
        const tempTitle = (this.enableHtmlSanitizer) ? SanitizeHtmlHelper.sanitize(this.title) : this.title;
        const spanTitle = this.createElement('span', {
            className: 'e-' + this.getModuleName() + '-title', innerHTML: tempTitle
        });
        const spanIcon = this.createElement('span', {
            className: 'e-icons e-' + this.getModuleName() + '-icon', attrs: { 'tabindex': '0' }
        });
        spanElem.appendChild(spanTitle);
        spanElem.appendChild(spanIcon);
        wrapper.insertBefore(spanElem, this.element);
    }
    openHamburgerMenu(e) {
        if (this.hamburgerMode) {
            this.triggerBeforeOpen(null, this.element, null, e, 0, 0, 'hamburger');
        }
    }
    closeHamburgerMenu(e) {
        const beforeCloseArgs = { element: this.element, parentItem: null, event: e,
            items: this.items, cancel: false };
        this.trigger('beforeClose', beforeCloseArgs, (observedHamburgerCloseArgs) => {
            if (!observedHamburgerCloseArgs.cancel) {
                this.closeMenu(null, e);
                this.element.classList.add('e-hide-menu');
                this.trigger('onClose', { element: this.element, parentItem: null, items: this.items });
            }
        });
    }
    callFit(element, x, y, top, left) {
        return fit(element, null, { X: x, Y: y }, { top: top, left: left });
    }
    triggerBeforeOpen(li, ul, item, e, top, left, type) {
        const items = li ? item[this.getField('children', this.navIdx.length - 1)] : this.items;
        const eventArgs = {
            element: ul, items: items, parentItem: this.isMenu && isBlazor() ? this.getMenuItemModel(item, this.navIdx.length - 1) :
                item, event: e, cancel: false, top: top, left: left, showSubMenuOn: 'Auto'
        };
        const menuType = type;
        this.trigger('beforeOpen', eventArgs, (observedOpenArgs) => {
            switch (menuType) {
                case 'menu':
                    if (!this.hamburgerMode) {
                        if (observedOpenArgs.showSubMenuOn !== 'Auto') {
                            this.showItemOnClick = !this.defaultOption;
                            this.showSubMenuOn = observedOpenArgs.showSubMenuOn;
                        }
                        this.top = observedOpenArgs.top;
                        this.left = observedOpenArgs.left;
                    }
                    this.popupWrapper.style.display = 'block';
                    if (!this.hamburgerMode) {
                        this.popupWrapper.style.maxHeight = this.popupWrapper.getBoundingClientRect().height + 'px';
                        if (this.enableScrolling) {
                            addScrolling(this.createElement, this.popupWrapper, this.uList, 'vscroll', this.enableRtl);
                        }
                        this.checkScrollOffset(e);
                    }
                    if (!this.hamburgerMode && !this.left && !this.top) {
                        this.popupObj.refreshPosition(this.lItem, true);
                        this.left = parseInt(this.popupWrapper.style.left, 10);
                        this.top = parseInt(this.popupWrapper.style.top, 10);
                        if (this.enableRtl) {
                            this.left =
                                this.isNestedOrVertical ? this.left - this.popupWrapper.offsetWidth - this.lItem.parentElement.offsetWidth + 2
                                    : this.left - this.popupWrapper.offsetWidth + this.lItem.offsetWidth;
                        }
                        if (this.template && (this.isReact || this.isAngular)) {
                            requestAnimationFrame(() => {
                                this.collision();
                            });
                        }
                        else {
                            this.collision();
                        }
                    }
                    else {
                        this.popupObj.collision = { X: 'none', Y: 'none' };
                    }
                    this.popupWrapper.style.display = '';
                    break;
                case 'none':
                    this.top = observedOpenArgs.top;
                    this.left = observedOpenArgs.left;
                    break;
                case 'hamburger':
                    if (!observedOpenArgs.cancel) {
                        this.element.classList.remove('e-hide-menu');
                        this.triggerOpen(this.element);
                    }
                    break;
            }
            if (menuType !== 'hamburger') {
                if (observedOpenArgs.cancel) {
                    if (this.isMenu) {
                        this.popupObj.destroy();
                        detach(this.popupWrapper);
                    }
                    else if (ul.className.indexOf('e-ul') > -1) {
                        detach(ul);
                    }
                    this.navIdx.pop();
                }
                else {
                    if (this.isMenu) {
                        if (this.hamburgerMode) {
                            this.popupWrapper.style.top = this.top + 'px';
                            this.popupWrapper.style.left = 0 + 'px';
                            this.toggleAnimation(this.popupWrapper);
                        }
                        else {
                            this.setBlankIconStyle(this.popupWrapper);
                            this.wireKeyboardEvent(this.popupWrapper);
                            rippleEffect(this.popupWrapper, { selector: '.' + ITEM });
                            this.popupWrapper.style.left = this.left + 'px';
                            this.popupWrapper.style.top = this.top + 'px';
                            const animationOptions = this.animationSettings.effect !== 'None' ? {
                                name: this.animationSettings.effect, duration: this.animationSettings.duration,
                                timingFunction: this.animationSettings.easing
                            } : null;
                            this.popupObj.show(animationOptions, this.lItem);
                        }
                    }
                    else {
                        this.setBlankIconStyle(this.uList);
                        this.setPosition(this.lItem, this.uList, this.top, this.left);
                        this.toggleAnimation(this.uList);
                    }
                }
            }
            if (this.keyType === 'right') {
                let cul = this.getUlByNavIdx();
                li.classList.remove(FOCUSED);
                if (this.isMenu && this.navIdx.length === 1) {
                    this.removeLIStateByClass([SELECTED], [this.getWrapper()]);
                }
                li.classList.add(SELECTED);
                if (this.action === ENTER) {
                    const eventArgs = { element: li, item: item, event: e };
                    this.trigger('select', eventArgs);
                }
                li.focus();
                cul = this.getUlByNavIdx();
                const index = this.isValidLI(cul.children[0], 0, this.action);
                cul.children[index].classList.add(FOCUSED);
                cul.children[index].focus();
            }
        });
    }
    collision() {
        let collide;
        collide = isCollide(this.popupWrapper, null, this.left, this.top);
        if ((this.isNestedOrVertical || this.enableRtl) && (collide.indexOf('right') > -1
            || collide.indexOf('left') > -1)) {
            this.popupObj.collision.X = 'none';
            const offWidth = closest(this.lItem, '.e-' + this.getModuleName() + '-wrapper').offsetWidth;
            this.left =
                this.enableRtl ? calculatePosition(this.lItem, this.isNestedOrVertical ? 'right' : 'left', 'top').left
                    : this.left - this.popupWrapper.offsetWidth - offWidth + 2;
        }
        collide = isCollide(this.popupWrapper, null, this.left, this.top);
        if (collide.indexOf('left') > -1 || collide.indexOf('right') > -1) {
            this.left = this.callFit(this.popupWrapper, true, false, this.top, this.left).left;
        }
        this.popupWrapper.style.left = this.left + 'px';
    }
    setBlankIconStyle(menu) {
        const blankIconList = [].slice.call(menu.getElementsByClassName('e-blankicon'));
        if (!blankIconList.length) {
            return;
        }
        const iconLi = menu.querySelector('.e-menu-item:not(.e-blankicon):not(.e-separator)');
        const icon = iconLi.querySelector('.e-menu-icon');
        if (!icon) {
            return;
        }
        const cssProp = this.enableRtl ? { padding: 'paddingRight', margin: 'marginLeft' } :
            { padding: 'paddingLeft', margin: 'marginRight' };
        const iconCssProps = getComputedStyle(icon);
        let iconSize = parseInt(iconCssProps.fontSize, 10);
        if (!!parseInt(iconCssProps.width, 10) && parseInt(iconCssProps.width, 10) > iconSize) {
            iconSize = parseInt(iconCssProps.width, 10);
        }
        // eslint:disable
        const size = `${iconSize + parseInt(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        iconCssProps[cssProp.margin], 10) + parseInt(getComputedStyle(iconLi)[cssProp.padding], 10)}px`;
        blankIconList.forEach((li) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            li.style[cssProp.padding] = size;
        });
        // eslint:enable
    }
    checkScrollOffset(e) {
        const wrapper = this.getWrapper();
        if (wrapper.children[0].classList.contains('e-menu-hscroll') && this.navIdx.length === 1) {
            const trgt = isNullOrUndefined(e) ? this.element : closest(e.target, '.' + ITEM);
            const offsetEle = select('.e-hscroll-bar', wrapper);
            if (offsetEle.scrollLeft > trgt.offsetLeft) {
                offsetEle.scrollLeft -= (offsetEle.scrollLeft - trgt.offsetLeft);
            }
            const offsetLeft = offsetEle.scrollLeft + offsetEle.offsetWidth;
            const offsetRight = trgt.offsetLeft + trgt.offsetWidth;
            if (offsetLeft < offsetRight) {
                offsetEle.scrollLeft += (offsetRight - offsetLeft);
            }
        }
    }
    setPosition(li, ul, top, left) {
        const px = 'px';
        this.toggleVisiblity(ul);
        if (ul === this.element || (left > -1 && top > -1)) {
            let collide = isCollide(ul, null, left, top);
            if (collide.indexOf('right') > -1) {
                left = left - ul.offsetWidth;
            }
            if (collide.indexOf('bottom') > -1) {
                const offset = this.callFit(ul, false, true, top, left);
                top = offset.top - 20;
                if (top < 0) {
                    const newTop = (pageYOffset + document.documentElement.clientHeight) - ul.getBoundingClientRect().height;
                    if (newTop > -1) {
                        top = newTop;
                    }
                }
            }
            collide = isCollide(ul, null, left, top);
            if (collide.indexOf('left') > -1) {
                const offset = this.callFit(ul, true, false, top, left);
                left = offset.left;
            }
        }
        else {
            if (Browser.isDevice) {
                top = Number(this.element.style.top.replace(px, ''));
                left = Number(this.element.style.left.replace(px, ''));
            }
            else {
                const x = this.enableRtl ? 'left' : 'right';
                let offset = calculatePosition(li, x, 'top');
                top = offset.top;
                left = offset.left;
                const collide = isCollide(ul, null, this.enableRtl ? left - ul.offsetWidth : left, top);
                const xCollision = collide.indexOf('left') > -1 || collide.indexOf('right') > -1;
                if (xCollision) {
                    offset = calculatePosition(li, this.enableRtl ? 'right' : 'left', 'top');
                    left = offset.left;
                }
                if (this.enableRtl || xCollision) {
                    left = (this.enableRtl && xCollision) ? left : left - ul.offsetWidth;
                }
                if (collide.indexOf('bottom') > -1) {
                    offset = this.callFit(ul, false, true, top, left);
                    top = offset.top;
                }
            }
        }
        this.toggleVisiblity(ul, false);
        ul.style.top = top + px;
        ul.style.left = left + px;
    }
    toggleVisiblity(ul, isVisible$$1 = true) {
        ul.style.visibility = isVisible$$1 ? 'hidden' : '';
        ul.style.display = isVisible$$1 ? 'block' : 'none';
    }
    createItems(items) {
        const level = this.navIdx ? this.navIdx.length : 0;
        const fields = this.getFields(level);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (isBlazor() && this.template && items.length && items[0].properties) {
            const itemsObj = [];
            items.forEach((item, index) => {
                itemsObj.push({});
                itemsObj[index][fields.text] = item[fields.text];
                if (!item[fields.id]) {
                    item[fields.id] = getUniqueID('menuitem');
                }
                itemsObj[index][fields.id] = item[fields.id];
                itemsObj[index][fields.iconCss] = item[fields.iconCss];
                itemsObj[index][fields.url] = item[fields.url];
                itemsObj[index][fields.child] = item[fields.child];
                itemsObj[index][fields.separator] = item[fields.separator];
            });
            items = itemsObj;
        }
        const showIcon = this.hasField(items, this.getField('iconCss', level));
        const listBaseOptions = {
            showIcon: showIcon,
            moduleName: 'menu',
            fields: fields,
            template: this.template,
            itemNavigable: true,
            itemCreating: (args) => {
                if (!args.curData[args.fields[fields.id]]) {
                    args.curData[args.fields[fields.id]] = getUniqueID('menuitem');
                }
                args.curData.htmlAttributes = {
                    role: 'menuitem',
                    tabindex: '-1'
                };
                if (this.isMenu && !args.curData[this.getField('separator', level)]) {
                    args.curData.htmlAttributes['aria-label'] = args.curData[args.fields.text];
                }
                if (args.curData[args.fields[fields.iconCss]] === '') {
                    args.curData[args.fields[fields.iconCss]] = null;
                }
            },
            itemCreated: (args) => {
                if (args.curData[this.getField('separator', level)]) {
                    args.item.classList.add(SEPARATOR);
                    args.item.removeAttribute('role');
                }
                if (showIcon && !args.curData[args.fields.iconCss]
                    && !args.curData[this.getField('separator', level)]) {
                    args.item.classList.add('e-blankicon');
                }
                if (args.curData[args.fields.child]
                    && args.curData[args.fields.child].length) {
                    const span = this.createElement('span', { className: ICONS + ' ' + CARET });
                    args.item.appendChild(span);
                    args.item.setAttribute('aria-haspopup', 'true');
                    args.item.setAttribute('aria-expanded', 'false');
                    if (!this.isMenu) {
                        args.item.removeAttribute('role');
                    }
                    args.item.classList.add('e-menu-caret-icon');
                }
                if (this.isMenu && this.template) {
                    args.item.setAttribute('id', args.curData[args.fields.id].toString());
                    args.item.removeAttribute('data-uid');
                    if (args.item.classList.contains('e-level-1')) {
                        args.item.classList.remove('e-level-1');
                    }
                    if (args.item.classList.contains('e-has-child')) {
                        args.item.classList.remove('e-has-child');
                    }
                }
                const eventArgs = { item: args.curData, element: args.item };
                this.trigger('beforeItemRender', eventArgs);
            }
        };
        this.setProperties({ 'items': this.items }, true);
        if (this.isMenu) {
            listBaseOptions.templateID = this.element.id + TEMPLATE_PROPERTY;
        }
        const ul = ListBase.createList(this.createElement, items, listBaseOptions, !this.template, this);
        ul.setAttribute('tabindex', '0');
        if (this.isMenu) {
            ul.setAttribute('role', 'menu');
        }
        return ul;
    }
    moverHandler(e) {
        const trgt = e.target;
        this.liTrgt = trgt;
        const cli = this.getLI(trgt);
        const wrapper = cli ? closest(cli, '.e-' + this.getModuleName() + '-wrapper') : this.getWrapper();
        const hdrWrapper = this.getWrapper();
        const regex = new RegExp('-ej2menu-(.*)-popup');
        let ulId;
        let isDifferentElem = false;
        if (!wrapper) {
            return;
        }
        if (wrapper.id !== '') {
            ulId = regex.exec(wrapper.id)[1];
        }
        else {
            ulId = wrapper.querySelector('ul').id;
        }
        if (ulId !== this.element.id) {
            this.removeLIStateByClass([FOCUSED, SELECTED], [this.getWrapper()]);
            if (this.navIdx.length) {
                isDifferentElem = true;
            }
            else {
                return;
            }
        }
        if (cli && closest(cli, '.e-' + this.getModuleName() + '-wrapper') && !isDifferentElem) {
            this.removeLIStateByClass([FOCUSED], this.isMenu ? [wrapper].concat(this.getPopups()) : [wrapper]);
            this.removeLIStateByClass([FOCUSED], this.isMenu ? [hdrWrapper].concat(this.getPopups()) : [hdrWrapper]);
            cli.classList.add(FOCUSED);
            if (!this.showItemOnClick) {
                this.clickHandler(e);
            }
        }
        else if (this.isMenu && this.showItemOnClick && !isDifferentElem) {
            this.removeLIStateByClass([FOCUSED], [wrapper].concat(this.getPopups()));
        }
        if (this.isMenu) {
            if (!this.showItemOnClick && (trgt.parentElement !== wrapper && !closest(trgt, '.e-' + this.getModuleName() + '-popup'))
                && (!cli || (cli && !this.getIndex(cli.id, true).length)) && this.showSubMenuOn !== 'Hover') {
                this.removeLIStateByClass([FOCUSED], [wrapper]);
                if (this.navIdx.length) {
                    this.isClosed = true;
                    this.closeMenu(null, e);
                }
            }
            else if (isDifferentElem && !this.showItemOnClick) {
                if (this.navIdx.length) {
                    this.isClosed = true;
                    this.closeMenu(null, e);
                }
            }
            if (!this.isClosed) {
                this.removeStateWrapper();
            }
            this.isClosed = false;
        }
    }
    removeStateWrapper() {
        if (this.liTrgt) {
            const wrapper = closest(this.liTrgt, '.e-menu-vscroll');
            if (this.liTrgt.tagName === 'DIV' && wrapper) {
                this.removeLIStateByClass([FOCUSED, SELECTED], [wrapper]);
            }
        }
    }
    removeLIStateByClass(classList$$1, element) {
        let li;
        for (let i = 0; i < element.length; i++) {
            classList$$1.forEach((className) => {
                li = select('.' + className, element[i]);
                if (li) {
                    li.classList.remove(className);
                }
            });
        }
    }
    getField(propName, level = 0) {
        const fieldName = this.fields[propName];
        return typeof fieldName === 'string' ? fieldName :
            (!fieldName[level] ? fieldName[fieldName.length - 1].toString()
                : fieldName[level].toString());
    }
    getFields(level = 0) {
        return {
            id: this.getField('itemId', level),
            iconCss: this.getField('iconCss', level),
            text: this.getField('text', level),
            url: this.getField('url', level),
            child: this.getField('children', level),
            separator: this.getField('separator', level)
        };
    }
    hasField(items, field) {
        for (let i = 0, len = items.length; i < len; i++) {
            if (items[i][field]) {
                return true;
            }
        }
        return false;
    }
    menuHeaderClickHandler(e) {
        if (closest(e.target, '.e-menu-wrapper').querySelector('ul.e-menu-parent').id !== this.element.id) {
            return;
        }
        if (this.element.classList.contains('e-hide-menu')) {
            this.openHamburgerMenu(e);
        }
        else {
            this.closeHamburgerMenu(e);
        }
    }
    clickHandler(e) {
        if (this.isTapHold) {
            this.isTapHold = false;
        }
        else {
            const wrapper = this.getWrapper();
            const trgt = e.target;
            const cli = this.cli = this.getLI(trgt);
            const regex = new RegExp('-ej2menu-(.*)-popup');
            const cliWrapper = cli ? closest(cli, '.e-' + this.getModuleName() + '-wrapper') : null;
            const isInstLI = cli && cliWrapper && (this.isMenu ? this.getIndex(cli.id, true).length > 0
                : wrapper.firstElementChild.id === cliWrapper.firstElementChild.id);
            if (Browser.isDevice && this.isMenu) {
                this.removeLIStateByClass([FOCUSED], [wrapper].concat(this.getPopups()));
                this.mouseDownHandler(e);
            }
            if (cli && cliWrapper && this.isMenu) {
                const cliWrapperId = cliWrapper.id ? regex.exec(cliWrapper.id)[1] : cliWrapper.querySelector('.e-menu-parent').id;
                if (this.element.id !== cliWrapperId) {
                    return;
                }
            }
            if (isInstLI && e.type === 'click' && !cli.classList.contains(HEADER)) {
                this.setLISelected(cli);
                const navIdx = this.getIndex(cli.id, true);
                const item = this.getItem(navIdx);
                const eventArgs = { element: cli, item: item, event: e };
                this.trigger('select', eventArgs);
            }
            if (isInstLI && (e.type === 'mouseover' || Browser.isDevice || this.showItemOnClick)) {
                let ul;
                if (cli.classList.contains(HEADER)) {
                    ul = wrapper.children[this.navIdx.length - 1];
                    this.toggleAnimation(ul);
                    const sli = this.getLIByClass(ul, SELECTED);
                    if (sli) {
                        sli.classList.remove(SELECTED);
                    }
                    detach(cli.parentNode);
                    this.navIdx.pop();
                }
                else {
                    if (!cli.classList.contains(SEPARATOR)) {
                        this.showSubMenu = true;
                        const cul = cli.parentNode;
                        this.cliIdx = this.getIdx(cul, cli);
                        if (this.isMenu || !Browser.isDevice) {
                            const culIdx = this.isMenu ? Array.prototype.indexOf.call([wrapper].concat(this.getPopups()), closest(cul, '.' + 'e-' + this.getModuleName() + '-wrapper'))
                                : this.getIdx(wrapper, cul);
                            if (this.navIdx[culIdx] === this.cliIdx) {
                                this.showSubMenu = false;
                            }
                            if (culIdx !== this.navIdx.length && (e.type !== 'mouseover' || this.showSubMenu)) {
                                const sli = this.getLIByClass(cul, SELECTED);
                                if (sli) {
                                    sli.classList.remove(SELECTED);
                                }
                                this.isClosed = true;
                                this.keyType = 'click';
                                if (this.showItemOnClick) {
                                    this.setLISelected(cli);
                                }
                                this.closeMenu(culIdx + 1, e);
                                if (this.showItemOnClick) {
                                    this.setLISelected(cli);
                                }
                            }
                        }
                        if (!this.isClosed) {
                            this.afterCloseMenu(e);
                        }
                        this.isClosed = false;
                    }
                }
            }
            else {
                if (this.isMenu && trgt.tagName === 'DIV' && this.navIdx.length && closest(trgt, '.e-menu-vscroll')) {
                    const popupEle = closest(trgt, '.' + POPUP);
                    const cIdx = Array.prototype.indexOf.call(this.getPopups(), popupEle) + 1;
                    if (cIdx < this.navIdx.length) {
                        this.closeMenu(cIdx + 1, e);
                        if (popupEle) {
                            this.removeLIStateByClass([FOCUSED, SELECTED], [popupEle]);
                        }
                    }
                }
                else if (this.isMenu && this.hamburgerMode && trgt.tagName === 'SPAN'
                    && trgt.classList.contains('e-menu-icon')) {
                    this.menuHeaderClickHandler(e);
                }
                else {
                    if (trgt.tagName !== 'UL' || (this.isMenu ? trgt.parentElement.classList.contains('e-menu-wrapper') &&
                        !this.getIndex(trgt.querySelector('.' + ITEM).id, true).length : trgt.parentElement !== wrapper)) {
                        if (!cli) {
                            this.removeLIStateByClass([SELECTED], [wrapper]);
                        }
                        if (!cli || !cli.querySelector('.' + CARET)) {
                            this.closeMenu(null, e);
                        }
                    }
                }
            }
        }
    }
    afterCloseMenu(e) {
        let isHeader;
        if (this.showSubMenu) {
            if (this.showItemOnClick && this.navIdx.length === 0) {
                isHeader = closest(e.target, '.e-menu-parent.e-control');
            }
            else {
                isHeader = closest(this.element, '.e-menu-parent.e-control');
            }
            const idx = this.navIdx.concat(this.cliIdx);
            const item = this.getItem(idx);
            if (item && item[this.getField('children', idx.length - 1)] &&
                item[this.getField('children', idx.length - 1)].length) {
                if (e.type === 'mouseover' || (Browser.isDevice && this.isMenu)) {
                    this.setLISelected(this.cli);
                }
                if ((!this.hamburgerMode && isHeader) || (this.hamburgerMode && this.cli.getAttribute('aria-expanded') === 'false')) {
                    this.cli.setAttribute('aria-expanded', 'true');
                    this.navIdx.push(this.cliIdx);
                    this.openMenu(this.cli, item, null, null, e);
                }
            }
            else {
                if (e.type !== 'mouseover') {
                    this.closeMenu(null, e);
                }
            }
            if (!isHeader) {
                const cul = this.getUlByNavIdx();
                const sli = this.getLIByClass(cul, SELECTED);
                if (sli) {
                    sli.setAttribute('aria-expanded', 'false');
                    sli.classList.remove(SELECTED);
                }
            }
        }
        this.keyType = '';
    }
    setLISelected(li) {
        const sli = this.getLIByClass(li.parentElement, SELECTED);
        if (sli) {
            sli.classList.remove(SELECTED);
        }
        if (!this.isMenu) {
            li.classList.remove(FOCUSED);
        }
        li.classList.add(SELECTED);
    }
    getLIByClass(ul, classname) {
        for (let i = 0, len = ul.children.length; i < len; i++) {
            if (ul.children[i].classList.contains(classname)) {
                return ul.children[i];
            }
        }
        return null;
    }
    /**
     * This method is used to get the index of the menu item in the Menu based on the argument.
     *
     * @param {MenuItem | string} item - item be passed to get the index | id to be passed to get the item index.
     * @param {boolean} isUniqueId - Set `true` if it is a unique id.
     * @returns {void}
     */
    getItemIndex(item, isUniqueId) {
        let idx;
        if (typeof item === 'string') {
            idx = item;
        }
        else {
            idx = item.id;
        }
        const isText = (isUniqueId === false) ? false : true;
        const navIdx = this.getIndex(idx, isText);
        return navIdx;
    }
    /**
     * This method is used to set the menu item in the Menu based on the argument.
     *
     * @param {MenuItem} item - item need to be updated.
     * @param {string} id - id to be passed to update the item.
     * @param {boolean} isUniqueId - Set `true` if it is a unique id.
     * @returns {void}
     */
    setItem(item, id, isUniqueId) {
        const idx = id ? id : item.id;
        const isText = (isUniqueId === false) ? false : true;
        const navIdx = this.getIndex(idx, isText);
        const newItem = this.getItem(navIdx);
        newItem.iconCss = item.iconCss;
        newItem.id = item.id;
        newItem.text = item.text;
        newItem.url = item.url;
        newItem.separator = item.separator;
        newItem.items = item.items;
    }
    getItem(navIdx) {
        navIdx = navIdx.slice();
        const idx = navIdx.pop();
        const items = this.getItems(navIdx);
        return items[idx];
    }
    getItems(navIdx) {
        let items = this.items;
        for (let i = 0; i < navIdx.length; i++) {
            items = items[navIdx[i]][this.getField('children', i)];
        }
        return items;
    }
    setItems(newItems, navIdx) {
        const items = this.getItems(navIdx);
        items.splice(0, items.length);
        for (let i = 0; i < newItems.length; i++) {
            items.splice(i, 0, newItems[i]);
        }
    }
    getIdx(ul, li, skipHdr = true) {
        let idx = Array.prototype.indexOf.call(ul.querySelectorAll('li'), li);
        if (this.isMenu && this.template && isBlazor()) {
            idx = Array.prototype.indexOf.call(ul.querySelectorAll(li.tagName), li);
        }
        else {
            idx = Array.prototype.indexOf.call(ul.children, li);
        }
        if (skipHdr && ul.children[0].classList.contains(HEADER)) {
            idx--;
        }
        return idx;
    }
    getLI(elem) {
        if (elem.tagName === 'LI' && elem.classList.contains('e-menu-item')) {
            return elem;
        }
        return closest(elem, 'li.e-menu-item');
    }
    updateItemsByNavIdx() {
        let items = this.items;
        let count = 0;
        for (let index = 0; index < this.navIdx.length; index++) {
            items = items[index].items;
            if (!items) {
                break;
            }
            count++;
            const ul = this.getUlByNavIdx(count);
            if (!ul) {
                break;
            }
            this.updateItem(ul, items);
        }
    }
    removeChildElement(elem) {
        while (elem.firstElementChild) {
            elem.removeChild(elem.firstElementChild);
        }
        return elem;
    }
    /**
     * Called internally if any of the property value changed.
     *
     * @private
     * @param {MenuBaseModel} newProp - Specifies the new properties
     * @param {MenuBaseModel} oldProp - Specifies the old properties
     * @returns {void}
     */
    onPropertyChanged(newProp, oldProp) {
        const wrapper = this.getWrapper();
        for (const prop of Object.keys(newProp)) {
            switch (prop) {
                case 'cssClass':
                    if (oldProp.cssClass) {
                        removeClass([wrapper], oldProp.cssClass.split(' '));
                    }
                    if (newProp.cssClass) {
                        addClass([wrapper], newProp.cssClass.split(' '));
                    }
                    break;
                case 'enableRtl':
                    wrapper.classList.toggle(RTL);
                    break;
                case 'showItemOnClick':
                    this.unWireEvents();
                    this.showItemOnClick = newProp.showItemOnClick;
                    this.wireEvents();
                    break;
                case 'enableScrolling':
                    if (newProp.enableScrolling) {
                        let ul;
                        if (this.element.classList.contains('e-vertical')) {
                            addScrolling(this.createElement, wrapper, this.element, 'vscroll', this.enableRtl);
                        }
                        else {
                            addScrolling(this.createElement, wrapper, this.element, 'hscroll', this.enableRtl);
                        }
                        this.getPopups().forEach((wrapper) => {
                            ul = select('.e-ul', wrapper);
                            addScrolling(this.createElement, wrapper, ul, 'vscroll', this.enableRtl);
                        });
                    }
                    else {
                        let ul = wrapper.children[0];
                        if (this.element.classList.contains('e-vertical')) {
                            destroyScroll(getInstance(ul, VScroll), ul);
                        }
                        else {
                            destroyScroll(getInstance(ul, HScroll), ul);
                        }
                        wrapper.style.overflow = '';
                        wrapper.appendChild(this.element);
                        this.getPopups().forEach((wrapper) => {
                            ul = wrapper.children[0];
                            destroyScroll(getInstance(ul, VScroll), ul);
                            wrapper.style.overflow = '';
                        });
                    }
                    break;
                case 'items': {
                    let idx;
                    let navIdx;
                    let item;
                    if (!Object.keys(oldProp.items).length) {
                        this.updateItem(this.element, this.items);
                        if (!this.hamburgerMode) {
                            for (let i = 1, count = wrapper.childElementCount; i < count; i++) {
                                detach(wrapper.lastElementChild);
                            }
                        }
                        if (this.isMenu && isBlazor()) {
                            this.updateItemsByNavIdx();
                        }
                        else {
                            this.navIdx = [];
                        }
                    }
                    else {
                        const keys = Object.keys(newProp.items);
                        for (let i = 0; i < keys.length; i++) {
                            navIdx = this.getChangedItemIndex(newProp, [], Number(keys[i]));
                            if (navIdx.length <= this.getWrapper().children.length) {
                                idx = navIdx.pop();
                                item = this.getItems(navIdx);
                                this.insertAfter([item[idx]], item[idx].text);
                                this.removeItem(item, navIdx, idx);
                                this.setItems(item, navIdx);
                            }
                            navIdx.length = 0;
                        }
                    }
                    break;
                }
            }
        }
    }
    updateItem(ul, items) {
        if (isBlazor()) {
            ul = this.removeChildElement(ul);
        }
        else {
            ul.innerHTML = '';
        }
        const lis = [].slice.call(this.createItems(items).children);
        lis.forEach((li) => {
            ul.appendChild(li);
        });
    }
    getChangedItemIndex(newProp, index, idx) {
        index.push(idx);
        const key = Object.keys(newProp.items[idx]).pop();
        if (key === 'items') {
            const item = newProp.items[idx];
            const popStr = Object.keys(item.items).pop();
            if (popStr) {
                this.getChangedItemIndex(item, index, Number(popStr));
            }
        }
        else {
            if (key === 'isParentArray' && index.length > 1) {
                index.pop();
            }
        }
        return index;
    }
    removeItem(item, navIdx, idx) {
        item.splice(idx, 1);
        const uls = this.getWrapper().children;
        if (navIdx.length < uls.length) {
            detach(uls[navIdx.length].children[idx]);
        }
    }
    /**
     * Used to unwire the bind events.
     *
     * @private
     * @param {string} targetSelctor - Specifies the target selector
     * @returns {void}
     */
    unWireEvents(targetSelctor = this.target) {
        const wrapper = this.getWrapper();
        if (targetSelctor) {
            let target;
            let touchModule;
            const targetElems = selectAll(targetSelctor);
            for (let i = 0, len = targetElems.length; i < len; i++) {
                target = targetElems[i];
                if (this.isMenu) {
                    EventHandler.remove(target, 'click', this.menuHeaderClickHandler);
                }
                else {
                    if (Browser.isIos) {
                        touchModule = getInstance(target, Touch);
                        if (touchModule) {
                            touchModule.destroy();
                        }
                    }
                    else {
                        EventHandler.remove(target, 'contextmenu', this.cmenuHandler);
                    }
                }
            }
            if (!this.isMenu) {
                EventHandler.remove(this.targetElement, 'scroll', this.scrollHandler);
                for (const parent of getScrollableParent(this.targetElement)) {
                    EventHandler.remove(parent, 'scroll', this.scrollHandler);
                }
            }
        }
        if (!Browser.isDevice) {
            EventHandler.remove(this.isMenu ? document : wrapper, 'mouseover', this.delegateMoverHandler);
            EventHandler.remove(document, 'mousedown', this.delegateMouseDownHandler);
        }
        EventHandler.remove(document, 'click', this.delegateClickHandler);
        this.unWireKeyboardEvent(wrapper);
        this.rippleFn();
    }
    unWireKeyboardEvent(element) {
        const keyboardModule = getInstance(element, KeyboardEvents);
        if (keyboardModule) {
            keyboardModule.destroy();
        }
    }
    toggleAnimation(ul, isMenuOpen = true) {
        let pUlHeight;
        let pElement;
        if (this.animationSettings.effect === 'None' || !isMenuOpen) {
            this.end(ul, isMenuOpen);
        }
        else {
            this.animation.animate(ul, {
                name: this.animationSettings.effect,
                duration: this.animationSettings.duration,
                timingFunction: this.animationSettings.easing,
                begin: (options) => {
                    if (this.hamburgerMode) {
                        pElement = options.element.parentElement;
                        options.element.style.position = 'absolute';
                        pUlHeight = pElement.offsetHeight;
                        options.element.style.maxHeight = options.element.offsetHeight + 'px';
                        pElement.style.maxHeight = '';
                    }
                    else {
                        options.element.style.display = 'block';
                        options.element.style.maxHeight = options.element.getBoundingClientRect().height + 'px';
                    }
                },
                progress: (options) => {
                    if (this.hamburgerMode) {
                        pElement.style.minHeight = (pUlHeight + options.element.offsetHeight) + 'px';
                    }
                },
                end: (options) => {
                    if (this.hamburgerMode) {
                        options.element.style.position = '';
                        options.element.style.maxHeight = '';
                        pElement.style.minHeight = '';
                        options.element.style.top = 0 + 'px';
                        options.element.children[0].focus();
                        this.triggerOpen(options.element.children[0]);
                    }
                    else {
                        this.end(options.element, isMenuOpen);
                    }
                }
            });
        }
    }
    triggerOpen(ul) {
        const item = this.navIdx.length ? this.getItem(this.navIdx) : null;
        const eventArgs = {
            element: ul, parentItem: item, items: item ? item.items : this.items
        };
        this.trigger('onOpen', eventArgs);
    }
    end(ul, isMenuOpen) {
        if (isMenuOpen) {
            ul.style.display = 'block';
            ul.style.maxHeight = '';
            this.triggerOpen(ul);
            if (ul.querySelector('.' + FOCUSED)) {
                ul.querySelector('.' + FOCUSED).focus();
            }
            else {
                const ele = this.getWrapper().children[this.getIdx(this.getWrapper(), ul) - 1];
                if (ele) {
                    ele.querySelector('.' + SELECTED).focus();
                }
                else {
                    this.element.focus();
                }
            }
        }
        else {
            if (ul === this.element) {
                const fli = this.getLIByClass(this.element, FOCUSED);
                if (fli) {
                    fli.classList.remove(FOCUSED);
                }
                const sli = this.getLIByClass(this.element, SELECTED);
                if (sli) {
                    sli.classList.remove(SELECTED);
                }
                ul.style.display = 'none';
            }
            else {
                detach(ul);
            }
        }
    }
    /**
     * Get the properties to be maintained in the persisted state.
     *
     * @returns {string} - Persist data
     */
    getPersistData() {
        return '';
    }
    /**
     * Get wrapper element.
     *
     * @returns {Element} - Wrapper element
     * @private
     */
    getWrapper() {
        return closest(this.element, '.e-' + this.getModuleName() + '-wrapper');
    }
    getIndex(data, isUniqueId, items = this.items, nIndex = [], isCallBack = false, level = 0) {
        let item;
        level = isCallBack ? level + 1 : 0;
        for (let i = 0, len = items.length; i < len; i++) {
            item = items[i];
            if ((isUniqueId ? item[this.getField('itemId', level)] : item[this.getField('text', level)]) === data) {
                nIndex.push(i);
                break;
            }
            else if (item[this.getField('children', level)]
                && item[this.getField('children', level)].length) {
                nIndex = this.getIndex(data, isUniqueId, item[this.getField('children', level)], nIndex, true, level);
                if (nIndex[nIndex.length - 1] === -1) {
                    if (i !== len - 1) {
                        nIndex.pop();
                    }
                }
                else {
                    nIndex.unshift(i);
                    break;
                }
            }
            else {
                if (i === len - 1) {
                    nIndex.push(-1);
                }
            }
        }
        return (!isCallBack && nIndex[0] === -1) ? [] : nIndex;
    }
    /**
     * This method is used to enable or disable the menu items in the Menu based on the items and enable argument.
     *
     * @param {string[]} items - Text items that needs to be enabled/disabled.
     * @param {boolean} enable - Set `true`/`false` to enable/disable the list items.
     * @param {boolean} isUniqueId - Set `true` if it is a unique id.
     * @returns {void}
     */
    enableItems(items, enable = true, isUniqueId) {
        let ul;
        let idx;
        let navIdx;
        const disabled = DISABLED;
        let skipItem;
        for (let i = 0; i < items.length; i++) {
            navIdx = this.getIndex(items[i], isUniqueId);
            if (this.navIdx.length) {
                if (navIdx.length !== 1) {
                    skipItem = false;
                    for (let i = 0, len = navIdx.length - 1; i < len; i++) {
                        if (navIdx[i] !== this.navIdx[i]) {
                            skipItem = true;
                            break;
                        }
                    }
                    if (skipItem) {
                        continue;
                    }
                }
            }
            else {
                if (navIdx.length !== 1) {
                    continue;
                }
            }
            idx = navIdx.pop();
            ul = this.getUlByNavIdx(navIdx.length);
            if (ul) {
                if (enable) {
                    if (this.isMenu) {
                        ul.children[idx].classList.remove(disabled);
                        ul.children[idx].removeAttribute('aria-disabled');
                    }
                    else {
                        if (Browser.isDevice && !ul.classList.contains('e-contextmenu')) {
                            ul.children[idx + 1].classList.remove(disabled);
                        }
                        else {
                            ul.children[idx].classList.remove(disabled);
                        }
                    }
                }
                else {
                    if (this.isMenu) {
                        ul.children[idx].classList.add(disabled);
                        ul.children[idx].setAttribute('aria-disabled', 'true');
                    }
                    else {
                        if (Browser.isDevice && !ul.classList.contains('e-contextmenu')) {
                            ul.children[idx + 1].classList.add(disabled);
                        }
                        else {
                            ul.children[idx].classList.add(disabled);
                        }
                    }
                }
            }
        }
    }
    /**
     * This method is used to show the menu items in the Menu based on the items text.
     *
     * @param {string[]} items - Text items that needs to be shown.
     * @param {boolean} isUniqueId - Set `true` if it is a unique id.
     * @returns {void}
     */
    showItems(items, isUniqueId) {
        this.showHideItems(items, false, isUniqueId);
    }
    /**
     * This method is used to hide the menu items in the Menu based on the items text.
     *
     * @param {string[]} items - Text items that needs to be hidden.
     * @param {boolean} isUniqueId - Set `true` if it is a unique id.
     * @returns {void}
     */
    hideItems(items, isUniqueId) {
        this.showHideItems(items, true, isUniqueId);
    }
    showHideItems(items, ishide, isUniqueId) {
        let ul;
        let index;
        let navIdx;
        for (let i = 0; i < items.length; i++) {
            navIdx = this.getIndex(items[i], isUniqueId);
            index = navIdx.pop();
            ul = this.getUlByNavIdx(navIdx.length);
            if (ul) {
                if (ishide) {
                    if (Browser.isDevice && !ul.classList.contains('e-contextmenu')) {
                        ul.children[index + 1].classList.add(HIDE);
                    }
                    else {
                        ul.children[index].classList.add(HIDE);
                    }
                }
                else {
                    if (Browser.isDevice && !ul.classList.contains('e-contextmenu')) {
                        ul.children[index + 1].classList.remove(HIDE);
                    }
                    else {
                        ul.children[index].classList.remove(HIDE);
                    }
                }
            }
        }
    }
    /**
     * It is used to remove the menu items from the Menu based on the items text.
     *
     * @param {string[]} items Text items that needs to be removed.
     * @param {boolean} isUniqueId - Set `true` if it is a unique id.
     * @returns {void}
     */
    removeItems(items, isUniqueId) {
        let idx;
        let navIdx;
        let iitems;
        for (let i = 0; i < items.length; i++) {
            navIdx = this.getIndex(items[i], isUniqueId);
            idx = navIdx.pop();
            iitems = this.getItems(navIdx);
            this.removeItem(iitems, navIdx, idx);
        }
    }
    /**
     * It is used to insert the menu items after the specified menu item text.
     *
     * @param {MenuItemModel[]} items - Items that needs to be inserted.
     * @param {string} text - Text item after that the element to be inserted.
     * @param {boolean} isUniqueId - Set `true` if it is a unique id.
     * @returns {void}
     */
    insertAfter(items, text, isUniqueId) {
        this.insertItems(items, text, isUniqueId);
    }
    /**
     * It is used to insert the menu items before the specified menu item text.
     *
     * @param {MenuItemModel[]} items - Items that needs to be inserted.
     * @param {string} text - Text item before that the element to be inserted.
     * @param  {boolean} isUniqueId - Set `true` if it is a unique id.
     * @returns {void}
     */
    insertBefore(items, text, isUniqueId) {
        this.insertItems(items, text, isUniqueId, false);
    }
    insertItems(items, text, isUniqueId, isAfter = true) {
        let li;
        let idx;
        let navIdx;
        let iitems;
        let menuitem;
        for (let i = 0; i < items.length; i++) {
            navIdx = this.getIndex(text, isUniqueId);
            idx = navIdx.pop();
            iitems = this.getItems(navIdx);
            menuitem = new MenuItem(iitems[0], 'items', items[i], true);
            iitems.splice(isAfter ? idx + 1 : idx, 0, menuitem);
            const uls = this.isMenu ? [this.getWrapper()].concat(this.getPopups()) : [].slice.call(this.getWrapper().children);
            if (navIdx.length < uls.length) {
                idx = isAfter ? idx + 1 : idx;
                li = this.createItems(iitems).children[idx];
                const ul = this.isMenu ? select('.e-menu-parent', uls[navIdx.length]) : uls[navIdx.length];
                ul.insertBefore(li, ul.children[idx]);
            }
        }
    }
    removeAttributes() {
        ['top', 'left', 'display', 'z-index'].forEach((key) => {
            this.element.style.removeProperty(key);
        });
        ['role', 'tabindex', 'class', 'style'].forEach((key) => {
            if (key === 'class' && this.element.classList.contains('e-menu-parent')) {
                this.element.classList.remove('e-menu-parent');
            }
            if (['class', 'style'].indexOf(key) === -1 || !this.element.getAttribute(key)) {
                this.element.removeAttribute(key);
            }
            if (this.isMenu && key === 'class' && this.element.classList.contains('e-vertical')) {
                this.element.classList.remove('e-vertical');
            }
        });
    }
    /**
     * Destroys the widget.
     *
     * @returns {void}
     */
    destroy() {
        const wrapper = this.getWrapper();
        if (wrapper) {
            this.unWireEvents();
            if (!this.isMenu) {
                this.clonedElement.style.display = '';
                if (this.clonedElement.tagName === 'EJS-CONTEXTMENU') {
                    addClass([this.clonedElement], ['e-control', 'e-lib', 'e-' + this.getModuleName()]);
                    this.element = this.clonedElement;
                }
                else {
                    if (this.refreshing && this.clonedElement.childElementCount && this.clonedElement.children[0].tagName === 'LI') {
                        this.setProperties({ 'items': [] }, true);
                    }
                    if (document.getElementById(this.clonedElement.id)) {
                        const refEle = this.clonedElement.nextElementSibling;
                        if (refEle && refEle !== wrapper) {
                            this.clonedElement.parentElement.insertBefore(this.element, refEle);
                        }
                        else {
                            this.clonedElement.parentElement.appendChild(this.element);
                        }
                        if (isBlazor()) {
                            this.element = this.removeChildElement(this.element);
                        }
                        else {
                            this.element.innerHTML = '';
                        }
                        append([].slice.call(this.clonedElement.children), this.element);
                        detach(this.clonedElement);
                        this.removeAttributes();
                    }
                }
                this.clonedElement = null;
            }
            else {
                this.closeMenu();
                if (isBlazor()) {
                    this.element = this.removeChildElement(this.element);
                }
                else {
                    this.element.innerHTML = '';
                }
                this.removeAttributes();
                wrapper.parentNode.insertBefore(this.element, wrapper);
                this.clonedElement = null;
            }
            if (this.isMenu && this.clonedElement) {
                detach(this.element);
                wrapper.style.display = '';
                wrapper.classList.remove('e-' + this.getModuleName() + '-wrapper');
                wrapper.removeAttribute('data-ripple');
            }
            else {
                detach(wrapper);
            }
            super.destroy();
            if (this.template) {
                this.clearTemplate(['template']);
            }
        }
    }
};
__decorate$2([
    Event()
], MenuBase.prototype, "beforeItemRender", void 0);
__decorate$2([
    Event()
], MenuBase.prototype, "beforeOpen", void 0);
__decorate$2([
    Event()
], MenuBase.prototype, "onOpen", void 0);
__decorate$2([
    Event()
], MenuBase.prototype, "beforeClose", void 0);
__decorate$2([
    Event()
], MenuBase.prototype, "onClose", void 0);
__decorate$2([
    Event()
], MenuBase.prototype, "select", void 0);
__decorate$2([
    Event()
], MenuBase.prototype, "created", void 0);
__decorate$2([
    Property('')
], MenuBase.prototype, "cssClass", void 0);
__decorate$2([
    Property(0)
], MenuBase.prototype, "hoverDelay", void 0);
__decorate$2([
    Property(false)
], MenuBase.prototype, "showItemOnClick", void 0);
__decorate$2([
    Property('')
], MenuBase.prototype, "target", void 0);
__decorate$2([
    Property('')
], MenuBase.prototype, "filter", void 0);
__decorate$2([
    Property(null)
], MenuBase.prototype, "template", void 0);
__decorate$2([
    Property(false)
], MenuBase.prototype, "enableScrolling", void 0);
__decorate$2([
    Property(false)
], MenuBase.prototype, "enableHtmlSanitizer", void 0);
__decorate$2([
    Complex({ itemId: 'id', text: 'text', parentId: 'parentId', iconCss: 'iconCss', url: 'url', separator: 'separator', children: 'items' }, FieldSettings)
], MenuBase.prototype, "fields", void 0);
__decorate$2([
    Collection([], MenuItem)
], MenuBase.prototype, "items", void 0);
__decorate$2([
    Complex({ duration: 400, easing: 'ease', effect: 'SlideDown' }, MenuAnimationSettings)
], MenuBase.prototype, "animationSettings", void 0);
MenuBase = __decorate$2([
    NotifyPropertyChanges
], MenuBase);

/**
 * Navigation Common modules
 */

var __decorate$3 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const CLS_VERTICAL = 'e-vertical';
const CLS_ITEMS = 'e-toolbar-items';
const CLS_ITEM = 'e-toolbar-item';
const CLS_RTL$2 = 'e-rtl';
const CLS_SEPARATOR = 'e-separator';
const CLS_POPUPICON = 'e-popup-up-icon';
const CLS_POPUPDOWN = 'e-popup-down-icon';
const CLS_POPUPOPEN = 'e-popup-open';
const CLS_TEMPLATE = 'e-template';
const CLS_DISABLE$2 = 'e-overlay';
const CLS_POPUPTEXT = 'e-toolbar-text';
const CLS_TBARTEXT = 'e-popup-text';
const CLS_TBAROVERFLOW = 'e-overflow-show';
const CLS_POPOVERFLOW = 'e-overflow-hide';
const CLS_TBARBTN = 'e-tbar-btn';
const CLS_TBARNAV = 'e-hor-nav';
const CLS_TBARSCRLNAV = 'e-scroll-nav';
const CLS_TBARRIGHT = 'e-toolbar-right';
const CLS_TBARLEFT = 'e-toolbar-left';
const CLS_TBARCENTER = 'e-toolbar-center';
const CLS_TBARPOS = 'e-tbar-pos';
const CLS_HSCROLLCNT = 'e-hscroll-content';
const CLS_VSCROLLCNT = 'e-vscroll-content';
const CLS_HSCROLLBAR$1 = 'e-hscroll-bar';
const CLS_POPUPNAV = 'e-hor-nav';
const CLS_POPUPCLASS = 'e-toolbar-pop';
const CLS_POPUP = 'e-toolbar-popup';
const CLS_TBARBTNTEXT = 'e-tbar-btn-text';
const CLS_TBARNAVACT = 'e-nav-active';
const CLS_TBARIGNORE = 'e-ignore';
const CLS_POPPRI = 'e-popup-alone';
const CLS_HIDDEN = 'e-hidden';
const CLS_MULTIROW = 'e-toolbar-multirow';
const CLS_MULTIROWPOS = 'e-multirow-pos';
const CLS_MULTIROW_SEPARATOR = 'e-multirow-separator';
const CLS_EXTENDABLE_SEPARATOR = 'e-extended-separator';
const CLS_EXTEANDABLE_TOOLBAR = 'e-extended-toolbar';
const CLS_EXTENDABLECLASS = 'e-toolbar-extended';
const CLS_EXTENDPOPUP = 'e-expended-nav';
const CLS_EXTENDEDPOPOPEN = 'e-tbar-extended';
/**
 * An item object that is used to configure Toolbar commands.
 */
class Item extends ChildProperty {
}
__decorate$3([
    Property('')
], Item.prototype, "id", void 0);
__decorate$3([
    Property('')
], Item.prototype, "text", void 0);
__decorate$3([
    Property('auto')
], Item.prototype, "width", void 0);
__decorate$3([
    Property('')
], Item.prototype, "cssClass", void 0);
__decorate$3([
    Property(false)
], Item.prototype, "showAlwaysInPopup", void 0);
__decorate$3([
    Property(false)
], Item.prototype, "disabled", void 0);
__decorate$3([
    Property('')
], Item.prototype, "prefixIcon", void 0);
__decorate$3([
    Property('')
], Item.prototype, "suffixIcon", void 0);
__decorate$3([
    Property(true)
], Item.prototype, "visible", void 0);
__decorate$3([
    Property('None')
], Item.prototype, "overflow", void 0);
__decorate$3([
    Property('')
], Item.prototype, "template", void 0);
__decorate$3([
    Property('Button')
], Item.prototype, "type", void 0);
__decorate$3([
    Property('Both')
], Item.prototype, "showTextOn", void 0);
__decorate$3([
    Property(null)
], Item.prototype, "htmlAttributes", void 0);
__decorate$3([
    Property('')
], Item.prototype, "tooltipText", void 0);
__decorate$3([
    Property('Left')
], Item.prototype, "align", void 0);
__decorate$3([
    Event()
], Item.prototype, "click", void 0);
/**
 * The Toolbar control contains a group of commands that are aligned horizontally.
 * ```html
 * <div id="toolbar"/>
 * <script>
 *   var toolbarObj = new Toolbar();
 *   toolbarObj.appendTo("#toolbar");
 * </script>
 * ```
 */
let Toolbar = class Toolbar extends Component {
    /**
     * Initializes a new instance of the Toolbar class.
     *
     * @param {ToolbarModel} options  - Specifies Toolbar model properties as options.
     * @param { string | HTMLElement} element  - Specifies the element that is rendered as a Toolbar.
     */
    constructor(options, element) {
        super(options, element);
        this.resizeContext = this.resize.bind(this);
        /**
         * Contains the keyboard configuration of the Toolbar.
         */
        this.keyConfigs = {
            moveLeft: 'leftarrow',
            moveRight: 'rightarrow',
            moveUp: 'uparrow',
            moveDown: 'downarrow',
            popupOpen: 'enter',
            popupClose: 'escape',
            tab: 'tab',
            home: 'home',
            end: 'end'
        };
    }
    /**
     * Removes the control from the DOM and also removes all its related events.
     *
     * @returns {void}.
     */
    destroy() {
        if (this.isReact) {
            this.clearTemplate();
        }
        super.destroy();
        this.unwireEvents();
        this.tempId.forEach((ele) => {
            if (!isNullOrUndefined(this.element.querySelector(ele))) {
                document.body.appendChild(this.element.querySelector(ele)).style.display = 'none';
            }
        });
        while (this.element.lastElementChild) {
            this.element.removeChild(this.element.lastElementChild);
        }
        if (this.trgtEle) {
            this.element.appendChild(this.ctrlTem);
        }
        this.clearProperty();
        this.popObj = null;
        this.tbarAlign = null;
        this.remove(this.element, 'e-toolpop');
        if (this.cssClass) {
            removeClass([this.element], this.cssClass.split(' '));
        }
        this.element.removeAttribute('style');
        ['aria-disabled', 'aria-orientation', 'aria-haspopup', 'role'].forEach((attrb) => this.element.removeAttribute(attrb));
    }
    /**
     * Initialize the event handler
     *
     * @private
     * @returns {void}
     */
    preRender() {
        const eventArgs = { enableCollision: this.enableCollision, scrollStep: this.scrollStep };
        this.trigger('beforeCreate', eventArgs);
        this.enableCollision = eventArgs.enableCollision;
        this.scrollStep = eventArgs.scrollStep;
        this.scrollModule = null;
        this.popObj = null;
        this.tempId = [];
        this.tbarItemsCol = this.items;
        this.isVertical = this.element.classList.contains(CLS_VERTICAL) ? true : false;
        this.isExtendedOpen = false;
        this.popupPriCount = 0;
        if (this.enableRtl) {
            this.add(this.element, CLS_RTL$2);
        }
    }
    wireEvents() {
        EventHandler.add(this.element, 'click', this.clickHandler, this);
        window.addEventListener('resize', this.resizeContext);
        if (this.allowKeyboard) {
            this.wireKeyboardEvent();
        }
    }
    wireKeyboardEvent() {
        this.keyModule = new KeyboardEvents(this.element, {
            keyAction: this.keyActionHandler.bind(this),
            keyConfigs: this.keyConfigs
        });
        EventHandler.add(this.element, 'keydown', this.docKeyDown, this);
        this.element.setAttribute('tabIndex', '0');
    }
    unwireKeyboardEvent() {
        if (this.keyModule) {
            EventHandler.remove(this.element, 'keydown', this.docKeyDown);
            this.keyModule.destroy();
            this.keyModule = null;
        }
    }
    docKeyDown(e) {
        if (e.target.tagName === 'INPUT') {
            return;
        }
        const popCheck = !isNullOrUndefined(this.popObj) && isVisible(this.popObj.element) && this.overflowMode !== 'Extended';
        if (e.keyCode === 9 && e.target.classList.contains('e-hor-nav') === true && popCheck) {
            this.popObj.hide({ name: 'FadeOut', duration: 100 });
        }
        const keyCheck = (e.keyCode === 40 || e.keyCode === 38 || e.keyCode === 35 || e.keyCode === 36);
        if (keyCheck) {
            e.preventDefault();
        }
    }
    unwireEvents() {
        EventHandler.remove(this.element, 'click', this.clickHandler);
        this.destroyScroll();
        this.unwireKeyboardEvent();
        window.removeEventListener('resize', this.resizeContext);
        EventHandler.remove(document, 'scroll', this.docEvent);
        EventHandler.remove(document, 'click', this.docEvent);
    }
    clearProperty() {
        this.tbarEle = [];
        this.tbarAlgEle = { lefts: [], centers: [], rights: [] };
    }
    docEvent(e) {
        const popEle = closest(e.target, '.e-popup');
        if (this.popObj && isVisible(this.popObj.element) && !popEle && this.overflowMode === 'Popup') {
            this.popObj.hide({ name: 'FadeOut', duration: 100 });
        }
    }
    destroyScroll() {
        if (this.scrollModule) {
            if (this.tbarAlign) {
                this.add(this.scrollModule.element, CLS_TBARPOS);
            }
            this.scrollModule.destroy();
            this.scrollModule = null;
        }
    }
    destroyItems() {
        if (this.element) {
            [].slice.call(this.element.querySelectorAll('.' + CLS_ITEM)).forEach((el) => { detach(el); });
        }
        const tbarItems = this.element.querySelector('.' + CLS_ITEMS);
        if (this.tbarAlign) {
            [].slice.call(tbarItems.children).forEach((el) => {
                detach(el);
            });
            this.tbarAlign = false;
            this.remove(tbarItems, CLS_TBARPOS);
        }
        this.clearProperty();
    }
    destroyMode() {
        if (this.scrollModule) {
            this.remove(this.scrollModule.element, CLS_RTL$2);
            this.destroyScroll();
        }
        this.remove(this.element, CLS_EXTENDEDPOPOPEN);
        this.remove(this.element, CLS_EXTEANDABLE_TOOLBAR);
        const tempEle = this.element.querySelector('.e-toolbar-multirow');
        if (tempEle) {
            this.remove(tempEle, CLS_MULTIROW);
        }
        if (this.popObj) {
            this.popupRefresh(this.popObj.element, true);
        }
    }
    add(ele, val) {
        ele.classList.add(val);
    }
    remove(ele, val) {
        ele.classList.remove(val);
    }
    elementFocus(ele) {
        const fChild = ele.firstElementChild;
        if (fChild) {
            fChild.focus();
            this.activeEleSwitch(ele);
        }
        else {
            ele.focus();
        }
    }
    clstElement(tbrNavChk, trgt) {
        let clst;
        if (tbrNavChk && this.popObj && isVisible(this.popObj.element)) {
            clst = this.popObj.element.querySelector('.' + CLS_ITEM);
        }
        else if (this.element === trgt || tbrNavChk) {
            clst = this.element.querySelector('.' + CLS_ITEM + ':not(.' + CLS_DISABLE$2 + ' ):not(.' + CLS_SEPARATOR + ' ):not(.' + CLS_HIDDEN + ' )');
        }
        else {
            clst = closest(trgt, '.' + CLS_ITEM);
        }
        return clst;
    }
    keyHandling(clst, e, trgt, navChk, scrollChk) {
        const popObj = this.popObj;
        const rootEle = this.element;
        const popAnimate = { name: 'FadeOut', duration: 100 };
        const value = e.action === 'moveUp' ? 'previous' : 'next';
        let ele;
        let nodes;
        switch (e.action) {
            case 'moveRight':
                if (this.isVertical) {
                    return;
                }
                if (rootEle === trgt) {
                    this.elementFocus(clst);
                }
                else if (!navChk) {
                    this.eleFocus(clst, 'next');
                }
                break;
            case 'moveLeft':
                if (this.isVertical) {
                    return;
                }
                if (!navChk) {
                    this.eleFocus(clst, 'previous');
                }
                break;
            case 'home':
            case 'end':
                if (clst) {
                    const popupCheck = closest(clst, '.e-popup');
                    if (popupCheck) {
                        if (isVisible(this.popObj.element)) {
                            nodes = [].slice.call(popupCheck.children);
                            if (e.action === 'home') {
                                ele = nodes[0];
                            }
                            else {
                                ele = nodes[nodes.length - 1];
                            }
                        }
                    }
                    else {
                        nodes = this.element.querySelectorAll('.' + CLS_ITEMS + ' .' + CLS_ITEM);
                        if (e.action === 'home') {
                            ele = nodes[0];
                        }
                        else {
                            ele = nodes[nodes.length - 1];
                        }
                    }
                    if (ele) {
                        this.elementFocus(ele);
                    }
                }
                break;
            case 'moveUp':
            case 'moveDown':
                if (!this.isVertical) {
                    if (popObj && closest(trgt, '.e-popup')) {
                        const popEle = popObj.element;
                        const popFrstEle = popEle.firstElementChild;
                        if ((value === 'previous' && popFrstEle === clst) || (value === 'next' && popEle.lastElementChild === clst)) {
                            return;
                        }
                        else {
                            this.eleFocus(clst, value);
                        }
                    }
                    else if (e.action === 'moveDown' && popObj && isVisible(popObj.element)) {
                        this.elementFocus(clst);
                    }
                }
                else {
                    if (e.action === 'moveUp') {
                        this.eleFocus(clst, 'previous');
                    }
                    else {
                        this.eleFocus(clst, 'next');
                    }
                }
                break;
            case 'tab':
                if (!scrollChk && !navChk) {
                    const ele = clst.firstElementChild;
                    if (rootEle === trgt) {
                        if (this.activeEle) {
                            this.activeEle.focus();
                        }
                        else {
                            this.activeEleRemove(ele);
                            ele.focus();
                        }
                        this.element.removeAttribute('tabindex');
                    }
                }
                break;
            case 'popupClose':
                if (popObj && this.overflowMode !== 'Extended') {
                    popObj.hide(popAnimate);
                }
                break;
            case 'popupOpen':
                if (!navChk) {
                    return;
                }
                if (popObj && !isVisible(popObj.element)) {
                    popObj.element.style.top = rootEle.offsetHeight + 'px';
                    popObj.show({ name: 'FadeIn', duration: 100 });
                }
                else {
                    popObj.hide(popAnimate);
                }
                break;
        }
    }
    keyActionHandler(e) {
        const trgt = e.target;
        if (trgt.tagName === 'INPUT' || trgt.tagName === 'TEXTAREA' || this.element.classList.contains(CLS_DISABLE$2)) {
            return;
        }
        e.preventDefault();
        const tbrNavChk = trgt.classList.contains(CLS_TBARNAV);
        const tbarScrollChk = trgt.classList.contains(CLS_TBARSCRLNAV);
        const clst = this.clstElement(tbrNavChk, trgt);
        if (clst || tbarScrollChk) {
            this.keyHandling(clst, e, trgt, tbrNavChk, tbarScrollChk);
        }
    }
    /**
     * Specifies the value to disable/enable the Toolbar component.
     * When set to `true`, the component will be disabled.
     *
     * @param  {boolean} value - Based on this Boolean value, Toolbar will be enabled (false) or disabled (true).
     * @returns {void}.
     */
    disable(value) {
        const rootEle = this.element;
        if (value) {
            rootEle.classList.add(CLS_DISABLE$2);
        }
        else {
            rootEle.classList.remove(CLS_DISABLE$2);
        }
        rootEle.setAttribute('tabindex', !value ? '0' : '-1');
        if (this.activeEle) {
            this.activeEle.setAttribute('tabindex', !value ? '0' : '-1');
        }
        if (this.scrollModule) {
            this.scrollModule.disable(value);
        }
        if (this.popObj) {
            if (isVisible(this.popObj.element) && this.overflowMode !== 'Extended') {
                this.popObj.hide();
            }
            rootEle.querySelector('#' + rootEle.id + '_nav').setAttribute('tabindex', !value ? '0' : '-1');
        }
    }
    eleContains(el) {
        return el.classList.contains(CLS_SEPARATOR) || el.classList.contains(CLS_DISABLE$2) || el.getAttribute('disabled') || el.classList.contains(CLS_HIDDEN) || !isVisible(el);
    }
    eleFocus(closest$$1, pos) {
        const sib = Object(closest$$1)[pos + 'ElementSibling'];
        if (sib) {
            const skipEle = this.eleContains(sib);
            if (skipEle) {
                this.eleFocus(sib, pos);
                return;
            }
            this.elementFocus(sib);
        }
        else if (this.tbarAlign) {
            let elem = Object(closest$$1.parentElement)[pos + 'ElementSibling'];
            if (!isNullOrUndefined(elem) && elem.children.length === 0) {
                elem = Object(elem)[pos + 'ElementSibling'];
            }
            if (!isNullOrUndefined(elem) && elem.children.length > 0) {
                if (pos === 'next') {
                    const el = elem.querySelector('.' + CLS_ITEM);
                    if (this.eleContains(el)) {
                        this.eleFocus(el, pos);
                    }
                    else {
                        el.firstElementChild.focus();
                        this.activeEleSwitch(el);
                    }
                }
                else {
                    const el = elem.lastElementChild;
                    if (this.eleContains(el)) {
                        this.eleFocus(el, pos);
                    }
                    else {
                        this.elementFocus(el);
                    }
                }
            }
        }
    }
    clickHandler(e) {
        const trgt = e.target;
        const ele = this.element;
        const isPopupElement = !isNullOrUndefined(closest(trgt, '.' + CLS_POPUPCLASS));
        let clsList = trgt.classList;
        let popupNav = closest(trgt, ('.' + CLS_TBARNAV));
        if (!popupNav) {
            popupNav = trgt;
        }
        if (!ele.children[0].classList.contains('e-hscroll') && !ele.children[0].classList.contains('e-vscroll')
            && (clsList.contains(CLS_TBARNAV))) {
            clsList = trgt.querySelector('.e-icons').classList;
        }
        if (clsList.contains(CLS_POPUPICON) || clsList.contains(CLS_POPUPDOWN)) {
            this.popupClickHandler(ele, popupNav, CLS_RTL$2);
        }
        let itemObj;
        const clst = closest(e.target, '.' + CLS_ITEM);
        if ((isNullOrUndefined(clst) || clst.classList.contains(CLS_DISABLE$2)) && !popupNav.classList.contains(CLS_TBARNAV)) {
            return;
        }
        if (clst) {
            const tempItem = this.items[this.tbarEle.indexOf(clst)];
            itemObj = tempItem;
        }
        const eventArgs = { originalEvent: e, item: itemObj };
        if (itemObj && !isNullOrUndefined(itemObj.click)) {
            this.trigger('items[' + this.tbarEle.indexOf(clst) + '].click', eventArgs);
        }
        if (!eventArgs.cancel) {
            this.trigger('clicked', eventArgs, (clickedArgs) => {
                if (!isNullOrUndefined(this.popObj) && isPopupElement && !clickedArgs.cancel && this.overflowMode === 'Popup' &&
                    clickedArgs.item && clickedArgs.item.type !== 'Input') {
                    this.popObj.hide({ name: 'FadeOut', duration: 100 });
                }
            });
        }
    }
    popupClickHandler(ele, popupNav, CLS_RTL) {
        const popObj = this.popObj;
        if (isVisible(popObj.element)) {
            popupNav.classList.remove(CLS_TBARNAVACT);
            popObj.hide({ name: 'FadeOut', duration: 100 });
        }
        else {
            if (ele.classList.contains(CLS_RTL)) {
                popObj.enableRtl = true;
                popObj.position = { X: 'left', Y: 'top' };
            }
            if (popObj.offsetX === 0 && !ele.classList.contains(CLS_RTL)) {
                popObj.enableRtl = false;
                popObj.position = { X: 'right', Y: 'top' };
            }
            popObj.dataBind();
            popObj.refreshPosition();
            popObj.element.style.top = this.getElementOffsetY() + 'px';
            if (this.overflowMode === 'Extended') {
                popObj.element.style.minHeight = '0px';
            }
            popupNav.classList.add(CLS_TBARNAVACT);
            popObj.show({ name: 'FadeIn', duration: 100 });
        }
    }
    /**
     * To Initialize the control rendering
     *
     * @private
     * @returns {void}
     */
    render() {
        this.initialize();
        this.renderControl();
        this.wireEvents();
        this.renderComplete();
    }
    initialize() {
        const width = formatUnit(this.width);
        const height = formatUnit(this.height);
        if (Browser.info.name !== 'msie' || this.height !== 'auto' || this.overflowMode === 'MultiRow') {
            setStyleAttribute(this.element, { 'height': height });
        }
        setStyleAttribute(this.element, { 'width': width });
        const ariaAttr = {
            'role': 'toolbar', 'aria-disabled': 'false', 'aria-haspopup': 'false',
            'aria-orientation': !this.isVertical ? 'horizontal' : 'vertical'
        };
        attributes(this.element, ariaAttr);
        if (this.cssClass) {
            addClass([this.element], this.cssClass.split(' '));
        }
    }
    renderControl() {
        const ele = this.element;
        this.trgtEle = (ele.children.length > 0) ? ele.querySelector('div') : null;
        this.tbarAlgEle = { lefts: [], centers: [], rights: [] };
        this.renderItems();
        this.renderLayout();
    }
    renderLayout() {
        this.renderOverflowMode();
        if (this.tbarAlign) {
            this.itemPositioning();
        }
        if (this.popObj && this.popObj.element.childElementCount > 1 && this.checkPopupRefresh(this.element, this.popObj.element)) {
            this.popupRefresh(this.popObj.element, false);
        }
        this.separator();
    }
    itemsAlign(items, itemEleDom) {
        let innerItem;
        let innerPos;
        if (!this.tbarEle) {
            this.tbarEle = [];
        }
        for (let i = 0; i < items.length; i++) {
            innerItem = this.renderSubComponent(items[i], i);
            if (this.tbarEle.indexOf(innerItem) === -1) {
                this.tbarEle.push(innerItem);
            }
            if (!this.tbarAlign) {
                this.tbarItemAlign(items[i], itemEleDom, i);
            }
            innerPos = itemEleDom.querySelector('.e-toolbar-' + items[i].align.toLowerCase());
            if (innerPos) {
                if (!(items[i].showAlwaysInPopup && items[i].overflow !== 'Show')) {
                    this.tbarAlgEle[(items[i].align + 's').toLowerCase()].push(innerItem);
                }
                innerPos.appendChild(innerItem);
            }
            else {
                itemEleDom.appendChild(innerItem);
            }
        }
        if (this.isReact) {
            const portals = 'portals';
            this.notify('render-react-toolbar-template', this[portals]);
            this.renderReactTemplates();
        }
    }
    /**
     * @hidden
     * @returns {void}
     */
    changeOrientation() {
        const ele = this.element;
        if (this.isVertical) {
            ele.classList.remove(CLS_VERTICAL);
            this.isVertical = false;
            if (this.height === 'auto' || this.height === '100%') {
                ele.style.height = this.height;
            }
            ele.setAttribute('aria-orientation', 'horizontal');
        }
        else {
            ele.classList.add(CLS_VERTICAL);
            this.isVertical = true;
            ele.setAttribute('aria-orientation', 'vertical');
            setStyleAttribute(this.element, { 'height': formatUnit(this.height), 'width': formatUnit(this.width) });
        }
        this.destroyMode();
        this.refreshOverflow();
    }
    initScroll(element, innerItems) {
        if (!this.scrollModule && this.checkOverflow(element, innerItems[0])) {
            if (this.tbarAlign) {
                this.element.querySelector('.' + CLS_ITEMS + ' .' + CLS_TBARCENTER).removeAttribute('style');
            }
            if (this.isVertical) {
                this.scrollModule = new VScroll({ scrollStep: this.scrollStep, enableRtl: this.enableRtl }, innerItems[0]);
            }
            else {
                this.scrollModule = new HScroll({ scrollStep: this.scrollStep, enableRtl: this.enableRtl }, innerItems[0]);
            }
            this.remove(this.scrollModule.element, CLS_TBARPOS);
            setStyleAttribute(this.element, { overflow: 'hidden' });
        }
    }
    itemWidthCal(items) {
        let width = 0;
        let style;
        [].slice.call(selectAll('.' + CLS_ITEM, items)).forEach((el) => {
            if (isVisible(el)) {
                style = window.getComputedStyle(el);
                width += this.isVertical ? el.offsetHeight : el.offsetWidth;
                width += parseFloat(this.isVertical ? style.marginTop : style.marginRight);
                width += parseFloat(this.isVertical ? style.marginBottom : style.marginLeft);
            }
        });
        return width;
    }
    getScrollCntEle(innerItem) {
        const trgClass = (this.isVertical) ? '.e-vscroll-content' : '.e-hscroll-content';
        return innerItem.querySelector(trgClass);
    }
    checkOverflow(element, innerItem) {
        if (isNullOrUndefined(element) || isNullOrUndefined(innerItem) || !isVisible(element)) {
            return false;
        }
        const eleWidth = this.isVertical ? element.offsetHeight : element.offsetWidth;
        let itemWidth = this.isVertical ? innerItem.offsetHeight : innerItem.offsetWidth;
        if (this.tbarAlign || this.scrollModule || (eleWidth === itemWidth)) {
            itemWidth = this.itemWidthCal(this.scrollModule ? this.getScrollCntEle(innerItem) : innerItem);
        }
        const popNav = element.querySelector('.' + CLS_TBARNAV);
        const scrollNav = element.querySelector('.' + CLS_TBARSCRLNAV);
        let navEleWidth = 0;
        if (popNav) {
            navEleWidth = this.isVertical ? popNav.offsetHeight : popNav.offsetWidth;
        }
        else if (scrollNav) {
            navEleWidth = this.isVertical ? (scrollNav.offsetHeight * (2)) : (scrollNav.offsetWidth * 2);
        }
        if (itemWidth > eleWidth - navEleWidth) {
            return true;
        }
        else {
            return false;
        }
    }
    /**
     * Refresh the whole Toolbar component without re-rendering.
     * - It is used to manually refresh the Toolbar overflow modes such as scrollable, popup, multi row, and extended.
     * - It will refresh the Toolbar component after loading items dynamically.
     *
     * @returns {void}.
     */
    refreshOverflow() {
        this.resize();
    }
    toolbarAlign(innerItems) {
        if (this.tbarAlign) {
            this.add(innerItems, CLS_TBARPOS);
            this.itemPositioning();
        }
    }
    renderOverflowMode() {
        const ele = this.element;
        const innerItems = ele.querySelector('.' + CLS_ITEMS);
        const priorityCheck = this.popupPriCount > 0;
        if (ele && ele.children.length > 0) {
            this.offsetWid = ele.offsetWidth;
            this.remove(this.element, 'e-toolpop');
            if (Browser.info.name === 'msie' && this.height === 'auto') {
                ele.style.height = '';
            }
            switch (this.overflowMode) {
                case 'Scrollable':
                    if (isNullOrUndefined(this.scrollModule)) {
                        this.initScroll(ele, [].slice.call(ele.getElementsByClassName(CLS_ITEMS)));
                    }
                    break;
                case 'Popup':
                    this.add(this.element, 'e-toolpop');
                    if (this.tbarAlign) {
                        this.removePositioning();
                    }
                    if (this.checkOverflow(ele, innerItems) || priorityCheck) {
                        this.setOverflowAttributes(ele);
                    }
                    this.toolbarAlign(innerItems);
                    break;
                case 'MultiRow':
                    this.add(innerItems, CLS_MULTIROW);
                    if (this.checkOverflow(ele, innerItems) && this.tbarAlign) {
                        this.removePositioning();
                        this.add(innerItems, CLS_MULTIROWPOS);
                    }
                    if (ele.style.overflow === 'hidden') {
                        ele.style.overflow = '';
                    }
                    if (Browser.info.name === 'msie' || ele.style.height !== 'auto') {
                        ele.style.height = 'auto';
                    }
                    break;
                case 'Extended':
                    this.add(this.element, CLS_EXTEANDABLE_TOOLBAR);
                    if (this.checkOverflow(ele, innerItems) || priorityCheck) {
                        if (this.tbarAlign) {
                            this.removePositioning();
                        }
                        this.setOverflowAttributes(ele);
                    }
                    this.toolbarAlign(innerItems);
            }
        }
    }
    setOverflowAttributes(ele) {
        this.createPopupEle(ele, [].slice.call(selectAll('.' + CLS_ITEMS + ' .' + CLS_ITEM, ele)));
        this.element.querySelector('.' + CLS_TBARNAV).setAttribute('tabIndex', '0');
        this.element.querySelector('.' + CLS_TBARNAV).setAttribute('role', 'list');
    }
    separator() {
        const element = this.element;
        const eleItem = [].slice.call(element.querySelectorAll('.' + CLS_SEPARATOR));
        const multiVar = element.querySelector('.' + CLS_MULTIROW_SEPARATOR);
        const extendVar = element.querySelector('.' + CLS_EXTENDABLE_SEPARATOR);
        const eleInlineItem = this.overflowMode === 'MultiRow' ? multiVar : extendVar;
        if (eleInlineItem !== null) {
            if (this.overflowMode === 'MultiRow') {
                eleInlineItem.classList.remove(CLS_MULTIROW_SEPARATOR);
            }
            else if (this.overflowMode === 'Extended') {
                eleInlineItem.classList.remove(CLS_EXTENDABLE_SEPARATOR);
            }
        }
        for (let i = 0; i <= eleItem.length - 1; i++) {
            if (eleItem[i].offsetLeft < 30 && eleItem[i].offsetLeft !== 0) {
                if (this.overflowMode === 'MultiRow') {
                    eleItem[i].classList.add(CLS_MULTIROW_SEPARATOR);
                }
                else if (this.overflowMode === 'Extended') {
                    eleItem[i].classList.add(CLS_EXTENDABLE_SEPARATOR);
                }
            }
        }
    }
    createPopupEle(ele, innerEle) {
        let innerNav = ele.querySelector('.' + CLS_TBARNAV);
        const vertical = this.isVertical;
        if (!innerNav) {
            this.createPopupIcon(ele);
        }
        innerNav = ele.querySelector('.' + CLS_TBARNAV);
        const innerNavDom = (vertical ? innerNav.offsetHeight : innerNav.offsetWidth);
        const eleWidth = ((vertical ? ele.offsetHeight : ele.offsetWidth) - (innerNavDom));
        this.element.classList.remove('e-rtl');
        setStyleAttribute(this.element, { direction: 'initial' });
        this.checkPriority(ele, innerEle, eleWidth, true);
        if (this.enableRtl) {
            this.element.classList.add('e-rtl');
        }
        this.element.style.removeProperty('direction');
        this.createPopup();
    }
    pushingPoppedEle(tbarObj, popupPri, ele, eleHeight, sepHeight) {
        const element = tbarObj.element;
        const poppedEle = [].slice.call(selectAll('.' + CLS_POPUP, element.querySelector('.' + CLS_ITEMS)));
        let nodes = selectAll('.' + CLS_TBAROVERFLOW, ele);
        let nodeIndex = 0;
        let nodePri = 0;
        poppedEle.forEach((el, index) => {
            nodes = selectAll('.' + CLS_TBAROVERFLOW, ele);
            if (el.classList.contains(CLS_TBAROVERFLOW) && nodes.length > 0) {
                if (tbarObj.tbResize && nodes.length > index) {
                    ele.insertBefore(el, nodes[index]);
                    ++nodePri;
                }
                else {
                    ele.insertBefore(el, ele.children[nodes.length]);
                    ++nodePri;
                }
            }
            else if (el.classList.contains(CLS_TBAROVERFLOW)) {
                ele.insertBefore(el, ele.firstChild);
                ++nodePri;
            }
            else if (tbarObj.tbResize && el.classList.contains(CLS_POPOVERFLOW) && ele.children.length > 0 && nodes.length === 0) {
                ele.insertBefore(el, ele.firstChild);
                ++nodePri;
            }
            else if (el.classList.contains(CLS_POPOVERFLOW)) {
                popupPri.push(el);
            }
            else if (tbarObj.tbResize) {
                ele.insertBefore(el, ele.childNodes[nodeIndex + nodePri]);
                ++nodeIndex;
            }
            else {
                ele.appendChild(el);
            }
            if (el.classList.contains(CLS_SEPARATOR)) {
                setStyleAttribute(el, { display: '', height: sepHeight + 'px' });
            }
            else {
                setStyleAttribute(el, { display: '', height: eleHeight + 'px' });
            }
        });
        popupPri.forEach((el) => {
            ele.appendChild(el);
        });
        const tbarEle = selectAll('.' + CLS_ITEM, element.querySelector('.' + CLS_ITEMS));
        for (let i = tbarEle.length - 1; i >= 0; i--) {
            const tbarElement = tbarEle[i];
            if (tbarElement.classList.contains(CLS_SEPARATOR) && this.overflowMode !== 'Extended') {
                setStyleAttribute(tbarElement, { display: 'none' });
            }
            else {
                break;
            }
        }
    }
    createPopup() {
        const element = this.element;
        let sepHeight;
        let sepItem;
        if (this.overflowMode === 'Extended') {
            sepItem = element.querySelector('.' + CLS_SEPARATOR + ':not(.' + CLS_POPUP + ')');
            sepHeight = (element.style.height === 'auto' || element.style.height === '') ? null : sepItem.offsetHeight;
        }
        const eleItem = element.querySelector('.' + CLS_ITEM + ':not(.' + CLS_SEPARATOR + '):not(.' + CLS_POPUP + ')');
        const eleHeight = (element.style.height === 'auto' || element.style.height === '') ? null : (eleItem && eleItem.offsetHeight);
        let ele;
        const popupPri = [];
        if (select('#' + element.id + '_popup.' + CLS_POPUPCLASS, element)) {
            ele = select('#' + element.id + '_popup.' + CLS_POPUPCLASS, element);
        }
        else {
            const extendEle = this.createElement('div', {
                id: element.id + '_popup', className: CLS_POPUPCLASS + ' ' + CLS_EXTENDABLECLASS
            });
            const popupEle = this.createElement('div', { id: element.id + '_popup', className: CLS_POPUPCLASS });
            ele = this.overflowMode === 'Extended' ? extendEle : popupEle;
        }
        this.pushingPoppedEle(this, popupPri, ele, eleHeight, sepHeight);
        this.popupInit(element, ele);
    }
    getElementOffsetY() {
        return (this.overflowMode === 'Extended' && window.getComputedStyle(this.element).getPropertyValue('box-sizing') === 'border-box' ?
            this.element.clientHeight : this.element.offsetHeight);
    }
    popupInit(element, ele) {
        if (!this.popObj) {
            element.appendChild(ele);
            setStyleAttribute(this.element, { overflow: '' });
            const eleStyles = window.getComputedStyle(this.element);
            const popup = new Popup(null, {
                relateTo: this.element,
                offsetY: (this.isVertical) ? 0 : this.getElementOffsetY(),
                enableRtl: this.enableRtl,
                open: this.popupOpen.bind(this),
                close: this.popupClose.bind(this),
                collision: { Y: this.enableCollision ? 'flip' : 'none' },
                position: this.enableRtl ? { X: 'left', Y: 'top' } : { X: 'right', Y: 'top' }
            });
            popup.appendTo(ele);
            if (this.overflowMode === 'Extended') {
                popup.width = parseFloat(eleStyles.width) + ((parseFloat(eleStyles.borderRightWidth)) * 2);
                popup.offsetX = 0;
            }
            EventHandler.add(document, 'scroll', this.docEvent.bind(this));
            EventHandler.add(document, 'click ', this.docEvent.bind(this));
            popup.element.style.maxHeight = popup.element.offsetHeight + 'px';
            if (this.isVertical) {
                popup.element.style.visibility = 'hidden';
            }
            if (this.isExtendedOpen) {
                const popupNav = this.element.querySelector('.' + CLS_TBARNAV);
                popupNav.classList.add(CLS_TBARNAVACT);
                classList(popupNav.firstElementChild, [CLS_POPUPICON], [CLS_POPUPDOWN]);
                this.element.querySelector('.' + CLS_EXTENDABLECLASS).classList.add(CLS_POPUPOPEN);
            }
            else {
                popup.hide();
            }
            this.popObj = popup;
            this.element.setAttribute('aria-haspopup', 'true');
        }
        else {
            const popupEle = this.popObj.element;
            setStyleAttribute(popupEle, { maxHeight: '', display: 'block' });
            setStyleAttribute(popupEle, { maxHeight: popupEle.offsetHeight + 'px', display: '' });
        }
    }
    tbarPopupHandler(isOpen) {
        if (this.overflowMode === 'Extended') {
            isOpen ? this.add(this.element, CLS_EXTENDEDPOPOPEN) : this.remove(this.element, CLS_EXTENDEDPOPOPEN);
        }
    }
    popupOpen(e) {
        const popObj = this.popObj;
        if (!this.isVertical) {
            popObj.offsetY = this.getElementOffsetY();
            popObj.dataBind();
        }
        const popupEle = this.popObj.element;
        const toolEle = this.popObj.element.parentElement;
        const popupNav = toolEle.querySelector('.' + CLS_TBARNAV);
        setStyleAttribute(popObj.element, { height: 'auto', maxHeight: '' });
        popObj.element.style.maxHeight = popObj.element.offsetHeight + 'px';
        if (this.overflowMode === 'Extended') {
            popObj.element.style.minHeight = '';
        }
        const popupElePos = popupEle.offsetTop + popupEle.offsetHeight + calculatePosition(toolEle).top;
        const popIcon = popupNav.firstElementChild;
        popupNav.classList.add(CLS_TBARNAVACT);
        classList(popIcon, [CLS_POPUPICON], [CLS_POPUPDOWN]);
        this.tbarPopupHandler(true);
        const scrollVal = isNullOrUndefined(window.scrollY) ? 0 : window.scrollY;
        if (!this.isVertical && ((window.innerHeight + scrollVal) < popupElePos) && (this.element.offsetTop < popupEle.offsetHeight)) {
            let overflowHeight = (popupEle.offsetHeight - ((popupElePos - window.innerHeight - scrollVal) + 5));
            popObj.height = overflowHeight + 'px';
            for (let i = 0; i <= popupEle.childElementCount; i++) {
                const ele = popupEle.children[i];
                if (ele.offsetTop + ele.offsetHeight > overflowHeight) {
                    overflowHeight = ele.offsetTop;
                    break;
                }
            }
            setStyleAttribute(popObj.element, { maxHeight: overflowHeight + 'px' });
        }
        else if (this.isVertical) {
            const tbEleData = this.element.getBoundingClientRect();
            setStyleAttribute(popObj.element, { maxHeight: (tbEleData.top + this.element.offsetHeight) + 'px', bottom: 0, visibility: '' });
        }
        if (popObj) {
            const popupOffset = popupEle.getBoundingClientRect();
            if (popupOffset.right > document.documentElement.clientWidth && popupOffset.width > toolEle.getBoundingClientRect().width) {
                popObj.collision = { Y: 'none' };
                popObj.dataBind();
            }
            popObj.refreshPosition();
        }
    }
    popupClose(e) {
        const element = this.element;
        const popupNav = element.querySelector('.' + CLS_TBARNAV);
        const popIcon = popupNav.firstElementChild;
        popupNav.classList.remove(CLS_TBARNAVACT);
        classList(popIcon, [CLS_POPUPDOWN], [CLS_POPUPICON]);
        this.tbarPopupHandler(false);
    }
    checkPriority(ele, inEle, eleWidth, pre) {
        const popPriority = this.popupPriCount > 0;
        const len = inEle.length;
        const eleWid = eleWidth;
        let eleOffset;
        let checkoffset;
        let sepCheck = 0;
        let itemCount = 0;
        let itemPopCount = 0;
        const checkClass = (ele, val) => {
            let rVal = false;
            val.forEach((cls) => {
                if (ele.classList.contains(cls)) {
                    rVal = true;
                }
            });
            return rVal;
        };
        for (let i = len - 1; i >= 0; i--) {
            let mrgn;
            const compuStyle = window.getComputedStyle(inEle[i]);
            if (this.isVertical) {
                mrgn = parseFloat((compuStyle).marginTop);
                mrgn += parseFloat((compuStyle).marginBottom);
            }
            else {
                mrgn = parseFloat((compuStyle).marginRight);
                mrgn += parseFloat((compuStyle).marginLeft);
            }
            const fstEleCheck = inEle[i] === this.tbarEle[0];
            if (fstEleCheck) {
                this.tbarEleMrgn = mrgn;
            }
            eleOffset = this.isVertical ? inEle[i].offsetHeight : inEle[i].offsetWidth;
            const eleWid = fstEleCheck ? (eleOffset + mrgn) : eleOffset;
            if (checkClass(inEle[i], [CLS_POPPRI]) && popPriority) {
                inEle[i].classList.add(CLS_POPUP);
                if (this.isVertical) {
                    setStyleAttribute(inEle[i], { display: 'none', minHeight: eleWid + 'px' });
                }
                else {
                    setStyleAttribute(inEle[i], { display: 'none', minWidth: eleWid + 'px' });
                }
                itemPopCount++;
            }
            if (this.isVertical) {
                checkoffset = (inEle[i].offsetTop + inEle[i].offsetHeight + mrgn) > eleWidth;
            }
            else {
                checkoffset = (inEle[i].offsetLeft + inEle[i].offsetWidth + mrgn) > eleWidth;
            }
            if (checkoffset) {
                if (inEle[i].classList.contains(CLS_SEPARATOR)) {
                    if (this.overflowMode === 'Extended') {
                        if (itemCount === itemPopCount) {
                            const sepEle = inEle[i];
                            if (checkClass(sepEle, [CLS_SEPARATOR, CLS_TBARIGNORE])) {
                                inEle[i].classList.add(CLS_POPUP);
                                itemPopCount++;
                            }
                        }
                        itemCount++;
                    }
                    else if (this.overflowMode === 'Popup') {
                        if (sepCheck > 0 && itemCount === itemPopCount) {
                            const sepEle = inEle[i + itemCount + (sepCheck - 1)];
                            if (checkClass(sepEle, [CLS_SEPARATOR, CLS_TBARIGNORE])) {
                                setStyleAttribute(sepEle, { display: 'none' });
                            }
                        }
                        sepCheck++;
                        itemCount = 0;
                        itemPopCount = 0;
                    }
                }
                else {
                    itemCount++;
                }
                if (inEle[i].classList.contains(CLS_TBAROVERFLOW) && pre) {
                    eleWidth -= ((this.isVertical ? inEle[i].offsetHeight : inEle[i].offsetWidth) + (mrgn));
                }
                else if (!checkClass(inEle[i], [CLS_SEPARATOR, CLS_TBARIGNORE])) {
                    inEle[i].classList.add(CLS_POPUP);
                    if (this.isVertical) {
                        setStyleAttribute(inEle[i], { display: 'none', minHeight: eleWid + 'px' });
                    }
                    else {
                        setStyleAttribute(inEle[i], { display: 'none', minWidth: eleWid + 'px' });
                    }
                    itemPopCount++;
                }
                else {
                    eleWidth -= ((this.isVertical ? inEle[i].offsetHeight : inEle[i].offsetWidth) + (mrgn));
                }
            }
        }
        if (pre) {
            const popedEle = selectAll('.' + CLS_ITEM + ':not(.' + CLS_POPUP + ')', this.element);
            this.checkPriority(ele, popedEle, eleWid, false);
        }
    }
    createPopupIcon(element) {
        const id = element.id.concat('_nav');
        let className = 'e-' + element.id.concat('_nav ' + CLS_POPUPNAV);
        className = this.overflowMode === 'Extended' ? className + ' ' + CLS_EXTENDPOPUP : className;
        const nav = this.createElement('div', { id: id, className: className });
        if (Browser.info.name === 'msie' || Browser.info.name === 'edge') {
            nav.classList.add('e-ie-align');
        }
        const navItem = this.createElement('div', { className: CLS_POPUPDOWN + ' e-icons' });
        nav.appendChild(navItem);
        nav.setAttribute('tabindex', '0');
        nav.setAttribute('role', 'list');
        element.appendChild(nav);
    }
    tbarPriRef(inEle, indx, sepPri, el, des, elWid, wid, ig) {
        const ignoreCount = ig;
        const popEle = this.popObj.element;
        const query = '.' + CLS_ITEM + ':not(.' + CLS_SEPARATOR + '):not(.' + CLS_TBAROVERFLOW + ')';
        const priEleCnt = selectAll('.' + CLS_POPUP + ':not(.' + CLS_TBAROVERFLOW + ')', popEle).length;
        const checkClass = (ele, val) => {
            return ele.classList.contains(val);
        };
        if (selectAll(query, inEle).length === 0) {
            const eleSep = inEle.children[indx - (indx - sepPri) - 1];
            const ignoreCheck = (!isNullOrUndefined(eleSep) && checkClass(eleSep, CLS_TBARIGNORE));
            if ((!isNullOrUndefined(eleSep) && checkClass(eleSep, CLS_SEPARATOR) && !isVisible(eleSep)) || ignoreCheck) {
                const sepDisplay = 'none';
                eleSep.style.display = 'inherit';
                const eleSepWidth = eleSep.offsetWidth + (parseFloat(window.getComputedStyle(eleSep).marginRight) * 2);
                const prevSep = eleSep.previousElementSibling;
                if ((elWid + eleSepWidth) < wid || des) {
                    inEle.insertBefore(el, inEle.children[(indx + ignoreCount) - (indx - sepPri)]);
                    if (!isNullOrUndefined(prevSep)) {
                        prevSep.style.display = '';
                    }
                }
                else {
                    if (prevSep.classList.contains(CLS_SEPARATOR)) {
                        prevSep.style.display = sepDisplay;
                    }
                }
                eleSep.style.display = '';
            }
            else {
                inEle.insertBefore(el, inEle.children[(indx + ignoreCount) - (indx - sepPri)]);
            }
        }
        else {
            inEle.insertBefore(el, inEle.children[(indx + ignoreCount) - priEleCnt]);
        }
    }
    popupRefresh(popupEle, destroy) {
        const ele = this.element;
        const isVer = this.isVertical;
        const innerEle = ele.querySelector('.' + CLS_ITEMS);
        let popNav = ele.querySelector('.' + CLS_TBARNAV);
        if (isNullOrUndefined(popNav)) {
            return;
        }
        innerEle.removeAttribute('style');
        popupEle.style.display = 'block';
        let dimension;
        if (isVer) {
            dimension = ele.offsetHeight - (popNav.offsetHeight + innerEle.offsetHeight);
        }
        else {
            dimension = ele.offsetWidth - (popNav.offsetWidth + innerEle.offsetWidth);
        }
        let popupEleWidth = 0;
        [].slice.call(popupEle.children).forEach((el) => {
            popupEleWidth += this.popupEleWidth(el);
            setStyleAttribute(el, { 'position': '' });
        });
        if ((dimension + (isVer ? popNav.offsetHeight : popNav.offsetWidth)) > (popupEleWidth) && this.popupPriCount === 0) {
            destroy = true;
        }
        this.popupEleRefresh(dimension, popupEle, destroy);
        popupEle.style.display = '';
        if (popupEle.children.length === 0 && popNav && this.popObj) {
            detach(popNav);
            popNav = null;
            this.popObj.destroy();
            detach(this.popObj.element);
            this.popObj = null;
            ele.setAttribute('aria-haspopup', 'false');
        }
    }
    ignoreEleFetch(index, innerEle) {
        const ignoreEle = [].slice.call(innerEle.querySelectorAll('.' + CLS_TBARIGNORE));
        const ignoreInx = [];
        let count = 0;
        if (ignoreEle.length > 0) {
            ignoreEle.forEach((ele) => {
                ignoreInx.push([].slice.call(innerEle.children).indexOf(ele));
            });
        }
        else {
            return 0;
        }
        ignoreInx.forEach((val) => {
            if (val <= index) {
                count++;
            }
        });
        return count;
    }
    checkPopupRefresh(root, popEle) {
        popEle.style.display = 'block';
        const elWid = this.popupEleWidth(popEle.firstElementChild);
        popEle.firstElementChild.style.removeProperty('Position');
        const tbarWidth = root.offsetWidth - root.querySelector('.' + CLS_TBARNAV).offsetWidth;
        const tbarItemsWid = root.querySelector('.' + CLS_ITEMS).offsetWidth;
        popEle.style.removeProperty('display');
        if (tbarWidth > (elWid + tbarItemsWid)) {
            return true;
        }
        return false;
    }
    popupEleWidth(el) {
        el.style.position = 'absolute';
        let elWidth = this.isVertical ? el.offsetHeight : el.offsetWidth;
        const btnText = el.querySelector('.' + CLS_TBARBTNTEXT);
        if (el.classList.contains('e-tbtn-align') || el.classList.contains(CLS_TBARTEXT)) {
            const btn = el.children[0];
            if (!isNullOrUndefined(btnText) && el.classList.contains(CLS_TBARTEXT)) {
                btnText.style.display = 'none';
            }
            else if (!isNullOrUndefined(btnText) && el.classList.contains(CLS_POPUPTEXT)) {
                btnText.style.display = 'block';
            }
            btn.style.minWidth = '0%';
            elWidth = parseFloat(!this.isVertical ? el.style.minWidth : el.style.minHeight);
            btn.style.minWidth = '';
            btn.style.minHeight = '';
            if (!isNullOrUndefined(btnText)) {
                btnText.style.display = '';
            }
        }
        return elWidth;
    }
    popupEleRefresh(width, popupEle, destroy) {
        const popPriority = this.popupPriCount > 0;
        let eleSplice = this.tbarEle;
        let priEleCnt;
        let index;
        let innerEle = this.element.querySelector('.' + CLS_ITEMS);
        let ignoreCount = 0;
        for (const el of [].slice.call(popupEle.children)) {
            if (el.classList.contains(CLS_POPPRI) && popPriority && !destroy) {
                continue;
            }
            let elWidth = this.popupEleWidth(el);
            if (el === this.tbarEle[0]) {
                elWidth += this.tbarEleMrgn;
            }
            el.style.position = '';
            if (elWidth < width || destroy) {
                setStyleAttribute(el, { minWidth: '', height: '', minHeight: '' });
                if (!el.classList.contains(CLS_POPOVERFLOW)) {
                    el.classList.remove(CLS_POPUP);
                }
                index = this.tbarEle.indexOf(el);
                if (this.tbarAlign) {
                    const pos = this.items[index].align;
                    index = this.tbarAlgEle[(pos + 's').toLowerCase()].indexOf(el);
                    eleSplice = this.tbarAlgEle[(pos + 's').toLowerCase()];
                    innerEle = this.element.querySelector('.' + CLS_ITEMS + ' .' + 'e-toolbar-' + pos.toLowerCase());
                }
                let sepBeforePri = 0;
                if (this.overflowMode !== 'Extended') {
                    eleSplice.slice(0, index).forEach((el) => {
                        if (el.classList.contains(CLS_TBAROVERFLOW) || el.classList.contains(CLS_SEPARATOR)) {
                            if (el.classList.contains(CLS_SEPARATOR)) {
                                el.style.display = '';
                                width -= el.offsetWidth;
                            }
                            sepBeforePri++;
                        }
                    });
                }
                ignoreCount = this.ignoreEleFetch(index, innerEle);
                if (el.classList.contains(CLS_TBAROVERFLOW)) {
                    this.tbarPriRef(innerEle, index, sepBeforePri, el, destroy, elWidth, width, ignoreCount);
                    width -= el.offsetWidth;
                }
                else if (index === 0) {
                    innerEle.insertBefore(el, innerEle.firstChild);
                    width -= el.offsetWidth;
                }
                else {
                    priEleCnt = selectAll('.' + CLS_TBAROVERFLOW, this.popObj.element).length;
                    innerEle.insertBefore(el, innerEle.children[(index + ignoreCount) - priEleCnt]);
                    width -= el.offsetWidth;
                }
                el.style.height = '';
            }
            else {
                break;
            }
        }
        const checkOverflow = this.checkOverflow(this.element, this.element.getElementsByClassName(CLS_ITEMS)[0]);
        if (checkOverflow && !destroy) {
            this.renderOverflowMode();
        }
    }
    removePositioning() {
        const item = this.element.querySelector('.' + CLS_ITEMS);
        if (isNullOrUndefined(item) || !item.classList.contains(CLS_TBARPOS)) {
            return;
        }
        this.remove(item, CLS_TBARPOS);
        const innerItem = [].slice.call(item.childNodes);
        innerItem[1].removeAttribute('style');
        innerItem[2].removeAttribute('style');
    }
    refreshPositioning() {
        const item = this.element.querySelector('.' + CLS_ITEMS);
        this.add(item, CLS_TBARPOS);
        this.itemPositioning();
    }
    itemPositioning() {
        const item = this.element.querySelector('.' + CLS_ITEMS);
        let margin;
        if (isNullOrUndefined(item) || !item.classList.contains(CLS_TBARPOS)) {
            return;
        }
        const popupNav = this.element.querySelector('.' + CLS_TBARNAV);
        let innerItem;
        if (this.scrollModule) {
            const trgClass = (this.isVertical) ? CLS_VSCROLLCNT : CLS_HSCROLLCNT;
            innerItem = [].slice.call(item.querySelector('.' + trgClass).children);
        }
        else {
            innerItem = [].slice.call(item.childNodes);
        }
        if (this.isVertical) {
            margin = innerItem[0].offsetHeight + innerItem[2].offsetHeight;
        }
        else {
            margin = innerItem[0].offsetWidth + innerItem[2].offsetWidth;
        }
        let tbarWid = this.isVertical ? this.element.offsetHeight : this.element.offsetWidth;
        if (popupNav) {
            tbarWid -= (this.isVertical ? popupNav.offsetHeight : popupNav.offsetWidth);
            const popWid = (this.isVertical ? popupNav.offsetHeight : popupNav.offsetWidth) + 'px';
            innerItem[2].removeAttribute('style');
            if (this.isVertical) {
                this.enableRtl ? innerItem[2].style.top = popWid : innerItem[2].style.bottom = popWid;
            }
            else {
                this.enableRtl ? innerItem[2].style.left = popWid : innerItem[2].style.right = popWid;
            }
        }
        if (tbarWid <= margin) {
            return;
        }
        const value = (((tbarWid - margin)) - (!this.isVertical ? innerItem[1].offsetWidth : innerItem[1].offsetHeight)) / 2;
        innerItem[1].removeAttribute('style');
        const mrgn = ((!this.isVertical ? innerItem[0].offsetWidth : innerItem[0].offsetHeight) + value) + 'px';
        if (this.isVertical) {
            this.enableRtl ? innerItem[1].style.marginBottom = mrgn : innerItem[1].style.marginTop = mrgn;
        }
        else {
            this.enableRtl ? innerItem[1].style.marginRight = mrgn : innerItem[1].style.marginLeft = mrgn;
        }
    }
    tbarItemAlign(item, itemEle, pos) {
        if (item.showAlwaysInPopup && item.overflow !== 'Show') {
            return;
        }
        const alignDiv = [];
        alignDiv.push(this.createElement('div', { className: CLS_TBARLEFT }));
        alignDiv.push(this.createElement('div', { className: CLS_TBARCENTER }));
        alignDiv.push(this.createElement('div', { className: CLS_TBARRIGHT }));
        if (pos === 0 && item.align !== 'Left') {
            alignDiv.forEach((ele) => {
                itemEle.appendChild(ele);
            });
            this.tbarAlign = true;
            this.add(itemEle, CLS_TBARPOS);
        }
        else if (item.align !== 'Left') {
            const alignEle = itemEle.childNodes;
            const leftAlign = alignDiv[0];
            [].slice.call(alignEle).forEach((el) => {
                this.tbarAlgEle.lefts.push(el);
                leftAlign.appendChild(el);
            });
            itemEle.appendChild(leftAlign);
            itemEle.appendChild(alignDiv[1]);
            itemEle.appendChild(alignDiv[2]);
            this.tbarAlign = true;
            this.add(itemEle, CLS_TBARPOS);
        }
    }
    ctrlTemplate() {
        this.ctrlTem = this.trgtEle.cloneNode(true);
        this.add(this.trgtEle, CLS_ITEMS);
        this.tbarEle = [];
        const innerEle = [].slice.call(this.trgtEle.children);
        innerEle.forEach((ele) => {
            if (ele.tagName === 'DIV') {
                this.tbarEle.push(ele);
                ele.setAttribute('aria-disabled', 'false');
                this.add(ele, CLS_ITEM);
            }
        });
    }
    renderItems() {
        const ele = this.element;
        const items = this.items;
        if (this.trgtEle != null) {
            this.ctrlTemplate();
        }
        else if (ele && items.length > 0) {
            let itemEleDom;
            if (ele && ele.children.length > 0) {
                itemEleDom = ele.querySelector('.' + CLS_ITEMS);
            }
            if (!itemEleDom) {
                itemEleDom = this.createElement('div', { className: CLS_ITEMS });
            }
            this.itemsAlign(items, itemEleDom);
            ele.appendChild(itemEleDom);
        }
    }
    setAttr(attr, element) {
        const key = Object.keys(attr);
        let keyVal;
        for (let i = 0; i < key.length; i++) {
            keyVal = key[i];
            keyVal === 'class' ? this.add(element, attr[keyVal]) : element.setAttribute(keyVal, attr[keyVal]);
        }
    }
    /**
     * Enables or disables the specified Toolbar item.
     *
     * @param  {number|HTMLElement|NodeList} items - DOM element or an array of items to be enabled or disabled.
     * @param  {boolean} isEnable  - Boolean value that determines whether the command should be enabled or disabled.
     * By default, `isEnable` is set to true.
     * @returns {void}.
     */
    enableItems(items, isEnable) {
        const elements = items;
        const len = elements.length;
        let ele;
        if (isNullOrUndefined(isEnable)) {
            isEnable = true;
        }
        const enable = (isEnable, ele) => {
            if (isEnable) {
                ele.classList.remove(CLS_DISABLE$2);
                ele.setAttribute('aria-disabled', 'false');
            }
            else {
                ele.classList.add(CLS_DISABLE$2);
                ele.setAttribute('aria-disabled', 'true');
            }
        };
        if (!isNullOrUndefined(len) && len >= 1) {
            for (let a = 0, element = [].slice.call(elements); a < len; a++) {
                const itemElement = element[a];
                if (typeof (itemElement) === 'number') {
                    ele = this.getElementByIndex(itemElement);
                    if (isNullOrUndefined(ele)) {
                        return;
                    }
                    else {
                        elements[a] = ele;
                    }
                }
                else {
                    ele = itemElement;
                }
                enable(isEnable, ele);
            }
            isEnable ? removeClass(elements, CLS_DISABLE$2) : addClass(elements, CLS_DISABLE$2);
        }
        else {
            if (typeof (elements) === 'number') {
                ele = this.getElementByIndex(elements);
                if (isNullOrUndefined(ele)) {
                    return;
                }
            }
            else {
                ele = items;
            }
            enable(isEnable, ele);
        }
    }
    getElementByIndex(index) {
        if (this.tbarEle[index]) {
            return this.tbarEle[index];
        }
        return null;
    }
    /**
     * Adds new items to the Toolbar that accepts an array as Toolbar items.
     *
     * @param  {ItemModel[]} items - DOM element or an array of items to be added to the Toolbar.
     * @param  {number} index - Number value that determines where the command is to be added. By default, index is 0.
     * @returns {void}.
     * @deprecated
     */
    addItems(items, index) {
        let innerItems;
        this.extendedOpen();
        const itemsDiv = this.element.querySelector('.' + CLS_ITEMS);
        if (isNullOrUndefined(itemsDiv)) {
            this.itemsRerender(items);
            return;
        }
        let innerEle;
        let itemAgn = 'Left';
        if (isNullOrUndefined(index)) {
            index = 0;
        }
        items.forEach((e) => {
            if (!isNullOrUndefined(e.align) && e.align !== 'Left' && itemAgn === 'Left') {
                itemAgn = e.align;
            }
        });
        for (const item of items) {
            if (isNullOrUndefined(item.type)) {
                item.type = 'Button';
            }
            innerItems = selectAll('.' + CLS_ITEM, this.element);
            item.align = itemAgn;
            innerEle = this.renderSubComponent(item, index);
            if (this.tbarEle.length >= index && innerItems.length >= 0) {
                if (isNullOrUndefined(this.scrollModule)) {
                    this.destroyMode();
                }
                const algIndex = item.align[0] === 'L' ? 0 : item.align[0] === 'C' ? 1 : 2;
                let ele;
                if (!this.tbarAlign && itemAgn !== 'Left') {
                    this.tbarItemAlign(item, itemsDiv, 1);
                    this.tbarAlign = true;
                    ele = closest(innerItems[0], '.' + CLS_ITEMS).children[algIndex];
                    ele.appendChild(innerEle);
                    this.tbarAlgEle[(item.align + 's').toLowerCase()].push(innerEle);
                    this.refreshPositioning();
                }
                else if (this.tbarAlign) {
                    ele = closest(innerItems[0], '.' + CLS_ITEMS).children[algIndex];
                    ele.insertBefore(innerEle, ele.children[index]);
                    this.tbarAlgEle[(item.align + 's').toLowerCase()].splice(index, 0, innerEle);
                    this.refreshPositioning();
                }
                else if (innerItems.length === 0) {
                    innerItems = selectAll('.' + CLS_ITEMS, this.element);
                    innerItems[0].appendChild(innerEle);
                }
                else {
                    innerItems[0].parentNode.insertBefore(innerEle, innerItems[index]);
                }
                this.items.splice(index, 0, item);
                this.tbarEle.splice(index, 0, innerEle);
                index++;
                this.offsetWid = itemsDiv.offsetWidth;
            }
        }
        itemsDiv.style.width = '';
        this.renderOverflowMode();
        if (this.isReact) {
            this.renderReactTemplates();
        }
    }
    /**
     * Removes the items from the Toolbar. Acceptable arguments are index of item/HTMLElement/node list.
     *
     * @param  {number|HTMLElement|NodeList|HTMLElement[]} args
     * Index or DOM element or an Array of item which is to be removed from the Toolbar.
     * @returns {void}.
     * @deprecated
     */
    removeItems(args) {
        const elements = args;
        let index;
        let innerItems = [].slice.call(selectAll('.' + CLS_ITEM, this.element));
        if (typeof (elements) === 'number') {
            index = parseInt(args.toString(), 10);
            this.removeItemByIndex(index, innerItems);
        }
        else {
            if (elements && elements.length > 1) {
                for (const ele of [].slice.call(elements)) {
                    index = this.tbarEle.indexOf(ele);
                    this.removeItemByIndex(index, innerItems);
                    innerItems = selectAll('.' + CLS_ITEM, this.element);
                }
            }
            else {
                const ele = (elements && elements.length && elements.length === 1) ? elements[0] : args;
                index = innerItems.indexOf(ele);
                this.removeItemByIndex(index, innerItems);
            }
        }
        this.resize();
    }
    removeItemByIndex(index, innerItems) {
        if (this.tbarEle[index] && innerItems[index]) {
            const eleIdx = this.tbarEle.indexOf(innerItems[index]);
            if (this.tbarAlign) {
                const indexAgn = this.tbarAlgEle[(this.items[eleIdx].align + 's').toLowerCase()].indexOf(this.tbarEle[eleIdx]);
                this.tbarAlgEle[(this.items[eleIdx].align + 's').toLowerCase()].splice(indexAgn, 1);
            }
            if (this.isReact) {
                this.clearTemplate();
            }
            detach(innerItems[index]);
            this.items.splice(eleIdx, 1);
            this.tbarEle.splice(eleIdx, 1);
        }
    }
    templateRender(templateProp, innerEle, item, index) {
        const itemType = item.type;
        const eleObj = templateProp;
        let isComponent;
        if (typeof (templateProp) === 'object') {
            isComponent = typeof (eleObj.appendTo) === 'function';
        }
        if (typeof (templateProp) === 'string' || !isComponent) {
            let templateFn;
            let val = templateProp;
            val = (typeof (templateProp) === 'string') ? templateProp.trim() : templateProp;
            try {
                if (typeof (templateProp) === 'object' && !isNullOrUndefined(templateProp.tagName)) {
                    innerEle.appendChild(templateProp);
                }
                else if (document.querySelectorAll(val).length) {
                    const ele = document.querySelector(val);
                    const tempStr = ele.outerHTML.trim();
                    innerEle.appendChild(ele);
                    ele.style.display = '';
                    if (!isNullOrUndefined(tempStr)) {
                        this.tempId.push(val);
                    }
                }
            }
            catch (e) {
                templateFn = compile(val);
            }
            let tempArray;
            if (!isNullOrUndefined(templateFn)) {
                const toolbarTemplateID = this.element.id + index + '_template';
                tempArray = templateFn({}, this, 'template', toolbarTemplateID, this.isStringTemplate);
            }
            if (!isNullOrUndefined(tempArray) && tempArray.length > 0) {
                [].slice.call(tempArray).forEach((ele) => {
                    if (!isNullOrUndefined(ele.tagName)) {
                        ele.style.display = '';
                    }
                    innerEle.appendChild(ele);
                });
            }
        }
        else if (itemType === 'Input') {
            const ele = this.createElement('input');
            item.id ? (ele.id = item.id) : (ele.id = getUniqueID('tbr-ipt'));
            innerEle.appendChild(ele);
            eleObj.appendTo(ele);
        }
        this.add(innerEle, CLS_TEMPLATE);
        this.tbarEle.push(innerEle);
    }
    buttonRendering(item, innerEle) {
        const dom = this.createElement('button', { className: CLS_TBARBTN });
        dom.setAttribute('type', 'button');
        const textStr = item.text;
        let iconCss;
        let iconPos;
        item.id ? (dom.id = item.id) : dom.id = getUniqueID('e-tbr-btn');
        const btnTxt = this.createElement('span', { className: 'e-tbar-btn-text' });
        if (textStr) {
            btnTxt.innerHTML = this.enableHtmlSanitizer ? SanitizeHtmlHelper.sanitize(textStr) : textStr;
            dom.appendChild(btnTxt);
            dom.classList.add('e-tbtn-txt');
        }
        else {
            this.add(innerEle, 'e-tbtn-align');
        }
        if (item.prefixIcon || item.suffixIcon) {
            if ((item.prefixIcon && item.suffixIcon) || item.prefixIcon) {
                iconCss = item.prefixIcon + ' e-icons';
                iconPos = 'Left';
            }
            else {
                iconCss = item.suffixIcon + ' e-icons';
                iconPos = 'Right';
            }
        }
        const btnObj = new Button({ iconCss: iconCss, iconPosition: iconPos });
        btnObj.createElement = this.createElement;
        btnObj.appendTo(dom);
        if (item.width) {
            setStyleAttribute(dom, { 'width': formatUnit(item.width) });
        }
        return dom;
    }
    renderSubComponent(item, index) {
        let dom;
        const innerEle = this.createElement('div', { className: CLS_ITEM });
        innerEle.setAttribute('aria-disabled', 'false');
        const tempDom = this.createElement('div', {
            innerHTML: this.enableHtmlSanitizer ? SanitizeHtmlHelper.sanitize(item.tooltipText) : item.tooltipText
        });
        if (!this.tbarEle) {
            this.tbarEle = [];
        }
        if (item.htmlAttributes) {
            this.setAttr(item.htmlAttributes, innerEle);
        }
        if (item.tooltipText) {
            innerEle.setAttribute('title', tempDom.textContent);
        }
        if (item.cssClass) {
            innerEle.className = innerEle.className + ' ' + item.cssClass;
        }
        if (item.template) {
            this.templateRender(item.template, innerEle, item, index);
        }
        else {
            switch (item.type) {
                case 'Button':
                    dom = this.buttonRendering(item, innerEle);
                    dom.setAttribute('tabindex', '-1');
                    dom.setAttribute('aria-label', (item.text || item.tooltipText));
                    innerEle.appendChild(dom);
                    innerEle.addEventListener('click', this.itemClick.bind(this));
                    break;
                case 'Separator':
                    this.add(innerEle, CLS_SEPARATOR);
                    break;
            }
        }
        if (item.showTextOn) {
            const sTxt = item.showTextOn;
            if (sTxt === 'Toolbar') {
                this.add(innerEle, CLS_POPUPTEXT);
                this.add(innerEle, 'e-tbtn-align');
            }
            else if (sTxt === 'Overflow') {
                this.add(innerEle, CLS_TBARTEXT);
            }
        }
        if (item.overflow) {
            const overflow = item.overflow;
            if (overflow === 'Show') {
                this.add(innerEle, CLS_TBAROVERFLOW);
            }
            else if (overflow === 'Hide') {
                if (!innerEle.classList.contains(CLS_SEPARATOR)) {
                    this.add(innerEle, CLS_POPOVERFLOW);
                }
            }
        }
        if (item.overflow !== 'Show' && item.showAlwaysInPopup && !innerEle.classList.contains(CLS_SEPARATOR)) {
            this.add(innerEle, CLS_POPPRI);
            this.popupPriCount++;
        }
        if (item.disabled) {
            this.add(innerEle, CLS_DISABLE$2);
        }
        if (item.visible === false) {
            this.add(innerEle, CLS_HIDDEN);
        }
        return innerEle;
    }
    itemClick(e) {
        this.activeEleSwitch(e.currentTarget);
    }
    activeEleSwitch(ele) {
        this.activeEleRemove(ele.firstElementChild);
        this.activeEle.focus();
    }
    activeEleRemove(curEle) {
        if (!isNullOrUndefined(this.activeEle)) {
            this.activeEle.setAttribute('tabindex', '-1');
        }
        this.activeEle = curEle;
        if (isNullOrUndefined(this.trgtEle) && !curEle.parentElement.classList.contains(CLS_TEMPLATE)) {
            curEle.removeAttribute('tabindex');
        }
        else {
            this.activeEle.setAttribute('tabindex', '0');
        }
    }
    getPersistData() {
        return this.addOnPersist([]);
    }
    /**
     * Returns the current module name.
     *
     * @returns {string} - Returns the module name as string.
     * @private
     */
    getModuleName() {
        return 'toolbar';
    }
    itemsRerender(newProp) {
        this.items = this.tbarItemsCol;
        if (this.isReact) {
            this.clearTemplate();
        }
        this.destroyMode();
        this.destroyItems();
        this.items = newProp;
        this.tbarItemsCol = this.items;
        this.renderItems();
        this.renderOverflowMode();
        if (this.isReact) {
            this.renderReactTemplates();
        }
    }
    resize() {
        const ele = this.element;
        this.tbResize = true;
        if (this.tbarAlign) {
            this.itemPositioning();
        }
        if (this.popObj && this.overflowMode === 'Popup') {
            this.popObj.hide();
        }
        const checkOverflow = this.checkOverflow(ele, ele.getElementsByClassName(CLS_ITEMS)[0]);
        if (!checkOverflow) {
            this.destroyScroll();
            const multirowele = ele.querySelector('.' + CLS_ITEMS);
            if (!isNullOrUndefined(multirowele)) {
                this.remove(multirowele, CLS_MULTIROWPOS);
                if (this.tbarAlign) {
                    this.add(multirowele, CLS_TBARPOS);
                }
            }
        }
        if (checkOverflow && this.scrollModule && (this.offsetWid === ele.offsetWidth)) {
            return;
        }
        if (this.offsetWid > ele.offsetWidth || checkOverflow) {
            this.renderOverflowMode();
        }
        if (this.popObj) {
            if (this.overflowMode === 'Extended') {
                const eleStyles = window.getComputedStyle(this.element);
                this.popObj.width = parseFloat(eleStyles.width) + ((parseFloat(eleStyles.borderRightWidth)) * 2);
            }
            if (this.tbarAlign) {
                this.removePositioning();
            }
            this.popupRefresh(this.popObj.element, false);
            if (this.tbarAlign) {
                this.refreshPositioning();
            }
        }
        if (this.element.querySelector('.' + CLS_HSCROLLBAR$1)) {
            this.scrollStep = this.element.querySelector('.' + CLS_HSCROLLBAR$1).offsetWidth;
        }
        this.offsetWid = ele.offsetWidth;
        this.tbResize = false;
        this.separator();
    }
    extendedOpen() {
        const sib = this.element.querySelector('.' + CLS_EXTENDABLECLASS);
        if (this.overflowMode === 'Extended' && sib) {
            this.isExtendedOpen = sib.classList.contains(CLS_POPUPOPEN);
        }
    }
    /**
     * Gets called when the model property changes.The data that describes the old and new values of the property that changed.
     *
     * @param  {ToolbarModel} newProp - It contains new value of the data.
     * @param  {ToolbarModel} oldProp - It contains old value of the data.
     * @returns {void}
     * @private
     */
    onPropertyChanged(newProp, oldProp) {
        const tEle = this.element;
        const wid = tEle.offsetWidth;
        this.extendedOpen();
        for (const prop of Object.keys(newProp)) {
            switch (prop) {
                case 'items':
                    if (!(newProp.items instanceof Array && oldProp.items instanceof Array) && !this.isServerRendered) {
                        const changedProb = Object.keys(newProp.items);
                        for (let i = 0; i < changedProb.length; i++) {
                            const index = parseInt(Object.keys(newProp.items)[i], 10);
                            const property = Object.keys(newProp.items[index])[0];
                            const newProperty = Object(newProp.items[index])[property];
                            if (typeof newProperty !== 'function') {
                                if (this.tbarAlign || property === 'align') {
                                    this.refresh();
                                    this.trigger('created');
                                    break;
                                }
                                const popupPriCheck = property === 'showAlwaysInPopup' && !newProperty;
                                const booleanCheck = property === 'overflow' && this.popupPriCount !== 0;
                                if ((popupPriCheck) || (this.items[index].showAlwaysInPopup) && booleanCheck) {
                                    --this.popupPriCount;
                                }
                                if (isNullOrUndefined(this.scrollModule)) {
                                    this.destroyMode();
                                }
                                const itemCol = [].slice.call(selectAll('.' + CLS_ITEMS + ' .' + CLS_ITEM, tEle));
                                if (this.isReact) {
                                    this.clearTemplate();
                                }
                                detach(itemCol[index]);
                                this.tbarEle.splice(index, 1);
                                this.addItems([this.items[index]], index);
                                this.items.splice(index, 1);
                                if (this.items[index].template) {
                                    this.tbarEle.splice(this.items.length, 1);
                                }
                            }
                        }
                    }
                    else {
                        this.itemsRerender(newProp.items);
                    }
                    break;
                case 'width':
                    setStyleAttribute(tEle, { 'width': formatUnit(newProp.width) });
                    this.renderOverflowMode();
                    if (this.popObj && wid < tEle.offsetWidth) {
                        this.popupRefresh(this.popObj.element, false);
                    }
                    break;
                case 'height':
                    setStyleAttribute(this.element, { 'height': formatUnit(newProp.height) });
                    break;
                case 'overflowMode':
                    this.destroyMode();
                    this.renderOverflowMode();
                    if (this.enableRtl) {
                        this.add(tEle, CLS_RTL$2);
                    }
                    this.refreshOverflow();
                    break;
                case 'enableRtl':
                    newProp.enableRtl ? this.add(tEle, CLS_RTL$2) : this.remove(tEle, CLS_RTL$2);
                    if (!isNullOrUndefined(this.scrollModule)) {
                        newProp.enableRtl ? this.add(this.scrollModule.element, CLS_RTL$2) : this.remove(this.scrollModule.element, CLS_RTL$2);
                    }
                    if (!isNullOrUndefined(this.popObj)) {
                        newProp.enableRtl ? this.add(this.popObj.element, CLS_RTL$2) : this.remove(this.popObj.element, CLS_RTL$2);
                    }
                    if (this.tbarAlign) {
                        this.itemPositioning();
                    }
                    break;
                case 'scrollStep':
                    if (this.scrollModule) {
                        this.scrollModule.scrollStep = this.scrollStep;
                    }
                    break;
                case 'enableCollision':
                    if (this.popObj) {
                        this.popObj.collision = { Y: this.enableCollision ? 'flip' : 'none' };
                    }
                    break;
                case 'cssClass':
                    if (oldProp.cssClass) {
                        removeClass([this.element], oldProp.cssClass.split(' '));
                    }
                    if (newProp.cssClass) {
                        addClass([this.element], newProp.cssClass.split(' '));
                    }
                    break;
                case 'allowKeyboard':
                    this.unwireKeyboardEvent();
                    if (newProp.allowKeyboard) {
                        this.wireKeyboardEvent();
                    }
                    break;
            }
        }
    }
    /**
     * Shows or hides the Toolbar item that is in the specified index.
     *
     * @param  {number | HTMLElement} index - Index value of target item or DOM element  of items to be hidden or shown.
     * @param  {boolean} value - Based on this Boolean value, item will be hide (true) or show (false). By default, value is false.
     * @returns {void}.
     */
    hideItem(index, value) {
        const isElement = (typeof (index) === 'object') ? true : false;
        let eleIndex = index;
        let initIndex;
        let ele;
        const innerItems = [].slice.call(selectAll('.' + CLS_ITEM, this.element));
        if (isElement) {
            ele = index;
        }
        else if (this.tbarEle[eleIndex]) {
            const innerItems = [].slice.call(selectAll('.' + CLS_ITEM, this.element));
            ele = innerItems[eleIndex];
        }
        if (ele) {
            value ? ele.classList.add(CLS_HIDDEN) : ele.classList.remove(CLS_HIDDEN);
            if (value && isNullOrUndefined(this.element.getAttribute('tabindex')) && !ele.classList.contains(CLS_SEPARATOR)) {
                if (isNullOrUndefined(ele.firstElementChild.getAttribute('tabindex'))) {
                    ele.firstElementChild.setAttribute('tabindex', '-1');
                    const innerItems = [].slice.call(selectAll('.' + CLS_ITEM, this.element));
                    if (isElement) {
                        eleIndex = innerItems.indexOf(ele);
                    }
                    let nextEle = innerItems[++eleIndex];
                    while (nextEle) {
                        const skipEle = this.eleContains(nextEle);
                        if (!skipEle) {
                            nextEle.firstElementChild.removeAttribute('tabindex');
                            break;
                        }
                        nextEle = innerItems[++eleIndex];
                    }
                }
            }
            else if (isNullOrUndefined(this.element.getAttribute('tabindex')) && !ele.classList.contains(CLS_SEPARATOR)) {
                initIndex = 0;
                let setFlag = false;
                let removeFlag = false;
                let initELe = innerItems[initIndex];
                while (initELe) {
                    if (!initELe.classList.contains(CLS_SEPARATOR)) {
                        if (isNullOrUndefined(initELe.firstElementChild.getAttribute('tabindex'))) {
                            initELe.firstElementChild.setAttribute('tabindex', '-1');
                            setFlag = true;
                        }
                        else {
                            if (setFlag && removeFlag) {
                                break;
                            }
                            const skipEle = this.eleContains(initELe);
                            if (!skipEle) {
                                initELe.firstElementChild.removeAttribute('tabindex');
                                removeFlag = true;
                            }
                            initELe = innerItems[++initIndex];
                        }
                    }
                    else {
                        initELe = innerItems[++initIndex];
                    }
                }
            }
            this.refreshOverflow();
        }
    }
};
__decorate$3([
    Collection([], Item)
], Toolbar.prototype, "items", void 0);
__decorate$3([
    Property('auto')
], Toolbar.prototype, "width", void 0);
__decorate$3([
    Property('auto')
], Toolbar.prototype, "height", void 0);
__decorate$3([
    Property('')
], Toolbar.prototype, "cssClass", void 0);
__decorate$3([
    Property('Scrollable')
], Toolbar.prototype, "overflowMode", void 0);
__decorate$3([
    Property()
], Toolbar.prototype, "scrollStep", void 0);
__decorate$3([
    Property(true)
], Toolbar.prototype, "enableCollision", void 0);
__decorate$3([
    Property(true)
], Toolbar.prototype, "enableHtmlSanitizer", void 0);
__decorate$3([
    Property(true)
], Toolbar.prototype, "allowKeyboard", void 0);
__decorate$3([
    Event()
], Toolbar.prototype, "clicked", void 0);
__decorate$3([
    Event()
], Toolbar.prototype, "created", void 0);
__decorate$3([
    Event()
], Toolbar.prototype, "destroyed", void 0);
__decorate$3([
    Event()
], Toolbar.prototype, "beforeCreate", void 0);
Toolbar = __decorate$3([
    NotifyPropertyChanges
], Toolbar);

/**
 * Toolbar modules
 */

var __decorate$4 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const CLS_ACRDN_ROOT = 'e-acrdn-root';
const CLS_ROOT$2 = 'e-accordion';
const CLS_ITEM$1 = 'e-acrdn-item';
const CLS_ITEMFOCUS = 'e-item-focus';
const CLS_ITEMHIDE = 'e-hide';
const CLS_HEADER = 'e-acrdn-header';
const CLS_HEADERICN = 'e-acrdn-header-icon';
const CLS_HEADERCTN = 'e-acrdn-header-content';
const CLS_CONTENT = 'e-acrdn-panel';
const CLS_CTENT = 'e-acrdn-content';
const CLS_TOOGLEICN = 'e-toggle-icon';
const CLS_COLLAPSEICN = 'e-tgl-collapse-icon e-icons';
const CLS_EXPANDICN = 'e-expand-icon';
const CLS_RTL$3 = 'e-rtl';
const CLS_CTNHIDE = 'e-content-hide';
const CLS_SLCT = 'e-select';
const CLS_SLCTED = 'e-selected';
const CLS_ACTIVE = 'e-active';
const CLS_ANIMATE = 'e-animate';
const CLS_DISABLE$3 = 'e-overlay';
const CLS_TOGANIMATE = 'e-toggle-animation';
const CLS_NEST = 'e-nested';
const CLS_EXPANDSTATE = 'e-expand-state';
const CLS_CONTAINER = 'e-accordion-container';
/**
 * Objects used for configuring the Accordion expanding item action properties.
 */
class AccordionActionSettings extends ChildProperty {
}
__decorate$4([
    Property('SlideDown')
], AccordionActionSettings.prototype, "effect", void 0);
__decorate$4([
    Property(400)
], AccordionActionSettings.prototype, "duration", void 0);
__decorate$4([
    Property('linear')
], AccordionActionSettings.prototype, "easing", void 0);
/**
 * Objects used for configuring the Accordion animation properties.
 */
class AccordionAnimationSettings extends ChildProperty {
}
__decorate$4([
    Complex({ effect: 'SlideUp', duration: 400, easing: 'linear' }, AccordionActionSettings)
], AccordionAnimationSettings.prototype, "collapse", void 0);
__decorate$4([
    Complex({ effect: 'SlideDown', duration: 400, easing: 'linear' }, AccordionActionSettings)
], AccordionAnimationSettings.prototype, "expand", void 0);
/**
 * An item object that is used to configure Accordion items.
 */
class AccordionItem extends ChildProperty {
}
__decorate$4([
    Property(null)
], AccordionItem.prototype, "content", void 0);
__decorate$4([
    Property(null)
], AccordionItem.prototype, "header", void 0);
__decorate$4([
    Property(null)
], AccordionItem.prototype, "cssClass", void 0);
__decorate$4([
    Property(null)
], AccordionItem.prototype, "iconCss", void 0);
__decorate$4([
    Property(false)
], AccordionItem.prototype, "expanded", void 0);
__decorate$4([
    Property(true)
], AccordionItem.prototype, "visible", void 0);
__decorate$4([
    Property(false)
], AccordionItem.prototype, "disabled", void 0);
__decorate$4([
    Property()
], AccordionItem.prototype, "id", void 0);
/**
 * The Accordion is a vertically collapsible content panel that displays one or more panels at a time within the available space.
 * ```html
 * <div id='accordion'/>
 * <script>
 *   var accordionObj = new Accordion();
 *   accordionObj.appendTo('#accordion');
 * </script>
 * ```
 */
let Accordion = class Accordion extends Component {
    /**
     * Initializes a new instance of the Accordion class.
     *
     * @param {AccordionModel} options  - Specifies Accordion model properties as options.
     * @param {string | HTMLElement} element  - Specifies the element that is rendered as an Accordion.
     */
    constructor(options, element) {
        super(options, element);
        /**
         * Contains the keyboard configuration of the Accordion.
         */
        this.keyConfigs = {
            moveUp: 'uparrow',
            moveDown: 'downarrow',
            enter: 'enter',
            space: 'space',
            home: 'home',
            end: 'end'
        };
    }
    /**
     * Removes the control from the DOM and also removes all its related events.
     *
     * @returns {void}
     */
    destroy() {
        if (this.isReact) {
            this.clearTemplate();
        }
        const ele = this.element;
        super.destroy();
        this.unwireEvents();
        this.isDestroy = true;
        this.restoreContent(null);
        [].slice.call(ele.children).forEach((el) => {
            ele.removeChild(el);
        });
        if (this.trgtEle) {
            while (this.ctrlTem.firstElementChild) {
                ele.appendChild(this.ctrlTem.firstElementChild);
            }
        }
        ele.classList.remove(CLS_ACRDN_ROOT);
        ele.removeAttribute('style');
        ['aria-disabled', 'aria-multiselectable', 'role', 'data-ripple'].forEach((attrb) => {
            this.element.removeAttribute(attrb);
        });
        if (!this.isNested && isRippleEnabled) {
            this.removeRippleEffect();
        }
    }
    preRender() {
        const nested = closest(this.element, '.' + CLS_CONTENT);
        this.isNested = false;
        this.templateEle = [];
        if (!this.isDestroy) {
            this.isDestroy = false;
        }
        if (!isNullOrUndefined(nested)) {
            nested.classList.add(CLS_NEST);
            this.isNested = true;
        }
        else {
            this.element.classList.add(CLS_ACRDN_ROOT);
        }
        if (this.enableRtl) {
            this.add(this.element, CLS_RTL$3);
        }
    }
    add(ele, val) {
        ele.classList.add(val);
    }
    remove(ele, val) {
        ele.classList.remove(val);
    }
    /**
     * To initialize the control rendering
     *
     * @private
     * @returns {void}
     */
    render() {
        if (!this.isServerRendered) {
            this.initializeheaderTemplate();
            this.initializeItemTemplate();
            this.initialize();
            this.renderControl();
        }
        else {
            this.wireFocusEvents();
        }
        this.wireEvents();
        this.renderComplete();
    }
    initialize() {
        const width = formatUnit(this.width);
        const height = formatUnit(this.height);
        setStyleAttribute(this.element, { 'width': width, 'height': height });
        const ariaAttr = {
            'aria-disabled': 'false', 'role': 'presentation', 'aria-multiselectable': 'true'
        };
        if (isNullOrUndefined(this.initExpand)) {
            this.initExpand = [];
        }
        if (this.expandedIndices.length > 0) {
            this.initExpand = this.expandedIndices;
        }
        attributes(this.element, ariaAttr);
        if (this.expandMode === 'Single') {
            this.element.setAttribute('aria-multiselectable', 'false');
        }
    }
    renderControl() {
        this.trgtEle = (this.element.children.length > 0) ? select('div', this.element) : null;
        this.renderItems();
        this.initItemExpand();
    }
    wireFocusEvents() {
        const acrdItem = [].slice.call(this.element.querySelectorAll('.' + CLS_ITEM$1));
        for (const item of acrdItem) {
            const headerEle = item.querySelector('.' + CLS_HEADER);
            if (item.childElementCount > 0 && headerEle) {
                EventHandler.clearEvents(headerEle);
                EventHandler.add(headerEle, 'focus', this.focusIn, this);
                EventHandler.add(headerEle, 'blur', this.focusOut, this);
            }
        }
    }
    unwireEvents() {
        EventHandler.remove(this.element, 'click', this.clickHandler);
        if (!isNullOrUndefined(this.keyModule)) {
            this.keyModule.destroy();
        }
    }
    wireEvents() {
        EventHandler.add(this.element, 'click', this.clickHandler, this);
        if (!this.isNested && !this.isDestroy) {
            this.removeRippleEffect = rippleEffect(this.element, { selector: '.' + CLS_HEADER });
        }
        if (!this.isNested) {
            this.keyModule = new KeyboardEvents(this.element, {
                keyAction: this.keyActionHandler.bind(this),
                keyConfigs: this.keyConfigs,
                eventName: 'keydown'
            });
        }
    }
    templateParser(template) {
        if (template) {
            try {
                if (document.querySelectorAll(template).length) {
                    return compile(document.querySelector(template).innerHTML.trim());
                }
            }
            catch (error) {
                return compile(template);
            }
        }
        return undefined;
    }
    initializeheaderTemplate() {
        if (this.headerTemplate) {
            this.headerTemplateFn = this.templateParser(this.headerTemplate);
        }
    }
    initializeItemTemplate() {
        if (this.itemTemplate) {
            this.itemTemplateFn = this.templateParser(this.itemTemplate);
        }
    }
    /* eslint-disable */
    getheaderTemplate() {
        return this.headerTemplateFn;
    }
    /* eslint-disable */
    getItemTemplate() {
        return this.itemTemplateFn;
    }
    focusIn(e) {
        e.target.parentElement.classList.add(CLS_ITEMFOCUS);
    }
    focusOut(e) {
        e.target.parentElement.classList.remove(CLS_ITEMFOCUS);
    }
    ctrlTemplate() {
        this.ctrlTem = this.element.cloneNode(true);
        let innerEles;
        const rootEle = select('.' + CLS_CONTAINER, this.element);
        if (rootEle) {
            innerEles = rootEle.children;
        }
        else {
            innerEles = this.element.children;
        }
        const items = [];
        /* eslint-disable */
        [].slice.call(innerEles).forEach((el) => {
            items.push({
                header: (el.childElementCount > 0 && el.children[0]) ? (el.children[0]) : '',
                content: (el.childElementCount > 1 && el.children[1]) ? (el.children[1]) : ''
            });
            el.parentNode.removeChild(el);
        });
        /* eslint-enable */
        if (rootEle) {
            this.element.removeChild(rootEle);
        }
        this.setProperties({ items: items }, true);
    }
    toggleIconGenerate() {
        const tglIcon = this.createElement('div', { className: CLS_TOOGLEICN });
        const hdrColIcon = this.createElement('span', { className: CLS_COLLAPSEICN });
        tglIcon.appendChild(hdrColIcon);
        return tglIcon;
    }
    initItemExpand() {
        const len = this.initExpand.length;
        if (len === 0) {
            return;
        }
        if (this.expandMode === 'Single') {
            this.expandItem(true, this.initExpand[len - 1]);
        }
        else {
            for (let i = 0; i < len; i++) {
                this.expandItem(true, this.initExpand[i]);
            }
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (this.isReact) {
            this.renderReactTemplates();
        }
    }
    renderItems() {
        const ele = this.element;
        let innerItem;
        let innerDataSourceItem;
        if (!isNullOrUndefined(this.trgtEle)) {
            this.ctrlTemplate();
        }
        if (this.dataSource.length > 0) {
            this.dataSource.forEach((item, index) => {
                innerDataSourceItem = this.renderInnerItem(item, index);
                ele.appendChild(innerDataSourceItem);
                if (innerDataSourceItem.childElementCount > 0) {
                    EventHandler.add(innerDataSourceItem.querySelector('.' + CLS_HEADER), 'focus', this.focusIn, this);
                    EventHandler.add(innerDataSourceItem.querySelector('.' + CLS_HEADER), 'blur', this.focusOut, this);
                }
            });
        }
        else {
            const items = this.items;
            if (ele && items.length > 0) {
                items.forEach((item, index) => {
                    innerItem = this.renderInnerItem(item, index);
                    ele.appendChild(innerItem);
                    if (innerItem.childElementCount > 0) {
                        EventHandler.add(innerItem.querySelector('.' + CLS_HEADER), 'focus', this.focusIn, this);
                        EventHandler.add(innerItem.querySelector('.' + CLS_HEADER), 'blur', this.focusOut, this);
                    }
                });
            }
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (this.isReact) {
            this.renderReactTemplates();
        }
    }
    clickHandler(e) {
        const trgt = e.target;
        const items = this.getItems();
        const eventArgs = {};
        let tglIcon;
        const acrdEle = closest(trgt, '.' + CLS_ROOT$2);
        if (acrdEle !== this.element) {
            return;
        }
        trgt.classList.add('e-target');
        const acrdnItem = closest(trgt, '.' + CLS_ITEM$1);
        let acrdnHdr = closest(trgt, '.' + CLS_HEADER);
        let acrdnCtn = closest(trgt, '.' + CLS_CONTENT);
        if (acrdnItem && (isNullOrUndefined(acrdnHdr) || isNullOrUndefined(acrdnCtn))) {
            acrdnHdr = acrdnItem.children[0];
            acrdnCtn = acrdnItem.children[1];
        }
        if (acrdnHdr) {
            tglIcon = select('.' + CLS_TOOGLEICN, acrdnHdr);
        }
        let acrdnCtnItem;
        if (acrdnHdr) {
            acrdnCtnItem = closest(acrdnHdr, '.' + CLS_ITEM$1);
        }
        else if (acrdnCtn) {
            acrdnCtnItem = closest(acrdnCtn, '.' + CLS_ITEM$1);
        }
        const index = this.getIndexByItem(acrdnItem);
        if (acrdnCtnItem) {
            eventArgs.item = items[this.getIndexByItem(acrdnCtnItem)];
        }
        eventArgs.originalEvent = e;
        const ctnCheck = !isNullOrUndefined(tglIcon) && acrdnItem.childElementCount <= 1;
        if (ctnCheck && (isNullOrUndefined(acrdnCtn) || !isNullOrUndefined(select('.' + CLS_HEADER + ' .' + CLS_TOOGLEICN, acrdnCtnItem)))) {
            if (!this.isServerRendered) {
                acrdnItem.appendChild(this.contentRendering(index));
                this.ariaAttrUpdate(acrdnItem);
                this.afterContentRender(trgt, eventArgs, acrdnItem, acrdnHdr, acrdnCtn, acrdnCtnItem);
            }
            else {
                const id = acrdnItem.id;
                if (this.items.length > 0) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    this.interopAdaptor.invokeMethodAsync('OnItemClick', index).then(() => {
                        if (this.isDestroyed) {
                            return;
                        }
                        this.afterContentRender(trgt, eventArgs, acrdnItem, acrdnHdr, acrdnCtn, acrdnCtnItem);
                    });
                }
                else {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    this.interopAdaptor.invokeMethodAsync('OnDataClick', id).then(() => {
                        if (this.isDestroyed) {
                            return;
                        }
                        this.afterContentRender(trgt, eventArgs, acrdnItem, acrdnHdr, acrdnCtn, acrdnCtnItem);
                    });
                }
            }
        }
        else {
            this.afterContentRender(trgt, eventArgs, acrdnItem, acrdnHdr, acrdnCtn, acrdnCtnItem);
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (this.isReact) {
            this.renderReactTemplates();
        }
    }
    afterContentRender(trgt, eventArgs, acrdnItem, acrdnHdr, acrdnCtn, acrdnCtnItem) {
        const acrdActive = [];
        this.trigger('clicked', eventArgs);
        let cntclkCheck = (acrdnCtn && !isNullOrUndefined(select('.e-target', acrdnCtn)));
        const inlineAcrdnSel = '.' + CLS_CONTENT + ' .' + CLS_ROOT$2;
        const inlineEleAcrdn = acrdnCtn && !isNullOrUndefined(select('.' + CLS_ROOT$2, acrdnCtn)) && isNullOrUndefined(closest(trgt, inlineAcrdnSel));
        const nestContCheck = acrdnCtn && isNullOrUndefined(select('.' + CLS_ROOT$2, acrdnCtn)) || !(closest(trgt, '.' + CLS_ROOT$2) === this.element);
        cntclkCheck = cntclkCheck && (inlineEleAcrdn || nestContCheck);
        trgt.classList.remove('e-target');
        if (trgt.classList.contains(CLS_CONTENT) || trgt.classList.contains(CLS_CTENT) || cntclkCheck) {
            return;
        }
        const acrdcontainer = this.element.querySelector('.' + CLS_CONTAINER);
        const acrdnchild = (acrdcontainer) ? acrdcontainer.children : this.element.children;
        [].slice.call(acrdnchild).forEach((el) => {
            if (el.classList.contains(CLS_ACTIVE)) {
                acrdActive.push(el);
            }
        });
        const acrdAniEle = [].slice.call(this.element.querySelectorAll('.' + CLS_ITEM$1 + ' [' + CLS_ANIMATE + ']'));
        if (acrdAniEle.length > 0) {
            for (const el of acrdAniEle) {
                acrdActive.push(el.parentElement);
            }
        }
        const sameContentCheck = acrdActive.indexOf(acrdnCtnItem) !== -1 && acrdnCtn.getAttribute('e-animate') === 'true';
        let sameHeader = false;
        if (!isNullOrUndefined(acrdnItem) && !isNullOrUndefined(acrdnHdr)) {
            const acrdnCtn = select('.' + CLS_CONTENT, acrdnItem);
            const acrdnRoot = closest(acrdnItem, '.' + CLS_ACRDN_ROOT);
            const expandState = acrdnRoot.querySelector('.' + CLS_EXPANDSTATE);
            if (isNullOrUndefined(acrdnCtn)) {
                return;
            }
            sameHeader = (expandState === acrdnItem);
            if (isVisible(acrdnCtn) && (!sameContentCheck || acrdnCtnItem.classList.contains(CLS_SLCTED))) {
                this.collapse(acrdnCtn);
            }
            else {
                if ((acrdActive.length > 0) && this.expandMode === 'Single' && !sameContentCheck) {
                    acrdActive.forEach((el) => {
                        this.collapse(select('.' + CLS_CONTENT, el));
                        el.classList.remove(CLS_EXPANDSTATE);
                    });
                }
                this.expand(acrdnCtn);
            }
            if (!isNullOrUndefined(expandState) && !sameHeader) {
                expandState.classList.remove(CLS_EXPANDSTATE);
            }
        }
    }
    eleMoveFocus(action, root, trgt) {
        let clst;
        let clstItem = closest(trgt, '.' + CLS_ITEM$1);
        if (trgt === root) {
            clst = ((action === 'moveUp' ? trgt.lastElementChild : trgt).querySelector('.' + CLS_HEADER));
        }
        else if (trgt.classList.contains(CLS_HEADER)) {
            clstItem = (action === 'moveUp' ? clstItem.previousElementSibling : clstItem.nextElementSibling);
            if (clstItem) {
                clst = select('.' + CLS_HEADER, clstItem);
            }
        }
        if (clst) {
            clst.focus();
        }
    }
    keyActionHandler(e) {
        const trgt = e.target;
        const header = closest(e.target, CLS_HEADER);
        if (isNullOrUndefined(header) && !trgt.classList.contains(CLS_ROOT$2) && !trgt.classList.contains(CLS_HEADER)) {
            return;
        }
        let clst;
        const root = this.element;
        let content;
        switch (e.action) {
            case 'moveUp':
                this.eleMoveFocus(e.action, root, trgt);
                break;
            case 'moveDown':
                this.eleMoveFocus(e.action, root, trgt);
                break;
            case 'space':
            case 'enter':
                content = trgt.nextElementSibling;
                if (!isNullOrUndefined(content) && content.classList.contains(CLS_CONTENT)) {
                    if (content.getAttribute('e-animate') !== 'true') {
                        trgt.click();
                    }
                }
                else {
                    trgt.click();
                }
                break;
            case 'home':
            case 'end':
                clst = e.action === 'home' ? root.firstElementChild.children[0] : root.lastElementChild.children[0];
                clst.focus();
                break;
        }
    }
    headerEleGenerate() {
        const header = this.createElement('div', { className: CLS_HEADER, id: getUniqueID('acrdn_header') });
        const items = this.getItems();
        const ariaAttr = {
            'tabindex': '0', 'role': 'heading', 'aria-selected': 'false', 'aria-label': 'collapsed',
            'aria-disabled': 'false', 'aria-level': items.length.toString()
        };
        attributes(header, ariaAttr);
        return header;
    }
    renderInnerItem(item, index) {
        const innerEle = this.createElement('div', { className: CLS_ITEM$1 });
        innerEle.id = getUniqueID('acrdn_item');
        if (isNullOrUndefined(item.id)) {
            item.id = innerEle.id;
        }
        attributes(innerEle, { 'aria-expanded': 'false' });
        if (this.headerTemplate) {
            const ctnEle = this.headerEleGenerate();
            const hdrEle = this.createElement('div', { className: CLS_HEADERCTN });
            ctnEle.appendChild(hdrEle);
            append(this.getheaderTemplate()(item, this, 'headerTemplate', this.element.id + '_headerTemplate', false), hdrEle);
            innerEle.appendChild(ctnEle);
            ctnEle.appendChild(this.toggleIconGenerate());
            this.add(innerEle, CLS_SLCT);
            return innerEle;
        }
        if (item.header && this.angularnativeCondiCheck(item, 'header')) {
            if (this.enableHtmlSanitizer && typeof (item.header) === 'string') {
                item.header = SanitizeHtmlHelper.sanitize(item.header);
            }
            const ctnEle = this.headerEleGenerate();
            const hdrEle = this.createElement('div', { className: CLS_HEADERCTN });
            ctnEle.appendChild(hdrEle);
            ctnEle.appendChild(this.fetchElement(hdrEle, item.header, index, true));
            innerEle.appendChild(ctnEle);
        }
        let hdr = select('.' + CLS_HEADER, innerEle);
        if (item.expanded && !isNullOrUndefined(index) && (!this.enablePersistence)) {
            if (this.initExpand.indexOf(index) === -1) {
                this.initExpand.push(index);
            }
        }
        if (item.cssClass) {
            addClass([innerEle], item.cssClass.split(' '));
        }
        if (item.disabled) {
            addClass([innerEle], CLS_DISABLE$3);
        }
        if (item.visible === false) {
            addClass([innerEle], CLS_ITEMHIDE);
        }
        if (item.iconCss) {
            const hdrIcnEle = this.createElement('div', { className: CLS_HEADERICN });
            const icon = this.createElement('span', { className: item.iconCss + ' e-icons' });
            hdrIcnEle.appendChild(icon);
            if (isNullOrUndefined(hdr)) {
                hdr = this.headerEleGenerate();
                hdr.appendChild(hdrIcnEle);
                innerEle.appendChild(hdr);
            }
            else {
                hdr.insertBefore(hdrIcnEle, hdr.childNodes[0]);
            }
        }
        if (item.content && this.angularnativeCondiCheck(item, 'content')) {
            const hdrIcon = this.toggleIconGenerate();
            if (isNullOrUndefined(hdr)) {
                hdr = this.headerEleGenerate();
                innerEle.appendChild(hdr);
            }
            hdr.appendChild(hdrIcon);
            this.add(innerEle, CLS_SLCT);
        }
        return innerEle;
    }
    angularnativeCondiCheck(item, prop) {
        const property = prop === 'content' ? item.content : item.header;
        const content = property;
        if (this.isAngular && !isNullOrUndefined(content.elementRef)) {
            const data = content.elementRef.nativeElement.data;
            if (isNullOrUndefined(data) || data === '' || (data.indexOf('bindings=') === -1)) {
                return true;
            }
            const parseddata = JSON.parse(content.elementRef.nativeElement.data.replace('bindings=', ''));
            if (!isNullOrUndefined(parseddata) && parseddata['ng-reflect-ng-if'] === 'false') {
                return false;
            }
            else {
                return true;
            }
        }
        else {
            return true;
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    fetchElement(ele, value, index, isHeader) {
        /* eslint-disable */
        let templateFn;
        let temString;
        try {
            if (document.querySelectorAll(value).length && value !== 'Button') {
                const eleVal = document.querySelector(value);
                temString = eleVal.outerHTML.trim();
                ele.appendChild(eleVal);
                eleVal.style.display = '';
            }
        }
        catch (e) {
            if (typeof (value) === 'string') {
                ele.innerHTML = SanitizeHtmlHelper.sanitize(value);
                /* eslint-disable */
            }
            else if (!isNullOrUndefined(this.trgtEle) && (value instanceof (HTMLElement))) {
                ele.appendChild(value);
                ele.firstElementChild.style.display = '';
                /* eslint-enable */
            }
            else {
                templateFn = compile(value);
            }
        }
        let tempArray;
        if (!isNullOrUndefined(templateFn)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if (this.isReact) {
                this.renderReactTemplates();
            }
            let templateProps;
            let templateName;
            if (ele.classList.contains(CLS_HEADERCTN)) {
                templateProps = this.element.id + index + '_header';
                templateName = 'header';
            }
            else if (ele.classList.contains(CLS_CTENT)) {
                templateProps = this.element.id + index + '_content';
                templateName = 'content';
            }
            tempArray = templateFn({}, this, templateName, templateProps, this.isStringTemplate);
        }
        if (!isNullOrUndefined(tempArray) && tempArray.length > 0 && !(isNullOrUndefined(tempArray[0].tagName) && tempArray.length === 1)) {
            [].slice.call(tempArray).forEach((el) => {
                if (!isNullOrUndefined(el.tagName)) {
                    el.style.display = '';
                }
                ele.appendChild(el);
            });
        }
        else if (ele.childElementCount === 0) {
            ele.innerHTML = SanitizeHtmlHelper.sanitize(value);
        }
        if (!isNullOrUndefined(temString)) {
            if (this.templateEle.indexOf(value) === -1) {
                this.templateEle.push(value);
            }
        }
        return ele;
    }
    ariaAttrUpdate(itemEle) {
        const header = select('.' + CLS_HEADER, itemEle);
        const content = select('.' + CLS_CONTENT, itemEle);
        header.setAttribute('aria-controls', content.id);
        content.setAttribute('aria-labelledby', header.id);
        content.setAttribute('role', 'definition');
    }
    contentRendering(index) {
        const itemcnt = this.createElement('div', { className: CLS_CONTENT + ' ' + CLS_CTNHIDE, id: getUniqueID('acrdn_panel') });
        attributes(itemcnt, { 'aria-hidden': 'true' });
        const ctn = this.createElement('div', { className: CLS_CTENT });
        if (this.dataSource.length > 0) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if (this.isReact) {
                this.renderReactTemplates();
            }
            append(this.getItemTemplate()(this.dataSource[index], this, 'itemTemplate', this.element.id + '_itemTemplate', false), ctn);
            itemcnt.appendChild(ctn);
        }
        else {
            if (this.enableHtmlSanitizer && typeof (this.items[index].content)) {
                this.items[index].content = SanitizeHtmlHelper.sanitize(this.items[index].content);
            }
            itemcnt.appendChild(this.fetchElement(ctn, this.items[index].content, index, false));
        }
        return itemcnt;
    }
    expand(trgt) {
        const items = this.getItems();
        const trgtItemEle = closest(trgt, '.' + CLS_ITEM$1);
        if (isNullOrUndefined(trgt) || (isVisible(trgt) && trgt.getAttribute('e-animate') !== 'true') || trgtItemEle.classList.contains(CLS_DISABLE$3)) {
            return;
        }
        const acrdnRoot = closest(trgtItemEle, '.' + CLS_ACRDN_ROOT);
        const expandState = acrdnRoot.querySelector('.' + CLS_EXPANDSTATE);
        const animation = {
            name: this.animation.expand.effect,
            duration: this.animation.expand.duration,
            timingFunction: this.animation.expand.easing
        };
        const icon = select('.' + CLS_TOOGLEICN, trgtItemEle).firstElementChild;
        const eventArgs = {
            element: trgtItemEle,
            item: items[this.getIndexByItem(trgtItemEle)],
            index: this.getIndexByItem(trgtItemEle),
            content: trgtItemEle.querySelector('.' + CLS_CONTENT),
            isExpanded: true
        };
        this.trigger('expanding', eventArgs, (expandArgs) => {
            if (!expandArgs.cancel) {
                icon.classList.add(CLS_TOGANIMATE);
                this.expandedItemsPush(trgtItemEle);
                if (!isNullOrUndefined(expandState)) {
                    expandState.classList.remove(CLS_EXPANDSTATE);
                }
                trgtItemEle.classList.add(CLS_EXPANDSTATE);
                if ((animation.name === 'None')) {
                    this.expandProgress('begin', icon, trgt, trgtItemEle, expandArgs);
                    this.expandProgress('end', icon, trgt, trgtItemEle, expandArgs);
                }
                else {
                    this.expandAnimation(animation.name, icon, trgt, trgtItemEle, animation, expandArgs);
                }
            }
        });
    }
    expandAnimation(ef, icn, trgt, trgtItemEle, animate, args) {
        let height;
        this.lastActiveItemId = trgtItemEle.id;
        if (ef === 'SlideDown') {
            animate.begin = () => {
                this.expandProgress('begin', icn, trgt, trgtItemEle, args);
                trgt.style.position = 'absolute';
                height = trgtItemEle.offsetHeight;
                trgt.style.maxHeight = (trgt.offsetHeight) + 'px';
                trgtItemEle.style.maxHeight = '';
            };
            animate.progress = () => {
                trgtItemEle.style.minHeight = (height + trgt.offsetHeight) + 'px';
            };
            animate.end = () => {
                setStyleAttribute(trgt, { 'position': '', 'maxHeight': '' });
                trgtItemEle.style.minHeight = '';
                this.expandProgress('end', icn, trgt, trgtItemEle, args);
            };
        }
        else {
            animate.begin = () => {
                this.expandProgress('begin', icn, trgt, trgtItemEle, args);
            };
            animate.end = () => {
                this.expandProgress('end', icn, trgt, trgtItemEle, args);
            };
        }
        new Animation(animate).animate(trgt);
    }
    expandProgress(progress, icon, trgt, trgtItemEle, eventArgs) {
        this.remove(trgt, CLS_CTNHIDE);
        this.add(trgtItemEle, CLS_SLCTED);
        this.add(icon, CLS_EXPANDICN);
        if (progress === 'end') {
            this.add(trgtItemEle, CLS_ACTIVE);
            trgt.setAttribute('aria-hidden', 'false');
            attributes(trgtItemEle, { 'aria-expanded': 'true' });
            attributes(trgt.previousElementSibling, { 'aria-selected': 'true', 'aria-label': 'expanded' });
            icon.classList.remove(CLS_TOGANIMATE);
            this.trigger('expanded', eventArgs);
        }
    }
    expandedItemsPush(item) {
        const index = this.getIndexByItem(item);
        if (this.expandedIndices.indexOf(index) === -1) {
            const temp = [].slice.call(this.expandedIndices);
            temp.push(index);
            this.setProperties({ expandedIndices: temp }, true);
        }
    }
    getIndexByItem(item) {
        const itemEle = this.getItemElements();
        return [].slice.call(itemEle).indexOf(item);
    }
    getItemElements() {
        const itemEle = [];
        const itemCollection = this.element.children;
        [].slice.call(itemCollection).forEach((el) => {
            if (el.classList.contains(CLS_ITEM$1)) {
                itemEle.push(el);
            }
        });
        return itemEle;
    }
    expandedItemsPop(item) {
        const index = this.getIndexByItem(item);
        const temp = [].slice.call(this.expandedIndices);
        temp.splice(temp.indexOf(index), 1);
        this.setProperties({ expandedIndices: temp }, true);
    }
    collapse(trgt) {
        const items = this.getItems();
        const trgtItemEle = closest(trgt, '.' + CLS_ITEM$1);
        if (isNullOrUndefined(trgt) || !isVisible(trgt) || trgtItemEle.classList.contains(CLS_DISABLE$3)) {
            return;
        }
        const animation = {
            name: this.animation.collapse.effect,
            duration: this.animation.collapse.duration,
            timingFunction: this.animation.collapse.easing
        };
        const icon = select('.' + CLS_TOOGLEICN, trgtItemEle).firstElementChild;
        const eventArgs = {
            element: trgtItemEle,
            item: items[this.getIndexByItem(trgtItemEle)],
            index: this.getIndexByItem(trgtItemEle),
            content: trgtItemEle.querySelector('.' + CLS_CONTENT),
            isExpanded: false
        };
        this.trigger('expanding', eventArgs, (expandArgs) => {
            if (!expandArgs.cancel) {
                this.expandedItemsPop(trgtItemEle);
                trgtItemEle.classList.add(CLS_EXPANDSTATE);
                icon.classList.add(CLS_TOGANIMATE);
                if ((animation.name === 'None')) {
                    this.collapseProgress('begin', icon, trgt, trgtItemEle, expandArgs);
                    this.collapseProgress('end', icon, trgt, trgtItemEle, expandArgs);
                }
                else {
                    this.collapseAnimation(animation.name, trgt, trgtItemEle, icon, animation, expandArgs);
                }
            }
        });
    }
    collapseAnimation(ef, trgt, trgtItEl, icn, animate, args) {
        let height;
        let trgtHeight;
        let itemHeight;
        let remain;
        this.lastActiveItemId = trgtItEl.id;
        if (ef === 'SlideUp') {
            animate.begin = () => {
                itemHeight = trgtItEl.offsetHeight;
                trgtItEl.style.minHeight = itemHeight + 'px';
                trgt.style.position = 'absolute';
                height = trgtItEl.offsetHeight;
                trgtHeight = trgt.offsetHeight;
                trgt.style.maxHeight = trgtHeight + 'px';
                this.collapseProgress('begin', icn, trgt, trgtItEl, args);
            };
            animate.progress = () => {
                remain = ((height - (trgtHeight - trgt.offsetHeight)));
                if (remain < itemHeight) {
                    trgtItEl.style.minHeight = remain + 'px';
                }
            };
            animate.end = () => {
                trgt.style.display = 'none';
                this.collapseProgress('end', icn, trgt, trgtItEl, args);
                trgtItEl.style.minHeight = '';
                setStyleAttribute(trgt, { 'position': '', 'maxHeight': '', 'display': '' });
            };
        }
        else {
            animate.begin = () => {
                this.collapseProgress('begin', icn, trgt, trgtItEl, args);
            };
            animate.end = () => {
                this.collapseProgress('end', icn, trgt, trgtItEl, args);
            };
        }
        new Animation(animate).animate(trgt);
    }
    collapseProgress(progress, icon, trgt, trgtItemEle, eventArgs) {
        this.remove(icon, CLS_EXPANDICN);
        this.remove(trgtItemEle, CLS_SLCTED);
        if (progress === 'end') {
            this.add(trgt, CLS_CTNHIDE);
            icon.classList.remove(CLS_TOGANIMATE);
            this.remove(trgtItemEle, CLS_ACTIVE);
            trgt.setAttribute('aria-hidden', 'true');
            attributes(trgtItemEle, { 'aria-expanded': 'false' });
            attributes(trgt.previousElementSibling, { 'aria-selected': 'false', 'aria-label': 'collapsed' });
            this.trigger('expanded', eventArgs);
        }
    }
    /**
     * Returns the current module name.
     *
     * @returns {string} - It returns the current module name.
     * @private
     */
    getModuleName() {
        return 'accordion';
    }
    itemAttribUpdate() {
        const items = this.getItems();
        const itemEle = this.getItemElements();
        const itemLen = items.length;
        itemEle.forEach((ele) => {
            select('.' + CLS_HEADER, ele).setAttribute('aria-level', '' + itemLen);
        });
    }
    getItems() {
        let items;
        if (this.itemTemplate && this.headerTemplate) {
            items = this.dataSource;
        }
        else {
            items = this.items;
        }
        return items;
    }
    /**
     * Adds new item to the Accordion with the specified index of the Accordion.
     *
     * @param  {AccordionItemModel | AccordionItemModel[] | Object | Object[]} item - Item array that is to be added to the Accordion.
     * @param  {number} index - Number value that determines where the item should be added.
     * By default, item is added at the last index if the index is not specified.
     * @returns {void}
     */
    addItem(item, index) {
        const ele = this.element;
        const itemEle = this.getItemElements();
        const items = this.getItems();
        if (isNullOrUndefined(index)) {
            index = items.length;
        }
        if (ele.childElementCount >= index) {
            const addItems = (item instanceof Array) ? item : [item];
            addItems.forEach((addItem, i) => {
                const itemIndex = index + i;
                items.splice(itemIndex, 0, addItem);
                const innerItemEle = this.renderInnerItem(addItem, itemIndex);
                if (ele.childElementCount === itemIndex) {
                    ele.appendChild(innerItemEle);
                }
                else {
                    ele.insertBefore(innerItemEle, itemEle[itemIndex]);
                }
                EventHandler.add(innerItemEle.querySelector('.' + CLS_HEADER), 'focus', this.focusIn, this);
                EventHandler.add(innerItemEle.querySelector('.' + CLS_HEADER), 'blur', this.focusOut, this);
                this.itemAttribUpdate();
                this.expandedIndices = [];
                this.expandedItemRefresh(ele);
                if (addItem && addItem.expanded) {
                    this.expandItem(true, itemIndex);
                }
            });
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (this.isReact) {
            this.renderReactTemplates();
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    expandedItemRefresh(ele) {
        const itemEle = this.getItemElements();
        [].slice.call(itemEle).forEach((el) => {
            if (el.classList.contains(CLS_SLCTED)) {
                this.expandedItemsPush(el);
            }
        });
    }
    /**
     * Dynamically removes item from Accordion.
     *
     * @param  {number} index - Number value that determines which item should be removed.
     * @returns {void}.
     */
    removeItem(index) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (this.isReact) {
            this.clearTemplate(['headerTemplate', 'itemTemplate'], index);
        }
        const itemEle = this.getItemElements();
        const ele = itemEle[index];
        const items = this.getItems();
        if (isNullOrUndefined(ele)) {
            return;
        }
        this.restoreContent(index);
        detach(ele);
        items.splice(index, 1);
        this.itemAttribUpdate();
        this.expandedIndices = [];
        this.expandedItemRefresh(this.element);
    }
    /**
     * Sets focus to the specified index item header in Accordion.
     *
     * @param  {number} index - Number value that determines which item should be focused.
     * @returns {void}.
     */
    select(index) {
        const itemEle = this.getItemElements();
        const ele = itemEle[index];
        if (isNullOrUndefined(ele) || isNullOrUndefined(select('.' + CLS_HEADER, ele))) {
            return;
        }
        ele.children[0].focus();
    }
    /**
     * Shows or hides the specified item from Accordion.
     *
     * @param  {number} index - Number value that determines which item should be hidden/shown.
     * @param  {boolean} isHidden - Boolean value that determines the action either hide (true) or show (false). Default value is false.
     * If the `isHidden` value is false, the item is shown or else item it is hidden.
     * @returns {void}.
     */
    hideItem(index, isHidden) {
        const itemEle = this.getItemElements();
        const ele = itemEle[index];
        if (isNullOrUndefined(ele)) {
            return;
        }
        if (isNullOrUndefined(isHidden)) {
            isHidden = true;
        }
        if (isHidden) {
            this.add(ele, CLS_ITEMHIDE);
        }
        else {
            this.remove(ele, CLS_ITEMHIDE);
        }
    }
    /**
     * Enables/Disables the specified Accordion item.
     *
     * @param  {number} index - Number value that determines which item should be enabled/disabled.
     * @param  {boolean} isEnable - Boolean value that determines the action as enable (true) or disable (false).
     * If the `isEnable` value is true, the item is enabled or else it is disabled.
     * @returns {void}.
     */
    enableItem(index, isEnable) {
        const itemEle = this.getItemElements();
        const ele = itemEle[index];
        if (isNullOrUndefined(ele)) {
            return;
        }
        const eleHeader = ele.firstElementChild;
        if (isEnable) {
            this.remove(ele, CLS_DISABLE$3);
            attributes(eleHeader, { 'tabindex': '0', 'aria-disabled': 'false' });
            eleHeader.focus();
        }
        else {
            if (ele.classList.contains(CLS_ACTIVE)) {
                this.expandItem(false, index);
                this.eleMoveFocus('movedown', this.element, eleHeader);
            }
            this.add(ele, CLS_DISABLE$3);
            eleHeader.setAttribute('aria-disabled', 'true');
            eleHeader.removeAttribute('tabindex');
        }
    }
    /**
     * Refresh the Accordion component.
     *
     * @returns {void}.
     */
    refresh() {
        if (!this.isServerRendered) {
            super.refresh();
        }
    }
    /**
     * Expands/Collapses the specified Accordion item.
     *
     * @param  {boolean} isExpand - Boolean value that determines the action as expand or collapse.
     * @param  {number} index - Number value that determines which item should be expanded/collapsed.`index` is optional parameter.
     * Without Specifying index, based on the `isExpand` value all Accordion item can be expanded or collapsed.
     * @returns {void}.
     */
    expandItem(isExpand, index) {
        const itemEle = this.getItemElements();
        if (isNullOrUndefined(index)) {
            if (this.expandMode === 'Single' && isExpand) {
                const ele = itemEle[itemEle.length - 1];
                this.itemExpand(isExpand, ele, this.getIndexByItem(ele));
            }
            else {
                const item = select('#' + this.lastActiveItemId, this.element);
                [].slice.call(itemEle).forEach((el) => {
                    this.itemExpand(isExpand, el, this.getIndexByItem(el));
                    el.classList.remove(CLS_EXPANDSTATE);
                });
                const expandedItem = select('.' + CLS_EXPANDSTATE, this.element);
                if (expandedItem) {
                    expandedItem.classList.remove(CLS_EXPANDSTATE);
                }
                if (item) {
                    item.classList.add(CLS_EXPANDSTATE);
                }
            }
        }
        else {
            const ele = itemEle[index];
            if (isNullOrUndefined(ele) || !ele.classList.contains(CLS_SLCT) || (ele.classList.contains(CLS_ACTIVE) && isExpand)) {
                return;
            }
            else {
                if (this.expandMode === 'Single') {
                    this.expandItem(false);
                }
                this.itemExpand(isExpand, ele, index);
            }
        }
    }
    itemExpand(isExpand, ele, index) {
        let ctn = ele.children[1];
        if (ele.classList.contains(CLS_DISABLE$3)) {
            return;
        }
        if (isNullOrUndefined(ctn) && isExpand) {
            if (!this.isServerRendered) {
                ctn = this.contentRendering(index);
                ele.appendChild(ctn);
                this.ariaAttrUpdate(ele);
                this.expand(ctn);
            }
            else {
                const id = ele.id;
                if (this.items.length > 0) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    this.interopAdaptor.invokeMethodAsync('OnItemClick', index).then(() => {
                        if (this.isDestroyed) {
                            return;
                        }
                        ctn = ele.children[1];
                        this.expand(ctn);
                    });
                }
                else {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    this.interopAdaptor.invokeMethodAsync('OnDataClick', id).then(() => {
                        if (this.isDestroyed) {
                            return;
                        }
                        ctn = ele.children[1];
                        this.expand(ctn);
                    });
                }
            }
        }
        else if (!isNullOrUndefined(ctn)) {
            if (isExpand) {
                this.expand(ctn);
            }
            else {
                this.collapse(ctn);
            }
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (this.isReact) {
            this.renderReactTemplates();
        }
    }
    destroyItems() {
        this.restoreContent(null);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (this.isReact) {
            this.clearTemplate();
        }
        [].slice.call(this.element.querySelectorAll('.' + CLS_ITEM$1)).forEach((el) => {
            detach(el);
        });
    }
    restoreContent(index) {
        let ctnElePos;
        if (isNullOrUndefined(index)) {
            ctnElePos = this.element;
        }
        else {
            ctnElePos = this.element.querySelectorAll('.' + CLS_ITEM$1)[index];
        }
        this.templateEle.forEach((eleStr) => {
            if (!isNullOrUndefined(ctnElePos.querySelector(eleStr))) {
                document.body.appendChild(ctnElePos.querySelector(eleStr)).style.display = 'none';
            }
        });
    }
    updateItem(item, index) {
        if (!isNullOrUndefined(item)) {
            const items = this.getItems();
            const itemObj = items[index];
            items.splice(index, 1);
            this.restoreContent(index);
            detach(item);
            this.addItem(itemObj, index);
        }
    }
    setTemplate(template, toElement, index) {
        toElement.innerHTML = '';
        this.templateCompile(toElement, template, index);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (this.isReact) {
            this.renderReactTemplates();
        }
    }
    // eslint-disable-next-line
    templateCompile(ele, cnt, index) {
        const tempEle = this.createElement('div');
        this.fetchElement(tempEle, cnt, index, false);
        if (tempEle.childNodes.length !== 0) {
            [].slice.call(tempEle.childNodes).forEach((childEle) => {
                ele.appendChild(childEle);
            });
        }
    }
    getPersistData() {
        const keyEntity = ['expandedIndices'];
        return this.addOnPersist(keyEntity);
    }
    /**
     * Gets called when the model property changes.The data that describes the old and new values of the property that changed.
     *
     * @param  {AccordionModel} newProp - It contains the new value of data.
     * @param  {AccordionModel} oldProp - It contains the old value of data.
     * @returns {void}
     * @private
     */
    onPropertyChanged(newProp, oldProp) {
        const acrdn = this.element;
        let isRefresh = false;
        for (const prop of Object.keys(newProp)) {
            switch (prop) {
                case 'items':
                    if (this.isServerRendered) {
                        this.wireFocusEvents();
                        break;
                    }
                    if (!(newProp.items instanceof Array && oldProp.items instanceof Array)) {
                        const changedProp = Object.keys(newProp.items);
                        for (let j = 0; j < changedProp.length; j++) {
                            const index = parseInt(Object.keys(newProp.items)[j], 10);
                            const property = Object.keys(newProp.items[index])[0];
                            const item = selectAll('.' + CLS_ITEM$1, this.element)[index];
                            const oldVal = Object(oldProp.items[index])[property];
                            const newVal = Object(newProp.items[index])[property];
                            const temp = property;
                            if (temp === 'header' || temp === 'iconCss' || temp === 'expanded' || ((temp === 'content') && (oldVal === ''))) {
                                this.updateItem(item, index);
                            }
                            if (property === 'cssClass' && !isNullOrUndefined(item)) {
                                item.classList.remove(oldVal);
                                item.classList.add(newVal);
                            }
                            if (property === 'visible' && !isNullOrUndefined(item)) {
                                if (Object(newProp.items[index])[property] === false) {
                                    item.classList.add(CLS_ITEMHIDE);
                                }
                                else {
                                    item.classList.remove(CLS_ITEMHIDE);
                                }
                            }
                            if (property === 'disabled' && !isNullOrUndefined(item)) {
                                this.enableItem(index, !newVal);
                            }
                            if (property === 'content' && !isNullOrUndefined(item) && item.children.length === 2) {
                                if (typeof newVal === 'function') {
                                    const activeContent = item.querySelector('.' + CLS_CTENT);
                                    activeContent.innerHTML = '';
                                    this.setTemplate(newVal, activeContent, index);
                                }
                                else {
                                    if (item.classList.contains(CLS_SLCTED)) {
                                        this.expandItem(false, index);
                                    }
                                    detach(item.querySelector('.' + CLS_CONTENT));
                                }
                            }
                        }
                    }
                    else {
                        isRefresh = true;
                    }
                    break;
                case 'dataSource':
                case 'expandedIndices':
                    if (this.expandedIndices === null) {
                        this.expandedIndices = [];
                    }
                    isRefresh = true;
                    break;
                case 'headerTemplate':
                    this.initializeheaderTemplate();
                    isRefresh = true;
                    break;
                case 'itemTemplate':
                    this.initializeItemTemplate();
                    isRefresh = true;
                    break;
                case 'enableRtl':
                    if (newProp.enableRtl) {
                        this.add(acrdn, CLS_RTL$3);
                    }
                    else {
                        this.remove(acrdn, CLS_RTL$3);
                    }
                    break;
                case 'height':
                    setStyleAttribute(this.element, { 'height': formatUnit(newProp.height) });
                    break;
                case 'width':
                    setStyleAttribute(this.element, { 'width': formatUnit(newProp.width) });
                    break;
                case 'expandMode':
                    if (newProp.expandMode === 'Single') {
                        this.element.setAttribute('aria-multiselectable', 'false');
                        if (this.expandedIndices.length > 1) {
                            this.expandItem(false);
                        }
                    }
                    else {
                        this.element.setAttribute('aria-multiselectable', 'true');
                    }
                    break;
            }
        }
        if (isRefresh && !this.isServerRendered) {
            this.initExpand = [];
            if (this.expandedIndices.length > 0) {
                this.initExpand = this.expandedIndices;
            }
            this.destroyItems();
            this.renderItems();
            this.initItemExpand();
        }
    }
};
__decorate$4([
    Collection([], AccordionItem)
], Accordion.prototype, "items", void 0);
__decorate$4([
    Property([])
], Accordion.prototype, "dataSource", void 0);
__decorate$4([
    Property()
], Accordion.prototype, "itemTemplate", void 0);
__decorate$4([
    Property()
], Accordion.prototype, "headerTemplate", void 0);
__decorate$4([
    Property('100%')
], Accordion.prototype, "width", void 0);
__decorate$4([
    Property('auto')
], Accordion.prototype, "height", void 0);
__decorate$4([
    Property([])
], Accordion.prototype, "expandedIndices", void 0);
__decorate$4([
    Property('Multiple')
], Accordion.prototype, "expandMode", void 0);
__decorate$4([
    Property(false)
], Accordion.prototype, "enableHtmlSanitizer", void 0);
__decorate$4([
    Complex({}, AccordionAnimationSettings)
], Accordion.prototype, "animation", void 0);
__decorate$4([
    Event()
], Accordion.prototype, "clicked", void 0);
__decorate$4([
    Event()
], Accordion.prototype, "expanding", void 0);
__decorate$4([
    Event()
], Accordion.prototype, "expanded", void 0);
__decorate$4([
    Event()
], Accordion.prototype, "created", void 0);
__decorate$4([
    Event()
], Accordion.prototype, "destroyed", void 0);
Accordion = __decorate$4([
    NotifyPropertyChanges
], Accordion);

/**
 * Accordion all modules
 */

var __decorate$5 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path='../common/menu-base-model.d.ts'/>
/**
 * The ContextMenu is a graphical user interface that appears on the user right click/touch hold operation.
 * ```html
 * <div id = 'target'></div>
 * <ul id = 'contextmenu'></ul>
 * ```
 * ```typescript
 * <script>
 * var contextMenuObj = new ContextMenu({items: [{ text: 'Cut' }, { text: 'Copy' },{ text: 'Paste' }], target: '#target'});
 * </script>
 * ```
 */
let ContextMenu = class ContextMenu extends MenuBase {
    /**
     * Constructor for creating the widget.
     *
     * @private
     * @param {ContextMenuModel} options - Specifies the context menu model
     * @param {string} element - Specifies the element
     */
    constructor(options, element) {
        super(options, element);
    }
    /**
     * For internal use only - prerender processing.
     *
     * @private
     * @returns {void}
     */
    preRender() {
        this.isMenu = false;
        this.element.id = this.element.id || getUniqueID('ej2-contextmenu');
        super.preRender();
    }
    initialize() {
        super.initialize();
        attributes(this.element, { 'role': 'context menu', 'tabindex': '0' });
        this.element.style.zIndex = getZindexPartial(this.element).toString();
    }
    /**
     * This method is used to open the ContextMenu in specified position.
     *
     * @param {number} top - To specify ContextMenu vertical positioning.
     * @param {number} left - To specify ContextMenu horizontal positioning.
     * @param {HTMLElement} target - To calculate z-index for ContextMenu based upon the specified target.
     * @function open
     * @returns {void}
     */
    open(top, left, target) {
        super.openMenu(null, null, top, left, null, target);
    }
    /**
     * Closes the ContextMenu if it is opened.
     *
     * @function close
     * @returns {void}
     */
    close() {
        super.closeMenu();
    }
    /**
     * Called internally if any of the property value changed.
     *
     * @private
     * @param {ContextMenuModel} newProp - Specifies new properties
     * @param {ContextMenuModel} oldProp - Specifies old properties
     * @returns {void}
     */
    onPropertyChanged(newProp, oldProp) {
        super.onPropertyChanged(newProp, oldProp);
        for (const prop of Object.keys(newProp)) {
            switch (prop) {
                case 'filter':
                    this.close();
                    this.filter = newProp.filter;
                    break;
                case 'target':
                    this.unWireEvents(oldProp.target);
                    this.wireEvents();
                    break;
            }
        }
    }
    /**
     * Get module name.
     *
     * @returns {string} - Module Name
     * @private
     */
    getModuleName() {
        return 'contextmenu';
    }
};
__decorate$5([
    Property('')
], ContextMenu.prototype, "target", void 0);
__decorate$5([
    Property('')
], ContextMenu.prototype, "filter", void 0);
__decorate$5([
    Collection([], MenuItem)
], ContextMenu.prototype, "items", void 0);
ContextMenu = __decorate$5([
    NotifyPropertyChanges
], ContextMenu);

/**
 * ContextMenu modules
 */

var __decorate$6 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path='../common/menu-base-model.d.ts'/>
const VMENU = 'e-vertical';
const SCROLLABLE = 'e-scrollable';
const HAMBURGER = 'e-hamburger';
/**
 * The Menu is a graphical user interface that serve as navigation headers for your application or site.
 * ```html
 * <ul id = 'menu'></ul>
 * ```
 * ```typescript
 * <script>
 * var menuObj = new Menu({ items: [{ text: 'Home' }, { text: 'Contact Us' },{ text: 'Login' }]});
 * menuObj.appendTo("#menu");
 * </script>
 * ```
 */
let Menu = class Menu extends MenuBase {
    /**
     * Constructor for creating the component.
     *
     * @private
     * @param {MenuModel} options - Specifies the menu model
     * @param {string} element - Specifies the element
     */
    constructor(options, element) {
        super(options, element);
        this.tempItems = [];
    }
    /**
     * Get module name.
     *
     * @private
     * @returns {string} - Module Name
     */
    getModuleName() {
        return 'menu';
    }
    /**
     * For internal use only - prerender processing.
     *
     * @private
     * @returns {void}
     */
    preRender() {
        this.isMenu = true;
        this.element.id = this.element.id || getUniqueID('ej2-menu');
        if (this.template) {
            try {
                if (document.querySelectorAll(this.template).length) {
                    this.template = document.querySelector(this.template).innerHTML.trim();
                    this.clearChanges();
                }
            }
            catch (e) {
                /* action on catch */
            }
        }
        else {
            this.updateMenuItems(this.items);
        }
        super.preRender();
    }
    initialize() {
        super.initialize();
        attributes(this.element, { 'role': 'menubar', 'tabindex': '0' });
        if (this.orientation === 'Vertical') {
            this.element.classList.add(VMENU);
            if (this.hamburgerMode && !this.target) {
                this.element.previousElementSibling.classList.add(VMENU);
            }
            this.element.setAttribute('aria-orientation', 'vertical');
        }
        else {
            if (Browser.isDevice && !this.enableScrolling) {
                this.element.parentElement.classList.add(SCROLLABLE);
            }
        }
        if (this.hamburgerMode) {
            this.element.parentElement.classList.add(HAMBURGER);
            if (this.orientation === 'Horizontal') {
                this.element.classList.add('e-hide-menu');
            }
        }
    }
    updateMenuItems(items) {
        this.tempItems = items;
        this.items = [];
        this.tempItems.map(this.createMenuItems, this);
        this.setProperties({ items: this.items }, true);
        this.tempItems = [];
    }
    /**
     * Called internally if any of the property value changed.
     *
     * @private
     * @param {MenuModel} newProp - Specifies the new properties.
     * @param {MenuModel} oldProp - Specifies the old properties.
     * @returns {void}
     */
    onPropertyChanged(newProp, oldProp) {
        for (const prop of Object.keys(newProp)) {
            switch (prop) {
                case 'orientation':
                    if (newProp.orientation === 'Vertical') {
                        this.element.classList.add(VMENU);
                        if (this.hamburgerMode) {
                            if (!this.target) {
                                this.element.previousElementSibling.classList.add(VMENU);
                            }
                            this.element.classList.remove('e-hide-menu');
                        }
                        this.element.setAttribute('aria-orientation', 'vertical');
                    }
                    else {
                        this.element.classList.remove(VMENU);
                        if (this.hamburgerMode) {
                            if (!this.target) {
                                this.element.previousElementSibling.classList.remove(VMENU);
                            }
                            this.element.classList.add('e-hide-menu');
                        }
                        this.element.removeAttribute('aria-orientation');
                    }
                    break;
                case 'items':
                    if (!Object.keys(oldProp.items).length) {
                        this.updateMenuItems(newProp.items);
                    }
                    break;
                case 'hamburgerMode':
                    if (!this.element.previousElementSibling) {
                        super.createHeaderContainer();
                    }
                    if (newProp.hamburgerMode) {
                        this.element.parentElement.classList.add(HAMBURGER);
                        [].slice.call(this.element.getElementsByClassName('e-blankicon')).forEach((li) => {
                            li.style[this.enableRtl ? 'paddingRight' : 'paddingLeft'] = '';
                        });
                    }
                    else {
                        this.element.parentElement.classList.remove(HAMBURGER);
                        if (this.orientation === 'Vertical') {
                            this.setBlankIconStyle(this.element);
                        }
                    }
                    if (this.orientation === 'Vertical') {
                        if (!this.target) {
                            this.element.previousElementSibling.classList.add(VMENU);
                        }
                        this.element.classList.remove('e-hide-menu');
                    }
                    else {
                        if (this.target) {
                            this.element.previousElementSibling.classList.add(VMENU);
                        }
                        else {
                            this.element.previousElementSibling.classList.remove(VMENU);
                        }
                        this.element.classList[newProp.hamburgerMode ? 'add' : 'remove']('e-hide-menu');
                    }
                    break;
                case 'title':
                    if (this.hamburgerMode && this.element.previousElementSibling) {
                        newProp.title = (this.enableHtmlSanitizer) ? SanitizeHtmlHelper.sanitize(newProp.title) : newProp.title;
                        this.element.previousElementSibling.querySelector('.e-menu-title').innerHTML = newProp.title;
                    }
                    break;
                case 'target':
                    if (this.hamburgerMode) {
                        this.unWireEvents(oldProp.target);
                        this.wireEvents();
                        if (this.orientation === 'Horizontal') {
                            if (!newProp.target) {
                                if (!this.element.previousElementSibling) {
                                    super.createHeaderContainer();
                                }
                                this.element.previousElementSibling.classList.remove(VMENU);
                            }
                            else {
                                this.element.previousElementSibling.classList.add(VMENU);
                            }
                            this.element.classList.add('e-hide-menu');
                        }
                    }
                    break;
            }
        }
        super.onPropertyChanged(newProp, oldProp);
    }
    createMenuItems(item) {
        let idx;
        let i;
        let items = this.items;
        const pIdField = this.getField('parentId');
        if (item[pIdField]) {
            idx = this.getIndex(item[pIdField].toString(), true);
            for (i = 0; i < idx.length; i++) {
                if (!items[idx[i]].items) {
                    items[idx[i]].items = [];
                }
                items = items[idx[i]].items;
            }
            items.push(item);
        }
        else {
            this.items.push(item);
        }
    }
    /**
     * This method is used to open the Menu in hamburger mode.
     *
     * @function open
     * @returns {void}
     */
    open() {
        super.openHamburgerMenu();
    }
    /**
     * Closes the Menu if it is opened in hamburger mode.
     *
     * @function close
     * @returns {void}
     */
    close() {
        super.closeHamburgerMenu();
    }
};
__decorate$6([
    Property('Horizontal')
], Menu.prototype, "orientation", void 0);
__decorate$6([
    Property('')
], Menu.prototype, "target", void 0);
__decorate$6([
    Property(null)
], Menu.prototype, "template", void 0);
__decorate$6([
    Property(false)
], Menu.prototype, "enableScrolling", void 0);
__decorate$6([
    Property(false)
], Menu.prototype, "hamburgerMode", void 0);
__decorate$6([
    Property('Menu')
], Menu.prototype, "title", void 0);
__decorate$6([
    Property(false)
], Menu.prototype, "enableHtmlSanitizer", void 0);
__decorate$6([
    Complex({ itemId: 'id', text: 'text', parentId: 'parentId', iconCss: 'iconCss', url: 'url', separator: 'separator', children: 'items' }, FieldSettings)
], Menu.prototype, "fields", void 0);
Menu = __decorate$6([
    NotifyPropertyChanges
], Menu);

/**
 * Menu modules
 */

var __decorate$7 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const CLS_TAB = 'e-tab';
const CLS_HEADER$1 = 'e-tab-header';
const CLS_BLA_TEM = 'blazor-template';
const CLS_CONTENT$1 = 'e-content';
const CLS_NEST$1 = 'e-nested';
const CLS_ITEMS$1 = 'e-items';
const CLS_ITEM$2 = 'e-item';
const CLS_TEMPLATE$1 = 'e-template';
const CLS_RTL$4 = 'e-rtl';
const CLS_ACTIVE$1 = 'e-active';
const CLS_DISABLE$4 = 'e-disable';
const CLS_HIDDEN$1 = 'e-hidden';
const CLS_FOCUS = 'e-focused';
const CLS_ICONS = 'e-icons';
const CLS_ICON = 'e-icon';
const CLS_ICON_TAB = 'e-icon-tab';
const CLS_ICON_CLOSE = 'e-close-icon';
const CLS_CLOSE_SHOW = 'e-close-show';
const CLS_TEXT = 'e-tab-text';
const CLS_INDICATOR = 'e-indicator';
const CLS_WRAP = 'e-tab-wrap';
const CLS_TEXT_WRAP = 'e-text-wrap';
const CLS_TAB_ICON = 'e-tab-icon';
const CLS_TB_ITEMS = 'e-toolbar-items';
const CLS_TB_ITEM = 'e-toolbar-item';
const CLS_TB_POP = 'e-toolbar-pop';
const CLS_TB_POPUP = 'e-toolbar-popup';
const CLS_HOR_NAV = 'e-hor-nav';
const CLS_POPUP_OPEN = 'e-popup-open';
const CLS_POPUP_CLOSE = 'e-popup-close';
const CLS_PROGRESS = 'e-progress';
const CLS_IGNORE = 'e-ignore';
const CLS_OVERLAY$2 = 'e-overlay';
const CLS_HSCRCNT = 'e-hscroll-content';
const CLS_VSCRCNT = 'e-vscroll-content';
const CLS_VTAB = 'e-vertical-tab';
const CLS_VERTICAL$1 = 'e-vertical';
const CLS_VLEFT = 'e-vertical-left';
const CLS_VRIGHT = 'e-vertical-right';
const CLS_HBOTTOM = 'e-horizontal-bottom';
const CLS_FILL = 'e-fill-mode';
const TABITEMPREFIX = 'tabitem_';
/**
 * Objects used for configuring the Tab selecting item action properties.
 */
class TabActionSettings extends ChildProperty {
}
__decorate$7([
    Property('SlideLeftIn')
], TabActionSettings.prototype, "effect", void 0);
__decorate$7([
    Property(600)
], TabActionSettings.prototype, "duration", void 0);
__decorate$7([
    Property('ease')
], TabActionSettings.prototype, "easing", void 0);
/**
 * Objects used for configuring the Tab animation properties.
 */
class TabAnimationSettings extends ChildProperty {
}
__decorate$7([
    Complex({ effect: 'SlideLeftIn', duration: 600, easing: 'ease' }, TabActionSettings)
], TabAnimationSettings.prototype, "previous", void 0);
__decorate$7([
    Complex({ effect: 'SlideRightIn', duration: 600, easing: 'ease' }, TabActionSettings)
], TabAnimationSettings.prototype, "next", void 0);
/**
 * Objects used for configuring the Tab item header properties.
 */
class Header extends ChildProperty {
}
__decorate$7([
    Property('')
], Header.prototype, "text", void 0);
__decorate$7([
    Property('')
], Header.prototype, "iconCss", void 0);
__decorate$7([
    Property('left')
], Header.prototype, "iconPosition", void 0);
/**
 * An array of object that is used to configure the Tab.
 */
class TabItem extends ChildProperty {
}
__decorate$7([
    Complex({}, Header)
], TabItem.prototype, "header", void 0);
__decorate$7([
    Property(null)
], TabItem.prototype, "headerTemplate", void 0);
__decorate$7([
    Property('')
], TabItem.prototype, "content", void 0);
__decorate$7([
    Property('')
], TabItem.prototype, "cssClass", void 0);
__decorate$7([
    Property(false)
], TabItem.prototype, "disabled", void 0);
__decorate$7([
    Property(true)
], TabItem.prototype, "visible", void 0);
__decorate$7([
    Property()
], TabItem.prototype, "id", void 0);
/**
 * Tab is a content panel to show multiple contents in a single space, one at a time.
 * Each Tab item has an associated content, that will be displayed based on the active Tab header item.
 * ```html
 * <div id="tab"></div>
 * <script>
 *   var tabObj = new Tab();
 *   tab.appendTo("#tab");
 * </script>
 * ```
 */
let Tab = class Tab extends Component {
    /**
     * Initializes a new instance of the Tab class.
     *
     * @param {TabModel} options  - Specifies Tab model properties as options.
     * @param {string | HTMLElement} element  - Specifies the element that is rendered as a Tab.
     */
    constructor(options, element) {
        super(options, element);
        this.show = {};
        this.hide = {};
        this.maxHeight = 0;
        this.title = 'Close';
        this.lastIndex = 0;
        this.isAdd = false;
        this.isIconAlone = false;
        this.draggableItems = [];
        this.resizeContext = this.refreshActElePosition.bind(this);
        /**
         * Contains the keyboard configuration of the Tab.
         */
        this.keyConfigs = {
            tab: 'tab',
            home: 'home',
            end: 'end',
            enter: 'enter',
            space: 'space',
            delete: 'delete',
            moveLeft: 'leftarrow',
            moveRight: 'rightarrow',
            moveUp: 'uparrow',
            moveDown: 'downarrow'
        };
    }
    /**
     * Removes the component from the DOM and detaches all its related event handlers, attributes and classes.
     *
     * @returns {void}
     */
    destroy() {
        if (this.isReact) {
            this.clearTemplate();
        }
        if (!isNullOrUndefined(this.tbObj)) {
            this.tbObj.destroy();
        }
        this.unWireEvents();
        ['role', 'aria-disabled', 'aria-activedescendant', 'tabindex', 'aria-orientation'].forEach((val) => {
            this.element.removeAttribute(val);
        });
        this.expTemplateContent();
        if (!this.isTemplate) {
            while (this.element.firstElementChild) {
                remove(this.element.firstElementChild);
            }
        }
        else {
            const cntEle = select('.' + CLS_TAB + ' > .' + CLS_CONTENT$1, this.element);
            this.element.classList.remove(CLS_TEMPLATE$1);
            if (!isNullOrUndefined(cntEle)) {
                cntEle.innerHTML = this.cnt;
            }
        }
        super.destroy();
        this.trigger('destroyed');
    }
    /**
     * Refresh the tab component
     *
     * @returns {void}
     */
    refresh() {
        if (this.isReact) {
            this.clearTemplate();
        }
        if (!this.isServerRendered) {
            super.refresh();
        }
        else if (this.isServerRendered && this.loadOn !== 'Dynamic') {
            this.setActiveBorder();
        }
        if (this.isReact) {
            this.renderReactTemplates();
        }
    }
    /**
     * Initialize component
     *
     * @private
     * @returns {void}
     */
    preRender() {
        const nested = closest(this.element, '.' + CLS_CONTENT$1);
        this.prevIndex = 0;
        this.isNested = false;
        this.isPopup = false;
        this.initRender = true;
        this.isSwipeed = false;
        this.itemIndexArray = [];
        this.templateEle = [];
        if (!isNullOrUndefined(nested)) {
            nested.parentElement.classList.add(CLS_NEST$1);
            this.isNested = true;
        }
        const name = Browser.info.name;
        const css = (name === 'msie') ? 'e-ie' : (name === 'edge') ? 'e-edge' : (name === 'safari') ? 'e-safari' : '';
        setStyleAttribute(this.element, { 'width': formatUnit(this.width), 'height': formatUnit(this.height) });
        this.setCssClass(this.element, this.cssClass, true);
        attributes(this.element, { role: 'tablist', 'aria-disabled': 'false', 'aria-activedescendant': '' });
        this.setCssClass(this.element, css, true);
        this.updatePopAnimationConfig();
    }
    /**
     * Initialize the component rendering
     *
     * @private
     * @returns {void}
     */
    render() {
        this.btnCls = this.createElement('span', { className: CLS_ICONS + ' ' + CLS_ICON_CLOSE, attrs: { title: this.title } });
        this.tabId = this.element.id.length > 0 ? ('-' + this.element.id) : getRandomId();
        this.renderContainer();
        this.wireEvents();
        this.initRender = false;
    }
    renderContainer() {
        if (this.isServerRendered) {
            this.isTemplate = false;
            return;
        }
        const ele = this.element;
        this.items.forEach((item, index) => {
            if (isNullOrUndefined(item.id) && !isNullOrUndefined(item.setProperties)) {
                item.setProperties({ id: TABITEMPREFIX + index.toString() }, true);
            }
        });
        if (this.items.length > 0 && ele.children.length === 0) {
            ele.appendChild(this.createElement('div', { className: CLS_CONTENT$1 }));
            this.setOrientation(this.headerPlacement, this.createElement('div', { className: CLS_HEADER$1 }));
            this.isTemplate = false;
        }
        else if (this.element.children.length > 0) {
            this.isTemplate = true;
            ele.classList.add(CLS_TEMPLATE$1);
            const header = ele.querySelector('.' + CLS_HEADER$1);
            if (header && this.headerPlacement === 'Bottom') {
                this.setOrientation(this.headerPlacement, header);
            }
        }
        if (!isNullOrUndefined(select('.' + CLS_HEADER$1, this.element)) && !isNullOrUndefined(select('.' + CLS_CONTENT$1, this.element))) {
            this.renderHeader();
            this.tbItems = select('.' + CLS_HEADER$1 + ' .' + CLS_TB_ITEMS, this.element);
            if (!isNullOrUndefined(this.tbItems)) {
                rippleEffect(this.tbItems, { selector: '.e-tab-wrap' });
            }
            this.renderContent();
            if (selectAll('.' + CLS_TB_ITEM, this.element).length > 0) {
                this.tbItems = select('.' + CLS_HEADER$1 + ' .' + CLS_TB_ITEMS, this.element);
                this.bdrLine = this.createElement('div', { className: CLS_INDICATOR + ' ' + CLS_HIDDEN$1 + ' ' + CLS_IGNORE });
                const scrCnt = select('.' + this.scrCntClass, this.tbItems);
                if (!isNullOrUndefined(scrCnt)) {
                    scrCnt.insertBefore(this.bdrLine, scrCnt.firstChild);
                }
                else {
                    this.tbItems.insertBefore(this.bdrLine, this.tbItems.firstChild);
                }
                this.setContentHeight(true);
                this.select(this.selectedItem);
            }
            if (!isNullOrUndefined(this.tbItem)) {
                for (let i = 0; i < this.items.length; i++) {
                    const tabID = this.items[i].id;
                    this.tbItem[i].setAttribute('data-id', tabID);
                }
            }
            this.setRTL(this.enableRtl);
        }
    }
    serverItemsChanged() {
        this.enableAnimation = false;
        this.setActive(this.selectedItem, true);
        if (this.loadOn !== 'Dynamic' && !isNullOrUndefined(this.cntEle)) {
            const itemCollection = [].slice.call(this.cntEle.children);
            const content = CLS_CONTENT$1 + this.tabId + '_' + this.selectedItem;
            itemCollection.forEach((item) => {
                if (item.classList.contains(CLS_ACTIVE$1) && item.id !== content) {
                    item.classList.remove(CLS_ACTIVE$1);
                }
                if (item.id === content) {
                    item.classList.add(CLS_ACTIVE$1);
                }
            });
            this.prevIndex = this.selectedItem;
            this.triggerAnimation(CLS_ITEM$2 + this.tabId + '_' + this.selectedItem, false);
        }
        this.enableAnimation = true;
    }
    headerReady() {
        this.initRender = true;
        this.hdrEle = this.getTabHeader();
        this.setOrientation(this.headerPlacement, this.hdrEle);
        if (!isNullOrUndefined(this.hdrEle)) {
            this.tbObj = (this.hdrEle && this.hdrEle.ej2_instances[0]);
        }
        this.tbObj.clicked = this.clickHandler.bind(this);
        this.tbObj.on('onItemsChanged', this.serverItemsChanged.bind(this));
        this.tbItems = select('.' + CLS_HEADER$1 + ' .' + CLS_TB_ITEMS, this.element);
        if (!isNullOrUndefined(this.tbItems)) {
            rippleEffect(this.tbItems, { selector: '.e-tab-wrap' });
        }
        if (selectAll('.' + CLS_TB_ITEM, this.element).length > 0) {
            this.bdrLine = select('.' + CLS_INDICATOR + '.' + CLS_IGNORE, this.element);
            const scrollCnt = select('.' + this.scrCntClass, this.tbItems);
            if (!isNullOrUndefined(scrollCnt)) {
                scrollCnt.insertBefore(this.bdrLine, scrollCnt.firstElementChild);
            }
            else {
                this.tbItems.insertBefore(this.bdrLine, this.tbItems.firstElementChild);
            }
            this.select(this.selectedItem);
        }
        this.cntEle = select('.' + CLS_TAB + ' > .' + CLS_CONTENT$1, this.element);
        if (!isNullOrUndefined(this.cntEle)) {
            this.touchModule = new Touch(this.cntEle, { swipe: this.swipeHandler.bind(this) });
        }
        if (this.loadOn === 'Demand') {
            const id = this.setActiveContent();
            this.triggerAnimation(id, false);
        }
        this.initRender = false;
        this.renderComplete();
    }
    setActiveContent() {
        const id = CLS_ITEM$2 + this.tabId + '_' + this.selectedItem;
        const item = this.getTrgContent(this.cntEle, this.extIndex(id));
        if (!isNullOrUndefined(item)) {
            item.classList.add(CLS_ACTIVE$1);
        }
        return id;
    }
    renderHeader() {
        const hdrPlace = this.headerPlacement;
        let tabItems = [];
        this.hdrEle = this.getTabHeader();
        this.addVerticalClass();
        if (!this.isTemplate) {
            tabItems = this.parseObject(this.items, 0);
        }
        else {
            if (this.element.children.length > 1 && this.element.children[1].classList.contains(CLS_HEADER$1)) {
                this.setProperties({ headerPlacement: 'Bottom' }, true);
            }
            const count = this.hdrEle.children.length;
            const hdrItems = [];
            for (let i = 0; i < count; i++) {
                hdrItems.push(this.hdrEle.children.item(i).innerHTML);
            }
            if (count > 0) {
                while (this.hdrEle.firstElementChild) {
                    detach(this.hdrEle.firstElementChild);
                }
                const tabItems = this.createElement('div', { className: CLS_ITEMS$1 });
                this.hdrEle.appendChild(tabItems);
                hdrItems.forEach((item, index) => {
                    this.lastIndex = index;
                    const attr = {
                        className: CLS_ITEM$2, id: CLS_ITEM$2 + this.tabId + '_' + index,
                        attrs: { role: 'tab', 'aria-controls': CLS_CONTENT$1 + this.tabId + '_' + index, 'aria-selected': 'false' }
                    };
                    const txt = this.createElement('span', {
                        className: CLS_TEXT, innerHTML: item, attrs: { 'role': 'presentation' }
                    }).outerHTML;
                    const cont = this.createElement('div', {
                        className: CLS_TEXT_WRAP, innerHTML: txt + this.btnCls.outerHTML
                    }).outerHTML;
                    const wrap = this.createElement('div', { className: CLS_WRAP, innerHTML: cont, attrs: { tabIndex: '-1' } });
                    tabItems.appendChild(this.createElement('div', attr));
                    selectAll('.' + CLS_ITEM$2, tabItems)[index].appendChild(wrap);
                });
            }
        }
        this.tbObj = new Toolbar({
            width: (hdrPlace === 'Left' || hdrPlace === 'Right') ? 'auto' : '100%',
            height: (hdrPlace === 'Left' || hdrPlace === 'Right') ? '100%' : 'auto',
            overflowMode: this.overflowMode,
            items: (tabItems.length !== 0) ? tabItems : [],
            clicked: this.clickHandler.bind(this),
            scrollStep: this.scrollStep,
            enableHtmlSanitizer: this.enableHtmlSanitizer
        });
        this.tbObj.isStringTemplate = true;
        this.tbObj.createElement = this.createElement;
        this.tbObj.appendTo(this.hdrEle);
        attributes(this.hdrEle, { 'aria-label': 'tab-header' });
        this.updateOrientationAttribute();
        this.setCloseButton(this.showCloseButton);
    }
    renderContent() {
        this.cntEle = select('.' + CLS_CONTENT$1, this.element);
        const hdrItem = selectAll('.' + CLS_TB_ITEM, this.element);
        if (this.isTemplate) {
            this.cnt = (this.cntEle.children.length > 0) ? this.cntEle.innerHTML : '';
            const contents = this.cntEle.children;
            for (let i = 0; i < hdrItem.length; i++) {
                if (contents.length - 1 >= i) {
                    contents.item(i).className += CLS_ITEM$2;
                    attributes(contents.item(i), { 'role': 'tabpanel', 'aria-labelledby': CLS_ITEM$2 + this.tabId + '_' + i });
                    contents.item(i).id = CLS_CONTENT$1 + this.tabId + '_' + i;
                }
            }
        }
    }
    reRenderItems() {
        this.renderContainer();
        if (!isNullOrUndefined(this.cntEle)) {
            this.touchModule = new Touch(this.cntEle, { swipe: this.swipeHandler.bind(this) });
        }
    }
    parseObject(items, index) {
        const tbCount = selectAll('.' + CLS_TB_ITEM, this.element).length;
        const tItems = [];
        let txtWrapEle;
        const spliceArray = [];
        items.forEach((item, i) => {
            const pos = (isNullOrUndefined(item.header) || isNullOrUndefined(item.header.iconPosition)) ? '' : item.header.iconPosition;
            const css = (isNullOrUndefined(item.header) || isNullOrUndefined(item.header.iconCss)) ? '' : item.header.iconCss;
            if ((isNullOrUndefined(item.headerTemplate)) && (isNullOrUndefined(item.header) || isNullOrUndefined(item.header.text) ||
                ((item.header.text.length === 0)) && (css === ''))) {
                spliceArray.push(i);
                return;
            }
            let txt = item.headerTemplate || item.header.text;
            if (typeof txt === 'string' && this.enableHtmlSanitizer) {
                txt = SanitizeHtmlHelper.sanitize(txt);
            }
            this.lastIndex = ((tbCount === 0) ? i : ((this.isReplace) ? (index + i) : (this.lastIndex + 1)));
            const disabled = (item.disabled) ? ' ' + CLS_DISABLE$4 + ' ' + CLS_OVERLAY$2 : '';
            const hidden = (item.visible === false) ? ' ' + CLS_HIDDEN$1 : '';
            txtWrapEle = this.createElement('div', { className: CLS_TEXT, attrs: { 'role': 'presentation' } });
            const tHtml = ((txt instanceof Object) ? txt.outerHTML : txt);
            const txtEmpty = (!isNullOrUndefined(tHtml) && tHtml !== '');
            if (!isNullOrUndefined(txt.tagName)) {
                txtWrapEle.appendChild(txt);
            }
            else {
                this.headerTextCompile(txtWrapEle, txt, i);
            }
            let tEle;
            const icon = this.createElement('span', {
                className: CLS_ICONS + ' ' + CLS_TAB_ICON + ' ' + CLS_ICON + '-' + pos + ' ' + css
            });
            const tCont = this.createElement('div', { className: CLS_TEXT_WRAP });
            tCont.appendChild(txtWrapEle);
            if ((txt !== '' && txt !== undefined) && css !== '') {
                if ((pos === 'left' || pos === 'top')) {
                    tCont.insertBefore(icon, tCont.firstElementChild);
                }
                else {
                    tCont.appendChild(icon);
                }
                tEle = txtWrapEle;
                this.isIconAlone = false;
            }
            else {
                tEle = ((css === '') ? txtWrapEle : icon);
                if (tEle === icon) {
                    detach(txtWrapEle);
                    tCont.appendChild(icon);
                    this.isIconAlone = true;
                }
            }
            const wrapAttrs = (item.disabled) ? {} : { tabIndex: '-1' };
            tCont.appendChild(this.btnCls.cloneNode(true));
            const wrap = this.createElement('div', { className: CLS_WRAP, attrs: wrapAttrs });
            wrap.appendChild(tCont);
            if (this.itemIndexArray === []) {
                this.itemIndexArray.push(CLS_ITEM$2 + this.tabId + '_' + this.lastIndex);
            }
            else {
                this.itemIndexArray.splice((index + i), 0, CLS_ITEM$2 + this.tabId + '_' + this.lastIndex);
            }
            const attrObj = {
                id: CLS_ITEM$2 + this.tabId + '_' + this.lastIndex, role: 'tab', 'aria-selected': 'false'
            };
            const tItem = { htmlAttributes: attrObj, template: wrap };
            tItem.cssClass = ((item.cssClass !== undefined) ? item.cssClass : ' ') + ' ' + disabled + ' ' + hidden
                + ((css !== '') ? 'e-i' + pos : '') + ' ' + ((!txtEmpty) ? CLS_ICON : '');
            if (pos === 'top' || pos === 'bottom') {
                this.element.classList.add('e-vertical-icon');
            }
            tItems.push(tItem);
            i++;
        });
        if (!this.isAdd) {
            spliceArray.forEach((spliceItemIndex) => {
                this.items.splice(spliceItemIndex, 1);
            });
        }
        if (this.isIconAlone) {
            this.element.classList.add(CLS_ICON_TAB);
        }
        else {
            this.element.classList.remove(CLS_ICON_TAB);
        }
        return tItems;
    }
    removeActiveClass() {
        const tabHeader = this.getTabHeader();
        if (tabHeader) {
            const tabItems = selectAll('.' + CLS_TB_ITEM + '.' + CLS_ACTIVE$1, tabHeader);
            [].slice.call(tabItems).forEach((node) => node.classList.remove(CLS_ACTIVE$1));
        }
    }
    checkPopupOverflow(ele) {
        this.tbPop = select('.' + CLS_TB_POP, this.element);
        const popIcon = select('.e-hor-nav', this.element);
        const tbrItems = select('.' + CLS_TB_ITEMS, this.element);
        const lastChild = tbrItems.lastChild;
        let isOverflow = false;
        if (!this.isVertical() && ((this.enableRtl && ((popIcon.offsetLeft + popIcon.offsetWidth) > tbrItems.offsetLeft))
            || (!this.enableRtl && popIcon.offsetLeft < tbrItems.offsetWidth))) {
            isOverflow = true;
        }
        else if (this.isVertical() && (popIcon.offsetTop < lastChild.offsetTop + lastChild.offsetHeight)) {
            isOverflow = true;
        }
        if (isOverflow) {
            ele.classList.add(CLS_TB_POPUP);
            this.tbPop.insertBefore(ele, selectAll('.' + CLS_TB_POPUP, this.tbPop)[0]);
        }
        return true;
    }
    popupHandler(target) {
        const ripEle = target.querySelector('.e-ripple-element');
        if (!isNullOrUndefined(ripEle)) {
            ripEle.outerHTML = '';
            target.querySelector('.' + CLS_WRAP).classList.remove('e-ripple');
        }
        this.tbItem = selectAll('.' + CLS_TB_ITEMS + ' .' + CLS_TB_ITEM, this.hdrEle);
        const lastChild = this.tbItem[this.tbItem.length - 1];
        if (this.tbItem.length !== 0) {
            target.classList.remove(CLS_TB_POPUP);
            target.removeAttribute('style');
            this.tbItems.appendChild(target);
            this.actEleId = target.id;
            if (this.checkPopupOverflow(lastChild)) {
                const prevEle = this.tbItems.lastChild.previousElementSibling;
                this.checkPopupOverflow(prevEle);
            }
            this.isPopup = true;
        }
        return selectAll('.' + CLS_TB_ITEM, this.tbItems).length - 1;
    }
    updateOrientationAttribute() {
        attributes(this.element, { 'aria-orientation': (this.isVertical() ? 'vertical' : 'horizontal') });
    }
    setCloseButton(val) {
        const trg = select('.' + CLS_HEADER$1, this.element);
        if (val === true) {
            trg.classList.add(CLS_CLOSE_SHOW);
        }
        else {
            trg.classList.remove(CLS_CLOSE_SHOW);
        }
        this.tbObj.refreshOverflow();
        this.refreshActElePosition();
    }
    prevCtnAnimation(prev, current) {
        let animation;
        const checkRTL = this.enableRtl || this.element.classList.contains(CLS_RTL$4);
        if (this.isPopup || prev <= current) {
            if (this.animation.previous.effect === 'SlideLeftIn') {
                animation = {
                    name: 'SlideLeftOut',
                    duration: this.animation.previous.duration, timingFunction: this.animation.previous.easing
                };
            }
            else {
                animation = null;
            }
        }
        else {
            if (this.animation.next.effect === 'SlideRightIn') {
                animation = {
                    name: 'SlideRightOut',
                    duration: this.animation.next.duration, timingFunction: this.animation.next.easing
                };
            }
            else {
                animation = null;
            }
        }
        return animation;
    }
    triggerPrevAnimation(oldCnt, prevIndex) {
        const animateObj = this.prevCtnAnimation(prevIndex, this.selectedItem);
        if (!isNullOrUndefined(animateObj)) {
            animateObj.begin = () => {
                setStyleAttribute(oldCnt, { 'position': 'absolute' });
                oldCnt.classList.add(CLS_PROGRESS);
                oldCnt.classList.add('e-view');
            };
            animateObj.end = () => {
                oldCnt.style.display = 'none';
                oldCnt.classList.remove(CLS_ACTIVE$1);
                oldCnt.classList.remove(CLS_PROGRESS);
                oldCnt.classList.remove('e-view');
                setStyleAttribute(oldCnt, { 'display': '', 'position': '' });
                if (oldCnt.childNodes.length === 0 && !this.isTemplate) {
                    detach(oldCnt);
                }
            };
            new Animation(animateObj).animate(oldCnt);
        }
        else {
            oldCnt.classList.remove(CLS_ACTIVE$1);
        }
    }
    triggerAnimation(id, value) {
        const prevIndex = this.prevIndex;
        let oldCnt;
        let newCnt;
        if (!this.isServerRendered || (this.isServerRendered && this.loadOn !== 'Dynamic')) {
            const itemCollection = [].slice.call(this.element.querySelector('.' + CLS_CONTENT$1).children);
            itemCollection.forEach((item) => {
                if (item.id === this.prevActiveEle) {
                    oldCnt = item;
                }
            });
            const prevEle = this.tbItem[prevIndex];
            newCnt = this.getTrgContent(this.cntEle, this.extIndex(id));
            if (isNullOrUndefined(oldCnt) && !isNullOrUndefined(prevEle)) {
                const idNo = this.extIndex(prevEle.id);
                oldCnt = this.getTrgContent(this.cntEle, idNo);
            }
        }
        else {
            newCnt = this.cntEle.firstElementChild;
        }
        if (!isNullOrUndefined(newCnt)) {
            this.prevActiveEle = newCnt.id;
        }
        if (this.initRender || value === false || this.animation === {} || isNullOrUndefined(this.animation)) {
            if (oldCnt && oldCnt !== newCnt) {
                oldCnt.classList.remove(CLS_ACTIVE$1);
            }
            return;
        }
        const cnt = select('.' + CLS_CONTENT$1, this.element);
        let animateObj;
        if (this.prevIndex > this.selectedItem && !this.isPopup) {
            const openEff = this.animation.previous.effect;
            animateObj = {
                name: ((openEff === 'None') ? '' : ((openEff !== 'SlideLeftIn') ? openEff : 'SlideLeftIn')),
                duration: this.animation.previous.duration,
                timingFunction: this.animation.previous.easing
            };
        }
        else if (this.isPopup || this.prevIndex < this.selectedItem || this.prevIndex === this.selectedItem) {
            const clsEff = this.animation.next.effect;
            animateObj = {
                name: ((clsEff === 'None') ? '' : ((clsEff !== 'SlideRightIn') ? clsEff : 'SlideRightIn')),
                duration: this.animation.next.duration,
                timingFunction: this.animation.next.easing
            };
        }
        animateObj.progress = () => {
            cnt.classList.add(CLS_PROGRESS);
            this.setActiveBorder();
        };
        animateObj.end = () => {
            cnt.classList.remove(CLS_PROGRESS);
            newCnt.classList.add(CLS_ACTIVE$1);
        };
        if (!this.initRender && !isNullOrUndefined(oldCnt)) {
            this.triggerPrevAnimation(oldCnt, prevIndex);
        }
        this.isPopup = false;
        if (animateObj.name === '') {
            newCnt.classList.add(CLS_ACTIVE$1);
        }
        else {
            new Animation(animateObj).animate(newCnt);
        }
    }
    keyPressed(trg) {
        const trgParent = closest(trg, '.' + CLS_HEADER$1 + ' .' + CLS_TB_ITEM);
        const trgIndex = this.getEleIndex(trgParent);
        if (!isNullOrUndefined(this.popEle) && trg.classList.contains('e-hor-nav')) {
            (this.popEle.classList.contains(CLS_POPUP_OPEN)) ? this.popObj.hide(this.hide) : this.popObj.show(this.show);
        }
        else if (trg.classList.contains('e-scroll-nav')) {
            trg.click();
        }
        else {
            if (!isNullOrUndefined(trgParent) && trgParent.classList.contains(CLS_ACTIVE$1) === false) {
                this.select(trgIndex);
                if (!isNullOrUndefined(this.popEle)) {
                    this.popObj.hide(this.hide);
                }
            }
        }
    }
    getTabHeader() {
        if (isNullOrUndefined(this.element)) {
            return undefined;
        }
        const headers = [].slice.call(this.element.children).filter((e) => e.classList.contains(CLS_HEADER$1));
        if (headers.length > 0) {
            return headers[0];
        }
        else {
            const wrap = [].slice.call(this.element.children).filter((e) => !e.classList.contains(CLS_BLA_TEM))[0];
            if (!wrap) {
                return undefined;
            }
            return [].slice.call(wrap.children).filter((e) => e.classList.contains(CLS_HEADER$1))[0];
        }
    }
    getEleIndex(item) {
        return Array.prototype.indexOf.call(selectAll('.' + CLS_TB_ITEM, this.getTabHeader()), item);
    }
    extIndex(id) {
        return id.replace(CLS_ITEM$2 + this.tabId + '_', '');
    }
    expTemplateContent() {
        this.templateEle.forEach((eleStr) => {
            if (!isNullOrUndefined(this.element.querySelector(eleStr))) {
                document.body.appendChild(this.element.querySelector(eleStr)).style.display = 'none';
            }
        });
    }
    templateCompile(ele, cnt, index) {
        const tempEle = this.createElement('div');
        this.compileElement(tempEle, cnt, 'content', index);
        if (tempEle.childNodes.length !== 0) {
            ele.appendChild(tempEle);
        }
        if (this.isReact) {
            this.renderReactTemplates();
        }
    }
    compileElement(ele, val, prop, index) {
        let templateFn;
        if (typeof val === 'string') {
            val = val.trim();
            ele.innerHTML = SanitizeHtmlHelper.sanitize(val);
        }
        else {
            templateFn = compile(val);
        }
        let templateFUN;
        if (!isNullOrUndefined(templateFn)) {
            templateFUN = templateFn({}, this, prop);
        }
        if (!isNullOrUndefined(templateFn) && templateFUN.length > 0) {
            [].slice.call(templateFUN).forEach((el) => {
                ele.appendChild(el);
            });
        }
    }
    headerTextCompile(element, text, index) {
        this.compileElement(element, text, 'headerTemplate', index);
    }
    getContent(ele, cnt, callType, index) {
        let eleStr;
        if (typeof cnt === 'string' || isNullOrUndefined(cnt.innerHTML)) {
            if (typeof cnt === 'string' && this.enableHtmlSanitizer) {
                cnt = SanitizeHtmlHelper.sanitize(cnt);
            }
            if (cnt[0] === '.' || cnt[0] === '#') {
                if (document.querySelectorAll(cnt).length) {
                    const eleVal = document.querySelector(cnt);
                    eleStr = eleVal.outerHTML.trim();
                    if (callType === 'clone') {
                        ele.appendChild(eleVal.cloneNode(true));
                    }
                    else {
                        ele.appendChild(eleVal);
                        eleVal.style.display = '';
                    }
                }
                else {
                    this.templateCompile(ele, cnt, index);
                }
            }
            else {
                this.templateCompile(ele, cnt, index);
            }
        }
        else {
            ele.appendChild(cnt);
        }
        if (!isNullOrUndefined(eleStr)) {
            if (this.templateEle.indexOf(cnt.toString()) === -1) {
                this.templateEle.push(cnt.toString());
            }
        }
    }
    getTrgContent(cntEle, no) {
        let ele;
        if (this.element.classList.contains(CLS_NEST$1)) {
            ele = select('.' + CLS_NEST$1 + '> .' + CLS_CONTENT$1 + ' > #' + CLS_CONTENT$1 + this.tabId + '_' + no, this.element);
        }
        else {
            ele = this.findEle(cntEle.children, CLS_CONTENT$1 + this.tabId + '_' + no);
        }
        return ele;
    }
    findEle(items, key) {
        let ele;
        for (let i = 0; i < items.length; i++) {
            if (items[i].id === key) {
                ele = items[i];
                break;
            }
        }
        return ele;
    }
    isVertical() {
        const isVertical = (this.headerPlacement === 'Left' || this.headerPlacement === 'Right') ? true : false;
        this.scrCntClass = (isVertical) ? CLS_VSCRCNT : CLS_HSCRCNT;
        return isVertical;
    }
    addVerticalClass() {
        if (this.isVertical()) {
            const tbPos = (this.headerPlacement === 'Left') ? CLS_VLEFT : CLS_VRIGHT;
            addClass([this.hdrEle], [CLS_VERTICAL$1, tbPos]);
            if (!this.element.classList.contains(CLS_NEST$1)) {
                addClass([this.element], [CLS_VTAB, tbPos]);
            }
            else {
                addClass([this.hdrEle], [CLS_VTAB, tbPos]);
            }
        }
        if (this.headerPlacement === 'Bottom') {
            addClass([this.hdrEle], [CLS_HBOTTOM]);
        }
    }
    updatePopAnimationConfig() {
        this.show = { name: (this.isVertical() ? 'FadeIn' : 'SlideDown'), duration: 100 };
        this.hide = { name: (this.isVertical() ? 'FadeOut' : 'SlideUp'), duration: 100 };
    }
    changeOrientation(place) {
        this.setOrientation(place, this.hdrEle);
        const activeTab = this.hdrEle.querySelector('.' + CLS_ACTIVE$1);
        const isVertical = this.hdrEle.classList.contains(CLS_VERTICAL$1) ? true : false;
        removeClass([this.element], [CLS_VTAB]);
        removeClass([this.hdrEle], [CLS_VERTICAL$1, CLS_VLEFT, CLS_VRIGHT]);
        if (isVertical !== this.isVertical()) {
            this.changeToolbarOrientation();
            if (!isNullOrUndefined(activeTab) && activeTab.classList.contains(CLS_TB_POPUP)) {
                this.popupHandler(activeTab);
            }
        }
        this.addVerticalClass();
        this.updateOrientationAttribute();
        this.setActiveBorder();
        this.focusItem();
    }
    focusItem() {
        const curActItem = select(' #' + CLS_ITEM$2 + this.tabId + '_' + this.selectedItem, this.hdrEle);
        if (!isNullOrUndefined(curActItem)) {
            curActItem.firstElementChild.focus();
        }
    }
    serverChangeOrientation(newProp, oldProp) {
        this.setOrientation(newProp, this.hdrEle);
        removeClass([this.element], [CLS_VTAB]);
        const newValue = newProp === 'Left' || newProp === 'Right';
        const oldValue = oldProp === 'Left' || oldProp === 'Right';
        if (newValue !== oldValue) {
            this.changeToolbarOrientation();
        }
        if (this.isVertical()) {
            addClass([this.element], [CLS_VTAB]);
        }
        this.updateOrientationAttribute();
        this.setActiveBorder();
        this.focusItem();
    }
    changeToolbarOrientation() {
        this.tbObj.setProperties({ height: (this.isVertical() ? '100%' : 'auto'), width: (this.isVertical() ? 'auto' : '100%') }, true);
        this.tbObj.changeOrientation();
        this.updatePopAnimationConfig();
    }
    setOrientation(place, ele) {
        const headerPos = Array.prototype.indexOf.call(this.element.children, ele);
        const contentPos = Array.prototype.indexOf.call(this.element.children, this.element.querySelector('.' + CLS_CONTENT$1));
        if (place === 'Bottom' && (contentPos > headerPos)) {
            this.element.appendChild(ele);
        }
        else {
            removeClass([ele], [CLS_HBOTTOM]);
            this.element.insertBefore(ele, select('.' + CLS_CONTENT$1, this.element));
        }
    }
    setCssClass(ele, cls, val) {
        if (cls === '') {
            return;
        }
        const list = cls.split(' ');
        for (let i = 0; i < list.length; i++) {
            if (val) {
                ele.classList.add(list[i]);
            }
            else {
                ele.classList.remove(list[i]);
            }
        }
    }
    setContentHeight(val) {
        if (this.element.classList.contains(CLS_FILL)) {
            removeClass([this.element], [CLS_FILL]);
        }
        if (isNullOrUndefined(this.cntEle)) {
            return;
        }
        const hdrEle = this.getTabHeader();
        if (this.heightAdjustMode === 'None') {
            if (this.height === 'auto') {
                return;
            }
            else {
                if (!this.isVertical()) {
                    setStyleAttribute(this.cntEle, { 'height': (this.element.offsetHeight - hdrEle.offsetHeight) + 'px' });
                }
            }
        }
        else if (this.heightAdjustMode === 'Fill') {
            addClass([this.element], [CLS_FILL]);
            setStyleAttribute(this.element, { 'height': '100%' });
            setStyleAttribute(this.cntEle, { 'height': (this.element.offsetHeight - hdrEle.offsetHeight) + 'px' });
        }
        else if (this.heightAdjustMode === 'Auto') {
            if (this.isTemplate === true) {
                const cnt = selectAll('.' + CLS_CONTENT$1 + ' > .' + CLS_ITEM$2, this.element);
                for (let i = 0; i < cnt.length; i++) {
                    cnt[i].setAttribute('style', 'display:block; visibility: visible');
                    this.maxHeight = Math.max(this.maxHeight, this.getHeight(cnt[i]));
                    cnt[i].style.removeProperty('display');
                    cnt[i].style.removeProperty('visibility');
                }
            }
            else {
                this.cntEle = select('.' + CLS_CONTENT$1, this.element);
                if (val === true) {
                    this.cntEle.appendChild(this.createElement('div', {
                        id: (CLS_CONTENT$1 + this.tabId + '_' + 0), className: CLS_ITEM$2 + ' ' + CLS_ACTIVE$1,
                        attrs: { 'role': 'tabpanel', 'aria-labelledby': CLS_ITEM$2 + this.tabId + '_' + 0 }
                    }));
                }
                const ele = this.cntEle.children.item(0);
                for (let i = 0; i < this.items.length; i++) {
                    this.getContent(ele, this.items[i].content, 'clone', i);
                    this.maxHeight = Math.max(this.maxHeight, this.getHeight(ele));
                    while (ele.firstChild) {
                        ele.removeChild(ele.firstChild);
                    }
                }
                this.clearTemplate(['content']);
                this.templateEle = [];
                this.getContent(ele, this.items[0].content, 'render', 0);
                ele.classList.remove(CLS_ACTIVE$1);
            }
            setStyleAttribute(this.cntEle, { 'height': this.maxHeight + 'px' });
        }
        else {
            setStyleAttribute(this.cntEle, { 'height': 'auto' });
        }
    }
    getHeight(ele) {
        const cs = window.getComputedStyle(ele);
        return ele.offsetHeight + parseFloat(cs.getPropertyValue('padding-top')) + parseFloat(cs.getPropertyValue('padding-bottom')) +
            parseFloat(cs.getPropertyValue('margin-top')) + parseFloat(cs.getPropertyValue('margin-bottom'));
    }
    setActiveBorder() {
        const trgHdrEle = this.getTabHeader();
        const trg = select('.' + CLS_TB_ITEM + '.' + CLS_ACTIVE$1, trgHdrEle);
        if (trg === null) {
            return;
        }
        if (this.isServerRendered && trg.classList.contains(CLS_TB_POPUP)) {
            this.popupHandler(trg);
        }
        const root = closest(trg, '.' + CLS_TAB);
        if (this.element !== root) {
            return;
        }
        this.tbItems = select('.' + CLS_TB_ITEMS, trgHdrEle);
        const bar = select('.' + CLS_INDICATOR, trgHdrEle);
        const scrollCnt = select('.' + CLS_TB_ITEMS + ' .' + this.scrCntClass, trgHdrEle);
        if (this.isVertical()) {
            setStyleAttribute(bar, { 'left': '', 'right': '' });
            const tbHeight = (isNullOrUndefined(scrollCnt)) ? this.tbItems.offsetHeight : scrollCnt.offsetHeight;
            if (tbHeight !== 0) {
                setStyleAttribute(bar, { 'top': trg.offsetTop + 'px', 'height': trg.offsetHeight + 'px' });
            }
            else {
                setStyleAttribute(bar, { 'top': 0, 'height': 0 });
            }
        }
        else {
            if (this.overflowMode === 'MultiRow') {
                let bar = select('.' + CLS_INDICATOR, this.element);
                setStyleAttribute(bar, { 'top': trg.offsetHeight + trg.offsetTop + 'px', 'height': '' });
            }
            else {
                setStyleAttribute(bar, { 'top': '', 'height': '' });
            }
            let tbWidth = (isNullOrUndefined(scrollCnt)) ? this.tbItems.offsetWidth : scrollCnt.offsetWidth;
            if (tbWidth !== 0) {
                setStyleAttribute(bar, { 'left': trg.offsetLeft + 'px', 'right': tbWidth - (trg.offsetLeft + trg.offsetWidth) + 'px' });
            }
            else {
                setStyleAttribute(bar, { 'left': 'auto', 'right': 'auto' });
            }
        }
        if (!isNullOrUndefined(this.bdrLine)) {
            this.bdrLine.classList.remove(CLS_HIDDEN$1);
        }
    }
    setActive(value, skipDataBind = false) {
        this.tbItem = selectAll('.' + CLS_TB_ITEM, this.getTabHeader());
        const trg = this.tbItem[value];
        if (this.isServerRendered && trg) {
            value = parseInt(trg.getAttribute('data-index'), 10);
        }
        if (value < 0 || isNaN(value) || this.tbItem.length === 0) {
            return;
        }
        if (value >= 0 && !skipDataBind) {
            this.allowServerDataBinding = false;
            this.setProperties({ selectedItem: value }, true);
            this.allowServerDataBinding = true;
            if (!this.initRender) {
                this.serverDataBind();
            }
        }
        if (trg.classList.contains(CLS_ACTIVE$1)) {
            this.setActiveBorder();
            return;
        }
        if (!this.isTemplate) {
            const prev = this.tbItem[this.prevIndex];
            if (!isNullOrUndefined(prev)) {
                prev.removeAttribute('aria-controls');
            }
            attributes(trg, { 'aria-controls': CLS_CONTENT$1 + this.tabId + '_' + value });
        }
        const id = trg.id;
        this.removeActiveClass();
        trg.classList.add(CLS_ACTIVE$1);
        this.tbItem[this.prevIndex].setAttribute('aria-selected', 'false');
        trg.setAttribute('aria-selected', 'true');
        const no = Number(this.extIndex(id));
        if (isNullOrUndefined(this.prevActiveEle)) {
            this.prevActiveEle = CLS_CONTENT$1 + this.tabId + '_' + no;
        }
        attributes(this.element, { 'aria-activedescendant': id });
        if (this.isTemplate) {
            if (select('.' + CLS_CONTENT$1, this.element).children.length > 0) {
                const trg = this.findEle(select('.' + CLS_CONTENT$1, this.element).children, CLS_CONTENT$1 + this.tabId + '_' + no);
                if (!isNullOrUndefined(trg)) {
                    trg.classList.add(CLS_ACTIVE$1);
                }
                this.triggerAnimation(id, this.enableAnimation);
            }
        }
        else if (!this.isServerRendered || (this.isServerRendered && this.loadOn === 'Init')) {
            this.cntEle = select('.' + CLS_TAB + ' > .' + CLS_CONTENT$1, this.element);
            const item = this.getTrgContent(this.cntEle, this.extIndex(id));
            if (isNullOrUndefined(item)) {
                this.cntEle.appendChild(this.createElement('div', {
                    id: CLS_CONTENT$1 + this.tabId + '_' + this.extIndex(id), className: CLS_ITEM$2 + ' ' + CLS_ACTIVE$1,
                    attrs: { role: 'tabpanel', 'aria-labelledby': CLS_ITEM$2 + this.tabId + '_' + this.extIndex(id) }
                }));
                const eleTrg = this.getTrgContent(this.cntEle, this.extIndex(id));
                const itemIndex = Array.prototype.indexOf.call(this.itemIndexArray, id);
                this.getContent(eleTrg, this.items[itemIndex].content, 'render', itemIndex);
            }
            else {
                item.classList.add(CLS_ACTIVE$1);
            }
            this.triggerAnimation(id, this.enableAnimation);
        }
        this.setActiveBorder();
        this.refreshItemVisibility(trg);
        if (!this.initRender && !skipDataBind) {
            trg.firstElementChild.focus();
            const eventArg = {
                previousItem: this.prevItem,
                previousIndex: this.prevIndex,
                selectedItem: trg,
                selectedIndex: value,
                selectedContent: select('#' + CLS_CONTENT$1 + this.tabId + '_' + this.selectingID, this.content),
                isSwiped: this.isSwipeed
            };
            this.trigger('selected', eventArg);
        }
    }
    contentReady() {
        const id = this.setActiveContent();
        this.triggerAnimation(id, this.enableAnimation);
    }
    setItems(items) {
        this.isReplace = true;
        this.tbItems = select('.' + CLS_TB_ITEMS, this.getTabHeader());
        this.tbObj.items = this.parseObject(items, 0);
        this.tbObj.dataBind();
        this.isReplace = false;
    }
    setRTL(value) {
        this.tbObj.enableRtl = value;
        this.tbObj.dataBind();
        this.setCssClass(this.element, CLS_RTL$4, value);
        this.refreshActiveBorder();
    }
    refreshActiveBorder() {
        if (!isNullOrUndefined(this.bdrLine)) {
            this.bdrLine.classList.add(CLS_HIDDEN$1);
        }
        this.setActiveBorder();
    }
    showPopup(config) {
        const tbPop = select('.e-popup.e-toolbar-pop', this.hdrEle);
        if (tbPop.classList.contains('e-popup-close')) {
            const tbPopObj = (tbPop && tbPop.ej2_instances[0]);
            tbPopObj.position.X = (this.headerPlacement === 'Left') ? 'left' : 'right';
            tbPopObj.dataBind();
            tbPopObj.show(config);
        }
    }
    bindDraggable() {
        if (this.allowDragAndDrop) {
            let items = this.element.querySelectorAll('.' + CLS_TB_ITEM);
            items.forEach((element) => {
                this.initializeDrag(element);
            });
        }
    }
    wireEvents() {
        this.bindDraggable();
        window.addEventListener('resize', this.resizeContext);
        EventHandler.add(this.element, 'mouseover', this.hoverHandler, this);
        EventHandler.add(this.element, 'keydown', this.spaceKeyDown, this);
        if (!isNullOrUndefined(this.cntEle)) {
            this.touchModule = new Touch(this.cntEle, { swipe: this.swipeHandler.bind(this) });
        }
        this.keyModule = new KeyboardEvents(this.element, { keyAction: this.keyHandler.bind(this), keyConfigs: this.keyConfigs });
        this.tabKeyModule = new KeyboardEvents(this.element, {
            keyAction: this.keyHandler.bind(this),
            keyConfigs: { openPopup: 'shift+f10', tab: 'tab', shiftTab: 'shift+tab' },
            eventName: 'keydown'
        });
    }
    unWireEvents() {
        if (!isNullOrUndefined(this.keyModule)) {
            this.keyModule.destroy();
        }
        if (!isNullOrUndefined(this.tabKeyModule)) {
            this.tabKeyModule.destroy();
        }
        if (!isNullOrUndefined(this.cntEle) && !isNullOrUndefined(this.touchModule)) {
            this.touchModule.destroy();
        }
        window.removeEventListener('resize', this.resizeContext);
        EventHandler.remove(this.element, 'mouseover', this.hoverHandler);
        EventHandler.remove(this.element, 'keydown', this.spaceKeyDown);
        this.element.classList.remove(CLS_RTL$4);
        this.element.classList.remove(CLS_FOCUS);
    }
    clickHandler(args) {
        this.element.classList.remove(CLS_FOCUS);
        const trg = args.originalEvent.target;
        const trgParent = closest(trg, '.' + CLS_TB_ITEM);
        const trgIndex = this.getEleIndex(trgParent);
        if (trg.classList.contains(CLS_ICON_CLOSE)) {
            this.removeTab(trgIndex);
        }
        else if (this.isVertical() && closest(trg, '.' + CLS_HOR_NAV)) {
            this.showPopup(this.show);
        }
        else {
            this.isPopup = false;
            if (this.isServerRendered && !isNullOrUndefined(trgParent)) {
                if (parseInt(trgParent.getAttribute('data-index'), 10) !== this.selectedItem) {
                    this.select(trgIndex);
                }
            }
            else if (!isNullOrUndefined(trgParent) && (trgIndex !== this.selectedItem || trgIndex !== this.prevIndex)) {
                this.select(trgIndex, args.originalEvent);
            }
        }
    }
    swipeHandler(e) {
        if (e.velocity < 3 && isNullOrUndefined(e.originalEvent.changedTouches)) {
            return;
        }
        if (e.originalEvent) {
            e.originalEvent.stopPropagation();
        }
        this.isSwipeed = true;
        if (e.swipeDirection === 'Right' && this.selectedItem !== 0) {
            for (let k = this.selectedItem - 1; k >= 0; k--) {
                if (!this.tbItem[k].classList.contains(CLS_HIDDEN$1)) {
                    this.select(k);
                    break;
                }
            }
        }
        else if (e.swipeDirection === 'Left' && (this.selectedItem !== selectAll('.' + CLS_TB_ITEM, this.element).length - 1)) {
            for (let i = this.selectedItem + 1; i < this.tbItem.length; i++) {
                if (!this.tbItem[i].classList.contains(CLS_HIDDEN$1)) {
                    this.select(i);
                    break;
                }
            }
        }
        this.isSwipeed = false;
    }
    spaceKeyDown(e) {
        if ((e.keyCode === 32 && e.which === 32) || (e.keyCode === 35 && e.which === 35)) {
            const clstHead = closest(e.target, '.' + CLS_HEADER$1);
            if (!isNullOrUndefined(clstHead)) {
                e.preventDefault();
            }
        }
    }
    keyHandler(e) {
        if (this.element.classList.contains(CLS_DISABLE$4)) {
            return;
        }
        this.element.classList.add(CLS_FOCUS);
        const trg = e.target;
        const tabHeader = this.getTabHeader();
        const actEle = select('.' + CLS_ACTIVE$1, tabHeader);
        this.popEle = select('.' + CLS_TB_POP, tabHeader);
        if (!isNullOrUndefined(this.popEle)) {
            this.popObj = this.popEle.ej2_instances[0];
        }
        const item = closest(document.activeElement, '.' + CLS_TB_ITEM);
        const trgParent = closest(trg, '.' + CLS_TB_ITEM);
        switch (e.action) {
            case 'space':
            case 'enter':
                if (trg.parentElement.classList.contains(CLS_DISABLE$4)) {
                    return;
                }
                if (e.action === 'enter' && trg.classList.contains('e-hor-nav')) {
                    this.showPopup(this.show);
                    break;
                }
                this.keyPressed(trg);
                break;
            case 'tab':
            case 'shiftTab':
                if (trg.classList.contains(CLS_WRAP)
                    && closest(trg, '.' + CLS_TB_ITEM).classList.contains(CLS_ACTIVE$1) === false) {
                    trg.setAttribute('tabindex', '-1');
                }
                if (this.popObj && isVisible(this.popObj.element)) {
                    this.popObj.hide(this.hide);
                }
                actEle.children.item(0).setAttribute('tabindex', '0');
                break;
            case 'moveLeft':
            case 'moveRight':
                if (!isNullOrUndefined(item)) {
                    this.refreshItemVisibility(item);
                }
                break;
            case 'openPopup':
                e.preventDefault();
                if (!isNullOrUndefined(this.popEle) && this.popEle.classList.contains(CLS_POPUP_CLOSE)) {
                    this.popObj.show(this.show);
                }
                break;
            case 'delete':
                if (this.showCloseButton === true && !isNullOrUndefined(trgParent)) {
                    const nxtSib = trgParent.nextSibling;
                    if (!isNullOrUndefined(nxtSib) && nxtSib.classList.contains(CLS_TB_ITEM)) {
                        nxtSib.firstElementChild.focus();
                    }
                    this.removeTab(this.getEleIndex(trgParent));
                }
                this.setActiveBorder();
                break;
        }
    }
    refreshActElePosition() {
        const activeEle = select('.' + CLS_TB_ITEM + '.' + CLS_TB_POPUP + '.' + CLS_ACTIVE$1, this.element);
        if (!isNullOrUndefined(activeEle)) {
            this.select(this.getEleIndex(activeEle));
        }
        this.refreshActiveBorder();
    }
    refreshItemVisibility(target) {
        const scrCnt = select('.' + this.scrCntClass, this.tbItems);
        if (!this.isVertical() && !isNullOrUndefined(scrCnt)) {
            const scrBar = select('.e-hscroll-bar', this.tbItems);
            const scrStart = scrBar.scrollLeft;
            const scrEnd = scrStart + scrBar.offsetWidth;
            const eleStart = target.offsetLeft;
            const eleWidth = target.offsetWidth;
            const eleEnd = target.offsetLeft + target.offsetWidth;
            if ((scrStart < eleStart) && (scrEnd < eleEnd)) {
                const eleViewRange = scrEnd - eleStart;
                scrBar.scrollLeft = scrStart + (eleWidth - eleViewRange);
            }
            else {
                if ((scrStart > eleStart) && (scrEnd > eleEnd)) {
                    const eleViewRange = eleEnd - scrStart;
                    scrBar.scrollLeft = scrStart - (eleWidth - eleViewRange);
                }
            }
        }
        else {
            return;
        }
    }
    hoverHandler(e) {
        const trg = e.target;
        if (!isNullOrUndefined(trg.classList) && trg.classList.contains(CLS_ICON_CLOSE)) {
            trg.setAttribute('title', new L10n('tab', { closeButtonTitle: this.title }, this.locale).getConstant('closeButtonTitle'));
        }
    }
    evalOnPropertyChangeItems(newProp, oldProp) {
        if (!(newProp.items instanceof Array && oldProp.items instanceof Array)) {
            const changedProp = Object.keys(newProp.items);
            for (let i = 0; i < changedProp.length; i++) {
                const index = parseInt(Object.keys(newProp.items)[i], 10);
                const property = Object.keys(newProp.items[index])[0];
                const oldVal = Object(oldProp.items[index])[property];
                const newVal = Object(newProp.items[index])[property];
                const hdrItem = select('.' + CLS_TB_ITEMS + ' #' + CLS_ITEM$2 + this.tabId + '_' + index, this.element);
                const cntItem = select('.' + CLS_CONTENT$1 + ' #' + CLS_CONTENT$1 + this.tabId + '_' + index, this.element);
                if (property === 'header' || property === 'headerTemplate') {
                    const icon = (isNullOrUndefined(this.items[index].header) ||
                        isNullOrUndefined(this.items[index].header.iconCss)) ? '' : this.items[index].header.iconCss;
                    const textVal = this.items[index].headerTemplate || this.items[index].header.text;
                    if ((textVal === '') && (icon === '')) {
                        this.removeTab(index);
                    }
                    else {
                        const arr = [];
                        arr.push(this.items[index]);
                        this.items.splice(index, 1);
                        this.itemIndexArray.splice(index, 1);
                        this.tbObj.items.splice(index, 1);
                        const isHiddenEle = hdrItem.classList.contains(CLS_HIDDEN$1);
                        detach(hdrItem);
                        this.isReplace = true;
                        this.addTab(arr, index);
                        if (isHiddenEle) {
                            this.hideTab(index);
                        }
                        this.isReplace = false;
                    }
                }
                if (property === 'content' && !isNullOrUndefined(cntItem)) {
                    const strVal = typeof newVal === 'string' || isNullOrUndefined(newVal.innerHTML);
                    if (strVal && (newVal[0] === '.' || newVal[0] === '#') && newVal.length) {
                        const eleVal = document.querySelector(newVal);
                        cntItem.appendChild(eleVal);
                        eleVal.style.display = '';
                    }
                    else if (newVal === '' && oldVal[0] === '#') {
                        document.body.appendChild(this.element.querySelector(oldVal)).style.display = 'none';
                        cntItem.innerHTML = newVal;
                    }
                    else if (this.isReact && typeof newVal === 'object') {
                        cntItem.innerHTML = '';
                        this.templateCompile(cntItem, newVal, index);
                    }
                    else if (typeof newVal !== 'function') {
                        cntItem.innerHTML = newVal;
                    }
                }
                if (property === 'cssClass') {
                    if (!isNullOrUndefined(hdrItem)) {
                        hdrItem.classList.remove(oldVal);
                        hdrItem.classList.add(newVal);
                    }
                    if (!isNullOrUndefined(cntItem)) {
                        cntItem.classList.remove(oldVal);
                        cntItem.classList.add(newVal);
                    }
                }
                if (property === 'disabled') {
                    this.enableTab(index, ((newVal === true) ? false : true));
                }
                if (property === 'visible') {
                    this.hideTab(index, ((newVal === true) ? false : true));
                }
            }
        }
        else {
            this.lastIndex = 0;
            if (isNullOrUndefined(this.tbObj)) {
                this.reRenderItems();
            }
            else {
                if (this.isRect) {
                    this.clearTemplate();
                }
                this.setItems(newProp.items);
                if (this.templateEle.length > 0) {
                    this.expTemplateContent();
                }
                this.templateEle = [];
                const selectElement = select('.' + CLS_TAB + ' > .' + CLS_CONTENT$1, this.element);
                while (selectElement.firstElementChild && !isBlazor()) {
                    detach(selectElement.firstElementChild);
                }
                this.select(this.selectedItem);
            }
        }
    }
    initializeDrag(target) {
        this.dragArea = !isNullOrUndefined(this.dragArea) ? this.dragArea : '#' + this.element.id + ' ' + ('.' + CLS_HEADER$1);
        let dragObj = new Draggable(target, {
            dragArea: this.dragArea,
            dragTarget: '.' + CLS_TB_ITEM,
            clone: true,
            helper: this.helper.bind(this),
            dragStart: this.itemDragStart.bind(this),
            drag: (e) => {
                let dragIndex = this.getEleIndex(this.dragItem);
                let dropIndex;
                let dropItem;
                let dragArgs = {
                    draggedItem: this.dragItem,
                    event: e.event,
                    target: e.target,
                    droppedItem: e.target.closest('.' + CLS_TB_ITEM),
                    clonedElement: this.cloneElement,
                    index: dragIndex
                };
                if (!isNullOrUndefined(e.target.closest('.' + CLS_TAB)) && !e.target.closest('.' + CLS_TAB).isEqualNode(this.element) &&
                    this.dragArea !== '.' + CLS_HEADER$1) {
                    this.trigger('dragging', dragArgs);
                }
                else {
                    if (!(e.target.closest(this.dragArea)) && this.overflowMode !== 'Popup') {
                        document.body.style.cursor = 'not-allowed';
                        addClass([this.cloneElement], CLS_HIDDEN$1);
                        if (this.dragItem.classList.contains(CLS_HIDDEN$1)) {
                            removeClass([this.dragItem], CLS_HIDDEN$1);
                        }
                        this.dragItem.querySelector('.' + CLS_WRAP).style.visibility = 'visible';
                    }
                    else {
                        document.body.style.cursor = '';
                        this.dragItem.querySelector('.' + CLS_WRAP).style.visibility = 'hidden';
                        if (this.cloneElement.classList.contains(CLS_HIDDEN$1)) {
                            removeClass([this.cloneElement], CLS_HIDDEN$1);
                        }
                    }
                    if (this.overflowMode === 'Scrollable' && !isNullOrUndefined(this.element.querySelector('.e-hscroll'))) {
                        let scrollRightNavEle = this.element.querySelector('.e-scroll-right-nav');
                        let scrollLeftNavEle = this.element.querySelector('.e-scroll-left-nav');
                        let hscrollBar = this.element.querySelector('.e-hscroll-bar');
                        if (!isNullOrUndefined(scrollRightNavEle) && Math.abs((scrollRightNavEle.offsetWidth / 2) +
                            scrollRightNavEle.offsetLeft) > this.cloneElement.offsetLeft + this.cloneElement.offsetWidth) {
                            hscrollBar.scrollLeft -= 10;
                        }
                        if (!isNullOrUndefined(scrollLeftNavEle) && Math.abs((scrollLeftNavEle.offsetLeft + scrollLeftNavEle.offsetWidth) -
                            this.cloneElement.offsetLeft) > (scrollLeftNavEle.offsetWidth / 2)) {
                            hscrollBar.scrollLeft += 10;
                        }
                    }
                    this.cloneElement.style.pointerEvents = 'none';
                    let x = this.cloneElement.getBoundingClientRect().left;
                    let y = this.cloneElement.getBoundingClientRect().top;
                    let ele = document.elementFromPoint(x, y);
                    dropItem = closest(ele, '.' + CLS_TB_ITEM);
                    let scrollContentWidth = 0;
                    if (this.overflowMode === 'Scrollable' && !isNullOrUndefined(this.element.querySelector('.e-hscroll'))) {
                        scrollContentWidth = this.element.querySelector('.e-hscroll-content').offsetWidth;
                    }
                    if (dropItem != null && !dropItem.isSameNode(this.dragItem) &&
                        dropItem.closest('.' + CLS_TAB).isSameNode(this.dragItem.closest('.' + CLS_TAB))) {
                        dropIndex = this.getEleIndex(dropItem);
                        if (dropIndex < dragIndex &&
                            (Math.abs((dropItem.offsetLeft + dropItem.offsetWidth) -
                                this.cloneElement.offsetLeft) > (dropItem.offsetWidth / 2))) {
                            this.dragAction(dropItem, dragIndex, dropIndex);
                        }
                        if (dropIndex > dragIndex &&
                            (Math.abs(dropItem.offsetWidth / 2) + dropItem.offsetLeft -
                                scrollContentWidth) < this.cloneElement.offsetLeft + this.cloneElement.offsetWidth) {
                            this.dragAction(dropItem, dragIndex, dropIndex);
                        }
                    }
                    this.droppedIndex = this.getEleIndex(this.dragItem);
                    this.trigger('dragging', dragArgs);
                }
            },
            dragStop: this.itemDragStop.bind(this)
        });
        this.draggableItems.push(dragObj);
    }
    helper(e) {
        this.cloneElement = this.createElement('div');
        if (e.element) {
            this.cloneElement = (e.element.cloneNode(true));
            addClass([this.cloneElement], 'e-tab-clone-element');
            if (this.element.querySelector('.' + CLS_HEADER$1).classList.contains(CLS_CLOSE_SHOW)) {
                addClass([this.cloneElement], CLS_CLOSE_SHOW);
            }
            removeClass([this.cloneElement.querySelector('.' + CLS_WRAP)], 'e-ripple');
            if (!isNullOrUndefined(this.cloneElement.querySelector('.e-ripple-element'))) {
                remove(this.cloneElement.querySelector('.e-ripple-element'));
            }
            document.body.appendChild(this.cloneElement);
        }
        return this.cloneElement;
    }
    itemDragStart(e) {
        this.draggingItems = this.items.map((x) => x);
        this.dragItem = e.element;
        let dragArgs = {
            draggedItem: e.element,
            event: e.event,
            target: e.target,
            droppedItem: null,
            index: this.getEleIndex(this.dragItem),
            clonedElement: this.cloneElement,
            cancel: false
        };
        this.trigger('onDragStart', dragArgs, (tabitemDragArgs) => {
            if (tabitemDragArgs.cancel) {
                detach(this.cloneElement);
            }
            else {
                this.removeActiveClass();
                addClass([this.tbItems.querySelector('.' + CLS_INDICATOR)], CLS_HIDDEN$1);
                this.dragItem.querySelector('.' + CLS_WRAP).style.visibility = 'hidden';
            }
            if (isBlazor()) {
                e.bindEvents(getElement(e.dragElement));
            }
        });
    }
    dragAction(dropItem, dragsIndex, dropIndex) {
        if (this.items.length > 0) {
            let item = this.draggingItems[dragsIndex];
            this.draggingItems.splice(dragsIndex, 1);
            this.draggingItems.splice(dropIndex, 0, item);
        }
        if (this.overflowMode === 'MultiRow') {
            dropItem.parentNode.insertBefore(this.dragItem, dropItem.nextElementSibling);
        }
        if (dragsIndex > dropIndex) {
            if (!(this.dragItem.parentElement).isSameNode(dropItem.parentElement)) {
                if (this.overflowMode === 'Extended') {
                    if (dropItem.isSameNode(dropItem.parentElement.lastChild)) {
                        let popupContainer = this.dragItem.parentNode;
                        dropItem.parentNode.insertBefore(this.dragItem, dropItem);
                        popupContainer.insertBefore(dropItem.parentElement.lastChild, popupContainer.childNodes[0]);
                    }
                    else {
                        this.dragItem.parentNode.insertBefore((dropItem.parentElement.lastChild), this.dragItem.parentElement.childNodes[0]);
                        dropItem.parentNode.insertBefore(this.dragItem, dropItem);
                    }
                }
                else {
                    let lastEle = (dropItem.parentElement).lastChild;
                    if (dropItem.isSameNode(lastEle)) {
                        let popupContainer = this.dragItem.parentNode;
                        dropItem.parentNode.insertBefore(this.dragItem, dropItem);
                        popupContainer.insertBefore(lastEle, popupContainer.childNodes[0]);
                    }
                    else {
                        this.dragItem.parentNode.insertBefore((dropItem.parentElement).lastChild, this.dragItem.parentElement.childNodes[0]);
                        dropItem.parentNode.insertBefore(this.dragItem, dropItem);
                    }
                }
            }
            else {
                this.dragItem.parentNode.insertBefore(this.dragItem, dropItem);
            }
        }
        if (dragsIndex < dropIndex) {
            if (!(this.dragItem.parentElement).isSameNode(dropItem.parentElement)) {
                if (this.overflowMode === 'Extended') {
                    this.dragItem.parentElement.appendChild(dropItem.parentElement.firstElementChild);
                    dropItem.parentNode.insertBefore(this.dragItem, dropItem.nextSibling);
                }
                else {
                    this.dragItem.parentNode.insertBefore((dropItem.parentElement).lastChild, this.dragItem.parentElement.childNodes[0]);
                    dropItem.parentNode.insertBefore(this.dragItem, dropItem);
                }
            }
            else {
                this.dragItem.parentNode.insertBefore(dropItem, this.dragItem);
            }
        }
    }
    itemDragStop(e) {
        detach(this.cloneElement);
        this.dragItem.querySelector('.' + CLS_WRAP).style.visibility = 'visible';
        document.body.style.cursor = '';
        let dragStopArgs = {
            draggedItem: this.dragItem,
            event: e.event,
            target: e.target,
            droppedItem: this.tbItem[this.droppedIndex],
            clonedElement: null,
            index: this.droppedIndex,
            cancel: false
        };
        this.trigger('dragged', dragStopArgs, (tabItemDropArgs) => {
            if (tabItemDropArgs.cancel) {
                this.refresh();
            }
            else {
                if (this.items.length > 0 && this.draggingItems.length > 0) {
                    this.items = this.draggingItems;
                    this.selectedItem = this.droppedIndex;
                    this.refresh();
                }
                else {
                    this.dragItem.querySelector('.' + CLS_WRAP).style.visibility = '';
                    removeClass([this.tbItems.querySelector('.' + CLS_INDICATOR)], CLS_HIDDEN$1);
                    this.select(this.droppedIndex);
                }
            }
        });
    }
    /**
     * Enables or disables the specified Tab item. On passing value as `false`, the item will be disabled.
     *
     * @param  {number} index - Index value of target Tab item.
     * @param  {boolean} value - Boolean value that determines whether the command should be enabled or disabled.
     * By default, isEnable is true.
     * @returns {void}.
     */
    enableTab(index, value) {
        const tbItems = selectAll('.' + CLS_TB_ITEM, this.element)[index];
        if (isNullOrUndefined(tbItems)) {
            return;
        }
        if (value === true) {
            tbItems.classList.remove(CLS_DISABLE$4, CLS_OVERLAY$2);
            tbItems.firstElementChild.setAttribute('tabindex', '-1');
        }
        else {
            tbItems.classList.add(CLS_DISABLE$4, CLS_OVERLAY$2);
            tbItems.firstElementChild.removeAttribute('tabindex');
            if (tbItems.classList.contains(CLS_ACTIVE$1)) {
                this.select(index + 1);
            }
        }
        if (!isNullOrUndefined(this.items[index])) {
            this.items[index].disabled = !value;
            this.dataBind();
        }
        tbItems.setAttribute('aria-disabled', (value === true) ? 'false' : 'true');
    }
    /**
     * Adds new items to the Tab that accepts an array as Tab items.
     *
     * @param  {TabItemModel[]} items - An array of item that is added to the Tab.
     * @param  {number} index - Number value that determines where the items to be added. By default, index is 0.
     * @returns {void}.
     */
    addTab(items, index) {
        const addArgs = { addedItems: items, cancel: false };
        if (!this.isReplace) {
            this.trigger('adding', addArgs, (tabAddingArgs) => {
                if (!tabAddingArgs.cancel) {
                    this.addingTabContent(items, index);
                }
            });
        }
        else {
            this.addingTabContent(items, index);
        }
        if (this.isReact) {
            this.renderReactTemplates();
        }
    }
    addingTabContent(items, index) {
        let lastEleIndex = 0;
        this.hdrEle = select('.' + CLS_HEADER$1, this.element);
        if (isNullOrUndefined(this.hdrEle)) {
            this.items = items;
            this.reRenderItems();
        }
        else {
            const itemsCount = selectAll('.' + CLS_TB_ITEM, this.element).length;
            if (itemsCount !== 0) {
                lastEleIndex = this.lastIndex + 1;
            }
            if (isNullOrUndefined(index)) {
                index = itemsCount - 1;
            }
            if (itemsCount < index || index < 0 || isNaN(index)) {
                return;
            }
            if (itemsCount === 0 && !isNullOrUndefined(this.hdrEle)) {
                this.hdrEle.style.display = '';
            }
            if (!isNullOrUndefined(this.bdrLine)) {
                this.bdrLine.classList.add(CLS_HIDDEN$1);
            }
            this.tbItems = select('.' + CLS_TB_ITEMS, this.getTabHeader());
            this.isAdd = true;
            const tabItems = this.parseObject(items, index);
            this.isAdd = false;
            let i = 0;
            let textValue;
            items.forEach((item, place) => {
                textValue = item.headerTemplate || item.header.text;
                if (!(isNullOrUndefined(item.headerTemplate || item.header) ||
                    isNullOrUndefined(textValue) || (textValue.length === 0) && isNullOrUndefined(item.header.iconCss))) {
                    this.items.splice((index + i), 0, item);
                    i++;
                }
                if (this.isTemplate && !isNullOrUndefined(item.header) && !isNullOrUndefined(item.header.text)) {
                    const no = lastEleIndex + place;
                    const ele = this.createElement('div', {
                        id: CLS_CONTENT$1 + this.tabId + '_' + no, className: CLS_ITEM$2,
                        attrs: { role: 'tabpanel', 'aria-labelledby': CLS_ITEM$2 + '_' + no }
                    });
                    this.cntEle.insertBefore(ele, this.cntEle.children[(index + place)]);
                    const eleTrg = this.getTrgContent(this.cntEle, no.toString());
                    this.getContent(eleTrg, item.content, 'render', index);
                }
            });
            this.tbObj.addItems(tabItems, index);
            if (!this.isReplace) {
                this.trigger('added', { addedItems: items });
            }
            if (this.selectedItem === index) {
                this.select(index);
            }
            else {
                this.setActiveBorder();
            }
            this.bindDraggable();
        }
    }
    /**
     * Removes the items in the Tab from the specified index.
     *
     * @param  {number} index - Index of target item that is going to be removed.
     * @returns {void}.
     */
    removeTab(index) {
        const trg = selectAll('.' + CLS_TB_ITEM, this.element)[index];
        if (isNullOrUndefined(trg)) {
            return;
        }
        const removeArgs = { removedItem: trg, removedIndex: index, cancel: false };
        this.trigger('removing', removeArgs, (tabRemovingArgs) => {
            if (!tabRemovingArgs.cancel) {
                this.tbObj.removeItems(index);
                if (this.allowDragAndDrop && (index !== Array.prototype.indexOf.call(this.itemIndexArray, trg.id))) {
                    index = Array.prototype.indexOf.call(this.itemIndexArray, trg.id);
                }
                this.items.splice(index, 1);
                this.itemIndexArray.splice(index, 1);
                this.refreshActiveBorder();
                const cntTrg = select('#' + CLS_CONTENT$1 + this.tabId + '_' + this.extIndex(trg.id), select('.' + CLS_CONTENT$1, this.element));
                if (!isNullOrUndefined(cntTrg)) {
                    detach(cntTrg);
                }
                this.trigger('removed', tabRemovingArgs);
                if (trg.classList.contains(CLS_ACTIVE$1)) {
                    index = (index > selectAll('.' + CLS_TB_ITEM + ':not(.' + CLS_TB_POPUP + ')', this.element).length - 1) ? index - 1 : index;
                    this.enableAnimation = false;
                    this.selectedItem = index;
                    this.select(index);
                }
                if (selectAll('.' + CLS_TB_ITEM, this.element).length === 0) {
                    this.hdrEle.style.display = 'none';
                }
                this.enableAnimation = true;
            }
        });
    }
    /**
     * Shows or hides the Tab that is in the specified index.
     *
     * @param  {number} index - Index value of target item.
     * @param  {boolean} value - Based on this Boolean value, item will be hide (false) or show (true). By default, value is true.
     * @returns {void}.
     */
    hideTab(index, value) {
        let items;
        const item = selectAll('.' + CLS_TB_ITEM, this.element)[index];
        if (isNullOrUndefined(item)) {
            return;
        }
        if (isNullOrUndefined(value)) {
            value = true;
        }
        this.bdrLine.classList.add(CLS_HIDDEN$1);
        if (value === true) {
            item.classList.add(CLS_HIDDEN$1);
            items = selectAll('.' + CLS_TB_ITEM + ':not(.' + CLS_HIDDEN$1 + ')', this.tbItems);
            if (items.length !== 0 && item.classList.contains(CLS_ACTIVE$1)) {
                if (index !== 0) {
                    for (let i = index - 1; i >= 0; i--) {
                        if (!this.tbItem[i].classList.contains(CLS_HIDDEN$1)) {
                            this.select(i);
                            break;
                        }
                        else if (i === 0) {
                            for (let k = index + 1; k < this.tbItem.length; k++) {
                                if (!this.tbItem[k].classList.contains(CLS_HIDDEN$1)) {
                                    this.select(k);
                                    break;
                                }
                            }
                        }
                    }
                }
                else {
                    for (let k = index + 1; k < this.tbItem.length; k++) {
                        if (!this.tbItem[k].classList.contains(CLS_HIDDEN$1)) {
                            this.select(k);
                            break;
                        }
                    }
                }
            }
            else if (items.length === 0) {
                this.element.classList.add(CLS_HIDDEN$1);
            }
        }
        else {
            this.element.classList.remove(CLS_HIDDEN$1);
            items = selectAll('.' + CLS_TB_ITEM + ':not(.' + CLS_HIDDEN$1 + ')', this.tbItems);
            item.classList.remove(CLS_HIDDEN$1);
            if (items.length === 0) {
                this.select(index);
            }
        }
        this.setActiveBorder();
        item.setAttribute('aria-hidden', '' + value);
        if (!this.isServerRendered && this.overflowMode === 'Popup' && this.tbObj) {
            this.tbObj.refreshOverflow();
        }
    }
    /**
     * Specifies the index or HTMLElement to select an item from the Tab.
     *
     * @param  {number | HTMLElement} args - Index or DOM element is used for selecting an item from the Tab.
     * @param {Event} event - An event which takes place in DOM.
     * @returns {void}.
     */
    select(args, event) {
        const tabHeader = this.getTabHeader();
        this.tbItems = select('.' + CLS_TB_ITEMS, tabHeader);
        this.tbItem = selectAll('.' + CLS_TB_ITEM, tabHeader);
        this.content = select('.' + CLS_CONTENT$1, this.element);
        this.prevItem = this.tbItem[this.prevIndex];
        if (isNullOrUndefined(this.selectedItem) || (this.selectedItem < 0) || (this.tbItem.length <= this.selectedItem) || isNaN(this.selectedItem)) {
            this.selectedItem = 0;
        }
        else {
            this.selectedID = this.extIndex(this.tbItem[this.selectedItem].id);
        }
        const trg = this.tbItem[args];
        if (isNullOrUndefined(trg)) {
            this.selectedID = '0';
        }
        else {
            this.selectingID = this.extIndex(trg.id);
        }
        if (!isNullOrUndefined(this.prevItem) && !this.prevItem.classList.contains(CLS_DISABLE$4)) {
            this.prevItem.children.item(0).setAttribute('tabindex', '-1');
        }
        const eventArg = {
            event: event,
            previousItem: this.prevItem,
            previousIndex: this.prevIndex,
            selectedItem: this.tbItem[this.selectedItem],
            selectedIndex: this.selectedItem,
            selectedContent: !isNullOrUndefined(this.content) ?
                select('#' + CLS_CONTENT$1 + this.tabId + '_' + this.selectedID, this.content) : null,
            selectingItem: trg,
            selectingIndex: args,
            selectingContent: !isNullOrUndefined(this.content) ?
                select('#' + CLS_CONTENT$1 + this.tabId + '_' + this.selectingID, this.content) : null,
            isSwiped: this.isSwipeed,
            cancel: false
        };
        if (!this.initRender) {
            this.trigger('selecting', eventArg, (selectArgs) => {
                if (!selectArgs.cancel) {
                    this.selectingContent(args);
                }
            });
        }
        else {
            this.selectingContent(args);
        }
    }
    selectingContent(args) {
        if (typeof args === 'number') {
            if (!isNullOrUndefined(this.tbItem[args]) && (this.tbItem[args].classList.contains(CLS_DISABLE$4) ||
                this.tbItem[args].classList.contains(CLS_HIDDEN$1))) {
                for (let i = args + 1; i < this.items.length; i++) {
                    if (this.items[i].disabled === false && this.items[i].visible === true) {
                        args = i;
                        break;
                    }
                    else {
                        args = 0;
                    }
                }
            }
            if (this.tbItem.length > args && args >= 0 && !isNaN(args)) {
                this.prevIndex = this.selectedItem;
                if (this.tbItem[args].classList.contains(CLS_TB_POPUP)) {
                    this.setActive(this.popupHandler(this.tbItem[args]));
                    if ((!isNullOrUndefined(this.items) && this.items.length > 0) && this.allowDragAndDrop) {
                        this.tbItem = selectAll('.' + CLS_TB_ITEMS + ' .' + CLS_TB_ITEM, this.hdrEle);
                        let item = this.items[args];
                        this.items.splice(args, 1);
                        this.items.splice(this.tbItem.length - 1, 0, item);
                    }
                }
                else {
                    this.setActive(args);
                }
            }
            else {
                this.setActive(0);
            }
        }
        else if (args instanceof (HTMLElement)) {
            this.setActive(this.getEleIndex(args));
        }
    }
    /**
     * Gets the item index from the Tab.
     *
     * @param  {string} tabItemId - Item ID is used for getting index from the Tab.
     * @returns {number} - It returns item index.
     */
    getItemIndex(tabItemId) {
        let tabIndex;
        for (let i = 0; i < this.tbItem.length; i++) {
            const value = this.tbItem[i].getAttribute('data-id');
            if (tabItemId === value) {
                tabIndex = i;
                break;
            }
        }
        return tabIndex;
    }
    /**
     * Specifies the value to disable/enable the Tab component.
     * When set to `true`, the component will be disabled.
     *
     * @param  {boolean} value - Based on this Boolean value, Tab will be enabled (false) or disabled (true).
     * @returns {void}.
     */
    disable(value) {
        this.setCssClass(this.element, CLS_DISABLE$4, value);
        this.element.setAttribute('aria-disabled', '' + value);
    }
    /**
     * Get the properties to be maintained in the persisted state.
     *
     * @returns {string} - It returns the persisted state.
     */
    getPersistData() {
        return this.addOnPersist(['selectedItem', 'actEleId']);
    }
    /**
     * Returns the current module name.
     *
     * @returns {string} - It returns the current module name.
     * @private
     */
    getModuleName() {
        return 'tab';
    }
    /**
     * Gets called when the model property changes.The data that describes the old and new values of the property that changed.
     *
     * @param  {TabModel} newProp - It contains the new value of data.
     * @param  {TabModel} oldProp - It contains the old value of data.
     * @returns {void}
     * @private
     */
    onPropertyChanged(newProp, oldProp) {
        for (const prop of Object.keys(newProp)) {
            switch (prop) {
                case 'width':
                    setStyleAttribute(this.element, { width: formatUnit(newProp.width) });
                    break;
                case 'height':
                    setStyleAttribute(this.element, { height: formatUnit(newProp.height) });
                    if (!this.isServerRendered) {
                        this.setContentHeight(false);
                    }
                    break;
                case 'cssClass':
                    if (oldProp.cssClass !== '') {
                        this.setCssClass(this.element, oldProp.cssClass, false);
                        this.setCssClass(this.element, newProp.cssClass, true);
                    }
                    else {
                        this.setCssClass(this.element, newProp.cssClass, true);
                    }
                    break;
                case 'items':
                    if (!this.isServerRendered) {
                        this.evalOnPropertyChangeItems(newProp, oldProp);
                    }
                    break;
                case 'showCloseButton':
                    this.setCloseButton(newProp.showCloseButton);
                    break;
                case 'selectedItem':
                    if (!this.isServerRendered) {
                        this.selectedItem = oldProp.selectedItem;
                        this.select(newProp.selectedItem);
                    }
                    break;
                case 'headerPlacement':
                    if (this.isServerRendered) {
                        this.serverChangeOrientation(newProp.headerPlacement, oldProp.headerPlacement);
                    }
                    else {
                        this.changeOrientation(newProp.headerPlacement);
                    }
                    break;
                case 'enableRtl':
                    this.setRTL(newProp.enableRtl);
                    break;
                case 'overflowMode':
                    this.tbObj.overflowMode = newProp.overflowMode;
                    this.tbObj.dataBind();
                    this.refreshActElePosition();
                    break;
                case 'heightAdjustMode':
                    if (!this.isServerRendered) {
                        this.setContentHeight(false);
                        this.select(this.selectedItem);
                    }
                    break;
                case 'scrollStep':
                    if (this.tbObj) {
                        this.tbObj.scrollStep = this.scrollStep;
                    }
                    break;
                case 'allowDragAndDrop':
                    this.bindDraggable();
                    break;
                case 'dragArea':
                    if (this.allowDragAndDrop) {
                        this.draggableItems.forEach((item) => {
                            item.dragArea = this.dragArea;
                        });
                        this.refresh();
                    }
                    break;
            }
        }
    }
    refreshActiveTab() {
        if (this.isReact) {
            this.clearTemplate();
        }
        if (!this.isTemplate) {
            if (this.element.querySelector('.' + CLS_TB_ITEM + '.' + CLS_ACTIVE$1)) {
                detach(this.element.querySelector('.' + CLS_TB_ITEM + '.' + CLS_ACTIVE$1).children[0]);
                detach(this.element.querySelector('.' + CLS_CONTENT$1).querySelector('.' + CLS_ACTIVE$1).children[0]);
                const item = this.items[this.selectedItem];
                const pos = (isNullOrUndefined(item.header) || isNullOrUndefined(item.header.iconPosition)) ? '' : item.header.iconPosition;
                const css = (isNullOrUndefined(item.header) || isNullOrUndefined(item.header.iconCss)) ? '' : item.header.iconCss;
                const text = item.headerTemplate || item.header.text;
                const txtWrap = this.createElement('div', { className: CLS_TEXT, attrs: { 'role': 'presentation' } });
                if (!isNullOrUndefined(text.tagName)) {
                    txtWrap.appendChild(text);
                }
                else {
                    this.headerTextCompile(txtWrap, text, this.selectedItem);
                }
                let tEle;
                const icon = this.createElement('span', {
                    className: CLS_ICONS + ' ' + CLS_TAB_ICON + ' ' + CLS_ICON + '-' + pos + ' ' + css
                });
                const tConts = this.createElement('div', { className: CLS_TEXT_WRAP });
                tConts.appendChild(txtWrap);
                if ((text !== '' && text !== undefined) && css !== '') {
                    if ((pos === 'left' || pos === 'top')) {
                        tConts.insertBefore(icon, tConts.firstElementChild);
                    }
                    else {
                        tConts.appendChild(icon);
                    }
                    tEle = txtWrap;
                    this.isIconAlone = false;
                }
                else {
                    tEle = ((css === '') ? txtWrap : icon);
                    if (tEle === icon) {
                        detach(txtWrap);
                        tConts.appendChild(icon);
                        this.isIconAlone = true;
                    }
                }
                const wrapAtt = (item.disabled) ? {} : { tabIndex: '-1' };
                tConts.appendChild(this.btnCls.cloneNode(true));
                const wraper = this.createElement('div', { className: CLS_WRAP, attrs: wrapAtt });
                wraper.appendChild(tConts);
                if (pos === 'top' || pos === 'bottom') {
                    this.element.classList.add('e-vertical-icon');
                }
                this.element.querySelector('.' + CLS_TB_ITEM + '.' + CLS_ACTIVE$1).appendChild(wraper);
                const crElem = this.createElement('div');
                let cnt = item.content;
                let eleStr;
                if (typeof cnt === 'string' || isNullOrUndefined(cnt.innerHTML)) {
                    if (typeof cnt === 'string' && this.enableHtmlSanitizer) {
                        cnt = SanitizeHtmlHelper.sanitize(cnt);
                    }
                    if (cnt[0] === '.' || cnt[0] === '#') {
                        if (document.querySelectorAll(cnt).length) {
                            const eleVal = document.querySelector(cnt);
                            eleStr = eleVal.outerHTML.trim();
                            crElem.appendChild(eleVal);
                            eleVal.style.display = '';
                        }
                        else {
                            this.compileElement(crElem, cnt, 'content', this.selectedItem);
                        }
                    }
                    else {
                        this.compileElement(crElem, cnt, 'content', this.selectedItem);
                    }
                }
                else {
                    crElem.appendChild(cnt);
                }
                if (!isNullOrUndefined(eleStr)) {
                    if (this.templateEle.indexOf(cnt.toString()) === -1) {
                        this.templateEle.push(cnt.toString());
                    }
                }
                this.element.querySelector('.' + CLS_ITEM$2 + '.' + CLS_ACTIVE$1).appendChild(crElem);
            }
        }
        else {
            const tabItems = this.element.querySelector('.' + CLS_TB_ITEMS);
            const element = this.element.querySelector('.' + CLS_TB_ITEM + '.' + CLS_ACTIVE$1);
            const id = element.id;
            const num = (id.indexOf('_'));
            const index = parseInt(id.substring(num + 1), 10);
            const header = element.innerText;
            const detachContent = this.element.querySelector('.' + CLS_CONTENT$1).querySelector('.' + CLS_ACTIVE$1).children[0];
            const mainContents = detachContent.innerHTML;
            detach(element);
            detach(detachContent);
            const attr = {
                className: CLS_TB_ITEM + ' ' + CLS_TEMPLATE$1 + ' ' + CLS_ACTIVE$1, id: CLS_ITEM$2 + this.tabId + '_' + index,
                attrs: {
                    role: 'tab', 'aria-controls': CLS_CONTENT$1 + this.tabId + '_' + index,
                    'aria-disabled': 'false', 'aria-selected': 'true'
                }
            };
            const txtString = this.createElement('span', {
                className: CLS_TEXT, innerHTML: header, attrs: { 'role': 'presentation' }
            }).outerHTML;
            const conte = this.createElement('div', {
                className: CLS_TEXT_WRAP, innerHTML: txtString + this.btnCls.outerHTML
            }).outerHTML;
            const wrap = this.createElement('div', { className: CLS_WRAP, innerHTML: conte, attrs: { tabIndex: '-1' } });
            tabItems.insertBefore(this.createElement('div', attr), tabItems.children[index + 1]);
            this.element.querySelector('.' + CLS_TB_ITEM + '.' + CLS_ACTIVE$1).appendChild(wrap);
            const crElem = this.createElement('div', { innerHTML: mainContents });
            this.element.querySelector('.' + CLS_CONTENT$1).querySelector('.' + CLS_ACTIVE$1).appendChild(crElem);
        }
        if (this.isReact) {
            this.renderReactTemplates();
        }
    }
};
__decorate$7([
    Collection([], TabItem)
], Tab.prototype, "items", void 0);
__decorate$7([
    Property('100%')
], Tab.prototype, "width", void 0);
__decorate$7([
    Property('auto')
], Tab.prototype, "height", void 0);
__decorate$7([
    Property('')
], Tab.prototype, "cssClass", void 0);
__decorate$7([
    Property(0)
], Tab.prototype, "selectedItem", void 0);
__decorate$7([
    Property('Top')
], Tab.prototype, "headerPlacement", void 0);
__decorate$7([
    Property('Content')
], Tab.prototype, "heightAdjustMode", void 0);
__decorate$7([
    Property('Scrollable')
], Tab.prototype, "overflowMode", void 0);
__decorate$7([
    Property('Dynamic')
], Tab.prototype, "loadOn", void 0);
__decorate$7([
    Property(false)
], Tab.prototype, "enablePersistence", void 0);
__decorate$7([
    Property(false)
], Tab.prototype, "enableHtmlSanitizer", void 0);
__decorate$7([
    Property(false)
], Tab.prototype, "showCloseButton", void 0);
__decorate$7([
    Property()
], Tab.prototype, "scrollStep", void 0);
__decorate$7([
    Property()
], Tab.prototype, "dragArea", void 0);
__decorate$7([
    Property(false)
], Tab.prototype, "allowDragAndDrop", void 0);
__decorate$7([
    Complex({}, TabAnimationSettings)
], Tab.prototype, "animation", void 0);
__decorate$7([
    Event()
], Tab.prototype, "created", void 0);
__decorate$7([
    Event()
], Tab.prototype, "adding", void 0);
__decorate$7([
    Event()
], Tab.prototype, "added", void 0);
__decorate$7([
    Event()
], Tab.prototype, "selecting", void 0);
__decorate$7([
    Event()
], Tab.prototype, "selected", void 0);
__decorate$7([
    Event()
], Tab.prototype, "removing", void 0);
__decorate$7([
    Event()
], Tab.prototype, "removed", void 0);
__decorate$7([
    Event()
], Tab.prototype, "onDragStart", void 0);
__decorate$7([
    Event()
], Tab.prototype, "dragging", void 0);
__decorate$7([
    Event()
], Tab.prototype, "dragged", void 0);
__decorate$7([
    Event()
], Tab.prototype, "destroyed", void 0);
Tab = __decorate$7([
    NotifyPropertyChanges
], Tab);

/**
 * Tab modules
 */

var __decorate$8 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var TreeView_1;
const ROOT = 'e-treeview';
const CONTROL = 'e-control';
const COLLAPSIBLE = 'e-icon-collapsible';
const EXPANDABLE = 'e-icon-expandable';
const LISTITEM = 'e-list-item';
const LISTTEXT = 'e-list-text';
const PARENTITEM = 'e-list-parent';
const HOVER = 'e-hover';
const ACTIVE = 'e-active';
const LOAD = 'e-icons-spinner';
const PROCESS = 'e-process';
const ICON = 'e-icons';
const TEXTWRAP = 'e-text-content';
const INPUT = 'e-input';
const INPUTGROUP = 'e-input-group';
const TREEINPUT = 'e-tree-input';
const EDITING = 'e-editing';
const RTL$1 = 'e-rtl';
const INTERACTION = 'e-interaction';
const DRAGITEM = 'e-drag-item';
const DROPPABLE = 'e-droppable';
const DRAGGING = 'e-dragging';
const SIBLING = 'e-sibling';
const DROPIN = 'e-drop-in';
const DROPNEXT = 'e-drop-next';
const DROPOUT = 'e-drop-out';
const NODROP = 'e-no-drop';
const FULLROWWRAP = 'e-fullrow-wrap';
const FULLROW = 'e-fullrow';
const SELECTED$1 = 'e-selected';
const EXPANDED = 'e-expanded';
const NODECOLLAPSED = 'e-node-collapsed';
const DISABLE = 'e-disable';
const DROPCOUNT = 'e-drop-count';
const CHECK = 'e-check';
const INDETERMINATE = 'e-stop';
const CHECKBOXWRAP = 'e-checkbox-wrapper';
const CHECKBOXFRAME = 'e-frame';
const CHECKBOXRIPPLE = 'e-ripple-container';
const RIPPLE = 'e-ripple';
const RIPPLEELMENT = 'e-ripple-element';
const FOCUS = 'e-node-focus';
const IMAGE = 'e-list-img';
const BIGGER = 'e-bigger';
const SMALL = 'e-small';
const CHILD = 'e-has-child';
const ITEM_ANIMATION_ACTIVE = 'e-animation-active';
const DISABLED$1 = 'e-disabled';
const treeAriaAttr = {
    treeRole: 'tree',
    itemRole: 'treeitem',
    listRole: 'group',
    itemText: '',
    wrapperRole: ''
};
/**
 * Configures the fields to bind to the properties of node in the TreeView component.
 */
class FieldsSettings extends ChildProperty {
}
__decorate$8([
    Property('child')
], FieldsSettings.prototype, "child", void 0);
__decorate$8([
    Property([])
], FieldsSettings.prototype, "dataSource", void 0);
__decorate$8([
    Property('expanded')
], FieldsSettings.prototype, "expanded", void 0);
__decorate$8([
    Property('hasChildren')
], FieldsSettings.prototype, "hasChildren", void 0);
__decorate$8([
    Property('htmlAttributes')
], FieldsSettings.prototype, "htmlAttributes", void 0);
__decorate$8([
    Property('iconCss')
], FieldsSettings.prototype, "iconCss", void 0);
__decorate$8([
    Property('id')
], FieldsSettings.prototype, "id", void 0);
__decorate$8([
    Property('imageUrl')
], FieldsSettings.prototype, "imageUrl", void 0);
__decorate$8([
    Property('isChecked')
], FieldsSettings.prototype, "isChecked", void 0);
__decorate$8([
    Property('parentID')
], FieldsSettings.prototype, "parentID", void 0);
__decorate$8([
    Property(null)
], FieldsSettings.prototype, "query", void 0);
__decorate$8([
    Property('selected')
], FieldsSettings.prototype, "selected", void 0);
__decorate$8([
    Property(null)
], FieldsSettings.prototype, "tableName", void 0);
__decorate$8([
    Property('text')
], FieldsSettings.prototype, "text", void 0);
__decorate$8([
    Property('tooltip')
], FieldsSettings.prototype, "tooltip", void 0);
__decorate$8([
    Property('navigateUrl')
], FieldsSettings.prototype, "navigateUrl", void 0);
/**
 * Configures animation settings for the TreeView component.
 */
class ActionSettings extends ChildProperty {
}
__decorate$8([
    Property('SlideDown')
], ActionSettings.prototype, "effect", void 0);
__decorate$8([
    Property(400)
], ActionSettings.prototype, "duration", void 0);
__decorate$8([
    Property('linear')
], ActionSettings.prototype, "easing", void 0);
/**
 * Configures the animation settings for expanding and collapsing nodes in TreeView.
 */
class NodeAnimationSettings extends ChildProperty {
}
__decorate$8([
    Complex({ effect: 'SlideUp', duration: 400, easing: 'linear' }, ActionSettings)
], NodeAnimationSettings.prototype, "collapse", void 0);
__decorate$8([
    Complex({ effect: 'SlideDown', duration: 400, easing: 'linear' }, ActionSettings)
], NodeAnimationSettings.prototype, "expand", void 0);
/**
 * The TreeView component is used to represent hierarchical data in a tree like structure with advanced
 * functions to perform edit, drag and drop, selection with check-box, and more.
 * ```html
 *  <div id="tree"></div>
 * ```
 * ```typescript
 *  let treeObj: TreeView = new TreeView();
 *  treeObj.appendTo('#tree');
 * ```
 */
let TreeView = TreeView_1 = class TreeView extends Component {
    constructor(options, element) {
        super(options, element);
        this.isRefreshed = false;
        this.preventExpand = false;
        this.checkedElement = [];
        this.disableNode = [];
        // eslint-disable-next-line
        this.validArr = [];
        this.validNodes = [];
        this.expandChildren = [];
        this.isFieldChange = false;
        this.changeDataSource = false;
        this.isBlazorExpandedNodes = [];
        this.hasTemplate = false;
        this.mouseDownStatus = false;
    }
    /**
     * Get component name.
     *
     * @returns {string} - returns module name.
     * @private
     */
    getModuleName() {
        return 'treeview';
    }
    /**
     * Initialize the event handler
     *
     * @returns {void}
     */
    preRender() {
        this.isBlazorPlatform = (isBlazor() && this.isServerRendered);
        this.checkActionNodes = [];
        this.parentNodeCheck = [];
        this.dragStartAction = false;
        this.isAnimate = false;
        this.keyConfigs = {
            escape: 'escape',
            end: 'end',
            enter: 'enter',
            f2: 'f2',
            home: 'home',
            moveDown: 'downarrow',
            moveLeft: 'leftarrow',
            moveRight: 'rightarrow',
            moveUp: 'uparrow',
            ctrlDown: 'ctrl+downarrow',
            ctrlUp: 'ctrl+uparrow',
            ctrlEnter: 'ctrl+enter',
            ctrlHome: 'ctrl+home',
            ctrlEnd: 'ctrl+end',
            ctrlA: 'ctrl+A',
            shiftDown: 'shift+downarrow',
            shiftUp: 'shift+uparrow',
            shiftEnter: 'shift+enter',
            shiftHome: 'shift+home',
            shiftEnd: 'shift+end',
            csDown: 'ctrl+shift+downarrow',
            csUp: 'ctrl+shift+uparrow',
            csEnter: 'ctrl+shift+enter',
            csHome: 'ctrl+shift+home',
            csEnd: 'ctrl+shift+end',
            space: 'space'
        };
        this.listBaseOption = {
            expandCollapse: true,
            showIcon: true,
            expandIconClass: EXPANDABLE,
            ariaAttributes: treeAriaAttr,
            expandIconPosition: 'Left',
            itemCreated: (e) => {
                this.beforeNodeCreate(e);
            },
            enableHtmlSanitizer: this.enableHtmlSanitizer,
            itemNavigable: this.fullRowNavigable
        };
        this.updateListProp(this.fields);
        this.aniObj = new Animation({});
        this.treeList = [];
        this.isLoaded = false;
        this.isInitalExpand = false;
        this.expandChildren = [];
        this.index = 0;
        this.setTouchClass();
        if (isNullOrUndefined(this.selectedNodes)) {
            this.setProperties({ selectedNodes: [] }, true);
        }
        if (isNullOrUndefined(this.checkedNodes)) {
            this.setProperties({ checkedNodes: [] }, true);
        }
        if (isNullOrUndefined(this.expandedNodes)) {
            this.setProperties({ expandedNodes: [] }, true);
        }
        else {
            this.isInitalExpand = true;
        }
    }
    /**
     * Get the properties to be maintained in the persisted state.
     *
     * @returns {string} - returns the persisted data
     * @hidden
     */
    getPersistData() {
        const keyEntity = ['selectedNodes', 'checkedNodes', 'expandedNodes'];
        return this.addOnPersist(keyEntity);
    }
    /**
     * To Initialize the control rendering
     *
     * @private
     * @returns {void}
     */
    render() {
        this.initialRender = true;
        this.blazorInitialRender = false;
        this.initialize();
        this.setDataBinding(false);
        this.setDisabledMode();
        this.setExpandOnType();
        if (!this.disabled) {
            this.setRipple();
        }
        this.wireEditingEvents(this.allowEditing);
        this.setDragAndDrop(this.allowDragAndDrop);
        if (!this.disabled) {
            this.wireEvents();
        }
        if (!this.isBlazorPlatform) {
            this.initialRender = false;
        }
        this.renderComplete();
    }
    initialize() {
        if (!this.isBlazorPlatform) {
            this.element.setAttribute('role', 'tree');
            this.element.setAttribute('tabindex', '0');
            this.element.setAttribute('aria-activedescendant', this.element.id + '_active');
            this.setCssClass(null, this.cssClass);
            this.setEnableRtl();
            this.setFullRow(this.fullRowSelect);
        }
        this.nodeTemplateFn = this.templateComplier(this.nodeTemplate);
    }
    setDisabledMode() {
        if (this.disabled) {
            this.element.classList.add(DISABLED$1);
        }
        else {
            this.element.classList.remove(DISABLED$1);
        }
    }
    setEnableRtl() {
        (this.enableRtl ? addClass : removeClass)([this.element], RTL$1);
    }
    setRipple() {
        const tempStr = '.' + FULLROW + ',.' + TEXTWRAP;
        const rippleModel = {
            selector: tempStr,
            ignore: '.' + TEXTWRAP + ' > .' + ICON + ',.' + INPUTGROUP + ',.' + INPUT + ', .' + CHECKBOXWRAP
        };
        this.rippleFn = rippleEffect(this.element, rippleModel);
        const iconModel = {
            selector: '.' + TEXTWRAP + ' > .' + ICON,
            isCenterRipple: true
        };
        this.rippleIconFn = rippleEffect(this.element, iconModel);
    }
    setFullRow(isEnabled) {
        (isEnabled ? addClass : removeClass)([this.element], FULLROWWRAP);
    }
    setMultiSelect(isEnabled) {
        const firstUl = select('.' + PARENTITEM, this.element);
        if (isEnabled) {
            firstUl.setAttribute('aria-multiselectable', 'true');
        }
        else {
            firstUl.removeAttribute('aria-multiselectable');
        }
    }
    // eslint-disable-next-line
    templateComplier(template) {
        if (template) {
            this.hasTemplate = true;
            // eslint-disable-next-line
            this.element.classList.add(INTERACTION);
            try {
                if (document.querySelectorAll(template).length) {
                    return compile(document.querySelector(template).innerHTML.trim());
                }
            }
            catch (e) {
                return compile(template);
            }
        }
        this.element.classList.remove(INTERACTION);
        return undefined;
    }
    setDataBinding(changeDataSource) {
        this.treeList.push('false');
        if (this.fields.dataSource instanceof DataManager) {
            /* eslint-disable */
            this.isOffline = (this.isBlazorPlatform ? this.fields.dataSource.offline :
                this.fields.dataSource.dataSource.offline);
            if (this.fields.dataSource.ready) {
                this.fields.dataSource.ready.then((e) => {
                    /* eslint-disable */
                    this.isOffline = (this.isBlazorPlatform ? this.fields.dataSource.offline :
                        this.fields.dataSource.dataSource.offline);
                    if (this.fields.dataSource instanceof DataManager && this.isOffline) {
                        this.treeList.pop();
                        this.treeData = e.result;
                        this.isNumberTypeId = this.getType();
                        this.setRootData();
                        this.renderItems(true);
                        if (this.treeList.length === 0 && !this.isLoaded) {
                            this.finalize();
                        }
                    }
                }).catch((e) => {
                    this.trigger('actionFailure', { error: e });
                });
            }
            else {
                this.fields.dataSource.executeQuery(this.getQuery(this.fields)).then((e) => {
                    this.treeList.pop();
                    this.treeData = e.result;
                    this.isNumberTypeId = this.getType();
                    this.setRootData();
                    if (changeDataSource) {
                        this.changeDataSource = true;
                    }
                    this.renderItems(true);
                    this.changeDataSource = false;
                    if (this.treeList.length === 0 && !this.isLoaded) {
                        this.finalize();
                    }
                }).catch((e) => {
                    this.trigger('actionFailure', { error: e });
                });
            }
        }
        else {
            this.treeList.pop();
            if (isNullOrUndefined(this.fields.dataSource)) {
                this.rootData = this.treeData = [];
            }
            else {
                this.treeData = JSON.parse(JSON.stringify(this.fields.dataSource));
                this.setRootData();
            }
            this.isNumberTypeId = this.getType();
            this.renderItems(false);
        }
        if (this.treeList.length === 0 && !this.isLoaded) {
            this.finalize();
        }
    }
    getQuery(mapper, value = null) {
        let columns = [];
        let query;
        if (!mapper.query) {
            query = new Query();
            let prop = this.getActualProperties(mapper);
            for (let col of Object.keys(prop)) {
                if (col !== 'dataSource' && col !== 'tableName' && col !== 'child' && !!mapper[col]
                    && col !== 'url' && columns.indexOf(mapper[col]) === -1) {
                    columns.push(mapper[col]);
                }
            }
            query.select(columns);
            if (prop.hasOwnProperty('tableName')) {
                query.from(mapper.tableName);
            }
        }
        else {
            query = mapper.query.clone();
        }
        ListBase.addSorting(this.sortOrder, mapper.text, query);
        if (!isNullOrUndefined(value) && !isNullOrUndefined(mapper.parentID)) {
            query.where(mapper.parentID, 'equal', (this.isNumberTypeId ? parseFloat(value) : value));
        }
        return query;
    }
    getType() {
        return this.treeData[0] ? ((typeof getValue(this.fields.id, this.treeData[0]) === 'number') ? true : false) : false;
    }
    setRootData() {
        this.dataType = this.getDataType(this.treeData, this.fields);
        if (this.dataType === 1) {
            this.groupedData = this.getGroupedData(this.treeData, this.fields.parentID);
            let rootItems = this.getChildNodes(this.treeData, undefined, true);
            if (isNullOrUndefined(rootItems)) {
                this.rootData = [];
            }
            else {
                this.rootData = rootItems;
            }
        }
        else {
            this.rootData = this.treeData;
        }
    }
    renderItems(isSorted) {
        /* eslint-disable */
        if (!this.isBlazorPlatform || (this.isBlazorPlatform && this.fields.dataSource instanceof DataManager && (this.fields.dataSource.adaptorName !== 'BlazorAdaptor')) || this.changeDataSource) {
            this.listBaseOption.ariaAttributes.level = 1;
            let sortedData = this.getSortedData(this.rootData);
            this.ulElement = ListBase.createList(this.createElement, isSorted ? this.rootData : sortedData, this.listBaseOption);
            this.element.appendChild(this.ulElement);
            let rootNodes = this.ulElement.querySelectorAll('.e-list-item');
            if (this.loadOnDemand === false) {
                let i = 0;
                while (i < rootNodes.length) {
                    this.renderChildNodes(rootNodes[i], true, null, true);
                    i++;
                }
            }
            let parentEle = selectAll('.' + PARENTITEM, this.element);
            if ((parentEle.length === 1 && (rootNodes && rootNodes.length !== 0)) || this.loadOnDemand) {
                this.finalizeNode(this.element);
            }
        }
        this.updateTemplateForBlazor();
        this.parentNodeCheck = [];
        this.parentCheckData = [];
        this.updateCheckedStateFromDS();
        if (this.autoCheck && this.showCheckBox && !this.isLoaded) {
            this.updateParentCheckState();
        }
    }
    updateTemplateForBlazor() {
        if (this.nodeTemplate && this.isBlazorPlatform && !this.isStringTemplate) {
            this.updateBlazorTemplate();
        }
    }
    /**
     * Update the checkedNodes from datasource at initial rendering
     */
    updateCheckedStateFromDS(id) {
        this.validNodes = [];
        if (this.treeData && this.showCheckBox) {
            if (this.dataType === 1) {
                let mapper = this.fields;
                let resultData = new DataManager(this.treeData).executeLocal(new Query().where(mapper.isChecked, 'equal', true, false));
                for (let i = 0; i < resultData.length; i++) {
                    let resultId = resultData[i][this.fields.id] ? resultData[i][this.fields.id].toString() : null;
                    let resultPId = resultData[i][this.fields.parentID] ? resultData[i][this.fields.parentID].toString() : null;
                    if (this.checkedNodes.indexOf(resultId) === -1 && !(this.isLoaded)) {
                        this.checkedNodes.push(resultId);
                    }
                    if (resultData[i][this.fields.hasChildren]) {
                        let id = resultData[i][this.fields.id];
                        let childData = new DataManager(this.treeData).
                            executeLocal(new Query().where(mapper.parentID, 'equal', id, false));
                        for (let child = 0; child < childData.length; child++) {
                            let childId = childData[child][this.fields.id] ? childData[child][this.fields.id].toString() : null;
                            if (this.checkedNodes.indexOf(childId) === -1 && this.autoCheck) {
                                this.checkedNodes.push(childId);
                            }
                        }
                    }
                }
                for (let i = 0; i < this.checkedNodes.length; i++) {
                    let mapper = this.fields;
                    let checkState = new DataManager(this.treeData).
                        executeLocal(new Query().where(mapper.id, 'equal', this.checkedNodes[i], true));
                    if (checkState[0] && this.autoCheck) {
                        this.getCheckedNodeDetails(mapper, checkState);
                        this.checkIndeterminateState(checkState[0]);
                    }
                    if (checkState.length > 0) {
                        let checkedId = checkState[0][this.fields.id] ? checkState[0][this.fields.id].toString() : null;
                        if (this.checkedNodes.indexOf(checkedId) > -1 && this.validNodes.indexOf(checkedId) === -1) {
                            this.validNodes.push(checkedId);
                        }
                    }
                    let checkedData = new DataManager(this.treeData).
                        executeLocal(new Query().where(mapper.parentID, 'equal', this.checkedNodes[i], true));
                    for (let index = 0; index < checkedData.length; index++) {
                        let checkedId = checkedData[index][this.fields.id] ? checkedData[index][this.fields.id].toString() : null;
                        if (this.checkedNodes.indexOf(checkedId) === -1 && this.autoCheck) {
                            this.checkedNodes.push(checkedId);
                        }
                        if (this.checkedNodes.indexOf(checkedId) > -1 && this.validNodes.indexOf(checkedId) === -1) {
                            this.validNodes.push(checkedId);
                        }
                    }
                }
            }
            else if (this.dataType === 2 || (this.fields.dataSource instanceof DataManager &&
                this.isOffline)) {
                for (let index = 0; index < this.treeData.length; index++) {
                    let fieldId = this.treeData[index][this.fields.id] ? this.treeData[index][this.fields.id].toString() : '';
                    if (this.treeData[index][this.fields.isChecked] && !(this.isLoaded) && this.checkedNodes.indexOf(fieldId) === -1) {
                        this.checkedNodes.push(fieldId);
                    }
                    if (this.checkedNodes.indexOf(fieldId) > -1 && this.validNodes.indexOf(fieldId) === -1) {
                        this.validNodes.push(fieldId);
                    }
                    let childItems = getValue(this.fields.child.toString(), this.treeData[index]);
                    if (childItems) {
                        this.updateChildCheckState(childItems, this.treeData[index]);
                    }
                }
            }
            this.setProperties({ checkedNodes: this.validNodes }, true);
        }
    }
    /**
     * To check whether the list data has sub child and to change the parent check state accordingly
     */
    getCheckedNodeDetails(mapper, checkNodes) {
        let id = checkNodes[0][this.fields.parentID] ? checkNodes[0][this.fields.parentID].toString() : null;
        let count = 0;
        let element = this.element.querySelector('[data-uid="' + checkNodes[0][this.fields.id] + '"]');
        let parentEle = this.element.querySelector('[data-uid="' + checkNodes[0][this.fields.parentID] + '"]');
        if (!element && !parentEle) {
            let len = this.parentNodeCheck.length;
            if (this.parentNodeCheck.indexOf(id) === -1) {
                this.parentNodeCheck.push(id);
            }
            let childNodes = this.getChildNodes(this.treeData, id);
            for (let i = 0; i < childNodes.length; i++) {
                let childId = childNodes[i][this.fields.id] ? childNodes[i][this.fields.id].toString() : null;
                if (this.checkedNodes.indexOf(childId) !== -1) {
                    count++;
                }
                if (count === childNodes.length && this.checkedNodes.indexOf(id) === -1) {
                    this.checkedNodes.push(id);
                }
            }
            let preElement = new DataManager(this.treeData).
                executeLocal(new Query().where(mapper.id, 'equal', id, true));
            this.getCheckedNodeDetails(mapper, preElement);
        }
        else if (parentEle) {
            let check = select('.' + CHECK, parentEle);
            if (!check) {
                this.changeState(parentEle, 'indeterminate', null, true, true);
            }
        }
    }
    /**
     * Update the checkedNodes and parent state when all the child Nodes are in checkedstate at initial rendering
     */
    updateParentCheckState() {
        let indeterminate = selectAll('.' + INDETERMINATE, this.element);
        let childCheckedElement;
        for (let i = 0; i < indeterminate.length; i++) {
            let node = closest(indeterminate[i], '.' + LISTITEM);
            let nodeId = node.getAttribute('data-uid').toString();
            if (this.dataType === 1) {
                childCheckedElement = new DataManager(this.treeData).
                    executeLocal(new Query().where(this.fields.parentID, 'equal', nodeId, true));
            }
            else {
                childCheckedElement = this.getChildNodes(this.treeData, nodeId);
            }
            let count = 0;
            if (childCheckedElement) {
                for (let j = 0; j < childCheckedElement.length; j++) {
                    let childId = childCheckedElement[j][this.fields.id].toString();
                    if (this.checkedNodes.indexOf(childId) !== -1) {
                        count++;
                    }
                }
                if (count === childCheckedElement.length) {
                    let nodeCheck = node.getAttribute('data-uid');
                    if (this.checkedNodes.indexOf(nodeCheck) === -1) {
                        this.checkedNodes.push(nodeCheck);
                    }
                    this.changeState(node, 'check', null, true, true);
                }
                else if (count === 0 && this.checkedNodes.length === 0) {
                    this.changeState(node, 'uncheck', null, true, true);
                }
            }
        }
    }
    /**
     * Change the parent to indeterminate state whenever the child is in checked state which is not rendered in DOM
     */
    checkIndeterminateState(data) {
        let element;
        if (this.dataType === 1) {
            element = this.element.querySelector('[data-uid="' + data[this.fields.parentID] + '"]');
        }
        else {
            element = this.element.querySelector('[data-uid="' + data[this.fields.id] + '"]');
        }
        if (element) {
            let ariaChecked = element.querySelector('.' + CHECKBOXWRAP).getAttribute('aria-checked');
            if (ariaChecked !== 'true') {
                this.changeState(element, 'indeterminate', null, true, true);
            }
        }
        else if (this.dataType === 2) {
            let len = this.parentNodeCheck.length;
            if (this.parentNodeCheck.indexOf(data[this.fields.id].toString()) === -1) {
                this.parentNodeCheck.push(data[this.fields.id].toString());
            }
        }
    }
    /**
     * Update the checkedNodes for child and subchild from datasource (hierarchical datasource) at initial rendering
     */
    updateChildCheckState(childItems, treeData) {
        let count = 0;
        let checkedParent = treeData[this.fields.id] ? treeData[this.fields.id].toString() : '';
        for (let index = 0; index < childItems.length; index++) {
            let checkedChild = childItems[index][this.fields.id] ? childItems[index][this.fields.id].toString() : '';
            if (childItems[index][this.fields.isChecked] && !(this.isLoaded) && this.checkedNodes.indexOf(checkedChild) === -1) {
                this.checkedNodes.push(checkedChild);
            }
            if (this.checkedNodes.indexOf(checkedParent) !== -1 && this.checkedNodes.indexOf(checkedChild) === -1 && this.autoCheck) {
                this.checkedNodes.push(checkedChild);
            }
            if (this.checkedNodes.indexOf(checkedChild) !== -1 && this.autoCheck) {
                count++;
            }
            if (this.checkedNodes.indexOf(checkedChild) > -1 && this.validNodes.indexOf(checkedChild) === -1) {
                this.validNodes.push(checkedChild);
            }
            let subChildItems = getValue(this.fields.child.toString(), childItems[index]);
            if (subChildItems) {
                this.parentCheckData.push(treeData);
                this.updateChildCheckState(subChildItems, childItems[index]);
            }
            if (count === childItems.length && this.autoCheck && this.checkedNodes.indexOf(checkedParent) === -1) {
                this.checkedNodes.push(checkedParent);
            }
        }
        if (count !== 0 && this.autoCheck) {
            this.checkIndeterminateState(treeData);
            for (let len = 0; len < this.parentCheckData.length; len++) {
                if ((treeData !== this.parentCheckData[len]) && (this.parentCheckData[len])) {
                    this.checkIndeterminateState(this.parentCheckData[len]);
                }
            }
        }
        this.parentCheckData = [];
    }
    beforeNodeCreate(e) {
        if (this.showCheckBox) {
            let checkboxEle = createCheckBox(this.createElement, true, { cssClass: this.touchClass });
            checkboxEle.setAttribute('role', 'checkbox');
            let icon = select('div.' + ICON, e.item);
            let id = e.item.getAttribute('data-uid');
            e.item.childNodes[0].insertBefore(checkboxEle, e.item.childNodes[0].childNodes[isNullOrUndefined(icon) ? 0 : 1]);
            let checkValue = getValue(e.fields.isChecked, e.curData);
            if (this.checkedNodes.indexOf(id) > -1) {
                select('.' + CHECKBOXFRAME, checkboxEle).classList.add(CHECK);
                checkboxEle.setAttribute('aria-checked', 'true');
                this.addCheck(e.item);
            }
            else if (!isNullOrUndefined(checkValue) && checkValue.toString() === 'true') {
                select('.' + CHECKBOXFRAME, checkboxEle).classList.add(CHECK);
                checkboxEle.setAttribute('aria-checked', 'true');
                this.addCheck(e.item);
            }
            else {
                checkboxEle.setAttribute('aria-checked', 'false');
            }
            let frame = select('.' + CHECKBOXFRAME, checkboxEle);
            EventHandler.add(frame, 'mousedown', this.frameMouseHandler, this);
            EventHandler.add(frame, 'mouseup', this.frameMouseHandler, this);
        }
        if (this.fullRowSelect) {
            this.createFullRow(e.item);
        }
        if (this.allowMultiSelection && !e.item.classList.contains(SELECTED$1)) {
            e.item.setAttribute('aria-selected', 'false');
        }
        let fields = e.fields;
        this.addActionClass(e, fields.selected, SELECTED$1);
        this.addActionClass(e, fields.expanded, EXPANDED);
        if (!isNullOrUndefined(this.nodeTemplateFn)) {
            let textEle = e.item.querySelector('.' + LISTTEXT);
            let dataId = e.item.getAttribute('data-uid');
            textEle.innerHTML = '';
            this.renderNodeTemplate(e.curData, textEle, dataId);
        }
        let eventArgs = {
            node: e.item,
            nodeData: e.curData,
            text: e.text,
        };
        if (!this.isRefreshed) {
            this.trigger('drawNode', eventArgs);
        }
    }
    frameMouseHandler(e) {
        let rippleSpan = select('.' + CHECKBOXRIPPLE, e.target.parentElement);
        rippleMouseHandler(e, rippleSpan);
    }
    addActionClass(e, action, cssClass) {
        let data = e.curData;
        let actionValue = getValue(action, data);
        if (!isNullOrUndefined(actionValue) && actionValue.toString() !== 'false') {
            e.item.classList.add(cssClass);
        }
    }
    getDataType(ds, mapper) {
        if (this.fields.dataSource instanceof DataManager && (this.fields.dataSource.adaptorName !== 'BlazorAdaptor')) {
            for (let i = 0; i < ds.length; i++) {
                if (this.isOffline) {
                    if ((typeof mapper.child === 'string') && isNullOrUndefined(getValue(mapper.child, ds[i])) && !isNullOrUndefined(getValue(mapper.parentID, ds[i]))) {
                        return 1;
                    }
                }
                else if ((typeof mapper.child === 'string') && isNullOrUndefined(getValue(mapper.child, ds[i]))) {
                    return 1;
                }
            }
            return 2;
        }
        for (let i = 0, len = ds.length; i < len; i++) {
            if ((typeof mapper.child === 'string') && !isNullOrUndefined(getValue(mapper.child, ds[i]))) {
                return 2;
            }
            if (!isNullOrUndefined(getValue(mapper.parentID, ds[i])) || !isNullOrUndefined(getValue(mapper.hasChildren, ds[i]))) {
                return 1;
            }
        }
        return 1;
    }
    getGroupedData(dataSource, groupBy) {
        let cusQuery = new Query().group(groupBy);
        let ds = ListBase.getDataSource(dataSource, cusQuery);
        let grpItem = [];
        for (let j = 0; j < ds.length; j++) {
            let itemObj = ds[j].items;
            grpItem.push(itemObj);
        }
        return grpItem;
    }
    getSortedData(list) {
        if (list && this.sortOrder !== 'None') {
            list = ListBase.getDataSource(list, ListBase.addSorting(this.sortOrder, this.fields.text));
        }
        return list;
    }
    finalizeNode(element) {
        let iNodes = selectAll('.' + IMAGE, element);
        for (let k = 0; k < iNodes.length; k++) {
            iNodes[k].setAttribute('alt', IMAGE);
        }
        if (this.isLoaded) {
            let sNodes = selectAll('.' + SELECTED$1, element);
            for (let i = 0; i < sNodes.length; i++) {
                this.selectNode(sNodes[i], null);
                break;
            }
            removeClass(sNodes, SELECTED$1);
        }
        let cNodes = selectAll('.' + LISTITEM + ':not(.' + EXPANDED + ')', element);
        for (let j = 0; j < cNodes.length; j++) {
            let icon = select('div.' + ICON, cNodes[j]);
            if (icon && icon.classList.contains(EXPANDABLE)) {
                this.disableExpandAttr(cNodes[j]);
            }
        }
        let eNodes = selectAll('.' + EXPANDED, element);
        if (!this.isInitalExpand) {
            for (let i = 0; i < eNodes.length; i++) {
                this.renderChildNodes(eNodes[i]);
            }
        }
        removeClass(eNodes, EXPANDED);
        this.updateList();
        if (this.isLoaded) {
            this.updateCheckedProp();
        }
    }
    updateCheckedProp() {
        if (this.showCheckBox) {
            let nodes = [].concat([], this.checkedNodes);
            this.setProperties({ checkedNodes: nodes }, true);
        }
    }
    ensureIndeterminate() {
        if (this.autoCheck) {
            let liElement = selectAll('li', this.element);
            let ulElement;
            for (let i = 0; i < liElement.length; i++) {
                if (liElement[i].classList.contains(LISTITEM)) {
                    ulElement = select('.' + PARENTITEM, liElement[i]);
                    if (ulElement) {
                        this.ensureParentCheckState(liElement[i]);
                    }
                    else {
                        this.ensureChildCheckState(liElement[i]);
                    }
                }
            }
        }
        else {
            let indeterminate = selectAll('.' + INDETERMINATE, this.element);
            for (let i = 0; i < indeterminate.length; i++) {
                indeterminate[i].classList.remove(INDETERMINATE);
            }
        }
    }
    ensureParentCheckState(element) {
        if (!isNullOrUndefined(element)) {
            if (element.classList.contains(ROOT)) {
                return;
            }
            let ulElement = element;
            if (element.classList.contains(LISTITEM)) {
                ulElement = select('.' + PARENTITEM, element);
            }
            let checkedNodes = selectAll('.' + CHECK, ulElement);
            let indeterminateNodes = selectAll('.' + INDETERMINATE, ulElement);
            let nodes = selectAll('.' + LISTITEM, ulElement);
            let checkBoxEle = element.getElementsByClassName(CHECKBOXWRAP)[0];
            if (nodes.length === checkedNodes.length) {
                this.changeState(checkBoxEle, 'check', null, true, true);
            }
            else if (checkedNodes.length > 0 || indeterminateNodes.length > 0) {
                this.changeState(checkBoxEle, 'indeterminate', null, true, true);
            }
            else if (checkedNodes.length === 0) {
                this.changeState(checkBoxEle, 'uncheck', null, true, true);
            }
            let parentUL = closest(element, '.' + PARENTITEM);
            if (!isNullOrUndefined(parentUL)) {
                let currentParent = closest(parentUL, '.' + LISTITEM);
                this.ensureParentCheckState(currentParent);
            }
        }
    }
    ensureChildCheckState(element, e) {
        if (!isNullOrUndefined(element)) {
            let childElement = select('.' + PARENTITEM, element);
            let checkBoxes;
            if (!isNullOrUndefined(childElement)) {
                checkBoxes = selectAll('.' + CHECKBOXWRAP, childElement);
                let isChecked = element.getElementsByClassName(CHECKBOXFRAME)[0].classList.contains(CHECK);
                let parentCheck = element.getElementsByClassName(CHECKBOXFRAME)[0].classList.contains(INDETERMINATE);
                let childCheck = childElement.querySelectorAll('li');
                let expandState = childElement.parentElement.getAttribute('aria-expanded');
                let checkedState;
                for (let index = 0; index < checkBoxes.length; index++) {
                    let childId = childCheck[index].getAttribute('data-uid');
                    if (!isNullOrUndefined(this.currentLoadData) && !isNullOrUndefined(getValue(this.fields.isChecked, this.currentLoadData[index]))) {
                        checkedState = getValue(this.fields.isChecked, this.currentLoadData[index]) ? 'check' : 'uncheck';
                        if (this.ele !== -1) {
                            checkedState = isChecked ? 'check' : 'uncheck';
                        }
                        if ((checkedState === 'uncheck') && (!isUndefined(this.parentNodeCheck) && this.autoCheck
                            && this.parentNodeCheck.indexOf(childId) !== -1)) {
                            this.parentNodeCheck.splice(this.parentNodeCheck.indexOf(childId), 1);
                            checkedState = 'indeterminate';
                        }
                    }
                    else {
                        let isNodeChecked = checkBoxes[index].getElementsByClassName(CHECKBOXFRAME)[0].classList.contains(CHECK);
                        if (isChecked) {
                            checkedState = 'check';
                        }
                        else if (isNodeChecked && !this.isLoaded) {
                            checkedState = 'check';
                        }
                        else if (this.checkedNodes.indexOf(childId) !== -1 && this.isLoaded && (parentCheck || isChecked)) {
                            checkedState = 'check';
                        }
                        else if (childCheck[index].classList.contains(CHILD) && (!isUndefined(this.parentNodeCheck) && this.autoCheck
                            && (isChecked || parentCheck) && this.parentNodeCheck.indexOf(childId) !== -1)) {
                            checkedState = 'indeterminate';
                            this.parentNodeCheck.splice(this.parentNodeCheck.indexOf(childId), 1);
                        }
                        else if (this.dataType === 1 && (!isUndefined(this.parentNodeCheck) && this.autoCheck &&
                            (isChecked || parentCheck) && this.parentNodeCheck.indexOf(childId) !== -1)) {
                            checkedState = 'indeterminate';
                            this.parentNodeCheck.splice(this.parentNodeCheck.indexOf(childId), 1);
                        }
                        else {
                            checkedState = 'uncheck';
                        }
                    }
                    this.changeState(checkBoxes[index], checkedState, e, true, true);
                }
            }
            if (this.autoCheck && this.isLoaded) {
                this.updateParentCheckState();
            }
        }
    }
    doCheckBoxAction(nodes, doCheck) {
        let li = selectAll('.' + LISTITEM, this.element);
        if (!isNullOrUndefined(nodes)) {
            for (let len = nodes.length; len >= 0; len--) {
                let liEle;
                if (nodes.length === 1) {
                    liEle = this.getElement(nodes[len - 1]);
                }
                else {
                    liEle = this.getElement(nodes[len]);
                }
                if (isNullOrUndefined(liEle)) {
                    let node;
                    node = nodes[len - nodes.length] ? nodes[len - nodes.length].toString() : nodes[len] ? nodes[len].toString() : null;
                    if (node !== '' && doCheck && node) {
                        this.setValidCheckedNode(node);
                        this.dynamicCheckState(node, doCheck);
                    }
                    else if (this.checkedNodes.indexOf(node) !== -1 && node !== '' && !doCheck) {
                        this.checkedNodes.splice(this.checkedNodes.indexOf(node), 1);
                        let childItems = this.getChildNodes(this.treeData, node);
                        if (childItems) {
                            for (let i = 0; i < childItems.length; i++) {
                                let id = childItems[i][this.fields.id] ? childItems[i][this.fields.id].toString() : null;
                                if (this.checkedNodes.indexOf(id) !== -1) {
                                    this.checkedNodes.splice(this.checkedNodes.indexOf(id), 1);
                                }
                            }
                            if (this.parentNodeCheck.indexOf(node) !== -1) {
                                this.parentNodeCheck.splice(this.parentNodeCheck.indexOf(node), 1);
                            }
                        }
                        if (node) {
                            this.dynamicCheckState(node, doCheck);
                        }
                        this.updateField(this.treeData, this.fields, node, 'isChecked', null);
                    }
                    continue;
                }
                let checkBox = select('.' + PARENTITEM + ' .' + CHECKBOXWRAP, liEle);
                this.validateCheckNode(checkBox, !doCheck, liEle, null);
            }
        }
        else {
            let checkBoxes = selectAll('.' + CHECKBOXWRAP, this.element);
            if (this.loadOnDemand) {
                for (let index = 0; index < checkBoxes.length; index++) {
                    this.updateFieldChecked(checkBoxes[index], doCheck);
                    this.changeState(checkBoxes[index], doCheck ? 'check' : 'uncheck', null, null, null, doCheck);
                }
            }
            else {
                for (let index = 0; index < checkBoxes.length; index++) {
                    this.updateFieldChecked(checkBoxes[index], doCheck);
                    this.changeState(checkBoxes[index], doCheck ? 'check' : 'uncheck');
                }
            }
        }
        if (nodes) {
            for (let j = 0; j < nodes.length; j++) {
                let node = nodes[j] ? nodes[j].toString() : '';
                if (!doCheck) {
                    this.updateField(this.treeData, this.fields, node, 'isChecked', null);
                }
            }
        }
        if (this.autoCheck) {
            this.updateParentCheckState();
        }
    }
    updateFieldChecked(checkbox, doCheck) {
        let currLi = closest(checkbox, '.' + LISTITEM);
        let id = currLi.getAttribute('data-uid');
        let nodeDetails = this.getNodeData(currLi);
        if (nodeDetails.isChecked === 'true' && !doCheck) {
            this.updateField(this.treeData, this.fields, id, 'isChecked', null);
        }
    }
    /**
     * Changes the parent and child  check state while changing the checkedNodes via setmodel
     */
    dynamicCheckState(node, doCheck) {
        if (this.dataType === 1) {
            let count = 0;
            let resultId = new DataManager(this.treeData).executeLocal(new Query().where(this.fields.id, 'equal', node, true));
            if (resultId[0]) {
                let id = resultId[0][this.fields.id] ? resultId[0][this.fields.id].toString() : null;
                let parent = resultId[0][this.fields.parentID] ? resultId[0][this.fields.parentID].toString() : null;
                let parentElement = this.element.querySelector('[data-uid="' + parent + '"]');
                let indeterminate = parentElement ? select('.' + INDETERMINATE, parentElement) : null;
                let check = parentElement ? select('.' + CHECK, parentElement) : null;
                let element = this.element.querySelector('[data-uid="' + id + '"]');
                let childNodes = this.getChildNodes(this.treeData, parent);
                if (childNodes) {
                    for (let i = 0; i < childNodes.length; i++) {
                        let childId = childNodes[i][this.fields.id] ? childNodes[i][this.fields.id].toString() : null;
                        if (this.checkedNodes.indexOf(childId) !== -1) {
                            count++;
                        }
                    }
                }
                if (this.checkedNodes.indexOf(node) !== -1 && parentElement && (id === node) && this.autoCheck) {
                    this.changeState(parentElement, 'indeterminate', null);
                }
                else if (this.checkedNodes.indexOf(node) === -1 && element && (id === node) && !doCheck) {
                    this.changeState(element, 'uncheck', null);
                }
                else if (this.checkedNodes.indexOf(node) !== -1 && element && (id === node) && doCheck) {
                    this.changeState(element, 'check', null);
                }
                else if (this.checkedNodes.indexOf(node) === -1 && !element && parentElement && (id === node) && this.autoCheck
                    && count !== 0) {
                    this.changeState(parentElement, 'indeterminate', null);
                }
                else if (this.checkedNodes.indexOf(node) === -1 && !element && parentElement && (id === node) && this.autoCheck
                    && count === 0) {
                    this.changeState(parentElement, 'uncheck', null);
                }
                else if (!element && !parentElement && (id === node) && this.autoCheck) {
                    this.updateIndeterminate(node, doCheck);
                }
            }
        }
        else if (this.dataType === 2 || (this.fields.dataSource instanceof DataManager &&
            this.isOffline)) {
            let id;
            let parentElement;
            let check;
            for (let i = 0; i < this.treeData.length; i++) {
                id = this.treeData[i][this.fields.id] ? this.treeData[i][this.fields.id].toString() : '';
                parentElement = this.element.querySelector('[data-uid="' + id + '"]');
                check = parentElement ? select('.' + CHECK, parentElement) : null;
                if (this.checkedNodes.indexOf(id) === -1 && parentElement && check && !doCheck) {
                    this.changeState(parentElement, 'uncheck', null);
                }
                let subChild = getValue(this.fields.child.toString(), this.treeData[i]);
                if (subChild) {
                    this.updateChildIndeterminate(subChild, id, node, doCheck, id);
                }
            }
        }
    }
    /**
     * updates the parent and child  check state while changing the checkedNodes via setmodel for listData
     */
    updateIndeterminate(node, doCheck) {
        let indeterminateData = this.getTreeData(node);
        let count = 0;
        let parent;
        if (this.dataType === 1) {
            parent = indeterminateData[0][this.fields.parentID] ? indeterminateData[0][this.fields.parentID].toString() : null;
        }
        let childNodes = this.getChildNodes(this.treeData, parent);
        if (childNodes) {
            for (let i = 0; i < childNodes.length; i++) {
                let childId = childNodes[i][this.fields.id] ? childNodes[i][this.fields.id].toString() : null;
                if (this.checkedNodes.indexOf(childId) !== -1) {
                    count++;
                }
            }
        }
        let parentElement = this.element.querySelector('[data-uid="' + parent + '"]');
        if (parentElement && doCheck) {
            this.changeState(parentElement, 'indeterminate', null);
        }
        else if (!doCheck && parentElement && this.parentNodeCheck.indexOf(parent) === -1 && count !== 0) {
            this.changeState(parentElement, 'indeterminate', null);
        }
        else if (!doCheck && parentElement && this.parentNodeCheck.indexOf(parent) === -1 && count === 0) {
            this.changeState(parentElement, 'uncheck', null);
        }
        else if (!parentElement) {
            if (!doCheck && this.checkedNodes.indexOf(parent) === -1 && this.parentNodeCheck.indexOf(parent) !== -1) {
                this.parentNodeCheck.splice(this.parentNodeCheck.indexOf(parent), 1);
            }
            else if (doCheck && this.checkedNodes.indexOf(parent) === -1 && this.parentNodeCheck.indexOf(parent) === -1) {
                this.parentNodeCheck.push(parent);
            }
            else if (!doCheck && this.checkedNodes.indexOf(parent) !== -1 && this.parentNodeCheck.indexOf(parent) === -1
                && count !== 0) {
                this.parentNodeCheck.push(parent);
            }
            this.updateIndeterminate(parent, doCheck);
            if (this.checkedNodes.indexOf(parent) !== -1 && !doCheck) {
                this.checkedNodes.splice(this.checkedNodes.indexOf(parent), 1);
            }
        }
    }
    /**
     * updates the parent and child  check state while changing the checkedNodes via setmodel for hierarchical data
     */
    updateChildIndeterminate(subChild, parent, node, doCheck, child) {
        let count = 0;
        for (let j = 0; j < subChild.length; j++) {
            let subId = subChild[j][this.fields.id] ? subChild[j][this.fields.id].toString() : '';
            if (this.checkedNodes.indexOf(subId) !== -1) {
                count++;
            }
            let parentElement = this.element.querySelector('[data-uid="' + parent + '"]');
            let indeterminate = parentElement ? select('.' + INDETERMINATE, parentElement) : null;
            let check = parentElement ? select('.' + CHECK, parentElement) : null;
            let element = this.element.querySelector('[data-uid="' + subId + '"]');
            let childElementCheck = element ? select('.' + CHECK, element) : null;
            if (this.checkedNodes.indexOf(node) !== -1 && parentElement && (subId === node) && this.autoCheck) {
                this.changeState(parentElement, 'indeterminate', null);
            }
            else if (this.checkedNodes.indexOf(node) === -1 && parentElement && !element && (subId === node) && !doCheck) {
                if (this.autoCheck) {
                    this.changeState(parentElement, 'uncheck', null);
                }
                else {
                    if (count !== 0) {
                        this.changeState(parentElement, 'indeterminate', null);
                    }
                    else {
                        this.changeState(parentElement, 'uncheck', null);
                    }
                }
            }
            else if (this.checkedNodes.indexOf(node) === -1 && element && (subId === node) && !doCheck) {
                this.changeState(element, 'uncheck', null);
            }
            else if (this.checkedNodes.indexOf(node) === -1 && indeterminate && (subId === node) && this.autoCheck && count === 0
                && !doCheck) {
                indeterminate.classList.remove(INDETERMINATE);
            }
            else if (this.checkedNodes.indexOf(node) === -1 && !element && check && (subId === node) && count === 0) {
                this.changeState(parentElement, 'uncheck', null);
            }
            else if (this.checkedNodes.indexOf(subId) === -1 && element && childElementCheck && count === 0) {
                this.changeState(element, 'uncheck', null);
            }
            else if (!element && !parentElement && (subId === node) || (this.parentNodeCheck.indexOf(parent) !== -1) && this.autoCheck) {
                let childElement = this.element.querySelector('[data-uid="' + child + '"]');
                if (doCheck && count !== 0) {
                    this.changeState(childElement, 'indeterminate', null);
                }
                else if (doCheck && count === subChild.length && this.checkedNodes.indexOf(parent) === -1) {
                    this.checkedNodes.push(parent);
                }
                else if (!doCheck && count === 0 && this.parentNodeCheck.indexOf(parent) !== -1) {
                    this.parentNodeCheck.splice(this.parentNodeCheck.indexOf(parent));
                }
                if (this.parentNodeCheck.indexOf(parent) === -1) {
                    this.parentNodeCheck.push(parent);
                }
            }
            let innerChild = getValue(this.fields.child.toString(), subChild[j]);
            if (innerChild) {
                this.updateChildIndeterminate(innerChild, subId, node, doCheck, child);
            }
        }
    }
    changeState(wrapper, state, e, isPrevent, isAdd, doCheck) {
        let eventArgs;
        let currLi = closest(wrapper, '.' + LISTITEM);
        if (!isPrevent) {
            this.checkActionNodes = [];
            eventArgs = this.getCheckEvent(currLi, state, e);
            this.trigger('nodeChecking', eventArgs, (observedArgs) => {
                if (!observedArgs.cancel) {
                    this.nodeCheckAction(wrapper, state, currLi, observedArgs, e, isPrevent, isAdd, doCheck);
                }
            });
        }
        else {
            this.nodeCheckAction(wrapper, state, currLi, eventArgs, e, isPrevent, isAdd, doCheck);
        }
    }
    nodeCheckAction(wrapper, state, currLi, eventArgs, e, isPrevent, isAdd, doCheck) {
        let ariaState;
        let frameSpan = wrapper.getElementsByClassName(CHECKBOXFRAME)[0];
        if (state === 'check' && !frameSpan.classList.contains(CHECK)) {
            frameSpan.classList.remove(INDETERMINATE);
            frameSpan.classList.add(CHECK);
            this.addCheck(currLi);
            ariaState = 'true';
        }
        else if (state === 'uncheck' && (frameSpan.classList.contains(CHECK) || frameSpan.classList.contains(INDETERMINATE))) {
            removeClass([frameSpan], [CHECK, INDETERMINATE]);
            this.removeCheck(currLi);
            ariaState = 'false';
        }
        else if (state === 'indeterminate' && this.autoCheck) {
            frameSpan.classList.remove(CHECK);
            frameSpan.classList.add(INDETERMINATE);
            this.removeCheck(currLi);
            ariaState = 'mixed';
        }
        ariaState = state === 'check' ? 'true' : state === 'uncheck' ? 'false' : ariaState;
        if (!isNullOrUndefined(ariaState)) {
            wrapper.setAttribute('aria-checked', ariaState);
        }
        if (isAdd) {
            let data = [].concat([], this.checkActionNodes);
            eventArgs = this.getCheckEvent(currLi, state, e);
            if (isUndefined(isPrevent)) {
                eventArgs.data = data;
            }
        }
        if (doCheck !== undefined) {
            this.ensureStateChange(currLi, doCheck);
        }
        if (!isPrevent) {
            if (!isNullOrUndefined(ariaState)) {
                wrapper.setAttribute('aria-checked', ariaState);
                this.allowServerDataBinding = true;
                this.updateServerProperties("check");
                this.allowServerDataBinding = false;
                eventArgs.data[0].checked = ariaState;
                this.trigger('nodeChecked', eventArgs);
                this.checkActionNodes = [];
            }
        }
    }
    addCheck(liEle) {
        let id = liEle.getAttribute('data-uid');
        if (!isNullOrUndefined(id) && this.checkedNodes.indexOf(id) === -1) {
            this.checkedNodes.push(id);
        }
    }
    removeCheck(liEle) {
        let index = this.checkedNodes.indexOf(liEle.getAttribute('data-uid'));
        if (index > -1) {
            this.checkedNodes.splice(index, 1);
        }
    }
    getCheckEvent(currLi, action, e) {
        this.checkActionNodes.push(this.getNodeData(currLi));
        let nodeData = this.checkActionNodes;
        return { action: action, cancel: false, isInteracted: isNullOrUndefined(e) ? false : true, node: currLi, data: nodeData };
    }
    finalize() {
        let firstUl = select('.' + PARENTITEM, this.element);
        if (!isNullOrUndefined(firstUl)) {
            firstUl.setAttribute('role', treeAriaAttr.treeRole);
            this.setMultiSelect(this.allowMultiSelection);
            let firstNode = select('.' + LISTITEM, this.element);
            if (firstNode) {
                addClass([firstNode], FOCUS);
                this.updateIdAttr(null, firstNode);
            }
            this.renderReactTemplates();
            this.hasPid = this.rootData[0] ? this.rootData[0].hasOwnProperty(this.fields.parentID) : false;
            this.doExpandAction();
        }
    }
    doExpandAction() {
        let eUids = this.expandedNodes;
        if (this.isInitalExpand && eUids.length > 0) {
            this.setProperties({ expandedNodes: [] }, true);
            if (this.isBlazorPlatform && !this.initialRender) {
                return;
            }
            /* eslint-disable */
            if (this.fields.dataSource instanceof DataManager && (this.fields.dataSource.adaptorName !== 'BlazorAdaptor')) {
                this.expandGivenNodes(eUids);
            }
            else {
                for (let i = 0; i < eUids.length; i++) {
                    let eNode = select('[data-uid="' + eUids[i] + '"]', this.element);
                    if (!isNullOrUndefined(eNode)) {
                        let icon = select('.' + EXPANDABLE, select('.' + TEXTWRAP, eNode));
                        if (!isNullOrUndefined(icon)) {
                            this.expandAction(eNode, icon, null);
                        }
                    }
                    else {
                        if (eUids[i] && this.expandChildren.indexOf(eUids[i]) === -1) {
                            this.expandChildren.push(eUids[i].toString());
                        }
                        continue;
                    }
                }
                this.afterFinalized();
            }
        }
        else {
            this.afterFinalized();
        }
    }
    expandGivenNodes(arr) {
        let proxy = this;
        this.expandCallback(arr[this.index], () => {
            proxy.index++;
            if (proxy.index < arr.length) {
                proxy.expandGivenNodes(arr);
            }
            else {
                proxy.afterFinalized();
            }
        });
    }
    expandCallback(eUid, callback) {
        let eNode = select('[data-uid="' + eUid + '"]', this.element);
        if (!isNullOrUndefined(eNode)) {
            let icon = select('.' + EXPANDABLE, select('.' + TEXTWRAP, eNode));
            if (!isNullOrUndefined(icon)) {
                this.expandAction(eNode, icon, null, false, callback);
            }
            else {
                callback();
            }
        }
        else {
            callback();
        }
    }
    afterFinalized() {
        if (!this.isBlazorPlatform || (this.isBlazorPlatform && !this.initialRender)) {
            this.doSelectionAction();
        }
        this.updateCheckedProp();
        if (this.isBlazorPlatform) {
            if (this.initialRender) {
                this.setCheckedNodes(this.checkedNodes);
            }
            this.updateInstance();
            this.initialRender = false;
        }
        this.isAnimate = true;
        this.isInitalExpand = false;
        if (!this.isLoaded || this.isFieldChange) {
            let eventArgs = { data: this.treeData };
            this.trigger('dataBound', eventArgs);
        }
        this.isLoaded = true;
    }
    doSelectionAction() {
        let sNodes = selectAll('.' + SELECTED$1, this.element);
        let sUids = this.selectedNodes;
        if (sUids.length > 0) {
            this.setProperties({ selectedNodes: [] }, true);
            for (let i = 0; i < sUids.length; i++) {
                let sNode = select('[data-uid="' + sUids[i] + '"]', this.element);
                if (sNode && !(sNode.classList.contains('e-active'))) {
                    this.selectNode(sNode, null, true);
                }
                else {
                    this.selectedNodes.push(sUids[i]);
                }
                if (!this.allowMultiSelection) {
                    break;
                }
            }
        }
        else {
            this.selectGivenNodes(sNodes);
        }
        removeClass(sNodes, SELECTED$1);
    }
    selectGivenNodes(sNodes) {
        for (let i = 0; i < sNodes.length; i++) {
            if (!sNodes[i].classList.contains('e-disable')) {
                this.selectNode(sNodes[i], null, true);
            }
            if (!this.allowMultiSelection) {
                break;
            }
        }
    }
    clickHandler(event) {
        let target = event.originalEvent.target;
        EventHandler.remove(this.element, 'contextmenu', this.preventContextMenu);
        if (!target || this.dragStartAction) {
            return;
        }
        else {
            let classList$$1 = target.classList;
            let li = closest(target, '.' + LISTITEM);
            if (!li) {
                return;
            }
            else if (event.originalEvent.which !== 3) {
                let rippleElement = select('.' + RIPPLEELMENT, li);
                let rippleIcons = select('.' + ICON, li);
                this.removeHover();
                this.setFocusElement(li);
                if (this.showCheckBox && !li.classList.contains('e-disable')) {
                    let checkWrapper = closest(target, '.' + CHECKBOXWRAP);
                    if (!isNullOrUndefined(checkWrapper)) {
                        let checkElement = select('.' + CHECKBOXFRAME, checkWrapper);
                        this.validateCheckNode(checkWrapper, checkElement.classList.contains(CHECK), li, event.originalEvent);
                        this.triggerClickEvent(event.originalEvent, li);
                        return;
                    }
                }
                if (classList$$1.contains(EXPANDABLE)) {
                    this.expandAction(li, target, event);
                }
                else if (classList$$1.contains(COLLAPSIBLE)) {
                    this.collapseNode(li, target, event);
                }
                else if (rippleElement && rippleIcons) {
                    if (rippleIcons.classList.contains(RIPPLE) && rippleIcons.classList.contains(EXPANDABLE)) {
                        this.expandAction(li, rippleIcons, event);
                    }
                    else if (rippleIcons.classList.contains(RIPPLE) && rippleIcons.classList.contains(COLLAPSIBLE)) {
                        this.collapseNode(li, rippleIcons, event);
                    }
                    else if (!classList$$1.contains(PARENTITEM) && !classList$$1.contains(LISTITEM)) {
                        this.toggleSelect(li, event.originalEvent, false);
                    }
                }
                else {
                    if (!classList$$1.contains(PARENTITEM) && !classList$$1.contains(LISTITEM)) {
                        this.toggleSelect(li, event.originalEvent, false);
                    }
                }
            }
            this.triggerClickEvent(event.originalEvent, li);
        }
    }
    nodeCheckedEvent(wrapper, isCheck, e) {
        let currLi = closest(wrapper, '.' + LISTITEM);
        let eventArgs = this.getCheckEvent(wrapper, isCheck ? 'uncheck' : 'check', e);
        eventArgs.data = eventArgs.data.splice(0, eventArgs.data.length - 1);
        this.trigger('nodeChecked', eventArgs);
    }
    triggerClickEvent(e, li) {
        let eventArgs = {
            event: e,
            node: li,
        };
        this.trigger('nodeClicked', eventArgs);
    }
    expandNode(currLi, icon, loaded) {
        this.renderReactTemplates();
        if (icon.classList.contains(LOAD)) {
            this.hideSpinner(icon);
        }
        if (!this.initialRender) {
            icon.classList.add('interaction');
        }
        if (loaded !== true || (loaded === true && currLi.classList.contains('e-expanded'))) {
            if (this.preventExpand !== true) {
                removeClass([icon], EXPANDABLE);
                addClass([icon], COLLAPSIBLE);
                let start = 0;
                let end = 0;
                let proxy = this;
                let ul = select('.' + PARENTITEM, currLi);
                let liEle = currLi;
                this.setHeight(liEle, ul);
                let activeElement = select('.' + LISTITEM + '.' + ACTIVE, currLi);
                if (this.isAnimate && !this.isRefreshed) {
                    this.aniObj.animate(ul, {
                        name: this.animation.expand.effect,
                        duration: this.animation.expand.duration,
                        timingFunction: this.animation.expand.easing,
                        begin: (args) => {
                            liEle.style.overflow = 'hidden';
                            if (!isNullOrUndefined(activeElement) && activeElement instanceof HTMLElement) {
                                activeElement.classList.add(ITEM_ANIMATION_ACTIVE);
                            }
                            start = liEle.offsetHeight;
                            end = select('.' + TEXTWRAP, currLi).offsetHeight;
                        },
                        progress: (args) => {
                            args.element.style.display = 'block';
                            proxy.animateHeight(args, start, end);
                        },
                        end: (args) => {
                            args.element.style.display = 'block';
                            if (!isNullOrUndefined(activeElement) && activeElement instanceof HTMLElement) {
                                activeElement.classList.remove(ITEM_ANIMATION_ACTIVE);
                            }
                            this.expandedNode(liEle, ul, icon);
                        }
                    });
                }
                else {
                    this.expandedNode(liEle, ul, icon);
                }
            }
        }
        else {
            let ul = select('.' + PARENTITEM, currLi);
            ul.style.display = 'none';
            if (this.fields.dataSource instanceof DataManager === true) {
                this.preventExpand = false;
            }
        }
        if (this.initialRender) {
            icon.classList.add('interaction');
        }
    }
    expandedNode(currLi, ul, icon) {
        ul.style.display = 'block';
        currLi.style.display = 'block';
        currLi.style.overflow = '';
        currLi.style.height = '';
        removeClass([icon], PROCESS);
        this.addExpand(currLi);
        this.allowServerDataBinding = true;
        this.updateServerProperties("expand");
        this.allowServerDataBinding = false;
        if (this.isLoaded && this.expandArgs && !this.isRefreshed) {
            this.expandArgs = this.getExpandEvent(currLi, null);
            this.trigger('nodeExpanded', this.expandArgs);
        }
    }
    addExpand(liEle) {
        liEle.setAttribute('aria-expanded', 'true');
        removeClass([liEle], NODECOLLAPSED);
        let id = liEle.getAttribute('data-uid');
        if (!isNullOrUndefined(id) && this.expandedNodes.indexOf(id) === -1) {
            this.expandedNodes.push(id);
        }
    }
    collapseNode(currLi, icon, e) {
        if (icon.classList.contains(PROCESS)) {
            return;
        }
        else {
            addClass([icon], PROCESS);
        }
        let colArgs;
        if (this.isLoaded) {
            colArgs = this.getExpandEvent(currLi, e);
            this.trigger('nodeCollapsing', colArgs, (observedArgs) => {
                if (observedArgs.cancel) {
                    removeClass([icon], PROCESS);
                }
                else {
                    this.nodeCollapseAction(currLi, icon, observedArgs);
                }
            });
        }
        else {
            this.nodeCollapseAction(currLi, icon, colArgs);
        }
    }
    nodeCollapseAction(currLi, icon, colArgs) {
        removeClass([icon], COLLAPSIBLE);
        addClass([icon], EXPANDABLE);
        let start = 0;
        let end = 0;
        let proxy = this;
        let ul = select('.' + PARENTITEM, currLi);
        let liEle = currLi;
        let activeElement = select('.' + LISTITEM + '.' + ACTIVE, currLi);
        if (this.isAnimate) {
            this.aniObj.animate(ul, {
                name: this.animation.collapse.effect,
                duration: this.animation.collapse.duration,
                timingFunction: this.animation.collapse.easing,
                begin: (args) => {
                    liEle.style.overflow = 'hidden';
                    if (!isNullOrUndefined(activeElement) && activeElement instanceof HTMLElement) {
                        activeElement.classList.add(ITEM_ANIMATION_ACTIVE);
                    }
                    start = select('.' + TEXTWRAP, currLi).offsetHeight;
                    end = liEle.offsetHeight;
                },
                progress: (args) => {
                    proxy.animateHeight(args, start, end);
                },
                end: (args) => {
                    args.element.style.display = 'none';
                    if (!isNullOrUndefined(activeElement) && activeElement instanceof HTMLElement) {
                        activeElement.classList.remove(ITEM_ANIMATION_ACTIVE);
                    }
                    this.collapsedNode(liEle, ul, icon, colArgs);
                }
            });
        }
        else {
            this.collapsedNode(liEle, ul, icon, colArgs);
        }
    }
    collapsedNode(liEle, ul, icon, colArgs) {
        ul.style.display = 'none';
        liEle.style.overflow = '';
        liEle.style.height = '';
        removeClass([icon], PROCESS);
        this.allowServerDataBinding = true;
        this.updateServerProperties("expand");
        this.allowServerDataBinding = false;
        this.removeExpand(liEle);
        if (this.isLoaded) {
            colArgs = this.getExpandEvent(liEle, null);
            this.trigger('nodeCollapsed', colArgs);
        }
    }
    removeExpand(liEle, toRemove) {
        if (toRemove) {
            liEle.removeAttribute('aria-expanded');
        }
        else {
            this.disableExpandAttr(liEle);
        }
        let index = this.expandedNodes.indexOf(liEle.getAttribute('data-uid'));
        if (index > -1) {
            this.expandedNodes.splice(index, 1);
        }
    }
    disableExpandAttr(liEle) {
        liEle.setAttribute('aria-expanded', 'false');
        addClass([liEle], NODECOLLAPSED);
    }
    setHeight(currLi, ul) {
        ul.style.display = 'block';
        ul.style.visibility = 'hidden';
        currLi.style.height = currLi.offsetHeight + 'px';
        ul.style.display = 'none';
        ul.style.visibility = '';
    }
    animateHeight(args, start, end) {
        let remaining = (args.duration - args.timeStamp) / args.duration;
        let currentHeight = (end - start) * remaining + start;
        args.element.parentElement.style.height = currentHeight + 'px';
    }
    renderChildNodes(parentLi, expandChild, callback, loaded) {
        let eicon = select('div.' + ICON, parentLi);
        if (isNullOrUndefined(eicon)) {
            return;
        }
        this.showSpinner(eicon);
        let childItems;
        /* eslint-disable */
        if (this.fields.dataSource instanceof DataManager && (this.fields.dataSource.adaptorName !== 'BlazorAdaptor')) {
            let level = this.parents(parentLi, '.' + PARENTITEM).length;
            let mapper = this.getChildFields(this.fields, level, 1);
            if (isNullOrUndefined(mapper) || isNullOrUndefined(mapper.dataSource)) {
                detach(eicon);
                this.removeExpand(parentLi, true);
                return;
            }
            this.treeList.push('false');
            if (this.fields.dataSource instanceof DataManager && this.isOffline) {
                this.treeList.pop();
                childItems = this.getChildNodes(this.treeData, parentLi.getAttribute('data-uid'));
                this.loadChild(childItems, mapper, eicon, parentLi, expandChild, callback, loaded);
                this.updateTemplateForBlazor();
            }
            else {
                mapper.dataSource.executeQuery(this.getQuery(mapper, parentLi.getAttribute('data-uid'))).then((e) => {
                    this.treeList.pop();
                    childItems = e.result;
                    if (this.dataType === 1) {
                        this.dataType = 2;
                    }
                    this.loadChild(childItems, mapper, eicon, parentLi, expandChild, callback, loaded);
                    this.updateTemplateForBlazor();
                }).catch((e) => {
                    this.trigger('actionFailure', { error: e });
                });
            }
        }
        else {
            childItems = this.getChildNodes(this.treeData, parentLi.getAttribute('data-uid'));
            this.currentLoadData = this.getSortedData(childItems);
            if (isNullOrUndefined(childItems) || childItems.length === 0) {
                detach(eicon);
                this.removeExpand(parentLi, true);
                return;
            }
            else {
                if (!this.isBlazorPlatform || !this.initialRender) {
                    this.listBaseOption.ariaAttributes.level = parseFloat(parentLi.getAttribute('aria-level')) + 1;
                    parentLi.appendChild(ListBase.createList(this.createElement, this.currentLoadData, this.listBaseOption));
                }
                this.expandNode(parentLi, eicon, loaded);
                this.setSelectionForChildNodes(childItems);
                this.ensureCheckNode(parentLi);
                this.finalizeNode(parentLi);
                if (this.loadOnDemand && this.nodeTemplate && this.isBlazorPlatform && !this.isStringTemplate) {
                    this.updateBlazorTemplate();
                }
                this.disableTreeNodes(childItems);
                this.renderSubChild(parentLi, expandChild, loaded);
            }
        }
    }
    loadChild(childItems, mapper, eicon, parentLi, expandChild, callback, loaded) {
        this.currentLoadData = childItems;
        if (isNullOrUndefined(childItems) || childItems.length === 0) {
            detach(eicon);
            this.removeExpand(parentLi, true);
        }
        else {
            this.updateListProp(mapper);
            if (this.fields.dataSource instanceof DataManager && !this.isOffline) {
                let id = parentLi.getAttribute('data-uid');
                let nodeData = this.getNodeObject(id);
                setValue('child', childItems, nodeData);
            }
            this.listBaseOption.ariaAttributes.level = parseFloat(parentLi.getAttribute('aria-level')) + 1;
            parentLi.appendChild(ListBase.createList(this.createElement, childItems, this.listBaseOption));
            this.expandNode(parentLi, eicon, loaded);
            this.setSelectionForChildNodes(childItems);
            this.ensureCheckNode(parentLi);
            this.finalizeNode(parentLi);
            this.disableTreeNodes(childItems);
            this.renderSubChild(parentLi, expandChild, loaded);
        }
        if (callback) {
            callback();
        }
        if (this.treeList.length === 0 && !this.isLoaded) {
            this.finalize();
        }
    }
    disableTreeNodes(childItems) {
        let i = 0;
        while (i < childItems.length) {
            let id = childItems[i][this.fields.id] ? childItems[i][this.fields.id].toString() : null;
            if (this.disableNode !== undefined && this.disableNode.indexOf(id) !== -1) {
                this.doDisableAction([id]);
            }
            i++;
        }
    }
    /**
     * Sets the child Item in selectedState while rendering the child node
     */
    setSelectionForChildNodes(nodes) {
        let i;
        for (i = 0; i < nodes.length; i++) {
            let id = nodes[i][this.fields.id] ? nodes[i][this.fields.id].toString() : null;
            if (this.selectedNodes !== undefined && this.selectedNodes.indexOf(id) !== -1) {
                this.doSelectionAction();
            }
        }
    }
    ensureCheckNode(element) {
        if (this.showCheckBox) {
            this.ele = (this.checkedElement) ? this.checkedElement.indexOf(element.getAttribute('data-uid')) : null;
            if (this.autoCheck) {
                this.ensureChildCheckState(element);
                this.ensureParentCheckState(element);
            }
        }
        this.currentLoadData = null;
    }
    getFields(mapper, nodeLevel, dataLevel) {
        if (nodeLevel === dataLevel) {
            return mapper;
        }
        else {
            return this.getFields(this.getChildMapper(mapper), nodeLevel, dataLevel + 1);
        }
    }
    getChildFields(mapper, nodeLevel, dataLevel) {
        if (nodeLevel === dataLevel) {
            return this.getChildMapper(mapper);
        }
        else {
            return this.getChildFields(this.getChildMapper(mapper), nodeLevel, dataLevel + 1);
        }
    }
    getChildMapper(mapper) {
        return (typeof mapper.child === 'string' || isNullOrUndefined(mapper.child)) ? mapper : mapper.child;
    }
    getChildNodes(obj, parentId, isRoot = false) {
        let childNodes;
        if (isNullOrUndefined(obj)) {
            return childNodes;
        }
        else if (this.dataType === 1) {
            return this.getChildGroup(this.groupedData, parentId, isRoot);
        }
        else {
            if (typeof this.fields.child === 'string') {
                for (let i = 0, objlen = obj.length; i < objlen; i++) {
                    let dataId = getValue(this.fields.id, obj[i]);
                    if (dataId && dataId.toString() === parentId) {
                        return getValue(this.fields.child, obj[i]);
                    }
                    else if (!isNullOrUndefined(getValue(this.fields.child, obj[i]))) {
                        childNodes = this.getChildNodes(getValue(this.fields.child, obj[i]), parentId);
                        if (childNodes !== undefined) {
                            break;
                        }
                    }
                }
            }
        }
        return childNodes;
    }
    getChildGroup(data, parentId, isRoot) {
        let childNodes;
        if (isNullOrUndefined(data)) {
            return childNodes;
        }
        for (let i = 0, objlen = data.length; i < objlen; i++) {
            if (!isNullOrUndefined(data[i][0]) && !isNullOrUndefined(getValue(this.fields.parentID, data[i][0]))) {
                if (getValue(this.fields.parentID, data[i][0]).toString() === parentId) {
                    return data[i];
                }
            }
            else if (isRoot) {
                return data[i];
            }
            else {
                return [];
            }
        }
        return childNodes;
    }
    renderSubChild(element, expandChild, loaded) {
        if (expandChild) {
            let cIcons = selectAll('.' + EXPANDABLE, element);
            for (let i = 0, len = cIcons.length; i < len; i++) {
                let icon = cIcons[i];
                if (element.querySelector('.e-icons') !== cIcons[i]) {
                    let curLi = closest(icon, '.' + LISTITEM);
                    this.expandArgs = this.getExpandEvent(curLi, null);
                    if (loaded !== true) {
                        this.trigger('nodeExpanding', this.expandArgs);
                    }
                    this.renderChildNodes(curLi, expandChild, null, loaded);
                }
            }
        }
    }
    toggleSelect(li, e, multiSelect) {
        if (!li.classList.contains('e-disable')) {
            if (this.allowMultiSelection && ((e && e.ctrlKey) || multiSelect) && this.isActive(li)) {
                this.unselectNode(li, e);
            }
            else {
                this.selectNode(li, e, multiSelect);
            }
        }
    }
    isActive(li) {
        return li.classList.contains(ACTIVE) ? true : false;
    }
    selectNode(li, e, multiSelect) {
        if (isNullOrUndefined(li) || (!this.allowMultiSelection && this.isActive(li) && !isNullOrUndefined(e))) {
            this.setFocusElement(li);
            return;
        }
        let eventArgs;
        if (this.isLoaded) {
            eventArgs = this.getSelectEvent(li, 'select', e);
            this.trigger('nodeSelecting', eventArgs, (observedArgs) => {
                if (!observedArgs.cancel) {
                    this.nodeSelectAction(li, e, observedArgs, multiSelect);
                }
            });
        }
        else {
            this.nodeSelectAction(li, e, eventArgs, multiSelect);
        }
    }
    nodeSelectAction(li, e, eventArgs, multiSelect) {
        if (!this.allowMultiSelection || (!multiSelect && (!e || (e && !e.ctrlKey)))) {
            this.removeSelectAll();
        }
        if (this.allowMultiSelection && e && e.shiftKey) {
            if (!this.startNode) {
                this.startNode = li;
            }
            let startIndex = this.liList.indexOf(this.startNode);
            let endIndex = this.liList.indexOf(li);
            if (startIndex > endIndex) {
                let temp = startIndex;
                startIndex = endIndex;
                endIndex = temp;
            }
            for (let i = startIndex; i <= endIndex; i++) {
                let currNode = this.liList[i];
                if (isVisible(currNode) && !currNode.classList.contains('e-disable')) {
                    this.addSelect(currNode);
                }
            }
        }
        else {
            this.startNode = li;
            this.addSelect(li);
        }
        this.setFocusElement(li);
        if (this.isLoaded) {
            this.allowServerDataBinding = true;
            this.updateServerProperties("select");
            this.allowServerDataBinding = false;
            eventArgs.nodeData = this.getNodeData(li);
            this.trigger('nodeSelected', eventArgs);
        }
    }
    unselectNode(li, e) {
        let eventArgs;
        if (this.isLoaded) {
            eventArgs = this.getSelectEvent(li, 'un-select', e);
            this.trigger('nodeSelecting', eventArgs, (observedArgs) => {
                if (!observedArgs.cancel) {
                    this.allowServerDataBinding = true;
                    this.updateServerProperties("select");
                    this.allowServerDataBinding = false;
                    this.nodeUnselectAction(li, observedArgs);
                }
            });
        }
        else {
            this.nodeUnselectAction(li, eventArgs);
        }
    }
    nodeUnselectAction(li, eventArgs) {
        this.removeSelect(li);
        this.setFocusElement(li);
        if (this.isLoaded) {
            this.allowServerDataBinding = true;
            this.updateServerProperties("select");
            this.allowServerDataBinding = false;
            eventArgs.nodeData = this.getNodeData(li);
            this.trigger('nodeSelected', eventArgs);
        }
    }
    setFocusElement(li) {
        if (!isNullOrUndefined(li)) {
            let focusedNode = this.getFocusedNode();
            if (focusedNode) {
                removeClass([focusedNode], FOCUS);
            }
            addClass([li], FOCUS);
            this.updateIdAttr(focusedNode, li);
        }
    }
    addSelect(liEle) {
        liEle.setAttribute('aria-selected', 'true');
        addClass([liEle], ACTIVE);
        let id = liEle.getAttribute('data-uid');
        if (!isNullOrUndefined(id) && this.selectedNodes.indexOf(id) === -1) {
            this.selectedNodes.push(id);
        }
    }
    removeSelect(liEle) {
        if (this.allowMultiSelection) {
            liEle.setAttribute('aria-selected', 'false');
        }
        else {
            liEle.removeAttribute('aria-selected');
        }
        removeClass([liEle], ACTIVE);
        let index = this.selectedNodes.indexOf(liEle.getAttribute('data-uid'));
        if (index > -1) {
            this.selectedNodes.splice(index, 1);
        }
    }
    removeSelectAll() {
        let selectedLI = this.element.querySelectorAll('.' + ACTIVE);
        for (let ele of selectedLI) {
            if (this.allowMultiSelection) {
                ele.setAttribute('aria-selected', 'false');
            }
            else {
                ele.removeAttribute('aria-selected');
            }
        }
        removeClass(selectedLI, ACTIVE);
        this.setProperties({ selectedNodes: [] }, true);
    }
    getSelectEvent(currLi, action, e) {
        let nodeData = this.getNodeData(currLi);
        return { action: action, cancel: false, isInteracted: isNullOrUndefined(e) ? false : true, node: currLi, nodeData: nodeData };
    }
    setExpandOnType() {
        this.expandOnType = (this.expandOn === 'Auto') ? (Browser.isDevice ? 'Click' : 'DblClick') : this.expandOn;
    }
    expandHandler(e) {
        let target = e.originalEvent.target;
        if (!target || target.classList.contains(INPUT) || target.classList.contains(ROOT) ||
            target.classList.contains(PARENTITEM) || target.classList.contains(LISTITEM) ||
            target.classList.contains(ICON) || this.showCheckBox && closest(target, '.' + CHECKBOXWRAP)) {
            return;
        }
        else {
            this.expandCollapseAction(closest(target, '.' + LISTITEM), e);
        }
    }
    expandCollapseAction(currLi, e) {
        let icon = select('div.' + ICON, currLi);
        if (!icon || icon.classList.contains(PROCESS)) {
            return;
        }
        else {
            let classList$$1 = icon.classList;
            if (classList$$1.contains(EXPANDABLE)) {
                this.expandAction(currLi, icon, e);
            }
            else if (classList$$1.contains(COLLAPSIBLE)) {
                this.collapseNode(currLi, icon, e);
            }
        }
    }
    expandAction(currLi, icon, e, expandChild, callback) {
        if (icon.classList.contains(PROCESS)) {
            return;
        }
        else {
            addClass([icon], PROCESS);
        }
        if (this.isLoaded && !this.isRefreshed) {
            this.expandArgs = this.getExpandEvent(currLi, e);
            this.trigger('nodeExpanding', this.expandArgs, (observedArgs) => {
                if (observedArgs.cancel) {
                    removeClass([icon], PROCESS);
                }
                else {
                    this.nodeExpandAction(currLi, icon, expandChild, callback);
                }
            });
        }
        else {
            this.nodeExpandAction(currLi, icon, expandChild, callback);
        }
    }
    nodeExpandAction(currLi, icon, expandChild, callback) {
        let ul = select('.' + PARENTITEM, currLi);
        if (ul && ul.nodeName === 'UL') {
            this.expandNode(currLi, icon);
        }
        else {
            this.renderChildNodes(currLi, expandChild, callback);
            let liEles = selectAll('.' + LISTITEM, currLi);
            for (let i = 0; i < liEles.length; i++) {
                let id = this.getId(liEles[i]);
                if (this.expandChildren.indexOf(id) !== -1 && this.expandChildren !== undefined) {
                    let icon = select('.' + EXPANDABLE, select('.' + TEXTWRAP, liEles[i]));
                    if (!isNullOrUndefined(icon)) {
                        this.expandAction(liEles[i], icon, null);
                    }
                    this.expandChildren.splice(this.expandChildren.indexOf(id), 1);
                }
            }
        }
    }
    keyActionHandler(e) {
        let target = e.target;
        let focusedNode = this.getFocusedNode();
        if (target && target.classList.contains(INPUT)) {
            let inpEle = target;
            if (e.action === 'enter') {
                inpEle.blur();
                this.element.focus();
                addClass([focusedNode], HOVER);
            }
            else if (e.action === 'escape') {
                inpEle.value = this.oldText;
                inpEle.blur();
                this.element.focus();
                addClass([focusedNode], HOVER);
            }
            return;
        }
        e.preventDefault();
        let eventArgs = {
            cancel: false,
            event: e,
            node: focusedNode,
        };
        this.trigger('keyPress', eventArgs, (observedArgs) => {
            if (!observedArgs.cancel) {
                switch (e.action) {
                    case 'space':
                        if (this.showCheckBox) {
                            this.checkNode(e);
                        }
                        break;
                    case 'moveRight':
                        this.openNode(this.enableRtl ? false : true, e);
                        break;
                    case 'moveLeft':
                        this.openNode(this.enableRtl ? true : false, e);
                        break;
                    case 'shiftDown':
                        this.shiftKeySelect(true, e);
                        break;
                    case 'moveDown':
                    case 'ctrlDown':
                    case 'csDown':
                        this.navigateNode(true);
                        break;
                    case 'shiftUp':
                        this.shiftKeySelect(false, e);
                        break;
                    case 'moveUp':
                    case 'ctrlUp':
                    case 'csUp':
                        this.navigateNode(false);
                        break;
                    case 'home':
                    case 'shiftHome':
                    case 'ctrlHome':
                    case 'csHome':
                        this.navigateRootNode(true);
                        break;
                    case 'end':
                    case 'shiftEnd':
                    case 'ctrlEnd':
                    case 'csEnd':
                        this.navigateRootNode(false);
                        break;
                    case 'enter':
                    case 'ctrlEnter':
                    case 'shiftEnter':
                    case 'csEnter':
                        this.toggleSelect(focusedNode, e);
                        break;
                    case 'f2':
                        if (this.allowEditing && !focusedNode.classList.contains('e-disable')) {
                            this.createTextbox(focusedNode, e);
                        }
                        break;
                    case 'ctrlA':
                        if (this.allowMultiSelection) {
                            let sNodes = selectAll('.' + LISTITEM + ':not(.' + ACTIVE + ')', this.element);
                            this.selectGivenNodes(sNodes);
                        }
                        break;
                }
            }
        });
    }
    navigateToFocus(isUp) {
        let focusNode = this.getFocusedNode().querySelector('.' + TEXTWRAP);
        let pos = focusNode.getBoundingClientRect();
        let parent = this.getScrollParent(this.element);
        if (!isNullOrUndefined(parent)) {
            let parentPos = parent.getBoundingClientRect();
            if (pos.bottom > parentPos.bottom) {
                parent.scrollTop += pos.bottom - parentPos.bottom;
            }
            else if (pos.top < parentPos.top) {
                parent.scrollTop -= parentPos.top - pos.top;
            }
        }
        let isVisible$$1 = this.isVisibleInViewport(focusNode);
        if (!isVisible$$1) {
            focusNode.scrollIntoView(isUp);
        }
    }
    isVisibleInViewport(txtWrap) {
        let pos = txtWrap.getBoundingClientRect();
        return (pos.top >= 0 && pos.left >= 0 && pos.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            pos.right <= (window.innerWidth || document.documentElement.clientWidth));
    }
    getScrollParent(node) {
        if (isNullOrUndefined(node)) {
            return null;
        }
        return (node.scrollHeight > node.clientHeight) ? node : this.getScrollParent(node.parentElement);
    }
    shiftKeySelect(isTowards, e) {
        if (this.allowMultiSelection) {
            let focusedNode = this.getFocusedNode();
            let nextNode = isTowards ? this.getNextNode(focusedNode) : this.getPrevNode(focusedNode);
            this.removeHover();
            this.setFocusElement(nextNode);
            this.toggleSelect(nextNode, e, false);
            this.navigateToFocus(!isTowards);
        }
        else {
            this.navigateNode(isTowards);
        }
    }
    checkNode(e) {
        let focusedNode = this.getFocusedNode();
        let checkWrap = select('.' + CHECKBOXWRAP, focusedNode);
        let isChecked = select(' .' + CHECKBOXFRAME, checkWrap).classList.contains(CHECK);
        if (!focusedNode.classList.contains('e-disable')) {
            if (focusedNode.getElementsByClassName("e-checkbox-disabled").length == 0) {
                this.validateCheckNode(checkWrap, isChecked, focusedNode, e);
            }
        }
    }
    validateCheckNode(checkWrap, isCheck, li, e) {
        let currLi = closest(checkWrap, '.' + LISTITEM);
        this.checkActionNodes = [];
        let ariaState = !isCheck ? 'true' : 'false';
        if (!isNullOrUndefined(ariaState)) {
            checkWrap.setAttribute('aria-checked', ariaState);
        }
        let eventArgs = this.getCheckEvent(currLi, isCheck ? 'uncheck' : 'check', e);
        this.trigger('nodeChecking', eventArgs, (observedArgs) => {
            if (!observedArgs.cancel) {
                this.nodeCheckingAction(checkWrap, isCheck, li, observedArgs, e);
            }
        });
    }
    nodeCheckingAction(checkWrap, isCheck, li, eventArgs, e) {
        if (this.checkedElement.indexOf(li.getAttribute('data-uid')) === -1) {
            this.checkedElement.push(li.getAttribute('data-uid'));
            let child = this.getChildNodes(this.treeData, li.getAttribute('data-uid'));
            (child !== null) ? this.allCheckNode(child, this.checkedElement, null, null, false) : child = null;
        }
        this.changeState(checkWrap, isCheck ? 'uncheck' : 'check', e, true);
        if (this.autoCheck) {
            this.ensureChildCheckState(li);
            this.ensureParentCheckState(closest(closest(li, '.' + PARENTITEM), '.' + LISTITEM));
            let doCheck;
            if (eventArgs.action === 'check') {
                doCheck = true;
            }
            else if (eventArgs.action === 'uncheck') {
                doCheck = false;
            }
            this.ensureStateChange(li, doCheck);
        }
        this.allowServerDataBinding = true;
        this.updateServerProperties("check");
        this.allowServerDataBinding = false;
        this.nodeCheckedEvent(checkWrap, isCheck, e);
    }
    /**
     * Update checkedNodes when UI interaction happens before the child node renders in DOM
     */
    ensureStateChange(li, doCheck) {
        let childElement = select('.' + PARENTITEM, li);
        let parentIndex = li.getAttribute('data-uid');
        let mapper = this.fields;
        if (this.dataType === 1 && this.autoCheck) {
            let resultData = new DataManager(this.treeData).executeLocal(new Query().where(mapper.parentID, 'equal', parentIndex, true));
            for (let i = 0; i < resultData.length; i++) {
                let resultId = resultData[i][this.fields.id] ? resultData[i][this.fields.id].toString() : null;
                let isCheck = resultData[i][this.fields.isChecked] ? resultData[i][this.fields.isChecked].toString() : null;
                if (this.checkedNodes.indexOf(parentIndex) !== -1 && this.checkedNodes.indexOf(resultId) === -1) {
                    this.checkedNodes.push(resultId);
                    let childItems = this.getChildNodes(this.treeData, resultId);
                    this.getChildItems(childItems, doCheck);
                    if (this.parentNodeCheck.indexOf(resultId) !== -1) {
                        this.parentNodeCheck.splice(this.parentNodeCheck.indexOf(resultId), 1);
                    }
                }
                else if (this.checkedNodes.indexOf(parentIndex) === -1 && childElement === null &&
                    this.checkedNodes.indexOf(resultId) !== -1) {
                    this.checkedNodes.splice(this.checkedNodes.indexOf(resultId), 1);
                    if (isCheck === 'true') {
                        this.updateField(this.treeData, this.fields, resultId, 'isChecked', null);
                    }
                    if (this.checkedNodes.indexOf(parentIndex) === -1 && childElement === null ||
                        this.parentNodeCheck.indexOf(resultId) !== -1) {
                        let childNodes = this.getChildNodes(this.treeData, resultId);
                        this.getChildItems(childNodes, doCheck);
                        if (this.parentNodeCheck.indexOf(resultId) !== -1) {
                            this.parentNodeCheck.splice(this.parentNodeCheck.indexOf(resultId), 1);
                        }
                    }
                }
                else {
                    let childItems = this.getChildNodes(this.treeData, resultId);
                    this.getChildItems(childItems, doCheck);
                }
            }
        }
        else if (this.dataType === 1 && !this.autoCheck) {
            if (!doCheck) {
                let checkedData = new DataManager(this.treeData).executeLocal(new Query().where(mapper.isChecked, 'equal', true, false));
                for (let i = 0; i < checkedData.length; i++) {
                    let id = checkedData[i][this.fields.id] ? checkedData[i][this.fields.id].toString() : null;
                    if (this.checkedNodes.indexOf(id) !== -1) {
                        this.checkedNodes.splice(this.checkedNodes.indexOf(id), 1);
                    }
                    this.updateField(this.treeData, this.fields, id, 'isChecked', null);
                }
                this.checkedNodes = [];
            }
            else {
                for (let i = 0; i < this.treeData.length; i++) {
                    let checkedId = this.treeData[i][this.fields.id] ? this.treeData[i][this.fields.id].toString() : null;
                    if (this.checkedNodes.indexOf(checkedId) === -1) {
                        this.checkedNodes.push(checkedId);
                    }
                }
            }
        }
        else {
            let childItems = this.getChildNodes(this.treeData, parentIndex);
            if (childItems) {
                this.childStateChange(childItems, parentIndex, childElement, doCheck);
            }
        }
    }
    getChildItems(childItems, doCheck) {
        for (let i = 0; i < childItems.length; i++) {
            let childId = childItems[i][this.fields.id] ? childItems[i][this.fields.id].toString() : null;
            let childIsCheck = childItems[i][this.fields.isChecked] ? childItems[i][this.fields.isChecked].toString() :
                null;
            if (this.checkedNodes.indexOf(childId) !== -1 && !doCheck) {
                this.checkedNodes.splice(this.checkedNodes.indexOf(childId), 1);
            }
            if (this.checkedNodes.indexOf(childId) === -1 && doCheck) {
                this.checkedNodes.push(childId);
            }
            if (childIsCheck === 'true' && !doCheck) {
                this.updateField(this.treeData, this.fields, childId, 'isChecked', null);
            }
            let subChildItems = this.getChildNodes(this.treeData, childId);
            if (subChildItems.length > 0) {
                this.getChildItems(subChildItems, doCheck);
            }
        }
    }
    /**
     * Update checkedNodes when UI interaction happens before the child node renders in DOM for hierarchical DS
     */
    childStateChange(childItems, parent, childElement, doCheck) {
        for (let i = 0; i < childItems.length; i++) {
            let checkedChild = childItems[i][this.fields.id] ? childItems[i][this.fields.id].toString() : '';
            let isCheck = childItems[i][this.fields.isChecked] ? childItems[i][this.fields.isChecked].toString() : null;
            if (this.autoCheck) {
                if (this.checkedNodes.indexOf(parent) !== -1 && this.checkedNodes.indexOf(checkedChild) === -1) {
                    this.checkedNodes.push(checkedChild);
                    if (this.parentNodeCheck.indexOf(checkedChild) !== -1) {
                        this.parentNodeCheck.splice(this.parentNodeCheck.indexOf(checkedChild), 1);
                    }
                }
                else if (this.checkedNodes.indexOf(parent) === -1 && this.checkedNodes.indexOf(checkedChild) !== -1 && !doCheck) {
                    this.checkedNodes.splice(this.checkedNodes.indexOf(checkedChild), 1);
                    if (isCheck === 'true') {
                        this.updateField(this.treeData, this.fields, checkedChild, 'isChecked', null);
                    }
                }
            }
            else if (!this.autoCheck) {
                if (!doCheck) {
                    if (this.checkedNodes.indexOf(checkedChild) !== -1) {
                        this.checkedNodes.splice(this.checkedNodes.indexOf(checkedChild), 1);
                    }
                    this.updateField(this.treeData, this.fields, checkedChild, 'isChecked', null);
                    this.checkedNodes = [];
                }
                else {
                    if (this.checkedNodes.indexOf(checkedChild) === -1) {
                        this.checkedNodes.push(checkedChild);
                    }
                }
            }
            let subChild = this.getChildNodes([childItems[i]], checkedChild);
            if (subChild) {
                this.childStateChange(subChild, parent, childElement, doCheck);
            }
        }
    }
    //This method can be used to get all child nodes of a parent by passing the children of a parent along with 'validateCheck' set to false
    allCheckNode(child, newCheck, checked, childCheck, validateCheck) {
        if (child) {
            for (let length = 0; length < child.length; length++) {
                let childId = getValue(this.fields.id, child[length]);
                let check = this.element.querySelector('[data-uid="' + childId + '"]');
                //Validates isChecked case while no UI interaction has been performed on the node or it's parent
                if (validateCheck !== false && this.checkedElement.indexOf(childId.toString()) === -1) {
                    if (((check === null && !isNullOrUndefined(child[length][this.fields.isChecked]) && newCheck.indexOf(childId.toString()) === -1)
                        || childCheck === 0 || checked === 2)) {
                        (child[length][this.fields.isChecked] !== false || checked === 2) ? newCheck.push(childId.toString())
                            : childCheck = null;
                        childCheck = (child[length][this.fields.isChecked] !== false || checked === 2) ? 0 : null;
                    }
                }
                //Pushes child checked node done thro' UI interaction
                if (newCheck.indexOf(childId.toString()) === -1 && isNullOrUndefined(checked)) {
                    newCheck.push(childId.toString());
                }
                //Gets if any next level children are available for child nodes
                if (getValue(this.fields.hasChildren, child[length]) === true ||
                    getValue(this.fields.child.toString(), child[length])) {
                    let id = getValue(this.fields.id, child[length]);
                    let childId = this.getChildNodes(this.treeData, id.toString());
                    if (childId) {
                        (isNullOrUndefined(validateCheck)) ? this.allCheckNode(childId, newCheck, checked, childCheck) :
                            this.allCheckNode(childId, newCheck, checked, childCheck, validateCheck);
                        childCheck = null;
                    }
                }
                childCheck = null;
            }
        }
    }
    openNode(toBeOpened, e) {
        let focusedNode = this.getFocusedNode();
        let icon = select('div.' + ICON, focusedNode);
        if (toBeOpened) {
            if (!icon) {
                return;
            }
            else if (icon.classList.contains(EXPANDABLE)) {
                this.expandAction(focusedNode, icon, e);
            }
            else {
                this.focusNextNode(focusedNode, true);
            }
        }
        else {
            if (icon && icon.classList.contains(COLLAPSIBLE)) {
                this.collapseNode(focusedNode, icon, e);
            }
            else {
                let parentLi = closest(closest(focusedNode, '.' + PARENTITEM), '.' + LISTITEM);
                if (!parentLi) {
                    return;
                }
                else {
                    if (!parentLi.classList.contains('e-disable')) {
                        this.setFocus(focusedNode, parentLi);
                        this.navigateToFocus(true);
                    }
                }
            }
        }
    }
    navigateNode(isTowards) {
        let focusedNode = this.getFocusedNode();
        this.focusNextNode(focusedNode, isTowards);
    }
    navigateRootNode(isBackwards) {
        let focusedNode = this.getFocusedNode();
        let rootNode = isBackwards ? this.getRootNode() : this.getEndNode();
        if (!rootNode.classList.contains('e-disable')) {
            this.setFocus(focusedNode, rootNode);
            this.navigateToFocus(isBackwards);
        }
    }
    getFocusedNode() {
        let selectedItem;
        let fNode = select('.' + LISTITEM + '.' + FOCUS, this.element);
        if (isNullOrUndefined(fNode)) {
            selectedItem = select('.' + LISTITEM, this.element);
        }
        return isNullOrUndefined(fNode) ? (isNullOrUndefined(selectedItem) ? this.element.firstElementChild : selectedItem) : fNode;
    }
    focusNextNode(li, isTowards) {
        let nextNode = isTowards ? this.getNextNode(li) : this.getPrevNode(li);
        this.setFocus(li, nextNode);
        this.navigateToFocus(!isTowards);
        if (nextNode.classList.contains('e-disable')) {
            let lastChild = nextNode.lastChild;
            if (nextNode.previousSibling == null && nextNode.classList.contains('e-level-1')) {
                this.focusNextNode(nextNode, true);
            }
            else if (nextNode.nextSibling == null && nextNode.classList.contains('e-node-collapsed')) {
                this.focusNextNode(nextNode, false);
            }
            else if (nextNode.nextSibling == null && lastChild.classList.contains(TEXTWRAP)) {
                this.focusNextNode(nextNode, false);
            }
            else {
                this.focusNextNode(nextNode, isTowards);
            }
        }
    }
    getNextNode(li) {
        let index = this.liList.indexOf(li);
        let nextNode;
        do {
            index++;
            nextNode = this.liList[index];
            if (isNullOrUndefined(nextNode)) {
                return li;
            }
        } while (!isVisible(nextNode));
        return nextNode;
    }
    getPrevNode(li) {
        let index = this.liList.indexOf(li);
        let prevNode;
        do {
            index--;
            prevNode = this.liList[index];
            if (isNullOrUndefined(prevNode)) {
                return li;
            }
        } while (!isVisible(prevNode));
        return prevNode;
    }
    getRootNode() {
        let index = 0;
        let rootNode;
        do {
            rootNode = this.liList[index];
            index++;
        } while (!isVisible(rootNode));
        return rootNode;
    }
    getEndNode() {
        let index = this.liList.length - 1;
        let endNode;
        do {
            endNode = this.liList[index];
            index--;
        } while (!isVisible(endNode));
        return endNode;
    }
    setFocus(preNode, nextNode) {
        removeClass([preNode], [HOVER, FOCUS]);
        if (!nextNode.classList.contains('e-disable')) {
            addClass([nextNode], [HOVER, FOCUS]);
            this.updateIdAttr(preNode, nextNode);
        }
    }
    updateIdAttr(preNode, nextNode) {
        this.element.removeAttribute('aria-activedescendant');
        if (preNode) {
            preNode.removeAttribute('id');
        }
        nextNode.setAttribute('id', this.element.id + '_active');
        this.element.setAttribute('aria-activedescendant', this.element.id + '_active');
    }
    focusIn() {
        if (!this.mouseDownStatus) {
            addClass([this.getFocusedNode()], HOVER);
        }
        this.mouseDownStatus = false;
    }
    focusOut() {
        removeClass([this.getFocusedNode()], HOVER);
    }
    onMouseOver(e) {
        let target = e.target;
        let classList$$1 = target.classList;
        let currentLi = closest(target, '.' + LISTITEM);
        if (!currentLi || classList$$1.contains(PARENTITEM) || classList$$1.contains(LISTITEM)) {
            this.removeHover();
            return;
        }
        else {
            if (currentLi && !currentLi.classList.contains('e-disable')) {
                this.setHover(currentLi);
            }
        }
    }
    setHover(li) {
        if (!li.classList.contains(HOVER)) {
            this.removeHover();
            addClass([li], HOVER);
        }
    }
    ;
    onMouseLeave(e) {
        this.removeHover();
    }
    removeHover() {
        let hoveredNode = selectAll('.' + HOVER, this.element);
        if (hoveredNode && hoveredNode.length) {
            removeClass(hoveredNode, HOVER);
        }
    }
    ;
    getNodeData(currLi, fromDS) {
        if (!isNullOrUndefined(currLi) && currLi.classList.contains(LISTITEM) &&
            !isNullOrUndefined(closest(currLi, '.' + CONTROL)) && closest(currLi, '.' + CONTROL).classList.contains(ROOT)) {
            let id = currLi.getAttribute('data-uid');
            let text = this.getText(currLi, fromDS);
            let pNode = closest(currLi.parentNode, '.' + LISTITEM);
            let pid = pNode ? pNode.getAttribute('data-uid') : null;
            let selected = currLi.classList.contains(ACTIVE);
            let expanded = (currLi.getAttribute('aria-expanded') === 'true') ? true : false;
            let hasChildren = currLi.getAttribute('aria-expanded') !== null ? true : (select('.' + EXPANDABLE, currLi) || select('.' + COLLAPSIBLE, currLi)) != null ? true : false;
            let checked = null;
            if (this.showCheckBox) {
                checked = select('.' + CHECKBOXWRAP, currLi).getAttribute('aria-checked');
            }
            return {
                id: id, text: text, parentID: pid, selected: selected, expanded: expanded,
                isChecked: checked, hasChildren: hasChildren
            };
        }
        return { id: '', text: '', parentID: '', selected: false, expanded: false, isChecked: '', hasChildren: false };
    }
    getText(currLi, fromDS) {
        if (fromDS) {
            let nodeData = this.getNodeObject(currLi.getAttribute('data-uid'));
            let level = parseFloat(currLi.getAttribute('aria-level'));
            let nodeFields = this.getFields(this.fields, level, 1);
            return getValue(nodeFields.text, nodeData);
        }
        return select('.' + LISTTEXT, currLi).textContent;
    }
    getExpandEvent(currLi, e) {
        let nodeData = this.getNodeData(currLi);
        return { cancel: false, isInteracted: isNullOrUndefined(e) ? false : true, node: currLi, nodeData: nodeData, event: e };
    }
    renderNodeTemplate(data, textEle, dataId) {
        let tempArr = this.nodeTemplateFn(data, this, 'nodeTemplate' + dataId, this.element.id + 'nodeTemplate', this.isStringTemplate, undefined, textEle);
        if (tempArr) {
            tempArr = Array.prototype.slice.call(tempArr);
            append(tempArr, textEle);
        }
    }
    destroyTemplate(liEle) {
        this.clearTemplate(['nodeTemplate' + liEle.getAttribute('data-uid')]);
    }
    reRenderNodes() {
        this.updateListProp(this.fields);
        resetBlazorTemplate(this.element.id + 'nodeTemplate', 'NodeTemplate');
        if (Browser.isIE) {
            this.ulElement = this.element.querySelector('.e-list-parent.e-ul');
            this.ulElement.parentElement.removeChild(this.ulElement);
        }
        else {
            this.element.innerHTML = '';
        }
        if (!isNullOrUndefined(this.nodeTemplateFn)) {
            this.clearTemplate();
        }
        this.setTouchClass();
        this.setProperties({ selectedNodes: [], checkedNodes: [], expandedNodes: [] }, true);
        this.checkedElement = [];
        this.isLoaded = false;
        this.setDataBinding(true);
    }
    setCssClass(oldClass, newClass) {
        if (!isNullOrUndefined(oldClass) && oldClass !== '') {
            removeClass([this.element], oldClass.split(' '));
        }
        if (!isNullOrUndefined(newClass) && newClass !== '') {
            addClass([this.element], newClass.split(' '));
        }
    }
    editingHandler(e) {
        let target = e.target;
        if (!target || target.classList.contains(ROOT) || target.classList.contains(PARENTITEM) ||
            target.classList.contains(LISTITEM) || target.classList.contains(ICON) ||
            target.classList.contains(INPUT) || target.classList.contains(INPUTGROUP)) {
            return;
        }
        else {
            let liEle = closest(target, '.' + LISTITEM);
            this.createTextbox(liEle, e);
        }
    }
    createTextbox(liEle, e) {
        let oldInpEle = select('.' + TREEINPUT, this.element);
        if (oldInpEle) {
            oldInpEle.blur();
        }
        let textEle = select('.' + LISTTEXT, liEle);
        this.updateOldText(liEle);
        let innerEle = this.createElement('input', { className: TREEINPUT, attrs: { value: this.oldText } });
        let eventArgs = this.getEditEvent(liEle, null, innerEle.outerHTML);
        this.trigger('nodeEditing', eventArgs, (observedArgs) => {
            if (!observedArgs.cancel) {
                let inpWidth = textEle.offsetWidth + 5;
                let style = 'width:' + inpWidth + 'px';
                addClass([liEle], EDITING);
                if (!isNullOrUndefined(this.nodeTemplateFn)) {
                    this.destroyTemplate(liEle);
                }
                textEle.innerHTML = eventArgs.innerHtml;
                let inpEle = select('.' + TREEINPUT, textEle);
                this.inputObj = Input.createInput({
                    element: inpEle,
                    properties: {
                        enableRtl: this.enableRtl,
                    }
                }, this.createElement);
                this.inputObj.container.setAttribute('style', style);
                inpEle.focus();
                let inputEle = inpEle;
                inputEle.setSelectionRange(0, inputEle.value.length);
                this.wireInputEvents(inpEle);
            }
        });
    }
    updateOldText(liEle) {
        let id = liEle.getAttribute('data-uid');
        this.editData = this.getNodeObject(id);
        let level = parseFloat(liEle.getAttribute('aria-level'));
        this.editFields = this.getFields(this.fields, level, 1);
        this.oldText = getValue(this.editFields.text, this.editData);
    }
    inputFocusOut(e) {
        if (!select('.' + TREEINPUT, this.element)) {
            return;
        }
        let target = e.target;
        let newText = target.value;
        let txtEle = closest(target, '.' + LISTTEXT);
        let liEle = closest(target, '.' + LISTITEM);
        detach(this.inputObj.container);
        if (this.fields.dataSource instanceof DataManager && !this.isOffline && (this.fields.dataSource.adaptorName !== 'BlazorAdaptor')) {
            this.crudOperation('update', null, liEle, newText, null, null, true);
        }
        else {
            this.appendNewText(liEle, txtEle, newText, true);
        }
    }
    appendNewText(liEle, txtEle, newText, isInput) {
        let eventArgs = this.getEditEvent(liEle, newText, null);
        this.trigger('nodeEdited', eventArgs, (observedArgs) => {
            newText = observedArgs.cancel ? observedArgs.oldText : observedArgs.newText;
            this.updateText(liEle, txtEle, newText, isInput);
            if (observedArgs.oldText !== newText) {
                this.triggerEvent();
            }
        });
    }
    updateText(liEle, txtEle, newText, isInput) {
        let newData = setValue(this.editFields.text, newText, this.editData);
        if (!isNullOrUndefined(this.nodeTemplateFn)) {
            txtEle.innerText = '';
            let dataId = liEle.getAttribute('data-uid');
            this.renderNodeTemplate(newData, txtEle, dataId);
            this.updateBlazorTemplate();
            this.renderReactTemplates();
        }
        else {
            txtEle.innerText = newText;
        }
        if (isInput) {
            removeClass([liEle], EDITING);
            txtEle.focus();
        }
    }
    getElement(ele) {
        if (isNullOrUndefined(ele)) {
            return null;
        }
        else if (typeof ele === 'string') {
            return this.element.querySelector('[data-uid="' + ele + '"]');
        }
        else if (typeof ele === 'object') {
            return getElement(ele);
        }
        else {
            return null;
        }
    }
    getId(ele) {
        if (isNullOrUndefined(ele)) {
            return null;
        }
        else if (typeof ele === 'string') {
            return ele;
        }
        else if (typeof ele === 'object') {
            return (getElement(ele)).getAttribute('data-uid');
        }
        else {
            return null;
        }
    }
    getEditEvent(liEle, newText, inpEle) {
        let data = this.getNodeData(liEle);
        return { cancel: false, newText: newText, node: liEle, nodeData: data, oldText: this.oldText, innerHtml: inpEle };
    }
    getNodeObject(id) {
        let childNodes;
        if (isNullOrUndefined(id)) {
            return childNodes;
        }
        else if (this.dataType === 1) {
            for (let i = 0, objlen = this.treeData.length; i < objlen; i++) {
                let dataId = getValue(this.fields.id, this.treeData[i]);
                if (!isNullOrUndefined(this.treeData[i]) && !isNullOrUndefined(dataId) && dataId.toString() === id) {
                    return this.treeData[i];
                }
            }
        }
        else {
            return this.getChildNodeObject(this.treeData, this.fields, id);
        }
        return childNodes;
    }
    getChildNodeObject(obj, mapper, id) {
        let newList;
        if (isNullOrUndefined(obj)) {
            return newList;
        }
        for (let i = 0, objlen = obj.length; i < objlen; i++) {
            let dataId = getValue(mapper.id, obj[i]);
            if (obj[i] && dataId && dataId.toString() === id) {
                return obj[i];
            }
            else if (typeof mapper.child === 'string' && !isNullOrUndefined(getValue(mapper.child, obj[i]))) {
                let childData = getValue(mapper.child, obj[i]);
                newList = this.getChildNodeObject(childData, this.getChildMapper(mapper), id);
                if (newList !== undefined) {
                    break;
                }
            }
            else if (this.fields.dataSource instanceof DataManager && !isNullOrUndefined(getValue('child', obj[i]))) {
                let child = 'child';
                newList = this.getChildNodeObject(getValue(child, obj[i]), this.getChildMapper(mapper), id);
                if (newList !== undefined) {
                    break;
                }
            }
        }
        return newList;
    }
    setDragAndDrop(toBind) {
        if (toBind && !this.disabled) {
            this.initializeDrag();
        }
        else {
            this.destroyDrag();
        }
    }
    initializeDrag() {
        let virtualEle;
        let proxy = this;
        this.dragObj = new Draggable(this.element, {
            enableTailMode: true, enableAutoScroll: true,
            dragArea: this.dragArea,
            dragTarget: '.' + TEXTWRAP,
            helper: (e) => {
                this.dragTarget = e.sender.target;
                let dragRoot = closest(this.dragTarget, '.' + ROOT);
                let dragWrap = closest(this.dragTarget, '.' + TEXTWRAP);
                this.dragLi = closest(this.dragTarget, '.' + LISTITEM);
                if (this.fullRowSelect && !dragWrap && this.dragTarget.classList.contains(FULLROW)) {
                    dragWrap = this.dragTarget.nextElementSibling;
                }
                if (!this.dragTarget || !e.element.isSameNode(dragRoot) || !dragWrap ||
                    this.dragTarget.classList.contains(ROOT) || this.dragTarget.classList.contains(PARENTITEM) ||
                    this.dragTarget.classList.contains(LISTITEM) || this.dragLi.classList.contains('e-disable')) {
                    return false;
                }
                let cloneEle = (dragWrap.cloneNode(true));
                if (isNullOrUndefined(select('div.' + ICON, cloneEle))) {
                    let icon = proxy.createElement('div', { className: ICON + ' ' + EXPANDABLE });
                    cloneEle.insertBefore(icon, cloneEle.children[0]);
                }
                let cssClass = DRAGITEM + ' ' + ROOT + ' ' + this.cssClass + ' ' + (this.enableRtl ? RTL$1 : '');
                virtualEle = proxy.createElement('div', { className: cssClass });
                virtualEle.appendChild(cloneEle);
                let nLen = this.selectedNodes.length;
                if (nLen > 1 && this.allowMultiSelection && this.dragLi.classList.contains(ACTIVE)) {
                    let cNode = proxy.createElement('span', { className: DROPCOUNT, innerHTML: '' + nLen });
                    virtualEle.appendChild(cNode);
                }
                document.body.appendChild(virtualEle);
                document.body.style.cursor = '';
                this.dragData = this.getNodeData(this.dragLi);
                return virtualEle;
            },
            dragStart: (e) => {
                addClass([this.element], DRAGGING);
                let listItem = closest(e.target, '.e-list-item');
                let level;
                if (listItem) {
                    level = parseInt(listItem.getAttribute('aria-level'), 10);
                }
                let eventArgs = this.getDragEvent(e.event, this, null, e.target, null, virtualEle, level);
                if (eventArgs.draggedNode.classList.contains(EDITING)) {
                    this.dragObj.intDestroy(e.event);
                    this.dragCancelAction(virtualEle);
                }
                else {
                    this.trigger('nodeDragStart', eventArgs, (observedArgs) => {
                        if (observedArgs.cancel) {
                            this.dragObj.intDestroy(e.event);
                            this.dragCancelAction(virtualEle);
                        }
                        else {
                            this.dragStartAction = true;
                        }
                        if (isBlazor()) {
                            e.bindEvents(getElement(e.dragElement));
                        }
                    });
                }
            },
            drag: (e) => {
                this.dragObj.setProperties({ cursorAt: { top: (!isNullOrUndefined(e.event.targetTouches) || Browser.isDevice) ? 60 : -20 } });
                this.dragAction(e, virtualEle);
            },
            dragStop: (e) => {
                removeClass([this.element], DRAGGING);
                this.removeVirtualEle();
                let dropTarget = e.target;
                let preventTargetExpand = false;
                let dropRoot = (closest(dropTarget, '.' + DROPPABLE));
                let isHelperElement = true;
                if (!dropTarget || !dropRoot) {
                    detach(e.helper);
                    document.body.style.cursor = '';
                    isHelperElement = false;
                }
                let listItem = closest(dropTarget, '.e-list-item');
                let level;
                if (listItem) {
                    level = parseInt(listItem.getAttribute('aria-level'), 10);
                }
                let eventArgs = this.getDragEvent(e.event, this, dropTarget, dropTarget, null, e.helper, level);
                eventArgs.preventTargetExpand = preventTargetExpand;
                if ((this.isBlazorPlatform && this.dragStartAction) || !this.isBlazorPlatform) {
                    this.trigger('nodeDragStop', eventArgs, (observedArgs) => {
                        this.dragParent = observedArgs.draggedParentNode;
                        this.preventExpand = observedArgs.preventTargetExpand;
                        if (observedArgs.cancel) {
                            if (e.helper.parentNode) {
                                detach(e.helper);
                            }
                            document.body.style.cursor = '';
                            isHelperElement = false;
                        }
                        this.dragStartAction = false;
                        if (this.isBlazorPlatform && isHelperElement) {
                            this.dropAction(e, true);
                        }
                    });
                }
            }
        });
        this.dropObj = new Droppable(this.element, {
            out: (e) => {
                if (!isNullOrUndefined(e) && !e.target.classList.contains(SIBLING)) {
                    document.body.style.cursor = 'not-allowed';
                }
            },
            over: (e) => {
                document.body.style.cursor = '';
            },
            drop: (e) => {
                if (!this.isBlazorPlatform) {
                    this.dropAction(e);
                }
            }
        });
    }
    dragCancelAction(virtualEle) {
        detach(virtualEle);
        removeClass([this.element], DRAGGING);
        this.dragStartAction = false;
    }
    dragAction(e, virtualEle) {
        let dropRoot = closest(e.target, '.' + DROPPABLE);
        let dropWrap = closest(e.target, '.' + TEXTWRAP);
        let icon = select('div.' + ICON, virtualEle);
        removeClass([icon], [DROPIN, DROPNEXT, DROPOUT, NODROP]);
        this.removeVirtualEle();
        document.body.style.cursor = '';
        let classList$$1 = e.target.classList;
        if (this.fullRowSelect && !dropWrap && !isNullOrUndefined(classList$$1) && classList$$1.contains(FULLROW)) {
            dropWrap = e.target.nextElementSibling;
        }
        if (dropRoot) {
            let dropLi = closest(e.target, '.' + LISTITEM);
            let checkWrapper = closest(e.target, '.' + CHECKBOXWRAP);
            let collapse = closest(e.target, '.' + COLLAPSIBLE);
            let expand = closest(e.target, '.' + EXPANDABLE);
            if (!dropRoot.classList.contains(ROOT) || (dropWrap &&
                (!dropLi.isSameNode(this.dragLi) && !this.isDescendant(this.dragLi, dropLi)))) {
                if (this.hasTemplate && dropLi) {
                    let templateTarget = select(this.fullRowSelect ? '.' + FULLROW : '.' + TEXTWRAP, dropLi);
                    if ((e && (!expand && !collapse) && e.event.offsetY < 7 && !checkWrapper) || (((expand && e.event.offsetY < 5) || (collapse && e.event.offsetX < 3)))) {
                        let index = this.fullRowSelect ? (1) : (0);
                        this.appendIndicator(dropLi, icon, index);
                    }
                    else if ((e && (!expand && !collapse) && !checkWrapper && templateTarget && e.event.offsetY > templateTarget.offsetHeight - 10) || ((expand && e.event.offsetY > 19) || (collapse && e.event.offsetX > 19))) {
                        let index = this.fullRowSelect ? (2) : (1);
                        this.appendIndicator(dropLi, icon, index);
                    }
                    else {
                        addClass([icon], DROPIN);
                    }
                }
                else {
                    if ((dropLi && e && (!expand && !collapse) && (e.event.offsetY < 7) && !checkWrapper) || (((expand && e.event.offsetY < 5) || (collapse && e.event.offsetX < 3)))) {
                        let index = this.fullRowSelect ? (1) : (0);
                        this.appendIndicator(dropLi, icon, index);
                    }
                    else if ((dropLi && e && (!expand && !collapse) && (e.target.offsetHeight > 0 && e.event.offsetY > (e.target.offsetHeight - 10)) && !checkWrapper) || (((expand && e.event.offsetY > 19) || (collapse && e.event.offsetX > 19)))) {
                        let index = this.fullRowSelect ? (2) : (1);
                        this.appendIndicator(dropLi, icon, index);
                    }
                    else {
                        addClass([icon], DROPIN);
                    }
                }
            }
            else if (e.target.nodeName === 'LI' && (!dropLi.isSameNode(this.dragLi) && !this.isDescendant(this.dragLi, dropLi))) {
                addClass([icon], DROPNEXT);
                this.renderVirtualEle(e);
            }
            else if (e.target.classList.contains(SIBLING)) {
                addClass([icon], DROPNEXT);
            }
            else {
                addClass([icon], DROPOUT);
            }
        }
        else {
            addClass([icon], NODROP);
            document.body.style.cursor = 'not-allowed';
        }
        let listItem = closest(e.target, '.e-list-item');
        let level;
        if (listItem) {
            level = parseInt(listItem.getAttribute('aria-level'), 10);
        }
        let eventArgs = this.getDragEvent(e.event, this, e.target, e.target, null, virtualEle, level);
        if (eventArgs.dropIndicator) {
            removeClass([icon], eventArgs.dropIndicator);
        }
        this.trigger('nodeDragging', eventArgs);
        if (eventArgs.dropIndicator) {
            addClass([icon], eventArgs.dropIndicator);
        }
    }
    appendIndicator(dropLi, icon, index) {
        addClass([icon], DROPNEXT);
        let virEle = this.createElement('div', { className: SIBLING });
        dropLi.insertBefore(virEle, dropLi.children[index]);
    }
    /* eslint-disable */
    dropAction(e, isBlazorDrop) {
        let offsetY = e.event.offsetY;
        let dropTarget = e.target;
        let dragObj;
        let level;
        let drop = false;
        let dragInstance;
        if (!isBlazorDrop) {
            dragInstance = e.dragData.draggable;
        }
        else {
            dragInstance = e.element;
        }
        for (let i = 0; i < dragInstance.ej2_instances.length; i++) {
            if (dragInstance.ej2_instances[i] instanceof TreeView_1) {
                dragObj = dragInstance.ej2_instances[i];
                break;
            }
        }
        if (dragObj && dragObj.dragTarget) {
            let dragTarget = dragObj.dragTarget;
            let dragLi = (closest(dragTarget, '.' + LISTITEM));
            let dropLi = (closest(dropTarget, '.' + LISTITEM));
            if (dropLi == null && dropTarget.classList.contains(ROOT)) {
                dropLi = dropTarget.firstElementChild;
            }
            if (!isBlazorDrop) {
                detach(e.droppedElement);
            }
            else {
                detach(e.helper);
            }
            document.body.style.cursor = '';
            if (!dropLi || dropLi.isSameNode(dragLi) || this.isDescendant(dragLi, dropLi)) {
                if (this.fields.dataSource instanceof DataManager === false) {
                    this.preventExpand = false;
                }
                return;
            }
            if (dragObj.allowMultiSelection && dragLi.classList.contains(ACTIVE)) {
                let sNodes = selectAll('.' + ACTIVE, dragObj.element);
                if (e.target.offsetHeight <= 33 && offsetY > e.target.offsetHeight - 10 && offsetY > 6) {
                    for (let i = sNodes.length - 1; i >= 0; i--) {
                        if (dropLi.isSameNode(sNodes[i]) || this.isDescendant(sNodes[i], dropLi)) {
                            continue;
                        }
                        this.appendNode(dropTarget, sNodes[i], dropLi, e, dragObj, offsetY);
                    }
                }
                else {
                    for (let i = 0; i < sNodes.length; i++) {
                        if (dropLi.isSameNode(sNodes[i]) || this.isDescendant(sNodes[i], dropLi)) {
                            continue;
                        }
                        this.appendNode(dropTarget, sNodes[i], dropLi, e, dragObj, offsetY);
                    }
                }
            }
            else {
                this.appendNode(dropTarget, dragLi, dropLi, e, dragObj, offsetY);
            }
            level = parseInt(dragLi.getAttribute('aria-level'), 10);
            drop = true;
        }
        if (this.fields.dataSource instanceof DataManager === false) {
            this.preventExpand = false;
        }
        if (!isBlazorDrop) {
            this.trigger('nodeDropped', this.getDragEvent(e.event, dragObj, dropTarget, e.target, e.dragData.draggedElement, null, level, drop));
        }
        else {
            this.trigger('nodeDropped', this.getDragEvent(e.event, dragObj, dropTarget, e.target, e.element, null, level, drop));
        }
        if (dragObj.element.id !== this.element.id) {
            dragObj.triggerEvent();
        }
        this.triggerEvent();
    }
    appendNode(dropTarget, dragLi, dropLi, e, dragObj, offsetY) {
        let checkWrapper = closest(dropTarget, '.' + CHECKBOXWRAP);
        let collapse = closest(e.target, '.' + COLLAPSIBLE);
        let expand = closest(e.target, '.' + EXPANDABLE);
        if (!dragLi.classList.contains('e-disable') && !checkWrapper && ((expand && e.event.offsetY < 5) || (collapse && e.event.offsetX < 3) || (expand && e.event.offsetY > 19) || (collapse && e.event.offsetX > 19) || (!expand && !collapse))) {
            if (dropTarget.nodeName === 'LI') {
                this.dropAsSiblingNode(dragLi, dropLi, e, dragObj);
            }
            else if (dropTarget.firstElementChild && dropTarget.classList.contains(ROOT)) {
                if (dropTarget.firstElementChild.nodeName === 'UL') {
                    this.dropAsSiblingNode(dragLi, dropLi, e, dragObj);
                }
            }
            else if ((dropTarget.classList.contains('e-icon-collapsible')) || (dropTarget.classList.contains('e-icon-expandable'))) {
                this.dropAsSiblingNode(dragLi, dropLi, e, dragObj);
            }
            else {
                this.dropAsChildNode(dragLi, dropLi, dragObj, null, e, offsetY);
            }
        }
        else {
            this.dropAsChildNode(dragLi, dropLi, dragObj, null, e, offsetY, true);
        }
    }
    dropAsSiblingNode(dragLi, dropLi, e, dragObj) {
        let dropUl = closest(dropLi, '.' + PARENTITEM);
        let dragParentUl = closest(dragLi, '.' + PARENTITEM);
        let dragParentLi = closest(dragParentUl, '.' + LISTITEM);
        let pre;
        if (e.target.offsetHeight > 0 && e.event.offsetY > e.target.offsetHeight - 2) {
            pre = false;
        }
        else if (e.event.offsetY < 2) {
            pre = true;
        }
        else if (e.target.classList.contains('e-icon-expandable') || (e.target.classList.contains('e-icon-collapsible'))) {
            if ((e.event.offsetY < 5) || (e.event.offsetX < 3)) {
                pre = true;
            }
            else if ((e.event.offsetY > 15) || (e.event.offsetX > 17)) {
                pre = false;
            }
        }
        if ((e.target.classList.contains('e-icon-expandable')) || (e.target.classList.contains('e-icon-collapsible'))) {
            let target = e.target.closest('li');
            dropUl.insertBefore(dragLi, pre ? target : target.nextElementSibling);
        }
        else {
            dropUl.insertBefore(dragLi, pre ? e.target : e.target.nextElementSibling);
        }
        this.moveData(dragLi, dropLi, dropUl, pre, dragObj);
        this.updateElement(dragParentUl, dragParentLi);
        this.updateAriaLevel(dragLi);
        if (dragObj.element.id === this.element.id) {
            this.updateList();
        }
        else {
            dragObj.updateInstance();
            this.updateInstance();
        }
    }
    dropAsChildNode(dragLi, dropLi, dragObj, index, e, pos, isCheck) {
        let dragParentUl = closest(dragLi, '.' + PARENTITEM);
        let dragParentLi = closest(dragParentUl, '.' + LISTITEM);
        let dropParentUl = closest(dropLi, '.' + PARENTITEM);
        let templateTarget;
        if (e && e.target) {
            templateTarget = select(this.fullRowSelect ? '.' + FULLROW : '.' + TEXTWRAP, dropLi);
        }
        if (e && (pos < 7) && !isCheck) {
            dropParentUl.insertBefore(dragLi, dropLi);
            this.moveData(dragLi, dropLi, dropParentUl, true, dragObj);
        }
        else if (e && (e.target.offsetHeight > 0 && pos > (e.target.offsetHeight - 10)) && !isCheck && !this.hasTemplate) {
            dropParentUl.insertBefore(dragLi, dropLi.nextElementSibling);
            this.moveData(dragLi, dropLi, dropParentUl, false, dragObj);
        }
        else if (this.hasTemplate && templateTarget && pos > templateTarget.offsetHeight - 10 && !isCheck) {
            dropParentUl.insertBefore(dragLi, dropLi.nextElementSibling);
            this.moveData(dragLi, dropLi, dropParentUl, false, dragObj);
        }
        else {
            let dropUl = this.expandParent(dropLi);
            let childLi = dropUl.childNodes[index];
            dropUl.insertBefore(dragLi, childLi);
            this.moveData(dragLi, childLi, dropUl, true, dragObj);
        }
        this.updateElement(dragParentUl, dragParentLi);
        this.updateAriaLevel(dragLi);
        if (dragObj.element.id === this.element.id) {
            this.updateList();
        }
        else {
            dragObj.updateInstance();
            this.updateInstance();
        }
    }
    moveData(dragLi, dropLi, dropUl, pre, dragObj) {
        let dropParentLi = closest(dropUl, '.' + LISTITEM);
        let id = this.getId(dragLi);
        let removedData = dragObj.updateChildField(dragObj.treeData, dragObj.fields, id, null, null, true);
        let refId = this.getId(dropLi);
        let index = this.getDataPos(this.treeData, this.fields, refId);
        let parentId = this.getId(dropParentLi);
        if (this.dataType === 1) {
            this.updateField(this.treeData, this.fields, parentId, 'hasChildren', true);
            let pos = isNullOrUndefined(index) ? this.treeData.length : (pre ? index : index + 1);
            if (isNullOrUndefined(parentId) && !this.hasPid) {
                delete removedData[0][this.fields.parentID];
            }
            else {
                let currPid = this.isNumberTypeId ? parseFloat(parentId) : parentId;
                setValue(this.fields.parentID, currPid, removedData[0]);
            }
            this.treeData.splice(pos, 0, removedData[0]);
            if (dragObj.element.id !== this.element.id) {
                let childData = dragObj.removeChildNodes(id);
                pos++;
                for (let i = 0, len = childData.length; i < len; i++) {
                    this.treeData.splice(pos, 0, childData[i]);
                    pos++;
                }
                dragObj.groupedData = dragObj.getGroupedData(dragObj.treeData, dragObj.fields.parentID);
            }
            this.groupedData = this.getGroupedData(this.treeData, this.fields.parentID);
        }
        else {
            this.addChildData(this.treeData, this.fields, parentId, removedData, pre ? index : index + 1);
        }
    }
    expandParent(dropLi) {
        let dropIcon = select('div.' + ICON, dropLi);
        if (dropIcon && dropIcon.classList.contains(EXPANDABLE) && this.preventExpand !== true) {
            this.expandAction(dropLi, dropIcon, null);
        }
        let dropUl = select('.' + PARENTITEM, dropLi);
        if (this.preventExpand === true && !dropUl && dropIcon) {
            this.renderChildNodes(dropLi);
        }
        dropUl = select('.' + PARENTITEM, dropLi);
        if (!isNullOrUndefined(dropUl) && this.preventExpand === true) {
            dropUl.style.display = 'none';
        }
        if (!isNullOrUndefined(dropUl) && this.preventExpand === false) {
            dropUl.style.display = 'block';
        }
        if (isNullOrUndefined(dropUl) && this.preventExpand === true) {
            if (isNullOrUndefined(dropIcon)) {
                ListBase.generateIcon(this.createElement, dropLi, EXPANDABLE, this.listBaseOption);
            }
            let icon = select('div.' + ICON, dropLi);
            if (icon) {
                icon.classList.add('e-icon-expandable');
            }
            dropUl = ListBase.generateUL(this.createElement, [], null, this.listBaseOption);
            dropLi.appendChild(dropUl);
            if (icon) {
                removeClass([icon], COLLAPSIBLE);
            }
            else {
                ListBase.generateIcon(this.createElement, dropLi, EXPANDABLE, this.listBaseOption);
            }
            dropLi.setAttribute('aria-expanded', 'false');
            dropUl.style.display = 'none';
        }
        if (isNullOrUndefined(dropUl)) {
            this.trigger('nodeExpanding', this.getExpandEvent(dropLi, null));
            if (isNullOrUndefined(dropIcon)) {
                ListBase.generateIcon(this.createElement, dropLi, COLLAPSIBLE, this.listBaseOption);
            }
            let icon = select('div.' + ICON, dropLi);
            if (icon) {
                removeClass([icon], EXPANDABLE);
            }
            else {
                ListBase.generateIcon(this.createElement, dropLi, COLLAPSIBLE, this.listBaseOption);
                icon = select('div.' + ICON, dropLi);
                removeClass([icon], EXPANDABLE);
            }
            dropUl = ListBase.generateUL(this.createElement, [], null, this.listBaseOption);
            dropLi.appendChild(dropUl);
            this.addExpand(dropLi);
            this.trigger('nodeExpanded', this.getExpandEvent(dropLi, null));
        }
        return dropUl;
    }
    updateElement(dragParentUl, dragParentLi) {
        if (dragParentLi && dragParentUl.childElementCount === 0) {
            let dragIcon = select('div.' + ICON, dragParentLi);
            detach(dragParentUl);
            detach(dragIcon);
            let parentId = this.getId(dragParentLi);
            this.updateField(this.treeData, this.fields, parentId, 'hasChildren', false);
            this.removeExpand(dragParentLi, true);
        }
    }
    updateAriaLevel(dragLi) {
        let level = this.parents(dragLi, '.' + PARENTITEM).length;
        dragLi.setAttribute('aria-level', '' + level);
        this.updateChildAriaLevel(select('.' + PARENTITEM, dragLi), level + 1);
    }
    updateChildAriaLevel(element, level) {
        if (!isNullOrUndefined(element)) {
            let cNodes = element.childNodes;
            for (let i = 0, len = cNodes.length; i < len; i++) {
                let liEle = cNodes[i];
                liEle.setAttribute('aria-level', '' + level);
                this.updateChildAriaLevel(select('.' + PARENTITEM, liEle), level + 1);
            }
        }
    }
    renderVirtualEle(e) {
        let pre;
        if (e.event.offsetY > e.target.offsetHeight - 2) {
            pre = false;
        }
        else if (e.event.offsetY < 2) {
            pre = true;
        }
        let virEle = this.createElement('div', { className: SIBLING });
        let index = this.fullRowSelect ? (pre ? 1 : 2) : (pre ? 0 : 1);
        e.target.insertBefore(virEle, e.target.children[index]);
    }
    removeVirtualEle() {
        let sibEle = select('.' + SIBLING);
        if (sibEle) {
            detach(sibEle);
        }
    }
    destroyDrag() {
        if (this.dragObj && this.dropObj) {
            this.dragObj.destroy();
            this.dropObj.destroy();
        }
    }
    getDragEvent(event, obj, dropTarget, target, dragNode, cloneEle, level, drop) {
        let dropLi = dropTarget ? closest(dropTarget, '.' + LISTITEM) : null;
        let dropData = dropLi ? this.getNodeData(dropLi) : null;
        let draggedNode = obj ? obj.dragLi : dragNode;
        let draggedNodeData = obj ? obj.dragData : null;
        let newParent = dropTarget ? this.parents(dropTarget, '.' + LISTITEM) : null;
        let dragLiParent = obj.dragLi.parentElement;
        let dragParent = obj.dragLi ? closest(dragLiParent, '.' + LISTITEM) : null;
        let targetParent = null;
        let indexValue = null;
        let iconCss = [DROPNEXT, DROPIN, DROPOUT, NODROP];
        let iconClass = null;
        let node = (drop === true) ? draggedNode : dropLi;
        let index = node ? closest(node, '.e-list-parent') : null;
        let i = 0;
        let position = null;
        dragParent = (obj.dragLi && dragParent === null) ? closest(dragLiParent, '.' + ROOT) : dragParent;
        dragParent = (drop === true) ? this.dragParent : dragParent;
        if (cloneEle) {
            while (i < 4) {
                if (select('.' + ICON, cloneEle).classList.contains(iconCss[i])) {
                    iconClass = iconCss[i];
                    break;
                }
                i++;
            }
        }
        if (index) {
            let dropTar = 0;
            for (i = 0; i < index.childElementCount; i++) {
                dropTar = (drop !== true && index.children[i] === draggedNode && dropLi !== draggedNode) ? ++dropTar : dropTar;
                if ((drop !== true && index.children[i].classList.contains('e-hover'))) {
                    indexValue = (event.offsetY >= 23) ? i + 1 : i;
                    break;
                }
                else if (index.children[i] === node) {
                    indexValue = (event.offsetY >= 23) ? i : i;
                    break;
                }
            }
            indexValue = (dropTar !== 0) ? --indexValue : indexValue;
            position = (iconClass == "e-drop-in") ? "Inside" : ((event.offsetY < 7) ? "Before" : "After");
        }
        if (dropTarget) {
            if (newParent.length === 0) {
                targetParent = null;
            }
            else if (dropTarget.classList.contains(LISTITEM)) {
                targetParent = newParent[0];
            }
            else {
                targetParent = newParent[1];
            }
        }
        if (dropLi === draggedNode) {
            targetParent = dropLi;
        }
        if (dropTarget && target.offsetHeight <= 33 && event.offsetY < target.offsetHeight - 10 && event.offsetY > 6) {
            targetParent = dropLi;
            if (drop !== true) {
                level = ++level;
                let parent = targetParent ? select('.e-list-parent', targetParent) : null;
                indexValue = (parent) ? parent.children.length : 0;
                if (!(this.fields.dataSource instanceof DataManager) && parent === null && targetParent) {
                    let parent = targetParent.hasAttribute('data-uid') ?
                        this.getChildNodes(this.fields.dataSource, targetParent.getAttribute('data-uid').toString()) : null;
                    indexValue = (parent) ? parent.length : 0;
                }
            }
        }
        return {
            cancel: false,
            clonedNode: cloneEle,
            event: event,
            draggedNode: draggedNode,
            draggedNodeData: draggedNodeData,
            droppedNode: dropLi,
            droppedNodeData: dropData,
            dropIndex: indexValue,
            dropLevel: level,
            draggedParentNode: dragParent,
            dropTarget: targetParent,
            dropIndicator: iconClass,
            target: target,
            position: position,
        };
    }
    addFullRow(toAdd) {
        let len = this.liList.length;
        if (toAdd) {
            for (let i = 0; i < len; i++) {
                this.createFullRow(this.liList[i]);
            }
        }
        else {
            for (let i = 0; i < len; i++) {
                let rowDiv = select('.' + FULLROW, this.liList[i]);
                detach(rowDiv);
            }
        }
    }
    createFullRow(item) {
        let rowDiv = this.createElement('div', { className: FULLROW });
        item.insertBefore(rowDiv, item.childNodes[0]);
    }
    addMultiSelect(toAdd) {
        if (toAdd) {
            let liEles = selectAll('.' + LISTITEM + ':not([aria-selected="true"])', this.element);
            for (let ele of liEles) {
                ele.setAttribute('aria-selected', 'false');
            }
        }
        else {
            let liEles = selectAll('.' + LISTITEM + '[aria-selected="false"]', this.element);
            for (let ele of liEles) {
                ele.removeAttribute('aria-selected');
            }
        }
    }
    collapseByLevel(element, level, excludeHiddenNodes) {
        if (level > 0 && !isNullOrUndefined(element)) {
            let cNodes = this.getVisibleNodes(excludeHiddenNodes, element.childNodes);
            for (let i = 0, len = cNodes.length; i < len; i++) {
                let liEle = cNodes[i];
                let icon = select('.' + COLLAPSIBLE, select('.' + TEXTWRAP, liEle));
                if (!isNullOrUndefined(icon)) {
                    this.collapseNode(liEle, icon, null);
                }
                this.collapseByLevel(select('.' + PARENTITEM, liEle), level - 1, excludeHiddenNodes);
            }
        }
    }
    collapseAllNodes(excludeHiddenNodes) {
        let cIcons = this.getVisibleNodes(excludeHiddenNodes, selectAll('.' + COLLAPSIBLE, this.element));
        for (let i = 0, len = cIcons.length; i < len; i++) {
            let icon = cIcons[i];
            let liEle = closest(icon, '.' + LISTITEM);
            this.collapseNode(liEle, icon, null);
        }
    }
    expandByLevel(element, level, excludeHiddenNodes) {
        if (level > 0 && !isNullOrUndefined(element)) {
            let eNodes = this.getVisibleNodes(excludeHiddenNodes, element.childNodes);
            for (let i = 0, len = eNodes.length; i < len; i++) {
                let liEle = eNodes[i];
                let icon = select('.' + EXPANDABLE, select('.' + TEXTWRAP, liEle));
                if (!isNullOrUndefined(icon)) {
                    this.expandAction(liEle, icon, null);
                }
                this.expandByLevel(select('.' + PARENTITEM, liEle), level - 1, excludeHiddenNodes);
            }
        }
    }
    expandAllNodes(excludeHiddenNodes) {
        let eIcons = this.getVisibleNodes(excludeHiddenNodes, selectAll('.' + EXPANDABLE, this.element));
        for (let i = 0, len = eIcons.length; i < len; i++) {
            let icon = eIcons[i];
            let liEle = closest(icon, '.' + LISTITEM);
            this.expandAction(liEle, icon, null, true);
        }
    }
    getVisibleNodes(excludeHiddenNodes, nodes) {
        let vNodes = Array.prototype.slice.call(nodes);
        if (excludeHiddenNodes) {
            for (let i = 0; i < vNodes.length; i++) {
                if (!isVisible(vNodes[i])) {
                    vNodes.splice(i, 1);
                    i--;
                }
            }
        }
        return vNodes;
    }
    removeNode(node) {
        let dragParentUl = closest(node, '.' + PARENTITEM);
        let dragParentLi = closest(dragParentUl, '.' + LISTITEM);
        if (!isNullOrUndefined(this.nodeTemplateFn)) {
            this.destroyTemplate(node);
        }
        detach(node);
        this.updateElement(dragParentUl, dragParentLi);
        this.updateInstance();
        this.removeData(node);
    }
    updateInstance() {
        this.updateList();
        this.updateSelectedNodes();
        this.updateExpandedNodes();
        this.allowServerDataBinding = false;
        this.updateServerProperties("expand");
        this.updateServerProperties("check");
        this.updateServerProperties("select");
        this.allowServerDataBinding = true;
    }
    updateServerProperties(action) {
        if (this.isBlazorPlatform) {
            if (action == "expand") {
                this.isBlazorExpandedNodes = this.expandedNodes;
                this.setProperties({ expandedNodes: [] }, true);
            }
            else if (action == "check") {
                this.setProperties({ checkedNodes: this.checkedNodes }, true);
            }
            else {
                this.setProperties({ selectedNodes: this.selectedNodes }, true);
            }
        }
    }
    updateList() {
        this.liList = Array.prototype.slice.call(selectAll('.' + LISTITEM, this.element));
    }
    updateSelectedNodes() {
        if (!this.isBlazorPlatform || (this.isBlazorPlatform && !this.initialRender)) {
            this.setProperties({ selectedNodes: [] }, true);
            let sNodes = selectAll('.' + ACTIVE, this.element);
            this.selectGivenNodes(sNodes);
        }
        else if (this.isBlazorPlatform && this.initialRender) {
            let sNodes = selectAll('.' + ACTIVE, this.element);
            for (let a = 0; a < sNodes.length; a++) {
                let id = sNodes[a].getAttribute("data-uid").toString();
                if (!isNullOrUndefined(id) && this.selectedNodes.indexOf(id) === -1) {
                    this.selectedNodes.push(id);
                }
            }
        }
    }
    updateExpandedNodes() {
        if (!this.isBlazorPlatform || (this.isBlazorPlatform && !this.initialRender)) {
            this.setProperties({ expandedNodes: [] }, true);
            let eNodes = selectAll('[aria-expanded="true"]', this.element);
            for (let i = 0, len = eNodes.length; i < len; i++) {
                this.addExpand(eNodes[i]);
            }
        }
        else if (this.isBlazorPlatform && this.initialRender) {
            let eNodes = selectAll('[aria-expanded="true"]', this.element);
            for (let a = 0; a < eNodes.length; a++) {
                let id = eNodes[a].getAttribute("data-uid").toString();
                if (!isNullOrUndefined(id) && this.expandedNodes.indexOf(id) === -1) {
                    this.expandedNodes.push(id);
                }
            }
        }
    }
    removeData(node) {
        if (this.dataType === 1) {
            let dm = new DataManager(this.treeData);
            let id = this.getId(node);
            let data = {};
            let newId = this.isNumberTypeId ? parseFloat(id) : id;
            data[this.fields.id] = newId;
            dm.remove(this.fields.id, data);
            this.removeChildNodes(id);
        }
        else {
            let id = this.getId(node);
            this.updateChildField(this.treeData, this.fields, id, null, null, true);
        }
    }
    removeChildNodes(parentId) {
        let cNodes = this.getChildGroup(this.groupedData, parentId, false);
        let childData = [];
        if (cNodes) {
            for (let i = 0, len = cNodes.length; i < len; i++) {
                let dm = new DataManager(this.treeData);
                let id = getValue(this.fields.id, cNodes[i]).toString();
                let data = {};
                let currId = this.isNumberTypeId ? parseFloat(id) : id;
                data[this.fields.id] = currId;
                let nodeData = dm.remove(this.fields.id, data);
                childData.push(nodeData[0]);
                this.removeChildNodes(id);
            }
        }
        return childData;
    }
    doGivenAction(nodes, selector, toExpand) {
        for (let i = 0, len = nodes.length; i < len; i++) {
            let liEle = this.getElement(nodes[i]);
            if (isNullOrUndefined(liEle)) {
                continue;
            }
            let icon = select('.' + selector, select('.' + TEXTWRAP, liEle));
            if (!isNullOrUndefined(icon)) {
                toExpand ? this.expandAction(liEle, icon, null) : this.collapseNode(liEle, icon, null);
            }
        }
    }
    addGivenNodes(nodes, dropLi, index, isRemote, dropEle) {
        if (nodes.length === 0) {
            return;
        }
        let sNodes = this.getSortedData(nodes);
        let level = dropLi ? parseFloat(dropLi.getAttribute('aria-level')) + 1 : 1;
        if (isRemote) {
            this.updateMapper(level);
        }
        let li = ListBase.createListItemFromJson(this.createElement, sNodes, this.listBaseOption, level);
        let dropUl;
        if (!dropEle) {
            dropUl = dropLi ? this.expandParent(dropLi) : select('.' + PARENTITEM, this.element);
        }
        else {
            dropUl = dropEle;
        }
        let refNode = dropUl.childNodes[index];
        for (let i = 0; i < li.length; i++) {
            dropUl.insertBefore(li[i], refNode);
        }
        if (this.nodeTemplate && this.isBlazorPlatform && !this.isStringTemplate) {
            this.updateBlazorTemplate();
        }
        let id = this.getId(dropLi);
        if (this.dataType === 1) {
            this.updateField(this.treeData, this.fields, id, 'hasChildren', true);
            let refId = this.getId(refNode);
            let pos = isNullOrUndefined(refId) ? this.treeData.length : this.getDataPos(this.treeData, this.fields, refId);
            for (let j = 0; j < nodes.length; j++) {
                if (!isNullOrUndefined(id)) {
                    let currId = this.isNumberTypeId ? parseFloat(id) : id;
                    setValue(this.fields.parentID, currId, nodes[j]);
                }
                this.treeData.splice(pos, 0, nodes[j]);
                pos++;
            }
        }
        else {
            this.addChildData(this.treeData, this.fields, id, nodes, index);
        }
        this.finalizeNode(dropUl);
    }
    updateMapper(level) {
        let mapper = (level === 1) ? this.fields : this.getChildFields(this.fields, level - 1, 1);
        this.updateListProp(mapper);
    }
    updateListProp(mapper) {
        let prop = this.getActualProperties(mapper);
        this.listBaseOption.fields = prop;
        this.listBaseOption.fields.url = prop.hasOwnProperty('navigateUrl') ? prop.navigateUrl : 'navigateUrl';
    }
    getDataPos(obj, mapper, id) {
        let pos = null;
        for (let i = 0, objlen = obj.length; i < objlen; i++) {
            let nodeId = getValue(mapper.id, obj[i]);
            if (obj[i] && nodeId && nodeId.toString() === id) {
                return i;
            }
            else if (typeof mapper.child === 'string' && !isNullOrUndefined(getValue(mapper.child, obj[i]))) {
                let data = getValue(mapper.child, obj[i]);
                pos = this.getDataPos(data, this.getChildMapper(mapper), id);
                if (pos !== null) {
                    break;
                }
            }
            else if (this.fields.dataSource instanceof DataManager && !isNullOrUndefined(getValue('child', obj[i]))) {
                let items = getValue('child', obj[i]);
                pos = this.getDataPos(items, this.getChildMapper(mapper), id);
                if (pos !== null) {
                    break;
                }
            }
        }
        return pos;
    }
    addChildData(obj, mapper, id, data, index) {
        let updated;
        if (isNullOrUndefined(id)) {
            index = isNullOrUndefined(index) ? obj.length : index;
            for (let k = 0, len = data.length; k < len; k++) {
                obj.splice(index, 0, data[k]);
                index++;
            }
            return updated;
        }
        for (let i = 0, objlen = obj.length; i < objlen; i++) {
            let nodeId = getValue(mapper.id, obj[i]);
            if (obj[i] && nodeId && nodeId.toString() === id) {
                if ((typeof mapper.child === 'string' && (obj[i].hasOwnProperty(mapper.child) && obj[i][mapper.child] !== null)) ||
                    ((this.fields.dataSource instanceof DataManager && (this.fields.dataSource.adaptorName !== 'BlazorAdaptor')) && obj[i].hasOwnProperty('child'))) {
                    let key = (typeof mapper.child === 'string') ? mapper.child : 'child';
                    let childData = getValue(key, obj[i]);
                    if (isNullOrUndefined(childData)) {
                        childData = [];
                    }
                    index = isNullOrUndefined(index) ? childData.length : index;
                    for (let k = 0, len = data.length; k < len; k++) {
                        childData.splice(index, 0, data[k]);
                        index++;
                    }
                }
                else {
                    let key = (typeof mapper.child === 'string') ? mapper.child : 'child';
                    obj[i][key] = data;
                }
                return true;
            }
            else if (typeof mapper.child === 'string' && !isNullOrUndefined(getValue(mapper.child, obj[i]))) {
                let childObj = getValue(mapper.child, obj[i]);
                updated = this.addChildData(childObj, this.getChildMapper(mapper), id, data, index);
                if (updated !== undefined) {
                    break;
                }
            }
            else if ((this.fields.dataSource instanceof DataManager && (this.fields.dataSource.adaptorName !== 'BlazorAdaptor')) && !isNullOrUndefined(getValue('child', obj[i]))) {
                let childData = getValue('child', obj[i]);
                updated = this.addChildData(childData, this.getChildMapper(mapper), id, data, index);
                if (updated !== undefined) {
                    break;
                }
            }
        }
        return updated;
    }
    doDisableAction(nodes) {
        let validNodes = this.nodeType(nodes);
        let validID = this.checkValidId(validNodes);
        this.validArr = [];
        for (let i = 0, len = validID.length; i < len; i++) {
            let id = validID[i][this.fields.id].toString();
            if (id && this.disableNode.indexOf(id) === -1) {
                this.disableNode.push(id);
            }
            let liEle = this.getElement(id);
            if (liEle) {
                liEle.setAttribute('aria-disabled', 'true');
                addClass([liEle], DISABLE);
            }
        }
    }
    doEnableAction(nodes) {
        let strNodes = this.nodeType(nodes);
        for (let i = 0, len = strNodes.length; i < len; i++) {
            let liEle = this.getElement(strNodes[i]);
            let id = strNodes[i];
            if (id && this.disableNode.indexOf(id) !== -1) {
                this.disableNode.splice(this.disableNode.indexOf(id), 1);
            }
            if (liEle) {
                liEle.removeAttribute('aria-disabled');
                removeClass([liEle], DISABLE);
            }
        }
    }
    nodeType(nodes) {
        let validID = [];
        for (let i = 0, len = nodes.length; i < len; i++) {
            let id;
            if (typeof nodes[i] == "string") {
                id = (nodes[i]) ? nodes[i].toString() : null;
            }
            else if (typeof nodes[i] === "object") {
                id = nodes[i] ? nodes[i].getAttribute("data-uid").toString() : null;
            }
            if (validID.indexOf(id) == -1) {
                validID.push(id);
            }
        }
        return validID;
    }
    checkValidId(node) {
        if (this.dataType === 1) {
            this.validArr = this.treeData.filter((data) => {
                return node.indexOf(data[this.fields.id] ? data[this.fields.id].toString() : null) !== -1;
            });
        }
        else if (this.dataType === 2) {
            for (let k = 0; k < this.treeData.length; k++) {
                let id = this.treeData[k][this.fields.id] ? this.treeData[k][this.fields.id].toString() : null;
                if (node.indexOf(id) !== -1) {
                    this.validArr.push(this.treeData[k]);
                }
                let childItems = getValue(this.fields.child.toString(), this.treeData[k]);
                if (childItems) {
                    this.filterNestedChild(childItems, node);
                }
            }
        }
        return this.validArr;
    }
    filterNestedChild(treeData, nodes) {
        for (let k = 0; k < treeData.length; k++) {
            let id = treeData[k][this.fields.id] ? treeData[k][this.fields.id].toString() : null;
            if (nodes.indexOf(id) !== -1) {
                this.validArr.push(treeData[k]);
            }
            let childItems = getValue(this.fields.child.toString(), treeData[k]);
            if (childItems) {
                this.filterNestedChild(childItems, nodes);
            }
        }
    }
    setTouchClass() {
        let ele = closest(this.element, '.' + BIGGER);
        this.touchClass = isNullOrUndefined(ele) ? '' : SMALL;
    }
    updatePersistProp() {
        this.removeField(this.treeData, this.fields, ['selected', 'expanded']);
        let sleNodes = this.selectedNodes;
        for (let l = 0, slelen = sleNodes.length; l < slelen; l++) {
            this.updateField(this.treeData, this.fields, sleNodes[l], 'selected', true);
        }
        let enodes = this.expandedNodes;
        if (this.isBlazorPlatform) {
            enodes = this.isBlazorExpandedNodes;
        }
        for (let k = 0, nodelen = enodes.length; k < nodelen; k++) {
            this.updateField(this.treeData, this.fields, enodes[k], 'expanded', true);
        }
        if (this.showCheckBox) {
            this.removeField(this.treeData, this.fields, ['isChecked']);
            let cnodes = this.checkedNodes;
            for (let m = 0, nodelen = cnodes.length; m < nodelen; m++) {
                this.updateField(this.treeData, this.fields, cnodes[m], 'isChecked', true);
            }
        }
    }
    removeField(obj, mapper, names) {
        if (isNullOrUndefined(obj) || isNullOrUndefined(mapper)) {
            return;
        }
        for (let i = 0, objlen = obj.length; i < objlen; i++) {
            for (let j = 0; j < names.length; j++) {
                let field = this.getMapperProp(mapper, names[j]);
                if (!isNullOrUndefined(obj[i][field])) {
                    delete obj[i][field];
                }
            }
            if (typeof mapper.child === 'string' && !isNullOrUndefined(getValue(mapper.child, obj[i]))) {
                this.removeField(getValue(mapper.child, obj[i]), this.getChildMapper(mapper), names);
            }
            else if (this.fields.dataSource instanceof DataManager && !isNullOrUndefined(getValue('child', obj[i]))) {
                this.removeField(getValue('child', obj[i]), this.getChildMapper(mapper), names);
            }
        }
    }
    getMapperProp(mapper, fieldName) {
        switch (fieldName) {
            case 'selected':
                return !isNullOrUndefined(mapper.selected) ? mapper.selected : 'selected';
            case 'expanded':
                return !isNullOrUndefined(mapper.expanded) ? mapper.expanded : 'expanded';
            case 'isChecked':
                return !isNullOrUndefined(mapper.isChecked) ? mapper.isChecked : 'isChecked';
            case 'hasChildren':
                return !isNullOrUndefined(mapper.hasChildren) ? mapper.hasChildren : 'hasChildren';
            default:
                return fieldName;
        }
    }
    updateField(obj, mapper, id, key, value) {
        if (isNullOrUndefined(id)) {
            return;
        }
        else if (this.dataType === 1) {
            let newId = this.isNumberTypeId ? parseFloat(id) : id;
            let resultData = new DataManager(this.treeData).executeLocal(new Query().where(mapper.id, 'equal', newId, false));
            setValue(this.getMapperProp(mapper, key), value, resultData[0]);
        }
        else {
            this.updateChildField(obj, mapper, id, key, value);
        }
    }
    updateChildField(obj, mapper, id, key, value, remove$$1) {
        let removedData;
        if (isNullOrUndefined(obj)) {
            return removedData;
        }
        for (let i = 0, objlen = obj.length; i < objlen; i++) {
            let nodeId = getValue(mapper.id, obj[i]);
            if (obj[i] && nodeId && nodeId.toString() === id) {
                if (remove$$1) {
                    removedData = obj.splice(i, 1);
                }
                else {
                    setValue(this.getMapperProp(mapper, key), value, obj[i]);
                    removedData = [];
                }
                return removedData;
            }
            else if (typeof mapper.child === 'string' && !isNullOrUndefined(getValue(mapper.child, obj[i]))) {
                let childData = getValue(mapper.child, obj[i]);
                removedData = this.updateChildField(childData, this.getChildMapper(mapper), id, key, value, remove$$1);
                if (removedData !== undefined) {
                    break;
                }
            }
            else if (this.fields.dataSource instanceof DataManager && !isNullOrUndefined(getValue('child', obj[i]))) {
                let childItems = getValue('child', obj[i]);
                removedData = this.updateChildField(childItems, this.getChildMapper(mapper), id, key, value, remove$$1);
                if (removedData !== undefined) {
                    break;
                }
            }
        }
        return removedData;
    }
    triggerEvent() {
        this.updateTemplateForBlazor();
        this.renderReactTemplates();
        let eventArgs = { data: this.treeData };
        this.trigger('dataSourceChanged', eventArgs);
    }
    updateBlazorTemplate() {
        updateBlazorTemplate(this.element.id + 'nodeTemplate', 'NodeTemplate', this, false);
    }
    clientUpdateInitial() {
        this.blazorInitialRender = true;
    }
    wireInputEvents(inpEle) {
        EventHandler.add(inpEle, 'blur', this.inputFocusOut, this);
    }
    wireEditingEvents(toBind) {
        if (toBind && !this.disabled) {
            let proxy = this;
            this.touchEditObj = new Touch(this.element, {
                tap: (e) => {
                    if (this.isDoubleTapped(e) && e.tapCount === 2) {
                        e.originalEvent.preventDefault();
                        proxy.editingHandler(e.originalEvent);
                    }
                }
            });
        }
        else {
            if (this.touchEditObj) {
                this.touchEditObj.destroy();
            }
        }
    }
    wireClickEvent(toBind) {
        if (toBind) {
            let proxy = this;
            this.touchClickObj = new Touch(this.element, {
                tap: (e) => {
                    proxy.clickHandler(e);
                }
            });
        }
        else {
            if (this.touchClickObj) {
                this.touchClickObj.destroy();
            }
        }
    }
    wireExpandOnEvent(toBind) {
        if (toBind) {
            let proxy = this;
            this.touchExpandObj = new Touch(this.element, {
                tap: (e) => {
                    if ((this.expandOnType === 'Click' || (this.expandOnType === 'DblClick' && this.isDoubleTapped(e) && e.tapCount === 2))
                        && e.originalEvent.which !== 3) {
                        proxy.expandHandler(e);
                    }
                }
            });
        }
        else {
            if (this.touchExpandObj) {
                this.touchExpandObj.destroy();
            }
        }
    }
    mouseDownHandler(e) {
        this.mouseDownStatus = true;
        if (e.shiftKey || e.ctrlKey) {
            e.preventDefault();
        }
        if (e.ctrlKey && this.allowMultiSelection) {
            EventHandler.add(this.element, 'contextmenu', this.preventContextMenu, this);
        }
    }
    ;
    preventContextMenu(e) {
        e.preventDefault();
    }
    wireEvents() {
        EventHandler.add(this.element, 'mousedown', this.mouseDownHandler, this);
        this.wireClickEvent(true);
        if (this.expandOnType !== 'None') {
            this.wireExpandOnEvent(true);
        }
        EventHandler.add(this.element, 'focus', this.focusIn, this);
        EventHandler.add(this.element, 'blur', this.focusOut, this);
        EventHandler.add(this.element, 'mouseover', this.onMouseOver, this);
        EventHandler.add(this.element, 'mouseout', this.onMouseLeave, this);
        this.keyboardModule = new KeyboardEvents(this.element, {
            keyAction: this.keyActionHandler.bind(this),
            keyConfigs: this.keyConfigs,
            eventName: 'keydown',
        });
    }
    unWireEvents() {
        EventHandler.remove(this.element, 'mousedown', this.mouseDownHandler);
        this.wireClickEvent(false);
        this.wireExpandOnEvent(false);
        EventHandler.remove(this.element, 'focus', this.focusIn);
        EventHandler.remove(this.element, 'blur', this.focusOut);
        EventHandler.remove(this.element, 'mouseover', this.onMouseOver);
        EventHandler.remove(this.element, 'mouseout', this.onMouseLeave);
        if (!this.disabled) {
            this.keyboardModule.destroy();
        }
    }
    parents(element, selector) {
        let matched = [];
        let el = element.parentNode;
        while (!isNullOrUndefined(el)) {
            if (matches(el, selector)) {
                matched.push(el);
            }
            el = el.parentNode;
        }
        return matched;
    }
    isDoubleTapped(e) {
        let target = e.originalEvent.target;
        let secondTap;
        if (target && e.tapCount) {
            if (e.tapCount === 1) {
                this.firstTap = closest(target, '.' + LISTITEM);
            }
            else if (e.tapCount === 2) {
                secondTap = closest(target, '.' + LISTITEM);
            }
        }
        return (this.firstTap === secondTap);
    }
    isDescendant(parent, child) {
        let node = child.parentNode;
        while (!isNullOrUndefined(node)) {
            if (node === parent) {
                return true;
            }
            node = node.parentNode;
        }
        return false;
    }
    showSpinner(element) {
        addClass([element], LOAD);
        createSpinner({
            target: element,
            width: Browser.isDevice ? 16 : 14
        }, this.createElement);
        showSpinner(element);
    }
    hideSpinner(element) {
        hideSpinner(element);
        element.innerHTML = '';
        removeClass([element], LOAD);
    }
    setCheckedNodes(nodes) {
        nodes = JSON.parse(JSON.stringify(nodes));
        this.uncheckAll(this.checkedNodes);
        this.setIndeterminate(nodes);
        if (nodes.length > 0) {
            this.checkAll(nodes);
        }
    }
    /**
     * Checks whether the checkedNodes entered are valid and sets the valid checkedNodes while changing via setmodel
     */
    setValidCheckedNode(node) {
        if (this.dataType === 1) {
            let mapper = this.fields;
            let resultData = new DataManager(this.treeData).executeLocal(new Query().where(mapper.id, 'equal', node, true));
            if (resultData[0]) {
                this.setChildCheckState(resultData, node, resultData[0]);
                if (this.autoCheck) {
                    let parent = resultData[0][this.fields.parentID] ? resultData[0][this.fields.parentID].toString() : null;
                    let childNodes = this.getChildNodes(this.treeData, parent);
                    let count = 0;
                    for (let len = 0; len < childNodes.length; len++) {
                        let childId = childNodes[len][this.fields.id].toString();
                        if (this.checkedNodes.indexOf(childId) !== -1) {
                            count++;
                        }
                    }
                    if (count === childNodes.length && this.checkedNodes.indexOf(parent) === -1 && parent) {
                        this.checkedNodes.push(parent);
                    }
                }
            }
        }
        else if (this.dataType === 2) {
            for (let a = 0; a < this.treeData.length; a++) {
                let index = this.treeData[a][this.fields.id] ? this.treeData[a][this.fields.id].toString() : '';
                if (index === node && this.checkedNodes.indexOf(node) === -1) {
                    this.checkedNodes.push(node);
                    break;
                }
                let childItems = getValue(this.fields.child.toString(), this.treeData[a]);
                if (childItems) {
                    this.setChildCheckState(childItems, node, this.treeData[a]);
                }
            }
        }
    }
    /**
     * Checks whether the checkedNodes entered are valid and sets the valid checkedNodes while changing via setmodel(for hierarchical DS)
     */
    setChildCheckState(childItems, node, treeData) {
        let checkedParent;
        let count = 0;
        if (this.dataType === 1) {
            if (treeData) {
                checkedParent = treeData[this.fields.id] ? treeData[this.fields.id].toString() : null;
            }
            for (let index = 0; index < childItems.length; index++) {
                let checkNode = childItems[index][this.fields.id] ? childItems[index][this.fields.id].toString() : null;
                if (treeData && checkedParent && this.autoCheck) {
                    if (this.checkedNodes.indexOf(checkedParent) !== -1 && this.checkedNodes.indexOf(checkNode) === -1) {
                        this.checkedNodes.push(checkNode);
                    }
                }
                if (checkNode === node && this.checkedNodes.indexOf(node) === -1) {
                    this.checkedNodes.push(node);
                }
                let subChildItems = this.getChildNodes(this.treeData, checkNode);
                if (subChildItems) {
                    this.setChildCheckState(subChildItems, node, treeData);
                }
            }
        }
        else {
            if (treeData) {
                checkedParent = treeData[this.fields.id] ? treeData[this.fields.id].toString() : '';
            }
            for (let index = 0; index < childItems.length; index++) {
                let checkedChild = childItems[index][this.fields.id] ? childItems[index][this.fields.id].toString() : '';
                if (treeData && checkedParent && this.autoCheck) {
                    if (this.checkedNodes.indexOf(checkedParent) !== -1 && this.checkedNodes.indexOf(checkedChild) === -1) {
                        this.checkedNodes.push(checkedChild);
                    }
                }
                if (checkedChild === node && this.checkedNodes.indexOf(node) === -1) {
                    this.checkedNodes.push(node);
                }
                let subChildItems = getValue(this.fields.child.toString(), childItems[index]);
                if (subChildItems) {
                    this.setChildCheckState(subChildItems, node, childItems[index]);
                }
                if (this.checkedNodes.indexOf(checkedChild) !== -1 && this.autoCheck) {
                    count++;
                }
                if (count === childItems.length && this.checkedNodes.indexOf(checkedParent) === -1 && this.autoCheck) {
                    this.checkedNodes.push(checkedParent);
                }
            }
        }
    }
    setIndeterminate(nodes) {
        for (let i = 0; i < nodes.length; i++) {
            this.setValidCheckedNode(nodes[i]);
        }
    }
    updatePosition(id, newData, isRefreshChild, childValue) {
        if (this.dataType === 1) {
            let pos = this.getDataPos(this.treeData, this.fields, id);
            this.treeData.splice(pos, 1, newData);
            if (isRefreshChild) {
                this.removeChildNodes(id);
                for (let j = 0; j < childValue.length; j++) {
                    this.treeData.splice(pos, 0, childValue[j]);
                    pos++;
                }
            }
            this.groupedData = this.getGroupedData(this.treeData, this.fields.parentID);
        }
        else {
            this.updateChildPosition(this.treeData, this.fields, id, [newData], undefined);
        }
    }
    updateChildPosition(treeData, mapper, currID, newData, index) {
        let found;
        for (let i = 0, objlen = treeData.length; i < objlen; i++) {
            let nodeId = getValue(mapper.id, treeData[i]);
            if (treeData[i] && nodeId && nodeId.toString() === currID) {
                treeData[i] = newData[0];
                return true;
            }
            else if (typeof mapper.child === 'string' && !isNullOrUndefined(getValue(mapper.child, treeData[i]))) {
                let childObj = getValue(mapper.child, treeData[i]);
                found = this.updateChildPosition(childObj, this.getChildMapper(mapper), currID, newData, index);
                if (found !== undefined) {
                    break;
                }
            }
            else if (this.fields.dataSource instanceof DataManager && !isNullOrUndefined(getValue('child', treeData[i]))) {
                let childData = getValue('child', treeData[i]);
                found = this.updateChildPosition(childData, this.getChildMapper(mapper), currID, newData, index);
                if (found !== undefined) {
                    break;
                }
            }
        }
        return found;
    }
    dynamicState() {
        this.setDragAndDrop(this.allowDragAndDrop);
        this.wireEditingEvents(this.allowEditing);
        if (!this.disabled) {
            this.wireEvents();
            this.setRipple();
        }
        else {
            this.unWireEvents();
            this.rippleFn();
            this.rippleIconFn();
        }
    }
    crudOperation(operation, nodes, target, newText, newNode, index, prevent) {
        let data = this.fields.dataSource;
        let matchedArr = [];
        let query = this.getQuery(this.fields);
        let key = this.fields.id;
        let crud;
        let changes = {
            addedRecords: [],
            deletedRecords: [],
            changedRecords: []
        };
        let nodesID = [];
        if (nodes) {
            nodesID = this.nodeType(nodes);
        }
        else if (target) {
            if (typeof target == "string") {
                nodesID[0] = target.toString();
            }
            else if (typeof target === "object") {
                nodesID[0] = target.getAttribute("data-uid").toString();
            }
        }
        for (let i = 0, len = nodesID.length; i < len; i++) {
            let liEle = this.getElement(nodesID[i]);
            if (isNullOrUndefined(liEle)) {
                continue;
            }
            let removedData = this.getNodeObject(nodesID[i]);
            matchedArr.push(removedData);
        }
        switch (operation) {
            case 'delete':
                if (nodes.length == 1) {
                    crud = data.remove(key, matchedArr[0], query.fromTable, query);
                }
                else {
                    changes.deletedRecords = matchedArr;
                    crud = data.saveChanges(changes, key, query.fromTable, query);
                }
                crud.then((e) => this.deleteSuccess(nodesID))
                    .catch((e) => this.dmFailure(e));
                break;
            case 'update':
                matchedArr[0][this.fields.text] = newText;
                crud = data.update(key, matchedArr[0], query.fromTable, query);
                crud.then((e) => this.editSucess(target, newText, prevent))
                    .catch((e) => this.dmFailure(e, target, prevent));
                break;
            case 'insert':
                if (newNode.length == 1) {
                    crud = data.insert(newNode[0], query.fromTable, query);
                }
                else {
                    let arr = [];
                    for (let i = 0, len = newNode.length; i < len; i++) {
                        arr.push(newNode[i]);
                    }
                    changes.addedRecords = arr;
                    crud = data.saveChanges(changes, key, query.fromTable, query);
                }
                crud.then((e) => {
                    let dropLi = this.getElement(target);
                    this.addSuccess(newNode, dropLi, index);
                    this.preventExpand = false;
                }).catch((e) => this.dmFailure(e));
                break;
        }
    }
    deleteSuccess(nodes) {
        for (let i = 0, len = nodes.length; i < len; i++) {
            let liEle = this.getElement(nodes[i]);
            if (isNullOrUndefined(liEle)) {
                continue;
            }
            this.removeNode(liEle);
        }
        if (this.dataType === 1) {
            this.groupedData = this.getGroupedData(this.treeData, this.fields.parentID);
        }
        this.triggerEvent();
    }
    editSucess(target, newText, prevent) {
        let liEle = this.getElement(target);
        let txtEle = select('.' + LISTTEXT, liEle);
        this.appendNewText(liEle, txtEle, newText, prevent);
    }
    addSuccess(nodes, dropLi, index) {
        let dropUl;
        let icon = dropLi ? dropLi.querySelector('.' + ICON) : null;
        let proxy = this;
        if (dropLi && icon && icon.classList.contains(EXPANDABLE) &&
            dropLi.querySelector('.' + PARENTITEM) === null) {
            proxy.renderChildNodes(dropLi, null, () => {
                dropUl = dropLi.querySelector('.' + PARENTITEM);
                proxy.addGivenNodes(nodes, dropLi, index, true, dropUl);
                proxy.triggerEvent();
            });
        }
        else {
            this.addGivenNodes(nodes, dropLi, index, true);
            this.triggerEvent();
        }
    }
    dmFailure(e, target, prevent) {
        if (target) {
            this.updatePreviousText(target, prevent);
        }
        this.trigger('actionFailure', { error: e });
    }
    updatePreviousText(target, prevent) {
        let liEle = this.getElement(target);
        let txtEle = select('.' + LISTTEXT, liEle);
        this.updateText(liEle, txtEle, this.oldText, prevent);
    }
    /**
     * Called internally if any of the property value changed.
     * @param  {TreeView} newProp
     * @param  {TreeView} oldProp
     * @returns void
     * @private
     */
    onPropertyChanged(newProp, oldProp) {
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'allowDragAndDrop':
                    this.setDragAndDrop(this.allowDragAndDrop);
                    break;
                case 'dragArea':
                    if (this.allowDragAndDrop) {
                        this.dragObj.dragArea = this.dragArea;
                    }
                    break;
                case 'allowEditing':
                    this.wireEditingEvents(this.allowEditing);
                    break;
                case 'allowMultiSelection':
                    if (this.selectedNodes.length > 1) {
                        let sNode = this.getElement(this.selectedNodes[0]);
                        this.isLoaded = false;
                        this.removeSelectAll();
                        this.selectNode(sNode, null);
                        this.isLoaded = true;
                    }
                    this.setMultiSelect(this.allowMultiSelection);
                    this.addMultiSelect(this.allowMultiSelection);
                    break;
                case 'checkedNodes':
                    if (this.showCheckBox) {
                        this.checkedNodes = oldProp.checkedNodes;
                        this.setCheckedNodes(newProp.checkedNodes);
                    }
                    break;
                case 'autoCheck':
                    if (this.showCheckBox) {
                        this.autoCheck = newProp.autoCheck;
                        this.ensureIndeterminate();
                    }
                    break;
                case 'cssClass':
                    this.setCssClass(oldProp.cssClass, newProp.cssClass);
                    break;
                case 'enableRtl':
                    this.setEnableRtl();
                    break;
                case 'expandedNodes':
                    this.isAnimate = false;
                    if (!this.isBlazorPlatform) {
                        this.setProperties({ expandedNodes: [] }, true);
                    }
                    this.collapseAll();
                    this.isInitalExpand = true;
                    if (!this.isBlazorPlatform) {
                        this.setProperties({ expandedNodes: isNullOrUndefined(newProp.expandedNodes) ? [] : newProp.expandedNodes }, true);
                    }
                    this.doExpandAction();
                    this.isInitalExpand = false;
                    this.isAnimate = true;
                    break;
                case 'expandOn':
                    this.wireExpandOnEvent(false);
                    this.setExpandOnType();
                    if (this.expandOnType !== 'None' && !this.disabled) {
                        this.wireExpandOnEvent(true);
                    }
                    break;
                case 'disabled':
                    this.setDisabledMode();
                    this.dynamicState();
                    break;
                case 'fields':
                    this.isAnimate = false;
                    this.isFieldChange = true;
                    this.initialRender = true;
                    if (!this.blazorInitialRender) {
                        this.reRenderNodes();
                    }
                    this.blazorInitialRender = false;
                    this.initialRender = false;
                    this.isAnimate = true;
                    this.isFieldChange = false;
                    break;
                case 'fullRowSelect':
                    this.setFullRow(this.fullRowSelect);
                    this.addFullRow(this.fullRowSelect);
                    break;
                case 'loadOnDemand':
                    if (this.loadOnDemand === false && !this.onLoaded) {
                        let nodes = this.element.querySelectorAll('li');
                        let i = 0;
                        while (i < nodes.length) {
                            if (nodes[i].getAttribute('aria-expanded') !== 'true') {
                                this.renderChildNodes(nodes[i], true, null, true);
                            }
                            i++;
                        }
                        this.onLoaded = true;
                    }
                    break;
                case 'nodeTemplate':
                    this.hasTemplate = false;
                    this.nodeTemplateFn = this.templateComplier(this.nodeTemplate);
                    this.reRenderNodes();
                    break;
                case 'selectedNodes':
                    this.removeSelectAll();
                    this.setProperties({ selectedNodes: newProp.selectedNodes }, true);
                    this.doSelectionAction();
                    break;
                case 'showCheckBox':
                    this.reRenderNodes();
                    break;
                case 'sortOrder':
                    this.reRenderNodes();
                    break;
                case 'fullRowNavigable':
                    this.setProperties({ fullRowNavigable: newProp.fullRowNavigable }, true);
                    this.listBaseOption.itemNavigable = newProp.fullRowNavigable;
                    this.reRenderNodes();
                    break;
            }
        }
    }
    /**
     * Removes the component from the DOM and detaches all its related event handlers. It also removes the attributes and classes.
     */
    destroy() {
        resetBlazorTemplate(this.element.id + 'nodeTemplate', 'NodeTemplate');
        this.clearTemplate();
        this.element.removeAttribute('aria-activedescendant');
        this.element.removeAttribute('tabindex');
        this.unWireEvents();
        this.wireEditingEvents(false);
        if (!this.disabled) {
            this.rippleFn();
            this.rippleIconFn();
        }
        this.setCssClass(this.cssClass, null);
        this.setDragAndDrop(false);
        this.setFullRow(false);
        if (this.isBlazorPlatform) {
            this.ulElement = this.element.querySelector('.e-list-parent.e-ul');
        }
        if (this.ulElement && this.ulElement.parentElement) {
            this.ulElement.parentElement.removeChild(this.ulElement);
        }
        if (!this.isBlazorPlatform) {
            super.destroy();
        }
    }
    /**
     * Adds the collection of TreeView nodes based on target and index position. If target node is not specified,
     * then the nodes are added as children of the given parentID or in the root level of TreeView.
     * @param  { { [key: string]: Object }[] } nodes - Specifies the array of JSON data that has to be added.
     * @param  { string | Element } target - Specifies ID of TreeView node/TreeView node as target element.
     * @param  { number } index - Specifies the index to place the newly added nodes in the target element.
     * @param { boolean } preventTargetExpand - If set to true, the target parent node will be prevented from auto expanding.
     */
    addNodes(nodes, target, index, preventTargetExpand) {
        if (isNullOrUndefined(nodes)) {
            return;
        }
        nodes = JSON.parse(JSON.stringify(nodes));
        let dropLi = this.getElement(target);
        this.preventExpand = preventTargetExpand;
        if (this.fields.dataSource instanceof DataManager && (this.fields.dataSource.adaptorName !== 'BlazorAdaptor')) {
            if (!this.isOffline) {
                this.crudOperation('insert', null, target, null, nodes, index, this.preventExpand);
            }
            else {
                this.addSuccess(nodes, dropLi, index);
            }
        }
        else if (this.dataType === 2) {
            this.addGivenNodes(nodes, dropLi, index);
        }
        else {
            if (dropLi) {
                this.addGivenNodes(nodes, dropLi, index);
            }
            else {
                nodes = this.getSortedData(nodes);
                for (let i = 0; i < nodes.length; i++) {
                    let pid = getValue(this.fields.parentID, nodes[i]);
                    dropLi = pid ? this.getElement(pid.toString()) : pid;
                    this.addGivenNodes([nodes[i]], dropLi, index);
                }
            }
            this.groupedData = this.getGroupedData(this.treeData, this.fields.parentID);
        }
        this.updateCheckedStateFromDS();
        if (this.showCheckBox && dropLi) {
            this.ensureParentCheckState(dropLi);
        }
        if ((this.fields.dataSource instanceof DataManager === false) || (this.fields.dataSource instanceof DataManager) && (this.fields.dataSource.adaptorName === 'BlazorAdaptor')) {
            this.preventExpand = false;
            this.triggerEvent();
        }
    }
    /**
     * Instead of clicking on the TreeView node for editing, we can enable it by using
     * `beginEdit` property. On passing the node ID or element through this property, the edit textBox
     * will be created for the particular node thus allowing us to edit it.
     * @param  {string | Element} node - Specifies ID of TreeView node/TreeView node.
     */
    beginEdit(node) {
        let ele = this.getElement(node);
        if (isNullOrUndefined(ele) || this.disabled) {
            return;
        }
        this.createTextbox(ele, null);
    }
    /**
     * Checks all the unchecked nodes. You can also check specific nodes by passing array of unchecked nodes
     * as argument to this method.
     * @param  {string[] | Element[]} nodes - Specifies the array of TreeView nodes ID/array of TreeView node.
     */
    checkAll(nodes) {
        if (this.showCheckBox) {
            this.doCheckBoxAction(nodes, true);
        }
    }
    /**
     * Collapses all the expanded TreeView nodes. You can collapse specific nodes by passing array of nodes as argument to this method.
     * You can also collapse all the nodes excluding the hidden nodes by setting **excludeHiddenNodes** to true. If you want to collapse
     * a specific level of nodes, set **level** as argument to collapseAll method.
     * @param  {string[] | Element[]} nodes - Specifies the array of TreeView nodes ID/ array of TreeView node.
     * @param  {number} level - TreeView nodes will collapse up to the given level.
     * @param  {boolean} excludeHiddenNodes - Whether or not to exclude hidden nodes of TreeView when collapsing all nodes.
     */
    collapseAll(nodes, level, excludeHiddenNodes) {
        if (!isNullOrUndefined(nodes)) {
            this.doGivenAction(nodes, COLLAPSIBLE, false);
        }
        else {
            if (level > 0) {
                this.collapseByLevel(select('.' + PARENTITEM, this.element), level, excludeHiddenNodes);
            }
            else {
                this.collapseAllNodes(excludeHiddenNodes);
            }
        }
    }
    /**
     * Disables the collection of nodes by passing the ID of nodes or node elements in the array.
     * @param  {string[] | Element[]} nodes - Specifies the array of TreeView nodes ID/array of TreeView nodes.
     */
    disableNodes(nodes) {
        if (!isNullOrUndefined(nodes)) {
            this.doDisableAction(nodes);
        }
    }
    /**
     * Enables the collection of disabled nodes by passing the ID of nodes or node elements in the array.
     * @param  {string[] | Element[]} nodes - Specifies the array of TreeView nodes ID/array of TreeView nodes.
     */
    enableNodes(nodes) {
        if (!isNullOrUndefined(nodes)) {
            this.doEnableAction(nodes);
        }
    }
    /**
     * Ensures visibility of the TreeView node by using node ID or node element.
     * When many TreeView nodes are present and we need to find a particular node, `ensureVisible` property
     * helps bring the node to visibility by expanding the TreeView and scrolling to the specific node.
     * @param  {string | Element} node - Specifies ID of TreeView node/TreeView nodes.
     */
    ensureVisible(node) {
        let liEle = this.getElement(node);
        if (isNullOrUndefined(liEle)) {
            return;
        }
        let parents = this.parents(liEle, '.' + LISTITEM);
        this.expandAll(parents);
        setTimeout(() => { liEle.scrollIntoView(true); }, 450);
    }
    /**
     * Expands all the collapsed TreeView nodes. You can expand the specific nodes by passing the array of collapsed nodes
     * as argument to this method. You can also expand all the collapsed nodes by excluding the hidden nodes by setting
     * **excludeHiddenNodes** to true to this method. To expand a specific level of nodes, set **level** as argument to expandAll method.
     * @param  {string[] | Element[]} nodes - Specifies the array of TreeView nodes ID/array of TreeView nodes.
     * @param  {number} level - TreeView nodes will expand up to the given level.
     * @param  {boolean} excludeHiddenNodes - Whether or not to exclude hidden nodes when expanding all nodes.
     */
    expandAll(nodes, level, excludeHiddenNodes) {
        if (!isNullOrUndefined(nodes)) {
            this.doGivenAction(nodes, EXPANDABLE, true);
        }
        else {
            if (level > 0) {
                this.expandByLevel(select('.' + PARENTITEM, this.element), level, excludeHiddenNodes);
            }
            else {
                this.expandAllNodes(excludeHiddenNodes);
            }
        }
    }
    /**
     * Gets all the checked nodes including child, whether it is loaded or not.
     */
    getAllCheckedNodes() {
        let checkNodes = this.checkedNodes;
        return checkNodes;
    }
    /**
    * Gets all the disabled nodes including child, whether it is loaded or not.
    */
    getDisabledNodes() {
        let disabledNodes = this.disableNode;
        return disabledNodes;
    }
    /**
     * Get the node's data such as id, text, parentID, selected, isChecked, and expanded by passing the node element or it's ID.
     * @param  {string | Element} node - Specifies ID of TreeView node/TreeView node.
     * @BlazorType NodeData
     */
    getNode(node) {
        let ele = this.getElement(node);
        return this.getNodeData(ele, true);
    }
    /**
     * To get the updated data source of TreeView after performing some operation like drag and drop, node editing,
     * node selecting/unSelecting, node expanding/collapsing, node checking/unChecking, adding and removing node.
     * * If you pass the ID of TreeView node as arguments for this method then it will return the updated data source
     * of the corresponding node otherwise it will return the entire updated data source of TreeView.
     * * The updated data source also contains custom attributes if you specified in data source.
     * @param  {string | Element} node - Specifies ID of TreeView node/TreeView node.
     * @isGenericType true
     */
    getTreeData(node) {
        let id = this.getId(node);
        this.updatePersistProp();
        if (isNullOrUndefined(id)) {
            return this.treeData;
        }
        else {
            let data = this.getNodeObject(id);
            return isNullOrUndefined(data) ? [] : [data];
        }
    }
    /**
     * Moves the collection of nodes within the same TreeView based on target or its index position.
     * @param  {string[] | Element[]} sourceNodes - Specifies the array of TreeView nodes ID/array of TreeView node.
     * @param  {string | Element} target - Specifies ID of TreeView node/TreeView node as target element.
     * @param  {number} index - Specifies the index to place the moved nodes in the target element.
     * @param { boolean } preventTargetExpand - If set to true, the target parent node will be prevented from auto expanding.
     */
    moveNodes(sourceNodes, target, index, preventTargetExpand) {
        let dropLi = this.getElement(target);
        if (isNullOrUndefined(dropLi)) {
            return;
        }
        for (let i = 0; i < sourceNodes.length; i++) {
            let dragLi = this.getElement(sourceNodes[i]);
            if (isNullOrUndefined(dragLi) || dropLi.isSameNode(dragLi) || this.isDescendant(dragLi, dropLi)) {
                continue;
            }
            this.preventExpand = preventTargetExpand;
            this.dropAsChildNode(dragLi, dropLi, this, index);
        }
        if (this.fields.dataSource instanceof DataManager === false) {
            this.preventExpand = false;
        }
        this.triggerEvent();
    }
    /**
     * Refreshes a particular node of the TreeView.
     * @param  {string | Element} target - Specifies the ID of TreeView node or TreeView node as target element.
     * @param  {{ [key: string]: Object }[]} newData - Specifies the new data of TreeView node.
     */
    refreshNode(target, newData) {
        if (isNullOrUndefined(target) || isNullOrUndefined(newData)) {
            return;
        }
        let id;
        let isRefreshChild = false;
        if (this.dataType == 1 && newData.length > 1) {
            isRefreshChild = true;
        }
        else if (this.dataType == 2 && newData.length === 1) {
            let updatedChildValue = getValue(this.fields.child.toString(), newData[0]);
            if (!isNullOrUndefined(updatedChildValue)) {
                isRefreshChild = true;
            }
        }
        let liEle = this.getElement(target);
        id = liEle ? liEle.getAttribute('data-uid') : ((target) ? target.toString() : null);
        this.refreshData = this.getNodeObject(id);
        newData = JSON.parse(JSON.stringify(newData));
        /* eslint-disable */
        let newNodeData;
        let parentData;
        if (this.dataType == 1 && isRefreshChild) {
            for (let k = 0; k < newData.length; k++) {
                if (isNullOrUndefined(newData[k][this.fields.parentID])) {
                    parentData = newData[k];
                    newData.splice(k, 1);
                    break;
                }
            }
            newNodeData = extend({}, this.refreshData, parentData);
        }
        else {
            newNodeData = extend({}, this.refreshData, newData[0]);
        }
        if (isNullOrUndefined(liEle)) {
            this.updatePosition(id, newNodeData, isRefreshChild, newData);
            return;
        }
        this.isRefreshed = true;
        let level = parseFloat(liEle.getAttribute('aria-level'));
        let newliEle = ListBase.createListItemFromJson(this.createElement, [newNodeData], this.listBaseOption, level);
        let ul = select('.' + PARENTITEM, liEle);
        let childItems = getValue(this.fields.child.toString(), newNodeData);
        if ((isRefreshChild && ul) || (isRefreshChild && !isNullOrUndefined(childItems))) {
            let parentEle = liEle.parentElement;
            let index = Array.prototype.indexOf.call(parentEle.childNodes, liEle);
            remove(liEle);
            parentEle.insertBefore(newliEle[0], parentEle.childNodes[index]);
            this.updatePosition(id, newNodeData, isRefreshChild, newData);
            if (isRefreshChild && ul) {
                this.expandAll([id]);
            }
        }
        else {
            let txtEle = select('.' + TEXTWRAP, liEle);
            let newTextEle = select('.' + TEXTWRAP, newliEle[0]);
            let icon = select('div.' + ICON, txtEle);
            let newIcon = select('div.' + ICON, newTextEle);
            if (icon && newIcon) {
                if (newIcon.classList.contains(EXPANDABLE) && icon.classList.contains(COLLAPSIBLE)) {
                    removeClass([newIcon], EXPANDABLE);
                    addClass([newIcon], COLLAPSIBLE);
                }
                else if (newIcon.classList.contains(COLLAPSIBLE) && icon.classList.contains(EXPANDABLE)) {
                    removeClass([newIcon], COLLAPSIBLE);
                    addClass([newIcon], EXPANDABLE);
                }
                else if (icon.classList.contains('interaction')) {
                    addClass([newIcon], 'interaction');
                }
            }
            remove(txtEle);
            let fullEle = select('.' + FULLROW, liEle);
            fullEle.parentNode.insertBefore(newTextEle, fullEle.nextSibling);
            this.updatePosition(id, newNodeData, isRefreshChild, newData);
        }
        liEle = this.getElement(target);
        if (newNodeData[this.fields.tooltip]) {
            liEle.setAttribute("title", newNodeData[this.fields.tooltip]);
        }
        if (newNodeData.hasOwnProperty(this.fields.htmlAttributes) && newNodeData[this.fields.htmlAttributes]) {
            let attr = {};
            merge(attr, newNodeData[this.fields.htmlAttributes]);
            if (attr.class) {
                addClass([liEle], attr.class.split(' '));
                delete attr.class;
            }
            else {
                attributes(liEle, attr);
            }
        }
        if (this.selectedNodes.indexOf(id) !== -1) {
            liEle.setAttribute('aria-selected', 'true');
            addClass([liEle], ACTIVE);
        }
        this.isRefreshed = false;
        this.triggerEvent();
    }
    /**
     * Removes the collection of TreeView nodes by passing the array of node details as argument to this method.
     * @param  {string[] | Element[]} nodes - Specifies the array of TreeView nodes ID/array of TreeView node.
     */
    removeNodes(nodes) {
        if (!isNullOrUndefined(nodes)) {
            if (this.fields.dataSource instanceof DataManager && !this.isOffline && (this.fields.dataSource.adaptorName !== 'BlazorAdaptor')) {
                this.crudOperation('delete', nodes);
            }
            else {
                this.deleteSuccess(nodes);
            }
        }
    }
    /**
     * Replaces the text of the TreeView node with the given text.
     * @param  {string | Element} target - Specifies ID of TreeView node/TreeView node as target element.
     * @param  {string} newText - Specifies the new text of TreeView node.
     */
    updateNode(target, newText) {
        if (isNullOrUndefined(target) || isNullOrUndefined(newText) || !this.allowEditing) {
            return;
        }
        let liEle = this.getElement(target);
        if (isNullOrUndefined(liEle)) {
            return;
        }
        let txtEle = select('.' + LISTTEXT, liEle);
        this.updateOldText(liEle);
        let eventArgs = this.getEditEvent(liEle, null, null);
        this.trigger('nodeEditing', eventArgs, (observedArgs) => {
            if (!observedArgs.cancel) {
                if (this.fields.dataSource instanceof DataManager && !this.isOffline && (this.fields.dataSource.adaptorName !== 'BlazorAdaptor')) {
                    this.crudOperation('update', null, target, newText, null, null, false);
                }
                else {
                    this.appendNewText(liEle, txtEle, newText, false);
                }
            }
        });
    }
    /**
     * Unchecks all the checked nodes. You can also uncheck the specific nodes by passing array of checked nodes
     * as argument to this method.
     * @param  {string[] | Element[]} nodes - Specifies the array of TreeView nodes ID/array of TreeView node.
     */
    uncheckAll(nodes) {
        if (this.showCheckBox) {
            this.doCheckBoxAction(nodes, false);
        }
    }
};
__decorate$8([
    Property(false)
], TreeView.prototype, "allowDragAndDrop", void 0);
__decorate$8([
    Property(false)
], TreeView.prototype, "allowEditing", void 0);
__decorate$8([
    Property(false)
], TreeView.prototype, "allowMultiSelection", void 0);
__decorate$8([
    Complex({}, NodeAnimationSettings)
], TreeView.prototype, "animation", void 0);
__decorate$8([
    Property()
], TreeView.prototype, "checkedNodes", void 0);
__decorate$8([
    Property('')
], TreeView.prototype, "cssClass", void 0);
__decorate$8([
    Property(false)
], TreeView.prototype, "disabled", void 0);
__decorate$8([
    Property(null)
], TreeView.prototype, "dragArea", void 0);
__decorate$8([
    Property(false)
], TreeView.prototype, "enableHtmlSanitizer", void 0);
__decorate$8([
    Property(false)
], TreeView.prototype, "enablePersistence", void 0);
__decorate$8([
    Property()
], TreeView.prototype, "expandedNodes", void 0);
__decorate$8([
    Property('Auto')
], TreeView.prototype, "expandOn", void 0);
__decorate$8([
    Complex({}, FieldsSettings)
], TreeView.prototype, "fields", void 0);
__decorate$8([
    Property(true)
], TreeView.prototype, "fullRowSelect", void 0);
__decorate$8([
    Property(true)
], TreeView.prototype, "loadOnDemand", void 0);
__decorate$8([
    Property()
], TreeView.prototype, "locale", void 0);
__decorate$8([
    Property()
], TreeView.prototype, "nodeTemplate", void 0);
__decorate$8([
    Property()
], TreeView.prototype, "selectedNodes", void 0);
__decorate$8([
    Property('None')
], TreeView.prototype, "sortOrder", void 0);
__decorate$8([
    Property(false)
], TreeView.prototype, "showCheckBox", void 0);
__decorate$8([
    Property(true)
], TreeView.prototype, "autoCheck", void 0);
__decorate$8([
    Property(false)
], TreeView.prototype, "fullRowNavigable", void 0);
__decorate$8([
    Event()
], TreeView.prototype, "actionFailure", void 0);
__decorate$8([
    Event()
], TreeView.prototype, "created", void 0);
__decorate$8([
    Event()
], TreeView.prototype, "dataBound", void 0);
__decorate$8([
    Event()
], TreeView.prototype, "dataSourceChanged", void 0);
__decorate$8([
    Event()
], TreeView.prototype, "drawNode", void 0);
__decorate$8([
    Event()
], TreeView.prototype, "destroyed", void 0);
__decorate$8([
    Event()
], TreeView.prototype, "keyPress", void 0);
__decorate$8([
    Event()
], TreeView.prototype, "nodeChecked", void 0);
__decorate$8([
    Event()
], TreeView.prototype, "nodeChecking", void 0);
__decorate$8([
    Event()
], TreeView.prototype, "nodeClicked", void 0);
__decorate$8([
    Event()
], TreeView.prototype, "nodeCollapsed", void 0);
__decorate$8([
    Event()
], TreeView.prototype, "nodeCollapsing", void 0);
__decorate$8([
    Event()
], TreeView.prototype, "nodeDragging", void 0);
__decorate$8([
    Event()
], TreeView.prototype, "nodeDragStart", void 0);
__decorate$8([
    Event()
], TreeView.prototype, "nodeDragStop", void 0);
__decorate$8([
    Event()
], TreeView.prototype, "nodeDropped", void 0);
__decorate$8([
    Event()
], TreeView.prototype, "nodeEdited", void 0);
__decorate$8([
    Event()
], TreeView.prototype, "nodeEditing", void 0);
__decorate$8([
    Event()
], TreeView.prototype, "nodeExpanded", void 0);
__decorate$8([
    Event()
], TreeView.prototype, "nodeExpanding", void 0);
__decorate$8([
    Event()
], TreeView.prototype, "nodeSelected", void 0);
__decorate$8([
    Event()
], TreeView.prototype, "nodeSelecting", void 0);
TreeView = TreeView_1 = __decorate$8([
    NotifyPropertyChanges
], TreeView);

/**
 * TreeView modules
 */

var __decorate$9 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const CONTROL$1 = 'e-control';
const ROOT$1 = 'e-sidebar';
const DOCKER = 'e-dock';
const CLOSE = 'e-close';
const OPEN = 'e-open';
const TRASITION = 'e-transition';
const DEFAULTBACKDROP = 'e-sidebar-overlay';
const CONTEXTBACKDROP = 'e-backdrop';
const RTL$2 = 'e-rtl';
const RIGHT = 'e-right';
const LEFT = 'e-left';
const OVER = 'e-over';
const PUSH = 'e-push';
const SLIDE = 'e-slide';
const VISIBILITY = 'e-visibility';
const MAINCONTENTANIMATION = 'e-content-animation';
const DISABLEANIMATION = 'e-disable-animation';
const CONTEXT = 'e-sidebar-context';
const SIDEBARABSOLUTE = 'e-sidebar-absolute';
/**
 * Sidebar is an expandable or collapsible
 * component that typically act as a side container to place the primary or secondary content alongside of the main content.
 * ```html
 * <aside id="sidebar">
 * </aside>
 * ```
 * ```typescript
 * <script>
 *   let sidebarObject: Sidebar = new Sidebar();
 *   sidebarObject.appendTo("#sidebar");
 * </script>
 * ```
 */
let Sidebar = class Sidebar extends Component {
    /* eslint-enable */
    constructor(options, element) {
        super(options, element);
        this.isBlazor = false;
    }
    preRender() {
        this.isBlazor = (isBlazor() && this.isServerRendered);
        if (!this.isBlazor) {
            this.setWidth();
        }
    }
    render() {
        this.initialize();
        this.wireEvents();
        this.renderComplete();
    }
    initialize() {
        this.setTarget();
        this.addClass();
        if (!this.isBlazor) {
            this.setZindex();
        }
        if (this.enableDock) {
            this.setDock();
        }
        if (this.isOpen) {
            this.show();
        }
        else {
            this.setMediaQuery();
        }
        this.checkType(true);
        this.setType(this.type);
        this.setCloseOnDocumentClick();
        if (!this.isBlazor) {
            this.setEnableRTL();
        }
        if (Browser.isDevice) {
            this.windowWidth = window.innerWidth;
        }
    }
    setEnableRTL() {
        (this.enableRtl ? addClass : removeClass)([this.element], RTL$2);
    }
    setTarget() {
        this.targetEle = this.element.nextElementSibling;
        this.sidebarEleCopy = this.element.cloneNode(true);
        if (typeof (this.target) === 'string') {
            this.setProperties({ target: document.querySelector(this.target) }, true);
        }
        if (this.target) {
            this.target.insertBefore(this.element, this.target.children[0]);
            addClass([this.element], SIDEBARABSOLUTE);
            addClass([this.target], CONTEXT);
            this.targetEle = this.getTargetElement();
        }
    }
    getTargetElement() {
        let siblingElement = this.element.nextElementSibling;
        while (!isNullOrUndefined(siblingElement)) {
            if (!siblingElement.classList.contains(ROOT$1)) {
                break;
            }
            siblingElement = siblingElement.nextElementSibling;
        }
        return siblingElement;
    }
    setCloseOnDocumentClick() {
        if (this.closeOnDocumentClick) {
            EventHandler.add(document, 'mousedown touchstart', this.documentclickHandler, this);
        }
        else {
            EventHandler.remove(document, 'mousedown touchstart', this.documentclickHandler);
        }
    }
    setWidth() {
        if (this.enableDock && this.position === 'Left') {
            setStyleAttribute(this.element, { 'width': this.setDimension(this.dockSize) });
        }
        else if (this.enableDock && this.position === 'Right') {
            setStyleAttribute(this.element, { 'width': this.setDimension(this.dockSize) });
        }
        else if (!this.enableDock) {
            setStyleAttribute(this.element, { 'width': this.setDimension(this.width) });
        }
    }
    setDimension(width) {
        if (typeof width === 'number') {
            width = formatUnit(width);
        }
        else if (typeof width === 'string') {
            width = (width.match(/px|%|em/)) ? width : formatUnit(width);
        }
        else {
            width = '100%';
        }
        return width;
    }
    setZindex() {
        setStyleAttribute(this.element, { 'z-index': '' + this.zIndex });
    }
    addClass() {
        const classELement = document.querySelector('.e-main-content');
        if (!isNullOrUndefined(classELement || this.targetEle)) {
            addClass([classELement || this.targetEle], [MAINCONTENTANIMATION]);
        }
        this.tabIndex = this.element.hasAttribute('tabindex') ? this.element.getAttribute('tabindex') : '0';
        if (!this.isBlazor) {
            if (!this.enableDock && this.type !== 'Auto') {
                addClass([this.element], [VISIBILITY]);
            }
            removeClass([this.element], [OPEN, CLOSE, RIGHT, LEFT, SLIDE, PUSH, OVER]);
            this.element.classList.add(ROOT$1);
            addClass([this.element], (this.position === 'Right') ? RIGHT : LEFT);
            if (this.enableDock) {
                addClass([this.element], DOCKER);
            }
            this.element.setAttribute('tabindex', this.tabIndex);
        }
        if (this.type === 'Auto' && !Browser.isDevice) {
            this.show();
        }
        else if (!this.isOpen) {
            addClass([this.element], CLOSE);
        }
    }
    checkType(val) {
        if (!(this.type === 'Push' || this.type === 'Over' || this.type === 'Slide')) {
            this.type = 'Auto';
        }
        else {
            if (!this.element.classList.contains(CLOSE) && !val) {
                this.hide();
            }
        }
    }
    transitionEnd(e) {
        this.setDock();
        if (!isNullOrUndefined(e)) {
            this.triggerChange();
        }
        EventHandler.remove(this.element, 'transitionend', this.transitionEnd);
    }
    destroyBackDrop() {
        const sibling = document.querySelector('.e-main-content') || this.targetEle;
        if (this.target && this.showBackdrop && sibling) {
            removeClass([sibling], CONTEXTBACKDROP);
        }
        else if (this.showBackdrop && this.modal) {
            this.modal.style.display = 'none';
            this.modal.outerHTML = '';
            this.modal = null;
        }
    }
    /* eslint-disable */
    /**
     * Hide the Sidebar component, if it is in an open state.
     *
     * @returns {void}
     *
     */
    hide(e) {
        const closeArguments = {
            model: this,
            element: this.element,
            cancel: false,
            isInteracted: !isNullOrUndefined(e),
            event: (e || null)
        };
        if (isBlazor()) {
            delete closeArguments.model;
        }
        this.trigger('close', closeArguments, (observedcloseArgs) => {
            if (!observedcloseArgs.cancel) {
                if (this.element.classList.contains(CLOSE)) {
                    return;
                }
                if (this.element.classList.contains(OPEN) && !this.animate) {
                    this.triggerChange();
                }
                addClass([this.element], CLOSE);
                removeClass([this.element], OPEN);
                setStyleAttribute(this.element, { 'width': formatUnit(this.enableDock ? this.dockSize : this.width) });
                this.setType(this.type);
                const sibling = document.querySelector('.e-main-content') || this.targetEle;
                if (!this.enableDock && sibling) {
                    sibling.style.transform = 'translateX(' + 0 + 'px)';
                    sibling.style[this.position === 'Left' ? 'marginLeft' : 'marginRight'] = '0px';
                }
                this.destroyBackDrop();
                this.setAnimation();
                if (this.type === 'Slide') {
                    document.body.classList.remove('e-sidebar-overflow');
                }
                this.setProperties({ isOpen: false }, true);
                if (this.enableDock) {
                    setTimeout(() => this.setTimeOut(), 50);
                }
                EventHandler.add(this.element, 'transitionend', this.transitionEnd, this);
            }
        });
    }
    setTimeOut() {
        const sibling = document.querySelector('.e-main-content') || this.targetEle;
        const elementWidth = this.element.getBoundingClientRect().width;
        if (this.element.classList.contains(OPEN) && sibling) {
            if (this.position === 'Left') {
                sibling.style.marginLeft = this.setDimension(this.width === 'auto' ? elementWidth : this.width);
            }
            else {
                sibling.style.marginRight = this.setDimension(this.width === 'auto' ? elementWidth : this.width);
            }
        }
        else if (this.element.classList.contains(CLOSE) && sibling) {
            if (this.position === 'Left') {
                sibling.style.marginLeft = this.setDimension(this.dockSize === 'auto' ? elementWidth : this.dockSize);
            }
            else {
                sibling.style.marginRight = this.setDimension(this.dockSize === 'auto' ? elementWidth : this.dockSize);
            }
        }
    }
    /* eslint-disable */
    /**
     * Shows the Sidebar component, if it is in closed state.
     *
     * @returns {void}
     */
    show(e) {
        const openArguments = {
            model: this,
            element: this.element,
            cancel: false,
            isInteracted: !isNullOrUndefined(e),
            event: (e || null)
        };
        if (isBlazor()) {
            delete openArguments.model;
        }
        this.trigger('open', openArguments, (observedopenArgs) => {
            if (!observedopenArgs.cancel) {
                removeClass([this.element], VISIBILITY);
                if (this.element.classList.contains(OPEN)) {
                    return;
                }
                if (this.element.classList.contains(CLOSE) && !this.animate) {
                    this.triggerChange();
                }
                addClass([this.element], [OPEN, TRASITION]);
                setStyleAttribute(this.element, { 'transform': '' });
                removeClass([this.element], CLOSE);
                setStyleAttribute(this.element, { 'width': formatUnit(this.width) });
                this.setType(this.type);
                this.createBackDrop();
                this.setAnimation();
                if (this.type === 'Slide') {
                    document.body.classList.add('e-sidebar-overflow');
                }
                this.setProperties({ isOpen: true }, true);
                EventHandler.add(this.element, 'transitionend', this.transitionEnd, this);
            }
        });
    }
    setAnimation() {
        if (this.animate) {
            removeClass([this.element], DISABLEANIMATION);
        }
        else {
            addClass([this.element], DISABLEANIMATION);
        }
    }
    triggerChange() {
        const changeArguments = { name: 'change', element: this.element };
        this.trigger('change', changeArguments);
    }
    setDock() {
        if (this.enableDock && this.position === 'Left' && !this.getState()) {
            setStyleAttribute(this.element, { 'transform': 'translateX(' + -100 + '%) translateX(' + this.setDimension(this.dockSize) + ')' });
        }
        else if (this.enableDock && this.position === 'Right' && !this.getState()) {
            setStyleAttribute(this.element, { 'transform': 'translateX(' + 100 + '%) translateX(' + '-' + this.setDimension(this.dockSize) + ')' });
        }
        if (this.element.classList.contains(CLOSE) && this.enableDock) {
            setStyleAttribute(this.element, { 'width': this.setDimension(this.dockSize) });
        }
    }
    createBackDrop() {
        if (this.target && this.showBackdrop && this.getState()) {
            const sibling = document.querySelector('.e-main-content') || this.targetEle;
            addClass([sibling], CONTEXTBACKDROP);
        }
        else if (this.showBackdrop && !this.modal && this.getState()) {
            this.modal = this.createElement('div');
            this.modal.className = DEFAULTBACKDROP;
            this.modal.style.display = 'block';
            document.body.appendChild(this.modal);
        }
    }
    getPersistData() {
        return this.addOnPersist(['type', 'position', 'isOpen']);
    }
    /**
     * Returns the current module name.
     *
     * @returns {string} - returns module name.
     * @private
     *
     */
    getModuleName() {
        return 'sidebar';
    }
    /**
     * Shows or hides the Sidebar based on the current state.
     *
     * @returns {void}
     */
    toggle() {
        if (this.element.classList.contains(OPEN)) {
            this.hide();
        }
        else {
            this.show();
        }
    }
    getState() {
        return this.element.classList.contains(OPEN) ? true : false;
    }
    setMediaQuery() {
        if (this.mediaQuery) {
            let media = false;
            if (typeof (this.mediaQuery) === 'string') {
                media = window.matchMedia(this.mediaQuery).matches;
            }
            else {
                media = (this.mediaQuery).matches;
            }
            if (media && this.windowWidth !== window.innerWidth) {
                this.show();
            }
            else if (this.getState() && this.windowWidth !== window.innerWidth) {
                this.hide();
            }
        }
    }
    resize() {
        if (this.type === 'Auto') {
            if (Browser.isDevice) {
                addClass([this.element], OVER);
            }
            else {
                addClass([this.element], PUSH);
            }
        }
        this.setMediaQuery();
        if (Browser.isDevice) {
            this.windowWidth = window.innerWidth;
        }
    }
    documentclickHandler(e) {
        if (closest(e.target, '.' + CONTROL$1 + '' + '.' + ROOT$1)) {
            return;
        }
        this.hide(e);
    }
    enableGestureHandler(args) {
        if (!this.isOpen && this.position === 'Left' && args.swipeDirection === 'Right' &&
            (args.startX <= 20 && args.distanceX >= 50 && args.velocity >= 0.5)) {
            this.show();
        }
        else if (this.isOpen && this.position === 'Left' && args.swipeDirection === 'Left') {
            this.hide();
        }
        else if (this.isOpen && this.position === 'Right' && args.swipeDirection === 'Right') {
            this.hide();
        }
        else if (!this.isOpen && this.position === 'Right' && args.swipeDirection === 'Left'
            && (window.innerWidth - args.startX <= 20 && args.distanceX >= 50 && args.velocity >= 0.5)) {
            this.show();
        }
    }
    setEnableGestures() {
        if (this.enableGestures) {
            this.mainContentEle = new Touch(document.body, { swipe: this.enableGestureHandler.bind(this) });
            this.sidebarEle = new Touch(this.element, { swipe: this.enableGestureHandler.bind(this) });
        }
        else {
            if (this.mainContentEle && this.sidebarEle) {
                this.mainContentEle.destroy();
                this.sidebarEle.destroy();
            }
        }
    }
    wireEvents() {
        this.setEnableGestures();
        window.addEventListener('resize', this.resize.bind(this));
    }
    unWireEvents() {
        window.removeEventListener('resize', this.resize.bind(this));
        EventHandler.remove(document, 'mousedown touchstart', this.documentclickHandler);
        if (this.mainContentEle) {
            this.mainContentEle.destroy();
        }
        if (this.sidebarEle) {
            this.sidebarEle.destroy();
        }
    }
    /**
     * Called internally if any of the property value changed.
     *
     * @param {SidebarModel} newProp - specifies newProp value.
     * @param {SidebarModel} oldProp - specifies oldProp value.
     * @returns {void}
     * @private
     *
     */
    onPropertyChanged(newProp, oldProp) {
        const sibling = document.querySelector('.e-main-content') || this.targetEle;
        const isRendered = this.isServerRendered;
        for (const prop of Object.keys(newProp)) {
            switch (prop) {
                case 'isOpen':
                    if (this.isOpen) {
                        this.show();
                    }
                    else {
                        this.hide();
                    }
                    break;
                case 'width':
                    this.setWidth();
                    if (!this.getState()) {
                        this.setDock();
                    }
                    break;
                case 'animate':
                    this.setAnimation();
                    break;
                case 'type':
                    this.checkType(false);
                    removeClass([this.element], [VISIBILITY]);
                    this.addClass();
                    addClass([this.element], this.type === 'Auto' ? (Browser.isDevice ? ['e-over'] :
                        ['e-push']) : ['e-' + this.type.toLowerCase()]);
                    break;
                case 'position':
                    this.element.style.transform = '';
                    this.setDock();
                    if (sibling) {
                        sibling.style[this.position === 'Left' ? 'marginRight' : 'marginLeft'] = '0px';
                    }
                    if (this.position === 'Right') {
                        removeClass([this.element], LEFT);
                        addClass([this.element], RIGHT);
                    }
                    else {
                        removeClass([this.element], RIGHT);
                        addClass([this.element], LEFT);
                    }
                    this.setType(this.type);
                    break;
                case 'showBackdrop':
                    if (this.showBackdrop) {
                        this.createBackDrop();
                    }
                    else {
                        if (this.modal) {
                            this.modal.style.display = 'none';
                            this.modal.outerHTML = '';
                            this.modal = null;
                        }
                    }
                    break;
                case 'target':
                    if (typeof (this.target) === 'string') {
                        this.setProperties({ target: document.querySelector(this.target) }, true);
                    }
                    if (isNullOrUndefined(this.target)) {
                        removeClass([this.element], SIDEBARABSOLUTE);
                        removeClass([oldProp.target], CONTEXT);
                        setStyleAttribute(sibling, { 'margin-left': 0, 'margin-right': 0 });
                        document.body.insertAdjacentElement('afterbegin', this.element);
                    }
                    this.isServerRendered = false;
                    super.refresh();
                    this.isServerRendered = isRendered;
                    break;
                case 'closeOnDocumentClick':
                    this.setCloseOnDocumentClick();
                    break;
                case 'enableDock':
                    if (!this.getState()) {
                        this.setDock();
                    }
                    break;
                case 'zIndex':
                    this.setZindex();
                    break;
                case 'mediaQuery':
                    this.setMediaQuery();
                    break;
                case 'enableGestures':
                    this.setEnableGestures();
                    break;
                case 'enableRtl':
                    this.setEnableRTL();
                    break;
            }
        }
    }
    setType(type) {
        const elementWidth = this.element.getBoundingClientRect().width;
        this.setZindex();
        const sibling = document.querySelector('.e-main-content') || this.targetEle;
        if (sibling) {
            sibling.style.transform = 'translateX(' + 0 + 'px)';
            if (!Browser.isDevice && this.type !== 'Auto') {
                sibling.style[this.position === 'Left' ? 'marginLeft' : 'marginRight'] = '0px';
            }
        }
        const margin = this.position === 'Left' ? elementWidth + 'px' : elementWidth + 'px';
        const eleWidth = this.position === 'Left' ? elementWidth : -(elementWidth);
        removeClass([this.element], [PUSH, OVER, SLIDE]);
        switch (type) {
            case 'Push':
                addClass([this.element], [PUSH]);
                if (sibling && (this.enableDock || this.element.classList.contains(OPEN))) {
                    sibling.style[this.position === 'Left' ? 'marginLeft' : 'marginRight'] = margin;
                }
                break;
            case 'Slide':
                addClass([this.element], [SLIDE]);
                if (sibling && (this.enableDock || this.element.classList.contains(OPEN))) {
                    sibling.style.transform = 'translateX(' + eleWidth + 'px)';
                }
                break;
            case 'Over':
                addClass([this.element], [OVER]);
                if (this.enableDock && this.element.classList.contains(CLOSE)) {
                    if (sibling) {
                        sibling.style[this.position === 'Left' ? 'marginLeft' : 'marginRight'] = margin;
                    }
                }
                break;
            case 'Auto':
                addClass([this.element], [TRASITION]);
                if (Browser.isDevice) {
                    if (sibling && (this.enableDock) && !this.getState()) {
                        sibling.style[this.position === 'Left' ? 'marginLeft' : 'marginRight'] = margin;
                        addClass([this.element], PUSH);
                    }
                    else {
                        addClass([this.element], OVER);
                    }
                }
                else {
                    addClass([this.element], PUSH);
                    if (sibling && (this.enableDock || this.element.classList.contains(OPEN))) {
                        sibling.style[this.position === 'Left' ? 'marginLeft' : 'marginRight'] = margin;
                    }
                }
                this.createBackDrop();
        }
    }
    /**
     * Removes the control from the DOM and detaches all its related event handlers. Also it removes the attributes and classes.
     *
     * @returns {void}
     *
     */
    destroy() {
        super.destroy();
        if (this.target) {
            removeClass([this.target], CONTEXT);
        }
        this.destroyBackDrop();
        if (this.element) {
            removeClass([this.element], [OPEN, CLOSE, PUSH, SLIDE, OVER, LEFT, RIGHT, TRASITION]);
            removeClass([this.element], SIDEBARABSOLUTE);
            this.element.style.width = '';
            this.element.style.zIndex = '';
            this.element.style.transform = '';
            if (!isNullOrUndefined(this.sidebarEleCopy.getAttribute('tabindex'))) {
                this.element.setAttribute('tabindex', this.tabIndex);
            }
            else {
                this.element.removeAttribute('tabindex');
            }
        }
        this.windowWidth = null;
        const sibling = document.querySelector('.e-main-content') || this.targetEle;
        if (!isNullOrUndefined(sibling)) {
            sibling.style.margin = '';
            sibling.style.transform = '';
        }
        this.unWireEvents();
    }
};
__decorate$9([
    Property('auto')
], Sidebar.prototype, "dockSize", void 0);
__decorate$9([
    Property(null)
], Sidebar.prototype, "mediaQuery", void 0);
__decorate$9([
    Property(false)
], Sidebar.prototype, "enableDock", void 0);
__decorate$9([
    Property('en-US')
], Sidebar.prototype, "locale", void 0);
__decorate$9([
    Property(false)
], Sidebar.prototype, "enablePersistence", void 0);
__decorate$9([
    Property(true)
], Sidebar.prototype, "enableGestures", void 0);
__decorate$9([
    Property(false)
], Sidebar.prototype, "isOpen", void 0);
__decorate$9([
    Property(false)
], Sidebar.prototype, "enableRtl", void 0);
__decorate$9([
    Property(true)
], Sidebar.prototype, "animate", void 0);
__decorate$9([
    Property('auto')
], Sidebar.prototype, "height", void 0);
__decorate$9([
    Property(false)
], Sidebar.prototype, "closeOnDocumentClick", void 0);
__decorate$9([
    Property('Left')
], Sidebar.prototype, "position", void 0);
__decorate$9([
    Property(null)
], Sidebar.prototype, "target", void 0);
__decorate$9([
    Property(false)
], Sidebar.prototype, "showBackdrop", void 0);
__decorate$9([
    Property('Auto')
], Sidebar.prototype, "type", void 0);
__decorate$9([
    Property('auto')
], Sidebar.prototype, "width", void 0);
__decorate$9([
    Property(1000)
], Sidebar.prototype, "zIndex", void 0);
__decorate$9([
    Event()
], Sidebar.prototype, "created", void 0);
__decorate$9([
    Event()
], Sidebar.prototype, "close", void 0);
__decorate$9([
    Event()
], Sidebar.prototype, "open", void 0);
__decorate$9([
    Event()
], Sidebar.prototype, "change", void 0);
__decorate$9([
    Event()
], Sidebar.prototype, "destroyed", void 0);
Sidebar = __decorate$9([
    NotifyPropertyChanges
], Sidebar);

/**
 * Sidebar modules
 */

/**
 * Navigation all modules
 */

export { MenuAnimationSettings, MenuItem, HScroll, VScroll, addScrolling, destroyScroll, Item, Toolbar, AccordionActionSettings, AccordionAnimationSettings, AccordionItem, Accordion, ContextMenu, Menu, TabActionSettings, TabAnimationSettings, Header, TabItem, Tab, FieldsSettings, ActionSettings, NodeAnimationSettings, TreeView, Sidebar };
//# sourceMappingURL=ej2-navigations.es2015.js.map