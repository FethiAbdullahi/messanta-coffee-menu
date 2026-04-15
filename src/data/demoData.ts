import { Category, Product } from '../types/database'

export const demoCategories: Category[] = [
  {
    id: '1',
    name: 'Hot Drinks',
    description: 'Warm beverages to comfort your soul',
    order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Cold Drinks',
    description: 'Refreshing beverages for any time',
    order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Mojitos',
    description: 'Fresh and fruity mocktails',
    order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Smoothies & Juices',
    description: 'Healthy and delicious smoothies',
    order: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '5',
    name: 'Cakes & Pastries',
    description: 'Sweet treats and desserts',
    order: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

export const demoProducts: Product[] = [
  // Hot Drinks
  {
    id: '1',
    name: 'Macchiato',
    description: 'Rich espresso with a dollop of steamed milk',
    price: 140,
    image_url: 'public/Macchiato.webp',
    category_id: '1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Espresso',
    description: 'Pure, intense Espresso experience',
    price: 90,
    image_url: 'public/Espresso.webp',
    category_id: '1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Messanta Tea',
    description: 'Pure, intense House Special Tea experience',
    price: 185,
    image_url: 'public/messanta-tea.webp',
    category_id: '1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Hot Caramel',
    description: 'Rich and creamy Caramel drink',
    price: 230,
    image_url: 'public/hot-caramel.webp',
    category_id: '1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '5',
    name: 'Espresso Tea',
    description: 'Strong tea with espresso notes',
    price: 100,
    image_url: 'https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Espresso-Tea-scaled.jpg',
    category_id: '1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '6',
    name: 'Tea with Spices',
    description: 'Tea with cinnamon, cardamom, and clove seeds',
    price: 120,
    image_url: 'https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Tea-with-spices-scaled.jpg',
    category_id: '1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '7',
    name: 'Lemon Tea',
    description: 'Refreshing tea with fresh lemon',
    price: 100,
    image_url: 'https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Lemon-Tea-scaled.jpg',
    category_id: '1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '8',
    name: 'Herbal Tea',
    description: 'English Breakfast, Chamomile, Darjeeling, Earl Grey, Fennel',
    price: 120,
    image_url: 'https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Herbal-Tea-Messanta-scaled.jpg',
    category_id: '1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },

  // Cold Drinks
  {
    id: '9',
    name: 'Caramel Iced Latte',
    description: 'Smooth coffee with caramel syrup and milk over ice',
    price: 270,
    image_url: 'public/Caramel.webp',
    category_id: '2',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '10',
    name: 'Chocolate Iced Latte',
    description: 'Smooth coffee with chocolate syrup and milk over ice',
    price: 270,
    image_url: 'public/Chocolate.webp',
    category_id: '2',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '11',
    name: 'Iced Coffee',
    description: 'Cold coffee served over ice',
    price: 170,
    image_url: 'public/iced-coffee.webp',
    category_id: '2',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '12',
    name: 'Iced Tea',
    description: 'Cold tea served over ice',
    price: 135,
    image_url: 'public/iced-tea.webp',
    category_id: '2',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '13',
    name: 'Iced Latte',
    description: 'Cold coffee with milk over ice',
    price: 195,
    image_url: 'public/iced-latte.webp',
    category_id: '2',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },

  // Mojitos
  {
    id: '14',
    name: 'Orange Mojito',
    description: 'Fresh orange with mint and soda',
    price: 205,
    image_url: 'public/Orange.webp',  
    category_id: '3',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '15',
    name: 'Strawberry Mojito',
    description: 'Sweet strawberry with mint and soda',
    price: 205,
    image_url: 'public/Strawberry.webp',
    category_id: '3',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '16',
    name: 'Pineapple Mojito',
    description: 'Tropical pineapple with mint and soda',
      price: 205,
    image_url: 'public/Pineapple.webp',
    category_id: '3',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },

  // Smoothies & Juices
  {
    id: '17',
    name: 'Strawberry Smoothie',
    description: 'Fresh strawberry smoothie',
    price: 200,
    image_url: 'https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Strawberry-Smoothie-Messanta-scaled.jpg',
    category_id: '4',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '18',
    name: 'Mango Smoothie',
    description: 'Fresh mango with yogurt, milk, and sugar',
    price: 200,
    image_url: 'https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Mango-Smoothie-Messanta-1-scaled.jpg',
    category_id: '4',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '19',
    name: 'Pineapple Mango',
    description: 'Tropical pineapple and mango blend',
    price: 200,
    image_url: 'https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Pineapple-Mango-Messanta-scaled.jpg',
    category_id: '4',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '20',
    name: 'Dates Smoothie',
    description: 'Healthy dates smoothie',
    price: 200,
    image_url: 'https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Dates-Smoothie-Messanta-scaled.jpg',
    category_id: '4',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '21',
    name: 'Date-Flax Smoothie',
    description: 'Nutritious dates and flax seed smoothie',
    price: 200,
    image_url: 'https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Date-Flax-Smoothie-Messanta-scaled.jpg',
    category_id: '4',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '22',
    name: 'Mixed Juice',
    description: 'Fresh mixed fruit juice',
    price: 200,
    image_url: 'https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Mixed-Juice-Messanta-scaled.jpg',
    category_id: '4',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '23',
    name: 'Mango Milkshake',
    description: 'Creamy mango milkshake',
    price: 200,
    image_url: 'https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Mango-Milkshake-Messanta-scaled.jpg',
    category_id: '4',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '24',
    name: 'Strawberry Milkshake',
    description: 'Sweet strawberry milkshake',
    price: 200,
    image_url: 'https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Strawberry-Milkshake-Messanta-scaled.jpg',
    category_id: '4',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '25',
    name: 'Beetroot',
    description: 'Healthy beetroot juice',
    price: 200,
    image_url: 'https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Beetroot-Messanta-scaled.jpg',
    category_id: '4',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '26',
    name: 'Green Juice',
    description: 'Green apple, spinach, milk, and sugar',
    price: 200,
    image_url: 'https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Green-Juice-Messanta-scaled.jpg',
    category_id: '4',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '27',
    name: 'Detox',
    description: 'Cleansing detox juice',
    price: 200,
    image_url: 'https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Detox-Messanta-scaled.jpg',
    category_id: '4',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
        id: '28',
    name: 'Pineapple Celery',
    description: 'Refreshing pineapple and celery juice',
        price: 200,
    image_url: 'https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Pineapple-Celery-Messanta-scaled.jpg',
    category_id: '4',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },

  // Cakes & Pastries
  {
    id: '29',
    name: 'Opera',
    description: 'Classic French opera cake',
    price: 300,
    image_url: 'https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Opera-Messanta-scaled.jpg',
    category_id: '5',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '30',
    name: 'Sacher',
    description: 'Traditional Austrian sacher cake',
    price: 300,
    image_url: 'https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Sacher-Messanta-scaled.jpg',
    category_id: '5',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '31',
    name: 'Red Velvet',
    description: 'Classic red velvet cake',
    price: 300,
    image_url: 'https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Red-Velvet-Messanta-scaled.jpg',
    category_id: '5',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '32',
    name: 'Carrot Cake',
    description: 'Moist carrot cake with cream cheese frosting',
    price: 300,
    image_url: 'https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Carrot-Messanta-scaled.jpg',
    category_id: '5',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '33',
    name: 'Muffin',
    description: 'Fresh baked muffin',
    price: 300,
    image_url: 'https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Muffin-Messanta-scaled.jpg',
    category_id: '5',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '34',
    name: 'Marble Cake',
    description: 'Classic marble cake with chocolate and vanilla',
    price: 300,
    image_url: 'https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Marble-Cake-Messanta-scaled.jpg',
    category_id: '5',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '35',
    name: 'Chocolate Croissant',
    description: 'Buttery croissant with chocolate filling',
    price: 300,
    image_url: 'https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Chocolate-Croissant-Messanta-scaled.jpg',
    category_id: '5',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '36',
    name: 'Danish',
    description: 'Flaky Danish pastry',
    price: 300,
    image_url: 'https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Danish-Messanta-scaled.jpg',
    category_id: '5',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]