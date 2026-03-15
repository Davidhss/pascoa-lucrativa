import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart as PieChartIcon, 
  ArrowUpRight, 
  ArrowDownRight,
  Plus,
  Calendar,
  Tag,
  ChevronRight,
  Target,
  Trash2,
  Download,
  AlertCircle,
  CheckCircle2,
  X,
  Package
} from 'lucide-react';
import { Order, Cost, UserSettings, CostCategory } from '../types';
import { formatCurrency, cn } from '../lib/utils';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

interface FinanceProps {
  orders: Order[];
  costs: Cost[];
  onAddCost: (cost: Omit<Cost, 'id'>) => void;
  onDeleteCost: (id: string) => void;
  onMarkAsPaid: (id: string) => void;
  confectioneryName: string;
  settings: UserSettings;
}

export function Finance({ 
  orders, 
  costs, 
  onAddCost, 
  onDeleteCost, 
  onMarkAsPaid, 
  confectioneryName,
  settings 
}: FinanceProps) {
  const [isCostModalOpen, setIsCostModalOpen] = useState(false);
  const [costForm, setCostForm] = useState({
    description: '',
    category: 'Ingredientes' as CostCategory,
    value: '',
    date: new Date().toISOString().split('T')[0],
  });

  const totalRevenue = orders
    .filter(o => o.paymentStatus === 'Pago')
    .reduce((acc, curr) => acc + curr.value, 0);
  
  const totalCosts = costs.reduce((acc, curr) => acc + curr.value, 0);
  const profit = totalRevenue - totalCosts;
  const profitMargin = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0;

  const unpaidOrders = orders.filter(o => o.paymentStatus !== 'Pago');

  // Chart Data
  const chartData = [
    { name: 'Semana 1', revenue: totalRevenue * 0.1, costs: totalCosts * 0.1 },
    { name: 'Semana 2', revenue: totalRevenue * 0.25, costs: totalCosts * 0.2 },
    { name: 'Semana 3', revenue: totalRevenue * 0.4, costs: totalCosts * 0.4 },
    { name: 'Semana 4', revenue: totalRevenue * 0.25, costs: totalCosts * 0.3 },
  ];

  const pieData = [
    { name: 'Lucro', value: Math.max(0, profit), color: '#D4AF37' },
    { name: 'Custos', value: totalCosts, color: '#2D241E' },
  ];

  const handleAddCost = (e: React.FormEvent) => {
    e.preventDefault();
    onAddCost({
      ...costForm,
      value: Number(costForm.value),
    });
    setCostForm({
      description: '',
      category: 'Ingredientes',
      value: '',
      date: new Date().toISOString().split('T')[0],
    });
    setIsCostModalOpen(false);
  };

  const exportPDF = () => {
    const doc = new jsPDF() as any;
    doc.setFontSize(20);
    doc.text(`Resumo Financeiro - ${confectioneryName}`, 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Faturamento: ${formatCurrency(totalRevenue)}`, 20, 35);
    doc.text(`Custos: ${formatCurrency(totalCosts)}`, 20, 42);
    doc.text(`Lucro Líquido: ${formatCurrency(profit)}`, 20, 49);

    doc.autoTable({
      startY: 60,
      head: [['Data', 'Descrição', 'Categoria', 'Valor']],
      body: costs.map(c => [c.date, c.description, c.category, formatCurrency(c.value)]),
    });

    doc.save('financeiro-pascoa.pdf');
  };

  return (
    <div className="space-y-8 lg:space-y-10 pb-20">
      {/* Editorial Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 lg:gap-6">
        <div className="space-y-2">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif italic font-light tracking-tight text-chocolate">
            Seu <span className="font-bold not-italic">Financeiro</span>
          </h2>
          <p className="text-gold font-black uppercase tracking-[0.2em] lg:tracking-[0.3em] text-xs">
            Visão clara dos seus lucros e investimentos
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={exportPDF}
            className="px-5 lg:px-6 py-3 lg:py-4 bg-paper text-chocolate rounded-xl lg:rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-chocolate hover:text-white transition-all flex items-center justify-center gap-2 text-sm lg:text-base"
          >
            <Download size={16} lg:size={18} /> Exportar PDF
          </button>
          <div className="flex items-center gap-3 lg:gap-4 bg-paper px-4 lg:px-6 py-3 lg:py-4 rounded-2xl lg:rounded-3xl border border-chocolate/5">
            <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold">
              <Target size={16} lg:size={20} />
            </div>
            <div>
              <p className="text-[9px] lg:text-[10px] font-black text-chocolate/50 uppercase tracking-widest leading-none">Meta</p>
              <p className="text-base lg:text-lg font-black text-chocolate">{formatCurrency(settings.revenueGoal)}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Bento Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        {/* Main Profit Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:col-span-2 bg-chocolate rounded-3xl p-6 lg:p-10 text-white relative overflow-hidden shadow-2xl shadow-chocolate/20"
        >
          <div className="relative z-10 flex flex-col h-full justify-between gap-6 lg:gap-10">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-[10px] lg:text-xs font-black text-white/60 uppercase tracking-[0.15em] lg:tracking-[0.2em]">Lucro Líquido Estimado</p>
                <h3 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter">{formatCurrency(profit)}</h3>
              </div>
              <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl lg:rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-center">
                <TrendingUp size={24} lg:size={32} className="text-gold" />
              </div>
            </div>

            <div className="flex flex-wrap gap-4 lg:gap-8">
              <div className="space-y-1">
                <p className="text-[9px] lg:text-[10px] font-black text-white/60 uppercase tracking-widest">Margem de Lucro</p>
                <p className="text-xl lg:text-2xl font-black text-gold">{profitMargin.toFixed(1)}%</p>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] lg:text-[10px] font-black text-white/60 uppercase tracking-widest">Faturamento</p>
                <p className="text-xl lg:text-2xl font-black">{formatCurrency(totalRevenue)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] lg:text-[10px] font-black text-white/60 uppercase tracking-widest">Custos Totais</p>
                <p className="text-xl lg:text-2xl font-black text-white/70">{formatCurrency(totalCosts)}</p>
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute -right-16 -bottom-16 lg:-right-20 lg:-bottom-20 w-48 h-48 lg:w-80 lg:h-80 bg-gold/10 rounded-full blur-3xl" />
          <div className="absolute -left-12 -top-12 lg:-left-20 lg:-top-20 w-40 h-40 lg:w-60 lg:h-60 bg-white/5 rounded-full blur-2xl" />
        </motion.div>

        {/* Distribution Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-[48px] p-10 border border-paper shadow-xl flex flex-col items-center justify-center text-center"
        >
          <div className="w-full h-48 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <h4 className="text-xl font-black text-chocolate uppercase tracking-tighter">Distribuição</h4>
          <p className="text-sm text-chocolate/70 font-medium">Equilíbrio entre custos e ganhos</p>
        </motion.div>
      </div>

      {/* Charts and Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Performance Chart */}
        <div className="bg-white rounded-[48px] p-10 border border-paper shadow-xl space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-chocolate uppercase tracking-tighter">Performance</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gold" />
                <span className="text-[10px] font-black text-chocolate/70 uppercase tracking-widest">Receita</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-chocolate" />
                <span className="text-[10px] font-black text-chocolate/70 uppercase tracking-widest">Custos</span>
              </div>
            </div>
          </div>
          
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F5F2ED" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#6B5E54', fontSize: 12, fontWeight: 700 }}
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '24px', 
                    border: 'none', 
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    padding: '16px'
                  }} 
                />
                <Area type="monotone" dataKey="revenue" stroke="#D4AF37" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="costs" stroke="#2D241E" strokeWidth={4} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pendentes e Custos */}
        <div className="space-y-10">
          {/* Recent Costs */}
          <div className="bg-white rounded-[48px] p-10 border border-paper shadow-xl space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black text-chocolate uppercase tracking-tighter">Últimos Custos</h3>
              <button 
                onClick={() => setIsCostModalOpen(true)}
                className="w-10 h-10 rounded-2xl bg-paper text-gold hover:bg-chocolate hover:text-white transition-all flex items-center justify-center"
              >
                <Plus size={20} />
              </button>
            </div>

            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
              {costs.length > 0 ? (
                costs.map((cost) => (
                  <div key={cost.id} className="flex items-center justify-between p-4 rounded-3xl hover:bg-paper transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-paper flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                        📦
                      </div>
                      <div>
                        <p className="font-black text-chocolate leading-tight">{cost.description}</p>
                        <p className="text-[10px] font-bold text-chocolate/60 uppercase tracking-widest">{cost.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="text-lg font-black text-chocolate">{formatCurrency(cost.value)}</p>
                      <button 
                        onClick={() => onDeleteCost(cost.id)}
                        className="w-8 h-8 rounded-lg bg-red-50 text-red-500 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-10 text-center space-y-2">
                  <p className="text-4xl">📉</p>
                  <p className="text-xs font-black text-chocolate/60 uppercase tracking-widest">Nenhum custo registrado</p>
                </div>
              )}
            </div>
          </div>

          {/* Pendentes */}
          <div className="bg-white rounded-[48px] p-10 border border-paper shadow-xl space-y-8">
            <div className="flex items-center gap-3">
              <AlertCircle className="text-orange-500" size={24} />
              <h3 className="text-2xl font-black text-chocolate uppercase tracking-tighter">Pendentes</h3>
            </div>

            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
              {unpaidOrders.length > 0 ? (
                unpaidOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 rounded-3xl bg-orange-50/30 border border-orange-100 group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-xl">
                        👤
                      </div>
                      <div>
                        <p className="font-black text-chocolate leading-tight">{order.customerName}</p>
                        <p className="text-[10px] font-bold text-chocolate/60 uppercase tracking-widest">{order.productName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="font-black text-chocolate">{formatCurrency(order.value)}</p>
                      <button 
                        onClick={() => onMarkAsPaid(order.id)}
                        className="w-10 h-10 rounded-xl bg-green-100 text-green-600 hover:bg-green-600 hover:text-white transition-all flex items-center justify-center"
                      >
                        <CheckCircle2 size={20} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-10 text-center space-y-2">
                  <p className="text-4xl">✨</p>
                  <p className="text-xs font-black text-chocolate/60 uppercase tracking-widest">Tudo em dia!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Cost Modal */}
      <AnimatePresence>
        {isCostModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCostModalOpen(false)}
              className="absolute inset-0 bg-chocolate/60 backdrop-blur-xl"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[48px] overflow-hidden shadow-2xl p-10 md:p-12"
            >
              <div className="flex items-center justify-between mb-10">
                <div className="space-y-1">
                  <h3 className="text-3xl font-black text-chocolate uppercase tracking-tighter">Novo Custo</h3>
                  <p className="text-chocolate/50 font-medium">Registre uma despesa</p>
                </div>
                <button 
                  onClick={() => setIsCostModalOpen(false)}
                  className="w-12 h-12 rounded-full bg-paper text-chocolate/60 hover:text-chocolate transition-all flex items-center justify-center"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleAddCost} className="space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gold uppercase tracking-widest ml-4">Descrição</label>
                  <input 
                    required
                    type="text"
                    placeholder="Ex: 10kg de Chocolate Belga"
                    value={costForm.description}
                    onChange={(e) => setCostForm({...costForm, description: e.target.value})}
                    className="w-full px-6 py-4 bg-paper rounded-2xl focus:outline-none focus:ring-2 focus:ring-gold/20 font-bold text-chocolate"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gold uppercase tracking-widest ml-4">Categoria</label>
                    <select 
                      value={costForm.category}
                      onChange={(e) => setCostForm({...costForm, category: e.target.value as CostCategory})}
                      className="w-full px-6 py-4 bg-paper rounded-2xl focus:outline-none focus:ring-2 focus:ring-gold/20 font-bold text-chocolate appearance-none"
                    >
                      <option value="Ingredientes">Ingredientes</option>
                      <option value="Embalagens">Embalagens</option>
                      <option value="Outros">Outros</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gold uppercase tracking-widest ml-4">Valor (R$)</label>
                    <input 
                      required
                      type="number"
                      placeholder="0.00"
                      value={costForm.value}
                      onChange={(e) => setCostForm({...costForm, value: e.target.value})}
                      className="w-full px-6 py-4 bg-paper rounded-2xl focus:outline-none focus:ring-2 focus:ring-gold/20 font-bold text-chocolate"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full py-5 bg-gold text-white rounded-3xl font-black text-lg shadow-xl shadow-gold/20 hover:bg-gold-dark transition-all flex items-center justify-center gap-2"
                >
                  <Plus size={24} />
                  Salvar Custo
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
