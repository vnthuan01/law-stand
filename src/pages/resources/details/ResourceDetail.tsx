import { useLocation } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import LawDetail from './components/LawDetail';
import BlogDetail from './components/BlogDetail';

function ResourceDetail() {
  const location = useLocation();

  const isBlogDetail = location.pathname.includes('/blog-detail');
  const isLawDetail = location.pathname.includes('/law-detail');

  return (
    <MainLayout>
      {isBlogDetail && <BlogDetail />}
      {isLawDetail && <LawDetail />}
    </MainLayout>
  );
}

export default ResourceDetail;
