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
    price: 120,
    image_url: 'https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Macchiato-Messanta-scaled.jpg',
    category_id: '1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Caramel',
    description: 'Smooth coffee with caramel syrup',
    price: 150,
    image_url: 'https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Caramel-Messanta-scaled.jpg',
    category_id: '1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Espresso',
    description: 'Pure, intense coffee experience',
    price: 100,
    image_url: 'https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Black-Coffee-1-scaled.jpg',
    category_id: '1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Hot Chocolate',
    description: 'Rich and creamy chocolate drink',
    price: 120,
    image_url: 'https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Hot-Chocolate-Messanta-scaled.jpg',
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
    name: 'Iced Latte',
    description: 'Cold coffee with milk over ice',
    price: 120,
    image_url: 'https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Iced-Latte-Messanta-scaled.jpg',
    category_id: '2',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '10',
    name: 'Iced Coffee',
    description: 'Chilled coffee served over ice',
    price: 150,
    image_url: 'https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Iced-Coffee-Messanta-scaled.jpg',
    category_id: '2',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '11',
    name: 'Sprite Lemonade',
    description: 'Refreshing lemonade with sprite',
    price: 100,
    image_url: 'https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Sprite-Lemonade-Messanta-scaled.jpg',
    category_id: '2',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },

  // Mojitos
  {
    id: '12',
    name: 'Orange Mojito',
    description: 'Fresh orange with mint and soda',
    price: 120,
    image_url: 'https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Orange-Mojito-Messanta-scaled.jpg',
    category_id: '3',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '13',
    name: 'Strawberry Mojito',
    description: 'Sweet strawberry with mint and soda',
    price: 120,
    image_url: 'https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Strawberry-Mojito-Messanta-scaled.jpg',
    category_id: '3',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '14',
    name: 'Pineapple Mojito',
    description: 'Tropical pineapple with mint and soda',
      price: 120,
    image_url: 'https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Pineapple-Mojito-Messanta-scaled.jpg',
    category_id: '3',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },

  // Smoothies & Juices
  {
    id: '15',
    name: 'Strawberry Smoothie',
    description: 'Fresh strawberry smoothie',
    price: 200,
    image_url: 'https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Strawberry-Smoothie-Messanta-scaled.jpg',
    category_id: '4',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '16',
    name: 'Mango Smoothie',
    description: 'Fresh mango with yogurt, milk, and sugar',
    price: 200,
    image_url: 'https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Mango-Smoothie-Messanta-1-scaled.jpg',
    category_id: '4',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '17',
    name: 'Pineapple Mango',
    description: 'Tropical pineapple and mango blend',
    price: 200,
    image_url: 'https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Pineapple-Mango-Messanta-scaled.jpg',
    category_id: '4',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '18',
    name: 'Dates Smoothie',
    description: 'Healthy dates smoothie',
    price: 200,
    image_url: 'https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Dates-Smoothie-Messanta-scaled.jpg',
    category_id: '4',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '19',
    name: 'Date-Flax Smoothie',
    description: 'Nutritious dates and flax seed smoothie',
    price: 200,
    image_url: 'https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Date-Flax-Smoothie-Messanta-scaled.jpg',
    category_id: '4',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '20',
    name: 'Mixed Juice',
    description: 'Fresh mixed fruit juice',
    price: 200,
    image_url: 'https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Mixed-Juice-Messanta-scaled.jpg',
    category_id: '4',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '21',
    name: 'Mango Milkshake',
    description: 'Creamy mango milkshake',
    price: 200,
    image_url: 'https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Mango-Milkshake-Messanta-scaled.jpg',
    category_id: '4',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '22',
    name: 'Strawberry Milkshake',
    description: 'Sweet strawberry milkshake',
    price: 200,
    image_url: 'https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Strawberry-Milkshake-Messanta-scaled.jpg',
    category_id: '4',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '23',
    name: 'Beetroot',
    description: 'Healthy beetroot juice',
    price: 200,
    image_url: 'https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Beetroot-Messanta-scaled.jpg',
    category_id: '4',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '24',
    name: 'Green Juice',
    description: 'Green apple, spinach, milk, and sugar',
    price: 200,
    image_url: 'https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Green-Juice-Messanta-scaled.jpg',
    category_id: '4',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '25',
    name: 'Detox',
    description: 'Cleansing detox juice',
    price: 200,
    image_url: 'https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Detox-Messanta-scaled.jpg',
    category_id: '4',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '26',
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
    id: '27',
    name: 'Opera',
    description: 'Classic French opera cake',
    price: 300,
    image_url: 'https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Opera-Messanta-scaled.jpg',
    category_id: '5',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '28',
    name: 'Sacher',
    description: 'Traditional Austrian sacher cake',
    price: 300,
    image_url: 'https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Sacher-Messanta-scaled.jpg',
    category_id: '5',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '29',
    name: 'Red Velvet',
    description: 'Classic red velvet cake',
    price: 300,
    image_url: 'https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Red-Velvet-Messanta-scaled.jpg',
    category_id: '5',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '30',
    name: 'Carrot Cake',
    description: 'Moist carrot cake with cream cheese frosting',
    price: 300,
    image_url: 'https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Carrot-Messanta-scaled.jpg',
    category_id: '5',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '31',
    name: 'Muffin',
    description: 'Fresh baked muffin',
    price: 300,
    image_url: 'https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Muffin-Messanta-scaled.jpg',
    category_id: '5',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '32',
    name: 'Marble Cake',
    description: 'Classic marble cake with chocolate and vanilla',
    price: 300,
    image_url: 'https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Marble-Cake-Messanta-scaled.jpg',
    category_id: '5',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '33',
    name: 'Chocolate Croissant',
    description: 'Buttery croissant with chocolate filling',
    price: 300,
    image_url: 'https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Chocolate-Croissant-Messanta-scaled.jpg',
    category_id: '5',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '34',
    name: 'Danish',
    description: 'Flaky Danish pastry',
    price: 300,
    image_url: 'https://messanta.unitedfurniture.et/wp-content/uploads/2022/09/Danish-Messanta-scaled.jpg',
    category_id: '5',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]