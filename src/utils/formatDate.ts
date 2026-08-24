export function formatDate(date?: string | null) {
    if (!date) return "-";
  
    return new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }
  
  export function formatPrice(value?: number | null) {
    if (value === null || value === undefined) return "-";
  
    return `₦${Number(value).toLocaleString("en-NG")}`;
  }
  
  export function getInitials(name?: string) {
    if (!name) return "?";
  
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }