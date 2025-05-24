import React from "..";

const container = document.getElementById("root")!;

async function renderApp() {
    const { default: Root } = await import("../../src/app/root");

    React.components.clear();
    React.staticComponents.clear();

    const root = React.createElement(Root);
    React.render(root, container);
}

if (import.meta.webpackHot) {
    import.meta.webpackHot.accept("../../src/app/root", async () => {
        console.log("[HMR] Reloading App module...");
        await renderApp();
    });
}

// listen for popstate event
window.addEventListener("popstate", async () => {
    console.log("[HMR] Reloading App module...");
    await renderApp();
});

renderApp();
