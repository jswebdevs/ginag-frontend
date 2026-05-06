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
    title: heroConfig.title || settings?.storeName || "GinaG",
    subtitle: heroConfig.subtitle || "PURSE CHARMS and CHAINS",
    personName: heroConfig.personName || settings?.companySlogan || "",
    phone: heroConfig.phone || settings?.contactPhone || settings?.supportPhone || "",
    email: heroConfig.email || settings?.contactEmail || settings?.supportEmail || "",
    badgeText: heroConfig.badgeText || "CUSTOM CHARMS MADE JUST FOR YOU!",
    imageUrl:
      heroConfig.imageUrl ||
      settings?.logo?.originalUrl ||
      settings?.logo?.thumbUrl ||
      null,
    bottomImageUrl: heroConfig.bottomImageUrl || null,
    instructions:
      heroConfig.instructions ||
      (settings?.contactPhone || settings?.contactEmail
        ? `Text or call ${settings?.contactPhone || ""}${
            settings?.contactPhone && settings?.contactEmail ? "\nor email " : ""
          }${settings?.contactEmail || ""}`.trim()
        : ""),
  };

  return (
    <main className="min-h-screen md:h-screen bg-black md:overflow-hidden p-3 md:p-5">
      <div
        className="md:h-full max-w-[1100px] mx-auto rounded-2xl border-2 md:overflow-hidden"
        style={{ borderColor: "#d4af37" }}
      >
        <div className="md:h-full grid grid-cols-1 md:grid-cols-2">
          <OrderHero hero={hero} />
          <div className="bg-black md:h-full md:overflow-y-auto md:scrollbar-hide flex md:items-center">
            <div className="w-full">
              <OrderForm />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
