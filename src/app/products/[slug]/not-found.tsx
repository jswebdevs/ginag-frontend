import Link from "next/link";

export default function ProductNotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background gap-6 px-4">
      <h1 className="text-3xl font-black text-heading uppercase">Product Not Found</h1>
      <p className="text-sm text-muted-foreground text-center max-w-md">
        The product you're looking for doesn't exist or has been removed.
      </p>
      <Link
        href="/products"
        className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform"
      >
        Back to Catalog
      </Link>
    </main>
  );
}
