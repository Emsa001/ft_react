import React, { MountMode, MountProps } from "react";
import { addToDom } from "./utils";
import { setProps } from "./props";

/* ================= */

const isNullOrUndefined = (vNode: ReactNode): boolean =>
    vNode === null || typeof vNode === "undefined";

const isPrimitive = (vNode: ReactNode): boolean =>
    typeof vNode === "string" || typeof vNode === "number";

const mountArrayVNode = (
    vNodes: ReactNode[],
    parent: Element,
    name: string,
    isSvg?: boolean
): Element => {
    for (const child of vNodes) mount({ vNode: child, parent, name, isSvg });
    return parent;
};

const mountPrimitive = (vNode: string | number, parent: Element, mode: MountMode): Element => {
    const textNode = document.createTextNode(vNode.toString());
    addToDom(textNode, parent, mode);
    return parent;
};

const mountBooleanVNode = (vNode: boolean, parent: Element): Element => {
    if (vNode === false) parent.remove();
    return parent;
};

/* ================= */

const mountComponentVNode = async (
    vNode: VNode,
    parent: Element,
    mode: MountMode,
    isSvg?: boolean
): Promise<Element | null> => {
    const component = React.createComponentInstance(vNode);

    React.components.set(component.name, component);
    React.currentComponent = component;

    component.vNode = (vNode.type as ComponentType)(vNode.props, ...vNode.children);
    if (component.vNode === null) return null;
    if (!component.vNode.type) component.vNode!.type = "div";

    component.vNode.componentName = component.name;
    component.isMounted = true;
    component.onMount();

    const newRef = await mount({
        vNode: component.vNode,
        parent,
        name: component.name,
        mode,
        isSvg,
    });

    component.vNode.ref = newRef as HTMLElement | null;

    return newRef;
};

const mountElementVNode = (
    vNode: ReactElement,
    parent: Element,
    name: string,
    mode: MountMode,
    isSvg?: boolean
): Element => {
    const nextIsSvg = vNode.type === "svg" || isSvg;
    const dom = nextIsSvg
        ? document.createElementNS("http://www.w3.org/2000/svg", vNode.type as string)
        : document.createElement(vNode.type as string);

    vNode.ref = dom;

    for (const [key, value] of Object.entries(vNode.props)) {
        setProps({ ref: dom, key, value });
    }

    for (const child of vNode.children) {
        mount({ vNode: child, parent: dom, name, isSvg: nextIsSvg });
    }

    addToDom(dom, parent, mode);
    return dom;
};

/*
 * Unmounts a VNode and it's children from the DOM and components list.
 * @param {ReactNode} node - The VNode to unmount.
 */

export const unMountNode = (node: ReactNode) => {
    if (node === null || typeof node === "undefined") return;
    if (typeof node === "string" || typeof node === "number" || typeof node === "boolean") return;

    if (Array.isArray(node)) {
        for (const child of node) {
            unMountNode(child);
        }
        return;
    }

    if (typeof node.type === "function") {
        if (!node.componentName) {
            console.warn("Tried to unmount component but it's name is not defined");
            return;
        }
        React.components.get(node.componentName)?.onUnmount();
    }

    for (const child of node.children) {
        if (Array.isArray(child)) {
            for (const nestedChild of child) {
                unMountNode(nestedChild);
            }
        } else {
            unMountNode(child);
        }
    }
};

/*
 * Mounts a VNode to the DOM.
 * @param {MountProps} props - The properties for mounting.
 * @returns {Promise<Element | null>} - The mounted DOM element or null.
 */

export async function mount(props: MountProps): Promise<Element | null> {
    const { vNode, parent, name, mode = "append", isSvg } = props;

    if (isNullOrUndefined(vNode))
        return parent;

    if (Array.isArray(vNode))
        return mountArrayVNode(vNode, parent, name, isSvg);

    if (isPrimitive(vNode))
        return mountPrimitive(vNode as string | number, parent, mode);

    if (typeof vNode === "boolean")
        return mountBooleanVNode(vNode, parent);

    if (typeof (vNode as VNode).type === "function")
        return await mountComponentVNode(vNode as ReactElement, parent, mode, isSvg);

    return mountElementVNode(vNode as ReactElement, parent, name, mode, isSvg);
}
