# ft_react

**ft_react** is a lightweight, learning-focused implementation of the React library. It replicates core React features such as hooks, context, and routing — and adds a few custom ones too.

---

## 🚀 Table of Contents

- [Motivation](#motivation)
- [Features](#features)
  - [Custom Hook: `useStatic`](#what-is-usestatic)
- [Installation](#installation)
- [Usage](#usage)
- [Tailwind CSS Integration](#tailwindcss)
- [Example](#example)
  - [Basic Example](#basic-example)
  - [Routing Example](#example-routing)
- [Contributing](#contributing)
- [License](#license)

---

## Motivation

The idea for this project came from my final project at 42 coding school (`ft_transcendence`), where using React was not allowed.  
So I decided to write my own React-like implementation from scratch.

---

## 🌐 Showcase

Check out the live demo of `ft_react`:  
🔗 [https://ft-react.vercel.app/](https://ft-react.vercel.app/)

This page demonstrates how the library works with routing, hooks, and custom features in action.

---

## Features

- **Routing**: Navigate between views without reloading the page.
- **Hooks**: Includes `useState`, `useStatic`, `useEffect`, `useRef`, `useContext`, `useNavigate`, and `useSyncExternalStore`.
- **Context API**: Basic support for global state using providers.

### What is `useStatic`?

`useStatic` is a custom hook I always wanted in React. It behaves like `useState`, except its state persists across the entire application and is shared between components automatically — no need for context providers.

```tsx
import React, { useStatic } from "react";

function AnotherComponent() {
    const [test, setTest] = useStatic("simple", 0);

    return (
        <div>
            <p>Value test in another component: {test}</p>
        </div>
    );
}

export function StaticStateSimple() {
    const [test, setTest] = useStatic("simple", 0);

    return (
        <div>
            <p>Simple static test: {test}</p>
            <AnotherComponent />
            <button onClick={() => setTest((prev) => prev + 1)}>Click</button>
        </div>
    );
}
```

The `"simple"` key ensures the value persists even after component unmount, and syncs between components.

---

## Installation

To get started with `ft_react`, clone the repository and install the dependencies:

```bash
git clone https://github.com/emsa001/ft_react.git
cd ft_react
npm install
```

---

## Usage

To start the development server:

```bash
npm run dev
```

---

## Tailwindcss

You can integrate Tailwind CSS with PostCSS using either v3 or v4:

- [Tailwind v3 Installation Guide](https://v3.tailwindcss.com/docs/installation/using-postcss)
- [Tailwind v4 Installation Guide](https://tailwindcss.com/docs/installation/using-postcss)

### `postcss.config.js`

```ts
export default {
    plugins: {
        tailwindcss: {}, // or "@tailwindcss/postcss": {}, for Tailwind v4
        autoprefixer: {},
    },
};
```

### `tailwind.config.js`

```ts
/** @type {import('tailwindcss').Config} */
export default {
    content: ["./src/**/*.{ts,tsx,html}"],
    theme: {
        extend: {},
    },
    plugins: [],
};
```

### `global.css` (v3)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### `global.css` (v4)

```css
@layer theme, base, components, utilities;

@import "tailwindcss";
@import "tailwindcss/theme.css" layer(theme);
@import "tailwindcss/preflight.css" layer(base);
@import "tailwindcss/utilities.css" layer(utilities);
```

---

## Example

### Basic Example

```tsx
import React, { useState, useEffect, setTitle } from 'react';

const App = () => {
    const [count, setCount] = useState<number>(0);
    const [name, setName] = useState<string>("Anonymous");

    useEffect(() => {
        setTitle(`Hello, ${name}!`);
    }, [name]);

    return (
        <div>
            <h1>Hello, {name}!</h1>
            <p>Number: {count}</p>
            <button onClick={() => setCount((prev) => prev + 1)}>Increment</button>
            <input value={name} onChange={(e: any) => setName(e.target.value)} />
        </div>
    );
};

export default App;
```

### Example Routing

```tsx
<BrowserRouter>
    <Router src="/" component={<Home />} />
    <Router src="/404" component={<NotFound />} default />
</BrowserRouter>
```

---

## Contributing

Contributions are welcome!  
Feel free to open an issue or submit a pull request for improvements or bug fixes.

---

## License

This project is licensed under the [MIT License](LICENSE).
