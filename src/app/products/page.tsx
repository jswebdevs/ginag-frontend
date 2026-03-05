import { redirect } from "next/navigation";

export default function ProductsIndexPage() {
  // If a user navigates to /products without a slug, 
  // instantly bounce them to your fully-featured shop page!
  redirect("/shop");
}