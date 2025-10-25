import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { UserForm } from '@/hooks/useInformationForm';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const BookingStepTwo = ({
  serviceId,
  selectedDate,
  selectedTimeSlot,
  duration,
  selectedLocation,
  userInfo,
  setUserInfo,
  agree,
  setAgree,
  onBack,
  onConfirm,
}: any) => {
  const { t } = useTranslation();
  const [hostQuery, setHostQuery] = useState('');
  const [selectedHost, setSelectedHost] = useState<any | null>(null);
  const [hostDetail, setHostDetail] = useState<any | null>(null);
  const [isHostDialogOpen, setIsHostDialogOpen] = useState(false);
  const [isHostPickerOpen, setIsHostPickerOpen] = useState(false);

  // MOCK DATA: In a real application, this data should be fetched from a backend and internationalized.
  const allHosts = useMemo(
    () => [
      {
        id: 'h1',
        name: 'Nguyen Van An',
        title: 'Senior Immigration Lawyer',
        rating: 4.9,
        services: ['01', '03'],
        bio: '15+ years in immigration and family law, trusted by 500+ clients.',
        certificates: ['LL.M. (Harvard)', 'Vietnam Bar Certificate', 'Immigration Law Cert.'],
        experienceYears: 15,
        age: 42,
        traits: ['Empathetic', 'Detail-oriented', 'Bilingual (EN/VN)'],
        hobbies: ['Running', 'Travel', 'Mentoring juniors'],
        gender: 'male',
      },
      {
        id: 'h2',
        name: 'Tran Thi Binh',
        title: 'Business & Tax Attorney',
        rating: 4.8,
        services: ['04'],
        bio: 'Expert in property rights and inheritance dispute resolution.',
        certificates: ['LL.B. (HCMC Law University)', 'Notary Certification'],
        experienceYears: 12,
        age: 38,
        traits: ['Calm', 'Analytical', 'Practical'],
        hobbies: ['Gardening', 'Classical music'],
        gender: 'female',
      },
      // ... more mock data
    ],
    [],
  );

  const hostOptions = useMemo(() => {
    const byService = serviceId
      ? allHosts.filter((h) => h.services.includes(String(serviceId)))
      : allHosts;
    if (!hostQuery) return byService;
    const q = hostQuery.toLowerCase();
    return byService.filter((h) => h.name.toLowerCase().includes(q));
  }, [allHosts, hostQuery, serviceId]);

  const handleConfirm = () => {
    onConfirm?.({
      serviceId,
      selectedDate,
      selectedTimeSlot,
      duration,
      selectedLocation,
      hostId: selectedHost?.id ?? null,
      hostName: selectedHost?.name ?? null,
      selectedHost,
      userInfo,
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Booking Summary */}
      <h2 className="font-bold text-lg">{t('booking.stepTwo.bookingSummary')}</h2>
      <Card className="bg-slate-50">
        <CardContent className="p-6 text-sm grid md:grid-cols-2 divide-x divide-gray-200 gap-6">
          {/* Left Column */}
          <div className="space-y-3">
            <div>
              <p className="text-gray-500 text-sm">{t('booking.stepTwo.appointment')}</p>
              <p className="font-semibold">{selectedDate?.toLocaleDateString('en-GB')}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">{t('booking.stepTwo.date')}</p>
              <p className="font-semibold">
                {selectedDate?.toLocaleDateString('en-EN', {
                  weekday: 'long',
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">{t('booking.stepTwo.time')}</p>
              <p className="font-semibold">{selectedTimeSlot}</p>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-3 ">
            <div>
              <p className="text-gray-500 text-sm">{t('booking.stepTwo.host')}</p>
              <Popover open={isHostPickerOpen} onOpenChange={setIsHostPickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-12 justify-between"
                    aria-label="Open host selector"
                  >
                    {selectedHost ? (
                      <span className="truncate text-left">
                        {selectedHost.name}
                        <span className="block text-xs text-gray-500">{selectedHost.title}</span>
                      </span>
                    ) : (
                      <span className="text-gray-500">{t('booking.stepTwo.selectAHost')}</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-[320px]">
                  <Command>
                    <CommandInput
                      placeholder={t('booking.stepTwo.searchHost')}
                      value={hostQuery}
                      onValueChange={setHostQuery}
                    />
                    <CommandList>
                      <CommandEmpty>{t('booking.stepTwo.noHostsFound')}</CommandEmpty>
                      <CommandGroup heading={t('booking.stepTwo.suggested')}>
                        {hostOptions.map((h) => (
                          <CommandItem
                            key={h.id}
                            value={`${h.name} ${h.title}`}
                            onSelect={() => {
                              setSelectedHost(h);
                              setIsHostPickerOpen(false);
                            }}
                            className="flex items-center justify-between gap-2"
                          >
                            <div>
                              <p className="text-sm font-medium">{h.name}</p>
                              <p className="text-xs text-gray-500">
                                {h.title} • ⭐ {h.rating}
                              </p>
                            </div>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setHostDetail(h);
                                setIsHostDialogOpen(true);
                              }}
                            >
                              {t('booking.stepTwo.detail')}
                            </Button>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid md:grid-cols-2">
              <div>
                <p className="text-gray-500 text-sm">{t('booking.stepTwo.duration')}</p>
                <p className="font-semibold">
                  {duration ? `${duration} ${t('booking.stepTwo.minutes')}` : '-'}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">{t('booking.stepTwo.location')}</p>
                <p className="font-semibold">{selectedLocation}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Info */}
      <h2 className="font-bold text-lg">{t('booking.stepTwo.yourInformation')}</h2>
      <UserForm userInfo={userInfo} setUserInfo={setUserInfo} />

      {/* Agree */}
      <div className="flex items-start gap-2 text-sm text-gray-600">
        <input
          type="checkbox"
          checked={agree}
          onChange={(e) => setAgree(e.target.checked)}
          className="mt-1"
        />
        <span>{t('booking.stepTwo.agreeMessage')}</span>
      </div>

      {/* Buttons */}
      <div className="flex justify-between gap-2 mt-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
          {t('common.back')}
        </Button>
        <Button
          className="bg-blue-600 text-white hover:bg-blue-700"
          disabled={!agree}
          onClick={handleConfirm}
        >
          {t('booking.stepTwo.confirmBooking')}
        </Button>
      </div>
      <Dialog open={isHostDialogOpen} onOpenChange={setIsHostDialogOpen}>
        <DialogContent aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>{hostDetail?.name ?? t('booking.stepTwo.hostDetail')}</DialogTitle>
            {hostDetail?.title ? <DialogDescription>{hostDetail.title}</DialogDescription> : null}
          </DialogHeader>
          <div className="space-y-3 text-sm">
            {hostDetail?.rating ? (
              <p>
                {t('booking.stepTwo.rating')}: ⭐ {hostDetail.rating}
              </p>
            ) : null}
            {hostDetail?.bio ? <p className="text-gray-600">{hostDetail.bio}</p> : null}
            {hostDetail?.experienceYears ? (
              <p>
                {t('booking.stepTwo.experience')}: {hostDetail.experienceYears}{' '}
                {t('booking.stepTwo.years')}
              </p>
            ) : null}
            {hostDetail?.age ? (
              <p>
                {t('booking.stepTwo.age')}: {hostDetail.age}
              </p>
            ) : null}
            {hostDetail?.gender ? (
              <p>
                {t('booking.stepTwo.gender')}: {hostDetail.gender}
              </p>
            ) : null}
            {Array.isArray(hostDetail?.certificates) && hostDetail.certificates.length > 0 ? (
              <div>
                <p className="font-medium">{t('booking.stepTwo.certificates')}</p>
                <ul className="list-disc list-inside text-gray-700">
                  {hostDetail.certificates.map((c: string) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            {Array.isArray(hostDetail?.traits) && hostDetail.traits.length > 0 ? (
              <div>
                <p className="font-medium">{t('booking.stepTwo.traits')}</p>
                <div className="flex flex-wrap gap-2">
                  {hostDetail.traits.map((t: string) => (
                    <span key={t} className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
            {Array.isArray(hostDetail?.hobbies) && hostDetail.hobbies.length > 0 ? (
              <div>
                <p className="font-medium">{t('booking.stepTwo.hobbies')}</p>
                <div className="flex flex-wrap gap-2">
                  {hostDetail.hobbies.map((h: string) => (
                    <span key={h} className="px-2 py-0.5 rounded-full bg-orange-50 text-orange-700">
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
          <DialogFooter>
            <Button
              type="button"
              onClick={() => {
                if (hostDetail) setSelectedHost(hostDetail);
                setIsHostDialogOpen(false);
              }}
            >
              {t('booking.stepTwo.chooseThisHost')}
            </Button>
            <Button type="button" variant="outline" onClick={() => setIsHostDialogOpen(false)}>
              {t('common.close')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
