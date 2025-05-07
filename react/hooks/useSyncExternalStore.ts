import React from "..";

export function useSyncExternalStoreMethod<T>(
    subscribe: (onStoreChange: () => void) => () => void,
    getSnapshot: () => T,
): T {
    const [state, setState] = React.useState(getSnapshot());
    const isMounted = React.useRef(false);

    React.useEffect(() => {
        isMounted.current = true;
        const checkForUpdates = () => {
            if (isMounted.current) {
                setState(getSnapshot);
            }
        };
        const unsubscribe = subscribe(checkForUpdates);
        return () => {
            isMounted.current = false;
            unsubscribe();
        };
    }, [subscribe, getSnapshot]);

    return state as T;
}
