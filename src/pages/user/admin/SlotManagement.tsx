import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { useCreateSlot, useUpdateSlot, useDeleteSlot, useSlotsByLawyer } from '@/hooks/useSlot';
import { useLawyers } from '@/hooks/useUser';
import { serviceService } from '@/services/serviceService';
import Layout from '@/components/layout/UserLayout';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import type { Slot, CreateSlotPayload } from '@/services/slotService';

export default function SlotManagement() {
  const { t } = useTranslation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<Slot | null>(null);
  const [selectedLawyerId, setSelectedLawyerId] = useState<string>('');
  const [formData, setFormData] = useState<CreateSlotPayload>({
    serviceId: '',
    lawyerId: '',
    date: '',
    startTime: '',
    endTime: '',
    status: 'available',
  });

  // Fetch services and lawyers
  const { data: servicesData } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const response = await serviceService.getAll();
      return response.data.data;
    },
  });

  const { data: lawyersData, isLoading: isLoadingLawyers } = useLawyers();

  // Fetch slots by lawyer
  const { data: slotsData, isLoading: isLoadingSlots, error } = useSlotsByLawyer(selectedLawyerId);

  // Mutations
  const createMutation = useCreateSlot();
  const updateMutation = useUpdateSlot();
  const deleteMutation = useDeleteSlot();

  const handleOpenDialog = (slot?: Slot) => {
    if (slot) {
      setEditingSlot(slot);
      setFormData({
        serviceId: slot.serviceId,
        lawyerId: slot.lawyerId,
        date: slot.date.split('T')[0],
        startTime: slot.startTime,
        endTime: slot.endTime,
        status: slot.status,
      });
    } else {
      setEditingSlot(null);
      setFormData({
        serviceId: '',
        lawyerId: selectedLawyerId || '',
        date: '',
        startTime: '',
        endTime: '',
        status: 'available',
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingSlot(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSlot) {
        await updateMutation.mutateAsync({
          slotId: editingSlot.id,
          data: formData,
        });
        toast.success(t('admin.slot_updated'));
      } else {
        await createMutation.mutateAsync(formData);
        toast.success(t('admin.slot_created'));
      }
      handleCloseDialog();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t('admin.operation_failed'));
    }
  };

  const handleDelete = async (slotId: string) => {
    if (confirm(t('admin.delete_confirm'))) {
      try {
        await deleteMutation.mutateAsync(slotId);
        toast.success(t('admin.slot_deleted'));
      } catch (error) {
        toast.error(error instanceof Error ? error.message : t('admin.delete_slot_failed'));
      }
    }
  };

  const slots = slotsData?.data || [];

  return (
    <Layout>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{t('admin.slot_management')}</h1>
            <p className="text-sm text-muted-foreground">{t('admin.slot_management_desc')}</p>
          </div>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="mr-2 h-4 w-4" />
            {t('admin.add_slot')}
          </Button>
        </div>

        {/* Lawyer Selector */}
        <div className="rounded-md border p-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>{t('admin.lawyer')}</Label>
              <Select value={selectedLawyerId} onValueChange={setSelectedLawyerId}>
                <SelectTrigger>
                  <SelectValue placeholder={t('admin.select_lawyer')} />
                </SelectTrigger>
                <SelectContent>
                  {isLoadingLawyers ? (
                    <div className="p-2 text-sm text-muted-foreground">
                      {t('admin.loading_lawyers')}
                    </div>
                  ) : (
                    lawyersData?.map((lawyer) => (
                      <SelectItem key={lawyer.id} value={lawyer.id}>
                        {lawyer.fullName} ({lawyer.email})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">{t('admin.choose_lawyer_desc')}</p>
            </div>
          </div>
        </div>

        {/* Slots Table */}
        {isLoadingSlots && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {error && (
          <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
            {t('common.error')}:{' '}
            {error instanceof Error ? error.message : t('common.unknown_error')}
          </div>
        )}

        {!selectedLawyerId && (
          <div className="rounded-md border border-dashed p-8 text-center">
            <p className="text-sm text-muted-foreground">{t('admin.select_lawyer_to_manage')}</p>
          </div>
        )}

        {selectedLawyerId && slots.length === 0 && !isLoadingSlots && (
          <div className="rounded-md border border-dashed p-8 text-center">
            <p className="text-sm text-muted-foreground">{t('admin.no_slots')}</p>
          </div>
        )}

        {slots.length > 0 && (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('admin.service')}</TableHead>
                  <TableHead>{t('common.date')}</TableHead>
                  <TableHead>{t('common.time')}</TableHead>
                  <TableHead>{t('common.status')}</TableHead>
                  <TableHead className="text-right">{t('common.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {slots.map((slot) => (
                  <TableRow key={slot.id}>
                    <TableCell>{slot.service?.name || slot.serviceId}</TableCell>
                    <TableCell>{new Date(slot.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {slot.startTime} - {slot.endTime}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                          slot.status === 'available'
                            ? 'bg-green-100 text-green-800'
                            : slot.status === 'booked'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {t(`admin.${slot.status}`)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(slot)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(slot.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingSlot ? t('admin.edit_slot') : t('admin.create_slot')}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Service */}
            <div className="space-y-2">
              <Label>{t('admin.service')}</Label>
              <Select
                value={formData.serviceId}
                onValueChange={(value) => setFormData({ ...formData, serviceId: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('admin.select_service')} />
                </SelectTrigger>
                <SelectContent>
                  {servicesData?.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name} - ${service.price}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Lawyer */}
            <div className="space-y-2">
              <Label>{t('admin.lawyer')}</Label>
              <Select
                value={formData.lawyerId}
                onValueChange={(value) => setFormData({ ...formData, lawyerId: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('admin.select_lawyer')} />
                </SelectTrigger>
                <SelectContent>
                  {lawyersData?.map((lawyer) => (
                    <SelectItem key={lawyer.id} value={lawyer.id}>
                      {lawyer.fullName} ({lawyer.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label>{t('common.date')}</Label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>

            {/* Time */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t('admin.start_time')}</Label>
                <Input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>{t('admin.end_time')}</Label>
                <Input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label>{t('common.status')}</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">{t('admin.available')}</SelectItem>
                  <SelectItem value="booked">{t('admin.booked')}</SelectItem>
                  <SelectItem value="cancelled">{t('admin.cancelled')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Footer */}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                {t('common.cancel')}
              </Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {createMutation.isPending || updateMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('common.saving')}
                  </>
                ) : (
                  <>{editingSlot ? t('common.update') : t('common.create')}</>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
