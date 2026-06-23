export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: "Espresso" | "Filter" | "Blends";
  image: string;
}

export const products: Product[] = [
  {
    id: "espresso-classico",
    name: "Espresso Classico",
    price: 14.9,
    description:
      "A bold, full-bodied espresso with deep chocolate notes and a velvety crema. Sourced from the finest Arabica beans of Southern Italy.",
    category: "Espresso",
    image: "https://picsum.photos/seed/espressoclassico/400/300",
  },
  {
    id: "morning-blend",
    name: "Morning Blend",
    price: 12.5,
    description:
      "A smooth, balanced blend perfect for starting your day. Hints of caramel and toasted hazelnut with a gentle brightness.",
    category: "Blends",
    image: "https://picsum.photos/seed/morningblend/400/300",
  },
  {
    id: "ethiopia-yirgacheffe",
    name: "Ethiopia Yirgacheffe",
    price: 18.9,
    description:
      "Single-origin specialty coffee with vibrant floral aromas, bright acidity, and exotic fruity notes of blueberry and jasmine.",
    category: "Filter",
    image: "https://picsum.photos/seed/ethiopiayirgacheffe/400/300",
  },
  {
    id: "dark-roast-perfetto",
    name: "Dark Roast Perfetto",
    price: 15.9,
    description:
      "Intensely roasted for coffee lovers who prefer bold, smoky flavors. Rich dark chocolate and a lingering smoky finish.",
    category: "Espresso",
    image: "https://picsum.photos/seed/darkroastperfetto/400/300",
  },
  {
    id: "colombian-supremo",
    name: "Colombian Supremo",
    price: 13.9,
    description:
      "Classic Colombian excellence. A well-rounded cup with mild sweetness, walnut undertones, and a clean, satisfying finish.",
    category: "Blends",
    image: "https://picsum.photos/seed/colombiansupremo/400/300",
  },
  {
    id: "japanese-pour-over",
    name: "Japanese Pour Over",
    price: 21.5,
    description:
      "Meticulously crafted for pour-over brewing. Delicate and nuanced with subtle notes of green tea, honey, and citrus zest.",
    category: "Filter",
    image: "https://picsum.photos/seed/japanesepourover/400/300",
  },
];
