import { fetchConfessionsApi } from '../../../api/api.js';

export const homeService = {
    // Sayfa, limit ve kategori parametrelerini alarak itirafları getiriyoruz
    getConfessionsByPage: async (page, limit, category) => {
        return await fetchConfessionsApi(page, limit, category);
    }
};