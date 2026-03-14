import React from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  ShoppingBag, 
  Zap, 
  CheckCircle2,
  ArrowUpRight,
  Calendar
} from 'lucide-react';
import { formatCurrency, getDaysUntilEaster } from '../lib/utils';
import { Order } from '../types';

interface DashboardProps {
  revenueGoal: number;
  totalRevenue: number;
  activeOrders: number;
  ticketAverage: number;
  recentOrders: Order[];
  onMarkAsDelivered: (id: string) => void;
}

export function Dashboard({ 
  revenueGoal, 
  totalRevenue, 
  activeOrders, 
  ticketAverage, 
  recentOrders,
  onMarkAsDelivered
}: DashboardProps) {
  const progress = Math.min((totalRevenue / revenueGoal) * 100, 100);
  const daysLeft = getDaysUntilEaster();
  
  const getProgressMessage = () => {
    if (progress === 0) return "O início de uma jornada doce! 🥚";
    if (progress <= 25) return "Primeiros passos rumo aos R$ 6.000!";
    if (progress <= 50) return "Metade do caminho! Você é imparável.";
    if (progress <= 75) return "A vitória está logo ali, continue!";
    if (progress < 100) return "Quase lá! Sinta o cheiro do sucesso.";
    return "🏆 META BATIDA! VOCÊ É INCRÍVEL!";
  };

  const remainingToGoal = Math.max(revenueGoal - totalRevenue, 0);
  const dailyNeeded = daysLeft > 0 ? remainingToGoal / daysLeft : 0;

  return (
    <div className="space-y-12 pb-24">
      {/* Hero Section - Editorial Style */}
      <section className="relative overflow-hidden bg-chocolate p-12 md:p-24 text-white min-h-[600px] flex flex-col justify-center border-b-8 border-gold">
        <div className="absolute top-0 right-0 w-full h-full opacity-30 pointer-events-none">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1548907040-4baa42d10919?w=1200')] bg-cover bg-center mix-blend-overlay grayscale" />
          <div className="absolute inset-0 bg-gradient-to-t from-chocolate via-transparent to-transparent" />
        </div>
        
        <div className="relative z-10 space-y-12">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-6">
              <span className="w-20 h-[2px] bg-gold" />
              <p className="text-gold font-black uppercase tracking-[0.6em] text-[12px]">Performance Analítica 2026</p>
            </div>
            <h1 className="text-[18vw] md:text-[14vw] font-black uppercase tracking-[-0.08em] leading-[0.7] drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              Meta <br />
              <span className="text-gold italic font-serif lowercase tracking-normal">de</span> Faturamento
            </h1>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-end">
            <div className="space-y-8">
              <div className="flex justify-between items-end">
                <div className="space-y-2">
                  <p className="text-[11px] font-mono font-bold text-white/40 uppercase tracking-[0.3em]">Progresso Atual</p>
                  <p className="text-lg font-serif italic text-gold leading-none">{getProgressMessage()}</p>
                </div>
                <span className="text-7xl font-black tracking-tighter font-mono">{Math.round(progress)}%</span>
              </div>
              <div className="h-4 bg-white/5 border border-white/10 p-[3px]">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 2.5, ease: "circOut" }}
                  className="h-full bg-gold shadow-[0_0_30px_rgba(212,175,55,0.4)]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-12">
              <div className="space-y-2">
                <p className="text-[11px] font-mono font-bold text-white/40 uppercase tracking-[0.3em]">Objetivo Final</p>
                <p className="text-5xl font-black tracking-tighter font-mono text-gold">{formatCurrency(revenueGoal)}</p>
              </div>
              <div className="space-y-2">
                <p className="text-[11px] font-mono font-bold text-white/40 uppercase tracking-[0.3em]">Dias Restantes</p>
                <p className="text-5xl font-black tracking-tighter font-mono flex items-center gap-3">
                  {daysLeft} <span className="text-xs font-serif italic text-white/40 lowercase tracking-normal">dias</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Grid - Bento Style Refined */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <motion.div 
          whileHover={{ y: -10 }}
          className="bg-white p-12 border-2 border-chocolate shadow-[15px_15px_0px_0px_rgba(212,175,55,0.2)] space-y-8 group transition-all duration-500"
        >
          <div className="w-16 h-16 bg-paper border-2 border-chocolate flex items-center justify-center text-chocolate group-hover:bg-chocolate group-hover:text-white transition-colors">
            <ShoppingBag size={32} />
          </div>
          <div className="space-y-2">
            <p className="text-[11px] font-mono font-bold text-chocolate/40 uppercase tracking-[0.3em]">Encomendas Ativas</p>
            <div className="flex items-baseline gap-3">
              <p className="text-7xl font-black tracking-tighter text-chocolate font-mono">{activeOrders}</p>
              <p className="text-xs font-serif italic text-gold tracking-normal">unidades</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -10 }}
          className="bg-chocolate p-12 border-2 border-chocolate shadow-[15px_15px_0px_0px_rgba(45,36,30,0.1)] space-y-8 group transition-all duration-500"
        >
          <div className="w-16 h-16 bg-white/10 border-2 border-white/20 flex items-center justify-center text-gold">
            <TrendingUp size={32} />
          </div>
          <div className="space-y-2">
            <p className="text-[11px] font-mono font-bold text-white/40 uppercase tracking-[0.3em]">Ticket Médio</p>
            <div className="flex items-baseline gap-3">
              <p className="text-6xl font-black tracking-tighter text-white font-mono">{formatCurrency(ticketAverage)}</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -10 }}
          className="bg-white p-12 border-2 border-chocolate shadow-[15px_15px_0px_0px_rgba(184,134,11,0.2)] space-y-8 group transition-all duration-500"
        >
          <div className="w-16 h-16 bg-gold flex items-center justify-center text-white">
            <Zap size={32} />
          </div>
          <div className="space-y-2">
            <p className="text-[11px] font-mono font-bold text-chocolate/40 uppercase tracking-[0.3em]">Meta Diária</p>
            <div className="flex items-baseline gap-3">
              <p className="text-6xl font-black tracking-tighter text-chocolate font-mono">{formatCurrency(dailyNeeded)}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Production & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Recent Orders */}
        <div className="lg:col-span-8 space-y-8">
          <div className="flex items-center justify-between px-4">
            <div className="space-y-1">
              <h3 className="text-3xl font-black text-chocolate uppercase tracking-tighter">Fluxo de Pedidos</h3>
              <p className="text-[10px] font-black text-gold-dark uppercase tracking-widest">Acompanhe suas últimas vendas</p>
            </div>
            <button className="flex items-center gap-2 text-[10px] font-black text-chocolate/40 uppercase tracking-widest hover:text-gold transition-colors group">
              Ver Histórico Completo
              <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>

          <div className="bg-white rounded-[48px] border border-paper shadow-xl overflow-hidden">
            {recentOrders.length > 0 ? (
              <div className="divide-y divide-paper">
                {recentOrders.map((order) => (
                  <div key={order.id} className="p-8 flex items-center justify-between hover:bg-paper/30 transition-all group">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-paper rounded-[24px] flex items-center justify-center text-chocolate font-black text-xl shadow-inner">
                        {order.customerName.charAt(0)}
                      </div>
                      <div className="space-y-1">
                        <p className="text-lg font-black text-chocolate uppercase tracking-tight">{order.customerName}</p>
                        <div className="flex items-center gap-3">
                          <span className="px-2 py-1 bg-gold/10 text-gold-dark text-[9px] font-black uppercase tracking-widest rounded-md">
                            {order.productName}
                          </span>
                          <span className="text-[10px] font-bold text-chocolate/40 uppercase tracking-widest">
                            {order.quantity}x • {order.size}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="text-right hidden sm:block">
                        <p className="text-xl font-black text-chocolate tracking-tighter">{formatCurrency(order.value)}</p>
                        <p className="text-[10px] font-bold text-gold-dark uppercase tracking-widest">{order.paymentStatus}</p>
                      </div>
                      <button 
                        onClick={() => onMarkAsDelivered(order.id)}
                        className="w-12 h-12 bg-paper text-chocolate/20 hover:text-white hover:bg-gold rounded-2xl transition-all flex items-center justify-center shadow-sm"
                        title="Marcar como entregue"
                      >
                        <CheckCircle2 size={22} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-24 text-center space-y-6">
                <div className="w-24 h-24 bg-paper rounded-full flex items-center justify-center mx-auto text-chocolate/10">
                  <ShoppingBag size={48} />
                </div>
                <div className="space-y-2">
                  <p className="text-chocolate font-black uppercase tracking-tighter text-xl">Nenhum pedido ainda</p>
                  <p className="text-chocolate/30 font-bold uppercase tracking-widest text-[10px]">Comece a vender e veja os números crescerem!</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Production Calendar / Quick Info */}
        <div className="lg:col-span-4 space-y-8">
          <div className="space-y-1 px-4">
            <h3 className="text-3xl font-black text-chocolate uppercase tracking-tighter">Calendário</h3>
            <p className="text-[10px] font-black text-gold-dark uppercase tracking-widest">Datas críticas de entrega</p>
          </div>

          <div className="bg-chocolate rounded-[48px] p-8 text-white shadow-2xl space-y-8 relative overflow-hidden">
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gold/10 rounded-full blur-3xl" />
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                <Calendar size={24} className="text-gold" />
              </div>
              <div>
                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Hoje é dia</p>
                <p className="text-xl font-black tracking-tighter">
                  {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-3">
                <p className="text-[10px] font-black text-gold uppercase tracking-[0.2em]">Dica de Produção</p>
                <p className="text-sm font-medium leading-relaxed text-white/80">
                  Inicie a temperagem das cascas clássicas hoje para garantir estoque para os pedidos de última hora.
                </p>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Próximos Marcos</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60">Semana Santa</span>
                    <span className="font-black text-gold">29 Mar</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60">Domingo de Páscoa</span>
                    <span className="font-black text-gold">05 Abr</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
