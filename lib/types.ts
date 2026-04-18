// ============================================================
// Bhook - TypeScript Types
// ============================================================

export type ProductCategory = 'Chips' | 'Noodles' | 'Chocolates' | 'Drinks' | 'Biscuits' | 'Others';

export type OrderStatus = 'reserved' | 'pending_pickup' | 'completed' | 'cancelled';

export interface Product {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  cost_price: number;
  selling_price: number;
  stock_quantity: number;
  active: boolean;
  category: string;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  room_number: string;
  phone_number: string | null;
  total_amount: number;
  total_cost: number;
  total_profit: number;
  status: OrderStatus;
  payment_mode: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_cost_price: number;
  unit_selling_price: number;
  line_total: number;
  line_cost: number;
  line_profit: number;
  created_at: string;
}

export interface ProfitSplit {
  id: string;
  person_name: string;
  percentage: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Setting {
  key: string;
  value: string;
  updated_at: string;
}

// Cart types (client-side only)
export interface CartItem {
  product: Product;
  quantity: number;
}

// Analytics types
export interface DailyStats {
  date: string;
  total_orders: number;
  total_revenue: number;
  total_cost: number;
  total_profit: number;
  completed_orders: number;
  pending_orders: number;
  cancelled_orders: number;
}

export interface ProductSalesStats {
  product_id: string;
  product_name: string;
  total_quantity: number;
  total_revenue: number;
  total_profit: number;
}

export interface ProfitSplitResult {
  person_name: string;
  percentage: number;
  amount: number;
}

// Form types
export interface CheckoutFormData {
  customer_name: string;
  room_number: string;
  phone_number: string;
}

export interface ProductFormData {
  name: string;
  description: string;
  cost_price: number;
  selling_price: number;
  stock_quantity: number;
  category: string;
  active: boolean;
}

// API response types
export interface PlaceOrderResponse {
  order_id: string;
  order_number: string;
  total_amount: number;
  total_profit: number;
}

export interface ApiError {
  message: string;
  code?: string;
}
