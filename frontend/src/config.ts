type AppConfig = {
    apiUrl: string,
    dateFormat: Intl.DateTimeFormatOptions,
    version: string
};

const config: AppConfig = {
    apiUrl: "/api",
    dateFormat: {year: "numeric", month: "2-digit", day: "numeric", hour: "2-digit", minute: "2-digit"},
    version: "v2.0.0-centiria"
};

export default config;