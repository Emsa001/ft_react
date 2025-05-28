import React, { LinkMethodProps, RouterProps, useNavigate } from "react";

function matchPath(pattern: string, path: string): boolean {
    const patternParts = pattern.split("/").filter(Boolean);
    const pathParts = path.split("/").filter(Boolean);

    for (let i = 0; i < patternParts.length; i++) {
        const patternPart = patternParts[i];
        const pathPart = pathParts[i];

        const isOptional = patternPart.endsWith("?");
        const isParam = patternPart.startsWith(":");

        if (!pathPart) {
            if (isOptional) continue;
            return false;
        }

        if (isParam) continue;
        if (patternPart !== pathPart) return false;
    }

    return pathParts.length <= patternParts.length;
}

function extractParams(pattern: string, path: string): Record<string, string | undefined> {
    const params: Record<string, string | undefined> = {};
    const patternParts = pattern.split("/").filter(Boolean);
    const pathParts = path.split("/").filter(Boolean);

    for (let i = 0; i < patternParts.length; i++) {
        const patternPart = patternParts[i];
        const isOptional = patternPart.endsWith("?");
        const isParam = patternPart.startsWith(":");

        if (isParam) {
            const paramName = isOptional ? patternPart.slice(1, -1) : patternPart.slice(1);

            params[paramName] = pathParts[i];
        }
    }

    return params;
}

export function RouterMethod(props: RouterProps) {
    const { src, component } = props;
    const path = window.location.pathname;

    if (matchPath(src, path)) {
        const params = extractParams(src, path);
        return React.cloneElement(component, { ...params });
    }

    return null;
}

export function BrowserRouterMethod(props: { children?: ReactElement[] }) {
    const { children } = props;

    let defaultRoute = null;
    const currentPath = window.location.pathname;

    for (const child of children as any) {
        if (child && child.props && child.props.component) {
            const routePath = child.props.src;

            if (matchPath(routePath, currentPath)) {
                return child;
            }

            if (child.props.default) {
                defaultRoute = child;
            }
        }
    }

    return defaultRoute || null;
}

export const LinkMethod = ({
    to,
    target = "_self",
    state,
    className,
    children,
}: LinkMethodProps) => {
    const navigate = useNavigate();

    const handleClick = (e: MouseEvent) => {
        if (
            !to ||
            to.startsWith("#") ||
            to.startsWith("http") ||
            to.startsWith("mailto:") ||
            to.startsWith("tel:") ||
            to.startsWith("javascript:") ||
            (target && target !== "_self")
        ) {
            return;
        }

        if (to === window.location.pathname) {
            e.preventDefault();
            return;
        }

        e.preventDefault();
        navigate(to, { ...state });
    };

    return (
        <a href={to} target={target} onClick={handleClick} className={className}>
            {children}
        </a>
    );
};
