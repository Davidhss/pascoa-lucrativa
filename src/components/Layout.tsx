import React from 'react';
import { 
  LayoutDashboard, 
  Utensils, 
  ClipboardList, 
  DollarSign, 
  LogOut,
  Sparkles,
  Zap,
  TrendingUp
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { supabase } from '../lib/supabase';
import { Settings } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  confectioneryName: string;
  onReset: () => void;
}

export function Layout({ children, activeTab, setActiveTab, confectioneryName, onReset }: LayoutProps) {
  const tabs = [
    { id: 'dashboard', label: 'Início', icon: LayoutDashboard },
    { id: 'recipes', label: 'Receitas', icon: Utensils },
    { id: 'pricing', label: 'Precificação', icon: DollarSign },
    { id: 'menu', label: 'Cardápio', icon: Sparkles },
    { id: 'orders', label: 'Pedidos', icon: ClipboardList },
    { id: 'marketing', label: 'Vendas', icon: Zap },
    { id: 'finance', label: 'Financeiro', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-cream text-chocolate font-sans selection:bg-gold/30">
      {/* Desktop Sidebar / Header */}
      <header className="fixed top-0 left-0 right-0 h-16 lg:h-20 bg-white/90 backdrop-blur-xl border-b border-paper z-50 px-4 lg:px-12 flex items-center justify-between">
        <div className="flex items-center gap-3 lg:gap-4">
          <motion.div
            whileHover={{ rotate: 15 }}
            className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-gold to-gold-dark rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg shadow-gold/20"
          >
            <Sparkles className="text-white" size={18} lg:size={24} />
          </motion.div>
          <div>
            <h1 className="text-base lg:text-xl font-black tracking-tighter uppercase leading-none">
              Páscoa <span className="text-gold">Lucrativa</span>
            </h1>
            <p className="text-[9px] lg:text-[10px] font-bold text-gold tracking-[0.15em] uppercase mt-0.5">
              {confectioneryName || 'Sua Confeitaria'}
            </p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-paper/50 p-1 rounded-xl lg:rounded-2xl border border-paper">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-4 lg:px-6 py-2 lg:py-2.5 rounded-lg lg:rounded-xl flex items-center gap-2 transition-all duration-300 text-xs lg:text-sm font-bold uppercase tracking-wider",
                activeTab === tab.id
                  ? "bg-white text-gold shadow-sm ring-1 ring-gold/10"
                  : "text-chocolate/60 hover:text-chocolate hover:bg-white/50"
              )}
            >
              <tab.icon size={14} lg:size={16} strokeWidth={2.5} />
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <button
            onClick={onReset}
            className="p-2 lg:p-3 text-chocolate/70 hover:text-red-500 hover:bg-red-50 rounded-xl lg:rounded-2xl transition-all duration-300"
            title="Configurações"
          >
            <Settings size={18} lg:size={20} />
          </button>
          <button
            onClick={() => supabase.auth.signOut()}
            className="p-2 lg:p-3 text-chocolate/70 hover:text-red-500 hover:bg-red-50 rounded-xl lg:rounded-2xl transition-all duration-300"
            title="Sair"
          >
            <LogOut size={18} lg:size={20} />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="pt-24 lg:pt-28 pb-32 md:pb-12 px-4 max-w-7xl mx-auto lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-4 left-4 right-4 h-16 lg:h-20 bg-chocolate rounded-2xl lg:rounded-[32px] shadow-2xl shadow-chocolate/40 z-50 md:hidden flex items-center justify-around px-2 lg:px-4 border border-white/10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex flex-col items-center gap-1 transition-all duration-300 relative",
              activeTab === tab.id ? "text-gold" : "text-white/40"
            )}
          >
            <div className={cn(
              "p-2 lg:p-2.5 rounded-xl lg:rounded-2xl transition-all duration-300",
              activeTab === tab.id ? "bg-white/10" : ""
            )}>
              <tab.icon size={20} lg:size={24} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
            </div>
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute -bottom-1 w-1 h-1 bg-gold rounded-full"
              />
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}
