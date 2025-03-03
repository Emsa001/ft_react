export type Props = { [key: string]: any };

export type ReactElement = {
    tag: string | ((props: Props, ...children: any[]) => ReactElement);
    props: Props;
    children: any[];
    dom: HTMLElement | null;
};

export type TCleanupCallback = () => void;
export type TEffectCallback = () => TCleanupCallback | void;
export type TDependencyList = readonly unknown[];

export interface FC<P = {}> {
    (props: P & { children?: any }): ReactElement | null;
}

export interface IReactUpdate {
    newEl: ReactElement | ReactElement[] | string;
    previous: ReactElement | ReactElement[] | string;
    dom?: HTMLElement | null;
    childIndex?: number;
}

export interface IReactMount {
    el: ReactElement | ReactElement[] | string;
    container: HTMLElement;
    mode?: "replace" | "append";
}

export interface IReactSetProps {
    dom: HTMLElement;
    el: ReactElement;
    prop: string;
}

export interface ElementProps {
    children?: React.ReactNode;
    params?: Record<string, string | undefined>;
}