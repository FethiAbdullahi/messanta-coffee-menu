import { motion } from 'framer-motion'
import { Coffee, Star, Users, Award, Phone, Mail } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import CategorySection from '../components/CategorySection'
import CountingNumber from '../components/CountingNumber'
import { useCategories, useProducts } from '../hooks/useSupabase'

const LandingPage = () => {
  const { categories, loading: categoriesLoading } = useCategories()
  const { products: allProducts, loading: productsLoading } = useProducts()


  // Group products by category
  const productsByCategory = categories.reduce((acc, category) => {
    acc[category.id] = allProducts.filter(product => product.category_id === category.id)
    return acc
  }, {} as Record<string, typeof allProducts>)

  // Show loading state if data is still loading
  if (categoriesLoading || productsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Clean Hero Section with Coffee Image Background */}
      <section id="home" className="relative min-h-screen overflow-hidden">
        {/* Coffee Image Background */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('/delicious-coffee-cup-indoors.jpg')`,
              filter: 'brightness(0.6) contrast(1.1)'
            }}
          ></div> 
          
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        {/* Main Content Container */}
        <div className="relative z-10 min-h-screen flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              
              {/* Main Content */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-white"
              >
                <h1 className="text-6xl md:text-8xl font-sora font-bold mb-8 leading-tight">
                  <span className="block">Start Your Morning With</span>
                  <span className="block text-yellow-400">Coffee</span>
                </h1>
                
                <p className="text-xl md:text-2xl text-gray-200 font-sora font-light mb-8 leading-relaxed max-w-3xl mx-auto">
                  Experience the rich heritage of culture through our carefully crafted coffee blends. 
                  A journey of taste that connects tradition with modern coffee culture.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                  <button 
                    onClick={() => {
                      const menuSection = document.querySelector('#menu')
                      if (menuSection) {
                        menuSection.scrollIntoView({ behavior: 'smooth' })
                      }
                    }}
                    className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-sora font-semibold rounded-lg hover:from-yellow-500 hover:to-amber-600 transition-all duration-300 text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    ORDER NOW
                  </button>
                  <button 
                    onClick={() => {
                      const aboutSection = document.querySelector('#about')
                      if (aboutSection) {
                        aboutSection.scrollIntoView({ behavior: 'smooth' })
                      }
                    }}
                    className="px-8 py-4 border-2 border-white text-white font-sora font-semibold rounded-lg hover:bg-white hover:text-black transition-all duration-300 text-lg"
                  >
                    READ MORE
                  </button>
                </div>

                {/* Contact Info */}
                <div className="flex flex-col sm:flex-row gap-8 justify-center text-gray-200">
                  <div className="flex items-center justify-center space-x-3">
                    <Phone className="h-6 w-6 text-yellow-400" />
                    <div className="flex flex-col">
                      <a href="tel:01132000071" className="text-lg font-sora font-light hover:underline">
                        011 3 20 00 071
                      </a>
                      <a href="tel:+251903018011" className="text-lg font-sora font-light hover:underline">
                        +251 903 01 80 11
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center justify-center space-x-3">
                    <Mail className="h-6 w-6 text-yellow-400" />
                    <div className="flex flex-col">
                      <a
                        href="mailto:info@messanta.unitedfurniture.et"
                        className="text-lg font-sora font-light hover:underline"
                      >
                        info@messanta.unitedfurniture.et
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Simple Coffee Beans Dropping Animation */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="coffee-bean-dropping-1"></div>
          <div className="coffee-bean-dropping-2"></div>
          <div className="coffee-bean-dropping-3"></div>
          <div className="coffee-bean-dropping-4"></div>
          <div className="coffee-bean-dropping-5"></div>
          <div className="coffee-bean-dropping-6"></div>
          <div className="coffee-bean-dropping-7"></div>
          <div className="coffee-bean-dropping-8"></div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 relative overflow-hidden">
        {/* Harari Cultural Background Elements */}
        <div className="absolute top-10 left-10 w-24 h-24 opacity-10">
          <div className="w-full h-full bg-gradient-to-br from-orange-400 via-red-500 to-yellow-400 rounded-full harari-basket-pattern"></div>
        </div>
        <div className="absolute bottom-10 right-10 w-32 h-32 opacity-10">
          <div className="w-full h-full bg-gradient-to-br from-blue-500 via-green-500 to-purple-500 rounded-full harari-basket-pattern"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Coffee, label: 'Coffee Varieties', value: '10+', colors: 'from-orange-400 to-red-500' },
              { icon: Star, label: 'Happy Customers', value: '1000+', colors: 'from-yellow-400 to-orange-500' },
              { icon: Users, label: 'Years Experience', value: '3+', colors: 'from-green-400 to-blue-500' },
              { icon: Award, label: 'Awards Won', value: '2', colors: 'from-purple-400 to-pink-500' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${stat.colors} rounded-full mb-4 shadow-lg harari-dot-pattern`}>
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl font-sora font-bold text-gray-900 mb-2">
                  <CountingNumber 
                    end={parseInt(stat.value.replace('+', ''))} 
                    suffix={stat.value.includes('+') ? '+' : ''}
                    duration={2.5}
                    className="text-4xl font-sora font-bold"
                  />
                </div>
                <div className="text-gray-600 font-sora font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Menu Sections */}
      <div id="menu">
        {categoriesLoading || productsLoading ? (
          <div className="py-16 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading menu...</p>
          </div>
        ) : (
          categories.map((category) => (
            <CategorySection
              key={category.id}
              category={category}
              products={productsByCategory[category.id] || []}
            />
          ))
        )}
      </div>

      {/* Additional Menu Info */}
      <section className="py-16 bg-gradient-to-r from-primary-50 to-secondary-50">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-4xl font-sora font-bold text-gray-900 mb-4">
              A Cup of Originality to Make Your Day
            </h2>
            <p className="text-xl text-gray-600 font-sora font-light mb-8">
              We serve a truly international experience right into your neighborhood. 
              Ever since we've grown to be a group of passionate people who not just want you to enjoy your coffee 
              but have a great time with us.
            </p>

          </motion.div>
        </div>
      </section>

      {/* Professional About Section with Coffee Spill Background */}
      <section id="about" className="relative min-h-screen overflow-hidden">
        {/* Coffee Spill Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800">
          {/* Coffee Spill Visual Background */}
          <div className="absolute inset-0 opacity-20">
            <div className="coffee-spill-background"></div>
          </div>
          
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        {/* Main Content Container */}
        <div className="relative z-10 min-h-screen flex items-center py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              
              {/* Header Section */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-center mb-16"
              >
                <h2 className="text-5xl md:text-7xl font-sora font-bold text-white mb-6 leading-tight">
                  About <span className="text-yellow-400">Us</span>
                </h2>
                <div className="w-32 h-1 bg-gradient-to-r from-yellow-400 to-amber-500 mx-auto mb-8"></div>
                <p className="text-xl md:text-2xl text-gray-300 font-sora font-light max-w-3xl mx-auto leading-relaxed">
                  Experience the rich heritage of Ethiopian culture through our carefully crafted coffee blends. 
                  A journey of taste that connects tradition with modern coffee culture.
                </p>
              </motion.div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                
                {/* Left Side - Content */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="space-y-8"
                >
                  {/* Story Card 1 */}
                  <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
                    <h3 className="text-2xl md:text-3xl font-sora font-bold text-white mb-6 leading-tight">
                      We provide the finest coffee, here in Addis!
                    </h3>
                    <p className="text-lg text-gray-200 font-sora font-light leading-relaxed">
                      We serve a truly international experience right into your neighborhood. 
                      Ever since we've grown to be a group of passionate people who not just want you to enjoy your coffee 
                      but have a great time with us.
                    </p>
                  </div>

                  {/* Story Card 2 */}
                  <div className="bg-gradient-to-r from-yellow-400/10 to-amber-500/10 backdrop-blur-lg rounded-3xl p-8 border border-yellow-400/30 shadow-2xl">
                    <p className="text-lg text-gray-100 font-sora font-light leading-relaxed mb-6">
                      We grew to become the favorite place for coffee lovers of all age groups wanting to spend some quality time 
                      while sipping on the coffee we serve.
                    </p>
                    <p className="text-lg text-gray-100 font-sora font-light leading-relaxed">
                      Today, we continue serving the best coffee in town and have built a deeper coffee relationship 
                      with the people of Addis and around.
                    </p>
                  </div>
                </motion.div>

                {/* Right Side - Stats with Professional Layout */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="space-y-8"
                >
                  {/* Stats Header */}
                  <div className="text-center lg:text-left">
                    <h3 className="text-3xl md:text-4xl font-sora font-bold text-white mb-4">
                      Our <span className="text-yellow-400">Achievements</span>
                    </h3>
                    <p className="text-lg text-gray-300 font-sora font-light">
                      Numbers that speak for our commitment to excellence
                    </p>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-6">
                    {[
                      { number: 3, suffix: '+', label: 'Years of Excellence', description: 'Serving the community' },
                      { number: 10, suffix: '+', label: 'Coffee Varieties', description: 'Unique blends available' },
                      { number: 1000, suffi1x: '+', label: 'Happy Customers', description: 'Satisfied coffee lovers' },
                      { number: 24, suffix: '/7', label: 'Coffee Passion', description: 'Always brewing' }
                    ].map((stat, index) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 + 0.6 }}
                        className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 shadow-xl hover:bg-white/10 transition-all duration-300"
                      >
                        <div className="text-center">
                          <div className="text-4xl md:text-5xl font-sora font-bold text-yellow-400 mb-2">
                            <CountingNumber 
                              end={stat.number} 
                              suffix={stat.suffix}
                              duration={2.5}
                            />
                          </div>
                          <div className="text-lg font-sora font-semibold text-white mb-1">
                            {stat.label}
                          </div>
                          <div className="text-sm text-gray-400 font-sora font-light">
                            {stat.description}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Call to Action */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 1 }}
                    className="text-center lg:text-left"
                  >
                    <button 
                      onClick={() => {
                        const menuSection = document.querySelector('#menu')
                        if (menuSection) {
                          menuSection.scrollIntoView({ behavior: 'smooth' })
                        }
                      }}
                      className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-sora font-semibold rounded-xl hover:from-yellow-500 hover:to-amber-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      Explore Our Menu
                    </button>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-4xl font-sora font-bold text-gray-900 mb-4">
              Visit Us
            </h2>
            <p className="text-xl text-gray-600 font-sora font-light mb-8">
              Come experience the warmth of hospitality at our coffee shop.
            </p>
            <div className="bg-white rounded-lg p-8 shadow-lg">
              <h3 className="text-2xl font-sora font-semibold text-gray-900 mb-6">
                Location & Hours
              </h3>
              
              {/* Google Maps Embed */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-lg font-sora font-semibold text-gray-900">Find Us on Map</h4>
                  <a 
                    href="https://maps.app.goo.gl/tngwYErdZeZnhbHk8" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-yellow-600 hover:text-yellow-700 font-sora font-medium text-sm flex items-center space-x-1"
                  >
                    <span>Open in Google Maps</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                    </svg>
                  </a>
                </div>
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3939.9707569775036!2d38.7236654!3d8.988851!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b87a1d2700d21%3A0xf347adb43d5e8f3e!2sMESSANTA%20COFFEE!5e0!3m2!1sen!2set!4v1694900000000!5m2!1sen!2set"
                      width="100%"
                      height="300"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="rounded-lg shadow-md"
                      title="Messanta Coffee Location - S AFRICA ST, Lesotho St, Addis Ababa, Ethiopia"
                    ></iframe>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="text-lg font-sora font-semibold text-gray-900">Address</h4>
                  <p className="text-gray-600 font-sora font-light">
                    S AFRICA ST, Lesotho St<br />
                    Addis Ababa, Ethiopia<br />
                  </p>
                </div>
                
                <div className="space-y-3">
                  <h4 className="text-lg font-sora font-semibold text-gray-900">Hours & Contact</h4>
                  <div className="space-y-1 text-gray-600 font-sora font-light">
                    <p>Monday - Sunday: 7:30 AM - 7:30 PM</p>
                    <p><b>Phone:</b></p>
                    <div className="flex flex-col">
                      <a href="tel:01132000071" className="text-lg font-sora font-light hover:underline">
                        011 3 20 00 071
                      </a>
                      <a href="tel:+251903018011" className="text-lg font-sora font-light hover:underline">
                        +251 903 01 80 11
                      </a>
                    </div>
                    <p><b>Email:</b></p>
                    <div className="flex flex-col">
                      <a href="mailto:info@messanta.unitedfurniture.et" className="text-lg font-sora font-light hover:underline">
                        info@messanta.unitedfurniture.et
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default LandingPage
