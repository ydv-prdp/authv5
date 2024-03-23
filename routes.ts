export const publicRoutes = [
    "/",
    "/auth/new-verification"

]

//These routes will redirect logged in users to /settings
export const authRoutes = [
    "/auth/login",
    "/auth/register",
    "/auth/error",
    "/auth/reset",
    "/auth/new-password"
]

//API authentication purposes
export const apiAuthPrefix = "/api/auth"


export const DEFAULT_LOGIN_REDIRECT = "/settings";