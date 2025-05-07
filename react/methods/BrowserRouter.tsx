import React, { RouterProps, useNavigate } from "react";

export function RouterMethod(props: RouterProps) {
    const { src, component } = props;
    const path = window.location.pathname;

    if (path !== src) return null;

    return component;
}

export function BrowserRouterMethod(props: { children?: ReactElement[] }) {
    const { children } = props;

    let defaultRoute = null;

    for (const child of children as any) {
        if (child && child.props && child.props.component) {
            if (window.location.pathname === child.props.src) {
                return child.props.component;
            }

            if (child.props.default) {
                defaultRoute = child.props.component;
            }
        }
    }

    if (defaultRoute) {
        return defaultRoute;
    }

    return null;
}

type LinkMethodProps = {
    to: string;
    state?: any;
    children?: ReactElement | ReactElement[];
};

export const LinkMethod = ({ to, state, children }: LinkMethodProps) => {
    const navigate = useNavigate();

    const handleClick = (e: MouseEvent) => {
        e.preventDefault();
        navigate(to, { ...state });
    };

    return (
        <a href={to} onClick={handleClick}>
            {children}
        </a>
    );
};
