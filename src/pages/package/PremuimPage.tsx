import { Check, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useActivePlans, usePurchasePlan } from '@/hooks/usePlan';
import { planService, type Plan } from '@/services/planService';
import { useState } from 'react';
import { toast } from 'sonner';

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

      // Purchase the plan
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500 mb-4" />
        <p className="text-gray-600">{t('common.loading')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4">
        <p className="text-red-600 mb-4">{t('common.error')}</p>
        <p className="text-gray-600">{error.message}</p>
      </div>
    );
  }

  if (!plans || plans.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4">
        <p className="text-gray-600">{t('admin.no_plans')}</p>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        <span className="text-3xl font-bold text-gray-800 mb-6 text-orange-500">
          {t('home.subscription')}
        </span>{' '}
        {t('home.subscription_plans')}
      </h1>
      <p className="text-gray-600 mb-12 text-center max-w-lg">
        {t('home.subscription_plans_desc')}
      </p>

      <div className="grid md:grid-cols-3 gap-8 w-full max-w-5xl">
        {plans.map((plan: Plan) => (
          <div
            key={plan.id}
            className={`relative rounded-2xl shadow-md bg-white p-6 flex flex-col border transition-transform duration-200 hover:scale-105 hover:shadow-xl ${
              plan.isPopular ? 'border-orange-500' : 'border-gray-200'
            }`}
          >
            {plan.isPopular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                <div className="bg-gradient-to-r from-orange-500 to-amber-400 text-white text-xs font-semibold px-4 py-1 rounded-full shadow-lg">
                  {t('admin.popular')}
                </div>

                {/* Hiệu ứng phủ ánh sáng nhẹ phía dưới badge */}
                <div className="absolute top-full left-0 w-full h-3 bg-gradient-to-b from-orange-300/40 to-transparent rounded-b-full blur-sm"></div>
              </div>
            )}

            <h2 className="text-xl font-semibold text-gray-800 mb-4">{plan.name}</h2>
            {plan.description && <p className="text-sm text-gray-600 mb-4">{plan.description}</p>}

            <p className="text-3xl font-bold text-gray-900 mb-6">
              {plan.price.toLocaleString()}đ
              <span className="text-base font-medium text-gray-500">/{plan.durationDays} days</span>
            </p>

            <ul className="flex-1 mb-6 space-y-3">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-center text-gray-700">
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
          </div>
        ))}
      </div>
    </div>
  );
}
