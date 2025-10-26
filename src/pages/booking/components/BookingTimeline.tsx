import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface BookingTimelineProps {
  currentStep: number;
}

export const BookingTimeline = ({ currentStep }: BookingTimelineProps) => {
  const { t } = useTranslation();
  const steps = [
    {
      id: 1,
      title: t('booking.timeline.step1.title'),
      description: t('booking.timeline.step1.description'),
    },
    {
      id: 2,
      title: t('booking.timeline.step2.title'),
      description: t('booking.timeline.step2.description'),
    },
    {
      id: 3,
      title: t('booking.timeline.step3.title'),
      description: t('booking.timeline.step3.description'),
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto mb-8 px-4 sm:px-6 lg:px-8">
      <div className="relative">
        {/* Progress line */}
        <div className="absolute top-6 left-8 right-8 h-0.5 bg-gray-200 -z-10 hidden sm:block">
          <div
            className="h-full bg-orange-500 transition-all duration-300 ease-in-out"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {/* Mobile progress line */}
        <div className="absolute top-6 left-4 right-4 h-0.5 bg-gray-200 -z-10 sm:hidden">
          <div
            className="h-full bg-orange-500 transition-all duration-300 ease-in-out"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />
        </div>

        <div className="flex items-start justify-between relative">
          {steps.map((step) => {
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;
            const isUpcoming = currentStep < step.id;

            return (
              <div key={step.id} className="flex flex-col items-center relative z-10 flex-1">
                {/* Step circle */}
                <div
                  className={cn(
                    'w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 relative',
                    isCompleted && 'bg-orange-500 border-orange-500 text-white',
                    isCurrent &&
                      'bg-white border-orange-500 text-orange-500 shadow-lg ring-4 ring-orange-100',
                    isUpcoming && 'bg-white border-gray-300 text-gray-400',
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5 sm:w-6 sm:h-6" />
                  ) : (
                    <span className="text-sm font-semibold">{step.id}</span>
                  )}
                </div>

                {/* Step content */}
                <div className="mt-3 text-center max-w-28 sm:max-w-32 lg:max-w-36 px-1">
                  <h3
                    className={cn(
                      'text-xs sm:text-sm font-semibold transition-colors duration-300 leading-tight',
                      isCompleted && 'text-orange-600',
                      isCurrent && 'text-orange-600',
                      isUpcoming && 'text-gray-500',
                    )}
                  >
                    {step.title}
                  </h3>
                  <p
                    className={cn(
                      'text-xs mt-1 transition-colors duration-300 leading-tight hidden sm:block',
                      isCompleted && 'text-gray-600',
                      isCurrent && 'text-gray-700',
                      isUpcoming && 'text-gray-400',
                    )}
                  >
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
