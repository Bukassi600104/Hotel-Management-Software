import type { MenuItem } from "@/types";

const u = (id: string) => `/hotel-assets/${id}`;

export const menu: MenuItem[] = [
  // Breakfast
  {
    id: "b1",
    category: "breakfast",
    name: "Akara & Pap",
    description: "Crisp black-eyed-bean fritters, warm corn pap, smoked palm oil.",
    price: 4500,
    image: u("restaurant-dsc6939.jpg"),
  },
  {
    id: "b2",
    category: "breakfast",
    name: "Yam & Egg Sauce",
    description: "Golden boiled yam, slow-cooked tomato and pepper egg sauce.",
    price: 5200,
    image: u("restaurant-dsc6923.jpg"),
  },
  {
    id: "b3",
    category: "breakfast",
    name: "Continental Plate",
    description: "Pastries, cured meats, soft scrambled eggs, fruit, espresso.",
    price: 6800,
    image: u("restaurant-dsc6926.jpg"),
  },
  {
    id: "b4",
    category: "breakfast",
    name: "Pancake Stack",
    description: "Buttermilk pancakes, charred banana, salted caramel.",
    price: 4800,
    image: u("restaurant-dsc6931.jpg"),
  },

  // Mains
  {
    id: "m1",
    category: "mains",
    name: "Jollof Rice & Suya Beef",
    description: "Smoky party-style jollof, hand-cut suya beef, plantain.",
    price: 9500,
    image: u("restaurant-dsc6935.jpg"),
  },
  {
    id: "m2",
    category: "mains",
    name: "Grilled Sea Bream",
    description: "Whole-roasted bream, herb oil, charred lemon, fonio.",
    price: 14500,
    image: u("restaurant-dsc6921.jpg"),
  },
  {
    id: "m3",
    category: "mains",
    name: "Egusi Soup & Pounded Yam",
    description: "Slow-cooked egusi with smoked fish, hand-pounded yam.",
    price: 8800,
    image: u("restaurant-dsc6948.jpg"),
  },
  {
    id: "m4",
    category: "mains",
    name: "Dry-Aged Ribeye",
    description: "28-day dry-aged ribeye, bone marrow butter, charred greens.",
    price: 22500,
    image: u("restaurant-dsc6939.jpg"),
  },

  // Drinks
  {
    id: "d1",
    category: "drinks",
    name: "Euphoria Old Fashioned",
    description: "Bourbon, palm sugar, smoked bitters, candied orange.",
    price: 6500,
    image: u("facility-rooftop.png"),
  },
  {
    id: "d2",
    category: "drinks",
    name: "Hibiscus Spritz",
    description: "Zobo reduction, prosecco, sparkling lime.",
    price: 5800,
    image: u("rooftop-dsc2573.jpg"),
  },
  {
    id: "d3",
    category: "drinks",
    name: "Espresso Martini",
    description: "Pulled espresso, vodka, vanilla, cocoa nib.",
    price: 6200,
    image: u("restaurant-dsc6931.jpg"),
  },
  {
    id: "d4",
    category: "drinks",
    name: "Lagos Sunset",
    description: "House gin, passionfruit, ginger, scotch bonnet rim.",
    price: 5800,
    image: u("restaurant-dsc6926.jpg"),
  },

  // Desserts
  {
    id: "ds1",
    category: "desserts",
    name: "Coconut Panna Cotta",
    description: "Set coconut cream, mango compote, toasted sesame.",
    price: 4200,
    image: u("restaurant-dsc6923.jpg"),
  },
  {
    id: "ds2",
    category: "desserts",
    name: "Dark Chocolate Tart",
    description: "70% chocolate, sea salt caramel, brûlée banana.",
    price: 4800,
    image: u("restaurant-dsc6948.jpg"),
  },
  {
    id: "ds3",
    category: "desserts",
    name: "Chin-chin Ice Cream",
    description: "Vanilla bean ice cream, crushed chin-chin, palm caramel.",
    price: 3800,
    image: u("restaurant-dsc6935.jpg"),
  },
];

export const menuCategories = [
  { id: "breakfast", label: "Breakfast" },
  { id: "mains", label: "Mains" },
  { id: "drinks", label: "Drinks" },
  { id: "desserts", label: "Desserts" },
] as const;
