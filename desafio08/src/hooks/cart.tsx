import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';
import { getAllJSDocTagsOfKind } from 'typescript';
import api from '../services/api';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Omit<Product, 'quantity'>): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      const storedCartProducts = await AsyncStorage.getItem('@GoMarketPlace');

      if (storedCartProducts) {
        const cartProducts = JSON.parse(storedCartProducts);
        setProducts([...cartProducts]);
      }
    }
    loadProducts();
  }, []);

  const addToCart = useCallback(
    async product => {
      const productInCart = products.find(p => p.id === product.id);

      if (productInCart) {
        setProducts(
          products.map(p =>
            p.id === product.id ? { ...product, quantity: p.quantity + 1 } : p,
          ),
        );
      } else {
        setProducts([...products, { ...product, quantity: 1 }]);
      }

      await AsyncStorage.setItem('@GoMarketPlace', JSON.stringify(products));
    },
    [products],
  );

  const increment = useCallback(
    async id => {
      const incrementedProducts = products.map(product =>
        product.id === id
          ? { ...product, quantity: product.quantity + 1 }
          : product,
      );
      setProducts(incrementedProducts);
      await AsyncStorage.setItem(
        '@GoMarketPlace',
        JSON.stringify(incrementedProducts),
      );
    },
    [products],
  );

  const decrement = useCallback(
    async id => {
      const decrementedProducts = products.map(product =>
        product.id === id
          ? { ...product, quantity: product.quantity - 1 }
          : product,
      );
      setProducts(decrementedProducts);
      await AsyncStorage.setItem(
        '@GoMarketPlace',
        JSON.stringify(decrementedProducts),
      );
    },
    [products],
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
