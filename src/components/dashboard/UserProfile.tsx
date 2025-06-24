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
  <div className="flex items-center gap-3 p-2">
    <img
      src={avatarUrl || '/default-avatar.webp'}
      alt={name}
      className="w-10 h-10 rounded-full object-cover border"
      loading="lazy"
      width={40}
      height={40}
    />
    <div>
      <div className="font-medium">{name}</div>
      <div className="text-xs text-muted-foreground">{email}</div>
    </div>
  </div>
);

export default UserProfile; 