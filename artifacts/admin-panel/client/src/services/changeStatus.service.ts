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

  if (!response.ok) {
    throw new Error(`Error al confirmar pago: ${response.status}`);
  }
}
