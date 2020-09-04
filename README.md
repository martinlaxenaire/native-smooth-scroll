Native smooth scroll

<h2>Initializing</h2>
    
```javascript
import {SmoothScroll} from './src/native.smooth.scroll.js';

const smoothScroll = new SmoothScroll({
    container: document.querySelector(".container"),
});
```

In a browser, you can use the UMD files located in the `dist` directory. You will have to use the `SmoothScroll` namespace:
    
```html
<script src="dist/native.smooth.scroll.umd.js"></script>
```

```javascript
const smoothScroll = new SmoothScroll.SmoothScroll({
    container: document.querySelector(".container"),
});
```

<h3>Parameters</h3>

There are 2 basic parameters that you can specify:

| Parameter  | Type | Default | Description |
| --- | --- | --- | --- |
| container  | HTML node | document.body | container that will be fixed and translated to according scroll values |
| inertia | float | 0.1 | Easing value |
| threshold | float | 0.5 | Threshold to stop the easing animation, in pixels |
| useRaf | bool | false | Whether to use the built-in requestAnimationFrame callback. |

```javascript
const smoothScroll = new SmoothScroll({
    // container that will be translated
    container: document.getElementById("content"),
    // round the threshold to 1 pixel
    threshold: 1, 
    // use built-in raf loop
    useRaf: true
});
```

<h3>Methods</h3>

| Name | Description |
| --- | --- |
| resize  | Should be called in a window resize event to update the values |
| update | Should be called to update internal values when the document height changed |
| scrollTo | Immediately scroll to a defined position |
| render | Update our current scroll and velocity values, translate the container and emit our onScroll event. Should be called at each tick of a requestAnimationFrame callback if useRaf is set to false |

```javascript
const smoothScroll = new SmoothScroll({
    // container that will be translated
    container: document.getElementById("content"),
    // round the threshold to 1 pixel
    threshold: 1, 
    // use built-in raf loop
    useRaf: true
});

window.addEventListener("resize", () => {
    smoothScroll.resize();
});
```

<h3>onScroll callback</h3>

```javascript
const smoothScroll = new SmoothScroll({
     // container that will be translated
     container: document.getElementById("content"),
     // round the threshold to 1 pixel
     threshold: 1, 
     // use built-in raf loop
     useRaf: true
});

smoothScroll.onScroll((scroll) => {
    // an object containing the current scroll value, the target scroll value and the velocity value
    console.log(scroll);
});
```
