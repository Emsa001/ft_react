export const useNavigateHook = () => {
    const navigate = (path: string, ...states: any) => {
        window.history.pushState(states, "", path);
        window.dispatchEvent(new Event("popstate"));
        setTimeout(() => window.scrollTo({ top: 0 }), 0);
    };

    return navigate;
}