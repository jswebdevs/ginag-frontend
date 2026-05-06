import type { Metadata } from "next";
import ShopClient from "./_ShopClient";

export const metadata: Metadata = {
  title: "Shop the Catalog",
  description:
    "Browse our handcrafted charm catalog — purse charms, chains, and custom pieces.",
  alternates: { canonical: "/shop" },
};

export default function ShopPage() {
  return <ShopClient />;
}
