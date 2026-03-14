import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  TrendingUp,
  ShoppingBag,
  Zap,
  CheckCircle2,
  ArrowUpRight,
  Calendar,
  Eye,
  Settings,
  Filter,
  Clock,
  Package,
  TrendingDown
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
    if (progress === 0) return "Sua jornada começa hoje! 🥚";
    if (progress <= 25) return "Primeiros passos para sua meta!";
    if (progress <= 50) return "Você está no caminho certo!";
    if (progress <= 75) return "Continue assim, quase lá!";
    if (progress < 100) return "Finalizando com força total!";
    return "🎉 Meta alcançada! Parabéns!";
  };

  const remainingToGoal = Math.max(revenueGoal - totalRevenue, 0);
  const dailyNeeded = daysLeft > 0 ? remainingToGoal / daysLeft : 0;

  const getProgressColor = () => {
    if (progress < 25) return 'from-blue-400 to-blue-500';
    if (progress < 50) return 'from-purple-400 to-purple-500';
    if (progress < 75) return 'from-orange-400 to-orange-500';
    return 'from-green-400 to-green-500';
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  return (
    <div className="space-y-6 lg:space-y-8 pb-24">
      {/* Hero Section - Modern & Clean */}
      <section className="relative overflow-hidden bg-gradient-to-br from-chocolate via-[#3D3228] to-chocolate p-6 md:p-10 lg:p-16 text-white min-h-[400px] md:min-h-[500px] flex flex-col justify-center border-b-2 border-gold">
        <div className="absolute top-0 right-0 w-full h-full opacity-15 pointer-events-none">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1548907040-4baa42d10919?w=1200')] bg-cover bg-center mix-blend-overlay grayscale brightness-50" />
          <div className="absolute inset-0 bg-gradient-to-t from-chocolate via-transparent to-transparent" />
        </div>

        <div className="relative z-10 space-y-5 lg:space-y-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-2 lg:space-y-3"
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-[1px] bg-gold" />
              <p className="text-gold font-black uppercase tracking-[0.3em] lg:tracking-[0.4em] text-[9px] lg:text-[10px]">
                {getGreeting()} • Dashboard 2026
              </p>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-[-0.02em] lg:tracking-[-0.04em] leading-[1.15] drop-shadow-lg">
              Meta de <br />
              <span className="text-gold italic font-serif lowercase tracking-normal">Faturamento</span>
            </h1>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-12 items-center">
            <div className="space-y-4 lg:space-y-6">
              <div className="flex justify-between items-end">
                <div className="space-y-2">
                  <p className="text-[9px] lg:text-[10px] font-mono font-bold text-white/70 uppercase tracking-[0.15em] lg:tracking-[0.2em]">
                    Progresso
                  </p>
                  <p className="text-sm lg:text-base font-serif italic text-gold/90 leading-snug">
                    {getProgressMessage()}
                  </p>
                </div>
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="text-4xl lg:text-6xl font-black tracking-tight font-mono"
                >
                  {Math.round(progress)}%
                </motion.span>
              </div>

              <div className="h-2.5 lg:h-3 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 2, ease: "circOut", delay: 0.2 }}
                  className="h-full bg-gradient-to-r from-gold to-gold-dark shadow-lg rounded-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 lg:gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="space-y-2"
              >
                <p className="text-[9px] lg:text-[10px] font-mono font-bold text-white/70 uppercase tracking-[0.15em] lg:tracking-[0.2em]">
                  Objetivo
                </p>
                <p className="text-2xl lg:text-4xl font-black tracking-tight font-mono text-gold">
                  {formatCurrency(revenueGoal)}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="space-y-2"
              >
                <p className="text-[9px] lg:text-[10px] font-mono font-bold text-white/70 uppercase tracking-[0.15em] lg:tracking-[0.2em]">
                  Dias
                </p>
                <p className="text-2xl lg:text-4xl font-black tracking-tight font-mono flex items-center gap-1 lg:gap-2">
                  {daysLeft}
                  <span className="text-[9px] lg:text-[10px] font-serif italic text-white/60 lowercase">dias</span>
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Grid - Modern Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          whileHover={{ y: -4, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-white p-6 lg:p-8 border border-chocolate/10 shadow-lg hover:shadow-xl space-y-4 lg:space-y-6 group transition-all duration-300 rounded-2xl cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-paper to-paper border-2 border-chocolate/20 flex items-center justify-center text-chocolate group-hover:from-chocolate group-hover:to-chocolate group-hover:text-white group-hover:border-chocolate transition-all duration-300 rounded-xl">
              <ShoppingBag size={20} lg:size={24} />
            </div>
            <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center">
              <Eye size={14} className="text-gold" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-[9px] lg:text-[10px] font-mono font-bold text-chocolate/50 uppercase tracking-[0.15em] lg:tracking-[0.2em]">
              Encomendas Ativas
            </p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl lg:text-5xl font-black tracking-tight text-chocolate font-mono">
                {activeOrders}
              </p>
              <p className="text-[10px] lg:text-xs font-serif italic text-gold/80 tracking-normal">
                unid.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          whileHover={{ y: -4, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-gradient-to-br from-chocolate to-[#3D3228] p-6 lg:p-8 border border-chocolate/20 shadow-lg hover:shadow-xl space-y-4 lg:space-y-6 group transition-all duration-300 rounded-2xl cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 lg:w-14 lg:h-14 bg-white/10 border border-white/20 flex items-center justify-center text-gold rounded-xl">
              <TrendingUp size={20} lg:size={24} />
            </div>
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <Settings size={14} className="text-white/60" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-[9px] lg:text-[10px] font-mono font-bold text-white/60 uppercase tracking-[0.15em] lg:tracking-[0.2em]">
              Ticket Médio
            </p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl lg:text-5xl font-black tracking-tight text-white font-mono">
                {formatCurrency(ticketAverage)}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          whileHover={{ y: -4, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-white p-6 lg:p-8 border border-gold/20 shadow-lg hover:shadow-xl space-y-4 lg:space-y-6 group transition-all duration-300 rounded-2xl cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center text-white rounded-xl shadow-lg">
              <Zap size={20} lg:size={24} />
            </div>
            <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center">
              <Filter size={14} className="text-gold" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-[9px] lg:text-[10px] font-mono font-bold text-chocolate/50 uppercase tracking-[0.15em] lg:tracking-[0.2em]">
              Meta Diária
            </p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl lg:text-5xl font-black tracking-tight text-chocolate font-mono">
                {formatCurrency(dailyNeeded)}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity & Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-8 space-y-4 lg:space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-2xl lg:text-3xl font-black text-chocolate uppercase tracking-tight">
                Pedidos Recentes
              </h3>
              <p className="text-[10px] font-black text-gold-dark uppercase tracking-[0.2em] lg:tracking-[0.3em]">
                Acompanhe suas últimas vendas
              </p>
            </div>
            <motion.button
              whileHover={{ x: 2 }}
              className="flex items-center gap-2 text-[10px] font-black text-chocolate/60 uppercase tracking-widest hover:text-gold transition-colors group"
            >
              Ver tudo
              <ArrowUpRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl lg:rounded-3xl border border-paper shadow-xl overflow-hidden"
          >
            {recentOrders.length > 0 ? (
              <div className="divide-y divide-paper">
                {recentOrders.map((order, idx) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05, duration: 0.4 }}
                    className="p-4 lg:p-6 flex items-center justify-between hover:bg-paper/30 transition-all group"
                  >
                    <div className="flex items-center gap-3 lg:gap-4">
                      <div className="w-10 h-10 lg:w-12 lg:h-12 bg-paper rounded-xl flex items-center justify-center text-lg lg:text-xl group-hover:bg-white group-hover:shadow-md transition-colors shrink-0">
                        {idx % 2 === 0 ? '🥚' : '🐰'}
                      </div>
                      <div className="space-y-1 min-w-0">
                        <p className="text-base lg:text-lg font-black text-chocolate uppercase tracking-tight truncate">
                          {order.customerName}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-gold/10 text-gold-dark text-[9px] lg:text-[10px] font-black uppercase tracking-widest rounded-md">
                            {order.productName}
                          </span>
                          <span className="text-[10px] font-bold text-chocolate/60 uppercase tracking-widest whitespace-nowrap">
                            {order.quantity}x • {order.size}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 lg:gap-4">
                      <div className="text-right hidden sm:block">
                        <p className="text-base lg:text-lg font-black text-chocolate tracking-tight">
                          {formatCurrency(order.value)}
                        </p>
                        <p className="text-[10px] font-bold text-gold-dark uppercase tracking-widest">
                          {order.paymentStatus}
                        </p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onMarkAsDelivered(order.id)}
                        className="w-10 h-10 lg:w-12 lg:h-12 bg-paper text-chocolate/30 hover:text-white hover:bg-green-500 rounded-xl lg:rounded-2xl transition-all flex items-center justify-center shadow-sm shrink-0"
                        title="Marcar como entregue"
                      >
                        <CheckCircle2 size={18} lg:size={22} />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="p-12 lg:p-20 text-center space-y-4 lg:space-y-6">
                <div className="w-16 h-16 lg:w-20 lg:h-20 bg-paper rounded-full flex items-center justify-center mx-auto text-chocolate/10 mb-4">
                  <ShoppingBag size={32} lg:size={40} />
                </div>
                <div className="space-y-2">
                  <p className="text-chocolate font-black uppercase tracking-tight text-lg lg:text-xl">
                    Nenhum pedido
                  </p>
                  <p className="text-chocolate/50 font-bold uppercase tracking-widest text-[10px]">
                    Comece a vender para ver seus pedidos aqui!
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Calendar & Quick Info */}
        <div className="lg:col-span-4 space-y-4 lg:space-y-6">
          <div className="space-y-1">
            <h3 className="text-2xl lg:text-3xl font-black text-chocolate uppercase tracking-tight">
              Calendário
            </h3>
            <p className="text-[10px] font-black text-gold-dark uppercase tracking-[0.2em] lg:tracking-[0.3em]">
              Datas importantes
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-chocolate to-[#3D3228] rounded-2xl lg:rounded-3xl p-6 lg:p-8 text-white shadow-2xl space-y-5 lg:space-y-6 relative overflow-hidden"
          >
            <div className="absolute -bottom-8 -right-8 w-24 h-24 lg:w-32 lg:h-32 bg-gold/10 rounded-full blur-3xl" />

            <div className="relative flex items-center gap-3 lg:gap-4">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-white/10 rounded-xl flex items-center justify-center">
                <Calendar size={20} lg:size={24} className="text-gold" />
              </div>
              <div>
                <p className="text-[10px] font-black text-white/60 uppercase tracking-widest">Hoje é</p>
                <p className="text-base lg:text-lg font-black tracking-tight">
                  {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}
                </p>
              </div>
            </div>

            <div className="relative space-y-4 lg:space-y-5">
              <div className="p-4 lg:p-5 bg-white/5 rounded-2xl border border-white/10 space-y-2 lg:space-y-3">
                <p className="text-[10px] font-black text-gold uppercase tracking-[0.15em] lg:tracking-[0.2em]">
                  Dica de Hoje
                </p>
                <p className="text-sm lg:text-base font-medium leading-relaxed text-white/80">
                  Inicie a temperagem das cascas clássicas para garantir estoque.
                </p>
              </div>

              <div className="space-y-3 lg:space-y-4">
                <p className="text-[10px] font-black text-white/60 uppercase tracking-widest">
                  Próximos Marcos
                </p>
                <div className="space-y-2 lg:space-y-3">
                  <div className="flex items-center justify-between text-sm lg:text-base">
                    <span className="text-white/70">Semana Santa</span>
                    <span className="font-black text-gold">29 Mar</span>
                  </div>
                  <div className="flex items-center justify-between text-sm lg:text-base">
                    <span className="text-white/70">Domingo de Páscoa</span>
                    <span className="font-black text-gold">05 Abr</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl lg:rounded-3xl border border-paper p-6 lg:p-8 space-y-4 shadow-lg"
          >
            <p className="text-[10px] font-black text-gold-dark uppercase tracking-[0.2em] lg:tracking-[0.3em]">
              Ações Rápidas
            </p>
            <div className="space-y-3">
              <motion.button
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className="w-full p-3 lg:p-4 bg-paper text-chocolate rounded-xl font-black uppercase tracking-widest text-sm hover:bg-chocolate hover:text-white transition-all flex items-center justify-between group"
              >
                <span>Ver Relatório</span>
                <TrendingDown size={18} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
              <motion.button
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className="w-full p-3 lg:p-4 bg-paper text-chocolate rounded-xl font-black uppercase tracking-widest text-sm hover:bg-chocolate hover:text-white transition-all flex items-center justify-between group"
              >
                <span>Configurar Metas</span>
                <Settings size={18} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
