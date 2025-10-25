import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { useCreateSlot, useUpdateSlot, useDeleteSlot, useSlotsByLawyer } from '@/hooks/useSlot';
import { useUsers } from '@/hooks/useUser';
import { serviceService } from '@/services/serviceService';
import Layout from '@/components/layout/UserLayout';
import { Button } from '@/components/ui/button';
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
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { SlotEditForm } from './components/SlotEditForm';
import { SlotCreateForm } from './components/SlotCreateForm';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Loader2, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import type { Slot, CreateSlotPayload } from '@/services/slotService';

export default function SlotManagement() {
  const { t } = useTranslation();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<Slot | null>(null);
  const [selectedLawyerId, setSelectedLawyerId] = useState<string>('');
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  // Fetch services and lawyers
  const { data: servicesData } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const response = await serviceService.getAll();
      return response.data.data;
    },
  });

  const { data: lawyersData, isLoading: isLoadingLawyers } = useUsers({ role: 2 });

  // Fetch slots by lawyer with date range
  const {
    data: slotsData,
    isLoading: isLoadingSlots,
    error,
  } = useSlotsByLawyer(
    selectedLawyerId,
    startDate.toISOString().split('T')[0],
    endDate?.toISOString().split('T')[0],
  );

  // Mutations
  const createMutation = useCreateSlot();
  const updateMutation = useUpdateSlot();
  const deleteMutation = useDeleteSlot();

  const handleOpenCreateDialog = () => {
    setIsCreateDialogOpen(true);
  };

  const handleOpenEditDialog = (slot: Slot) => {
    setEditingSlot(slot);
    setIsEditDialogOpen(true);
  };

  const handleCloseCreateDialog = () => {
    setIsCreateDialogOpen(false);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setEditingSlot(null);
  };

  const handleCreateSlot = async (data: CreateSlotPayload) => {
    try {
      await createMutation.mutateAsync(data);
      toast.success(t('admin.slot_created'));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t('admin.operation_failed'));
      throw error;
    }
  };

  const handleUpdateSlot = async (slotId: string, data: { status: string }) => {
    try {
      await updateMutation.mutateAsync({
        slotId,
        data,
      });
      toast.success(t('admin.slot_updated'));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t('admin.operation_failed'));
      throw error;
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
          <Button onClick={handleOpenCreateDialog}>
            <Plus className="mr-2 h-4 w-4" />
            {t('admin.add_slot')}
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('admin.filters')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {/* Lawyer Selector */}
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
                      lawyersData?.data?.data?.map((lawyer) => (
                        <SelectItem key={lawyer.id} value={lawyer.id}>
                          {lawyer.fullName} ({lawyer.email})
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">{t('admin.choose_lawyer_desc')}</p>
              </div>

              {/* Start Date */}
              <div className="space-y-2">
                <Label>{t('admin.start_date')}</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !startDate && 'text-muted-foreground',
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? (
                        format(startDate, 'dd/MM/yyyy', { locale: vi })
                      ) : (
                        <span>{t('admin.pick_date')}</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={(date) => date && setStartDate(date)}
                      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <p className="text-xs text-muted-foreground">{t('admin.start_date_desc')}</p>
              </div>

              {/* End Date */}
              <div className="space-y-2">
                <Label>{t('admin.end_date')}</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !endDate && 'text-muted-foreground',
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? (
                        format(endDate, 'dd/MM/yyyy', { locale: vi })
                      ) : (
                        <span>{t('admin.pick_date')}</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      disabled={(date) => date < startDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <p className="text-xs text-muted-foreground">{t('admin.end_date_desc')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

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
                              : slot.status === 'cancelled'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {t(`admin.${slot.status}`)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenEditDialog(slot)}
                        >
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

      {/* Create Dialog */}
      <SlotCreateForm
        isOpen={isCreateDialogOpen}
        onClose={handleCloseCreateDialog}
        onCreate={handleCreateSlot}
        isCreating={createMutation.isPending}
        servicesData={servicesData}
        lawyersData={lawyersData?.data?.data}
        selectedLawyerId={selectedLawyerId}
      />

      {/* Edit Dialog */}
      {editingSlot && (
        <SlotEditForm
          slot={editingSlot}
          isOpen={isEditDialogOpen}
          onClose={handleCloseEditDialog}
          onUpdate={handleUpdateSlot}
          isUpdating={updateMutation.isPending}
        />
      )}
    </Layout>
  );
}
