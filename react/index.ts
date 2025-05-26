import { Hook, LinkMethodProps, ReactComponentInstance, RouterProps } from "./types";

import { isValidElementMethod } from "./methods/isValidElement";
import { cloneElementMethod } from "./methods/cloneElement";
import { createContextMethod } from "./methods/createContext";
import { createComponentInstanceMethod } from "./methods/createComponentInstance";
import { renderComponentMethod, renderMethod } from "./render/render";
import { createElementMethod } from "./methods/createElement";
import { BrowserRouterMethod, LinkMethod, RouterMethod } from "./methods/BrowserRouter";

import { useStateHook } from "./hooks/useState";
import { useEffectHook } from "./hooks/useEffect";
import { useStaticHook } from "./hooks/useStatic";
import { useRefHook } from "./hooks/useRef";
import { useContextHook } from "./hooks/useContext";
import { useNavigateHook } from "./hooks/useNavigate";

import "./render/hot";
import { useSyncExternalStoreMethod } from "./hooks/useSyncExternalStore";
import { useLocalStorageHook } from "./hooks/useLocalStorage";

class FtReact {
    isFirstRender: boolean = true;
    rootDom: Element | null = null;
    components: Map<string, ReactComponentInstance> = new Map();
    currentComponent: ReactComponentInstance | null = null;

    staticStates: Map<string, Hook> = new Map();
    staticComponents: Map<string, string[]> = new Map();

    /*
     * Methods
     */

    createElement = (
        type: string | ComponentType,
        props: Props = {},
        ...children: VNode[]
    ): VNode => createElementMethod(type, props, ...children);
    cloneElement = (
        element: ReactElement,
        props: Record<string, unknown>,
        ...children: ReactElement[]
    ) => cloneElementMethod(element, props, ...children);
    isValidElement = (object: unknown): object is ReactElement => isValidElementMethod(object);

    createContext = <T>(defaultValue: T) => createContextMethod(defaultValue);
    createComponentInstance = (element: ReactElement): ReactComponentInstance =>
        createComponentInstanceMethod(element);

    renderComponent = (element: ReactElement): ReactComponentInstance =>
        renderComponentMethod(element);
    render = async (element: ReactElement, container: HTMLElement): Promise<void> =>
        renderMethod(element, container);

    BrowserRouter = (props: { children?: ReactElement[] }) => BrowserRouterMethod(props);
    Router = (props: RouterProps) => RouterMethod(props);
    Link = (props: LinkMethodProps) => LinkMethod(props);

    /*
     * Hooks
     */

    useState = <T>(initialState: T) => useStateHook(initialState);
    useStatic = <T>(name: string, initialState?: T) => useStaticHook(name, initialState);
    useEffect = (callback: () => void, deps?: any[]) => useEffectHook(callback, deps);
    useRef = <T>(initialValue: T) => useRefHook(initialValue);
    useContext = (context: any) => useContextHook(context);
    useNavigate = () => useNavigateHook();
    useSyncExternalStore = <T>(
        subscribe: (onStoreChange: () => void) => () => void,
        getSnapshot: () => T
    ) => useSyncExternalStoreMethod(subscribe, getSnapshot);
    useLocalStorage = (key: string, initialValue?: any) => useLocalStorageHook(key, initialValue);

    /*
     * Custom Methods
     */

    setTitle = (title: string) => {
        document.title = title;
    };
}

const React = new FtReact();

/*
 * Methods
 */

export const createElement = React.createElement;
export const cloneElement = React.cloneElement;
export const isValidElement = React.isValidElement;
export const createContext = React.createContext;
export const BrowserRouter = React.BrowserRouter;
export const Router = React.Router;
export const Link = React.Link;

/*
 * Hooks
 */

export const useState = React.useState;
export const useEffect = React.useEffect;
export const useStatic = React.useStatic;
export const useRef = React.useRef;
export const useContext = React.useContext;
export const useNavigate = React.useNavigate;
export const useSyncExternalStore = React.useSyncExternalStore;
export const useLocalStorage = React.useLocalStorage;

/*
 * Custom Methods
 */

export const setTitle = React.setTitle;
/* ========================================================== */

export * from "./types";
export const IS_DEVELOPMENT = false;
export default React;
