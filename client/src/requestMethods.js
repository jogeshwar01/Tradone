import axios from "axios";

const BASE_URL = "http://localhost:5000/api/";
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyOGEwZDRmNjJkZTAzMDQ4OTZhZDg4MiIsImlzQWRtaW4iOnRydWUsImlhdCI6MTY1NzYxNDIzNiwiZXhwIjoxNjU3ODczNDM2fQ.zO5-q19UGBGkzQJXPh9NKP9AwNAPW-z9GwDURrYK_7A";

export const publicRequest = axios.create({
    baseURL: BASE_URL,
});

export const userRequest = axios.create({
    baseURL: BASE_URL,
    header: { token: `Bearer ${TOKEN}` },
});