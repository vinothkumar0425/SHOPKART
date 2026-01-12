const products = [
  { id: 1, name: "Apple iPhone 14 (128GB)", price: 69999, rating: 4.6,
    image: "https://m.media-amazon.com/images/I/61bK6PMOC3L._SX679_.jpg",
    description: "A15 Bionic, advanced dual‑camera system, all‑day battery." },
  { id: 2, name: "Samsung Galaxy S23 5G", price: 74999, rating: 4.7,
    image: "https://m.media-amazon.com/images/I/61VfL-aiToL._SX679_.jpg",
    description: "Snapdragon flagship, Dynamic AMOLED display." },
  { id: 3, name: "OnePlus 11R 5G", price: 39999, rating: 4.4,
    image: "https://m.media-amazon.com/images/I/61uA2UVnYWL._SX679_.jpg",
    description: "Smooth OxygenOS, powerful performance." },
  { id: 4, name: "Redmi Note 13 Pro", price: 25999, rating: 4.3,
    image: "https://m.media-amazon.com/images/I/71Zf9uUp+GL._SX679_.jpg",
    description: "200MP camera, AMOLED display." },
  { id: 5, name: "Realme Narzo 60", price: 17999, rating: 4.1,
    image: "https://m.media-amazon.com/images/I/51W91rRoHqL._SY300_SX300_QL70_FMwebp_.jpg",
    description: "Budget‑friendly with great performance." },
  { id: 6, name: "boAt Airdopes 141", price: 1299, rating: 4.2,
    image: "https://m.media-amazon.com/images/I/61KNJav3S9L._SX679_.jpg",
    description: "Wireless earbuds, long battery life." },
  { id: 7, name: "Apple AirPods Pro (2nd Gen)", price: 24999, rating: 4.8,
    image: "https://m.media-amazon.com/images/I/61f1YfTkTDL._SX679_.jpg",
    description: "ANC with immersive sound." },
  { id: 8, name: "HP Pavilion Laptop", price: 58999, rating: 4.3,
    image: "https://m.media-amazon.com/images/I/71vFKBpKakL._SX679_.jpg",
    description: "Intel i5 laptop for work & study." },
  { id: 9, name: "Lenovo IdeaPad Gaming 3", price: 67999, rating: 4.5,
    image: "https://m.media-amazon.com/images/I/71WXtdqjdLL._SL1500_.jpg",
    description: "RTX graphics, gaming ready." },
  { id: 10, name: "Noise Smart Watch Pro", price: 3499, rating: 4.0,
    image: "https://m.media-amazon.com/images/I/61TapeOXotL._SX679_.jpg",
    description: "AMOLED smartwatch with health tracking." }
];
export const getProducts = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(products), 500);
  });
};

export const getProductById = async (id) => {
  return products.find((p) => p.id === Number(id));
};