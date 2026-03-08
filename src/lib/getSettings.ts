export async function getGlobalSettings() {
  try {
    // Note: Use native fetch here instead of Axios so Next.js can cache it!
    // Make sure NEXT_PUBLIC_API_URL is set in your .env (e.g., http://localhost:5000/api/v1)
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings`, {
      next: { revalidate: 300 } // Revalidate cache every 5 minutes
    });
    
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch (error) {
    console.error("Failed to fetch global settings:", error);
    return null;
  }
}