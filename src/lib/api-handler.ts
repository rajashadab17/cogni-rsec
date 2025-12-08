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

  async Prompt(content: string, Model: string): Promise<Response> {
    return fetch(`${this.baseURL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [{ role: "user", content }],
        Model,
      }),
    });
  }

  async UpdateChatHistory(userEmail: string, userMessage: Message): Promise<Response> {
    return fetch(`/api/user/${encodeURIComponent(userEmail)}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userMessage),
      });
  }

  async SaveTitle (titleObj: ChatTitle, userEmail:string){
    return fetch(`/api/user/${encodeURIComponent(userEmail)}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(titleObj),
      });
  }
}

export const apiClient = new ApiClient();
