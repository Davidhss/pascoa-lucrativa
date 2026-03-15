import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Heart, 
  Plus, 
  Printer, 
  Clock, 
  Star, 
  ChevronRight,
  X,
  Check,
  ClipboardList,
  Utensils,
  Filter,
  ArrowRight,
  Info,
  TrendingUp,
  FileText,
  ChefHat
} from 'lucide-react';
import { RECIPES } from '../data/recipes';
import { Recipe, Category } from '../types';
import { formatCurrency, cn } from '../lib/utils';
import { jsPDF } from 'jspdf';

interface RecipesProps {
  onAddToMenu: (recipe: Recipe, price: number) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

export function Recipes({ onAddToMenu, favorites, onToggleFavorite }: RecipesProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category | 'Todos'>('Todos');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [menuPrice, setMenuPrice] = useState('');

  const filteredRecipes = RECIPES.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        recipe.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'Todos' || recipe.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const categories: (Category | 'Todos')[] = ['Todos', 'Clássico', 'Gourmet', 'Infantil', 'Diet'];

  const printRecipe = (recipe: Recipe) => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.setTextColor(45, 36, 30); // Chocolate
    doc.text(recipe.name, 20, 20);
    
    doc.setFontSize(12);
    doc.setTextColor(158, 142, 129); // Muted
    doc.text(`Categoria: ${recipe.category} | Dificuldade: ${recipe.difficulty}`, 20, 30);
    doc.text(`Tempo: ${recipe.time} | Validade: ${recipe.validity}`, 20, 38);
    
    doc.setFontSize(16);
    doc.setTextColor(45, 36, 30);
    doc.text('Ingredientes:', 20, 50);
    doc.setFontSize(12);
    recipe.ingredients.forEach((ing, i) => {
      doc.text(`• ${ing.item}: ${ing.amount}`, 25, 60 + (i * 7));
    });

    const startY = 60 + (recipe.ingredients.length * 7) + 10;
    doc.setFontSize(16);
    doc.text('Modo de Preparo:', 20, startY);
    doc.setFontSize(12);
    const splitText = doc.splitTextToSize(recipe.instructions.join('\n\n'), 170);
    doc.text(splitText, 20, startY + 10);

    doc.save(`${recipe.name}.pdf`);
  };

  return (
    <div className="space-y-8 lg:space-y-10">
      {/* Editorial Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif italic font-light tracking-tight text-chocolate">
            Seu <span className="font-bold not-italic">Cardápio</span>
          </h2>
          <p className="text-gold font-black uppercase tracking-[0.2em] lg:tracking-[0.3em] text-xs">
            {RECIPES.length} receitas exclusivas para lucrar
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative group flex-1 md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-chocolate/70 group-focus-within:text-gold transition-colors" size={18} />
            <input
              type="text"
              placeholder="Buscar receita..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 lg:py-4 bg-white border border-paper rounded-xl lg:rounded-2xl focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold transition-all font-medium text-chocolate text-sm lg:text-base"
            />
          </div>

          <div className="relative md:w-48">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-chocolate/70" size={18} />
            <select
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value as Category | 'Todos')}
              className="w-full pl-12 pr-4 py-3 lg:py-4 bg-white border border-paper rounded-xl lg:rounded-2xl focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold transition-all font-medium text-chocolate appearance-none text-sm lg:text-base"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* Recipe Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
        {filteredRecipes.map((recipe, idx) => (
          <motion.div
            key={recipe.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="group bg-white rounded-3xl overflow-hidden border border-paper shadow-xl hover:shadow-2xl transition-all cursor-pointer flex flex-col"
            onClick={() => setSelectedRecipe(recipe)}
          >
            <div className="relative h-48 lg:h-64 overflow-hidden bg-paper/30 flex items-center justify-center">
              {recipe.icon ? (
                <div className="text-6xl lg:text-8xl group-hover:scale-125 transition-transform duration-700 select-none">
                  {recipe.icon}
                </div>
              ) : (
                <img
                  src={recipe.image}
                  alt={recipe.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-chocolate/40 via-transparent to-transparent opacity-60" />

              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(recipe.id);
                  }}
                  className={cn(
                    "w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl flex items-center justify-center transition-all backdrop-blur-md",
                    favorites.includes(recipe.id)
                      ? "bg-red-500 text-white"
                      : "bg-white/20 text-white hover:bg-white/40"
                  )}
                >
                  <Heart size={18} lg:size={20} fill={favorites.includes(recipe.id) ? "currentColor" : "none"} />
                </button>
              </div>

              <div className="absolute bottom-4 left-4 right-4">
                <span className="px-3 py-1 bg-gold text-white text-[9px] lg:text-[10px] font-black uppercase tracking-widest rounded-full">
                  {recipe.category}
                </span>
              </div>
            </div>

            <div className="p-6 lg:p-8 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-xl lg:text-2xl font-black text-chocolate leading-tight mb-2 group-hover:text-gold transition-colors">
                  {recipe.name}
                </h3>
                <p className="text-sm lg:text-base text-chocolate/60 line-clamp-2 font-medium">
                  {recipe.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-paper">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-gold uppercase tracking-widest">Sugestão</p>
                  <p className="text-lg lg:text-xl font-black text-chocolate">{formatCurrency(recipe.suggestedPrice)}</p>
                </div>
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl bg-paper flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-white transition-all">
                  <ArrowRight size={18} lg:size={20} />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recipe Detail Modal */}
      <AnimatePresence>
        {selectedRecipe && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRecipe(null)}
              className="absolute inset-0 bg-chocolate/60 backdrop-blur-xl"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-5xl bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
            >
              <button
                onClick={() => setSelectedRecipe(null)}
                className="absolute top-4 right-4 z-20 w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white hover:text-chocolate transition-all flex items-center justify-center"
              >
                <X size={20} lg:size={24} />
              </button>

              {/* Left: Image & Quick Info */}
              <div className="md:w-2/5 relative h-48 md:h-auto bg-chocolate flex items-center justify-center overflow-hidden">
                {selectedRecipe.icon ? (
                  <div className="text-8xl lg:text-[12rem] select-none relative z-10 drop-shadow-2xl">
                    {selectedRecipe.icon}
                  </div>
                ) : (
                  <img
                    src={selectedRecipe.image}
                    alt={selectedRecipe.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-chocolate via-transparent to-transparent md:bg-gradient-to-r opacity-80" />

                <div className="absolute bottom-4 left-4 right-4 lg:bottom-8 lg:left-8 lg:right-8 space-y-4 lg:space-y-6">
                  <div className="space-y-2">
                    <span className="px-3 py-1 bg-gold text-white text-[9px] lg:text-[10px] font-black uppercase tracking-widest rounded-full">
                      {selectedRecipe.category}
                    </span>
                    <h3 className="text-2xl lg:text-4xl font-black text-white leading-tight">
                      {selectedRecipe.name}
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-3 lg:gap-4">
                    <div className="bg-white/10 backdrop-blur-md p-3 lg:p-4 rounded-2xl lg:rounded-3xl border border-white/10">
                      <p className="text-[9px] lg:text-[10px] font-black text-gold uppercase tracking-widest mb-1">Custo</p>
                      <p className="text-lg lg:text-xl font-black text-white">{formatCurrency(selectedRecipe.cost)}</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md p-3 lg:p-4 rounded-2xl lg:rounded-3xl border border-white/10">
                      <p className="text-[9px] lg:text-[10px] font-black text-gold uppercase tracking-widest mb-1">Sugestão</p>
                      <p className="text-lg lg:text-xl font-black text-white">{formatCurrency(selectedRecipe.suggestedPrice)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Content */}
              <div className="md:w-3/5 p-6 lg:p-12 overflow-y-auto scrollbar-hide space-y-6 lg:space-y-10">
                <div className="space-y-3 lg:space-y-4">
                  <h4 className="text-xs font-black text-gold uppercase tracking-[0.2em] flex items-center gap-2">
                    <Info size={14} /> Sobre a Receita
                  </h4>
                  <p className="text-base lg:text-lg text-chocolate/70 font-medium leading-relaxed italic font-serif">
                    "{selectedRecipe.description}"
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-10">
                  <div className="space-y-4 lg:space-y-6">
                    <h4 className="text-xs font-black text-gold uppercase tracking-[0.2em] flex items-center gap-2">
                      <ChefHat size={14} /> Ingredientes
                    </h4>
                    <ul className="space-y-3 lg:space-y-4">
                      {selectedRecipe.ingredients.map((ing, i) => (
                        <li key={i} className="flex items-center justify-between group">
                          <span className="text-chocolate font-bold text-sm lg:text-base">{ing.item}</span>
                          <span className="text-gold font-black text-xs lg:text-sm bg-paper px-2 lg:px-3 py-1 rounded-full">{ing.amount}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-4 lg:space-y-6">
                    <h4 className="text-xs font-black text-gold uppercase tracking-[0.2em] flex items-center gap-2">
                      <Clock size={14} /> Preparo
                    </h4>
                    <div className="space-y-3 lg:space-y-4">
                      {selectedRecipe.instructions.map((step, i) => (
                        <div key={i} className="flex gap-3 lg:gap-4">
                          <span className="flex-shrink-0 w-6 h-6 lg:w-8 lg:h-8 rounded-full bg-paper text-gold flex items-center justify-center font-black text-xs lg:text-sm">
                            {i + 1}
                          </span>
                          <p className="text-chocolate/70 lg:text-chocolate/80 font-medium leading-relaxed text-xs lg:text-sm">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {selectedRecipe.tip && (
                  <div className="bg-paper rounded-2xl lg:rounded-3xl p-4 lg:p-8 border border-gold/10">
                    <h4 className="text-xs font-black text-gold uppercase tracking-[0.2em] mb-2 lg:mb-4 flex items-center gap-2">
                      <TrendingUp size={14} /> Dica de Ouro
                    </h4>
                    <p className="text-chocolate/70 font-medium italic text-xs lg:text-sm">
                      {selectedRecipe.tip}
                    </p>
                  </div>
                )}

                <div className="pt-6 lg:pt-8 border-t border-paper flex flex-col sm:flex-row gap-3 lg:gap-4">
                  <button
                    onClick={() => setShowPriceModal(true)}
                    className="flex-1 py-3 lg:py-4 bg-chocolate text-white rounded-xl lg:rounded-2xl font-black uppercase tracking-widest hover:bg-chocolate-light transition-all flex items-center justify-center gap-2 text-sm lg:text-base"
                  >
                    <Plus size={18} lg:size={20} /> Adicionar ao Cardápio
                  </button>
                  <button
                    onClick={() => printRecipe(selectedRecipe)}
                    className="px-6 lg:px-8 py-3 lg:py-4 bg-paper text-chocolate rounded-xl lg:rounded-2xl font-black uppercase tracking-widest hover:bg-gold hover:text-white transition-all flex items-center justify-center gap-2 text-sm lg:text-base"
                  >
                    <FileText size={18} lg:size={20} /> PDF
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Price Input Modal */}
      <AnimatePresence>
        {showPriceModal && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-chocolate/60 backdrop-blur-md"
              onClick={() => setShowPriceModal(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white rounded-3xl p-6 lg:p-10 w-full max-w-sm shadow-2xl border border-paper"
            >
              <h3 className="text-xl lg:text-2xl font-black text-chocolate mb-2">Preço de Venda</h3>
              <p className="text-chocolate/60 font-medium mb-6 lg:mb-8">Por quanto você vai vender este ovo?</p>

              <div className="space-y-5 lg:space-y-6">
                <div className="relative">
                  <span className="absolute left-5 lg:left-6 top-1/2 -translate-y-1/2 font-black text-gold text-lg lg:text-2xl">R$</span>
                  <input
                    type="number"
                    value={menuPrice}
                    onChange={(e) => setMenuPrice(e.target.value)}
                    placeholder={selectedRecipe?.suggestedPrice.toString()}
                    className="w-full pl-12 lg:pl-14 pr-4 lg:pr-6 py-4 lg:py-5 bg-paper rounded-2xl lg:rounded-3xl text-xl lg:text-2xl font-black text-chocolate focus:outline-none focus:ring-2 focus:ring-gold"
                    autoFocus
                  />
                </div>

                <button
                  onClick={() => {
                    if (selectedRecipe) {
                      onAddToMenu(selectedRecipe, Number(menuPrice) || selectedRecipe.suggestedPrice);
                      setShowPriceModal(false);
                      setMenuPrice('');
                      setSelectedRecipe(null);
                    }
                  }}
                  className="w-full py-4 lg:py-5 bg-gold text-white rounded-2xl lg:rounded-3xl font-black text-base lg:text-lg shadow-xl shadow-gold/20 hover:bg-gold-dark transition-all flex items-center justify-center gap-2"
                >
                  <Check size={20} lg:size={24} />
                  Confirmar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
