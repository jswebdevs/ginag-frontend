/**
 * A utility to merge class names.
 * This is a lightweight version that doesn't require external dependencies.
 */
export function cn(...inputs: any[]) {
  return inputs
    .flat()
    .filter(Boolean)
    .join(" ");
}
