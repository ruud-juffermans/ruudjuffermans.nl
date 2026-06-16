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

// Fire-and-forget page-view beacon. Never throws — analytics must not break a page.
export function recordPageView(path: string, locale?: string) {
  const body = JSON.stringify({
    path,
    locale,
    referrer: typeof document !== "undefined" ? document.referrer || undefined : undefined,
  });
  void fetch(`${API_URL}/api/v1/analytics`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {});
}
