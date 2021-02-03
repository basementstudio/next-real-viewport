# next-real-viewport

No more horizontal scroll when using `100vw` 🎉. No more issues with the `100vh` in mobile browsers 🤯.

You know the bug. The one that drives you crazy.

1. You need to set some element's width to be full screen.
2. You use `width: 100vw`
3. Then you get your desktop computer, and your mouse introduces a scrollbar. Huh.
4. Now your site has a tiny horizontal scroll 🤮

Or maybe

1. You need to set some element's _height_ to be full screen.
2. You use `height: 100vh`
3. Then you get your iphone and Safari's UI is all over. Wot?

This package simply calculates the real width of the viewport and sets some css variables to the document root, so you can enjoy a life without horizontal scroll, nor Safari issues.

- ✅ Use via css variables (`--vw` and `--vh`) or via the `useRealViewport` hook
- ✅ Listen to screen resizing
- ✅ No flash on load (both SSR and SSG)

## Install

```bash
npm install next-real-viewport
```

or

```bash
yarn add next-real-viewport
```

## Set Up

### RealViewportProvider (context)

To start using `next-real-viewport`, simply use the exported provider anywhere you want. The recommended place to use it is in a custom [`_app`](https://nextjs.org/docs/advanced-features/custom-app).

```js
// pages/_app.{js,tsx}

import { RealViewportProvider } from "next-real-viewport";

function MyApp({ Component, pageProps }) {
  return (
    <RealViewportProvider>
      <Component {...pageProps} />
    </RealViewportProvider>
  );
}

export default MyApp;
```

## Use

### In CSS

You can use the css variables anywhere:

```css
.fullWidth {
  width: calc(var(--vw) * 100);
}

.fullHeight {
  width: calc(var(--vh) * 100);
}
```

### useRealViewport

Maybe you don't want to use the css variables (i don't know why anyone might not want to, they're awesome). But here's how to get the absolute values:

```js
import { useRealViewport } from "next-real-viewport";

const Demo = ({ children }) => {
  const { vw, vh } = useRealViewport();

  return (
    <div
      style={{
        width: vw * 100,
      }}
    >
      {children}
    </div>
  );
};
```

### Some Components

`next-real-viewport` comes with two layout components:

- `<ViewportWidthBox />`
- `<ViewportHeightBox />`

```js
import { ViewportWidthBox, ViewportHeightBox } from "next-real-viewport";

const Demo = ({ children }) => {
  return (
    <>
      <ViewportWidthBox center>
        My full screen content here. A table, maybe.
      </ViewportWidthBox>
      <ViewportHeightBox>
        My full height content. A mobile menu, maybe.
      </ViewportHeightBox>
    </>
  );
};
```

## Discussion

### The Layout Shift

Inspired by [next-themes](https://github.com/pacocoursey/next-themes), `RealVwProvider` automatically injects a script into `next/head` to update the `html` element with the css variable values before the rest of your page loads. This means the page will not have layout shift under any circumstances.

### The React Context

> Or, "Why do we use React Context for this?"

React Context is not used only for the hook, `useRealViewport`. No, we mainly use it because we need a listener for the `resize` event, and we don't want more than one.

Could the listener be set inside the `<script />`? Hm, maybe... But I haven't explored the downsides of having that (mainly, having more render-blocking JS).

PRs are welcome!
