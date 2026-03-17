export type TransactionStatus = 'pending' | 'confirmed' | 'rejected';

export interface Transaction {
  id: string;
  transactionNumber: string;
  name: string;
  cedula: string;
  phone: string;
  email: string;
  reference: string;
  seedCount: number;
  totalAmount: string;
  paymentMethod: string;
  paymentProofUrl: string;
  status: TransactionStatus;
  createdAt: string;
  confirmedAt?: string;
}
