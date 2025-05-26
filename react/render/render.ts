import React, { IS_DEVELOPMENT, ReactComponentInstance } from "..";
import { mount } from "./mount";

export async function renderMethod(element: ReactElement, container: HTMLElement) {
    if(React.isFirstRender)
        React.isFirstRender = false;

    const rootComponent = renderComponentMethod(element);
    React.components.set(rootComponent.name, rootComponent);
    React.currentComponent = rootComponent;

    container.innerHTML = "";
    React.rootDom = await mount({
        vNode: rootComponent.vNode!,
        parent: container,
        name: rootComponent.name,
    });

    if (IS_DEVELOPMENT) console.log("[ components ]", React.components);
    if (React.rootDom === null) return;
    container.appendChild(React.rootDom);
}

export function renderComponentMethod(element: ReactElement): ReactComponentInstance {
    const component = React.createComponentInstance(element);
    React.currentComponent = component;

    if (!React.isValidElement(element)) {
        throw new Error("Invalid element type");
    }

    if (typeof element.type === "string") {
        component.vNode = React.createElement(
            element.type,
            { ...element.props },
            ...element.children
        );
        return component;
    }

    component.vNode = element.type({ ...element.props }, ...element.children);
    return component;
}
