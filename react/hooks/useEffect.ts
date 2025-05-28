import React from "..";

const checkDependenciesChanged = (prevDeps: TDependencyList, deps: TDependencyList): boolean => {
    if (prevDeps.length !== deps.length) {
        console.warn("The length of the dependencies array must remain consistent between renders.");
    }
    return deps.some((dep, index) => !Object.is(dep, prevDeps[index]));
};

/*

    useEffect is a hook that allows you to perform side effects in function components.
    It takes two arguments:
    1. A callback function that contains the side effect logic.
    2. An optional dependencies array that determines when the effect should run.
    
    The effect will run after the component renders, and it can return a cleanup function
    that will be called before the component unmounts or before the effect runs again.

*/

export function useEffectHook(callback: TEffectCallback, deps?: TDependencyList): void {
    const component = React.currentComponent;
    if (!component) {
        throw new Error("useEffect must be called inside a component render function");
    }

    const prevDeps = React.useRef<TDependencyList | undefined>(undefined);
    const cleanupRef = React.useRef<(() => void) | undefined>(undefined);
    const isFirstRender = React.useRef(true);

    const runEffect = () => setTimeout(() => {
        if (typeof cleanupRef.current === "function") {
            try {
                cleanupRef.current();
            } catch (err) {
                console.error("Error running cleanup:", err);
            }
            component.queueFunctions.delete(cleanupRef.current);
        }

        let cleanup: void | (() => void);
        try {
            cleanup = callback();
        } catch (err) {
            console.error("useEffectHook callback threw:", err);
            cleanup = undefined;
        }

        if (typeof cleanup === "function") {
            cleanupRef.current = cleanup;
            component.queueFunctions.add(cleanup);
        } else {
            cleanupRef.current = undefined;
        }
    }, 0);

    if (isFirstRender.current) {
        isFirstRender.current = false;
        runEffect();
    } else if (!deps || !prevDeps.current || checkDependenciesChanged(prevDeps.current, deps)) {
        runEffect();
    }

    prevDeps.current = deps;
}
