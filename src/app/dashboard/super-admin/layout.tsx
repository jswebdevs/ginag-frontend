import SuperAdminSidebar from "@/components/dashboard/superadmin/SuperAdminSidebar"; // Adjust path if needed

export default function SuperadminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // 1. bg-background handles theme responsiveness. 
    // 2. min-h-screen allows the content to push the footer down naturally.
    <div className="flex min-h-screen bg-background w-full">
      
      <SuperAdminSidebar />
      
      {/* 3. Removed overflow-hidden so the window scrolls normally */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* On mobile, add padding-top to account for the mobile admin menu bar */}
        <main className="flex-1 p-4 pt-16 md:pt-6 md:p-6 lg:p-8">
          {children}
        </main>
        
      </div>
    </div>
  );
}