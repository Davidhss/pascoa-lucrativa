import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';

interface OnboardingProps {
  onComplete: (name: string, goal: number) => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [name, setName] = useState('');
  const [goal, setGoal] = useState(6000);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onComplete(name, goal);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#FDFCFB] flex items-center justify-center p-6 overflow-y-auto">
      <div className="absolute inset-0 opacity-5 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#B8860B] rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#B8860B] rounded-full blur-[100px] translate-x-1/2 translate-y-1/2" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-xl bg-white rounded-[40px] p-12 shadow-2xl border border-[#EAE2D6] text-center space-y-10"
      >
        <div className="space-y-4">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-20 h-20 bg-gradient-to-br from-[#D4AF37] to-[#B8860B] rounded-3xl mx-auto flex items-center justify-center shadow-xl shadow-[#B8860B]/20"
          >
            <Sparkles size={40} className="text-white" />
          </motion.div>
          <h1 className="text-4xl font-black text-[#2D241E] tracking-tight">
            Bem-vinda ao <br />
            <span className="text-[#B8860B]">Páscoa Lucrativa</span>
          </h1>
          <p className="text-lg text-[#6B5E54] max-w-md mx-auto">
            O sistema que vai te ajudar a faturar <span className="font-bold text-[#B8860B]">R$ 6.000</span> ou mais nesta temporada.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 text-left">
          <div className="space-y-3">
            <label className="text-sm font-black text-[#9E8E81] uppercase tracking-widest ml-2">Qual é o nome da sua confeitaria?</label>
            <input 
              required
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Doçuras da Maria"
              className="w-full px-8 py-5 rounded-3xl border-2 border-[#F5F1E9] focus:border-[#B8860B] focus:ring-0 outline-none text-xl font-bold transition-all placeholder:text-[#EAE2D6]"
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-black text-[#9E8E81] uppercase tracking-widest ml-2">Qual é sua meta de faturamento?</label>
            <div className="grid grid-cols-2 gap-4">
              {[3000, 6000].map(val => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setGoal(val)}
                  className={cn(
                    "relative px-6 py-6 rounded-3xl border-2 transition-all text-left group",
                    goal === val 
                      ? "border-[#B8860B] bg-[#FFF9E6]" 
                      : "border-[#F5F1E9] hover:border-[#EAE2D6]"
                  )}
                >
                  <p className={cn(
                    "text-xs font-black uppercase tracking-wider mb-1",
                    goal === val ? "text-[#B8860B]" : "text-[#9E8E81]"
                  )}>
                    {val === 6000 ? 'Meta dos Campeões' : 'Meta Inicial'}
                  </p>
                  <p className={cn(
                    "text-2xl font-black",
                    goal === val ? "text-[#2D241E]" : "text-[#6B5E54]"
                  )}>
                    R$ {val.toLocaleString()}
                  </p>
                  {goal === val && (
                    <motion.div 
                      layoutId="check"
                      className="absolute top-4 right-4 w-6 h-6 bg-[#B8860B] rounded-full flex items-center justify-center"
                    >
                      <ArrowRight size={14} className="text-white" />
                    </motion.div>
                  )}
                </button>
              ))}
            </div>
            {goal === 6000 && (
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center text-[#B8860B] font-bold text-sm mt-4 flex items-center justify-center gap-2"
              >
                <Sparkles size={16} />
                Essa é a meta dos campeões! Vamos juntas nessa?
              </motion.p>
            )}
          </div>

          <button 
            type="submit"
            className="w-full py-6 bg-[#B8860B] text-white rounded-[32px] font-black text-xl shadow-2xl shadow-[#B8860B]/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            Começar a faturar
            <ArrowRight size={24} />
          </button>
        </form>
      </motion.div>
    </div>
  );
}
