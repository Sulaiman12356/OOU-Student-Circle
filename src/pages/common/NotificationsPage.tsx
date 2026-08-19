import React from 'react';
import { UserProfile } from '../../types';
import { NotificationCenter } from '../../components/notifications/NotificationCenter';

interface NotificationsPageProps {
  currentUser: UserProfile;
  onNavigate: (path: string) => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({ currentUser, onNavigate }) => {
  return (
    <div className="py-2">
      <NotificationCenter currentUser={currentUser} onNavigate={onNavigate} />
    </div>
  );
};
