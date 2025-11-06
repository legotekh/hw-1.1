    const axios = require('axios');
    const API_URL = 'https://jsonplaceholder.typicode.com';

    /**
     * @param {string} endpoint - Наприклад, "/posts", "/users"
     * @param {object} params - Об'єкт параметрів, напр. { userId: 1, id: 5 }
     * @returns {Promise<Array|object>} Дані з API
     */
    const fetchFromApi = async (endpoint, params = {}) => {
    try {
        console.log(`Виконую запит до ${API_URL}${endpoint} з параметрами:`, params);
        const response = await axios.get(`${API_URL}${endpoint}`, { params });
        return response.data;
    } catch (error) {
        console.error(`Помилка при запиті до API ${endpoint}:`, error.message);
        throw error;
    }
    };

    module.exports = { fetchFromApi };