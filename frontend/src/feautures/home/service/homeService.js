import { fetchConfessionsApi } from '../../../api/api.js';

export const homeService = {
    getConfessionsByPage: async (page, limit, category) => {
        // api.js içindeki fetch fonksiyonunu çağırıyor
        return await fetchConfessionsApi(page, limit, category);
    }
};