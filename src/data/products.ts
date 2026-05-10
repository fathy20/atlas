import dlsbLedImg from "@/assets/products/dlsb-led.webp";
import dlRoundImg from "@/assets/products/dl-round.webp";
import dlSquareImg from "@/assets/products/dl-square.webp";
import mangoMidiImg from "@/assets/products/mango-midi.webp";
import eliaDlImg from "@/assets/products/elia-dl.webp";
import ebPlusImg from "@/assets/products/eb-plus.webp";
import hero3Img from "@/assets/hero/hero-3.png";
import ledHeroImg from "../../led.jpeg";

export interface Product {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  price: number;
  category: string;
  brand: string;
  image: string;
  images: string[];
  features: string[];
  available: boolean;
}

export interface Category {
  id: string;
  name: string;
  nameAr: string;
  icon: string;
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
}

export const categories: Category[] = [
  { id: "electrical", name: "Electrical", nameAr: "كهربائيات", icon: "⚡" },
  { id: "home", name: "Home Appliances", nameAr: "أجهزة منزلية", icon: "🏠" },
];

export const brands: Brand[] = [
  { id: "performance", name: "Performance in Lighting", logo: "/placeholder.svg" },
  { id: "fanton", name: "Fanton", logo: "/placeholder.svg" },
  { id: "besser", name: "Besser", logo: "/placeholder.svg" },
  { id: "tecno", name: "Tecno Home", logo: "/placeholder.svg" },
  { id: "atlas", name: "Atlas", logo: "/placeholder.svg" },
];

export const products: Product[] = [
  // Electrical - LED Lighting
  {
    id: "dlsb-led",
    name: "DLSB LED",
    nameAr: "إضاءة DLSB LED",
    description: "High-performance LED downlight with superior brightness and energy efficiency.",
    descriptionAr: "إضاءة LED عالية الأداء مع سطوع فائق وكفاءة في استهلاك الطاقة.",
    price: 45,
    category: "electrical",
    brand: "performance",
    image: dlsbLedImg,
    images: [dlsbLedImg],
    features: ["Energy Efficient", "Long Lifespan", "Easy Installation", "Dimmable"],
    available: true,
  },
  {
    id: "dl-round",
    name: "DL ROUND",
    nameAr: "إضاءة DL دائرية",
    description: "Round LED panel light for modern ceiling installations.",
    descriptionAr: "لوحة إضاءة LED دائرية للتركيبات السقفية الحديثة.",
    price: 35,
    category: "electrical",
    brand: "performance",
    image: dlRoundImg,
    images: [dlRoundImg],
    features: ["Slim Design", "Uniform Light", "Flicker-Free", "High CRI"],
    available: true,
  },
  {
    id: "dl-square",
    name: "DL SQUARE",
    nameAr: "إضاءة DL مربعة",
    description: "Square LED panel light with clean modern aesthetics.",
    descriptionAr: "لوحة إضاءة LED مربعة بتصميم عصري أنيق.",
    price: 38,
    category: "electrical",
    brand: "performance",
    image: dlSquareImg,
    images: [dlSquareImg],
    features: ["Modern Design", "High Efficiency", "Easy Mount", "3000K-6500K"],
    available: true,
  },
  {
    id: "mango-midi",
    name: "MANGO+ MIDI",
    nameAr: "مانجو+ ميدي",
    description: "Compact LED spotlight with adjustable beam angle.",
    descriptionAr: "كشاف LED مضغوط بزاوية شعاع قابلة للتعديل.",
    price: 55,
    category: "electrical",
    brand: "performance",
    image: mangoMidiImg,
    images: [mangoMidiImg],
    features: ["Adjustable Angle", "High Lumen", "Compact Size", "IP44"],
    available: true,
  },
  {
    id: "elia-dl",
    name: "ELIA DL",
    nameAr: "إيليا DL",
    description: "Premium decorative LED downlight for luxury spaces.",
    descriptionAr: "إضاءة LED ديكورية فاخرة للمساحات الراقية.",
    price: 65,
    category: "electrical",
    brand: "performance",
    image: eliaDlImg,
    images: [eliaDlImg],
    features: ["Premium Finish", "Warm White", "Anti-Glare", "5 Year Warranty"],
    available: true,
  },
  {
    id: "eb-plus",
    name: "EB+",
    nameAr: "EB+",
    description: "Emergency backup LED light with built-in battery.",
    descriptionAr: "إضاءة LED طوارئ مع بطارية مدمجة.",
    price: 75,
    category: "electrical",
    brand: "performance",
    image: ebPlusImg,
    images: [ebPlusImg],
    features: ["Battery Backup", "Auto Switch", "3 Hour Runtime", "CE Certified"],
    available: false,
  },
  // Home Appliances
  {
    id: "deep-casserole",
    name: "Deep Casserole",
    nameAr: "كسرولة عميقة",
    description: "Premium deep casserole with non-stick granite coating.",
    descriptionAr: "كسرولة عميقة فاخرة بطبقة جرانيت غير لاصقة.",
    price: 120,
    category: "home",
    brand: "besser",
    image: "/placeholder.svg",
    images: ["/placeholder.svg"],
    features: ["Granite Coating", "Heat Resistant Handle", "Dishwasher Safe", "Even Heat Distribution"],
    available: true,
  },
  {
    id: "cookware-set",
    name: "Cookware Set",
    nameAr: "طقم أواني طهي",
    description: "Complete cookware set with 10 essential pieces.",
    descriptionAr: "طقم أواني طهي كامل مكون من 10 قطع أساسية.",
    price: 350,
    category: "home",
    brand: "besser",
    image: "/placeholder.svg",
    images: ["/placeholder.svg"],
    features: ["10 Pieces", "Non-Stick", "Induction Compatible", "Glass Lids"],
    available: true,
  },
  {
    id: "kitchen-essentials",
    name: "Kitchen Essentials",
    nameAr: "أساسيات المطبخ",
    description: "Essential kitchen tools and accessories set.",
    descriptionAr: "طقم أدوات ومستلزمات المطبخ الأساسية.",
    price: 85,
    category: "home",
    brand: "tecno",
    image: "/placeholder.svg",
    images: ["/placeholder.svg"],
    features: ["Stainless Steel", "Ergonomic Design", "Easy Clean", "Complete Set"],
    available: true,
  },
  {
    id: "smart-blender",
    name: "Smart Blender",
    nameAr: "خلاط ذكي",
    description: "High-speed smart blender with multiple speed settings.",
    descriptionAr: "خلاط ذكي عالي السرعة بإعدادات سرعة متعددة.",
    price: 180,
    category: "home",
    brand: "tecno",
    image: "/placeholder.svg",
    images: ["/placeholder.svg"],
    features: ["1000W Motor", "6 Blades", "BPA Free", "Self-Cleaning"],
    available: true,
  },
  {
    id: "coffee-maker",
    name: "Coffee Maker",
    nameAr: "ماكينة قهوة",
    description: "Automatic coffee maker with built-in grinder.",
    descriptionAr: "ماكينة قهوة أوتوماتيكية بمطحنة مدمجة.",
    price: 250,
    category: "home",
    brand: "tecno",
    image: "/placeholder.svg",
    images: ["/placeholder.svg"],
    features: ["Built-in Grinder", "Programmable", "Keep Warm", "12 Cups"],
    available: true,
  },
  {
    id: "granite-pan",
    name: "Granite Pan",
    nameAr: "مقلاة جرانيت",
    description: "Premium granite-coated frying pan with ergonomic handle.",
    descriptionAr: "مقلاة بطبقة جرانيت فاخرة بمقبض مريح.",
    price: 65,
    category: "home",
    brand: "besser",
    image: "/placeholder.svg",
    images: ["/placeholder.svg"],
    features: ["Granite Coating", "PFOA Free", "Cool Touch Handle", "28cm"],
    available: true,
  },
  {
    id: "food-processor",
    name: "Food Processor",
    nameAr: "محضر طعام",
    description: "Multi-function food processor with various attachments.",
    descriptionAr: "محضر طعام متعدد الوظائف بملحقات متنوعة.",
    price: 220,
    category: "home",
    brand: "tecno",
    image: "/placeholder.svg",
    images: ["/placeholder.svg"],
    features: ["800W", "Multiple Attachments", "Large Bowl", "Safety Lock"],
    available: true,
  },
  {
    id: "electric-kettle",
    name: "Electric Kettle",
    nameAr: "غلاية كهربائية",
    description: "Fast-boiling electric kettle with auto shut-off.",
    descriptionAr: "غلاية كهربائية سريعة الغليان مع إيقاف تلقائي.",
    price: 45,
    category: "home",
    brand: "tecno",
    image: "/placeholder.svg",
    images: ["/placeholder.svg"],
    features: ["1.7L Capacity", "Auto Shut-off", "Boil Dry Protection", "360° Base"],
    available: true,
  },
  {
    id: "decorative-vase",
    name: "Decorative Vase",
    nameAr: "مزهرية ديكورية",
    description: "Elegant decorative vase for modern home interiors.",
    descriptionAr: "مزهرية ديكورية أنيقة للديكور المنزلي العصري.",
    price: 40,
    category: "home",
    brand: "atlas",
    image: "/placeholder.svg",
    images: ["/placeholder.svg"],
    features: ["Ceramic", "Hand-Painted", "Modern Design", "Multiple Sizes"],
    available: false,
  },
];

export const companyInfo = {
  name: "أطلس",
  nameEn: "Atlas",
  fullName: "أطلس لإستيراد المواد الكهربائية والمنزلية",
  fullNameEn: "Atlas for Importing Electrical & Home Appliances",
  phone: "0913407799",
  whatsapp: "218913407799",
  email: "info@atlas-home.com",
  address: "طرابلس، الكريمية",
  addressEn: "Tripoli, Al-Karimia",
  social: {
    facebook: "https://facebook.com/atlas",
    instagram: "https://instagram.com/atlas",
    tiktok: "https://www.tiktok.com/@atlasly5?_r=1&_t=ZS-954cOLNaCLI",
  },
  stats: [
    { value: "+35", label: "عاماً من الخبرة" },
    { value: "9", label: "فروع في خدمتك" },
    { value: "موزع معتمد", label: "لماركات دولية" },
    { value: "+1000", label: "منتج عالمي" },
  ],
  features: [
    { icon: "shield", title: "جودة مضمونة", description: "نوفر منتجات عالية الجودة من أفضل الماركات العالمية" },
    { icon: "truck", title: "شبكة توزيع واسعة", description: "نغطي مختلف المناطق بكفاءة لتوصيل المنتجات أينما كنت" },
    { icon: "headphones", title: "خدمة عملاء", description: "فريق دعم متواجد على مدار الساعة لخدمتك" },
    { icon: "grid", title: "تشكيلة واسعة", description: "أكبر تشكيلة من المنتجات الكهربائية والمنزلية" },
  ],
  stories: [
    { title: "بدايتنا", description: "بدأنا رحلتنا في استيراد وتوزيع المواد الكهربائية والمنزلية في طرابلس، ليبيا. من محل صغير إلى واحدة من أكبر شركات التوزيع في المنطقة." },
    { title: "رؤيتنا", description: "نسعى لنكون الخيار الأول في توفير المنتجات الكهربائية والمنزلية عالية الجودة بأسعار تنافسية، مع تقديم أفضل خدمة عملاء." },
    { title: "التزامنا", description: "نلتزم بتوفير منتجات أصلية 100% من أفضل الماركات العالمية، مع ضمان كامل وخدمة ما بعد البيع." },
  ],
};

export const heroSlides = [
  {
    id: 2,
    title: "عالم المواد الكهربائيه",
    subtitle: "كل ما تحتاجه من مواد و جوده فى مكان واحد",
    cta: "اكتشف الإضاءة",
    image: ledHeroImg,
  },
  {
    id: 3,
    title: "أجهزة منزلية متميزة",
    subtitle: "كل ما تحتاجه لبيتك في مكان واحد",
    cta: "تسوق الآن",
    image: hero3Img,
  },
];
