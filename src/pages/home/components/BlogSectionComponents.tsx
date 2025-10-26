import { motion } from 'framer-motion';
import Autoplay from 'embla-carousel-autoplay';
import { Calendar, FileText, Users, Briefcase } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

const BlogSection = () => {
  const navigate = useNavigate();
  const articles = [
    {
      id: 1,
      title: 'Maryland workers get paid time off to vote—a reminder',
      date: 'October 24, 2024',
      image:
        'https://images.pexels.com/photos/1550337/pexels-photo-1550337.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
      icon: <Users className="w-5 h-5 text-red-500" />,
      category: 'Employment Rights',
    },
    {
      id: 2,
      title: "Don't ignore your noncompete—yet",
      date: 'October 15, 2024',
      image:
        'https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
      icon: <FileText className="w-5 h-5 text-red-500" />,
      category: 'Legal Advice',
    },
    {
      id: 3,
      title: 'Do I have to report my criminal record on a job application?',
      date: 'October 8, 2024',
      image:
        'https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
      icon: <Briefcase className="w-5 h-5 text-red-500" />,
      category: 'Employment',
    },
  ];
  const { t } = useTranslation();
  return (
    <section className="min-h-screen bg-gray-50 py-16 lg:py-24">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            <span className="text-orange-500">{t('home.blog_title')}</span>{' '}
            {t('home.blog_titleHighlight')}
          </h2>
          <p className="text-gray-600">{t('home.blog_subtitle')}</p>
        </motion.div>

        {/* Carousel */}
        <Carousel
          opts={{ align: 'start', loop: true }}
          plugins={[
            Autoplay({
              delay: 4000, // thời gian chuyển slide (ms)
              stopOnInteraction: false, // không dừng khi user kéo
            }),
          ]}
          className="w-full p-2 bg-transparent"
        >
          <CarouselContent>
            {articles.map((article) => (
              <CarouselItem key={article.id} className="md:basis-1/2 lg:basis-1/3">
                <Card className="h-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer flex flex-col">
                  <CardContent className="flex flex-col h-full p-0">
                    {/* Image */}
                    <div className="relative overflow-hidden">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4">
                        <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
                          {article.icon}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col flex-1 p-6 justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-500">{article.date}</span>
                        </div>

                        <h3 className="text-lg font-medium text-gray-900 leading-tight mb-3 group-hover:text-red-500 transition-colors duration-200 line-clamp-2">
                          {article.title}
                        </h3>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400 uppercase tracking-wider">
                          {article.category}
                        </span>
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-red-50 transition-colors duration-200">
                          <div className="w-2 h-2 bg-gray-400 rounded-full group-hover:bg-red-500 transition-colors duration-200"></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="hidden sm:flex justify-center gap-4 mt-8">
            <CarouselPrevious />
            <CarouselNext />
          </div>
        </Carousel>

        {/* View More Button */}
        <button
          onClick={() => navigate('/resources')}
          className={cn(
            'mt-10 mx-auto flex justify-center items-center cursor-pointer px-8 py-3 bg-white border border-gray-200 text-gray-700 font-medium rounded-full hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm',
          )}
        >
          {t('home.view_more')}
        </button>
      </div>
    </section>
  );
};

export default BlogSection;
