const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

export interface PetAddress {
  street: string;
  number: string;
  city: string;
}

export interface Pet {
  id: string;
  name: string;
  type: "CAO" | "GATO";
  gender: "M" | "F";
  address: PetAddress;
  age: string;
  weight: string;
  race: string;
}

export interface PetFormData {
  name: string;
  type: string;
  gender: string;
  street: string;
  number: string;
  city: string;
  age: string;
  weight: string;
  race: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const headers = new Headers(options.headers);
  const hasBody = options.body !== undefined && options.body !== null;

  if (hasBody && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Erro na requisição");
  return json;
}

function toPayload(data: PetFormData) {
  const { street, number, city, ...rest } = data;
  return { ...rest, address: { street, number, city } };
}

export const petApi = {
  findAll: () => request<Pet[]>("/pets"),

  save: (data: PetFormData) =>
    request<null>("/pets", { method: "POST", body: JSON.stringify(toPayload(data)) }),

  update: (id: string, data: PetFormData) =>
    request<Pet>(`/pets/${id}`, { method: "PUT", body: JSON.stringify(toPayload(data)) }),

  delete: (id: string) =>
    request<null>(`/pets/${id}`, { method: "DELETE" }),

  search: (filter: Partial<PetFormData>) => {
    const { street, number, city, ...rest } = filter;
    const payload: Record<string, unknown> = { ...rest };
    if (street || number || city) {
      payload.address = { street: street || "", number: number || "", city: city || "" };
    }
    return request<Pet[]>("/pets/search", { method: "POST", body: JSON.stringify(payload) });
  },
};
