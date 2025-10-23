'use client';

import { useNotificationStore } from '../store/notificationStore';
import { useEffect } from 'react';

export default function NotificationToast() {
  const { notifications, removeNotification } = useNotificationStore();

  const getBackgroundColor = (type: 'success' | 'error' | 'info') => {
    switch (type) {
      case 'success':
        return 'bg-[#43b581]';
      case 'error':
        return 'bg-[#f04747]';
      case 'info':
        return 'bg-[#7289da]';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`${getBackgroundColor(notification.type)} text-white px-4 py-2 rounded shadow-lg flex items-center justify-between min-w-[200px] max-w-[300px] transform transition-all duration-300 ease-in-out`}
        >
          <p className="mr-2">{notification.message}</p>
          <button
            onClick={() => removeNotification(notification.id)}
            className="text-white hover:text-gray-200"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}