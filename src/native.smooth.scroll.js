/**
 * SmoothScroll v1.0.0
 * https://github.com/martinlaxenaire/native-smooth-scroll
 *
 * Author: Martin Laxenaire
 * https://www.martin-laxenaire.fr/
 *
 * */

"use strict";

export class SmoothScroll {

    /**
     * Init our class
     *
     * @param container (HTML element): container that will be translated to according scroll values
     * @param inertia (float): easing value. Default to 0.1.
     * @param threshold (float): when to stop the easing. Default to 0.5.
     * @param useRaf (bool): whether to use the built-in requestAnimationFrame callback. Default to false.
     */
    constructor({
        container,
        inertia = 0.1,
        threshold = 0.5,
        useRaf = false,
    } = {}) {
        this.container = container;

        // no container, return
        if(!this.container) {
            console.warn("Can't init SmoothScroll class because the container passed does not exist:", container);
            return;
        }

        this.inertia = inertia;
        this.threshold = threshold;

        this._useRaf = useRaf;
        this._raf = null;

        // are we currently animating the scroll
        this._isScrolling = false;

        // will hold our scroll values
        this.scroll = {};

        // will hold our sizes values
        this.store = {};

        // set sizes and init everything
        this.resize();
        this.init();
    }

    /**
     * Apply fixed position to our container and start listening to scroll event
     */
    init() {
        // set container styles
        this.container.style.position = "fixed";
        this.container.style.top = 0;
        this.container.style.left = 0;
        this.container.style.width = "100%";

        // page scrolled on load
        if(this.scroll.current !== 0) {
            this.scrollTo(this.scroll.current);
            setTimeout(() => {
                this.emitScroll();
            }, 0);
        }

        window.addEventListener("scroll", () => this.scrollEvent());

        if(this._useRaf) {
            this.animate();
        }
    }

    /**
     * Update our store sizes
     */
    update() {
        this.store.documentHeight = this.container.clientHeight;
        this.store.windowHeight = window.innerHeight;

        document.body.style.height = this.store.documentHeight + "px";
    }

    /**
     * Reset our store and scroll values
     * Should be called in a window resize event to update the values
     */
    resize() {
        this.update();

        let newScrollValue = window.pageYOffset;

        this.scroll = {
            target: newScrollValue,
            current: newScrollValue,
            velocity: 0,
        };

        this.scrollTo(this.scroll.current);
    }

    /**
     * Simple utility function to linear interpolate values
     *
     * @param start (float): value to lerp
     * @param end (float): target value
     * @param amount (float): easing
     *
     * @returns (float): lerped value
     */
    lerp(start, end, amount) {
        return ((1 - amount) * start + amount * end).toFixed(2);
    }

    /**
     * Add our scroll event listener and update our scroll target value on scroll
     */
    scrollEvent() {
        this.scroll.target = window.pageYOffset;
    }

    /**
     * Emit our onScroll event with our current, target and velocity scroll values
     */
    emitScroll() {
        if(this.onScrollCallback) {
            this.onScrollCallback({
                current: this.scroll.current,
                target: this.scroll.target,
                velocity: this.scroll.velocity
            });
        }
    }

    /**
     * Immediately scroll to a defined position
     *
     * @param value (float): new scroll position
     */
    scrollTo(value) {
        value = Math.max(0, Math.min(value, this.store.documentHeight - this.store.windowHeight));

        this.scroll.current = value;
        this.scroll.target = value;
        this.scroll.velocity = 0;
        // force window scroll to update as well
        window.scrollTo(0, value);
        this.updatePosition();

        this.emitScroll();
    }

    /**
     * Translate our container
     */
    updatePosition() {
        this.container.style.transform = "translateY(" + -this.scroll.current + "px)";
    }

    /**
     * Update our current scroll and velocity values, translate the container and emit our onScroll event
     * Should be called at each tick of a requestAnimationFrame callback
     */
    render() {
        // update current and velocity scroll values
        let previous = this.scroll.current;
        this.scroll.current = this.lerp(this.scroll.current, this.scroll.target, this.inertia);
        this.scroll.velocity = this.scroll.current - previous;

        // if we haven't reached our threshold value, update our position and emit scroll
        if(Math.abs(this.scroll.current - this.scroll.target) >= this.threshold) {
            this._isScrolling = true;
            this.updatePosition();
            this.emitScroll();
        }
        else if(this._isScrolling) {
            // if we have reached the threshold value, reset our current and velocity scroll values
            // and emit one last onScroll event
            this._isScrolling = false;
            this.scroll.current = this.scroll.target;
            this.scroll.velocity = 0;
            this.updatePosition();
            this.emitScroll();
        }
    }

    animate() {
        this.render();

        this._raf = window.requestAnimationFrame(() => this.animate());
    }

    /**
     * onScroll event
     *
     * @param callback (function): the callback function
     */
    onScroll(callback) {
        if(callback) {
            this.onScrollCallback = callback;
        }
    }

    /**
     * Destroy the smooth scroll instance
     */
    destroy() {
        if(this._raf) {
            window.cancelAnimationFrame(this._raf);
        }

        window.removeEventListener(this.scrollEvent);
    }
}