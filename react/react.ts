import { Props, ReactElement } from "./types";

const React = {
    contexts: new Map(),
    
    createElement: (tag: string | ((props: Props, ...children: any[]) => ReactElement), props: Props, ...children: any[]): ReactElement => {

        const el: ReactElement = {
            tag,
            props,
            children,
        };

        return el;
    },

    createContext<T>(defaultValue: T) {
        const context = {
            _currentValue: defaultValue,
            _defaultValue: defaultValue,
            _calledByProvider: false,
            Provider: ({ value, children }: { value?: T; children?: any }) => {
                context._currentValue = value !== undefined ? value : context._defaultValue;
                context._calledByProvider = true;
                return children;
            },
        };
        return context;
    },

    useContext<T>(context: { _currentValue: T }): T {
        return context._currentValue;
    },
};

export default React;
export const createContext = React.createContext;
export const useContext = React.useContext;
export * from "./hooks";