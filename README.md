# Messanta Coffee Website

A vibrant, engaging coffee shop website that reflects Harari culture, powered by Supabase for backend data management.

## Features

- 🎨 **Harari-inspired Design**: Beautiful UI with cultural patterns and earthy colors
- ☕ **Dynamic Menu**: Real-time menu management with categories and products
- 📱 **Responsive Design**: Works perfectly on mobile, tablet, and desktop
- 🔐 **Admin Dashboard**: Secure admin panel for managing menu items
- 📱 **QR Code Integration**: Generate QR codes for easy menu access
- ⚡ **Modern Tech Stack**: React, TypeScript, TailwindCSS, Framer Motion
- 🗄️ **Supabase Backend**: Real-time database with Row Level Security

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS + Framer Motion
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Icons**: Lucide React
- **QR Codes**: qrcode.react

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd messanta-coffee
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Fill in your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase Database**
   
   Run the following SQL in your Supabase SQL editor:

   ```sql
   -- Create categories table
   CREATE TABLE categories (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     name TEXT NOT NULL,
     description TEXT,
     "order" INTEGER NOT NULL DEFAULT 0,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Create products table
   CREATE TABLE products (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     name TEXT NOT NULL,
     description TEXT,
     price DECIMAL(10,2) NOT NULL,
     image_url TEXT,
     category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Enable Row Level Security
   ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
   ALTER TABLE products ENABLE ROW LEVEL SECURITY;

   -- Create policies (adjust as needed for your auth requirements)
   CREATE POLICY "Categories are viewable by everyone" ON categories
     FOR SELECT USING (true);

   CREATE POLICY "Products are viewable by everyone" ON products
     FOR SELECT USING (true);

   -- Insert sample data
   INSERT INTO categories (name, description, "order") VALUES
   ('Coffees', 'Our signature coffee blends', 1),
   ('Hot Drinks', 'Warm beverages for any time', 2),
   ('Breakfasts', 'Morning delights to start your day', 3),
   ('Cakes', 'Sweet treats and desserts', 4);

   INSERT INTO products (name, description, price, category_id) VALUES
   ('Ethiopian Blend', 'Rich and aromatic coffee from the highlands', 4.50, (SELECT id FROM categories WHERE name = 'Coffees')),
   ('Cappuccino', 'Classic Italian coffee with steamed milk', 3.50, (SELECT id FROM categories WHERE name = 'Hot Drinks')),
   ('Avocado Toast', 'Fresh avocado on artisan bread', 8.00, (SELECT id FROM categories WHERE name = 'Breakfasts')),
   ('Chocolate Cake', 'Decadent chocolate cake with ganache', 6.00, (SELECT id FROM categories WHERE name = 'Cakes'));
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.tsx      # Navigation header
│   ├── Footer.tsx      # Footer with QR code
│   ├── ProductCard.tsx # Product display card
│   └── CategorySection.tsx # Category display section
├── pages/              # Page components
│   ├── LandingPage.tsx # Main landing page
│   ├── CategoryPage.tsx # Individual category page
│   └── AdminDashboard.tsx # Admin management panel
├── hooks/              # Custom React hooks
│   └── useSupabase.ts  # Supabase data hooks
├── lib/                # Utility libraries
│   ├── supabase.ts     # Supabase client
│   └── utils.ts        # Helper functions
├── types/              # TypeScript type definitions
│   └── database.ts     # Database schema types
└── App.tsx             # Main app component
```

## Features Overview

### Landing Page
- Hero section with Harari-inspired design
- Dynamic menu sections loaded from Supabase
- Smooth scroll navigation
- Responsive design for all devices

### Category Pages
- Individual pages for each menu category
- Product grid with images and descriptions
- Back navigation to main menu

### Admin Dashboard
- Add, edit, and delete categories
- Add, edit, and delete products
- Real-time updates
- Secure authentication (to be implemented)

### QR Code Integration
- Automatic QR code generation
- Links to the main menu
- Printable for in-store use

## Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Connect your GitHub repository to Vercel
   - Add environment variables in Vercel dashboard
   - Deploy automatically

### Environment Variables for Production

Make sure to set these in your deployment platform:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Customization

### Colors
The color scheme is defined in `tailwind.config.js` with Harari-inspired colors:
- Primary: Orange/brown tones
- Secondary: Earthy browns
- Accent: Blue highlights

### Fonts
- Display: Playfair Display (for headings)
- Sans: Inter (for body text)

### Adding New Categories
1. Use the admin dashboard to add categories
2. The order field determines display order
3. Categories automatically appear in the menu

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email info@messantacoffee.com or create an issue in the repository.
"# messenta-coffee-menu" 
