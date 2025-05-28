import React from 'react';

export function useRefHook<T>(initialValue: T) {
    return React.useState({ current: initialValue })[0];
};