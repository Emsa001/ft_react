import React from "..";

export const useNavigateHook = () => {
    const navigate = async (path: string, ...states: any): Promise<void> => {
        React.setNavigating(true);

        setTimeout(() => {
            window.history.pushState(states, "", path);
            window.dispatchEvent(new Event("popstate"));
            
            setTimeout(() => {
                window.scrollTo({ top: 0, behavior: "instant" });
            }, 0);

            React.setNavigating(false);
        }, 0);
    };

    return navigate;
};
