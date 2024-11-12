import { useTranslations } from 'next-intl';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';

import { Sponsors } from '@/components/Sponsors';

export async function generateMetadata(props: { params: { locale: string } }) {
  const t = await getTranslations({
    locale: props.params.locale,
    namespace: 'Index',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

const Index = (props: { params: { locale: string } }) => {
  unstable_setRequestLocale(props.params.locale);
  const t = useTranslations('Index');

  return (
    <> 
      
      
    </>
  );
};

export default Index;
