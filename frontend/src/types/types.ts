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
  _id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string | null;
  isFeatured?: boolean;
}
