import axios, { AxiosError, AxiosResponse } from "axios";
import { LoginRequestDto } from "./models/login/login-request.dto";
import { LoginResponseDto } from "./models/login/login-response.dto";

axios.defaults.baseURL = process.env.APP_API_URL;
axios.defaults.withCredentials = true;

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const requests = {
  get: <T>(url: string, params?: URLSearchParams) =>
    axios.get(url, { params }).then(responseBody<T>),
  post: <T>(url: string, body: object) =>
    axios.post(url, body).then(responseBody<T>),
  put: <T>(url: string, body: object) =>
    axios.put(url, body).then(responseBody<T>),
  patch: <T>(url: string, body: object) =>
    axios.patch(url, body).then(responseBody<T>),
  delete: <T>(url: string) => axios.delete(url).then(responseBody<T>),
};

const Auth = {
  login: (body: LoginRequestDto) =>
    requests.post<LoginResponseDto>("auth/login", body),
};

const agent = {
  Auth,
};
export default agent;
