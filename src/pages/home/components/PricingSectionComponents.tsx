import { Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

export default function PricingSection() {
  const { t } = useTranslation();

  const planKeys = ['free', 'standard', 'professional'];

  const plans = planKeys.map((key) => ({
    key,
    name: t(`home.plans.${key}.name`),
    price: t(`home.plans.${key}.price`),
    features: t(`home.plans.${key}.features`, { returnObjects: true }) as string[],
    popular: key === 'standard',
  }));

  const handleBuyNow = (planName: string) => {
    console.log(`Buy Now clicked for ${planName}`);
    // Navigate to a dedicated checkout page if needed
  };

  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            <span className="text-orange-500">{t('home.subscription')}</span>{' '}
            {t('home.subscription_plans')}
          </h2>
          <p className="text-gray-600 max-w-lg mx-auto">{t('home.subscription_plans_desc')}</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 w-full">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.key}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`rounded-2xl shadow-md bg-white p-6 flex flex-col border transition-transform duration-300 hover:scale-105 hover:shadow-xl ${
                plan.popular ? 'border-orange-500' : 'border-gray-200'
              }`}
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-4">{plan.name}</h3>
              <p className="text-3xl font-bold text-gray-900 mb-6">
                {plan.price}
                <span className="text-base font-medium text-gray-500">{t('home.per_month')}</span>
              </p>
              <ul className="flex-1 mb-6 space-y-3">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start text-gray-700">
                    <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-1" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleBuyNow(plan.name)}
                className="mt-auto bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-xl transition"
              >
                {t('home.buy_now')}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
