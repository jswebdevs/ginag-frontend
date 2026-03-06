"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import Swal from "sweetalert2";
import { MapPin, User, Receipt, Save, CreditCard, Plus, Trash2, Search, PackageOpen } from "lucide-react";

interface OrderFormsProps {
  initialData?: any;
  onUpdateSuccess?: () => void;
}

export default function OrderForms({ initialData, onUpdateSuccess }: OrderFormsProps) {
  const router = useRouter();
  const isEdit = !!initialData;

  // --- FORM STATES ---
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    fullAddress: "",
    deliveryFee: 0,
    discountAmount: 0,
    paidAmount: 0,
    paymentMethod: "CASH_ON_DELIVERY",
    paymentStatus: isEdit ? "UNPAID" : "PAID",
    status: isEdit ? "PENDING" : "CONFIRMED", 
  });

  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [updating, setUpdating] = useState(false);

  // --- PRODUCT SEARCH STATES (For Create Mode) ---
  const [products, setProducts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedVar, setSelectedVar] = useState<any>(null);
  const [addQty, setAddQty] = useState(1);

  // Sync Data if Editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        customerName: initialData.customerName || "",
        customerPhone: initialData.customerPhone || "",
        customerEmail: initialData.customerEmail || "",
        fullAddress: initialData.shippingAddress?.fullAddress || initialData.shippingAddress?.street || "",
        deliveryFee: Number(initialData.deliveryFee) || 0,
        discountAmount: Number(initialData.discountAmount) || 0,
        paidAmount: Number(initialData.paidAmount) || 0,
        paymentMethod: initialData.paymentMethod || "CASH_ON_DELIVERY",
        paymentStatus: initialData.paymentStatus || "UNPAID",
        status: initialData.status || "PENDING",
      });
      setOrderItems(initialData.items || []);
    } else {
      // If creating, fetch products for the dropdown
      fetchProducts();
    }
  }, [initialData]);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products?limit=100'); // Fetch enough for the manual search list
      setProducts(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleInputChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- ITEM MANAGEMENT (Create Mode) ---
  const addItemToOrder = () => {
    if (!selectedProduct || !selectedVar) return;
    
    if (addQty > selectedVar.stock) {
      return Swal.fire("Stock Error", `Only ${selectedVar.stock} available.`, "warning");
    }

    const price = Number(selectedVar.salePrice || selectedVar.basePrice);
    
    const newItem = {
      productId: selectedProduct.id,
      variationId: selectedVar.id,
      productName: `${selectedProduct.name} (${selectedVar.name})`,
      price: price,
      quantity: addQty,
      totalPrice: price * addQty
    };

    setOrderItems([...orderItems, newItem]);
    
    // Reset inputs
    setSelectedProduct(null);
    setSelectedVar(null);
    setAddQty(1);
    setSearchQuery("");
  };

  const removeItem = (index: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  // --- CALCULATIONS ---
  const subtotal = orderItems.reduce((sum, item) => sum + (Number(item.price) * Number(item.quantity)), 0);
  const finalTotal = subtotal + Number(formData.deliveryFee) - Number(formData.discountAmount);
  const dueAmount = finalTotal - Number(formData.paidAmount);

  // --- SUBMIT LOGIC ---
  const handleSubmit = async () => {
    if (!isEdit && orderItems.length === 0) {
      return Swal.fire("Error", "Please add at least one item to the order.", "error");
    }
    
    setUpdating(true);
    try {
      if (isEdit) {
        // Edit Mode: Update Statuses
        await api.patch(`/orders/${initialData.id}/status`, {
          status: formData.status,
          paymentStatus: formData.paymentStatus,
          paidAmount: Number(formData.paidAmount)
        });
        Swal.fire({ icon: "success", title: "Updated", text: "Order status saved.", timer: 1500, showConfirmButton: false });
        if (onUpdateSuccess) onUpdateSuccess();
      } else {
        // Create Mode: Call the new Admin Order Controller
        const payload = {
          customerName: formData.customerName,
          customerPhone: formData.customerPhone,
          customerEmail: formData.customerEmail,
          shippingAddress: { fullAddress: formData.fullAddress },
          items: orderItems,
          deliveryFee: formData.deliveryFee,
          discountAmount: formData.discountAmount,
          paidAmount: formData.paidAmount,
          paymentMethod: formData.paymentMethod,
          paymentStatus: formData.paymentStatus,
          status: formData.status
        };
        // NOTE: Ensure your route matches your backend setup!
        await api.post(`/orders/admin`, payload); 
        Swal.fire({ icon: "success", title: "Order Created", timer: 1500, showConfirmButton: false });
        router.push("/dashboard/super-admin/orders");
      }
    } catch (err: any) {
      Swal.fire("Error", err.response?.data?.message || "Failed to save order", "error");
    } finally {
      setUpdating(false);
    }
  };

  // Search filter for products dropdown
  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      
      {/* --- LEFT COLUMN: Items & Pricing --- */}
      <div className="flex-1 space-y-6">
        
        {/* ADD ITEMS SECTION (ONLY IN CREATE MODE) */}
        {!isEdit && (
          <div className="bg-card border border-border rounded-3xl p-6 shadow-theme-sm">
            <h2 className="text-lg font-black text-foreground mb-4 flex items-center gap-2"><PackageOpen size={18}/> Add Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              
              <div className="md:col-span-5 relative">
                <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">Search Product</label>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 text-muted-foreground" size={16} />
                  <input 
                    type="text" value={searchQuery} onChange={(e) => {setSearchQuery(e.target.value); setSelectedProduct(null); setSelectedVar(null);}}
                    placeholder="Search name..." className="w-full bg-background border border-border rounded-xl pl-9 pr-3 py-2 text-sm outline-none focus:border-primary"
                  />
                  {searchQuery && !selectedProduct && (
                    <div className="absolute top-full left-0 w-full mt-1 bg-card border border-border rounded-xl shadow-lg z-50 max-h-48 overflow-y-auto p-1">
                      {filteredProducts.map(p => (
                        <div key={p.id} onClick={() => { setSelectedProduct(p); setSearchQuery(p.name); }} className="px-3 py-2 text-sm hover:bg-muted rounded-lg cursor-pointer font-medium">
                          {p.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="md:col-span-4">
                <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">Variation</label>
                <select 
                  disabled={!selectedProduct}
                  onChange={(e) => setSelectedVar(selectedProduct.variations.find((v:any) => v.id === e.target.value))}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm outline-none focus:border-primary disabled:opacity-50"
                >
                  <option value="">Select Option...</option>
                  {selectedProduct?.variations?.map((v: any) => (
                    <option key={v.id} value={v.id}>{v.name} - ৳{v.salePrice || v.basePrice} ({v.stock} in stock)</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">Qty</label>
                <input type="number" min="1" value={addQty} onChange={(e) => setAddQty(Number(e.target.value))} className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm outline-none focus:border-primary" />
              </div>

              <div className="md:col-span-1">
                <button onClick={addItemToOrder} disabled={!selectedVar} className="w-full h-[38px] bg-foreground text-background flex items-center justify-center rounded-xl hover:scale-105 transition-transform disabled:opacity-50">
                  <Plus size={18} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ORDER ITEMS TABLE */}
        <div className="bg-card border border-border rounded-3xl p-6 shadow-theme-sm">
          <h2 className="text-lg font-black text-foreground mb-4 flex items-center gap-2"><Receipt size={18}/> Order Items</h2>
          <div className="overflow-x-auto border border-border rounded-2xl">
            <table className="w-full text-left whitespace-nowrap">
              <thead className="bg-muted/50 border-b border-border text-xs font-bold text-muted-foreground uppercase">
                <tr>
                  <th className="p-4">Item Name</th>
                  <th className="p-4 text-center">Price</th>
                  <th className="p-4 text-center">Qty</th>
                  <th className="p-4 text-right">Total</th>
                  {!isEdit && <th className="p-4 text-center">X</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {orderItems.length === 0 ? (
                   <tr><td colSpan={5} className="p-6 text-center text-muted-foreground text-sm italic">No items added yet.</td></tr>
                ) : orderItems.map((item: any, idx: number) => (
                  <tr key={idx} className="hover:bg-muted/5">
                    <td className="p-4">
                      <p className="font-bold text-sm text-foreground">{item.productName}</p>
                    </td>
                    <td className="p-4 text-center text-sm font-semibold text-muted-foreground">৳{Number(item.price).toLocaleString()}</td>
                    <td className="p-4 text-center font-black">{item.quantity}</td>
                    <td className="p-4 text-right font-black text-primary">৳{Number(item.price * item.quantity).toLocaleString()}</td>
                    {!isEdit && (
                      <td className="p-4 text-center">
                        <button onClick={() => removeItem(idx)} className="text-muted-foreground hover:text-destructive"><Trash2 size={16}/></button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FINANCIALS */}
        <div className="bg-card border border-border rounded-3xl p-6 shadow-theme-sm flex flex-col md:flex-row justify-between gap-6">
          
          {/* Dynamic Adjustments (Only editable during creation) */}
          <div className="flex-1 space-y-4">
            {!isEdit && (
              <>
                <div className="flex items-center gap-3">
                  <label className="text-xs font-bold text-muted-foreground uppercase w-24">Delivery Fee</label>
                  <input type="number" name="deliveryFee" value={formData.deliveryFee} onChange={handleInputChange} className="bg-background border border-border rounded-lg px-3 py-1.5 text-sm outline-none focus:border-primary w-32" />
                </div>
                <div className="flex items-center gap-3">
                  <label className="text-xs font-bold text-muted-foreground uppercase w-24">Discount</label>
                  <input type="number" name="discountAmount" value={formData.discountAmount} onChange={handleInputChange} className="bg-background border border-border rounded-lg px-3 py-1.5 text-sm outline-none focus:border-primary w-32" />
                </div>
              </>
            )}
          </div>

          <div className="w-full max-w-sm space-y-3 text-sm">
            <div className="flex justify-between font-semibold text-muted-foreground"><span>Subtotal</span><span>৳{subtotal.toLocaleString()}</span></div>
            <div className="flex justify-between font-semibold text-muted-foreground"><span>Delivery Fee</span><span>+ ৳{Number(formData.deliveryFee).toLocaleString()}</span></div>
            <div className="flex justify-between font-bold text-emerald-500"><span>Discount</span><span>- ৳{Number(formData.discountAmount).toLocaleString()}</span></div>
            <div className="pt-3 border-t border-border flex justify-between items-center text-lg font-black text-foreground">
              <span>Final Total</span><span>৳{finalTotal.toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between items-center text-xs font-bold pt-2">
              <span className="text-muted-foreground uppercase tracking-widest">Paid Amount</span>
              {isEdit ? (
                <span className="text-emerald-500">৳{Number(formData.paidAmount).toLocaleString()}</span>
              ) : (
                <input type="number" name="paidAmount" value={formData.paidAmount} onChange={handleInputChange} className="bg-background border border-border rounded-lg px-2 py-1 text-xs outline-none focus:border-primary w-24 text-right" />
              )}
            </div>
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-muted-foreground uppercase tracking-widest">Due Amount</span>
              <span className="text-red-500">৳{dueAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- RIGHT COLUMN: Form & Customer details --- */}
      <div className="w-full lg:w-96 space-y-6">
        
        {/* The Action Controller */}
        <div className="bg-primary/5 border border-primary/20 rounded-3xl p-6 shadow-theme-sm">
          <h2 className="text-lg font-black text-primary mb-5 flex items-center gap-2"><Save size={18}/> {isEdit ? "Update Order" : "Publish Order"}</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">Order Status</label>
              <select name="status" value={formData.status} onChange={handleInputChange} className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm font-bold text-foreground outline-none focus:border-primary">
                <option value="PENDING">PENDING</option>
                <option value="PROCESSING">PROCESSING</option>
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="SHIPPED">SHIPPED</option>
                <option value="DELIVERED">DELIVERED</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">Payment Method</label>
              <select name="paymentMethod" value={formData.paymentMethod} onChange={handleInputChange} disabled={isEdit} className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm font-bold text-foreground outline-none focus:border-primary disabled:opacity-50">
                <option value="CASH_ON_DELIVERY">Cash on Delivery</option>
                <option value="BANK_TRANSFER">Bank Transfer</option>
                <option value="bkash">bKash</option>
                <option value="nagad">Nagad</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">Payment Status</label>
              <select name="paymentStatus" value={formData.paymentStatus} onChange={handleInputChange} className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm font-bold text-foreground outline-none focus:border-primary">
                <option value="UNPAID">UNPAID</option>
                <option value="PARTIAL">PARTIAL</option>
                <option value="PAID">PAID</option>
                <option value="REFUNDED">REFUNDED</option>
              </select>
            </div>
            {isEdit && (
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">Update Paid Amount</label>
                <input type="number" name="paidAmount" value={formData.paidAmount} onChange={handleInputChange} className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:border-primary" />
              </div>
            )}
            <button 
              onClick={handleSubmit} disabled={updating} 
              className="w-full py-3 mt-2 bg-primary text-white rounded-xl font-black shadow-theme-md hover:scale-[1.02] transition-all disabled:opacity-50"
            >
              {updating ? "Processing..." : isEdit ? "Save Changes" : "Create Order"}
            </button>
          </div>
        </div>

        {/* Customer Details */}
        <div className="bg-card border border-border rounded-3xl p-6 shadow-theme-sm">
          <h2 className="text-sm font-black text-foreground uppercase tracking-widest mb-4 flex items-center gap-2"><User size={16}/> Customer Data</h2>
          <div className="space-y-3">
            <input type="text" name="customerName" value={formData.customerName} onChange={handleInputChange} disabled={isEdit} placeholder="Customer Name *" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary disabled:opacity-50 disabled:bg-muted" />
            <input type="text" name="customerPhone" value={formData.customerPhone} onChange={handleInputChange} disabled={isEdit} placeholder="Phone Number *" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary disabled:opacity-50 disabled:bg-muted" />
            <input type="email" name="customerEmail" value={formData.customerEmail} onChange={handleInputChange} disabled={isEdit} placeholder="Email (Optional)" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary disabled:opacity-50 disabled:bg-muted" />
          </div>
        </div>

        {/* Delivery Details */}
        <div className="bg-card border border-border rounded-3xl p-6 shadow-theme-sm">
          <h2 className="text-sm font-black text-foreground uppercase tracking-widest mb-4 flex items-center gap-2"><MapPin size={16}/> Delivery Address</h2>
          <textarea 
            name="fullAddress" value={formData.fullAddress} onChange={handleInputChange} disabled={isEdit} 
            placeholder="Enter full shipping address..." rows={3}
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary resize-none disabled:opacity-50 disabled:bg-muted" 
          />
        </div>

      </div>
    </div>
  );
}