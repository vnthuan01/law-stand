// components/CTASection.tsx
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import CTAImage from '@/assets/images/img2.jpg';

export default function CTASection() {
  const navigate = useNavigate();
  return (
    <section className="py-20 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 bg-black p-4 rounded-md">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-wb rounded-lg overflow-hidden shadow-xl"
        >
          <div className="grid lg:grid-cols-2 gap-0">
            <div className="p-12 lg:p-16 flex flex-col justify-center">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                You don't have to
                <br />
                fight alone.
              </h2>
              <p className="text-xl text-white mb-8">
                Book a consultation with one of our lawyers today.
              </p>
              <Button
                variant="orange"
                size="lg"
                className="px-8 py-4 font-semibold self-start rounded-lg"
                onClick={() => navigate('/booking')}
              >
                Book a Consultation
              </Button>
            </div>
            <div className="bg-gradient-to-br from-orange-100 to-orange-200 min-h-96 flex items-center justify-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="text-orange-600 text-8xl"
              >
                <img src={CTAImage} alt="CTA Image" className="w-full h-full object-cover" />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
