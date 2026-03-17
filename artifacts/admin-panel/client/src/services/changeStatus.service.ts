import { environment } from "@/environments/environment";

export async function confirmTickets(id: string, transactionId: string): Promise<void> {
  const url = `${environment.apiBaseUrl}/rifa/tickets`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, transactionId }),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json?.data?.error || `Error al confirmar pago: ${response.status}`);
  }
}

export async function rejectTickets(id: string, transactionId: string): Promise<void> {
  const url = `${environment.apiBaseUrl}/rifa/registro?id=${encodeURIComponent(id)}&transactionId=${encodeURIComponent(transactionId)}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status: "rejected" }),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json?.data?.error || `Error al rechazar pago: ${response.status}`);
  }
}
