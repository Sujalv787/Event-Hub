export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatPrice(price: number): string {
  return price === 0 ? "Free" : `₹${price}`;
}

export function isPastDate(date: string | Date): boolean {
  return new Date(date).getTime() < Date.now();
}
