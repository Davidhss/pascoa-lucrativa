import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Recipes } from './components/Recipes';
import { Orders } from './components/Orders';
import { Finance } from './components/Finance';
import { Onboarding } from './components/Onboarding';
import { Pricing } from './components/Pricing';
import { MenuCreator } from './components/MenuCreator';
import { Marketing } from './components/Marketing';
import { Auth } from './components/Auth';
import { Recipe, Order, Cost, UserSettings, OrderStatus, PaymentStatus } from './types';
import { RECIPES } from './data/recipes';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, LogOut } from 'lucide-react';
import { supabase } from './lib/supabase';

const STORAGE_KEY = 'pascoa_lucrativa_data';

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [settings, setSettings] = useState<UserSettings>({
    confectioneryName: '',
    revenueGoal: 6000,
    onboarded: false,
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const [costs, setCosts] = useState<Cost[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [menu, setMenu] = useState<Recipe[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  // Auth Session & Data Loading
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
      if (session) {
        loadSupabaseData(session.user.id);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        loadSupabaseData(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadSupabaseData = async (userId: string) => {
    try {
      // Load Settings
      const { data: settingsData } = await supabase
        .from('settings')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (settingsData) {
        setSettings({
          confectioneryName: settingsData.confectionery_name,
          revenueGoal: settingsData.revenue_goal,
          onboarded: settingsData.onboarded,
        });
      }

      // Load Orders
      const { data: ordersData } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (ordersData) {
        setOrders(ordersData.map(o => ({
          id: o.id,
          customerName: o.customer_name,
          customerWhatsapp: o.customer_whatsapp,
          productId: o.product_id,
          productName: o.product_name,
          quantity: o.quantity,
          size: o.size,
          value: o.value,
          paymentMethod: o.payment_method,
          paymentStatus: o.payment_status,
          deliveryDate: o.delivery_date,
          observations: o.observations,
          status: o.status,
          createdAt: o.created_at,
        })));
      }

      // Load Costs
      const { data: costsData } = await supabase
        .from('costs')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });
      
      if (costsData) {
        setCosts(costsData.map(c => ({
          id: c.id,
          description: c.description,
          category: c.category,
          value: c.value,
          date: c.date,
        })));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2000);
  };

  const handleOnboarding = async (name: string, goal: number) => {
    if (!session) return;
    
    const newSettings = { confectioneryName: name, revenueGoal: goal, onboarded: true };
    setSettings(newSettings);

    await supabase.from('settings').upsert({
      user_id: session.user.id,
      confectionery_name: name,
      revenue_goal: goal,
      onboarded: true,
    });

    showToast('Bem-vinda! Vamos faturar alto!');
  };

  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const handleReset = async () => {
    if (!session) return;
    
    await supabase.from('orders').delete().eq('user_id', session.user.id);
    await supabase.from('costs').delete().eq('user_id', session.user.id);
    await supabase.from('settings').delete().eq('user_id', session.user.id);
    
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  };

  const totalRevenue = orders
    .filter(o => o.paymentStatus === 'Pago')
    .reduce((acc, curr) => acc + curr.value, 0);

  const activeOrdersCount = orders.filter(o => o.status !== 'Entregue').length;
  const ticketAverage = orders.length > 0 ? orders.reduce((acc, curr) => acc + curr.value, 0) / orders.length : 0;

  if (authLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gold/30 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) {
    return <Auth onAuthSuccess={() => showToast('Bem-vinda de volta!')} />;
  }

  if (!settings.onboarded) {
    return <Onboarding onComplete={handleOnboarding} />;
  }

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      confectioneryName={settings.confectioneryName}
      onReset={() => setIsResetModalOpen(true)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'dashboard' && (
            <Dashboard 
              revenueGoal={settings.revenueGoal}
              totalRevenue={totalRevenue}
              activeOrders={activeOrdersCount}
              ticketAverage={ticketAverage}
              recentOrders={orders.slice(0, 5)}
              onMarkAsDelivered={async (id) => {
                const { error } = await supabase
                  .from('orders')
                  .update({ status: 'Entregue' })
                  .eq('id', id);
                
                if (!error) {
                  setOrders(orders.map(o => o.id === id ? { ...o, status: 'Entregue' } : o));
                  showToast('Pedido entregue! 🎉');
                }
              }}
            />
          )}

          {activeTab === 'recipes' && (
            <Recipes 
              favorites={favorites}
              onToggleFavorite={(id) => {
                setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
                showToast('Favoritos atualizados!');
              }}
              onAddToMenu={(recipe, price) => {
                if (!menu.find(m => m.id === recipe.id)) {
                  setMenu([...menu, { ...recipe, suggestedPrice: price }]);
                  showToast('Adicionado ao seu cardápio!');
                } else {
                  showToast('Este item já está no seu cardápio.');
                }
              }}
            />
          )}

          {activeTab === 'orders' && (
            <Orders 
              orders={orders}
              menu={menu}
              onAddOrder={async (newOrder) => {
                if (!session) return;
                const { data, error } = await supabase
                  .from('orders')
                  .insert([{
                    user_id: session.user.id,
                    customer_name: newOrder.customerName,
                    customer_whatsapp: newOrder.customerWhatsapp,
                    product_id: newOrder.productId,
                    product_name: newOrder.productName,
                    quantity: newOrder.quantity,
                    size: newOrder.size,
                    value: newOrder.value,
                    payment_method: newOrder.paymentMethod,
                    payment_status: newOrder.paymentStatus,
                    delivery_date: newOrder.deliveryDate,
                    observations: newOrder.observations,
                    status: 'Novo',
                  }])
                  .select()
                  .single();

                if (!error && data) {
                  setOrders([{
                    ...newOrder,
                    id: data.id,
                    createdAt: data.created_at
                  }, ...orders]);
                  showToast('Pedido registrado com sucesso!');
                }
              }}
              onUpdateStatus={async (id, status) => {
                const { error } = await supabase
                  .from('orders')
                  .update({ status })
                  .eq('id', id);
                
                if (!error) {
                  setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
                  showToast('Status atualizado!');
                }
              }}
              onUpdatePayment={async (id, status) => {
                const { error } = await supabase
                  .from('orders')
                  .update({ payment_status: status })
                  .eq('id', id);
                
                if (!error) {
                  setOrders(orders.map(o => o.id === id ? { ...o, paymentStatus: status } : o));
                  showToast('Pagamento atualizado!');
                }
              }}
              onDeleteOrder={async (id) => {
                const { error } = await supabase
                  .from('orders')
                  .delete()
                  .eq('id', id);
                
                if (!error) {
                  setOrders(orders.filter(o => o.id !== id));
                  showToast('Pedido removido.');
                }
              }}
            />
          )}

          {activeTab === 'finance' && (
            <Finance 
              orders={orders}
              costs={costs}
              confectioneryName={settings.confectioneryName}
              settings={settings}
              onAddCost={async (newCost) => {
                if (!session) return;
                const { data, error } = await supabase
                  .from('costs')
                  .insert([{
                    user_id: session.user.id,
                    description: newCost.description,
                    category: newCost.category,
                    value: newCost.value,
                    date: newCost.date,
                  }])
                  .select()
                  .single();

                if (!error && data) {
                  setCosts([{ ...newCost, id: data.id }, ...costs]);
                  showToast('Custo registrado!');
                }
              }}
              onDeleteCost={async (id) => {
                const { error } = await supabase
                  .from('costs')
                  .delete()
                  .eq('id', id);
                
                if (!error) {
                  setCosts(costs.filter(c => c.id !== id));
                  showToast('Custo removido.');
                }
              }}
              onMarkAsPaid={async (id) => {
                const { error } = await supabase
                  .from('orders')
                  .update({ payment_status: 'Pago' })
                  .eq('id', id);
                
                if (!error) {
                  setOrders(orders.map(o => o.id === id ? { ...o, paymentStatus: 'Pago' } : o));
                  showToast('Pagamento recebido! 💰');
                }
              }}
            />
          )}

          {activeTab === 'pricing' && (
            <Pricing />
          )}

          {activeTab === 'menu' && (
            <MenuCreator />
          )}

          {activeTab === 'marketing' && (
            <Marketing />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Reset Confirmation Modal */}
      <AnimatePresence>
        {isResetModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsResetModalOpen(false)}
              className="absolute inset-0 bg-chocolate/60 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm bg-white rounded-[40px] p-10 text-center space-y-6 shadow-2xl"
            >
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle size={40} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-chocolate uppercase tracking-tighter">Apagar tudo?</h3>
                <p className="text-chocolate/50 font-medium text-sm">Esta ação não pode ser desfeita. Todos os seus dados serão perdidos.</p>
              </div>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleReset}
                  className="w-full py-4 bg-red-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-red-600 transition-all"
                >
                  Sim, apagar tudo
                </button>
                <button 
                  onClick={() => setIsResetModalOpen(false)}
                  className="w-full py-4 bg-paper text-chocolate rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-chocolate hover:text-white transition-all"
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 right-8 z-[100] bg-[#2D241E] text-white px-6 py-3 rounded-2xl shadow-2xl font-bold flex items-center gap-3"
          >
            <div className="w-2 h-2 bg-[#B8860B] rounded-full animate-pulse" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
