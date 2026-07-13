"use client";
import { ReactNode } from "react";
import { AuthProvider } from "./AuthContext";
import { ProductProvider } from "./ProductContext";
import { CartProvider } from "./CartContext";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          {children}
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  );
}
