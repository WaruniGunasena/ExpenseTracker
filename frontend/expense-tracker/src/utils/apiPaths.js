export const BASE_URL = "http://localhost:8000";

//utils/apiPaths.js
export const API_PATHS = {
    AUTH: {
        LOGIN: "/api/vl/auth/login",
        REGISTER: "/api/vl/auth/register",
        GET_USER_INFO: "/api/vl/auth/getUser",
    },
    DASHBOARD: {
        GET_DATA: "/api/vl/dashboard",
    },
    INCOME: {
        ADD_INCOME: "/api/vl/income/add",
        GET_ALL_INCOME: "/api/vl/income/get",
        DELETE_INCOME: (incomeId) => `/api/vl/income/${incomeId}`,
        DOWNLOAD_INCOME: `/api/vl/income/downloadEcel`,
    },
    EXPENSE: {
        ADD_EXPENSE: "/api/vl/expense/add",
        GET_ALL_EXPENSE: "/api/vl/expense/get",
        DELETE_EXPENSE: (expenseId) => `/api/vl/expense/${expenseId}`,
        DOWNLOAD_EXPENSE: `/api/vl/expense/downloadEcel`,
    },
    IMAGE: {
        UPLOAD_IMAGE: "/api/vl/auth/upload-image",
    },
};