"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import api from "@/lib/axios";
import { useCartStore } from "@/store/useCartStore";
import Swal from "sweetalert2";

// Import our newly split components
import ProductGallery from "@/components/shop/ProductGallery";
import ProductInfo from "@/components/shop/ProductInfo";
import ProductTabs from "@/components/shop/ProductTabs";

export default function ProductDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const addToCart = useCartStore(state => state.addToCart);

  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [currentVariation, setCurrentVariation] = useState<any | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${resolvedParams.slug}`);
        const data = response.data.product || response.data.data;
        setProduct(data);

        if (data.variations && data.variations.length > 0) {
          const defaultVar = data.variations.find((v: any) => v.isDefault) || data.variations[0];
          setSelectedOptions(defaultVar.options);
          setCurrentVariation(defaultVar);
        }
      } catch (err: any) {
        setError("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [resolvedParams.slug]);

  useEffect(() => {
    if (!product || !product.variations) return;
    const matchedVariation = product.variations.find((v: any) => {
      return Object.entries(selectedOptions).every(([key, value]) => v.options[key] === value);
    });
    setCurrentVariation(matchedVariation || null);
    setQuantity(1);
  }, [selectedOptions, product]);

  const handleOptionSelect = (attributeName: string, value: string) => {
    setSelectedOptions(prev => ({ ...prev, [attributeName]: value }));
  };

  const handleAddToCart = async () => {
    if (!product || !currentVariation) return;
    setIsAdding(true);
    try {
      await addToCart(currentVariation.id, quantity);
      Swal.fire({
        title: "Added to Cart!",
        icon: "success",
        showCancelButton: true,
        confirmButtonColor: "#0ea5e9",
        cancelButtonColor: "#64748b",
        confirmButtonText: "Go to Cart",
        cancelButtonText: "Keep Shopping",
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) router.push("/cart");
      });
    } catch (error: any) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        Swal.fire({
          title: "Login Required",
          text: "You need to log in to add items to your cart.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#0ea5e9",
          confirmButtonText: "Go to Login",
        }).then((result) => {
          if (result.isConfirmed) router.push("/login");
        });
      } else {
        Swal.fire("Error", "Failed to add to cart.", "error");
      }
    } finally {
      setIsAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-xl"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <h2 className="text-3xl font-black text-heading mb-4 uppercase">Product Not Found</h2>
        <Link href="/products" className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform">Back to Store</Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background py-6 md:py-12">
      <div className="container mx-auto px-[5%] max-w-360">

        {/* Breadcrumbs */}
        <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest mb-8">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/products" className="hover:text-primary transition-colors">Products</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-primary truncate max-w-75">{product.name}</span>
        </div>

        {/* Row 1: Split 50/50 Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <ProductGallery
            featuredImage={product.featuredImage}
            images={product.images || []}
            productName={product.name}
          />

          <ProductInfo
            product={product}
            currentVariation={currentVariation}
            selectedOptions={selectedOptions}
            handleOptionSelect={handleOptionSelect}
            quantity={quantity}
            setQuantity={setQuantity}
            handleAddToCart={handleAddToCart}
            isAdding={isAdding}
          />
        </div>

        {/* Row 2: Dynamic Tabs */}
        <ProductTabs product={product} />

      </div>
    </main>
  );
}