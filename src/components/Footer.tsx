import { motion } from 'framer-motion'
import { Coffee, MapPin, Phone, Mail, Instagram, Facebook, Music, Star } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'

// Google Place ID for Messanta Coffee - Update this with your actual Place ID
// To find your Place ID: https://developers.google.com/maps/documentation/places/web-service/place-id
const GOOGLE_PLACE_ID = 'ChIJIQ1w0qGHSxYRPo9ePbStR_M' // Messanta Coffee Addis Ababa

const Footer = () => {
  const currentUrl = window.location.origin
  const googleReviewUrl = `https://search.google.com/local/writereview?placeid=${GOOGLE_PLACE_ID}`

  return (
    <footer className="bg-gradient-to-r from-secondary-800 to-primary-800 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <div className="flex items-center space-x-2 mb-4">
                <Coffee className="h-8 w-8 text-primary-300" />
                <span className="text-2xl font-display font-bold">
                  Messanta Coffee
                </span>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed max-w-md">
                Experience the rich flavors of Ethiopian culture through our carefully crafted coffee blends. 
                A journey of taste that connects tradition with modern coffee culture.
              </p>
            </motion.div>

            {/* QR Codes Section */}
            <div className="flex flex-wrap gap-4">
              {/* Menu QR Code */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-white p-3 rounded-xl shadow-lg"
              >
                <QRCodeSVG
                  value={currentUrl}
                  size={100}
                  level="M"
                  includeMargin={false}
                />
                <p className="text-xs text-gray-600 mt-2 text-center font-sora font-medium">
                  Scan for Menu
                </p>
              </motion.div>

              {/* Google Review QR Code */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-amber-50 to-yellow-100 p-3 rounded-xl shadow-lg border-2 border-amber-200"
              >
                <QRCodeSVG
                  value={googleReviewUrl}
                  size={100}
                  level="M"
                  includeMargin={false}
                  fgColor="#78350f"
                />
                <div className="flex items-center justify-center mt-2 space-x-1">
                  <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                  <p className="text-xs text-amber-800 font-sora font-semibold">
                    Leave a Review
                  </p>
                  <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                </div>
              </motion.div>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-xl font-semibold mb-6">Contact Us</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-primary-300" />
                  <span className="text-gray-300">
                    SAN Building, South Africa Street<br />
                    Addis Ababa, Ethiopia
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-primary-300" />
                  <div className="flex flex-col">
                    <a href="tel:01132000071" className="text-lg font-sora font-light hover:underline">
                      011 3 20 00 071
                    </a>
                    <a href="tel:+251903018011" className="text-lg font-sora font-light hover:underline">
                      +251 903 01 80 11
                    </a>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-primary-300" />
                  <div className="flex flex-col">
                    <a href="mailto:info@messanta.unitedfurniture.et" className="text-lg font-sora font-light hover:underline">
                      info@messanta.unitedfurniture.et
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Social Media */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-xl font-semibold mb-6">Follow Us</h3>
              <div className="flex space-x-4 mb-6">
                <a
                  href="https://www.instagram.com/unitedfurnitureaddis/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors duration-200"
                >
                  <Instagram className="h-6 w-6" />
                </a>
                <a
                  href="https://www.facebook.com/unitedfurnitureaddis"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors duration-200"
                >
                  <Facebook className="h-6 w-6" />
                </a>
                <a
                  href="https://www.tiktok.com/discover/messanta-coffee-addis-ababa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors duration-200"
                >
                  <Music className="h-6 w-6" />
                </a>
              </div>
            </motion.div>
          </div>

          {/* Google Review CTA */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-xl font-semibold mb-6">Love Our Coffee?</h3>
              <div className="bg-gradient-to-br from-amber-500/20 to-yellow-500/20 rounded-xl p-6 border border-amber-400/30">
                <div className="flex items-center space-x-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-gray-200 text-sm mb-4 font-sora font-light">
                  Share your experience! Your review helps us serve you better and helps others discover great coffee.
                </p>
                <a
                  href={googleReviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-gray-900 font-sora font-semibold rounded-lg hover:from-amber-500 hover:to-yellow-600 transition-all duration-300 shadow-lg hover:shadow-xl text-sm"
                >
                  <Star className="h-4 w-4 mr-2" />
                  Write a Review on Google
                </a>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="border-t border-white/20 mt-12 pt-8 text-center"
        >
          <p className="text-gray-300">
            © 2024 Messanta Coffee. All rights reserved. | 
            <span className="ml-2 text-primary-300">A subsidiary of SAN Trading</span>
          </p>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer
