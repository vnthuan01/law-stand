import { useMyPlans, useMyCurrentPlan } from '@/hooks/usePlan';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { Loader2, CheckCircle, Clock } from 'lucide-react';
import Layout from '@/components/layout/UserLayout';

export default function MyPackagesPage() {
  const { t } = useTranslation();
  const { data: myPlans, isLoading, error } = useMyPlans();
  const { data: currentPlan } = useMyCurrentPlan();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 text-orange-500 animate-spin mr-2" />
        <span className="text-gray-700">{t('common.loading')}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-600">{t('common.error')}</div>
    );
  }

  const plans = myPlans || [];

  return (
    <Layout>
      <div className="max-w-6xl mx-auto py-10 px-4 space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('home.my_subscription_plans') || 'My Subscription Plans'}
          </h1>
          {currentPlan && (
            <p className="text-gray-600 text-sm">
              {t('home.current_plan') || 'Current Plan:'}{' '}
              <span className="font-semibold text-orange-600">{currentPlan.plan?.name}</span>
            </p>
          )}
        </div>

        {plans.length === 0 ? (
          <Card className="text-center py-10">
            <CardContent className="text-gray-600">
              {t('admin.no_plans') || 'No subscription plans found.'}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {plans.map((up) => {
              const isCurrent = currentPlan?.plan?.id === up.plan.id;
              const isExpired = !up.isActive;

              return (
                <Card
                  key={up.id}
                  className={`flex flex-col justify-between border-2 transition-all duration-300 rounded-2xl shadow-sm hover:shadow-lg hover:scale-[1.02] ${
                    isCurrent
                      ? 'border-orange-500 bg-orange-50/30'
                      : isExpired
                        ? 'border-gray-200'
                        : 'border-green-300 bg-green-50/30'
                  }`}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <CardTitle className="text-lg font-semibold text-gray-900">
                          {up.plan.name}
                        </CardTitle>
                        {up.plan.description && (
                          <p className="text-sm text-gray-600">{up.plan.description}</p>
                        )}
                      </div>
                      <div className="mt-1 flex justify-end">
                        <Button
                          variant={up.isActive ? 'success' : 'outline'}
                          size="sm"
                          className="flex items-center gap-1"
                        >
                          {up.isActive ? (
                            <>
                              <CheckCircle className="w-4 h-4" />
                              Active
                            </>
                          ) : (
                            <>
                              <Clock className="w-4 h-4" />
                              Expired
                            </>
                          )}
                        </Button>
                      </div>
                    </div>

                    <p className="text-3xl font-bold text-gray-900 mt-3">
                      {up.plan.price.toLocaleString()}₫
                      <span className="text-sm font-normal text-gray-500 ml-1">
                        /{up.plan.durationDays} days
                      </span>
                    </p>
                  </CardHeader>

                  <CardContent className="space-y-4 flex flex-col flex-1 justify-between">
                    <div className="space-y-1 text-sm text-gray-700">
                      <p className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-gray-500" />
                        <span>
                          <span className="font-medium">Start:</span>{' '}
                          {new Date(up.startDate).toLocaleDateString()}
                        </span>
                      </p>
                      <p className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-gray-500" />
                        <span>
                          <span className="font-medium">End:</span>{' '}
                          {new Date(up.endDate).toLocaleDateString()}
                        </span>
                      </p>
                    </div>

                    <div>
                      <div className="text-sm font-medium text-gray-800 mb-1">
                        {t('admin.features')}:
                      </div>
                      <ul className="text-sm text-gray-700 list-disc pl-5 space-y-0.5">
                        {up.plan.features.map((f, idx) => (
                          <li key={idx}>{f}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
