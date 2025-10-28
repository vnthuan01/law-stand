import React, { useState } from 'react';
import { Plus, Edit, Trash2, Power, PowerOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  usePlans,
  useCreatePlan,
  useUpdatePlan,
  useDeletePlan,
  useActivatePlan,
  useDeactivatePlan,
} from '@/hooks/usePlan';
import { useTranslation } from 'react-i18next';
import { type Plan, type CreatePlanPayload, type UpdatePlanPayload } from '@/services/planService';
// import { toast } from 'sonner';
import Layout from '@/components/layout/UserLayout';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const PlanManagement = () => {
  const { t } = useTranslation();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState<boolean | undefined>(undefined);

  // Form states
  const [formData, setFormData] = useState<CreatePlanPayload>({
    name: '',
    description: '',
    price: 0,
    durationDays: 30,
    features: [''],
    isPopular: false,
  });

  // Queries and mutations
  const { data: plansData, isLoading } = usePlans();
  const createPlanMutation = useCreatePlan();
  const updatePlanMutation = useUpdatePlan();
  const deletePlanMutation = useDeletePlan();
  const activatePlanMutation = useActivatePlan();
  const deactivatePlanMutation = useDeactivatePlan();

  const plans = plansData || plansData || [];

  // Filter plans
  const filteredPlans = plans.filter((plan: Plan) => {
    const matchesSearch =
      plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesActive = filterActive === undefined || plan.isActive === filterActive;
    return matchesSearch && matchesActive;
  });

  const handleCreatePlan = async () => {
    try {
      await createPlanMutation.mutateAsync(formData);
      setIsCreateDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Failed to create plan:', error);
    }
  };

  const handleUpdatePlan = async () => {
    if (!selectedPlan) return;

    try {
      const updatePayload: UpdatePlanPayload = {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        durationDays: formData.durationDays,
        features: formData.features,
        isPopular: formData.isPopular,
      };

      await updatePlanMutation.mutateAsync({ id: selectedPlan.id, payload: updatePayload });
      setIsEditDialogOpen(false);
      setSelectedPlan(null);
      resetForm();
    } catch (error) {
      console.error('Failed to update plan:', error);
    }
  };

  const handleDeletePlan = async (planId: string) => {
    try {
      await deletePlanMutation.mutateAsync(planId);
    } catch (error) {
      console.error('Failed to delete plan:', error);
    }
  };

  const handleToggleActive = async (plan: Plan) => {
    try {
      if (plan.isActive) {
        await deactivatePlanMutation.mutateAsync(plan.id);
      } else {
        await activatePlanMutation.mutateAsync(plan.id);
      }
    } catch (error) {
      console.error('Failed to toggle plan status:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      durationDays: 30,
      features: [''],
      isPopular: false,
    });
  };

  const openEditDialog = (plan: Plan) => {
    setSelectedPlan(plan);
    setFormData({
      name: plan.name,
      description: plan.description || '',
      price: plan.price,
      durationDays: plan.durationDays,
      features: plan.features.length > 0 ? plan.features : [''],
      isPopular: plan.isPopular || false,
    });
    setIsEditDialogOpen(true);
  };

  const addFeature = () => {
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, ''],
    }));
  };

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const updateFeature = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.map((feature, i) => (i === index ? value : feature)),
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">{t('common.loading')}</div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('admin.plan_management')}</h1>
            <p className="text-gray-600">{t('admin.plan_management_desc')}</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="w-4 h-4 mr-2" />
                {t('admin.add_plan')}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{t('admin.create_plan')}</DialogTitle>
              </DialogHeader>
              <PlanForm
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleCreatePlan}
                onCancel={() => setIsCreateDialogOpen(false)}
                addFeature={addFeature}
                removeFeature={removeFeature}
                updateFeature={updateFeature}
                isLoading={createPlanMutation.isPending}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="search">{t('common.search')}</Label>
                <Input
                  id="search"
                  placeholder={t('admin.search_plans')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="status">{t('common.status')}</Label>
                <Select
                  value={filterActive === undefined ? 'all' : filterActive.toString()}
                  onValueChange={(value) =>
                    setFilterActive(value === 'all' ? undefined : value === 'true')
                  }
                >
                  <SelectTrigger className="w-full border border-gray-300 rounded-md">
                    <SelectValue placeholder={t('common.view_all')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('common.view_all')}</SelectItem>
                    <SelectItem value="true">{t('admin.active')}</SelectItem>
                    <SelectItem value="false">{t('admin.inactive')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button
                  variant="destructive"
                  onClick={() => {
                    setSearchTerm('');
                    setFilterActive(undefined);
                  }}
                >
                  {t('common.clear')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlans.map((plan: Plan) => (
            <Card
              key={plan.id}
              className={`flex flex-col h-full justify-between transition-all ${
                plan.isPopular ? 'ring-2 ring-orange-500 py-2' : 'py-2'
              }`}
            >
              <div>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <CardTitle className="text-lg">{plan.name}</CardTitle>
                      {plan.isPopular && (
                        <Badge variant="secondary" className="mt-1 bg-orange-100 text-orange-800">
                          {t('admin.popular')}
                        </Badge>
                      )}
                    </div>
                    <Badge variant={plan.isActive ? 'success' : 'secondary'}>
                      {plan.isActive ? t('admin.active') : t('admin.inactive')}
                    </Badge>
                  </div>

                  <p className="text-2xl font-bold text-gray-900">
                    {plan.price.toLocaleString()}đ
                    <span className="text-sm font-normal text-gray-500">
                      /{plan.durationDays} days
                    </span>
                  </p>
                  {plan.description && <p className="text-sm text-gray-600">{plan.description}</p>}
                </CardHeader>

                <CardContent className="flex-grow">
                  <div className="space-y-2 mb-4">
                    <h4 className="font-medium text-sm text-gray-700">{t('admin.features')}:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </div>
              <div className="mt-auto border-t pt-3 px-4 pb-4 flex space-x-2">
                <Button size="sm" variant="primary" onClick={() => openEditDialog(plan)}>
                  <Edit className="w-4 h-4 mr-1" />
                  {t('common.edit')}
                </Button>

                <Button
                  size="sm"
                  variant={plan.isActive ? 'destructive' : 'success'}
                  onClick={() => handleToggleActive(plan)}
                  disabled={activatePlanMutation.isPending || deactivatePlanMutation.isPending}
                  className="flex items-center"
                >
                  {plan.isActive ? (
                    <>
                      <PowerOff className="w-4 h-4 mr-1" />
                      {t('admin.deactivate')}
                    </>
                  ) : (
                    <>
                      <Power className="w-4 h-4 mr-1" />
                      {t('admin.activate')}
                    </>
                  )}
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="dashed">
                      <Trash2 className="w-4 h-4 mr-1" />
                      {t('common.delete')}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t('admin.delete_plan')}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {t('admin.delete_plan_confirm')}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeletePlan(plan.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        {t('common.delete')}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </Card>
          ))}
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{t('admin.edit_plan')}</DialogTitle>
            </DialogHeader>
            <PlanForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleUpdatePlan}
              onCancel={() => {
                setIsEditDialogOpen(false);
                setSelectedPlan(null);
              }}
              addFeature={addFeature}
              removeFeature={removeFeature}
              updateFeature={updateFeature}
              isLoading={updatePlanMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

// Plan Form Component
interface PlanFormProps {
  formData: CreatePlanPayload;
  setFormData: React.Dispatch<React.SetStateAction<CreatePlanPayload>>;
  onSubmit: () => void;
  onCancel: () => void;
  addFeature: () => void;
  removeFeature: (index: number) => void;
  updateFeature: (index: number, value: string) => void;
  isLoading: boolean;
}

const PlanForm: React.FC<PlanFormProps> = ({
  formData,
  setFormData,
  onSubmit,
  onCancel,
  addFeature,
  removeFeature,
  updateFeature,
  isLoading,
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">{t('admin.plan_name')} *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            placeholder={t('admin.plan_name_placeholder')}
          />
        </div>
        <div>
          <Label htmlFor="price">{t('admin.plan_price')} *</Label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            onChange={(e) => setFormData((prev) => ({ ...prev, price: Number(e.target.value) }))}
            placeholder="0"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="duration">{t('admin.plan_duration')} *</Label>
          <Input
            id="duration"
            type="number"
            value={formData.durationDays}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, durationDays: Number(e.target.value) }))
            }
            placeholder="30"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="popular"
            checked={formData.isPopular}
            onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isPopular: checked }))}
          />
          <Label htmlFor="popular">{t('admin.mark_popular')}</Label>
        </div>
      </div>

      <div>
        <Label htmlFor="description">{t('admin.plan_description')}</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          placeholder={t('admin.plan_description_placeholder')}
        />
      </div>

      <div>
        <Label>{t('admin.plan_features')} *</Label>
        <div className="space-y-2">
          {formData.features.map((feature, index) => (
            <div key={index} className="flex space-x-2">
              <Input
                value={feature}
                onChange={(e) => updateFeature(index, e.target.value)}
                placeholder={t('admin.feature_placeholder')}
              />
              {formData.features.length > 1 && (
                <Button
                  type="button"
                  variant="destructive"
                  size="md"
                  onClick={() => removeFeature(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={addFeature}>
            <Plus className="w-4 h-4 mr-2" />
            {t('admin.add_feature')}
          </Button>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          {t('common.cancel')}
        </Button>
        <Button onClick={onSubmit} disabled={isLoading} variant={'primary'}>
          {isLoading ? t('common.saving') : t('common.save')}
        </Button>
      </div>
    </div>
  );
};

export default PlanManagement;
