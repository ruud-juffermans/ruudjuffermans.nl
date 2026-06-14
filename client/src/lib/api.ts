const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Er is iets misgegaan");
  }

  return data as T;
}

export async function submitContact(body: {
  name: string;
  email: string;
  company?: string;
  message: string;
}) {
  return request<{ success: boolean; message: string }>(
    "/api/v1/contact",
    { method: "POST", body: JSON.stringify(body) },
  );
}

export async function subscribeNewsletter(email: string) {
  return request<{ success: boolean; message: string }>(
    "/api/v1/newsletter",
    { method: "POST", body: JSON.stringify({ email }) },
  );
}
