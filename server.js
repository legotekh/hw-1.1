    const express = require('express');
    const path = require('path');
    const { initDb, clearAllData, getStoredDataSummary } = require('./database.js');
    const { fetchFromApi } = require('./api.js');
    const { saveDataToDb } = require('./sync.js');

    const app = express();
    const PORT = 3000;

    app.use(express.json());
    app.use(express.static(path.join(__dirname, 'public')));

    app.post('/api/fetch-and-save', async (req, res) => {
    try {
        const { endpoint, idFrom, idTo } = req.body;
        
        if (!endpoint) {
        return res.status(400).json({ success: false, message: "Endpoint не вказано" });
        }

        let apiData = [];

        if (idFrom && idTo && idTo >= idFrom) {
        console.log(`Завантажую діапазон з ${idFrom} по ${idTo} для ${endpoint}`);
        
        for (let i = idFrom; i <= idTo; i++) {
            try {
            const singleItem = await fetchFromApi(`${endpoint}/${i}`); 
            apiData.push(singleItem);
            } catch (error) {
            if (error.response && error.response.status === 404) {
                console.warn(`Елемент з ID ${i} не знайдено (404). Пропускаю.`);
            } else {
                console.error(`Помилка при завантаженні ID ${i}:`, error.message);
            }
            }
        }
        
        } else if (idFrom && !idTo) {
        console.log(`Завантажую один елемент з ID ${idFrom} для ${endpoint}`);
        try {
            const singleItem = await fetchFromApi(`${endpoint}/${idFrom}`);
            apiData = [singleItem];
        } catch (error) {
            if (error.response && error.response.status === 404) {
            console.warn(`Елемент з ID ${idFrom} не знайдено (404).`);
            } else {
            throw error;
            }
        }
        
        } else {
        console.log(`Завантажую всі елементи для ${endpoint}`);
        apiData = await fetchFromApi(endpoint);
        }
        
        if (apiData.length > 0) {
        await saveDataToDb(endpoint, apiData);
        }

        res.json({
        success: true,
        message: `Завантажено та збережено ${apiData.length} елементів для ${endpoint}.`,
        apiResponse: apiData 
        });

    } catch (error) {
        console.error("Помилка в /api/fetch-and-save:", error);
        res.status(500).json({ success: false, message: error.message });
    }
    });

    app.get('/api/stored-data', async (req, res) => {
    try {
        const summary = await getStoredDataSummary();
        res.json({ success: true, data: summary });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
    });

    app.delete('/api/clear-all', async (req, res) => {
    try {
        await clearAllData();
        res.json({ success: true, message: "Всі дані видалено з бази." });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
    });


    app.listen(PORT, () => {
    console.log(`Сервер запущено! http://localhost:${PORT}`);
    initDb();
    });