function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function (global, factory) {
  (typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? factory(exports) : typeof define === 'function' && define.amd ? define(['exports'], factory) : (global = global || self, factory(global.window = global.window || {}));
})(this, function (exports) {
  'use strict';
  /**
   * SmoothScroll v1.0.0
   * https://github.com/martinlaxenaire/native-smooth-scroll
   *
   * Author: Martin Laxenaire
   * https://www.martin-laxenaire.fr/
   *
   * */

  var SmoothScroll = /*#__PURE__*/function () {
    /**
     * Init our class
     *
     * @param container (HTML element): container that will be translated to according scroll values
     * @param inertia (float): easing value. Default to 0.1.
     * @param threshold (float): when to stop the easing. Default to 0.5.
     * @param useRaf (bool): whether to use the built-in requestAnimationFrame callback. Default to false.
     */
    function SmoothScroll() {
      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          container = _ref.container,
          _ref$inertia = _ref.inertia,
          inertia = _ref$inertia === void 0 ? 0.1 : _ref$inertia,
          _ref$threshold = _ref.threshold,
          threshold = _ref$threshold === void 0 ? 0.5 : _ref$threshold,
          _ref$useRaf = _ref.useRaf,
          useRaf = _ref$useRaf === void 0 ? false : _ref$useRaf;

      _classCallCheck(this, SmoothScroll);

      this.container = container; // no container, return

      if (!this.container) {
        console.warn("Can't init SmoothScroll class because the container passed does not exist:", container);
        return;
      }

      this.inertia = inertia;
      this.threshold = threshold;
      this._useRaf = useRaf;
      this._raf = null; // are we currently animating the scroll

      this._isScrolling = false; // will hold our scroll values

      this.scroll = {}; // will hold our sizes values

      this.store = {}; // set sizes and init everything

      this.resize();
      this.init();
    }
    /**
     * Apply fixed position to our container and start listening to scroll event
     */


    _createClass(SmoothScroll, [{
      key: "init",
      value: function init() {
        var _this = this;

        // set container styles
        this.container.style.position = "fixed";
        this.container.style.top = 0;
        this.container.style.left = 0;
        this.container.style.width = "100%"; // page scrolled on load

        if (this.scroll.current !== 0) {
          this.scrollTo(this.scroll.current);
          setTimeout(function () {
            _this.emitScroll();
          }, 0);
        }

        window.addEventListener("scroll", function () {
          return _this.scrollEvent();
        });

        if (this._useRaf) {
          this.animate();
        }
      }
      /**
       * Update our store sizes
       */

    }, {
      key: "update",
      value: function update() {
        this.store.documentHeight = this.container.clientHeight;
        this.store.windowHeight = window.innerHeight;
        document.body.style.height = this.store.documentHeight + "px";
      }
      /**
       * Reset our store and scroll values
       * Should be called in a window resize event to update the values
       */

    }, {
      key: "resize",
      value: function resize() {
        this.update();
        var newScrollValue = window.pageYOffset;
        this.scroll = {
          target: newScrollValue,
          current: newScrollValue,
          velocity: 0
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

    }, {
      key: "lerp",
      value: function lerp(start, end, amount) {
        return ((1 - amount) * start + amount * end).toFixed(2);
      }
      /**
       * Add our scroll event listener and update our scroll target value on scroll
       */

    }, {
      key: "scrollEvent",
      value: function scrollEvent() {
        this.scroll.target = window.pageYOffset;
      }
      /**
       * Emit our onScroll event with our current, target and velocity scroll values
       */

    }, {
      key: "emitScroll",
      value: function emitScroll() {
        if (this.onScrollCallback) {
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

    }, {
      key: "scrollTo",
      value: function scrollTo(value) {
        value = Math.max(0, Math.min(value, this.store.documentHeight - this.store.windowHeight));
        this.scroll.current = value;
        this.scroll.target = value;
        this.scroll.velocity = 0; // force window scroll to update as well

        window.scrollTo(0, value);
        this.updatePosition();
        this.emitScroll();
      }
      /**
       * Translate our container
       */

    }, {
      key: "updatePosition",
      value: function updatePosition() {
        this.container.style.transform = "translateY(" + -this.scroll.current + "px)";
      }
      /**
       * Update our current scroll and velocity values, translate the container and emit our onScroll event
       * Should be called at each tick of a requestAnimationFrame callback
       */

    }, {
      key: "render",
      value: function render() {
        // update current and velocity scroll values
        var previous = this.scroll.current;
        this.scroll.current = this.lerp(this.scroll.current, this.scroll.target, this.inertia);
        this.scroll.velocity = this.scroll.current - previous; // if we haven't reached our threshold value, update our position and emit scroll

        if (Math.abs(this.scroll.current - this.scroll.target) >= this.threshold) {
          this._isScrolling = true;
          this.updatePosition();
          this.emitScroll();
        } else if (this._isScrolling) {
          // if we have reached the threshold value, reset our current and velocity scroll values
          // and emit one last onScroll event
          this._isScrolling = false;
          this.scroll.current = this.scroll.target;
          this.scroll.velocity = 0;
          this.updatePosition();
          this.emitScroll();
        }
      }
    }, {
      key: "animate",
      value: function animate() {
        var _this2 = this;

        this.render();
        this._raf = window.requestAnimationFrame(function () {
          return _this2.animate();
        });
      }
      /**
       * onScroll event
       *
       * @param callback (function): the callback function
       */

    }, {
      key: "onScroll",
      value: function onScroll(callback) {
        if (callback) {
          this.onScrollCallback = callback;
        }
      }
      /**
       * Destroy the smooth scroll instance
       */

    }, {
      key: "destroy",
      value: function destroy() {
        if (this._raf) {
          window.cancelAnimationFrame(this._raf);
        }

        window.removeEventListener(this.scrollEvent);
      }
    }]);

    return SmoothScroll;
  }();

  exports.SmoothScroll = SmoothScroll;
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
});
