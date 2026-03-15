import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  Download, 
  Share2, 
  Palette,
  Check,
  ChevronRight,
  Layout as LayoutIcon,
  Image as ImageIcon,
  Type
} from 'lucide-react';
import { RECIPES } from '../data/recipes';
import { Recipe } from '../types';
import { formatCurrency, cn } from '../lib/utils';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface MenuItem extends Recipe {
  customPrice?: number;
}

export function MenuCreator() {
  const [selectedItems, setSelectedItems] = useState<MenuItem[]>([]);
  const [menuTitle, setMenuTitle] = useState('Cardápio de Páscoa 2026');
  const [isAdding, setIsAdding] = useState(false);
  const [theme, setTheme] = useState<'classic' | 'modern' | 'luxury'>('luxury');

  const addItem = (recipe: Recipe) => {
    if (selectedItems.find(i => i.id === recipe.id)) return;
    setSelectedItems([...selectedItems, { ...recipe, customPrice: recipe.suggestedPrice }]);
    setIsAdding(false);
  };

  const removeItem = (id: string) => {
    setSelectedItems(selectedItems.filter(i => i.id !== id));
  };

  const updatePrice = (id: string, price: number) => {
    setSelectedItems(selectedItems.map(i => i.id === id ? { ...i, customPrice: price } : i));
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(45, 36, 30); // Chocolate color
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text(menuTitle, 105, 25, { align: 'center' });
    
    // Content
    let y = 60;
    selectedItems.forEach((item, index) => {
      if (y > 250) {
        doc.addPage();
        y = 20;
      }
      
      doc.setTextColor(45, 36, 30);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(item.name, 20, y);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      const description = doc.splitTextToSize(item.description, 130);
      doc.text(description, 20, y + 7);
      
      doc.setTextColor(184, 134, 11); // Gold color
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(formatCurrency(item.customPrice || item.suggestedPrice), 190, y + 5, { align: 'right' });
      
      y += 15 + (description.length * 5);
      
      // Divider
      doc.setDrawColor(230, 230, 230);
      doc.line(20, y - 5, 190, y - 5);
      y += 5;
    });
    
    // Footer
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text('Faça seu pedido pelo WhatsApp!', 105, 285, { align: 'center' });
    
    doc.save('cardapio-pascoa.pdf');
  };

  return (
    <div className="space-y-10 pb-24">
      <header className="space-y-2">
        <h2 className="text-4xl md:text-6xl font-serif italic font-light tracking-tight text-chocolate">
          Criador de <span className="font-bold not-italic">Cardápio</span>
        </h2>
        <p className="text-gold font-bold uppercase tracking-[0.3em] text-xs">
          Personalize sua vitrine e encante seus clientes
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Editor Section */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-[40px] p-8 border border-paper shadow-xl space-y-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-gold uppercase tracking-widest ml-1">Título do Cardápio</label>
              <div className="flex gap-4">
                <input 
                  type="text"
                  value={menuTitle}
                  onChange={e => setMenuTitle(e.target.value)}
                  className="flex-1 bg-paper border-none rounded-2xl px-6 py-4 text-chocolate font-bold focus:ring-2 focus:ring-gold/20 transition-all"
                />
                <div className="flex gap-2">
                  {(['classic', 'modern', 'luxury'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTheme(t)}
                      className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center transition-all border-2",
                        theme === t ? "border-gold bg-gold/10 text-gold" : "border-paper bg-paper text-chocolate/40"
                      )}
                    >
                      <Palette size={20} />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-chocolate uppercase tracking-tighter">Itens Selecionados</h3>
                <button 
                  onClick={() => setIsAdding(true)}
                  className="flex items-center gap-2 bg-chocolate text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-chocolate-light transition-all"
                >
                  <Plus size={14} />
                  Adicionar Item
                </button>
              </div>

              <div className="space-y-4">
                {selectedItems.length > 0 ? (
                  selectedItems.map((item) => (
                    <motion.div 
                      layout
                      key={item.id} 
                      className="flex items-center justify-between p-6 bg-paper/30 rounded-3xl border border-paper group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-3xl">
                          🥚
                        </div>
                        <div>
                          <p className="font-black text-chocolate leading-tight">{item.name}</p>
                          <p className="text-[10px] font-bold text-chocolate/40 uppercase tracking-widest mt-1">{item.category}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-gold uppercase tracking-widest block text-right">Preço de Venda</label>
                          <input 
                            type="number"
                            value={item.customPrice}
                            onChange={e => updatePrice(item.id, Number(e.target.value))}
                            className="w-24 bg-white border-none rounded-xl px-3 py-2 text-right text-gold font-black focus:ring-2 focus:ring-gold/20 transition-all"
                          />
                        </div>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="p-3 text-chocolate/40 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-20 border-2 border-dashed border-paper rounded-[40px] space-y-4">
                    <div className="text-6xl opacity-10">📖</div>
                    <p className="text-chocolate/60 font-bold uppercase tracking-widest text-xs">Seu cardápio está vazio</p>
                    <button 
                      onClick={() => setIsAdding(true)}
                      className="text-gold font-black uppercase tracking-widest text-[10px] hover:underline"
                    >
                      Começar a adicionar
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Preview & Actions */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-[40px] p-8 border border-paper shadow-xl sticky top-8 space-y-8">
            <h3 className="text-xl font-black text-chocolate uppercase tracking-tighter">Ações</h3>
            
            <div className="space-y-4">
              <button 
                onClick={exportPDF}
                disabled={selectedItems.length === 0}
                className="w-full flex items-center justify-center gap-3 bg-gold text-white py-5 rounded-3xl font-black uppercase tracking-widest text-xs hover:bg-gold-dark transition-all shadow-xl shadow-gold/20 disabled:opacity-50 disabled:shadow-none"
              >
                <Download size={18} />
                Exportar PDF
              </button>
              <button 
                disabled={selectedItems.length === 0}
                className="w-full flex items-center justify-center gap-3 bg-paper text-chocolate py-5 rounded-3xl font-black uppercase tracking-widest text-xs hover:bg-chocolate hover:text-white transition-all disabled:opacity-50"
              >
                <Share2 size={18} />
                Enviar via WhatsApp
              </button>
            </div>

            <div className="pt-6 border-top border-paper space-y-4">
              <h4 className="text-[10px] font-black text-gold uppercase tracking-widest">Dicas de Design</h4>
              <div className="space-y-3">
                {[
                  { icon: LayoutIcon, text: "Mantenha entre 5 e 10 itens para não confundir o cliente." },
                  { icon: ImageIcon, text: "Use nomes criativos para suas receitas." },
                  { icon: Type, text: "Revise os preços antes de exportar." }
                ].map((tip, i) => (
                  <div key={i} className="flex gap-3 text-xs text-chocolate/60 font-medium">
                    <tip.icon size={14} className="text-gold shrink-0" />
                    {tip.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recipe Selection Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdding(false)}
              className="absolute inset-0 bg-chocolate/60 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[40px] p-8 md:p-12 shadow-2xl overflow-hidden max-h-[80vh] flex flex-col"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black text-chocolate uppercase tracking-tighter">Escolha suas Receitas</h3>
                <button onClick={() => setIsAdding(false)} className="text-chocolate/60 hover:text-chocolate font-black uppercase tracking-widest text-[10px]">Fechar</button>
              </div>

              <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                {RECIPES.map((recipe) => {
                  const isSelected = selectedItems.find(i => i.id === recipe.id);
                  return (
                    <button
                      key={recipe.id}
                      onClick={() => addItem(recipe)}
                      disabled={!!isSelected}
                      className={cn(
                        "w-full flex items-center justify-between p-4 rounded-2xl border transition-all text-left",
                        isSelected ? "bg-paper/50 border-paper opacity-50" : "bg-white border-paper hover:border-gold hover:shadow-lg"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-paper flex items-center justify-center text-xl">
                          🥚
                        </div>
                        <div>
                          <p className="font-black text-chocolate">{recipe.name}</p>
                          <p className="text-[10px] font-bold text-chocolate/40 uppercase tracking-widest">{recipe.category}</p>
                        </div>
                      </div>
                      {isSelected ? <Check className="text-green-500" size={20} /> : <Plus className="text-gold" size={20} />}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
