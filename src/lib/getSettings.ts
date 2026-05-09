const REVALIDATE_SETTINGS = 300;  // 5 min — store settings rarely change
const REVALIDATE_PAGE = 120;      // 2 min — admin edits show sooner
const REVALIDATE_THEME    = 300;
const REVALIDATE_HOMEPAGE = 120;  // 2 min — admin edits need to show sooner

export async function getGlobalSettings() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings`, {
      next: { revalidate: REVALIDATE_SETTINGS, tags: ["settings"] },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch {
    return null;
  }
}

export async function getHomepageConfig() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings/homepage`, {
      next: { revalidate: REVALIDATE_HOMEPAGE, tags: ["homepage"] },
    });
    if (!res.ok) return {};
    const json = await res.json();
    return json.data || {};
  } catch {
    return {};
  }
}

export async function getActiveTheme() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/themes/active`, {
      next: { revalidate: REVALIDATE_THEME, tags: ["theme"] },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch {
    return null;
  }
}

export async function getPageBySlug(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pages/${slug}`, {
      next: { revalidate: REVALIDATE_PAGE, tags: [`page-${slug}`] },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch {
    return null;
  }
}

export async function getFeaturedProducts() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products?limit=3&page=1`, {
      next: { revalidate: 60, tags: ["products"] },
    });
    if (!res.ok) return [];
    const json = await res.json();
    const items = Array.isArray(json.data)
      ? json.data
      : Array.isArray(json.data?.products)
      ? json.data.products
      : [];
    return items.slice(0, 3);
  } catch {
    return [];
  }
}
