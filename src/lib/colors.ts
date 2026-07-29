export const PRESET_COLORS = [
  "أبيض",
  "أسود",
  "ذهبي",
  "فضي",
  "رمادي",
  "أحمر",
  "أزرق",
  "أخضر",
  "أصفر",
  "بني",
  "بيج",
  "برونزي",
];

export const getColorHex = (colorName: string): string => {
  if (!colorName) return "#9CA3AF";
  const name = colorName.trim().toLowerCase();
  const colorMap: Record<string, string> = {
    أبيض: "#FFFFFF",
    white: "#FFFFFF",
    أسود: "#1F2937",
    black: "#1F2937",
    ذهبي: "#D4AF37",
    gold: "#D4AF37",
    فضي: "#C0C0C0",
    silver: "#C0C0C0",
    رمادي: "#6B7280",
    رصاصي: "#4B5563",
    grey: "#6B7280",
    gray: "#6B7280",
    أحمر: "#EF4444",
    red: "#EF4444",
    أزرق: "#3B82F6",
    blue: "#3B82F6",
    أخضر: "#10B981",
    green: "#10B981",
    أصفر: "#F59E0B",
    yellow: "#F59E0B",
    بني: "#78350F",
    brown: "#78350F",
    بيج: "#F5F5DC",
    beige: "#F5F5DC",
    برونزي: "#CD7F32",
    bronze: "#CD7F32",
    وردي: "#EC4899",
    pink: "#EC4899",
    برتقالي: "#F97316",
    orange: "#F97316",
    بنفسجي: "#8B5CF6",
    purple: "#8B5CF6",
  };
  return colorMap[name] || "#9CA3AF";
};
