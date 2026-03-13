"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Heart } from "lucide-react";
import api from "@/lib/axios";
import { useCartStore } from "@/store/useCartStore";
import { useUserStore } from "@/store/useUserStore"; // Added User Store for Auth
import Swal from "sweetalert2";

// Import our newly split components
import ProductGallery from "@/components/shop/ProductGallery";
import ProductInfo from "@/components/shop/ProductInfo";
import ProductTabs from "@/components/shop/ProductTabs";

export default function ProductDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();

  const addToCart = useCartStore(state => state.addToCart);
  const { isAuthenticated } = useUserStore(); // Track if user is logged in

  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [currentVariation, setCurrentVariation] = useState<any | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  // --- WISHLIST STATE ---
  const [wishlistVarIds, setWishlistVarIds] = useState<Set<string>>(new Set());

  // 1. Fetch Product
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

  // 2. Fetch Wishlist (Only if authenticated)
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!isAuthenticated) return;
      try {
        const res = await api.get('/wishlist');
        const items = res.data.data?.items || [];
        const ids = items.map((item: any) => item.variationId);
        setWishlistVarIds(new Set(ids));
      } catch (err) {
        console.error("Failed to load wishlist", err);
      }
    };
    fetchWishlist();
  }, [isAuthenticated]);

  // 3. Keep Variation in Sync with Options
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

  // 4. Handle Wishlist Action (Independent of child components)
  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      const result = await Swal.fire({
        title: "Login Required",
        text: "Please log in to save items to your wishlist.",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Go to Login",
        cancelButtonText: "Cancel",
        background: "hsl(var(--card))",
        color: "hsl(var(--foreground))",
        customClass: {
          popup: 'border border-border rounded-2xl shadow-theme-lg',
          htmlContainer: 'text-muted-foreground',
          confirmButton: 'bg-primary text-primary-foreground font-bold rounded-lg px-4 py-2',
        }
      });

      if (result.isConfirmed) router.push("/login");
      return;
    }

    if (!currentVariation) return;

    const targetVarId = currentVariation.id;
    const currentlyWished = wishlistVarIds.has(targetVarId);

    // Optimistic UI Updates (Update UI instantly, revert if API fails)
    if (currentlyWished) {
      setWishlistVarIds(prev => { const next = new Set(prev); next.delete(targetVarId); return next; });
      try {
        await api.delete(`/wishlist/${targetVarId}`);
      } catch (error) {
        setWishlistVarIds(prev => { const next = new Set(prev); next.add(targetVarId); return next; });
        Swal.fire({ toast: true, position: 'bottom-end', icon: 'error', title: 'Failed to remove from wishlist', showConfirmButton: false, timer: 3000 });
      }
    } else {
      setWishlistVarIds(prev => { const next = new Set(prev); next.add(targetVarId); return next; });
      try {
        await api.post('/wishlist', { variationId: targetVarId });
      } catch (error) {
        setWishlistVarIds(prev => { const next = new Set(prev); next.delete(targetVarId); return next; });
        Swal.fire({ toast: true, position: 'bottom-end', icon: 'error', title: 'Failed to add to wishlist', showConfirmButton: false, timer: 3000 });
      }
    }
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
        reverseButtons: true,
        background: "hsl(var(--card))",
        color: "hsl(var(--foreground))",
        customClass: {
          popup: 'border border-border rounded-2xl shadow-theme-lg',
          htmlContainer: 'text-muted-foreground',
          confirmButton: 'bg-primary text-primary-foreground font-bold rounded-lg px-4 py-2',
        }
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
          confirmButtonText: "Go to Login",
          background: "hsl(var(--card))",
          color: "hsl(var(--foreground))",
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

  // Derive if the exact selected variation is in the wishlist
  const isWished = currentVariation ? wishlistVarIds.has(currentVariation.id) : false;

  return (
    <main className="min-h-screen bg-background py-6 md:py-12">
      <div className="container mx-auto px-[5%] max-w-360">

        {/* TOP ACTION BAR: Breadcrumbs & Wishlist Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">

          {/* Breadcrumbs */}
          <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/products" className="hover:text-primary transition-colors">Products</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-primary truncate max-w-75">{product.name}</span>
          </div>

          {/* INDEPENDENT WISHLIST BUTTON */}
          <button
            onClick={handleWishlistToggle}
            disabled={!currentVariation}
            className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border-2 transition-all font-bold disabled:opacity-50 disabled:cursor-not-allowed ${isWished
                ? 'border-red-500 bg-red-500/10 text-red-500 hover:bg-red-500/20 shadow-sm'
                : 'border-border bg-card text-muted-foreground hover:border-primary hover:text-primary shadow-sm'
              }`}
          >
            <Heart className={`w-4 h-4 transition-transform ${isWished ? 'fill-red-500 scale-110' : 'scale-100'}`} />
            <span>{isWished ? 'Saved to Wishlist' : 'Add to Wishlist'}</span>
          </button>
        </div>

        {/* Row 1: Split 50/50 Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <ProductGallery
            featuredImage={product.featuredImage}
            images={product.images || []}
            productName={product.name}
            currentVariation={currentVariation}
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