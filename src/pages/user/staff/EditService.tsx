'use client';

import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { addServiceSchema } from '@/lib/schema';
import { Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';
import { Separator } from '@/components/ui/separator';
import { useLawService, useLawServiceById } from '@/hooks/useLawService';
import Layout from '@/components/layout/UserLayout';
import { CurrencyInputController } from './components/CurrencyInput';
import { PricePreview } from './AddServicePage';

export type EditServiceFormValues = z.infer<typeof addServiceSchema>;

// ---------- Options ----------
const RELATED_PARTY_OPTIONS = [
  { label: 'Individuals', value: 'individuals' },
  { label: 'Businesses / SMEs', value: 'businesses' },
  { label: 'Startups', value: 'startups' },
  { label: 'Investors', value: 'investors' },
  { label: 'Courts / Arbitration', value: 'courts' },
  { label: 'Real Estate / Construction', value: 'real_estate' },
  { label: 'Labor / Employment', value: 'labor' },
  { label: 'Family / Marriage', value: 'family' },
];

export default function EditService() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const { updateLawService } = useLawService();
  const navigate = useNavigate();

  const { data: service, isLoading } = useLawServiceById(serviceId!);

  const form = useForm<EditServiceFormValues>({
    resolver: zodResolver(addServiceSchema) as any,
    mode: 'onChange',
    defaultValues: {
      name: '',
      description: '',
      standardPrice: 0,
      salePrice: undefined,
      relatedParties: '',
      isMainService: false,
    },
  });

  const { register, control, setValue, clearErrors, watch, reset, formState } = form;
  const isMain = watch('isMainService');
  const standard = watch('standardPrice');
  const sale = watch('salePrice');

  // Load data từ API
  useEffect(() => {
    if (service) {
      reset(service);
    }
  }, [service, reset]);

  const onSubmit: SubmitHandler<EditServiceFormValues> = async (data) => {
    const payload = {
      ...data,
      salePrice: data.salePrice ?? Math.round(data.standardPrice * 0.9),
    };

    try {
      await updateLawService.mutateAsync({ id: serviceId!, ...payload });
      toast.success('Service has been updated successfully!');
      navigate('/staff/services');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update service');
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="p-6 text-gray-500">Loading service...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-3xl font-bold tracking-tight">Edit Service</h1>
        <p className="text-muted-foreground">Update the details of your legal service</p>
      </div>
      <Separator />

      {/* Form */}
      <div className="p-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main content */}
            <div className="space-y-6 lg:col-span-2">
              <div
                className={cn(
                  'space-y-6 rounded-lg border p-6 shadow-sm transition',
                  isMain && 'border-primary ring-2 ring-primary/30',
                )}
              >
                {/* Service Info */}
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Service Information</h2>
                  <Controller
                    control={control}
                    name="isMainService"
                    render={({ field }) => (
                      <label className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(v) => field.onChange(Boolean(v))}
                          className="border-2 border-gray-700 data-[state=checked]:bg-black data-[state=checked]:border-black focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black"
                        />
                        <span className="text-sm">Highlight as Main Service</span>
                      </label>
                    )}
                  />
                </div>

                <Separator />

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium">Name</label>
                  <p className="text-xs text-muted-foreground mb-1">
                    The official title of the legal service.
                  </p>
                  <Input
                    {...register('name')}
                    placeholder="Enter service name"
                    className="mt-1 w-full focus:bg-gray-50"
                  />
                  {formState.errors.name && (
                    <p className="mt-1 text-sm text-red-600">{formState.errors.name.message}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium">Description</label>
                  <p className="text-xs text-muted-foreground mb-1">
                    Provide a clear and concise explanation of what the service includes.
                  </p>
                  <Textarea
                    {...register('description')}
                    rows={4}
                    placeholder="Describe the service"
                    className="mt-1 w-full focus:bg-gray-50"
                  />
                  {formState.errors.description && (
                    <p className="mt-1 text-sm text-red-600">
                      {formState.errors.description.message}
                    </p>
                  )}
                </div>

                {/* Related Parties */}
                <div>
                  <label className="block text-sm font-medium">Related Parties</label>
                  <p className="text-xs text-muted-foreground mb-1">
                    Select the type of client or stakeholder this service is most relevant to.
                  </p>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className={cn(
                          'mt-1 w-full rounded-md border px-3 py-2 text-left transition focus:bg-gray-50',
                          watch('relatedParties')
                            ? 'bg-gray-100 text-gray-700'
                            : 'bg-white text-muted-foreground',
                        )}
                      >
                        {watch('relatedParties')
                          ? RELATED_PARTY_OPTIONS.find((o) => o.value === watch('relatedParties'))
                              ?.label
                          : 'Select related party'}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                      <Command>
                        <CommandInput placeholder="Search party..." />
                        <CommandList>
                          <CommandEmpty>No result found.</CommandEmpty>
                          <CommandGroup>
                            {RELATED_PARTY_OPTIONS.map((opt) => (
                              <CommandItem
                                key={opt.value}
                                value={opt.label}
                                onSelect={() => {
                                  setValue('relatedParties', opt.value, {
                                    shouldValidate: true,
                                    shouldDirty: true,
                                  });
                                  clearErrors('relatedParties');
                                }}
                              >
                                {opt.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  {formState.errors.relatedParties && (
                    <p className="mt-1 text-sm text-red-600">
                      {formState.errors.relatedParties.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-6 rounded-lg border p-6 shadow-sm">
                <h2 className="text-xl font-semibold">Pricing</h2>
                {/* standardPrice */}
                <CurrencyInputController
                  control={control}
                  name="standardPrice"
                  label="Standard Price (VNĐ)"
                  requiredZero={true}
                  error={formState.errors.standardPrice?.message as string}
                />

                {/* salePrice */}
                <CurrencyInputController
                  control={control}
                  name="salePrice"
                  label="Sale Price (VNĐ)"
                  placeholder="Sale is empty"
                  requiredZero={false}
                  error={formState.errors.salePrice?.message as string}
                />
                <p className="mt-1 text-sm text-muted-foreground">
                  Leave empty means no sale applied
                </p>
                {/* Price preview */}
                <PricePreview standard={standard} sale={sale} />
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full"
                disabled={updateLawService.isPending || !formState.isValid}
              >
                {updateLawService.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Update Service
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
}
