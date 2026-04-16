import api from '../../api/api';

export const adminService = {
    getReportedConfessions: async () => {
        return await api.get('/confessions/admin/all'); 
    },
    hardDeleteConfession: async (id) => {
        return await api.delete(`/confessions/${id}/hard-delete`);
    },
    softDeleteConfession: async (id) => {
        return await api.patch(`/confessions/${id}`, { isDeleted: true, deletedAt: new Date() });
    },
    updateConfession: async (id, data) => {
        return await api.patch(`/confessions/${id}`, data);
    }
};