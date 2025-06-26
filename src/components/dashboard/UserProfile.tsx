import React from 'react';

interface UserProfileProps {
  name: string;
  email: string;
  avatarUrl?: string;
}

/**
 * User profile summary for dashboard sidebar or modal.
 */
const UserProfile: React.FC<UserProfileProps> = ({ name, email, avatarUrl }) => (
  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 flex flex-col items-center">
    <img
      src={avatarUrl || '/default-avatar.webp'}
      alt={name}
      className="w-10 h-10 rounded-full object-cover border"
      loading="lazy"
      width={40}
      height={40}
    />
    <h3 className="mt-4 text-xl font-bold text-gray-900 dark:text-gray-100">{name}</h3>
    <p className="text-sm text-gray-500 dark:text-gray-400">{email}</p>
  </div>
);

export default UserProfile; 