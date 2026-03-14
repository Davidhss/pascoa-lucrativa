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
  ChevronRight,
  Filter,
  ArrowUpRight,
  Clock,
  DollarSign,
  Eye,
  Edit2,
  Smartphone,
  Zap,
  AlertCircle,
  TrendingUp,
  Target,
  WhatsApp,
  Settings
} from 'lucide-react';
import { Order, Recipe, OrderStatus, PaymentStatus } from '../types';
import { formatCurrency, cn } from '../lib/utils';
import { format, isPast, isToday, addDays, parseISO, differenceInDays } from 'date-fns';
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
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'all'>('all');

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

  const ordersByStatus = filterStatus === 'all'
    ? filteredOrders
    : filteredOrders.filter(order => order.status === filterStatus);

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

  const getStatusInfo = (status: OrderStatus) => {
    const statusMap = {
      'Novo': { color: 'blue', icon: '🆕', label: 'Novo' },
      'Em Produção': { color: 'orange', icon: '👨‍🍳', label: 'Em Produção' },
      'Pronto': { color: 'purple', icon: '✅', label: 'Pronto' },
      'Entregue': { color: 'green', icon: '📦', label: 'Entregue' }
    };
    return statusMap[status];
  };

  const getPaymentInfo = (status: PaymentStatus) => {
    const statusMap = {
      'Aguardando': { color: 'orange', icon: '⏳', label: 'Aguardando' },
      'Sinal Pago': { color: 'yellow', icon: '💰', label: 'Sinal Pago' },
      'Pago': { color: 'green', icon: '✅', label: 'Pago' }
    };
    return statusMap[status];
  };

  const getUrgencyLevel = (date: string) => {
    const deliveryDate = parseISO(date);
    const daysUntilDelivery = differenceInDays(deliveryDate, new Date());

    if (isPast(deliveryDate) && !isToday(deliveryDate)) return { level: 'critical', message: 'Atrasado', color: 'red' };
    if (daysUntilDelivery <= 2) return { level: 'urgent', message: 'Urgente', color: 'orange' };
    if (daysUntilDelivery <= 7) return { level: 'warning', message: 'Breve', color: 'yellow' };
    return { level: 'normal', message: 'Futuro', color: 'green' };
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

  const getStatusCount = () => {
    return {
      total: filteredOrders.length,
      'Novo': filteredOrders.filter(o => o.status === 'Novo').length,
      'Em Produção': filteredOrders.filter(o => o.status === 'Em Produção').length,
      'Pronto': filteredOrders.filter(o => o.status === 'Pronto').length,
      'Entregue': filteredOrders.filter(o => o.status === 'Entregue').length
    };
  };

  const counts = getStatusCount();

  return (
    <div className="space-y-6 lg:space-y-8 pb-24">
      {/* Header com CTA Clara */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl lg:text-3xl font-black text-chocolate uppercase tracking-tight">
              Gestão de Pedidos
            </h2>
            <span className="text-sm font-bold text-gold bg-gold/10 px-3 py-1 rounded-full">
              {filteredOrders.length} pedidos
            </span>
          </div>
          <p className="text-chocolate/60 text-sm lg:text-base">
            Gerencie seus pedidos, acompanhe status e mantenha tudo organizado.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Filtros Rápidos */}
          <div className="hidden md:flex items-center bg-white border border-paper rounded-xl p-1">
            {Object.keys(counts).filter(k => k !== 'total').map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status as OrderStatus | 'all')}
                className={cn(
                  "px-3 lg:px-4 py-2 rounded-lg text-xs lg:text-sm font-bold uppercase tracking-widest transition-all",
                  filterStatus === status
                    ? "bg-chocolate text-white"
                    : "text-chocolate/60 hover:text-chocolate hover:bg-paper"
                )}
              >
                {counts[status as keyof typeof counts]} {status}
              </button>
            ))}
          </div>

          {/* Busca */}
          <div className="relative flex-1 lg:flex-none lg:w-80">
            <Search className="absolute left-3 lg:left-4 top-1/2 -translate-y-1/2 text-chocolate/40" size={18} />
            <input
              type="text"
              placeholder="Buscar por nome ou produto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 lg:pl-12 pr-4 py-3 lg:py-4 bg-white border border-paper rounded-xl focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold transition-all text-sm lg:text-base"
            />
          </div>

          {/* Botão Novo Pedido - Destacado */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsModalOpen(true)}
            className="relative overflow-hidden px-6 lg:px-8 py-4 bg-gradient-to-r from-chocolate to-[#3D3228] text-white rounded-xl lg:rounded-2xl font-black uppercase tracking-widest hover:shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 lg:gap-3 text-sm lg:text-base group shadow-md"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-gold to-gold-dark opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative flex items-center gap-2 lg:gap-3">
              <Plus size={18} lg:size={20} className="relative z-10" />
              Novo Pedido
            </span>
          </motion.button>
        </div>
      </header>

      {/* Cards Resumo - Quando não há pedidos */}
      {filteredOrders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl lg:rounded-3xl border border-paper p-8 lg:p-16 text-center space-y-6 lg:space-y-8"
        >
          <div className="w-16 h-16 lg:w-20 lg:h-20 bg-paper rounded-full flex items-center justify-center mx-auto text-chocolate/20 mb-4">
            <Package size={32} lg:size={40} />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl lg:text-2xl font-black text-chocolate uppercase tracking-tight">
              Nenhum pedido encontrado
            </h3>
            <p className="text-chocolate/60 text-sm lg:text-base">
              Comece adicionando pedidos para acompanhar tudo aqui!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <div className="space-y-2 text-left max-w-xs">
              <p className="text-[10px] font-bold text-gold uppercase tracking-widest">Para começar:</p>
              <ul className="text-sm text-chocolate/70 space-y-1">
                <li className="flex items-center gap-2">
                  <span className="text-gold">1.</span>
                  Clique em "Novo Pedido"
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-gold">2.</span>
                  Preencha os dados
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-gold">3.</span>
                  Confirme o pedido
                </li>
              </ul>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsModalOpen(true)}
              className="px-6 lg:px-8 py-4 bg-gradient-to-r from-gold to-gold-dark text-white rounded-xl font-black uppercase tracking-widest hover:shadow-lg transition-all text-sm lg:text-base"
            >
              Criar Primeiro Pedido
            </motion.button>
          </div>
        </motion.div>
      ) : (
        /* Lista de Pedidos - Cards Modernos */
        <div className="space-y-4 lg:space-y-6">
          <AnimatePresence mode="popLayout">
            {ordersByStatus.map((order, idx) => (
              <motion.div
                key={order.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                onClick={() => setSelectedOrder(order)}
                className="bg-white rounded-xl lg:rounded-2xl border border-paper shadow-sm hover:shadow-md hover:border-gold/30 transition-all cursor-pointer group"
              >
                {/* Card Principal */}
                <div className="p-4 lg:p-6">
                  <div className="flex items-start justify-between gap-4 lg:gap-6">
                    {/* Informações Principais */}
                    <div className="flex-1 min-w-0 space-y-2">
                      {/* Cliente e Produto */}
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-paper rounded-lg flex items-center justify-center text-lg lg:text-xl group-hover:bg-chocolate group-hover:text-white transition-colors shrink-0">
                            {idx % 2 === 0 ? '🥚' : '🐰'}
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-base lg:text-lg font-black text-chocolate uppercase tracking-tight truncate">
                              {order.customerName}
                            </h4>
                          </div>
                        </div>
                        {/* Status - Sempre Visível */}
                        <span className={cn(
                          "px-2 lg:px-3 py-1 text-[10px] lg:text-xs font-bold uppercase tracking-wider rounded-md whitespace-nowrap",
                          getStatusInfo(order.status).color === 'blue' ? "bg-blue-100 text-blue-700" :
                          getStatusInfo(order.status).color === 'orange' ? "bg-orange-100 text-orange-700" :
                          getStatusInfo(order.status).color === 'purple' ? "bg-purple-100 text-purple-700" :
                          "bg-green-100 text-green-700"
                        )}>
                          {getStatusInfo(order.status).icon} {getStatusInfo(order.status).label}
                        </span>
                      </div>
                    </div>

                    {/* Detalhes do Produto */}
                    <div className="flex items-center gap-2 lg:gap-3 text-sm">
                      <span className="px-2 lg:px-3 py-0.5 bg-gold/10 text-gold-dark text-[9px] lg:text-[10px] font-bold uppercase tracking-wider rounded-md">
                        {order.productName}
                      </span>
                      <span className="text-chocolate/60 font-semibold">
                        {order.quantity}x • {order.size}
                      </span>
                    </div>
                  </div>

                  {/* Valor - Destacado */}
                  <div className="text-right shrink-0">
                    <p className="text-lg lg:text-xl font-black text-chocolate tracking-tight">
                      {formatCurrency(order.value)}
                    </p>
                    <div className="flex items-center justify-end gap-1 mt-1">
                      {getPaymentInfo(order.paymentStatus).icon}
                      <span className="text-[10px] lg:text-xs font-bold text-chocolate/40 uppercase tracking-widest">
                        {getPaymentInfo(order.paymentStatus).label}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Informações Secundárias */}
                <div className="flex items-center justify-between pt-3 border-t border-paper">
                  <div className="flex items-center gap-2 text-sm text-chocolate/60">
                    <Calendar size={14} className="text-gold" />
                    <div>
                      <span className={cn(
                        "font-semibold",
                        getUrgencyLevel(order.deliveryDate).color === 'red' ? "text-red-500" :
                        getUrgencyLevel(order.deliveryDate).color === 'orange' ? "text-orange-500" :
                        getUrgencyLevel(order.deliveryDate).color === 'yellow' ? "text-yellow-600" :
                        "text-green-600"
                      )}>
                        {format(parseISO(order.deliveryDate), "dd MMM", { locale: ptBR })}
                      </span>
                      <span className="text-xs text-chocolate/40">
                        ({getUrgencyLevel(order.deliveryDate).message})
                      </span>
                    </div>
                  </div>

                  {/* Ações Rápidas - Sempre Visíveis */}
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        sendWhatsApp(order);
                      }}
                      className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-all"
                      title="Contato WhatsApp"
                    >
                      <WhatsApp size={16} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedOrder(order);
                      }}
                      className="p-2 bg-paper text-chocolate/60 rounded-lg hover:bg-chocolate hover:text-white transition-all"
                      title="Ver detalhes"
                    >
                      <Eye size={16} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>

    {/* Modal Novo Pedido - Redesenhado */}
    <AnimatePresence>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
            className="absolute inset-0 bg-chocolate/90 backdrop-blur-xl"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            className="relative w-full max-w-2xl lg:max-w-3xl bg-white border-4 border-chocolate rounded-2xl lg:rounded-3xl p-6 lg:p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            {/* Header do Modal */}
            <div className="flex items-center justify-between mb-6 pb-6 border-b-2 border-chocolate">
              <div className="space-y-1">
                <h3 className="text-2xl lg:text-3xl font-black text-chocolate uppercase tracking-tight">
                  Novo Pedido
                </h3>
                <p className="text-chocolate/60 text-sm lg:text-base">
                  Preencha os dados abaixo para registrar um novo pedido
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-10 h-10 bg-paper text-chocolate/60 hover:text-chocolate hover:bg-chocolate hover:text-white rounded-xl transition-all flex items-center justify-center"
              >
                <X size={20} />
              </button>
            </div>

            {/* Indicador de Progresso */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex-1 h-2 bg-paper rounded-full overflow-hidden">
                <div className="w-1/3 h-full bg-gradient-to-r from-gold to-gold-dark" />
              </div>
              <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center">
                <span className="text-[10px] font-bold text-gold">1/3</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5 lg:space-y-6">
              {/* Passo 1: Informações do Cliente */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center text-white font-bold">
                    1
                  </div>
                  <h4 className="text-lg font-bold text-chocolate">Informações do Cliente</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono font-bold text-chocolate/60 uppercase tracking-widest ml-1">Nome Completo</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gold" size={18} />
                      <input
                        required
                        type="text"
                        placeholder="Ex: Maria Silva"
                        value={formData.customerName}
                        onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 bg-paper border-2 border-paper/20 focus:border-gold focus:outline-none font-semibold text-chocolate placeholder:text-chocolate/30 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono font-bold text-chocolate/60 uppercase tracking-widest ml-1">WhatsApp</label>
                    <div className="relative">
                      <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-gold" size={18} />
                      <input
                        required
                        type="tel"
                        placeholder="Ex: (11) 99999-9999"
                        value={formData.customerWhatsapp}
                        onChange={(e) => setFormData({ ...formData, customerWhatsapp: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 bg-paper border-2 border-paper/20 focus:border-gold focus:outline-none font-semibold text-chocolate placeholder:text-chocolate/30 rounded-xl"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Passo 2: Produto */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center text-white font-bold">
                    2
                  </div>
                  <h4 className="text-lg font-bold text-chocolate">Produto</h4>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono font-bold text-chocolate/60 uppercase tracking-widest ml-1">Selecione o Produto</label>
                  <div className="relative">
                    <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-gold" size={18} />
                    <select
                      required
                      value={formData.productId}
                      onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-paper border-2 border-paper/20 focus:border-gold focus:outline-none font-semibold text-chocolate appearance-none rounded-xl"
                    >
                      <option value="">Selecione um produto...</option>
                      {menu.map(item => (
                        <option key={item.id} value={item.id}>
                          {item.name} - {formatCurrency(item.suggestedPrice)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono font-bold text-chocolate/60 uppercase tracking-widest ml-1">Quantidade</label>
                    <input
                      type="number"
                      min="1"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 bg-paper border-2 border-paper/20 focus:border-gold focus:outline-none font-semibold text-chocolate rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono font-bold text-chocolate/60 uppercase tracking-widest ml-1">Forma de Pagamento</label>
                    <select
                      value={formData.paymentMethod}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as any })}
                      className="w-full px-4 py-3 bg-paper border-2 border-paper/20 focus:border-gold focus:outline-none font-semibold text-chocolate appearance-none rounded-xl"
                    >
                      <option value="Pix">Pix</option>
                      <option value="Cartão">Cartão</option>
                      <option value="Dinheiro">Dinheiro</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Passo 3: Entrega */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center text-white font-bold">
                    3
                  </div>
                  <h4 className="text-lg font-bold text-chocolate">Data de Entrega</h4>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono font-bold text-chocolate/60 uppercase tracking-widest ml-1">Quando precisa?</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gold" size={18} />
                    <input
                      required
                      type="date"
                      value={formData.deliveryDate}
                      onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-paper border-2 border-paper/20 focus:border-gold focus:outline-none font-semibold text-chocolate rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono font-bold text-chocolate/60 uppercase tracking-widest ml-1">Observações (opcional)</label>
                  <textarea
                    value={formData.observations}
                    onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                    placeholder="Adicione detalhes especiais ou observações..."
                    rows={2}
                    className="w-full px-4 py-3 bg-paper border-2 border-paper/20 focus:border-gold focus:outline-none font-semibold text-chocolate placeholder:text-chocolate/30 rounded-xl resize-none"
                  />
                </div>
              </div>

              {/* Resumo e CTA */}
              <div className="bg-gradient-to-r from-paper to-white p-4 lg:p-6 rounded-xl border-2 border-paper/20 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-mono font-bold text-chocolate/60 uppercase tracking-widest">Valor Total</p>
                    <p className="text-2xl lg:text-3xl font-black text-chocolate tracking-tight">
                      {formatCurrency((menu.find(p => p.id === formData.productId)?.suggestedPrice || 0) * formData.quantity)}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-gold flex items-center justify-center">
                    <Target size={24} className="text-white" />
                  </div>
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-gradient-to-r from-chocolate to-[#3D3228] text-white rounded-xl font-black uppercase tracking-widest hover:shadow-lg transition-all flex items-center justify-center gap-3 text-base lg:text-lg"
                >
                  Confirmar Pedido
                  <ArrowRight size={20} />
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>

    {/* Modal Detalhes do Pedido */}
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
            className="relative w-full max-w-3xl lg:max-w-4xl bg-white border-4 border-chocolate rounded-2xl lg:rounded-3xl p-6 lg:p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6 pb-6 border-b-2 border-chocolate">
              <div className="space-y-1">
                <h3 className="text-2xl lg:text-3xl font-black text-chocolate uppercase tracking-tight">
                  Detalhes do Pedido
                </h3>
                <p className="text-chocolate/60 text-sm lg:text-base">
                  Gerencie e acompanhe este pedido
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-10 h-10 bg-paper text-chocolate/60 hover:text-chocolate hover:bg-chocolate hover:text-white rounded-xl transition-all flex items-center justify-center"
              >
                <X size={20} />
              </button>
            </div>

            {/* Informações do Cliente */}
            <div className="bg-paper p-4 lg:p-6 rounded-xl mb-6 space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-chocolate rounded-xl flex items-center justify-center text-white">
                  <User size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-chocolate">{selectedOrder.customerName}</h4>
                  <p className="text-sm text-chocolate/60 flex items-center gap-2">
                    <Smartphone size={14} />
                    {selectedOrder.customerWhatsapp}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-[10px] font-mono font-bold text-chocolate/40 uppercase tracking-widest">Produto</p>
                  <p className="text-base font-semibold text-chocolate">{selectedOrder.productName}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-mono font-bold text-chocolate/40 uppercase tracking-widest">Valor</p>
                  <p className="text-2xl font-black text-chocolate tracking-tight">{formatCurrency(selectedOrder.value)}</p>
                </div>
              </div>
            </div>

            {/* Status e Pagamento */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-3">
                <label className="text-[10px] font-mono font-bold text-chocolate/60 uppercase tracking-widest ml-1">Status do Pedido</label>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => onUpdateStatus(selectedOrder.id, e.target.value as OrderStatus)}
                  className={cn(
                    "w-full px-4 py-3 border-2 font-semibold text-base appearance-none rounded-xl transition-all",
                    selectedOrder.status === 'Novo' ? "bg-blue-50 text-blue-700 border-blue-300" :
                    selectedOrder.status === 'Em Produção' ? "bg-orange-50 text-orange-700 border-orange-300" :
                    selectedOrder.status === 'Pronto' ? "bg-purple-50 text-purple-700 border-purple-300" :
                    "bg-green-50 text-green-700 border-green-300"
                  )}
                >
                  <option value="Novo">🆕 Novo</option>
                  <option value="Em Produção">👨‍🍳 Em Produção</option>
                  <option value="Pronto">✅ Pronto</option>
                  <option value="Entregue">📦 Entregue</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-mono font-bold text-chocolate/60 uppercase tracking-widest ml-1">Status do Pagamento</label>
                <select
                  value={selectedOrder.paymentStatus}
                  onChange={(e) => onUpdatePayment(selectedOrder.id, e.target.value as PaymentStatus)}
                  className={cn(
                    "w-full px-4 py-3 border-2 font-semibold text-base appearance-none rounded-xl transition-all",
                    selectedOrder.paymentStatus === 'Aguardando' ? "bg-orange-50 text-orange-700 border-orange-300" :
                    selectedOrder.paymentStatus === 'Sinal Pago' ? "bg-yellow-50 text-yellow-700 border-yellow-300" :
                    "bg-green-50 text-green-700 border-green-300"
                  )}
                >
                  <option value="Aguardando">⏳ Aguardando</option>
                  <option value="Sinal Pago">💰 Sinal Pago</option>
                  <option value="Pago">✅ Pago</option>
                </select>
              </div>
            </div>

            {/* Detalhes Adicionais */}
            <div className="bg-white p-4 lg:p-6 rounded-xl border-2 border-paper space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-[10px] font-mono font-bold text-chocolate/40 uppercase tracking-widest">Data de Entrega</p>
                  <p className="text-base font-semibold text-chocolate flex items-center gap-2">
                    <Calendar size={16} className="text-gold" />
                    {format(parseISO(selectedOrder.deliveryDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-mono font-bold text-chocolate/40 uppercase tracking-widest">Prazo</p>
                  <p className="text-base font-semibold text-chocolate">{selectedOrder.size}</p>
                </div>
              </div>

              {selectedOrder.observations && (
                <div>
                  <p className="text-[10px] font-mono font-bold text-chocolate/40 uppercase tracking-widest ml-1">Observações</p>
                  <p className="text-sm text-chocolate/80 italic bg-paper p-3 rounded-lg">
                    "{selectedOrder.observations}"
                  </p>
                </div>
              )}
            </div>

            {/* Ações */}
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => sendWhatsApp(selectedOrder)}
                className="flex-1 py-4 bg-green-600 text-white rounded-xl font-bold uppercase tracking-widest hover:bg-green-700 transition-all flex items-center justify-center gap-2 text-sm lg:text-base"
              >
                <WhatsApp size={20} />
                Contato WhatsApp
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (confirm('Tem certeza que deseja excluir este pedido?')) {
                    onDeleteOrder(selectedOrder.id);
                    setSelectedOrder(null);
                  }
                }}
                className="px-6 py-4 bg-red-50 text-red-600 rounded-xl font-bold uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-2 text-sm lg:text-base"
              >
                <Trash2 size={20} />
                Excluir Pedido
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
