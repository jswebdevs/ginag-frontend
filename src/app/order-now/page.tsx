import type { Metadata } from "next";
import OrderForm from "./_OrderForm";
import OrderHero from "./_OrderHero";
import { getHomepageConfig, getGlobalSettings } from "@/lib/getSettings";

export const revalidate = 120;

export const metadata: Metadata = {
  title: "Order Now",
  description:
    "Place a custom charm order — choose your color, style, initial, and delivery method. Pickup or flat-rate mailing.",
  alternates: { canonical: "/order-now" },
};

export default async function OrderNowPage() {
  const [hp, settings] = await Promise.all([getHomepageConfig(), getGlobalSettings()]);
  const heroConfig = (hp as any)?.orderHero || {};

  const hero = {
    imageUrl:
      heroConfig.imageUrl ||
      settings?.logo?.originalUrl ||
      settings?.logo?.thumbUrl ||
      null,
    bottomImageUrl: heroConfig.bottomImageUrl || null,
  };

  return (
    <main className="min-h-screen bg-black p-3 md:p-4">
      <div
        className="max-w-[825px] mx-auto rounded-2xl border-2 overflow-hidden bg-black"
        style={{ borderColor: "#d4af37" }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 bg-black">
          <OrderHero hero={hero} />
          <div className="bg-black flex items-stretch">
            <div className="w-full">
              <OrderForm />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
