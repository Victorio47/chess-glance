import React, { Suspense } from 'react';
import PlayerCard from '@/features/profile/components/PlayerCard';
import ActivityTimer from '@/features/profile/components/ActivityTimer';
import { fetchPlayerProfile } from '@/features/profile/api/fetchPlayerProfile';
import Loader from '@/shared/ui/Loader';

interface ProfilePageProps {
  params: { username: string };
}

const ProfileContent: React.FC<{ username: string }> = async ({ username }) => {
  try {
    const profile = await fetchPlayerProfile(username);
    return (
      <div className="flex flex-col items-center py-8">
        <PlayerCard {...profile} />
        {profile.last_online && <ActivityTimer last_online={profile.last_online} />}
      </div>
    );
  } catch (error: any) {
    return <div className="text-red-500 p-4">Error: {error.message}</div>;
  }
};

const ProfilePage = async ({ params }: ProfilePageProps) => {
  const username = await params.username;
  return (
    <Suspense fallback={<Loader />}>
      {/* @ts-expect-error Async Server Component */}
      <ProfileContent username={username} />
    </Suspense>
  );
};

export default ProfilePage; 