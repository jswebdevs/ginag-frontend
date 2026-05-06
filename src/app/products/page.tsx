import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Catalog",
  description: "Browse our full collection of handcrafted purse charms.",
  alternates: { canonical: "/shop" },
};

export default function ProductsIndexPage() {
  redirect("/shop");
}
