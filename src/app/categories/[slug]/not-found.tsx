import Link from "next/link";
import { LuCloudOff } from "react-icons/lu";

export default function CategoryNotFound() {
  return (
    <main className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
        <LuCloudOff className="w-10 h-10 text-muted-foreground opacity-50" />
      </div>
      <h1 className="text-3xl font-black text-heading mb-2">Category Not Found</h1>
      <p className="text-subheading mb-8 max-w-md">
        The category you're looking for doesn't exist or has been moved.
      </p>
      <Link
        href="/categories"
        className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-bold hover:scale-105 transition-all"
      >
        Browse All Categories
      </Link>
    </main>
  );
}
