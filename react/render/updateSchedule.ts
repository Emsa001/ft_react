import React, { IS_DEVELOPMENT } from "react";
import { Hook, ReactComponentInstance } from "react/types";
import { update } from "./update";

// Process all queued state updates for the hook
export function processQueue(hook: Hook) {
    let state = hook.memoizedState;

    for (const update of hook.queue) {
        state = update(state);
    }

    hook.memoizedState = state;
    hook.queue = [];
}

// Schedule the component update asynchronously
export async function updateSchedule(component: ReactComponentInstance, states: Hook[]) {
    await Promise.resolve().then(async () => {
        states.forEach((hook) => {
            processQueue(hook);
        });

        component.isDirty = false;

        React.currentComponent = component;
        component.hookIndex = 0;

        if (typeof component.jsx?.type !== "function") {
            throw new Error("Invalid component type");
        }

        const newNode = component.jsx?.type(component.jsx.props, ...component.jsx.children);
        newNode.componentName = component.name;

        if (IS_DEVELOPMENT) {
            console.log("New VNode:", newNode);
            console.log("Old VNode:", component.vNode);
        }

        if (!component.vNode?.ref) {
            throw new Error("Component ref is null, something is very wrong here :|");
        }

        if (newNode && component.vNode) {
            update({
                oldNode: component.vNode,
                newNode,
                ref: component.vNode.ref,
                parent: component.vNode.ref!.parentElement,
                index: 0,
                name: component.name,
            });
            component.vNode = newNode;
            component.isDirty = false;
        }
        if (IS_DEVELOPMENT) console.log(React.components);
    });
}
