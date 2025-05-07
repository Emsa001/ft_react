import { useStateHook } from "./useState";

export function useRefHook<T>(initialValue: T) {
    return useStateHook({ current: initialValue })[0];
};