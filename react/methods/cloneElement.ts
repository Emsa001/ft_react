import React from "react";

export const cloneElementMethod = (
    element: ReactElement,
    props: Record<string, unknown>,
    ...children: ReactElement[]
) => {
    if (!React.isValidElement(element)) {
        throw new Error("Invalid React element");
    }

    const mergedProps = { ...element.props, ...props };

    return {
        ...element,
        props: mergedProps,
        children: [...(element.children || []), ...children],
    } as ReactElement;

}