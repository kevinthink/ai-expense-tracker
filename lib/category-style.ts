// A soft earth-tone palette. Full class names, so Tailwind can find them when
// scanning source files.
const CATEGORY_STYLES: Record<string, { badge: string; bar: string }> = {
  餐飲: { badge: "bg-[#fbe9dd] text-[#8a5430]", bar: "bg-[#e5a67f]" },
  交通: { badge: "bg-[#e6f0f0] text-[#46696a]", bar: "bg-[#8fb0b1]" },
  購物: { badge: "bg-[#f9e8e9] text-[#8f5660]", bar: "bg-[#d39aa2]" },
  娛樂: { badge: "bg-[#f1e9f2] text-[#715a75]", bar: "bg-[#b49bb8]" },
  居住: { badge: "bg-[#eef0e0] text-[#5d6840]", bar: "bg-[#a9b57e]" },
  醫療: { badge: "bg-[#f8e5e1] text-[#8f5045]", bar: "bg-[#cc7f73]" },
  教育: { badge: "bg-[#faf1d8] text-[#736032]", bar: "bg-[#e3c474]" },
  其他: { badge: "bg-[#f1ece5] text-[#6b5f53]", bar: "bg-[#bcae9f]" },
};

export function categoryStyle(category: string) {
  return CATEGORY_STYLES[category] ?? CATEGORY_STYLES["其他"];
}
