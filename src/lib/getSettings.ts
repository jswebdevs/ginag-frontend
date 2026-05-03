const REVALIDATE_SETTINGS = 300;  // 5 min — store settings rarely change
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
