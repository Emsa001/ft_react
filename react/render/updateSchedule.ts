import React, { IS_DEVELOPMENT } from "react";
import { Hook, ReactComponentInstance } from "react/types";
import { update } from "./update";

export function processQueue(hook: Hook) {
    let state = hook.memoizedState;

    for (const update of hook.queue) 
        state = update(state);

    hook.memoizedState = state;
    hook.queue = [];
}

async function ensureRefExists(component: ReactComponentInstance) {
    let attempts = 0;
    while (!component.vNode?.ref && attempts < 10) {
        await new Promise((resolve) => setTimeout(resolve, 10));
        attempts++;
    }
    if (!component.vNode?.ref) {
        console.error("Component ref is still null after waiting.");
        throw new Error("Component ref is still null after waiting.");
    }
}

export async function updateSchedule(component: ReactComponentInstance, states: Hook[]) {
    await ensureRefExists(component);
    await Promise.resolve().then(async () => {
        states.forEach((hook) => processQueue(hook));

        React.currentComponent = component;
        component.hookIndex = 0;

        if (typeof component.jsx?.type !== "function")
            throw new Error("Invalid component type");

        if (!component.vNode?.ref) {
            throw new Error("Component ref is null, something is very wrong here :|");
        }
        
        const newNode = component.jsx?.type(component.jsx.props, ...component.jsx.children);
        newNode.componentName = component.name;

        if (IS_DEVELOPMENT) {
            console.log("New VNode:", newNode);
            console.log("Old VNode:", component.vNode);
        }

        if (newNode && component.vNode) {
            update({
                oldNode: component.vNode,
                newNode,
                ref: component.vNode.ref,
                parent: component.vNode.ref.parentElement,
                index: 0,
                name: component.name,
            });
            component.vNode = newNode;
            component.onUpdate();
        }
        if (IS_DEVELOPMENT) console.log(React.components);
    });
}
