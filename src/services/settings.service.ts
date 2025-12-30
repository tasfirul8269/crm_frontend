
import api from '@/lib/api/axios';

export interface NotificationSettings {
    notificationSoundUrl: string | null;
    notificationSoundStart: number;
    notificationSoundEnd: number | null;
    useCustomNotificationSound: boolean;
}

export const updateNotificationSettings = async (formData: FormData) => {
    const response = await api.patch('/users/me/notification-settings', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const getMySettings = async () => {
    const response = await api.get('/users/me');
    return response.data;
};
