export function createElementMethod(type: string | ComponentType, props: Props = {}, ...children: VNode[]): VNode {
    const { key = null, ...restProps } = props || {};

    const finalProps = {
        ...restProps,
        children,
    };

    return {
        type,
        props: finalProps,
        children,
        ref: null,
        key,
    };
}