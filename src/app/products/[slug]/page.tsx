"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Star, ShoppingCart, Heart, ChevronRight, ImageIcon, Minus, Plus, Loader2 } from "lucide-react";
import api from "@/lib/axios";
import Swal from "sweetalert2";
import { useCartStore } from "@/store/useCartStore"; // Added store import

// --- Interfaces based on your Prisma Schema ---
interface Attribute {
  name: string;
  values: string[];
}

interface Variation {
  id: string;
  sku: string;
  basePrice: string;
  salePrice?: string;
  stock: number;
  options: Record<string, string>;
  isDefault: boolean;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  shortDesc: string;
  longDesc: string;
  brand?: { name: string; slug: string };
  categories: { name: string; slug: string }[];
  featuredImage?: { originalUrl: string };
  images: { originalUrl: string }[];
  attributes: Attribute[];
  variations: Variation[];
  basePrice: string;
  salePrice?: string;
  rating?: number;
}

export default function ProductDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter(); 
  
  // Bring in the global addToCart action
  const addToCart = useCartStore(state => state.addToCart);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // User Selection State
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [currentVariation, setCurrentVariation] = useState<Variation | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  
  // Cart Network State
  const [isAdding, setIsAdding] = useState(false);

  // Fetch the product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${resolvedParams.slug}`);
        const data = response.data.product || response.data.data;
        setProduct(data);
        
        if (data.featuredImage?.originalUrl) {
          setActiveImage(data.featuredImage.originalUrl);
        }

        if (data.variations && data.variations.length > 0) {
          const defaultVar = data.variations.find((v: Variation) => v.isDefault) || data.variations[0];
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

  // Update currentVariation whenever the user changes an option
  useEffect(() => {
    if (!product || !product.variations) return;

    const matchedVariation = product.variations.find(v => {
      return Object.entries(selectedOptions).every(
        ([key, value]) => v.options[key] === value
      );
    });

    setCurrentVariation(matchedVariation || null);
    setQuantity(1);
  }, [selectedOptions, product]);

  const handleOptionSelect = (attributeName: string, value: string) => {
    setSelectedOptions(prev => ({ ...prev, [attributeName]: value }));
  };

  // --- ADD TO CART LOGIC (USING ZUSTAND STORE) ---
  const handleAddToCart = async () => {
    if (!product || !currentVariation) return;
    
    setIsAdding(true);
    try {
      // Replaced direct api.post with our global store action!
      await addToCart(currentVariation.id, quantity);
      
      Swal.fire({
        title: "Added to Cart!",
        text: "Your item has been successfully added to your shopping cart.",
        icon: "success",
        showCancelButton: true,
        confirmButtonColor: "#0ea5e9", 
        cancelButtonColor: "#64748b",
        confirmButtonText: "Go to Cart",
        cancelButtonText: "Stay on this page",
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/cart");
        }
      });
      
    } catch (error: any) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        Swal.fire({
          title: "Login Required",
          text: "You need to log in to add items to your cart.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#0ea5e9",
          cancelButtonColor: "#64748b",
          confirmButtonText: "Go to Login",
          cancelButtonText: "Cancel"
        }).then((result) => {
          if (result.isConfirmed) {
            router.push("/login");
          }
        });
      } else {
        Swal.fire({
          title: "Error",
          text: error.response?.data?.message || "Failed to add to cart. Please try again later.",
          icon: "error",
          confirmButtonColor: "#0ea5e9"
        });
      }
    } finally {
      setIsAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-24 flex justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold text-heading mb-4">Product Not Found</h2>
        <Link href="/shop" className="text-primary hover:underline">Return to Shop</Link>
      </div>
    );
  }

  const displayBasePrice = Number(currentVariation?.basePrice || product.basePrice || 0);
  const displaySalePrice = currentVariation?.salePrice ? Number(currentVariation.salePrice) : 
                           product.salePrice ? Number(product.salePrice) : null;
                           
  const currentPrice = displaySalePrice || displayBasePrice;
  const originalPrice = displaySalePrice ? displayBasePrice : null;
  const currentStock = currentVariation ? currentVariation.stock : 0;

  return (
    <div className="min-h-screen bg-background py-6 md:py-10">
      <div className="container mx-auto px-4">
        
        {/* Breadcrumbs - Hidden on very small mobile to save space, visible sm+ */}
        <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/shop" className="hover:text-primary transition-colors">Shop</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-heading truncate">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-20">
          
          {/* --- LEFT: Image Gallery --- */}
          <div className="space-y-4">
            <div className="aspect-square bg-card border border-border rounded-3xl overflow-hidden relative flex items-center justify-center">
              {activeImage ? (
                <img src={activeImage} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="w-20 h-20 text-muted-foreground/30" />
              )}
            </div>
            
            {product.images && product.images.length > 0 && (
              <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 scrollbar-hide">
                <button 
                  onClick={() => setActiveImage(product.featuredImage?.originalUrl || null)}
                  className={`w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 ${activeImage === product.featuredImage?.originalUrl ? 'border-primary' : 'border-transparent'}`}
                >
                  <img src={product.featuredImage?.originalUrl} className="w-full h-full object-cover" />
                </button>
                {product.images.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImage(img.originalUrl)}
                    className={`w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 ${activeImage === img.originalUrl ? 'border-primary' : 'border-transparent'}`}
                  >
                    <img src={img.originalUrl} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* --- RIGHT: Product Info --- */}
          <div className="flex flex-col">
            
            {product.brand && (
              <Link href={`/brand/${product.brand.slug}`} className="text-primary font-bold text-xs sm:text-sm uppercase tracking-wider mb-2 hover:underline">
                {product.brand.name}
              </Link>
            )}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-heading leading-tight mb-4">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-2 mb-6">
              <div className="flex text-yellow-500">
                {[1, 2, 3, 4, 5].map((star) => (
                   <Star key={star} className={`w-3 h-3 sm:w-4 sm:h-4 ${star <= (product.rating || 5) ? 'fill-current' : 'text-muted/30'}`} />
                ))}
              </div>
              <span className="text-xs sm:text-sm text-muted-foreground">(24 Reviews)</span>
            </div>

            <div className="flex flex-wrap items-end gap-3 sm:gap-4 mb-6">
              <span className="text-3xl sm:text-4xl font-black text-primary">${currentPrice.toFixed(2)}</span>
              {originalPrice && (
                <span className="text-lg sm:text-xl text-muted-foreground line-through mb-1">${originalPrice.toFixed(2)}</span>
              )}
              {currentVariation?.sku && (
                 <span className="text-xs text-muted-foreground w-full sm:w-auto sm:ml-auto mb-1 font-mono mt-2 sm:mt-0">SKU: {currentVariation.sku}</span>
              )}
            </div>

            <p className="text-sm sm:text-base text-subheading mb-8 leading-relaxed">
              {product.shortDesc}
            </p>

            <div className="w-full h-px bg-border mb-8"></div>

            {/* --- VARIATION SELECTORS --- */}
            {product.attributes && product.attributes.length > 0 && (
              <div className="space-y-6 mb-8">
                {product.attributes.map((attr) => (
                  <div key={attr.name}>
                    <h3 className="text-xs sm:text-sm font-bold text-heading mb-3 uppercase tracking-wider">{attr.name}</h3>
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                      {attr.values.map((val) => {
                        const isSelected = selectedOptions[attr.name] === val;
                        return (
                          <button
                            key={val}
                            onClick={() => handleOptionSelect(attr.name, val)}
                            className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${
                              isSelected 
                                ? 'border-primary bg-primary/5 text-primary' 
                                : 'border-border text-muted-foreground hover:border-primary/50'
                            }`}
                          >
                            {val}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Stock Status */}
            <div className="mb-6">
              {currentStock > 0 ? (
                <span className="inline-flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  In Stock ({currentStock} available)
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 text-red-600 bg-red-50 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  Out of Stock
                </span>
              )}
            </div>

            {/* Actions: Quantity & Add to Cart - Fully Responsive */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-4 mb-10">
              
              <div className="flex gap-3 w-full sm:w-auto">
                <div className="flex items-center flex-grow sm:flex-grow-0 bg-card border border-border rounded-2xl p-1 h-14">
                  <button 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-10 sm:w-12 h-full flex items-center justify-center text-heading hover:bg-muted/50 rounded-xl transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 sm:w-12 text-center font-bold text-lg">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(q => Math.min(currentStock, q + 1))}
                    disabled={quantity >= currentStock}
                    className="w-10 sm:w-12 h-full flex items-center justify-center text-heading hover:bg-muted/50 rounded-xl transition-colors disabled:opacity-30"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button className="w-14 h-14 flex-shrink-0 sm:order-last flex items-center justify-center border border-border rounded-2xl text-muted-foreground hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-colors">
                  <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>

              <button 
                onClick={handleAddToCart}
                disabled={currentStock === 0 || !currentVariation || isAdding}
                className="w-full sm:w-auto flex-grow h-14 flex items-center justify-center gap-2 sm:gap-3 bg-primary text-white font-bold text-base sm:text-lg rounded-2xl hover:shadow-theme-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:pointer-events-none"
              >
                {isAdding ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    {currentStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </>
                )}
              </button>

            </div>

            {/* Long Description */}
            {product.longDesc && (
              <div className="bg-card border border-border rounded-2xl p-5 sm:p-6">
                <h3 className="font-bold text-heading mb-3 sm:mb-4">Product Description</h3>
                <div 
                  className="text-sm sm:text-base text-subheading leading-relaxed prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: product.longDesc }}
                />
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}