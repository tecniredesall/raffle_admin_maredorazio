import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, ChevronRight, LayoutDashboard, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { useTransactions } from '@/hooks/use-transactions';
import { Transaction, TransactionStatus } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { TransactionModal } from '@/components/TransactionModal';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

type FilterType = 'all' | TransactionStatus;

export function Dashboard() {
  const { transactions, stats, confirmTransaction, rejectTransaction } = useTransactions();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const matchesFilter = activeFilter === 'all' || tx.status === activeFilter;
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        tx.name.toLowerCase().includes(query) || 
        tx.transactionNumber.toLowerCase().includes(query) || 
        tx.cedula.toLowerCase().includes(query) ||
        tx.reference.toLowerCase().includes(query);
      return matchesFilter && matchesSearch;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [transactions, activeFilter, searchQuery]);

  return (
    <div className="min-h-screen pb-20">
      {/* Top Navigation */}
      <header className="sticky top-0 z-30 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
                <img src={`${import.meta.env.BASE_URL}images/logo.png`} alt="Logo" className="h-6 w-6 object-contain invert" />
              </div>
              <h1 className="font-display text-xl font-bold text-foreground">Admin<span className="text-primary">Panel</span></h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex flex-col text-right">
                <span className="text-sm font-bold text-foreground">Administrador</span>
                <span className="text-xs text-muted-foreground">admin@raffle.com</span>
              </div>
              <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-primary/20 bg-muted">
                <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100&h=100" alt="Admin" className="h-full w-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 mb-8">
          <StatCard title="Total Compras" value={stats.total} icon={<LayoutDashboard />} />
          <StatCard title="Pendientes" value={stats.pending} icon={<Clock />} color="text-amber-500" bg="bg-amber-500/10" />
          <StatCard title="Confirmados" value={stats.confirmed} icon={<CheckCircle2 />} color="text-emerald-500" bg="bg-emerald-500/10" />
          <StatCard title="Rechazados" value={stats.rejected} icon={<XCircle />} color="text-rose-500" bg="bg-rose-500/10" />
        </div>

        <div className="glass-panel rounded-3xl p-6">
          <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground">Transacciones</h2>
              <p className="text-sm text-muted-foreground mt-1">Gestiona los pagos y comprobantes de las semillas.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Input 
                placeholder="Buscar por nombre, ID, ref..." 
                icon={<Search className="h-5 w-5" />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-80"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6 flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
            <FilterButton active={activeFilter === 'all'} onClick={() => setActiveFilter('all')}>
              Todos
            </FilterButton>
            <FilterButton active={activeFilter === 'pending'} onClick={() => setActiveFilter('pending')}>
              Pendientes
            </FilterButton>
            <FilterButton active={activeFilter === 'confirmed'} onClick={() => setActiveFilter('confirmed')}>
              Confirmados
            </FilterButton>
            <FilterButton active={activeFilter === 'rejected'} onClick={() => setActiveFilter('rejected')}>
              Rechazados
            </FilterButton>
          </div>

          {/* Desktop Table */}
          <div className="hidden lg:block overflow-hidden rounded-2xl border border-border/50 bg-card/30">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 text-xs uppercase text-muted-foreground font-semibold">
                <tr>
                  <th className="px-6 py-4">Transacción</th>
                  <th className="px-6 py-4">Cliente</th>
                  <th className="px-6 py-4">Monto / Semillas</th>
                  <th className="px-6 py-4">Referencia</th>
                  <th className="px-6 py-4">Fecha</th>
                  <th className="px-6 py-4 text-center">Estado</th>
                  <th className="px-6 py-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                      No se encontraron transacciones.
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((tx) => (
                    <motion.tr 
                      key={tx.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="group transition-colors hover:bg-muted/30 cursor-pointer"
                      onClick={() => setSelectedTx(tx)}
                    >
                      <td className="px-6 py-4 font-semibold text-foreground">{tx.transactionNumber}</td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-foreground">{tx.name}</div>
                        <div className="text-xs text-muted-foreground">{tx.cedula}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-foreground">{formatCurrency(tx.totalAmount)}</div>
                        <div className="text-xs text-muted-foreground">{tx.seedCount} semillas</div>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs">{tx.reference}</td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {format(new Date(tx.createdAt), "d MMM yyyy", { locale: es })}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Badge status={tx.status}>
                           {tx.status === 'pending' ? 'Pendiente' : tx.status === 'confirmed' ? 'Confirmado' : 'Rechazado'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          Ver Detalles <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
            {filteredTransactions.length === 0 ? (
              <div className="col-span-full py-12 text-center text-muted-foreground border border-dashed border-border rounded-2xl">
                No se encontraron transacciones.
              </div>
            ) : (
              filteredTransactions.map((tx) => (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => setSelectedTx(tx)}
                  className="group relative flex cursor-pointer flex-col gap-3 rounded-2xl border border-border/50 bg-card p-5 shadow-sm transition-all hover:border-primary/30 hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-mono text-xs font-bold text-primary">{tx.transactionNumber}</div>
                      <div className="mt-1 font-semibold text-foreground">{tx.name}</div>
                    </div>
                    <Badge status={tx.status}>
                      {tx.status === 'pending' ? 'Pendiente' : tx.status === 'confirmed' ? 'Confirmado' : 'Rechazado'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-end justify-between mt-2">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Monto</div>
                      <div className="font-display text-lg font-bold text-foreground">{formatCurrency(tx.totalAmount)}</div>
                    </div>
                    <div className="text-right text-xs text-muted-foreground">
                      {tx.seedCount} semillas<br/>
                      {format(new Date(tx.createdAt), "d MMM yyyy", { locale: es })}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </main>

      <TransactionModal 
        transaction={selectedTx} 
        isOpen={!!selectedTx} 
        onClose={() => setSelectedTx(null)} 
        onConfirm={confirmTransaction}
        onReject={rejectTransaction}
      />
    </div>
  );
}

function StatCard({ title, value, icon, color = "text-primary", bg = "bg-primary/10" }: { title: string, value: number, icon: React.ReactNode, color?: string, bg?: string }) {
  return (
    <div className="glass-panel hover-lift rounded-2xl p-5">
      <div className="flex items-center gap-3">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${bg} ${color}`}>
          {React.cloneElement(icon as React.ReactElement, { className: "h-6 w-6" })}
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
          <p className="font-display text-2xl font-bold text-foreground">{value}</p>
        </div>
      </div>
    </div>
  );
}

function FilterButton({ active, children, onClick }: { active: boolean, children: React.ReactNode, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-semibold transition-all ${
        active 
          ? "bg-foreground text-background shadow-md" 
          : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}
