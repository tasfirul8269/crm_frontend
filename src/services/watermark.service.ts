import api from '@/lib/api/axios';

export interface Watermark {
    id: string;
    name: string;
    imageUrl: string;
    position: string;
    opacity: number;
    scale: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export const getWatermarks = async (): Promise<Watermark[]> => {
    const response = await api.get<Watermark[]>('/watermarks');
    return response.data;
};

export const getActiveWatermark = async (): Promise<Watermark | null> => {
    const response = await api.get<Watermark | null>('/watermarks/active');
    return response.data;
};

export const uploadWatermark = async (name: string, file: File): Promise<Watermark> => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('image', file);

    const response = await api.post<Watermark>('/watermarks', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

export const updateWatermark = async (id: string, data: {
    name?: string;
    position?: string;
    opacity?: number;
    scale?: number;
}): Promise<Watermark> => {
    const response = await api.patch<Watermark>(`/watermarks/${id}`, data);
    return response.data;
};

export const activateWatermark = async (id: string): Promise<Watermark> => {
    const response = await api.patch<Watermark>(`/watermarks/${id}/activate`);
    return response.data;
};

export const deactivateAllWatermarks = async (): Promise<void> => {
    await api.post('/watermarks/deactivate-all');
};

export const deleteWatermark = async (id: string): Promise<void> => {
    await api.delete(`/watermarks/${id}`);
};
