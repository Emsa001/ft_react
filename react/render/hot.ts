import React from "..";

const container = document.getElementById("root")!;

async function renderApp(clearCache = true) {
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

// TODO: Handle popstate event properly, by re-rendering the current route
window.addEventListener("popstate", async () => {
    console.log("[HMR] Reloading App module...");
    await renderApp(false);

});

renderApp();
