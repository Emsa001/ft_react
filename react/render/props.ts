export function setProps({ ref, key, value }: { ref: Element | null; key: string; value: any }): void {
    if (!ref || key === "children") return;

    if (key === "style" && typeof value === "object") {
        Object.assign((ref as HTMLElement).style, value);
        return;
    }

    if (key === "ref") {
        value.current = ref;
        return;
    }

    if (key === "onChange" && ref instanceof HTMLInputElement) {
        ref.removeEventListener("input", (ref as any)._onChangeListener);
        ref.addEventListener("input", value);
        (ref as any)._onChangeListener = value;
        return;
    }

    if (key.startsWith("on") && typeof value === "function") {
        const eventName = key.slice(2).toLowerCase();
        ref.removeEventListener(eventName, (ref as any)[key]);
        ref.addEventListener(eventName, value);
        (ref as any)[key] = value;
        return;
    }

    if (key === "className") {
        ref.setAttribute("class", value);
        return;
    }

    if (key === "dangerouslySetInnerHTML") {
        const { __html } = value;
        if (typeof __html === "string") {
            (ref as HTMLElement).innerHTML = __html;
        }
        return;
    }

    if(key === "value" && ref instanceof HTMLInputElement) {
        ref.value = value;
        return;
    }

    if (key in ref && Object.getOwnPropertyDescriptor(ref, key)?.set === undefined) {
        ref.setAttribute(key, value);
        return;
    }

    try {
        (ref as any)[key] = value;
        ref.setAttribute(key, value);
    } catch {
        // Ignore errors when setting properties that are not valid attributes
        // This is common for custom components or certain DOM properties
    }
}

export function removeProp({ ref, key }: { ref: Element; key: string }): void {
    if (key === "style") {
        ref.removeAttribute("style");
        return;
    }

    if (key.startsWith("on") && typeof (ref as any)[key] === "function") {
        const eventName = key.slice(2).toLowerCase();
        ref.removeEventListener(eventName, (ref as any)[key]);
        delete (ref as any)[key];
        return;
    }

    if (key === "children") return;
    if(key === "className"){
        ref.removeAttribute("class");
        return;
    }

    delete (ref as any)[key];
}