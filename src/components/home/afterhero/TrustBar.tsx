import { Truck, ShieldCheck, CreditCard, Headphones } from "lucide-react";

export default function TrustBar() {
  const features = [
    { icon: Truck, title: "Free Shipping", desc: "On orders over $50" },
    { icon: ShieldCheck, title: "100% Secure", desc: "Encrypted checkout" },
    { icon: CreditCard, title: "Flexible Payment", desc: "Pay with multiple methods" },
    { icon: Headphones, title: "24/7 Support", desc: "Ready to help you" },
  ];

  return (
    <div className="bg-card border-y border-border py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-border">
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className={`flex items-center gap-4 ${index !== 0 ? 'sm:pl-6 pt-6 sm:pt-0' : ''}`}>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-heading text-sm">{item.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}