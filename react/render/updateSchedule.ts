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
        throw new Error(`Component ${component.name} ref is still null after waiting.`);
    }
}

export async function updateSchedule(component: ReactComponentInstance, states: Hook[]) {
    // Check if navigation is in progress before starting update
    if (React.isNavigating || React.components.get(component.name) !== component)
        return;

    await ensureRefExists(component);
    await Promise.resolve().then(async () => {
        // Check again after async operation
        if (React.isNavigating) {
            return;
        }

        states.forEach((hook) => processQueue(hook));

        React.currentComponent = component;
        component.hookIndex = 0;

        if (typeof component.jsx?.type !== "function")
            throw new Error(`Invalid component type ${component.jsx?.type} ${component.name}`);

        if (!component.vNode?.ref) {
            throw new Error("Component ref is null, something is very wrong here :|");
        }
        
        const newNode = component.jsx?.type(component.jsx.props, ...component.jsx.children);
        newNode.componentName = component.name;

        // Check once more before applying updates
        if (React.isNavigating) {
            return;
        }

        if (IS_DEVELOPMENT) {
            console.log("New VNode:", newNode);

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
