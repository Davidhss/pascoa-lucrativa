import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Calculator, 
  Plus, 
  Trash2, 
  TrendingUp, 
  DollarSign, 
  Percent,
  Info,
  ChevronRight
} from 'lucide-react';
import { formatCurrency, cn } from '../lib/utils';

interface Ingredient {
  id: string;
  name: string;
  price: number;
  quantity: number;
  unit: string;
  used: number;
}

export function Pricing() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [newItem, setNewItem] = useState({ name: '', price: 0, quantity: 1, unit: 'g', used: 0 });
  const [profitMargin, setProfitMargin] = useState(100); // 100% markup by default
  const [laborCost, setLaborCost] = useState(20); // 20% labor cost
  const [otherCosts, setOtherCosts] = useState(10); // 10% other costs (packaging, etc)

  const addIngredient = () => {
    if (!newItem.name || newItem.price <= 0) return;
    setIngredients([...ingredients, { ...newItem, id: Date.now().toString() }]);
    setNewItem({ name: '', price: 0, quantity: 1, unit: 'g', used: 0 });
  };

  const removeIngredient = (id: string) => {
    setIngredients(ingredients.filter(i => i.id !== id));
  };

  const totalIngredientsCost = ingredients.reduce((acc, curr) => {
    const unitCost = curr.price / curr.quantity;
    return acc + (unitCost * curr.used);
  }, 0);

  const laborValue = totalIngredientsCost * (laborCost / 100);
  const otherValue = totalIngredientsCost * (otherCosts / 100);
  const baseCost = totalIngredientsCost + laborValue + otherValue;
  const profitValue = baseCost * (profitMargin / 100);
  const suggestedPrice = baseCost + profitValue;

  return (
    <div className="space-y-10 pb-24">
      <header className="space-y-2">
        <h2 className="text-4xl md:text-6xl font-serif italic font-light tracking-tight text-chocolate">
          Calculadora de <span className="font-bold not-italic">Lucro</span>
        </h2>
        <p className="text-gold font-bold uppercase tracking-[0.3em] text-xs">
          Aprenda a cobrar o preço justo e valorize seu trabalho
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Section */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-[40px] p-8 border border-paper shadow-xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 rounded-2xl bg-gold/10 text-gold">
                <Plus size={24} />
              </div>
              <h3 className="text-xl font-black text-chocolate uppercase tracking-tighter">Adicionar Ingrediente</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gold uppercase tracking-widest ml-1">Nome do Ingrediente</label>
                <input 
                  type="text"
                  placeholder="Ex: Chocolate Belga"
                  value={newItem.name}
                  onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                  className="w-full bg-paper border-none rounded-2xl px-6 py-4 text-chocolate font-bold placeholder:text-chocolate/40 focus:ring-2 focus:ring-gold/20 transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gold uppercase tracking-widest ml-1">Preço Pago</label>
                  <input 
                    type="number"
                    placeholder="R$ 0,00"
                    value={newItem.price || ''}
                    onChange={e => setNewItem({ ...newItem, price: Number(e.target.value) })}
                    className="w-full bg-paper border-none rounded-2xl px-6 py-4 text-chocolate font-bold focus:ring-2 focus:ring-gold/20 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gold uppercase tracking-widest ml-1">Qtd Comprada</label>
                  <div className="flex gap-2">
                    <input 
                      type="number"
                      value={newItem.quantity || ''}
                      onChange={e => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
                      className="w-full bg-paper border-none rounded-2xl px-4 py-4 text-chocolate font-bold focus:ring-2 focus:ring-gold/20 transition-all"
                    />
                    <select 
                      value={newItem.unit}
                      onChange={e => setNewItem({ ...newItem, unit: e.target.value })}
                      className="bg-paper border-none rounded-2xl px-2 py-4 text-chocolate font-bold focus:ring-2 focus:ring-gold/20 transition-all"
                    >
                      <option value="g">g</option>
                      <option value="kg">kg</option>
                      <option value="ml">ml</option>
                      <option value="un">un</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-[10px] font-black text-gold uppercase tracking-widest ml-1">Quantidade Usada na Receita</label>
                <div className="flex gap-4">
                  <input 
                    type="number"
                    placeholder="Quanto você usou?"
                    value={newItem.used || ''}
                    onChange={e => setNewItem({ ...newItem, used: Number(e.target.value) })}
                    className="flex-1 bg-paper border-none rounded-2xl px-6 py-4 text-chocolate font-bold focus:ring-2 focus:ring-gold/20 transition-all"
                  />
                  <button 
                    onClick={addIngredient}
                    className="bg-gold text-white px-8 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gold-dark transition-all shadow-lg shadow-gold/20"
                  >
                    Adicionar
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* List Section */}
          <div className="bg-white rounded-[40px] p-8 border border-paper shadow-xl overflow-hidden">
            <h3 className="text-xl font-black text-chocolate uppercase tracking-tighter mb-6">Ingredientes da Receita</h3>
            <div className="space-y-3">
              {ingredients.length > 0 ? (
                ingredients.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-paper/30 rounded-2xl border border-paper group">
                    <div>
                      <p className="font-black text-chocolate">{item.name}</p>
                      <p className="text-[10px] font-bold text-chocolate/40 uppercase tracking-widest">
                        {item.used}{item.unit} usados de {item.quantity}{item.unit}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="font-black text-gold">
                        {formatCurrency((item.price / item.quantity) * item.used)}
                      </p>
                      <button 
                        onClick={() => removeIngredient(item.id)}
                        className="p-2 text-chocolate/40 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 space-y-3">
                  <div className="text-4xl opacity-20">🥚</div>
                  <p className="text-chocolate/60 font-bold uppercase tracking-widest text-[10px]">Nenhum ingrediente adicionado</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-chocolate text-white rounded-[40px] p-10 shadow-2xl relative overflow-hidden">
            <div className="relative z-10 space-y-8">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white/10 text-gold">
                  <Calculator size={20} />
                </div>
                <h3 className="text-lg font-black uppercase tracking-tighter">Resumo de Precificação</h3>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm text-white">
                  <span className="opacity-60 font-bold uppercase tracking-widest">Custo de Ingredientes</span>
                  <span className="font-black">{formatCurrency(totalIngredientsCost)}</span>
                </div>
                <div className="flex justify-between items-center text-sm text-white">
                  <span className="opacity-60 font-bold uppercase tracking-widest">Mão de Obra ({laborCost}%)</span>
                  <span className="font-black">{formatCurrency(laborValue)}</span>
                </div>
                <div className="flex justify-between items-center text-sm text-white">
                  <span className="opacity-60 font-bold uppercase tracking-widest">Outros Custos ({otherCosts}%)</span>
                  <span className="font-black">{formatCurrency(otherValue)}</span>
                </div>
                <div className="h-px bg-white/10 my-2" />
                <div className="flex justify-between items-center text-white">
                  <span className="text-gold font-black uppercase tracking-widest text-xs">Custo Total de Produção</span>
                  <span className="text-2xl font-black">{formatCurrency(baseCost)}</span>
                </div>
              </div>

              <div className="pt-4 space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-white">
                    <label className="text-[10px] font-black text-gold uppercase tracking-widest">Margem de Lucro Desejada</label>
                    <span className="text-xl font-black">{profitMargin}%</span>
                  </div>
                  <input 
                    type="range"
                    min="30"
                    max="300"
                    step="5"
                    value={profitMargin}
                    onChange={e => setProfitMargin(Number(e.target.value))}
                    className="w-full accent-gold bg-white/10 h-1.5 rounded-full appearance-none cursor-pointer"
                  />
                </div>

                <div className="bg-white/5 rounded-3xl p-6 border border-white/10 text-center space-y-2 text-white">
                  <p className="text-[10px] font-black text-gold uppercase tracking-[0.2em]">Preço de Venda Sugerido</p>
                  <p className="text-5xl font-black tracking-tighter text-white">{formatCurrency(suggestedPrice)}</p>
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                    Lucro Líquido: {formatCurrency(profitValue)}
                  </p>
                </div>
              </div>
            </div>

            {/* Decoration */}
            <div className="absolute -right-20 -bottom-20 text-white/5">
              <TrendingUp size={300} strokeWidth={0.5} />
            </div>
          </div>

          {/* Tips Section */}
          <div className="bg-gold/5 rounded-[40px] p-8 border border-gold/10 space-y-6">
            <div className="flex items-center gap-3">
              <Info className="text-gold" size={20} />
              <h4 className="font-black text-chocolate uppercase tracking-tighter">Dicas de Ouro</h4>
            </div>
            <ul className="space-y-4">
              {[
                "Não esqueça de incluir o custo da embalagem nos 'Outros Custos'.",
                "Sua mão de obra é o seu salário, não o lucro da empresa!",
                "Pesquise o preço da concorrência, mas não desvalorize seu produto.",
                "Margens acima de 100% são ideais para produtos artesanais de luxo."
              ].map((tip, i) => (
                <li key={i} className="flex gap-3 text-sm text-chocolate/70 font-medium">
                  <ChevronRight size={16} className="text-gold shrink-0 mt-0.5" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
