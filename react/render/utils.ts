import { MountMode } from "react/types";

export function addToDom(dom: Element | Text, parent: Element | null, mode: MountMode){
    if(!parent){
        throw new Error("Parent is null");
    }

    if (mode === "replace") {
        parent.replaceWith(dom);
    } else if (mode === "before") {
        parent.insertBefore(dom, parent.firstChild);
    } else if (mode === "after") {
        parent.after(dom);
    } else {
        parent.appendChild(dom);
    }
}
