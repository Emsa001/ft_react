import React, { IS_DEVELOPMENT } from "react";
import { processQueue, updateSchedule } from "react/render/updateSchedule";

export function useStaticHook<T>(name: string, initialState?: T): [T, (value: T | ((prevState: T) => T)) => void] {
    const component = React.currentComponent;

    if (!component) {
        throw new Error("useStatic must be called within a component");
    }
    
    let hook = React.staticStates.get(name);
    
    if (!hook) {
        hook = {
            memoizedState: initialState,
            queue: [],
        };
        React.staticStates.set(name, hook);
    }

    if (!React.staticComponents.has(name)) {
        React.staticComponents.set(name, []);
    }

    const staticComponents = React.staticComponents.get(name)!;
    if (!staticComponents.includes(component.name)) {
        staticComponents.push(component.name);
        if(IS_DEVELOPMENT) console.log("Adding static component:", component.name, "to staticStates:", name);
    }
    
    const setState = (newValue: T | ((prevState: T) => T)) => {
        if(!staticComponents) {
            console.warn("Tried to set state on a static component that doesn't exist");
            return ;
        }

        hook!.queue.push((prevState: T) => {
            if (typeof newValue === 'function') {
                return (newValue as (prev: T) => T)(prevState);
            }
            return newValue;
        });
        processQueue(hook);
        
        staticComponents.forEach((comp) => {
            const compInstance = React.components.get(comp);
            if(!compInstance) {
                console.warn("Tried to set state on a static component that doesn't exist, probably component was unmounted and not unsubscribed from the static state. After this message, the component will be removed from the staticStates");
                React.staticComponents.delete(comp);
            }else{
                if (!compInstance.isDirty) {
                    compInstance.isDirty = true;
                    updateSchedule(compInstance, []);
                }
            }
        })    
    };

    return [hook.memoizedState, setState] as [T, (value: T | ((prevState: T) => T)) => void];
}

