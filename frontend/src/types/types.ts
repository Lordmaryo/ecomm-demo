export interface SignUpProps {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LogInProps {
  email: string;
  password: string;
}

export interface useUserStoreProps {
  user: UserResponse | null;
  loading: boolean;
  checkingAuth: boolean;
  signUp: (props: SignUpProps) => void;
  login: (props: LogInProps) => void;
  checkAuth: () => void;
  logout: () => void;
}

export interface CartProducts extends Product {
  quantity: number;
}

export interface useCartStoreProps {
  cart: Product[];
  total: number;
  subTotal: number;
  coupon: Coupon | null;
  loading: boolean;
  isCouponApplied: boolean;
  getCartItems: () => Promise<void>;
  addTocart: (product: CartProducts) => Promise<void>;
  removeAllFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  calculateTotals: () => void;
  clearCart: () => void;
}

export interface Coupon {
  code: string;
  discountPercentage: number;
  expirationDate: Date;
  isActive: boolean;
  userId: string;
}

export interface useProductStoreProps {
  loading: boolean;
  products: Product[];
  setProduct: (products: Product[]) => void;
  createProduct: (newProduct: Product) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  getAllProduct: () => Promise<void>;
  fetchProductByCategory: (category: string) => Promise<void>;
  toggleFeauturedProduct: (productId: string) => Promise<void>;
}

export enum Roles {
  ADMIN = "ADMIN",
  CUSTOMER = "CUSTOMER",
}

export interface UserResponse {
  userId: string;
  firstName: string;
  lastName: string;
  role: Roles;
}

export interface Product {
  quantity: number;
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string | null;
  isFeatured?: boolean;
}

export interface paymentSessionResponse {
  sessionId: string;
  totalAmount: number;
}
