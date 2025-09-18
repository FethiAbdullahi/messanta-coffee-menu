import { motion } from 'framer-motion'
import { Coffee, MapPin, Phone, Mail, Instagram, Facebook, Music } from 'lucide-react'
import QRCode from 'qrcode.react'

const Footer = () => {
  const currentUrl = window.location.origin

  return (
    <footer className="bg-gradient-to-r from-secondary-800 to-primary-800 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
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

            {/* QR Code */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-white p-4 rounded-lg inline-block"
            >
              <QRCode
                value={currentUrl}
                size={120}
                level="M"
                includeMargin={true}
              />
              <p className="text-xs text-gray-600 mt-2 text-center">
                Scan for menu
              </p>
            </motion.div>
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
              <div className="flex space-x-4">
                <a
                  href="https://www.instagram.com/unitedfurnitureaddis/"
                  className="p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors duration-200"
                >
                  <Instagram className="h-6 w-6" />
                </a>
                <a
                  href="https://www.facebook.com/unitedfurnitureaddis"
                  className="p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors duration-200"
                >
                  <Facebook className="h-6 w-6" />
                </a>
                <a
                  href="https://www.tiktok.com/discover/messanta-coffee-addis-ababa"
                  className="p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors duration-200"
                >
                  <Music className="h-6 w-6" />
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
