import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shield,
  Users,
  Mail,
  Calendar,
  Building2,
  DollarSign,
  Trash2,
  Key,
  Eye,
  X,
  Search,
  RefreshCw,
  LogOut,
  Lock,
  Unlock,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  ChevronDown,
  Filter,
  Download,
  Clock,
  TrendingUp,
  Package
} from 'lucide-react';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabase';
import { UserProfile, UserStats } from '../types';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const ADMIN_EMAIL = 'assessoriablent@gmail.com';

interface AdminProps {
  onLogout: () => void;
}

export function Admin({ onLogout }: AdminProps) {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalOrders: 0,
    totalRevenue: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [toast, setToast] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  useEffect(() => {
    loadUsersAndStats();
  }, []);

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.confectionery_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  useEffect(() => {
    let filtered = users;
    if (filterStatus === 'active') {
      filtered = users.filter(user => user.last_sign_in_at);
    } else if (filterStatus === 'inactive') {
      filtered = users.filter(user => !user.last_sign_in_at);
    }
    setFilteredUsers(filtered);
  }, [filterStatus, users]);

  const loadUsersAndStats = async () => {
    try {
      setLoading(true);

      // Load all users
      const { data: usersData, error: usersError } = await supabase
        .from('settings')
        .select('user_id, confectionery_name, created_at')
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;

      // Get auth users
      const { data: { users: authUsers }, error: authError } = await supabase.auth.admin.listUsers();

      if (authError) throw authError;

      // Combine data
      const combinedUsers: UserProfile[] = usersData?.map(settings => {
        const authUser = authUsers?.find(u => u.id === settings.user_id);
        return {
          id: settings.user_id,
          email: authUser?.email || '',
          full_name: authUser?.user_metadata?.full_name,
          confectionery_name: settings.confectionery_name,
          created_at: settings.created_at,
          last_sign_in_at: authUser?.last_sign_in_at,
          user_metadata: authUser?.user_metadata
        };
      }) || [];

      setUsers(combinedUsers);
      setFilteredUsers(combinedUsers);

      // Load stats
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const activeUsers = combinedUsers.filter(u =>
        u.last_sign_in_at && new Date(u.last_sign_in_at) > thirtyDaysAgo
      ).length;

      const allOrders = await Promise.all(
        combinedUsers.map(async (user) => {
          const { data } = await supabase
            .from('orders')
            .select('value, payment_status')
            .eq('user_id', user.id);
          return data || [];
        })
      );

      const totalOrders = allOrders.flat().length;
      const totalRevenue = allOrders.flat()
        .filter(o => o.payment_status === 'Pago')
        .reduce((sum, o) => sum + o.value, 0);

      setStats({
        totalUsers: combinedUsers.length,
        activeUsers,
        totalOrders,
        totalRevenue
      });
    } catch (error) {
      console.error('Error loading users:', error);
      showToast('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      setActionLoading(true);

      // Delete user data
      await supabase.from('orders').delete().eq('user_id', selectedUser.id);
      await supabase.from('costs').delete().eq('user_id', selectedUser.id);
      await supabase.from('settings').delete().eq('user_id', selectedUser.id);

      // Delete auth user
      await supabase.auth.admin.deleteUser(selectedUser.id);

      showToast('Usuário excluído com sucesso');
      setShowDeleteModal(false);
      setSelectedUser(null);
      loadUsersAndStats();
    } catch (error) {
      console.error('Error deleting user:', error);
      showToast('Erro ao excluir usuário');
    } finally {
      setActionLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!selectedUser || !newPassword) return;

    try {
      setActionLoading(true);

      await supabase.auth.admin.updateUserById(selectedUser.id, {
        password: newPassword
      });

      showToast('Senha alterada com sucesso');
      setShowPasswordModal(false);
      setNewPassword('');
      setSelectedUser(null);
    } catch (error) {
      console.error('Error resetting password:', error);
      showToast('Erro ao alterar senha');
    } finally {
      setActionLoading(false);
    }
  };

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="space-y-8 pb-24">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed top-24 right-8 z-[100] bg-chocolate text-white px-6 py-4 rounded-2xl shadow-2xl font-bold flex items-center gap-3"
          >
            <CheckCircle2 size={20} className="text-gold" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-gold to-gold-dark rounded-2xl flex items-center justify-center shadow-lg">
              <Shield className="text-white" size={24} />
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-mono font-bold text-gold uppercase tracking-widest">Painel Administrativo</p>
              <h1 className="text-3xl lg:text-4xl font-black text-chocolate uppercase tracking-tighter">
                Gestão de Usuários
              </h1>
            </div>
          </div>
          <p className="text-chocolate/60 font-medium max-w-md">
            Gerencie todos os usuários cadastrados, visualize estatísticas e mantenha controle total da plataforma.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadUsersAndStats}
            disabled={loading}
            className="px-6 py-4 bg-paper text-chocolate rounded-xl font-black uppercase tracking-widest hover:bg-chocolate hover:text-white transition-all flex items-center gap-2 text-sm disabled:opacity-50"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            Atualizar
          </button>
          <button
            onClick={onLogout}
            className="px-6 py-4 bg-red-50 text-red-600 rounded-xl font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all flex items-center gap-2 text-sm"
          >
            <LogOut size={18} />
            Sair
          </button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white p-6 lg:p-8 border-2 border-chocolate shadow-lg space-y-4 rounded-2xl transition-all"
        >
          <div className="flex items-center justify-between">
            <Users size={24} className="text-chocolate/60" />
            <TrendingUp size={20} className="text-green-500" />
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-mono font-bold text-chocolate/70 uppercase tracking-widest">Total de Usuários</p>
            <p className="text-3xl lg:text-4xl font-black text-chocolate tracking-tighter">{stats.totalUsers}</p>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white p-6 lg:p-8 border-2 border-chocolate shadow-lg space-y-4 rounded-2xl transition-all"
        >
          <div className="flex items-center justify-between">
            <Clock size={24} className="text-chocolate/60" />
            <CheckCircle2 size={20} className="text-gold" />
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-mono font-bold text-chocolate/70 uppercase tracking-widest">Usuários Ativos</p>
            <p className="text-3xl lg:text-4xl font-black text-chocolate tracking-tighter">{stats.activeUsers}</p>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white p-6 lg:p-8 border-2 border-chocolate shadow-lg space-y-4 rounded-2xl transition-all"
        >
          <div className="flex items-center justify-between">
            <Package size={24} className="text-chocolate/60" />
            <DollarSign size={20} className="text-green-500" />
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-mono font-bold text-chocolate/70 uppercase tracking-widest">Pedidos Totais</p>
            <p className="text-3xl lg:text-4xl font-black text-chocolate tracking-tighter">{stats.totalOrders}</p>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="bg-gold p-6 lg:p-8 border-2 border-gold-dark shadow-lg space-y-4 rounded-2xl transition-all"
        >
          <div className="flex items-center justify-between">
            <DollarSign size={24} className="text-white/60" />
            <ArrowRight size={20} className="text-white" />
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest">Receita Total</p>
            <p className="text-2xl lg:text-3xl font-black text-white tracking-tighter">
              {stats.totalRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-chocolate/70" size={20} />
          <input
            type="text"
            placeholder="Buscar por email, nome ou confeitaria..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border-2 border-paper rounded-xl focus:outline-none focus:border-gold font-medium text-chocolate"
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
          className="px-6 py-4 bg-white border-2 border-paper rounded-xl focus:outline-none focus:border-gold font-bold text-chocolate appearance-none min-w-[200px]"
        >
          <option value="all">Todos os Usuários</option>
          <option value="active">Usuários Ativos</option>
          <option value="inactive">Usuários Inativos</option>
        </select>
      </div>

      {/* Users List */}
      <div className="bg-white border-2 border-chocolate rounded-3xl overflow-hidden">
        <div className="bg-chocolate p-4 border-b-2 border-chocolate">
          <div className="grid grid-cols-12 gap-4 text-white">
            <div className="col-span-4 text-[10px] font-mono font-bold uppercase tracking-widest">Usuário</div>
            <div className="col-span-3 text-[10px] font-mono font-bold uppercase tracking-widest">Confeitaria</div>
            <div className="col-span-2 text-[10px] font-mono font-bold uppercase tracking-widest">Status</div>
            <div className="col-span-2 text-[10px] font-mono font-bold uppercase tracking-widest">Cadastro</div>
            <div className="col-span-1 text-[10px] font-mono font-bold uppercase tracking-widest text-right">Ações</div>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 border-4 border-gold/30 border-t-gold rounded-full animate-spin mx-auto" />
            <p className="text-chocolate/60 font-bold uppercase tracking-widest text-xs mt-4">Carregando usuários...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-20 h-20 bg-paper rounded-full flex items-center justify-center mx-auto text-chocolate/10 mb-4">
              <Users size={40} />
            </div>
            <p className="text-chocolate font-black uppercase tracking-tighter text-lg">Nenhum usuário encontrado</p>
            <p className="text-chocolate/50 font-bold uppercase tracking-widest text-xs">
              {searchTerm ? 'Tente outra busca' : 'Ainda não há usuários cadastrados'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-paper">
            {filteredUsers.map((user, idx) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="grid grid-cols-12 gap-4 p-4 lg:p-6 hover:bg-paper/50 transition-colors items-center"
              >
                <div className="col-span-4 space-y-1">
                  <p className="font-bold text-chocolate truncate">{user.full_name || 'Nome não definido'}</p>
                  <p className="text-sm text-chocolate/60 flex items-center gap-2">
                    <Mail size={14} />
                    {user.email}
                  </p>
                </div>

                <div className="col-span-3 space-y-1">
                  <p className="text-sm font-medium text-chocolate truncate flex items-center gap-2">
                    <Building2 size={14} className="text-gold" />
                    {user.confectionery_name || 'Não definido'}
                  </p>
                </div>

                <div className="col-span-2">
                  {user.last_sign_in_at ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wider">
                      <CheckCircle2 size={10} />
                      Ativo
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold uppercase tracking-wider">
                      <Clock size={10} />
                      Inativo
                    </span>
                  )}
                </div>

                <div className="col-span-2">
                  <p className="text-xs text-chocolate/50 flex items-center gap-1">
                    <Calendar size={12} />
                    {format(new Date(user.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                  </p>
                  <p className="text-[10px] text-chocolate/70 font-mono">
                    {formatDistanceToNow(new Date(user.created_at), { addSuffix: true, locale: ptBR })}
                  </p>
                </div>

                <div className="col-span-1 flex justify-end gap-2">
                  <button
                    onClick={() => setSelectedUser(user)}
                    className="p-2 bg-paper text-chocolate/60 hover:text-chocolate hover:bg-white rounded-lg transition-all"
                    title="Ver detalhes"
                  >
                    <Eye size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* User Details Modal */}
      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedUser(null)}
              className="absolute inset-0 bg-chocolate/80 backdrop-blur-xl"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white border-4 border-chocolate rounded-3xl p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="space-y-2">
                  <p className="text-[10px] font-mono font-bold text-gold uppercase tracking-widest">Detalhes do Usuário</p>
                  <h3 className="text-2xl font-black text-chocolate uppercase tracking-tighter">
                    {selectedUser.full_name || 'Usuário'}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="w-10 h-10 bg-paper text-chocolate/60 hover:text-chocolate rounded-xl transition-all flex items-center justify-center"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <p className="text-[10px] font-mono font-bold text-chocolate/70 uppercase tracking-widest">Email</p>
                    <p className="text-base font-medium text-chocolate flex items-center gap-2">
                      <Mail size={16} className="text-gold" />
                      {selectedUser.email}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] font-mono font-bold text-chocolate/70 uppercase tracking-widest">Nome Completo</p>
                    <p className="text-base font-medium text-chocolate">
                      {selectedUser.full_name || 'Não definido'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] font-mono font-bold text-chocolate/70 uppercase tracking-widest">Confeitaria</p>
                    <p className="text-base font-medium text-chocolate flex items-center gap-2">
                      <Building2 size={16} className="text-gold" />
                      {selectedUser.confectionery_name || 'Não definido'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] font-mono font-bold text-chocolate/70 uppercase tracking-widest">ID do Usuário</p>
                    <p className="text-sm font-mono text-chocolate/60 truncate">
                      {selectedUser.id}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <p className="text-[10px] font-mono font-bold text-chocolate/70 uppercase tracking-widest">Data de Cadastro</p>
                    <p className="text-base font-medium text-chocolate flex items-center gap-2">
                      <Calendar size={16} className="text-gold" />
                      {format(new Date(selectedUser.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] font-mono font-bold text-chocolate/70 uppercase tracking-widest">Último Acesso</p>
                    {selectedUser.last_sign_in_at ? (
                      <p className="text-base font-medium text-chocolate flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-green-500" />
                        {format(new Date(selectedUser.last_sign_in_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                      </p>
                    ) : (
                      <p className="text-base font-medium text-chocolate/60 flex items-center gap-2">
                        <Clock size={16} />
                        Nunca acessou
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t-2 border-chocolate/10">
                <button
                  onClick={() => {
                    setShowPasswordModal(true);
                    setSelectedUser(selectedUser);
                  }}
                  className="flex-1 py-4 bg-chocolate text-white rounded-xl font-black uppercase tracking-widest hover:bg-chocolate-dark transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <Key size={18} />
                  Alterar Senha
                </button>
                <button
                  onClick={() => {
                    setShowDeleteModal(true);
                  }}
                  className="flex-1 py-4 bg-red-50 text-red-600 rounded-xl font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <Trash2 size={18} />
                  Excluir Usuário
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && selectedUser && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteModal(false)}
              className="absolute inset-0 bg-chocolate/90 backdrop-blur-xl"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white border-4 border-red-500 rounded-3xl p-8 shadow-2xl"
            >
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle size={32} className="text-red-500" />
              </div>

              <h3 className="text-2xl font-black text-chocolate uppercase tracking-tighter text-center mb-4">
                Excluir Usuário?
              </h3>

              <p className="text-chocolate/70 text-center mb-8 leading-relaxed">
                Tem certeza que deseja excluir permanentemente o usuário <strong>{selectedUser.email}</strong>?
                Esta ação não pode ser desfeita e todos os dados associados serão perdidos.
              </p>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  disabled={actionLoading}
                  className="flex-1 py-4 bg-paper text-chocolate rounded-xl font-black uppercase tracking-widest hover:bg-chocolate hover:text-white transition-all disabled:opacity-50 text-sm"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteUser}
                  disabled={actionLoading}
                  className="flex-1 py-4 bg-red-500 text-white rounded-xl font-black uppercase tracking-widest hover:bg-red-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                >
                  {actionLoading ? (
                    <>
                      <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                      Excluindo...
                    </>
                  ) : (
                    <>
                      <Trash2 size={18} />
                      Confirmar
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Password Reset Modal */}
      <AnimatePresence>
        {showPasswordModal && selectedUser && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPasswordModal(false)}
              className="absolute inset-0 bg-chocolate/90 backdrop-blur-xl"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white border-4 border-gold rounded-3xl p-8 shadow-2xl"
            >
              <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Key size={32} className="text-gold" />
              </div>

              <h3 className="text-2xl font-black text-chocolate uppercase tracking-tighter text-center mb-2">
                Alterar Senha
              </h3>
              <p className="text-chocolate/60 text-center mb-8 text-sm">
                Defina uma nova senha para <strong>{selectedUser.email}</strong>
              </p>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono font-bold text-chocolate/70 uppercase tracking-widest">Nova Senha</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full px-4 py-3 bg-paper border-2 border-paper rounded-xl focus:outline-none focus:border-gold font-medium text-chocolate"
                    autoFocus
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      setShowPasswordModal(false);
                      setNewPassword('');
                    }}
                    disabled={actionLoading}
                    className="flex-1 py-4 bg-paper text-chocolate rounded-xl font-black uppercase tracking-widest hover:bg-chocolate hover:text-white transition-all disabled:opacity-50 text-sm"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleResetPassword}
                    disabled={actionLoading || newPassword.length < 6}
                    className="flex-1 py-4 bg-gold text-white rounded-xl font-black uppercase tracking-widest hover:bg-gold-dark transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                  >
                    {actionLoading ? (
                      <>
                        <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={18} />
                        Confirmar
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
