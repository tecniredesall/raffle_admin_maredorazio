import { environment } from "@/environments/environment";

export interface RegistroResponse {
  path: string;
  status: number;
  messages: { code: string; name: string; value: string }[];
  data: RegistroData;
}

export interface RegistroData {
  id: string;
  transactionId: string;
  rifaId: string;
  status: string;
  name: string;
  email: string;
  telefono: string;
  cedula?: string;
  referencia?: string;
  moneda: string;
  precioUnitario: number;
  cantidad: number;
  total: number;
  metodoPago: string;
  tickets: number[];
  img_url: string;
  createdAt: string;
}

export async function getRegistro(id: string, transactionId: string): Promise<RegistroData> {
  const url = `${environment.apiBaseUrl}/rifa/registro?id=${encodeURIComponent(id)}&transactionId=${encodeURIComponent(transactionId)}`;
  const response = await fetch(url);

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json?.data?.error || `Error al obtener registro: ${response.status}`);
  }

  return json.data;
}

export function buildImageUrl(imgPath: string): string {
  return `${environment.apiBaseUrl}${imgPath}`;
}
