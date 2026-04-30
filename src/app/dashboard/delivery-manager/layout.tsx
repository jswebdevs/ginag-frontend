"use client";

import DeliverySidebar from "@/components/dashboard/sidebars/DeliverySidebar";

export default function DeliveryManagerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-background w-full">

            <DeliverySidebar />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">

                {/* RESPONSIVE PADDING */}
                <main className="flex-1 p-4 pt-28 md:pt-6 md:p-6 lg:p-8">
                    {children}
                </main>

            </div>
        </div>
    );
}
