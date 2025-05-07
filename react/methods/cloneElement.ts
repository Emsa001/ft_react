import React from "react";

export const cloneElementMethod = (
    element: ReactElement,
    props: Record<string, unknown>,
    ...children: ReactElement[]
) => {
    // Check if the element is a valid React element
    if (!React.isValidElement(element)) {
        throw new Error("Invalid React element");
    }

    // Merge the new props with the existing props
    const mergedProps = { ...element.props, ...props };

    // Clone the element with the new props and children
    return {
        ...element,
        props: mergedProps,
        children: [...(element.children || []), ...children],
    } as ReactElement;

}