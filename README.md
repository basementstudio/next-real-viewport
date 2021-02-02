# next-real-vw

No more horizontal scroll when using `100vw` 🎉.

You know the bug. The one that drives you crazy.

1. You need to set some element's width to be full screen.
2. You use `width: 100vw`
3. Then you get your desktop computer, and your mouse introduces a scrollbar. Huh.
4. Now your site has a tiny horizontal scroll 🤮

This package simply calculates the real width of the viewport and sets some css variables to the document root, so you can enjoy a life without horizontal scroll.

- ✅ Use via css variables (`--vw`) or via the `useRealVw` hook
- ✅ Listen to screen resizing
- ✅ No flash on load (both SSR and SSG)

## Install

```bash
npm install next-real-vw
```

or

```bash
yarn add next-real-vw
```

## Set Up

### Option 1: RealVwScript

The easiest way to use next-real-vw is to just add the `<RealVwScript />` into your custom [`_app`](https://nextjs.org/docs/advanced-features/custom-app).

```js
// pages/_app.{js,tsx}

import { RealVwScript } from "@basementstudio/next-real-vw";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <RealVwScript />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
```

This component injects a script that calculates the real vw and sets a css variable, `--vw`, to use right away in your css.

### Option 2: RealVwProvider (context)

`next-real-vw` also works using React Context. Just use the exported provider anywhere you want to enjoy the _real_ vw. The recommended place to use it is in a custom [`_app`](https://nextjs.org/docs/advanced-features/custom-app).

```js
// pages/_app.{js,tsx}

import { RealVwProvider } from "@basementstudio/next-real-vw";

function MyApp({ Component, pageProps }) {
  return (
    <RealVwProvider>
      <Component {...pageProps} />
    </RealVwProvider>
  );
}

export default MyApp;
```

This provider also injects the script mentioned earlier.

## Use

### In CSS

You can use the css variables anywhere:

```css
.fullWidth {
  width: calc(var(--vw) * 100);
}

.halfWidth {
  width: calc(var(--vw) * 50);
}
```

### useRealVw

> Only works if using the `RealVwProvider`

Maybe you don't want to use the css variables (i don't know why anyone might not want to, they're awesome). But here's how to get the absolute values:

```js
import { useRealVw } from "@basementstudio/next-real-vw";

const FullScreenContainer = ({ children }) => {
  const { vw, cssVar, fullScreenCss } = useRealVw();

  return (
    <div
      style={{
        width: vw * 100, // or fullScreenCss
      }}
    >
      {children}
    </div>
  );
};
```

## Discussion

### The Layout Shift

Inspired by [next-themes](https://github.com/pacocoursey/next-themes), `RealVwProvider` automatically injects a script into `next/head` to update the `html` element with the css variable values before the rest of your page loads. This means the page will not have layout shift under any circumstances.
