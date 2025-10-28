import { Check, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useActivePlans, usePurchasePlan } from '@/hooks/usePlan';
import { planService, type Plan } from '@/services/planService';
import { useState } from 'react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function PricingPage() {
  const { t } = useTranslation();
  const [purchasingPlanId, setPurchasingPlanId] = useState<string | null>(null);

  // Fetch active plans from API
  const { data: plans, isLoading, error } = useActivePlans();
  const purchasePlanMutation = usePurchasePlan();

  const handleBuyNow = async (plan: Plan) => {
    try {
      setPurchasingPlanId(plan.id);

      const { canPurchase, reason } = await planService.canPurchase(plan.id);
      if (!canPurchase) {
        toast.error(reason || 'You cannot purchase this plan');
        return;
      }

      await purchasePlanMutation.mutateAsync({
        planId: plan.id,
        paymentMethod: 'credit_card',
        startDate: Date.now().toString(),
      });

      toast.success(`Successfully purchased ${plan.name} plan!`);
    } catch (error: any) {
      console.error('Purchase error:', error);
      toast.error(error.response?.data?.message || 'Failed to purchase plan');
    } finally {
      setPurchasingPlanId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 bg-gradient-to-br from-gray-800 via-gray-900 to-black">
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl font-bold text-white mb-6"
      >
        <span className="text-blue-500">{t('home.subscription')}</span>{' '}
        {t('home.subscription_plans')}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="text-white mb-12 text-center max-w-lg"
      >
        {t('home.subscription_plans_desc')}
      </motion.p>

      {isLoading && (
        <div className="grid md:grid-cols-3 gap-8 w-full max-w-5xl animate-pulse">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-80 bg-gray-200 rounded-2xl shadow-inner border border-gray-300"
            ></div>
          ))}
        </div>
      )}

      {error && (
        <div className="text-center text-red-600 mt-10">
          <p className="font-semibold">{t('common.error')}</p>
          <p className="text-white">{error.message}</p>
        </div>
      )}

      {!isLoading && !error && (!plans || plans.length === 0) && (
        <div className="text-white text-center py-20">
          <p className="text-lg font-medium">{t('admin.no_plans')}</p>
        </div>
      )}

      {!isLoading && !error && plans && plans.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="grid md:grid-cols-3 gap-8 w-full max-w-5xl"
        >
          {plans.map((plan: Plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`relative rounded-2xl shadow-md bg-white p-6 flex flex-col border transition-transform duration-200 hover:scale-105 hover:shadow-xl ${
                plan.isPopular ? 'border-orange-500' : 'border-gray-200'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-gradient-to-r from-orange-500 to-amber-400 text-white text-xs font-semibold px-4 py-1 rounded-full shadow-lg">
                    {t('admin.popular')}
                  </div>
                  <div className="absolute top-full left-0 w-full h-3 bg-gradient-to-b from-orange-300/40 to-transparent rounded-b-full blur-sm"></div>
                </div>
              )}

              <h2 className="text-xl font-semibowhite-800 mb-4">{plan.name}</h2>
              {plan.description && <p className="text-white-600 mb-4">{plan.description}</p>}

              <p className="text-3xl font-bowhite-900 mb-6">
                {plan.price.toLocaleString()}đ
                <span className="text-base font-mediwhite-500">/{plan.durationDays} days</span>
              </p>

              <ul className="flex-1 mb-6 space-y-3">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-centwhite-700">
                    <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleBuyNow(plan)}
                disabled={purchasingPlanId === plan.id || purchasePlanMutation.isPending}
                className="mt-auto bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-xl transition flex items-center justify-center"
              >
                {purchasingPlanId === plan.id ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t('common.loading')}
                  </>
                ) : (
                  t('home.buy_now')
                )}
              </button>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
