import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, XCircle, FileImage, CreditCard, Hash, 
  Phone, Mail, User, ShieldCheck, Coins, Calendar, ImageIcon, Loader2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { getRegistro, buildImageUrl, type RegistroData } from '@/services/registro.service';

type TransactionStatus = 'pending' | 'confirmed' | 'rejected';

interface Transaction {
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

function mapRegistroToTransaction(data: RegistroData): Transaction {
  const statusMap: Record<string, TransactionStatus> = {
    register: 'pending',
    confirmed: 'confirmed',
    rejected: 'rejected',
  };

  return {
    transactionNumber: data.transactionId,
    name: data.name,
    cedula: data.id,
    phone: data.telefono,
    email: data.email,
    reference: data.rifaId,
    seedCount: data.cantidad,
    totalAmount: `${data.total} ${data.moneda}`,
    paymentMethod: data.metodoPago,
    paymentProofUrl: buildImageUrl(data.img_url),
    status: statusMap[data.status] || 'pending',
    createdAt: data.createdAt,
  };
}

export function Dashboard() {
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageOpen, setImageOpen] = useState(false);

  useEffect(() => {
    const basePath = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
    const pathname = window.location.pathname.replace(new RegExp(`^${basePath}`), '');
    const segments = pathname.split('/').filter(Boolean);

    const id = segments[0] || null;
    const transactionId = segments[1] || null;

    if (!id || !transactionId) {
      setError('Enlace inválido. La URL debe tener el formato: /id/transactionId');
      setLoading(false);
      return;
    }

    getRegistro(id, transactionId)
      .then((data) => {
        setTransaction(mapRegistroToTransaction(data));
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleConfirm = () => {
    setTransaction(prev => prev ? ({ ...prev, status: 'confirmed', confirmedAt: new Date().toISOString() }) : prev);
  };

  const handleReject = () => {
    setTransaction(prev => prev ? ({ ...prev, status: 'rejected' }) : prev);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Cargando registro...</p>
        </div>
      </div>
    );
  }

  if (error || !transaction) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center max-w-md mx-4">
          <XCircle className="h-10 w-10 text-rose-500 mx-auto mb-2" />
          <p className="text-lg font-bold text-rose-700">Error al cargar</p>
          <p className="text-sm text-rose-600 mt-1">{error || 'No se pudo obtener el registro'}</p>
        </div>
      </div>
    );
  }

  const formattedDate = format(new Date(transaction.createdAt), "d 'de' MMMM, yyyy · HH:mm", { locale: es });

  return (
    <div className="min-h-screen bg-background pb-10">
      <header className="sticky top-0 z-30 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
                <ShieldCheck className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-foreground">Verificar Pago</span>
            </div>
            <Badge status={transaction.status} className="text-sm px-4 py-1.5">
              {transaction.status === 'pending' ? 'Pendiente' :
               transaction.status === 'confirmed' ? 'Confirmado' : 'Rechazado'}
            </Badge>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 sm:px-6 pt-6 space-y-5">

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-border bg-card p-5 sm:p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Transaccion</p>
              <p className="text-2xl font-bold text-primary mt-0.5">{transaction.transactionNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total</p>
              <p className="text-2xl font-bold text-foreground mt-0.5">{transaction.totalAmount}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{formattedDate}</span>
          </div>

          <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
            <Coins className="h-4 w-4" />
            <span>{transaction.seedCount} semillas</span>
            <span className="mx-1">·</span>
            <CreditCard className="h-4 w-4" />
            <span>{transaction.paymentMethod}</span>
          </div>

          <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
            <Hash className="h-4 w-4" />
            <span>Referencia: {transaction.reference}</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-2xl border border-border bg-card p-5 sm:p-6"
        >
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
            <User className="h-4 w-4 text-primary" />
            Datos del Comprador
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <InfoRow icon={<User />} label="Nombre" value={transaction.name} />
            <InfoRow icon={<CreditCard />} label="Cedula" value={transaction.cedula} />
            <InfoRow icon={<Phone />} label="Telefono" value={transaction.phone} />
            <InfoRow icon={<Mail />} label="Email" value={transaction.email} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-border bg-card p-5 sm:p-6"
        >
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
            <FileImage className="h-4 w-4 text-primary" />
            Comprobante de Pago
          </h3>
          <div
            className="relative cursor-pointer overflow-hidden rounded-xl border border-border bg-muted/30"
            onClick={() => setImageOpen(true)}
          >
            <img
              src={transaction.paymentProofUrl}
              alt={`Comprobante ${transaction.transactionNumber}`}
              className="w-full max-h-[400px] object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/20 transition-colors">
              <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium text-foreground opacity-0 hover:opacity-100 transition-opacity flex items-center gap-2 shadow-lg">
                <ImageIcon className="h-4 w-4" />
                Ver completa
              </div>
            </div>
          </div>
        </motion.div>

        {transaction.status === 'pending' && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex flex-col sm:flex-row gap-3 pt-2"
          >
            <Button
              variant="destructive"
              onClick={handleReject}
              className="w-full sm:w-1/2 gap-2 h-12 text-base"
            >
              <XCircle className="h-5 w-5" />
              Rechazar
            </Button>
            <Button
              onClick={handleConfirm}
              className="w-full sm:w-1/2 gap-2 h-12 text-base"
            >
              <CheckCircle className="h-5 w-5" />
              Confirmar Pago
            </Button>
          </motion.div>
        )}

        {transaction.status === 'confirmed' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-5 text-center"
          >
            <CheckCircle className="h-10 w-10 text-emerald-500 mx-auto mb-2" />
            <p className="text-lg font-bold text-emerald-700">Pago Confirmado</p>
            {transaction.confirmedAt && (
              <p className="text-sm text-emerald-600 mt-1">
                {format(new Date(transaction.confirmedAt), "d 'de' MMMM, yyyy · HH:mm", { locale: es })}
              </p>
            )}
          </motion.div>
        )}

        {transaction.status === 'rejected' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl border-2 border-rose-200 bg-rose-50 p-5 text-center"
          >
            <XCircle className="h-10 w-10 text-rose-500 mx-auto mb-2" />
            <p className="text-lg font-bold text-rose-700">Pago Rechazado</p>
          </motion.div>
        )}
      </main>

      <AnimatePresence>
        {imageOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setImageOpen(false)}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={() => setImageOpen(false)}
              className="fixed inset-4 z-50 flex items-center justify-center"
            >
              <img
                src={transaction.paymentProofUrl}
                alt="Comprobante completo"
                className="max-h-full max-w-full rounded-2xl object-contain shadow-2xl"
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-muted-foreground/60 [&>svg]:h-4 [&>svg]:w-4">
        {icon}
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground mt-0.5">{value}</p>
      </div>
    </div>
  );
}
