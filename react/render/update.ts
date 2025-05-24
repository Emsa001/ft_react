import React, { IS_DEVELOPMENT } from "react";
import { isEqual } from "lodash";
import { UpdateProps } from "../types";
import { mount, unMountNode } from "./mount";
import { removeProp, setProps } from "./props";


// TODO: get rid of global variables
let addToIndex = 0;
let prevNodeRef: Element | null = null;

const isDifferent = (oldNode: ReactElement, newNode: ReactElement): boolean => {
    if (oldNode.type !== newNode.type) return true;

    const oldChildren = oldNode.children || [];
    const newChildren = newNode.children || [];

    if (oldChildren.length !== newChildren.length) return true;

    // Compare props
    const oldProps = oldNode.props || {};
    const newProps = newNode.props || {};
    const oldPropsKeys = Object.keys(oldProps);
    const newPropsKeys = Object.keys(newProps);

    if (oldPropsKeys.length !== newPropsKeys.length) return true;

    for (const key of oldPropsKeys) {
        if (!isEqual(oldProps[key], newProps[key])) {
            console.log("Props are different", oldProps[key], newProps[key]);
            return true;
        }
    }

    for (let i = 0; i < oldChildren.length; i++) {
        const oldChild = oldChildren[i];
        const newChild = newChildren[i];

        if (typeof oldChild === "string" || typeof oldChild === "number") {
            if (oldChild !== newChild) return true;
        } else if (typeof oldChild === "object" && typeof newChild === "object") {
            if (isDifferent(oldChild, newChild)) return true;
        } else {
            return true;
        }
    }

    return false;
};

const updateArray = (
    oldNode: ReactNode[],
    newNode: ReactNode[],
    parent: Element | null,
    name: string
) => {
    for (let i = 0; i < Math.max(oldNode.length, newNode.length); i++) {
        const newChild = newNode[i] as VNode;
        const oldChild = oldNode[i] as VNode;
        const childRef = oldChild?.ref || newChild?.ref || null;

        update({
            oldNode: oldChild,
            newNode: newChild,
            ref: childRef,
            parent,
            index: i,
            name,
        });
    }
};

const updateUndefined = (
    oldNode: ReactNode,
    newNode: ReactNode,
    parent: Element | null,
    name: string,
    ref: Element | null
) => {
    if (oldNode === null || oldNode === undefined) {
        if (!parent) {
            console.warn("Cannot Create new now: Parent is null");
            return true;
        }

        // if (IS_DEVELOPMENT) console.log("Node is null ]", oldNode, newNode);
        mount({ vNode: newNode, parent: parent as HTMLElement, mode: "append", name });
        return true;
    }

    if (newNode === null || newNode === undefined) {
        // if (IS_DEVELOPMENT) console.log("[ New node is null ]", oldNode, newNode);

        unMountNode(oldNode);
        ref?.remove();
        return true;
    }

    return false;
};

const updateBoolean = async (
    oldNode: Exclude<ReactNode, undefined | null>,
    newNode: Exclude<ReactNode, undefined | null>,
    ref: Element | null,
    parent: Element | null,
    index: number,
    name: string
) => {
    if (typeof oldNode != "boolean" && typeof newNode != "boolean") return false;
    if (oldNode === newNode) return true;

    if (IS_DEVELOPMENT) console.log("[ Boolean difference ]", oldNode, newNode, ref);

    if (newNode === false) {
        unMountNode(oldNode);
        if (
            typeof oldNode != "object" ||
            (typeof oldNode === "object" && typeof oldNode.type !== "function")
        ) {
            ref?.remove();
        }
        return true;
    }

    if (!parent) {
        console.warn("Cannot Create new now: Parent is null");
        return true;
    }

    if (index - 1 < 0) {
       if (IS_DEVELOPMENT) console.log("Mounting first child", parent);
       mount({ vNode: newNode, parent: parent as HTMLElement, mode: "before", name });
       addToIndex++;
    } else {
        const previousChild = (parent.childNodes[index - 1] as HTMLElement) || parent.lastChild;
        if (IS_DEVELOPMENT) console.log("Mounting after previous child", index, prevNodeRef);
        prevNodeRef = await mount({ vNode: newNode, parent: prevNodeRef || previousChild, mode: "after", name });
    }

    return true;
};

const updatePrimitive = (
    oldNode: Exclude<ReactNode, undefined | null>,
    newNode: Exclude<ReactNode, undefined | null>,
    ref: Element | null
) => {
    if (
        !(typeof oldNode === "string" || typeof oldNode === "number") ||
        !(typeof newNode === "string" || typeof newNode === "number")
    ) {
        return false;
    }

    if (oldNode.toString() !== newNode.toString()) {
        ref!.textContent = newNode.toString();
    }

    return true;
};

const updateDifferentTypes = (
    oldNode: ReactElement,
    newNode: ReactElement,
    ref: Element | null,
    name: string
) => {
    if (typeof oldNode === typeof newNode) return false;
    if (IS_DEVELOPMENT) console.log("[ Type difference ]", typeof oldNode, typeof newNode);
    
    mount({ vNode: newNode, parent: ref!, mode: "replace", name });
    unMountNode(oldNode);
    return true;
};

const updateFunctionComponent = async (
    oldNode: ReactElement,
    newNode: ReactElement,
    ref: Element | null
) => {
    if (typeof newNode.type != "function" || typeof oldNode.type != "function") return false;

    // Compare props to check if function needs an update;
    const oldComponent = React.components.get(oldNode.componentName!);
    if (!oldComponent) {
        console.warn("Old component not found", oldNode, newNode);
        return true;
    }

    if (isDifferent(oldNode, newNode)) {
        oldComponent.isDirty = true;
    }

    const isDirty = oldNode.componentName && React.components.get(oldNode.componentName!)?.isDirty;
    if (!isDirty) {
        if (IS_DEVELOPMENT) {
            console.log("[ Function component ], no update necessary");
            console.log("Old node", oldNode);
            console.log("New node", newNode);
            console.log("[ Component ]", React.components.get(oldNode.componentName!));
        }
        return true;
    }

    const newComponent = newNode.type(newNode.props, ...newNode.children);
    newComponent.componentName = newNode.componentName;

    const componentName = typeof newComponent.type === "function" ? newComponent.type.name : "";

    if (IS_DEVELOPMENT) console.log("[ Function component ]", newComponent, oldComponent);
    
    React.currentComponent = oldComponent;
    React.currentComponent?.onUpdate();
    
    await update({
        oldNode: oldComponent?.vNode || oldNode,
        newNode: newComponent,
        ref: ref,
        parent: ref?.parentElement!,
        index: 0,
        name: componentName,
    });

    // TODO: if something doesn't work correctly, probably because of it
    if (oldComponent.vNode) {
        oldComponent.vNode.children = newComponent.children;
        oldComponent.vNode.componentName = componentName;
    }

    return true;
};

const updateDifferentObjectTypes = (
    oldNode: ReactElement,
    newNode: ReactElement,
    ref: Element | null,
    name: string
) => {
    if (oldNode.type === newNode.type) return false;
    if (IS_DEVELOPMENT) console.log("[ Element type difference ]", oldNode, newNode);

    mount({ vNode: newNode, parent: ref!, mode: "replace", name });
    unMountNode(oldNode);

    return true;
};

const updateElement = async (
    oldNode: ReactElement,
    newNode: ReactElement,
    ref: Element | null,
    name: string
) => {
    const oldProps = oldNode.props || {};
    const newProps = newNode.props || {};

    for (const [key, value] of Object.entries(newProps)) {
        if(oldProps[key] === value) continue;
        setProps({ ref: ref!, key, value });
    }

    for (const key of Object.keys(oldProps)) {
        if (!(key in newProps)) {
            removeProp({ ref: ref!, key });
        }
    }

    newNode.ref = ref;

    let realIndex = 0;
    if (Array.isArray(oldNode.children) && Array.isArray(newNode.children)) {
        for (let i = 0; i < Math.max(oldNode.children.length, newNode.children.length); i++) {
            const newChild = newNode.children[i];
            const oldChild = oldNode.children[i];
            
            const childRef =
                oldChild?.ref ||
                newChild?.ref ||
                (oldNode.ref?.childNodes[realIndex] as HTMLElement | null);

            if (newChild && oldChild) {
                realIndex++;
                prevNodeRef = childRef;
            }

            await update({
                oldNode: oldChild,
                newNode: newChild,
                ref: childRef,
                parent: ref,
                index: realIndex,
                name,
            });
        }
    }

    return true;
};

/*
 * Updates a VNode and it's children in the DOM and components list.
 * @param {UpdateProps} props - The properties for the update.
 * @param {ReactNode} props.oldNode - The old VNode to update.
 * @param {ReactNode} props.newNode - The new VNode to update to.
 * @param {Element | null} props.ref - The reference to the DOM element.
 * @param {Element | null} props.parent - The parent element to append to.
 * @param {number} props.index - The index of the child in the parent.
 * @param {string} props.name - The name of the component.
 */

export async function update(props: UpdateProps) {
    let { oldNode, newNode, ref, parent, index, name } = props;

    // Step 1
    if (Array.isArray(oldNode) && Array.isArray(newNode))
        return updateArray(oldNode, newNode, parent, name);

    // Step 2
    if (updateUndefined(oldNode, newNode, parent, name, ref)) return;

    oldNode = oldNode as Exclude<ReactElement, undefined | null>;
    newNode = newNode as Exclude<ReactElement, undefined | null>;

    // Step 3
    if (await updateBoolean(oldNode, newNode, ref, parent, index, name)) return;

    oldNode = oldNode as Exclude<ReactElement, undefined | null | boolean>;
    newNode = newNode as Exclude<ReactElement, undefined | null | boolean>;

    // Step 4
    if (updatePrimitive(oldNode, newNode, ref)) return;

    // Step 5
    if (updateDifferentTypes(oldNode, newNode, ref, name)) return;

    oldNode = oldNode as ReactElement;
    newNode = newNode as ReactElement;
    if (oldNode.componentName) newNode.componentName = oldNode.componentName;

    // Step 6
    if (await updateFunctionComponent(oldNode, newNode, ref)) return;

    // Step 7
    if (updateDifferentObjectTypes(oldNode, newNode, ref, name)) return;

    // Step 8
    await updateElement(oldNode, newNode, ref, name);

    prevNodeRef = ref;
}
