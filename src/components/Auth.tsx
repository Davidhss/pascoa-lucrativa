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
  ArrowLeft,
  Shield
} from 'lucide-react';
import { cn } from '../lib/utils';

interface AuthProps {
  onAuthSuccess: () => void;
  onAdminAccess: () => void;
}

const ADMIN_EMAIL = 'assessoriablent@gmail.com';

export function Auth({ onAuthSuccess, onAdminAccess }: AuthProps) {
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

    const trimmedEmail = email.trim().toLowerCase();
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
        // Check if it's the admin email
        if (trimmedEmail === ADMIN_EMAIL.toLowerCase()) {
          const { error } = await supabase.auth.signInWithPassword({
            email: trimmedEmail,
            password: trimmedPassword,
          });
          if (error) throw error;
          onAdminAccess();
        } else {
          const { error } = await supabase.auth.signInWithPassword({
            email: trimmedEmail,
            password: trimmedPassword,
          });
          if (error) throw error;
          onAuthSuccess();
        }
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
      <div className="hidden md:flex md:w-1/2 bg-chocolate relative overflow-hidden p-16 lg:p-24 flex-col justify-between border-r-4 border-gold">
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1548907040-4baa42d10919?w=1200')] bg-cover bg-center mix-blend-overlay grayscale" />
          <div className="absolute inset-0 bg-gradient-to-br from-chocolate via-transparent to-transparent" />
        </div>

        <div className="relative z-10 space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <span className="w-12 h-[2px] bg-gold" />
            <p className="text-gold font-black uppercase tracking-[0.4em] text-xs">Plataforma Profissional</p>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[8vw] lg:text-[6vw] font-black uppercase tracking-[-0.06em] leading-[0.85] text-white"
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
          <p className="text-white/70 font-serif italic text-xl lg:text-2xl max-w-md leading-relaxed">
            "Transforme sua paixão por chocolate em um negócio de alto faturamento."
          </p>
          <div className="flex items-center gap-3 text-gold font-mono text-xs uppercase tracking-widest">
            <span>Est. 2026</span>
            <span className="w-1 h-1 bg-gold rounded-full" />
            <span>Versão 2.4.0</span>
          </div>
        </motion.div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-16 lg:p-20 bg-paper">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg space-y-10"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h2 className="text-4xl lg:text-5xl font-black text-chocolate uppercase tracking-tighter">
                  {isLogin ? 'Bem-vindo' : 'Crie sua conta'}
                </h2>
                <p className="text-xs font-mono font-bold text-gold uppercase tracking-[0.3em]">
                  {isLogin ? 'Acesse sua conta profissional' : 'Comece sua jornada lucrativa'}
                </p>
              </div>
              {!isLogin && (
                <button
                  onClick={() => setIsLogin(true)}
                  className="w-12 h-12 border-2 border-chocolate/20 flex items-center justify-center text-chocolate hover:bg-chocolate hover:text-white transition-all rounded-xl"
                >
                  <ArrowLeft size={20} />
                </button>
              )}
            </div>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            <div className="space-y-5">
              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <label className="text-xs font-mono font-bold text-chocolate/60 uppercase tracking-[0.2em] ml-1">Nome Completo</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gold" size={20} />
                      <input
                        type="text"
                        required
                        placeholder="Seu nome completo"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white border-2 border-chocolate/10 focus:border-gold font-sans font-semibold text-chocolate placeholder:text-chocolate/60 rounded-xl transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-mono font-bold text-chocolate/60 uppercase tracking-[0.2em] ml-1">Nome da Confeitaria</label>
                    <div className="relative">
                      <Store className="absolute left-4 top-1/2 -translate-y-1/2 text-gold" size={20} />
                      <input
                        type="text"
                        required
                        placeholder="Nome do seu negócio"
                        value={confectioneryName}
                        onChange={(e) => setConfectioneryName(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white border-2 border-chocolate/10 focus:border-gold font-sans font-semibold text-chocolate placeholder:text-chocolate/60 rounded-xl transition-all"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <label className="text-xs font-mono font-bold text-chocolate/60 uppercase tracking-[0.2em] ml-1">E-mail</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gold" size={20} />
                  <input
                    type="email"
                    required
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white border-2 border-chocolate/10 focus:border-gold font-sans font-semibold text-chocolate placeholder:text-chocolate/60 rounded-xl transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono font-bold text-chocolate/60 uppercase tracking-[0.2em] ml-1">Senha</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gold" size={20} />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white border-2 border-chocolate/10 focus:border-gold font-sans font-semibold text-chocolate placeholder:text-chocolate/60 rounded-xl transition-all"
                  />
                </div>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-50 border-l-4 border-red-500 text-red-600 text-xs font-mono font-bold uppercase tracking-widest leading-relaxed rounded-r-lg"
                >
                  <div className="flex gap-3">
                    <AlertCircle size={18} className="shrink-0" />
                    <span>{error}</span>
                  </div>
                </motion.div>
              )}
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-green-50 border-l-4 border-green-500 text-green-600 text-xs font-mono font-bold uppercase tracking-widest leading-relaxed rounded-r-lg"
                >
                  <div className="flex gap-3">
                    <CheckCircle2 size={18} className="shrink-0" />
                    <span>{success}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={loading || cooldown > 0}
              className="w-full py-5 bg-chocolate text-white border-2 border-chocolate font-black text-lg uppercase tracking-widest hover:bg-gold hover:border-gold transition-all flex items-center justify-center gap-3 group disabled:opacity-50 rounded-xl shadow-lg"
            >
              {loading ? (
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              ) : cooldown > 0 ? (
                <span className="text-sm">AGUARDE {cooldown}s</span>
              ) : (
                <>
                  {isLogin ? 'ENTRAR' : 'CRIAR CONTA'}
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="pt-6 border-t-2 border-chocolate/10 flex flex-col items-center gap-4">
            <p className="text-xs font-mono font-bold text-chocolate/60 uppercase tracking-[0.2em]">
              {isLogin ? 'Novo por aqui?' : 'Já tem conta?'}
            </p>
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="px-8 py-3 border-2 border-chocolate text-chocolate font-black uppercase tracking-widest text-sm hover:bg-chocolate hover:text-white transition-all rounded-xl"
            >
              {isLogin ? 'CRIAR CONTA' : 'FAZER LOGIN'}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
