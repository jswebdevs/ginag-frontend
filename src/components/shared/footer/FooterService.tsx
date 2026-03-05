import { Truck, Clock, RefreshCcw, Headset } from "lucide-react";

export default function FooterService() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4">
        {/* Value Props Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-b border-border">
          <div className="p-8 flex items-center gap-4 border-b sm:border-r border-border">
            <Truck className="w-8 h-8 text-primary" />
            <div>
              <h4 className="font-bold text-sm">Free Shipping</h4>
              <p className="text-xs text-muted-foreground">Orders over $50</p>
            </div>
          </div>
          <div className="p-8 flex items-center gap-4 border-b lg:border-r border-border">
            <Clock className="w-8 h-8 text-primary" />
            <div>
              <h4 className="font-bold text-sm">Fast Delivery</h4>
              <p className="text-xs text-muted-foreground">24/7 Processing</p>
            </div>
          </div>
          <div className="p-8 flex items-center gap-4 border-b sm:border-r border-border">
            <RefreshCcw className="w-8 h-8 text-primary" />
            <div>
              <h4 className="font-bold text-sm">Easy Returns</h4>
              <p className="text-xs text-muted-foreground">30-day guarantee</p>
            </div>
          </div>
          <div className="p-8 flex items-center gap-4 border-b border-border lg:border-none">
            <Headset className="w-8 h-8 text-primary" />
            <div>
              <h4 className="font-bold text-sm">Expert Support</h4>
              <p className="text-xs text-muted-foreground">Live chat available</p>
            </div>
          </div>
        </div>

        {/* Traditional Footer Content Here... */}
        <div className="py-12 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Dream Shop. Designed with ❤️ in Rajshahi.
        </div>
      </div>
    </footer>
  );
}