import React, { IS_DEVELOPMENT } from "react";
import { ReactComponentInstance } from "react/types";
import { unMountNode } from "react/render/mount";

export function createComponentInstanceMethod(element: ReactElement): ReactComponentInstance {
    if (typeof element.type !== "function") {
        throw new Error("Invalid component type");
    }

    let name = element.type.name;
    while(React.components.has(name)) 
        name = element.type.name + Math.random().toString(36).substring(2, 15);
    element.componentName = name;

    return {
        name: name,
        isMounted: false,
        isDirty: false,

        hooks: [],
        hookIndex: 0,

        vNode: null,
        jsx: element,

        queueFunctions: new Set<() => void>(),

        onMount() {
            if(IS_DEVELOPMENT) console.log("Component mounted:", this.name);
            this.isMounted = true;
        },
        onUnmount() {
            if(IS_DEVELOPMENT) console.log("Component unmounted:", this.name);

            const allChildren = Array.isArray(this.vNode?.children) ? this.vNode?.children : [];
            if(IS_DEVELOPMENT) console.log("Unmounting children:", allChildren);
            for (const child of allChildren) unMountNode(child);

            React.components.delete(this.name);
            React.staticComponents.delete(this.name);
            
            this.vNode?.ref?.remove();
            this.queueFunctions.forEach((fn) => fn());
            this.queueFunctions.clear();
            
            this.isMounted = false;
            this.vNode = null;
            this.jsx = null;
            this.hooks = [];
            this.hookIndex = 0;
            
        },
        onUpdate() {
            if(IS_DEVELOPMENT) console.log("Component updated:", this.name);
            
            this.isDirty = false;
        },
    };
}
