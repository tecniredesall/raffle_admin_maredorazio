import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, XCircle, FileImage, CreditCard, Hash, Calendar, Phone, Mail, User } from 'lucide-react';
import { Transaction } from '@/types';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface TransactionModalProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: string) => void;
  onReject: (id: string) => void;
}

export function TransactionModal({ transaction, isOpen, onClose, onConfirm, onReject }: TransactionModalProps) {
  if (!transaction) return null;

  const handleConfirm = () => {
    onConfirm(transaction.id);
    onClose();
  };

  const handleReject = () => {
    onReject(transaction.id);
    onClose();
  };

  const formattedDate = format(new Date(transaction.createdAt), "d 'de' MMMM, yyyy 'a las' HH:mm", { locale: es });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-5xl -translate-x-1/2 -translate-y-1/2 p-4 md:p-6"
          >
            <div className="glass-panel relative flex max-h-[90vh] flex-col overflow-hidden rounded-3xl shadow-2xl">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border/50 bg-card/50 p-6 backdrop-blur-md">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Hash className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">{transaction.transactionNumber}</h2>
                    <p className="text-sm text-muted-foreground">{formattedDate}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                  
                  {/* Left Col: Details */}
                  <div className="space-y-8">
                    <div className="flex items-center justify-between rounded-2xl bg-muted/50 p-6">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Estado Actual</p>
                        <Badge status={transaction.status} className="mt-2 text-sm px-4 py-1.5" >
                          {transaction.status === 'pending' ? 'Pendiente' : 
                           transaction.status === 'confirmed' ? 'Confirmado' : 'Rechazado'}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-muted-foreground">Total a Pagar</p>
                        <p className="mt-1 font-display text-3xl font-bold text-primary">
                          {formatCurrency(transaction.totalAmount)}
                        </p>
                        <p className="text-xs font-medium text-muted-foreground mt-1">Por {transaction.seedCount} semillas</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h3 className="font-display text-lg font-semibold text-foreground border-b border-border/50 pb-2">
                        Datos del Comprador
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <InfoItem icon={<User />} label="Nombre Completo" value={transaction.name} />
                        <InfoItem icon={<CreditCard />} label="Cédula / ID" value={transaction.cedula} />
                        <InfoItem icon={<Phone />} label="Teléfono" value={transaction.phone} />
                        <InfoItem icon={<Mail />} label="Correo Electrónico" value={transaction.email} />
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h3 className="font-display text-lg font-semibold text-foreground border-b border-border/50 pb-2">
                        Detalles de Pago
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <InfoItem icon={<CreditCard />} label="Método de Pago" value={transaction.paymentMethod} />
                        <InfoItem icon={<Hash />} label="Referencia" value={transaction.reference} />
                      </div>
                    </div>
                  </div>

                  {/* Right Col: Image */}
                  <div className="flex flex-col">
                    <h3 className="mb-4 font-display text-lg font-semibold text-foreground flex items-center gap-2">
                      <FileImage className="h-5 w-5 text-primary" />
                      Comprobante de Pago
                    </h3>
                    <div className="group relative flex-1 overflow-hidden rounded-2xl border-2 border-border bg-muted/30 min-h-[400px]">
                      <img 
                        src={transaction.paymentProofUrl} 
                        alt={`Comprobante ${transaction.transactionNumber}`}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-end justify-center pb-6">
                         <a 
                           href={transaction.paymentProofUrl} 
                           target="_blank" 
                           rel="noopener noreferrer"
                           className="bg-white/20 backdrop-blur-md text-white px-6 py-2 rounded-full font-medium border border-white/30 hover:bg-white/30 transition-colors"
                         >
                           Ver imagen completa
                         </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="border-t border-border/50 bg-muted/20 p-6 backdrop-blur-md flex flex-col sm:flex-row justify-end gap-4">
                <Button variant="outline" onClick={onClose} className="sm:mr-auto">
                  Cerrar
                </Button>
                
                {transaction.status === 'pending' && (
                  <>
                    <Button variant="destructive" onClick={handleReject} className="w-full sm:w-auto gap-2">
                      <XCircle className="h-5 w-5" />
                      Rechazar
                    </Button>
                    <Button onClick={handleConfirm} className="w-full sm:w-auto gap-2">
                      <CheckCircle className="h-5 w-5" />
                      Confirmar Pago
                    </Button>
                  </>
                )}
              </div>
              
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1 text-muted-foreground/70 [&>svg]:h-5 [&>svg]:w-5">
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
        <p className="mt-1 font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}
