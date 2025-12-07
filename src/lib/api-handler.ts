interface ApiClientOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: unknown;
  headers?: Record<string, string>;
}
interface UserDataResponse {
  message?: string;
  user?: {
    username: string;
    userEmail: string;
    password: string;
    confirmPassword: string;
  };
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = "/api") {
    this.baseURL = baseURL;
  }

  async fetch<T = unknown>(
    endpoint: string,
    options: ApiClientOptions = {}
  ): Promise<T> {
    const { method = "GET", body, headers = {} } = options;

    const defaultHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      ...headers,
    };

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method,
      headers: defaultHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json() as Promise<T>;
  }

  async getUser(userEmail: string): Promise<UserDataResponse> {
    return this.fetch(`/user/${encodeURIComponent(userEmail)}`);
  }

  async registerUser(
    userData: UserDataResponse["user"]
  ): Promise<UserDataResponse> {
    return this.fetch("/user", {
      method: "POST",
      body: userData,
    });
  }

}

export const apiClient = new ApiClient();
