// types.ts
export type HookType = 'state' | 'effect' | 'memo' | 'ref';

export interface Hook {
    memoizedState: any;
    queue: Array<Function>;
    type: HookType;
}

export interface Context {
    _currentValue: any;
    _defaultValue: any;
    _calledByProvider: boolean;
    subscriptions: Set<ReactComponentInstance>;
    _currentProvider: ReactComponentInstance | null;

    Provider: (props: { value?: any; children?: any }) => any;
}

export interface ReactComponentInstance {
    name: string;
    isMounted: boolean;
    isDirty: boolean;

    hooks: Hook[];
    hookIndex: number;

    vNode: VNode | null;
    jsx: VNode | null;

    queueFunctions: Set<() => void>;

    // Lifecycle
    onMount(): void;
    onUnmount(): void;
    onUpdate(): void;
}

export interface VDomManager {
    rootDom: Element | null;

    components: Map<string, ReactComponentInstance>;
    currentComponent: ReactComponentInstance | null;
}

export interface RouterProps {
    src: string;
    component: ReactElement;
    default?: boolean;
}

export type MountMode = "append" | "replace" | "before" | "after" | "create-only";

export interface MountProps {
    vNode: ReactNode;
    parent: Element;
    mode?: MountMode;
    name: string;
    isSvg?: boolean;
}

export interface UpdateProps {
    oldNode: ReactNode;
    newNode: ReactNode;
    ref: Element | null;
    parent: Element | null;
    index: number;
    name: string;
}


export type LinkTarget = "_blank" | "_self" | "_parent" | "_top";
export type LinkMethodProps = {
    to: string;
    target?: LinkTarget;
    state?: any;
    className?: string;
    children?: ReactElement | ReactElement[];
};
