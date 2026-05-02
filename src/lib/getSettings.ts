export async function getGlobalSettings() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings`, {
      next: { revalidate: 60 }
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch (error) {
    console.error("Failed to fetch global settings:", error);
    return null;
  }
}

export async function getActiveTheme() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/themes/active`, {
      next: { revalidate: 60 }
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch (error) {
    console.error("Failed to fetch active theme:", error);
    return null;
  }
}