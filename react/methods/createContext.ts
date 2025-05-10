import { Context, ReactComponentInstance } from "react/types";

export function createContextMethod<T>(defaultValue: T) {
    const context: Context = {
        _currentValue: defaultValue,
        _defaultValue: defaultValue,
        _calledByProvider: false,
        subscriptions: new Set<ReactComponentInstance>(),
        _currentProvider: null,
        Provider: ({ value, children }: { value?: T; children?: any }) => {
            context._currentValue = value !== undefined ? value : context._defaultValue;
            context._calledByProvider = true;
           
            context.subscriptions.forEach((instance: ReactComponentInstance) => {
                if (instance.isMounted) {
                    instance.isDirty = true;
                }
            });

            return children;
        },
    };
    return context;
}
