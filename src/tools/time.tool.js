export const getCurrentTime = () => {
    return {
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
};
//# sourceMappingURL=time.tool.js.map