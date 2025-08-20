// components/ServicesSection.tsx
import { motion } from 'framer-motion';

const services = [
  {
    number: '01',
    title: 'Immigration & Work Permits',
    desc: 'Expert guidance through visa and work permit processes',
  },
  {
    number: '02',
    title: 'Property & Inheritance Law',
    desc: 'Secure your property rights and inheritance matters',
  },
  {
    number: '03',
    title: 'Family & Marriage Law',
    desc: 'Professional support for family legal matters',
  },
  {
    number: '04',
    title: 'Business Setup & Tax',
    desc: 'Complete business registration and tax compliance',
  },
  {
    number: '05',
    title: 'Document Legalization & Notarization',
    desc: 'Official document authentication services',
  },
  {
    number: '06',
    title: 'Dispute Resolution & Investment Consulting',
    desc: 'Legal dispute resolution and investment advice',
  },
];

export default function ServicesSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            <span className="text-orange-500">Legal</span> Main services.
          </h2>
          <p className="text-gray-600">Complete legal solutions for your needs</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 group flex flex-col h-full"
            >
              <div className="flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <span className="text-orange-500 font-bold text-lg">{service.number}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-orange-500 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{service.desc}</p>
                </div>
                <div className="w-full h-32 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg mt-4"></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View More Button */}
        <div className="text-center mt-10">
          <motion.button
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center px-8 py-3 bg-white border border-gray-200 
               text-gray-700 font-medium rounded-full hover:bg-gray-50 
               hover:border-gray-300 transition-all duration-200 shadow-sm"
          >
            View More
          </motion.button>
        </div>
      </div>
    </section>
  );
}
