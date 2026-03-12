import CustomerSidebar from "@/components/dashboard/sidebars/CustomerSidebar"; // Adjust path if needed

export default function UserLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-background w-full">

            <CustomerSidebar />

            <div className="flex-1 flex flex-col min-w-0">
                {/* On mobile, add padding-top to account for the mobile menu bar */}
                <main className="flex-1 p-4 pt-16 md:pt-6 md:p-6 lg:p-8">
                    {children}
                </main>
            </div>

        </div>
    );
}