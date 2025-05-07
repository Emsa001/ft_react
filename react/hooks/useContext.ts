import { Context } from "vm";
import React from "..";

export function useContextHook(context: Context) {
    context.subscriptions.add(React.currentComponent!);

    return context._currentValue;
}
