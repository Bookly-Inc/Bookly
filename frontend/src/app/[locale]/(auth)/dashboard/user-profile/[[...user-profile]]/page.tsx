import { UserProfile } from '@clerk/nextjs';
import { getTranslations } from 'next-intl/server';

import { getI18nPath } from '@/utils/Helpers';

export async function generateMetadata(props: { params: { locale: string } }) {
  const t = await getTranslations({
    locale: props.params.locale,
    namespace: 'UserProfile',
  });

  return {
    title: t('meta_title'),
  };
}

const UserProfilePage = (props: { params: { locale: string } }) => (
  <div className="my-6 -ml-16">
    {/* TODO: Replace with our own user profile page */}
    <UserProfile
      path={getI18nPath('/dashboard/user-profile', props.params.locale)}
    />
  </div>
);

export default UserProfilePage;
