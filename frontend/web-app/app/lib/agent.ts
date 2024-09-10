import { auth, UserSchema } from "@/auth";
import { FieldValue, FieldValues } from "react-hook-form";

const baseUrl = process.env.APP_API_URL || "http://localhost:8080/api";

function buildUrl(url: string) {
  return `${baseUrl}/${url}`;
}

async function get(url: string) {
  const requestOptions = {
    method: "GET",
    headers: await getHeaders(),
  };

  const response = await fetch(buildUrl(url), requestOptions);

  return handleResponse(response);
}

async function post(url: string, body: {}) {
  const requestOptions = {
    method: "POST",
    headers: await getHeaders(),
    body: JSON.stringify(body),
  };

  const response = await fetch(buildUrl(url), requestOptions);

  return handleResponse(response);
}

async function patch(url: string, body: {}) {
  const requestOptions = {
    method: "PATCH",
    headers: await getHeaders(),
    body: JSON.stringify(body),
  };

  const response = await fetch(buildUrl(url), requestOptions);

  return handleResponse(response);
}

async function del(url: string) {
  const requestOptions = {
    method: "DELETE",
    headers: await getHeaders(),
  };

  const response = await fetch(buildUrl(url), requestOptions);

  return handleResponse(response);
}

async function getHeaders() {
  const session = await auth();
  const headers = {
    "Content-Type": "application/json",
  } as any;
  if (session?.accessToken) {
    headers.Authorization = `Bearer ${session.accessToken}`;
  }
  return headers;
}

export interface ErrorResponse {
  error: {
    status: string;
    message: string;
  };
}

async function handleResponse(response: Response) {
  try {
    const text = await response.text();
    const data = text && JSON.parse(text);

    if (response.ok) {
      return data || response.statusText;
    }

    const error = {
      status: response.status,
      message: response.statusText,
    };

    return {
      error,
    };
  } catch (error: any) {
    return {
      error,
    };
  }
}

const Auctions = {
  show: (id: number | string) => get(`auctions/${id}`),
  create: (data: FieldValues) => post("auctions", data),
  update: (id: number | string, data: FieldValues) =>
    patch(`auctions/${id}`, data),
  delete: (id: number | string) => del(`auctions/${id}`),
};

const Auth = {
  login: (body: UserSchema) => post("auth/login", body),
  refreshToken: (token: string) => post("auth/refresh-token", { token }),
};

const agent = {
  get,
  post,
  patch,
  del,
  Auctions,
  Auth,
};

export default agent;
