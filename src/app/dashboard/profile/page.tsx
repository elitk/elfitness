import UserProfile from '@/components/dashboard/UserProfile';

const mockUser = {
  name: 'Jane Doe',
  email: 'jane@example.com',
  avatarUrl: '/default-avatar.webp',
};

const ProfilePage = () => (
  <div className="max-w-md mx-auto mt-12">
    <UserProfile {...mockUser} />
  </div>
);

export default ProfilePage; 