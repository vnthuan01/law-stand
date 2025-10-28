import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, MoreHorizontal, UserCheck, UserX, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge, type BadgeProps } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  useUserManagement,
  //   useUpdateUser,
  //   useDeleteUser,
  useActivateUser,
  useDeactivateUser,
} from '@/hooks/useUser';
import { UserDetailDialog } from './components/UserDetailDialog';
import { UserRegisterDialog } from './components/UserRegisterDialog';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import Layout from '@/components/layout/UserLayout';

export default function UserManagement() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false);

  const { data, isLoading, error, refetch } = useUserManagement({
    searchTerm: searchTerm || undefined,
    role: roleFilter && roleFilter !== 'all' ? parseInt(roleFilter) : undefined,
    isActive: statusFilter && statusFilter !== 'all' ? statusFilter === 'active' : undefined,
    sortBy,
    sortDescending: true,
    pageNumber: currentPage,
    pageSize,
  });

  //   const updateUserMutation = useUpdateUser();
  //   const deleteUserMutation = useDeleteUser();
  const activateUserMutation = useActivateUser();
  const deactivateUserMutation = useDeactivateUser();

  const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
    try {
      if (currentStatus) {
        // Deactivate user
        await deactivateUserMutation.mutateAsync(userId);
        toast.success(t('user_management.deactivate_success'));
      } else {
        // Activate user
        await activateUserMutation.mutateAsync(userId);
        toast.success(t('user_management.activate_success'));
      }
    } catch (e: any) {
      console.log(e.message.error);
      toast.error(t('user_management.toggle_error'));
    }
  };

  const handleActivateUser = async (userId: string) => {
    try {
      await activateUserMutation.mutateAsync(userId);
      toast.success(t('user_management.activate_success'));
    } catch (e: any) {
      console.log(e.message.error);
      toast.error(t('user_management.activate_error'));
    }
  };

  //   const handleDeleteUser = async (userId: string, userName: string) => {
  //     if (confirm(t('user_management.delete_confirm', { name: userName }))) {
  //       try {
  //         await deleteUserMutation.mutateAsync(userId);
  //         toast.success(t('user_management.delete_success'));
  //       } catch (error) {
  //         toast.error(t('user_management.delete_error'));
  //       }
  //     }
  //   };

  const handleViewDetails = (userId: string) => {
    setSelectedUserId(userId);
    setIsDetailDialogOpen(true);
  };

  const handleRegisterUser = () => {
    setIsRegisterDialogOpen(true);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (filterType: string, value: string) => {
    switch (filterType) {
      case 'role':
        setRoleFilter(value);
        break;
      case 'status':
        setStatusFilter(value);
        break;
      case 'sort':
        setSortBy(value);
        break;
    }
    setCurrentPage(1);
  };

  const getRoleDisplayName = (role: number) => {
    switch (role) {
      case 1:
        return t('user_management.customer');
      case 2:
        return t('user_management.lawyer');
      case 3:
        return t('user_management.admin');
      default:
        return t('user_management.customer');
    }
  };

  const getRoleBadgeVariant = (role: number): BadgeProps['variant'] => {
    switch (role) {
      case 1:
        return 'warning';
      case 2:
        return 'info';
      case 3:
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getLastLoginStatus = (lastLoginAt: string | null) => {
    if (!lastLoginAt) {
      return { text: t('user_management.never_logged_in'), variant: 'destructive' as const };
    }

    const loginDate = new Date(lastLoginAt);
    const now = new Date();
    const diffInHours = (now.getTime() - loginDate.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return { text: t('user_management.recent_login'), variant: 'success' as const };
    } else if (diffInHours < 168) {
      // 7 days
      return { text: t('user_management.old_login'), variant: 'warning' as const };
    } else {
      return { text: t('user_management.old_login'), variant: 'destructive' as const };
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-500 mb-4">Lỗi khi tải dữ liệu người dùng</p>
          <Button onClick={() => refetch()}>Thử lại</Button>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">{t('user_management.title')}</h1>
            <p className="text-sm text-muted-foreground">{t('user_management.title_desc')}</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500">
              {t('user_management.total_users')}: {data?.data?.pagination?.totalCount || 0}
            </div>
            <Button onClick={handleRegisterUser}>{t('user_management.register_user')}</Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('user_management.filters')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('common.search')}</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder={t('user_management.search_placeholder')}
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t('user_management.role_filter')}</label>
                <Select
                  value={roleFilter}
                  onValueChange={(value) => handleFilterChange('role', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('user_management.all_roles')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('user_management.all_roles')}</SelectItem>
                    <SelectItem value="3">{t('user_management.admin')}</SelectItem>
                    <SelectItem value="2">{t('user_management.lawyer')}</SelectItem>
                    <SelectItem value="1">{t('user_management.customer')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t('user_management.status_filter')}</label>
                <Select
                  value={statusFilter}
                  onValueChange={(value) => handleFilterChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('user_management.all_status')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('user_management.all_status')}</SelectItem>
                    <SelectItem value="active">{t('user_management.active')}</SelectItem>
                    <SelectItem value="inactive">{t('user_management.inactive')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t('user_management.sort_by')}</label>
                <Select value={sortBy} onValueChange={(value) => handleFilterChange('sort', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdAt">{t('user_management.created_date')}</SelectItem>
                    <SelectItem value="fullName">{t('user_management.full_name')}</SelectItem>
                    <SelectItem value="email">{t('user_management.email')}</SelectItem>
                    <SelectItem value="lastLoginAt">{t('user_management.last_login')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                  <p>{t('user_management.loading')}</p>
                </div>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('user_management.user_info')}</TableHead>
                      <TableHead>{t('user_management.role')}</TableHead>
                      <TableHead>{t('user_management.status')}</TableHead>
                      <TableHead>{t('user_management.created_date')}</TableHead>
                      <TableHead>{t('user_management.last_login')}</TableHead>
                      <TableHead className="w-12">{t('user_management.actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.data?.data?.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={user.avatarUrl} />
                              <AvatarFallback>
                                {user.fullName.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{user.fullName}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                              <div className="text-sm text-gray-500">{user.phoneNumber}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getRoleBadgeVariant(user.role)}>
                            {getRoleDisplayName(user.role)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.isActive ? 'success' : 'destructive'}>
                            {user.isActive
                              ? t('user_management.active')
                              : t('user_management.inactive')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {format(new Date(user.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col space-y-1 text-center">
                            <Badge
                              variant={
                                getLastLoginStatus(user.lastLoginAt)
                                  .variant as BadgeProps['variant']
                              }
                            >
                              {getLastLoginStatus(user.lastLoginAt).text}
                            </Badge>
                            {user.lastLoginAt && (
                              <span className="text-xs text-gray-500 ">
                                {format(new Date(user.lastLoginAt), 'dd/MM/yyyy HH:mm', {
                                  locale: vi,
                                })}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewDetails(user.id)}>
                                <Eye className="mr-2 h-4 w-4" />
                                {t('user_management.view_details')}
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={() => handleActivateUser(user.id)}
                                disabled={activateUserMutation.isPending}
                              >
                                <UserCheck className="mr-2 h-4 w-4" />
                                {t('user_management.activate')}
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={() => handleToggleStatus(user.id, user.isActive)}
                                disabled={
                                  activateUserMutation.isPending || deactivateUserMutation.isPending
                                }
                              >
                                {user.isActive ? (
                                  <>
                                    <UserX className="mr-2 h-4 w-4" />
                                    {t('user_management.deactivate')}
                                  </>
                                ) : (
                                  <>
                                    <UserCheck className="mr-2 h-4 w-4" />
                                    {t('user_management.activate')}
                                  </>
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Pagination */}
                {data?.data?.pagination && (
                  <div className="flex items-center justify-between p-4 border-t">
                    <div className="text-sm text-gray-500">
                      {t('user_management.showing')} {(currentPage - 1) * pageSize + 1} -{' '}
                      {Math.min(currentPage * pageSize, data.data.pagination.totalCount)}{' '}
                      {t('user_management.of')} {data.data.pagination.totalCount}{' '}
                      {t('user_management.results')}
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                      >
                        {t('user_management.previous')}
                      </Button>

                      <span className="text-sm">
                        {t('user_management.page')} {currentPage} /{' '}
                        {data.data.pagination.totalPages}
                      </span>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, data.data.pagination.totalPages),
                          )
                        }
                        disabled={currentPage === data.data.pagination.totalPages}
                      >
                        {t('user_management.next')}
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialogs */}
      <UserDetailDialog
        userId={selectedUserId}
        open={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
      />
      <UserRegisterDialog open={isRegisterDialogOpen} onOpenChange={setIsRegisterDialogOpen} />
    </Layout>
  );
}
