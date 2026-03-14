import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  Calendar, 
  MessageCircle, 
  CheckCircle2, 
  X,
  User,
  Package,
  Trash2,
  Check,
  ChevronRight,
  Smartphone,
  ArrowUpRight
} from 'lucide-react';
import { Order, Recipe, OrderStatus, PaymentStatus } from '../types';
import { formatCurrency, cn } from '../lib/utils';
import { format, isPast, isToday, addDays, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface OrdersProps {
  orders: Order[];
  menu: Recipe[];
  onAddOrder: (order: Omit<Order, 'id' | 'createdAt'>) => void;
  onUpdateStatus: (id: string, status: OrderStatus) => void;
  onUpdatePayment: (id: string, status: PaymentStatus) => void;
  onDeleteOrder: (id: string) => void;
}

export function Orders({ 
  orders, 
  menu, 
  onAddOrder, 
  onUpdateStatus, 
  onUpdatePayment, 
  onDeleteOrder 
}: OrdersProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  const [formData, setFormData] = useState({
    customerName: '',
    customerWhatsapp: '',
    productId: '',
    quantity: 1,
    paymentMethod: 'Pix' as const,
    paymentStatus: 'Aguardando' as PaymentStatus,
    deliveryDate: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
    observations: '',
    status: 'Novo' as OrderStatus
  });

  const filteredOrders = orders.filter(order => 
    order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.productName.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => new Date(a.deliveryDate).getTime() - new Date(b.deliveryDate).getTime());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const product = menu.find(p => p.id === formData.productId);
    
    onAddOrder({
      ...formData,
      productName: product?.name || 'Produto Personalizado',
      size: 'Padrão',
      value: (product?.suggestedPrice || 0) * formData.quantity
    });

    setIsModalOpen(false);
    setFormData({
      customerName: '',
      customerWhatsapp: '',
      productId: '',
      quantity: 1,
      paymentMethod: 'Pix',
      paymentStatus: 'Aguardando',
      deliveryDate: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
      observations: '',
      status: 'Novo'
    });
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'Novo': return 'bg-blue-100 text-blue-700';
      case 'Em Produção': return 'bg-orange-100 text-orange-700';
      case 'Pronto': return 'bg-purple-100 text-purple-700';
      case 'Entregue': return 'bg-green-100 text-green-700';
      default: return 'bg-paper text-chocolate';
    }
  };

  const getUrgencyColor = (date: string) => {
    const deliveryDate = parseISO(date);
    if (isPast(deliveryDate) && !isToday(deliveryDate)) return 'text-red-500';
    if (isToday(deliveryDate)) return 'text-orange-500';
    return 'text-chocolate/40';
  };

  const sendWhatsApp = (order: Order) => {
    const message = encodeURIComponent(
      `Olá ${order.customerName}! Aqui é da Páscoa Lucrativa. 🐰\n\n` +
      `Gostaria de confirmar seu pedido de: ${order.productName} (${order.quantity}x).\n` +
      `Valor total: ${formatCurrency(order.value)}\n` +
      `Data de entrega: ${format(parseISO(order.deliveryDate), 'dd/MM/yyyy')}\n\n` +
      `Podemos confirmar?`
    );
    window.open(`https://wa.me/55${order.customerWhatsapp.replace(/\D/g, '')}?text=${message}`);
  };

  return (
    <div className="space-y-12 pb-24">
      {/* Editorial Header */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <span className="w-16 h-[2px] bg-gold" />
            <p className="text-gold font-black uppercase tracking-[0.5em] text-[11px]">Sistema de Gestão Especializado</p>
          </div>
          <h2 className="text-[15vw] md:text-[10vw] font-black uppercase tracking-[-0.05em] leading-[0.75] text-chocolate">
            Controle <br />
            <span className="text-gold italic font-serif lowercase tracking-normal">de</span> Pedidos
          </h2>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-6 w-full lg:w-auto pb-4">
          <div className="relative group flex-1 lg:w-96">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-chocolate/30 group-focus-within:text-gold transition-colors" size={22} />
            <input 
              type="text"
              placeholder="PESQUISAR NA BASE DE DADOS..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-16 pr-8 py-6 bg-white border-2 border-paper rounded-none focus:outline-none focus:border-gold transition-all font-mono text-xs tracking-widest text-chocolate placeholder:text-chocolate/20"
            />
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-12 py-6 bg-chocolate text-white rounded-none font-black uppercase tracking-widest hover:bg-gold transition-all flex items-center justify-center gap-4 shadow-[10px_10px_0px_0px_rgba(212,175,55,0.3)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 group"
          >
            <Plus size={24} className="group-hover:rotate-90 transition-transform" /> 
            Novo Registro
          </button>
        </div>
      </header>

      {/* Orders Grid - Recipe 1: Technical Dashboard Style */}
      <div className="bg-white border-2 border-chocolate shadow-[20px_20px_0px_0px_rgba(45,36,30,0.05)] overflow-hidden">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-12 gap-0 bg-chocolate text-white border-b-2 border-chocolate">
          <div className="col-span-4 p-6 border-r border-white/10 text-[11px] font-serif italic font-medium tracking-wider">Cliente & Especificação</div>
          <div className="col-span-2 p-6 border-r border-white/10 text-[11px] font-serif italic font-medium tracking-wider">Cronograma</div>
          <div className="col-span-2 p-6 border-r border-white/10 text-[11px] font-serif italic font-medium tracking-wider">Status</div>
          <div className="col-span-2 p-6 border-r border-white/10 text-[11px] font-serif italic font-medium tracking-wider">Financeiro</div>
          <div className="col-span-2 p-6 text-[11px] font-serif italic font-medium tracking-wider text-right">Montante</div>
        </div>

        <div className="divide-y-2 divide-chocolate/5">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order, idx) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                onClick={() => setSelectedOrder(order)}
                className="grid grid-cols-1 md:grid-cols-12 gap-0 hover:bg-chocolate hover:text-white transition-colors cursor-pointer group items-stretch"
              >
                <div className="col-span-4 p-6 md:border-r border-chocolate/5 group-hover:border-white/10 flex items-center gap-6">
                  <div className="w-16 h-16 bg-paper flex items-center justify-center text-3xl group-hover:bg-white/10 transition-colors shrink-0">
                    {idx % 2 === 0 ? '🥚' : '🐰'}
                  </div>
                  <div className="space-y-1 overflow-hidden">
                    <h3 className="text-2xl font-black uppercase tracking-tighter leading-none truncate">{order.customerName}</h3>
                    <p className="text-[10px] font-mono font-bold text-gold uppercase tracking-[0.2em]">{order.productName}</p>
                  </div>
                </div>

                <div className="col-span-2 p-6 md:border-r border-chocolate/5 group-hover:border-white/10 flex flex-col justify-center">
                  <div className="text-[10px] md:hidden font-serif italic text-gold mb-1">Entrega</div>
                  <div className={cn("font-mono text-sm font-bold tracking-tighter", getUrgencyColor(order.deliveryDate), "group-hover:text-white")}>
                    {format(parseISO(order.deliveryDate), "dd.MM.yyyy", { locale: ptBR })}
                  </div>
                  <div className="text-[9px] font-mono opacity-40 uppercase tracking-widest mt-1">Prazo Final</div>
                </div>

                <div className="col-span-2 p-6 md:border-r border-chocolate/5 group-hover:border-white/10 flex items-center">
                  <span className={cn(
                    "px-4 py-1.5 text-[10px] font-mono font-bold uppercase tracking-widest border",
                    order.status === 'Novo' ? "border-blue-500 text-blue-500" :
                    order.status === 'Em Produção' ? "border-orange-500 text-orange-500" :
                    order.status === 'Pronto' ? "border-purple-500 text-purple-500" :
                    "border-green-500 text-green-500",
                    "group-hover:bg-white group-hover:text-chocolate group-hover:border-white"
                  )}>
                    {order.status}
                  </span>
                </div>

                <div className="col-span-2 p-6 md:border-r border-chocolate/5 group-hover:border-white/10 flex flex-col justify-center">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-2 h-2 rounded-none rotate-45",
                      order.paymentStatus === 'Pago' ? "bg-green-500" : "bg-orange-500 animate-pulse",
                      "group-hover:bg-white"
                    )} />
                    <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] opacity-60 group-hover:text-white">{order.paymentStatus}</span>
                  </div>
                </div>

                <div className="col-span-2 p-6 text-right flex flex-col justify-center items-end bg-paper/30 group-hover:bg-transparent">
                  <p className="text-3xl font-black tracking-tighter font-mono">{formatCurrency(order.value)}</p>
                  <div className="flex items-center gap-2 text-[9px] font-mono opacity-40 uppercase tracking-widest mt-1">
                    Detalhes <ChevronRight size={12} />
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="p-32 text-center space-y-8 bg-paper/20">
              <div className="w-32 h-32 border-2 border-dashed border-chocolate/10 flex items-center justify-center mx-auto text-chocolate/5">
                <Search size={64} />
              </div>
              <div className="space-y-4">
                <p className="text-chocolate font-black uppercase tracking-tighter text-4xl">Base de Dados Vazia</p>
                <p className="text-chocolate/40 font-mono uppercase tracking-[0.3em] text-[11px]">Nenhum registro correspondente encontrado no sistema.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New Order Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-chocolate/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="relative w-full max-w-2xl bg-white border-4 border-chocolate shadow-[30px_30px_0px_0px_rgba(45,36,30,0.1)] p-12"
            >
              <div className="flex items-center justify-between mb-12 border-b-2 border-chocolate pb-8">
                <div className="space-y-2">
                  <h3 className="text-5xl font-black text-chocolate uppercase tracking-tighter">Novo Registro</h3>
                  <p className="text-[11px] font-mono font-bold text-gold uppercase tracking-[0.4em]">Entrada de Dados no Sistema</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="w-16 h-16 border-2 border-chocolate text-chocolate hover:bg-chocolate hover:text-white transition-all flex items-center justify-center"
                >
                  <X size={32} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <label className="text-[11px] font-mono font-bold text-chocolate/40 uppercase tracking-[0.3em] ml-2">Identificação do Cliente</label>
                    <div className="relative">
                      <User className="absolute left-6 top-1/2 -translate-y-1/2 text-gold" size={22} />
                      <input 
                        required
                        type="text"
                        placeholder="NOME COMPLETO"
                        value={formData.customerName}
                        onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                        className="w-full pl-16 pr-8 py-6 bg-paper/30 border-2 border-chocolate/10 focus:border-gold focus:outline-none font-black text-chocolate placeholder:text-chocolate/20 uppercase tracking-tighter"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-mono font-bold text-chocolate/40 uppercase tracking-[0.3em] ml-2">Canal de Contato</label>
                    <div className="relative">
                      <Smartphone className="absolute left-6 top-1/2 -translate-y-1/2 text-gold" size={22} />
                      <input 
                        required
                        type="tel"
                        placeholder="WHATSAPP"
                        value={formData.customerWhatsapp}
                        onChange={(e) => setFormData({...formData, customerWhatsapp: e.target.value})}
                        className="w-full pl-16 pr-8 py-6 bg-paper/30 border-2 border-chocolate/10 focus:border-gold focus:outline-none font-black text-chocolate placeholder:text-chocolate/20 uppercase tracking-tighter"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[11px] font-mono font-bold text-chocolate/40 uppercase tracking-[0.3em] ml-2">Especificação do Produto</label>
                  <div className="relative">
                    <Package className="absolute left-6 top-1/2 -translate-y-1/2 text-gold" size={22} />
                    <select 
                      required
                      value={formData.productId}
                      onChange={(e) => setFormData({...formData, productId: e.target.value})}
                      className="w-full pl-16 pr-8 py-6 bg-paper/30 border-2 border-chocolate/10 focus:border-gold focus:outline-none font-black text-chocolate appearance-none uppercase tracking-tighter"
                    >
                      <option value="">SELECIONE UM ITEM DA BASE...</option>
                      {menu.map(item => (
                        <option key={item.id} value={item.id}>{item.name} - {formatCurrency(item.suggestedPrice)}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
                  <div className="space-y-3">
                    <label className="text-[11px] font-mono font-bold text-chocolate/40 uppercase tracking-[0.3em] ml-2">Quantidade</label>
                    <input 
                      type="number"
                      min="1"
                      value={formData.quantity}
                      onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})}
                      className="w-full px-8 py-6 bg-paper/30 border-2 border-chocolate/10 focus:border-gold focus:outline-none font-mono font-bold text-chocolate"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-mono font-bold text-chocolate/40 uppercase tracking-[0.3em] ml-2">Data Limite</label>
                    <input 
                      type="date"
                      value={formData.deliveryDate}
                      onChange={(e) => setFormData({...formData, deliveryDate: e.target.value})}
                      className="w-full px-8 py-6 bg-paper/30 border-2 border-chocolate/10 focus:border-gold focus:outline-none font-mono font-bold text-chocolate"
                    />
                  </div>
                  <div className="space-y-3 col-span-2 md:col-span-1">
                    <label className="text-[11px] font-mono font-bold text-chocolate/40 uppercase tracking-[0.3em] ml-2">Modalidade</label>
                    <select 
                      value={formData.paymentMethod}
                      onChange={(e) => setFormData({...formData, paymentMethod: e.target.value as any})}
                      className="w-full px-8 py-6 bg-paper/30 border-2 border-chocolate/10 focus:border-gold focus:outline-none font-black text-chocolate appearance-none uppercase tracking-tighter"
                    >
                      <option value="Pix">PIX</option>
                      <option value="Cartão">CARTÃO</option>
                      <option value="Dinheiro">DINHEIRO</option>
                    </select>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full py-8 bg-chocolate text-white border-2 border-chocolate font-black text-2xl uppercase tracking-widest hover:bg-gold hover:border-gold transition-all flex items-center justify-center gap-4 group"
                >
                  PROCESSAR REGISTRO
                  <ArrowUpRight size={28} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="absolute inset-0 bg-chocolate/90 backdrop-blur-xl"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="relative w-full max-w-3xl bg-white border-4 border-chocolate shadow-[40px_40px_0px_0px_rgba(212,175,55,0.2)] p-12 md:p-20 space-y-16"
            >
              <div className="flex items-start justify-between border-b-4 border-chocolate pb-12">
                <div className="flex items-center gap-10">
                  <div className="w-32 h-32 bg-paper border-2 border-chocolate flex items-center justify-center text-6xl shadow-inner">
                    🥚
                  </div>
                  <div className="space-y-3">
                    <p className="text-[10px] font-mono font-bold text-gold uppercase tracking-[0.5em]">REGISTRO DE VENDAS</p>
                    <h3 className="text-6xl font-black text-chocolate uppercase tracking-tighter leading-none">{selectedOrder.customerName}</h3>
                    <p className="text-[12px] font-mono font-bold text-chocolate/60 uppercase tracking-[0.5em]">{selectedOrder.productName}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="w-20 h-20 border-2 border-chocolate text-chocolate hover:bg-chocolate hover:text-white transition-all flex items-center justify-center"
                >
                  <X size={40} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <p className="text-[11px] font-mono font-bold text-chocolate/40 uppercase tracking-[0.3em] ml-4">Fase de Produção</p>
                  <select 
                    value={selectedOrder.status}
                    onChange={(e) => onUpdateStatus(selectedOrder.id, e.target.value as OrderStatus)}
                    className={cn(
                      "w-full px-8 py-6 border-2 border-chocolate font-black uppercase tracking-widest text-sm appearance-none focus:outline-none",
                      selectedOrder.status === 'Novo' ? "bg-blue-50 text-blue-600" :
                      selectedOrder.status === 'Em Produção' ? "bg-orange-50 text-orange-600" :
                      selectedOrder.status === 'Pronto' ? "bg-purple-50 text-purple-600" :
                      "bg-green-50 text-green-600"
                    )}
                  >
                    <option value="Novo">NOVO</option>
                    <option value="Em Produção">EM PRODUÇÃO</option>
                    <option value="Pronto">PRONTO</option>
                    <option value="Entregue">ENTREGUE</option>
                  </select>
                </div>
                <div className="space-y-4">
                  <p className="text-[11px] font-mono font-bold text-chocolate/40 uppercase tracking-[0.3em] ml-4">Status Financeiro</p>
                  <select 
                    value={selectedOrder.paymentStatus}
                    onChange={(e) => onUpdatePayment(selectedOrder.id, e.target.value as PaymentStatus)}
                    className={cn(
                      "w-full px-8 py-6 border-2 border-chocolate font-black uppercase tracking-widest text-sm appearance-none focus:outline-none",
                      selectedOrder.paymentStatus === 'Pago' ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-600"
                    )}
                  >
                    <option value="Aguardando">AGUARDANDO</option>
                    <option value="Sinal Pago">SINAL PAGO</option>
                    <option value="Pago">PAGO</option>
                  </select>
                </div>
              </div>

              <div className="bg-paper border-2 border-chocolate p-12 space-y-10">
                <div className="grid grid-cols-2 gap-12">
                  <div className="space-y-2">
                    <p className="text-[11px] font-mono font-bold text-chocolate/40 uppercase tracking-[0.3em]">Cronograma de Entrega</p>
                    <p className="text-3xl font-black text-chocolate uppercase tracking-tighter font-mono">
                      {format(parseISO(selectedOrder.deliveryDate), "dd.MM.yyyy", { locale: ptBR })}
                    </p>
                  </div>
                  <div className="space-y-2 text-right">
                    <p className="text-[11px] font-mono font-bold text-chocolate/40 uppercase tracking-[0.3em]">Método de Liquidação</p>
                    <p className="text-3xl font-black text-chocolate uppercase tracking-tighter">{selectedOrder.paymentMethod}</p>
                  </div>
                </div>
                
                {selectedOrder.observations && (
                  <div className="space-y-4 pt-10 border-t-2 border-chocolate/5">
                    <p className="text-[11px] font-mono font-bold text-chocolate/40 uppercase tracking-[0.3em]">ESPECIFICAÇÃO TÉCNICA</p>
                    <p className="text-chocolate/70 font-serif italic text-lg leading-relaxed">{selectedOrder.observations}</p>
                  </div>
                )}

                <div className="pt-10 border-t-4 border-chocolate flex items-center justify-between">
                  <p className="text-lg font-black text-chocolate uppercase tracking-[0.2em]">Valor Total do Registro</p>
                  <p className="text-7xl font-black text-chocolate tracking-tighter font-mono">{formatCurrency(selectedOrder.value)}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-6">
                <button 
                  onClick={() => sendWhatsApp(selectedOrder)}
                  className="flex-1 py-6 bg-green-600 text-white border-2 border-green-600 font-black uppercase tracking-widest hover:bg-white hover:text-green-600 transition-all flex items-center justify-center gap-4 text-lg"
                >
                  <MessageCircle size={28} /> CONTATO WHATSAPP
                </button>
                <button 
                  onClick={() => {
                    if (confirm('Deseja realmente excluir este registro da base de dados?')) {
                      onDeleteOrder(selectedOrder.id);
                      setSelectedOrder(null);
                    }
                  }}
                  className="px-12 py-6 bg-white text-red-600 border-2 border-red-600 font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-4"
                >
                  <Trash2 size={24} /> REMOVER DA BASE
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
