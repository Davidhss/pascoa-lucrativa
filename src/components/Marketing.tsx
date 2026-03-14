import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  MessageSquare, 
  Instagram, 
  Send, 
  Copy, 
  Check, 
  Zap, 
  Star,
  Smartphone,
  Users,
  Target
} from 'lucide-react';
import { cn } from '../lib/utils';

interface Script {
  id: string;
  title: string;
  content: string;
  category: 'venda' | 'atendimento' | 'pos-venda';
}

const SCRIPTS: Script[] = [
  {
    id: '1',
    title: 'Abordagem Inicial (Gatilho de Escassez)',
    category: 'venda',
    content: "Olá [NOME]! Tudo bem? 🐰\n\nPassando para avisar que abri hoje as encomendas para a Páscoa! Como trabalho de forma artesanal, as vagas são super limitadas e já temos 40% preenchidas.\n\nPosso te enviar o nosso cardápio premium para você garantir os seus favoritos antes que esgotem?"
  },
  {
    id: '2',
    title: 'Fechamento Rápido (Pix)',
    category: 'venda',
    content: "Perfeito, [NOME]! Ótima escolha. O [NOME DO PRODUTO] é o nosso campeão de vendas! ✨\n\nPara confirmar sua reserva e garantir essa delícia na sua Páscoa, o valor total fica em [VALOR].\n\nVocê prefere pagar via Pix ou Cartão? Se for Pix, já te envio a chave e você garante o seu agora mesmo!"
  },
  {
    id: '3',
    title: 'Recuperação de Carrinho (Follow-up)',
    category: 'atendimento',
    content: "Oi [NOME]! Passando só para conferir se você conseguiu ver o cardápio que te enviei ontem. 😊\n\nAinda tenho 2 unidades do [PRODUTO] que você gostou, mas como a procura está alta, queria te dar prioridade antes de liberar para a lista de espera.\n\nVamos fechar o seu pedido?"
  },
  {
    id: '4',
    title: 'Pós-Venda (Fidelização)',
    category: 'pos-venda',
    content: "Olá [NOME]! Passando para saber o que achou dos nossos ovos de Páscoa! 🍫\n\nSua opinião é muito importante para nós. Se puder tirar uma fotinho e nos marcar no Instagram, ficaremos muito felizes!\n\nAh, e como agradecimento, na sua próxima compra você tem 10% de desconto. Até a próxima!"
  }
];

export function Marketing() {
  const [activeCategory, setActiveCategory] = useState<'venda' | 'atendimento' | 'pos-venda' | 'estrategia'>('venda');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-10 pb-24">
      <header className="space-y-2">
        <h2 className="text-4xl md:text-6xl font-serif italic font-light tracking-tight text-chocolate">
          Máquina de <span className="font-bold not-italic">Vendas</span>
        </h2>
        <p className="text-gold-dark font-bold uppercase tracking-[0.3em] text-xs">
          Scripts e estratégias para vender sem esforço
        </p>
      </header>

      {/* Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {[
          { id: 'venda', label: 'Scripts de Venda', icon: MessageSquare },
          { id: 'atendimento', label: 'Atendimento', icon: Users },
          { id: 'pos-venda', label: 'Pós-Venda', icon: Star },
          { id: 'estrategia', label: 'Redes Sociais', icon: Instagram },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id as any)}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all whitespace-nowrap",
              activeCategory === cat.id 
                ? "bg-chocolate text-white shadow-lg shadow-chocolate/20" 
                : "bg-white text-chocolate/40 border border-paper hover:border-gold/30"
            )}
          >
            <cat.icon size={14} />
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-6">
          {activeCategory !== 'estrategia' ? (
            <div className="space-y-6">
              {SCRIPTS.filter(s => s.category === activeCategory).map((script) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={script.id} 
                  className="bg-white rounded-[40px] p-8 border border-paper shadow-xl space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black text-chocolate uppercase tracking-tighter">{script.title}</h3>
                    <button 
                      onClick={() => copyToClipboard(script.content, script.id)}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all",
                        copiedId === script.id ? "bg-green-500 text-white" : "bg-paper text-chocolate/40 hover:bg-chocolate hover:text-white"
                      )}
                    >
                      {copiedId === script.id ? <Check size={14} /> : <Copy size={14} />}
                      {copiedId === script.id ? 'Copiado!' : 'Copiar Script'}
                    </button>
                  </div>
                  <div className="bg-paper/50 rounded-3xl p-6 text-chocolate/80 font-medium leading-relaxed whitespace-pre-wrap border border-paper">
                    {script.content}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[40px] p-10 border border-paper shadow-xl space-y-10"
              >
                <div className="space-y-2">
                  <h3 className="text-3xl font-black text-chocolate uppercase tracking-tighter">Estratégia de 21 Dias</h3>
                  <p className="text-gold-dark font-bold uppercase tracking-widest text-xs">Como dominar o Instagram e lotar a agenda</p>
                </div>

                <div className="space-y-8">
                  {[
                    { 
                      title: "Fase 1: Desejo (Dias 1-7)", 
                      desc: "Poste bastidores da produção, o cheiro do chocolate derretendo, a escolha dos melhores ingredientes. Não venda, apenas encante.",
                      icon: Zap
                    },
                    { 
                      title: "Fase 2: Autoridade (Dias 8-14)", 
                      desc: "Mostre seu conhecimento. Explique a diferença entre chocolates, mostre a higiene da sua cozinha e depoimentos de clientes antigos.",
                      icon: Star
                    },
                    { 
                      title: "Fase 3: Escassez (Dias 15-21)", 
                      desc: "Abra as encomendas com bônus para os primeiros. Use o cronômetro nos stories e mostre a agenda sendo preenchida em tempo real.",
                      icon: Target
                    }
                  ].map((fase, i) => (
                    <div key={i} className="flex gap-6 group">
                      <div className="w-16 h-16 rounded-3xl bg-paper flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-white transition-all shrink-0">
                        <fase.icon size={24} />
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-xl font-black text-chocolate uppercase tracking-tighter">{fase.title}</h4>
                        <p className="text-chocolate/60 font-medium leading-relaxed">{fase.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          )}
        </div>

        {/* Sidebar Tips */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-chocolate text-white rounded-[40px] p-10 shadow-2xl space-y-8 relative overflow-hidden">
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white/10 text-gold">
                  <Smartphone size={20} />
                </div>
                <h3 className="text-lg font-black uppercase tracking-tighter">Dicas de WhatsApp</h3>
              </div>

              <div className="space-y-6">
                {[
                  { title: "Foto de Perfil", text: "Use uma foto sua sorrindo ou sua logo profissional. Evite fotos de produtos sozinhas." },
                  { title: "Catálogo", text: "Mantenha o catálogo do WhatsApp Business atualizado com fotos reais e preços." },
                  { title: "Status", text: "Poste pelo menos 3 vezes ao dia: Manhã (bastidores), Tarde (produto pronto), Noite (agenda)." }
                ].map((tip, i) => (
                  <div key={i} className="space-y-1">
                    <p className="text-gold font-black uppercase tracking-widest text-[10px]">{tip.title}</p>
                    <p className="text-sm text-white/60 font-medium leading-relaxed">{tip.text}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="absolute -right-20 -bottom-20 text-white/5">
              <Send size={300} strokeWidth={0.5} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
