import React, { IS_DEVELOPMENT } from "react";
import { updateSchedule } from "react/render/updateSchedule";



// useState implementation
export function useStateHook<T>(initialState: T): [T, (value: T | ((prevState: T) => T)) => void] {
    const component = React.currentComponent;

    if (!component) {
        throw new Error("useState must be called within a component");
    }
    
    let hook = component.hooks[component.hookIndex];
    
    if (!hook) {
        hook = {
            memoizedState: initialState,
            queue: [],
            type: 'state'
        };
        
        component.hooks.push(hook);
    }
    
    component.hookIndex++;

    const setState = (newValue: T | ((prevState: T) => T)) => {
        // Push the new state update to the queue
        hook!.queue.push((prevState: T) => {
            if (typeof newValue === 'function') {
                return (newValue as (prev: T) => T)(prevState);
            }
            return newValue;
        });
        
        // Only schedule the update once
        if (!component.isDirty) {
            if(IS_DEVELOPMENT) console.log("Component is dirty:", component.name);
            component.isDirty = true;
            updateSchedule(component, component.hooks);
        }
    };
    
    return [hook.memoizedState, setState] as [T, (value: T | ((prevState: T) => T)) => void];
}
