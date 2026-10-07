export type QingkuaiTheme = "dark" | "light"

export const THEME_STORAGE_KEY = "qingkuai-theme"

export function getInitialTheme(): QingkuaiTheme {
    return typeof localStorage !== "undefined" &&
        localStorage.getItem(THEME_STORAGE_KEY) === "light"
        ? "light"
        : "dark"
}
