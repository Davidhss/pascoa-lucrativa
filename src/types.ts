export type Category = 'Clássico' | 'Gourmet' | 'Diet' | 'Infantil';
export type Difficulty = 'Fácil' | 'Médio' | 'Avançado';
export type OrderStatus = 'Novo' | 'Em Produção' | 'Pronto' | 'Entregue';
export type PaymentStatus = 'Pago' | 'Sinal Pago' | 'Aguardando';
export type CostCategory = 'Ingredientes' | 'Embalagens' | 'Outros';

export interface Recipe {
  id: string;
  name: string;
  category: Category;
  image: string;
  icon?: string;
  description: string;
  yield: string;
  difficulty: Difficulty;
  time: string;
  validity: string;
  ingredients: { item: string; amount: string }[];
  instructions: string[];
  tip: string;
  cost: number;
  suggestedPrice: number;
  profitMargin: number;
  isFavorite?: boolean;
  isInMenu?: boolean;
}

export interface Order {
  id: string;
  customerName: string;
  customerWhatsapp: string;
  productId: string;
  productName: string;
  quantity: number;
  size: string;
  value: number;
  paymentMethod: 'Pix' | 'Dinheiro' | 'Cartão';
  paymentStatus: PaymentStatus;
  deliveryDate: string;
  observations: string;
  status: OrderStatus;
  createdAt: string;
}

export interface Cost {
  id: string;
  description: string;
  category: CostCategory;
  value: number;
  date: string;
}

export interface UserSettings {
  confectioneryName: string;
  revenueGoal: number;
  onboarded: boolean;
}
