import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../lib/supabase';
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  Sparkles, 
  UserPlus, 
  LogIn,
  AlertCircle,
  CheckCircle2,
  User,
  Store,
  ArrowLeft
} from 'lucide-react';
import { cn } from '../lib/utils';

interface AuthProps {
  onAuthSuccess: () => void;
}

export function Auth({ onAuthSuccess }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [confectioneryName, setConfectioneryName] = useState('');
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cooldown > 0) return;
    
    setLoading(true);
    setError(null);
    setSuccess(null);

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    // Client-side validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError('O formato do e-mail é inválido. Certifique-se de que não há espaços extras.');
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password: trimmedPassword,
        });
        if (error) throw error;
        onAuthSuccess();
      } else {
        const { error } = await supabase.auth.signUp({
          email: trimmedEmail,
          password: trimmedPassword,
          options: {
            data: {
              full_name: fullName,
              confectionery_name: confectioneryName,
            }
          }
        });
        if (error) throw error;
        setSuccess('Conta criada! Verifique seu e-mail para confirmar.');
        setTimeout(() => setIsLogin(true), 3000);
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      
      // Handle Supabase specific error messages
      let friendlyMessage = 'Ocorreu um erro na autenticação.';
      
      const message = err.message?.toLowerCase() || '';
      
      if (message.includes('invalid login credentials') || message.includes('invalid_credentials')) {
        friendlyMessage = 'E-mail ou senha incorretos. Verifique suas credenciais.';
      } else if (message.includes('user not found')) {
        friendlyMessage = 'Este usuário não foi encontrado no sistema.';
      } else if (message.includes('rate limit')) {
        friendlyMessage = 'Limite de tentativas atingido. O Supabase bloqueia muitas solicitações seguidas por segurança. Aguarde 5-10 minutos ou aumente o limite no painel do Supabase (Auth Settings > Rate Limits).';
        setCooldown(60); // 1 minute cooldown
      } else if (message.includes('invalid email') || message.includes('email address') && message.includes('is invalid')) {
        friendlyMessage = 'O formato do e-mail é inválido. Verifique se digitou corretamente.';
      } else if (message.includes('forbidden use of secret api key')) {
        friendlyMessage = 'Erro de configuração: A chave "Anon" do Supabase deve ser usada no navegador, não a "Service Role".';
      } else if (message.includes('email not confirmed')) {
        friendlyMessage = 'Por favor, confirme seu e-mail antes de entrar.';
      } else if (message.includes('password is too short')) {
        friendlyMessage = 'A senha deve ter pelo menos 6 caracteres.';
      } else if (message.includes('user already registered')) {
        friendlyMessage = 'Este e-mail já está cadastrado.';
      } else {
        friendlyMessage = err.message || friendlyMessage;
      }

      setError(friendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper flex flex-col md:flex-row selection:bg-gold/30">
      {/* Left Side - Hero/Editorial */}
      <div className="hidden md:flex md:w-1/2 bg-chocolate relative overflow-hidden p-20 flex-col justify-between border-r-8 border-gold">
        <div className="absolute top-0 left-0 w-full h-full opacity-40">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1548907040-4baa42d10919?w=1200')] bg-cover bg-center mix-blend-overlay grayscale" />
          <div className="absolute inset-0 bg-gradient-to-br from-chocolate via-transparent to-transparent" />
        </div>

        <div className="relative z-10 space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-6"
          >
            <span className="w-16 h-[2px] bg-gold" />
            <p className="text-gold font-black uppercase tracking-[0.6em] text-[12px]">Plataforma de Alta Performance</p>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[10vw] lg:text-[8vw] font-black uppercase tracking-[-0.08em] leading-[0.75] text-white"
          >
            Páscoa <br />
            <span className="text-gold italic font-serif lowercase tracking-normal">Lucrativa</span>
          </motion.h1>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="relative z-10 space-y-4"
        >
          <p className="text-white/60 font-serif italic text-2xl max-w-md">
            "Transforme sua paixão por chocolate em um império de faturamento real."
          </p>
          <div className="flex items-center gap-4 text-gold font-mono text-xs uppercase tracking-widest">
            <span>Est. 2026</span>
            <span className="w-1 h-1 bg-gold rounded-full" />
            <span>Versão 2.4.0</span>
          </div>
        </motion.div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-20 bg-paper">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md space-y-12"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-5xl font-black text-chocolate uppercase tracking-tighter">
                  {isLogin ? 'Acesso' : 'Registro'}
                </h2>
                <p className="text-[11px] font-mono font-bold text-gold uppercase tracking-[0.4em]">
                  {isLogin ? 'Identificação do Operador' : 'Criação de Nova Base'}
                </p>
              </div>
              {!isLogin && (
                <button 
                  onClick={() => setIsLogin(true)}
                  className="w-12 h-12 border-2 border-chocolate flex items-center justify-center text-chocolate hover:bg-chocolate hover:text-white transition-all"
                >
                  <ArrowLeft size={20} />
                </button>
              )}
            </div>
          </div>

          <form onSubmit={handleAuth} className="space-y-8">
            <div className="space-y-6">
              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <label className="text-[11px] font-mono font-bold text-chocolate/40 uppercase tracking-[0.3em] ml-2">Nome Completo</label>
                    <div className="relative">
                      <User className="absolute left-6 top-1/2 -translate-y-1/2 text-gold" size={20} />
                      <input 
                        type="text"
                        required
                        placeholder="Seu nome completo"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full pl-16 pr-8 py-5 bg-white border-2 border-chocolate/10 focus:border-gold focus:outline-none font-sans font-semibold text-chocolate placeholder:text-chocolate/20 tracking-tight"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-mono font-bold text-chocolate/40 uppercase tracking-[0.3em] ml-2">Nome da Confeitaria</label>
                    <div className="relative">
                      <Store className="absolute left-6 top-1/2 -translate-y-1/2 text-gold" size={20} />
                      <input 
                        type="text"
                        required
                        placeholder="Nome do seu negócio"
                        value={confectioneryName}
                        onChange={(e) => setConfectioneryName(e.target.value)}
                        className="w-full pl-16 pr-8 py-5 bg-white border-2 border-chocolate/10 focus:border-gold focus:outline-none font-sans font-semibold text-chocolate placeholder:text-chocolate/20 tracking-tight"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <label className="text-[11px] font-mono font-bold text-chocolate/40 uppercase tracking-[0.3em] ml-2">E-mail Corporativo</label>
                <div className="relative">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gold" size={20} />
                  <input 
                    type="email"
                    required
                    placeholder="email@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-16 pr-8 py-5 bg-white border-2 border-chocolate/10 focus:border-gold focus:outline-none font-sans font-semibold text-chocolate placeholder:text-chocolate/20 tracking-tight"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-mono font-bold text-chocolate/40 uppercase tracking-[0.3em] ml-2">Senha de Acesso</label>
                <div className="relative">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-gold" size={20} />
                  <input 
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-16 pr-8 py-5 bg-white border-2 border-chocolate/10 focus:border-gold focus:outline-none font-sans font-semibold text-chocolate placeholder:text-chocolate/20"
                  />
                </div>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 bg-red-50 border-l-4 border-red-500 text-red-600 text-xs font-mono font-bold uppercase tracking-widest leading-relaxed"
                >
                  <div className="flex gap-4">
                    <AlertCircle size={20} className="shrink-0" />
                    <span>{error}</span>
                  </div>
                </motion.div>
              )}
              {success && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 bg-green-50 border-l-4 border-green-500 text-green-600 text-xs font-mono font-bold uppercase tracking-widest leading-relaxed"
                >
                  <div className="flex gap-4">
                    <CheckCircle2 size={20} className="shrink-0" />
                    <span>{success}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              type="submit"
              disabled={loading || cooldown > 0}
              className="w-full py-8 bg-chocolate text-white border-2 border-chocolate font-black text-2xl uppercase tracking-widest hover:bg-gold hover:border-gold transition-all flex items-center justify-center gap-4 group disabled:opacity-50"
            >
              {loading ? (
                <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
              ) : cooldown > 0 ? (
                <span>AGUARDE {cooldown}s</span>
              ) : (
                <>
                  {isLogin ? 'EFETUAR LOGIN' : 'FINALIZAR REGISTRO'}
                  <ArrowRight size={28} className="group-hover:translate-x-2 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="pt-8 border-t-2 border-chocolate/5 flex flex-col items-center gap-6">
            <p className="text-[10px] font-mono font-bold text-chocolate/30 uppercase tracking-[0.4em]">
              {isLogin ? 'Ainda não possui acesso?' : 'Já possui uma conta ativa?'}
            </p>
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="px-12 py-4 border-2 border-chocolate text-chocolate font-black uppercase tracking-widest text-sm hover:bg-chocolate hover:text-white transition-all"
            >
              {isLogin ? 'CRIAR NOVA CONTA' : 'VOLTAR PARA LOGIN'}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
