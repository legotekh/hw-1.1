const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data.db');

const initDb = () => {
db.serialize(() => {
    console.log("Перевірка та створення таблиць...");
    db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY, name TEXT, username TEXT, email TEXT
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY, userId INTEGER, title TEXT, body TEXT,
    FOREIGN KEY(userId) REFERENCES users(id)
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY, postId INTEGER, name TEXT, email TEXT, body TEXT,
    FOREIGN KEY(postId) REFERENCES posts(id)
    )`);
    
    db.run(`CREATE TABLE IF NOT EXISTS albums (
    id INTEGER PRIMARY KEY, userId INTEGER, title TEXT,
    FOREIGN KEY(userId) REFERENCES users(id)
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS photos (
    id INTEGER PRIMARY KEY, albumId INTEGER, title TEXT, url TEXT, thumbnailUrl TEXT,
    FOREIGN KEY(albumId) REFERENCES albums(id)
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY, userId INTEGER, title TEXT, completed INTEGER,
    FOREIGN KEY(userId) REFERENCES users(id)
    )`);
    console.log("Всі таблиці готові.");
});
};

const clearAllData = () => {
console.log("Очищення всіх таблиць...");
const tables = ['photos', 'comments', 'todos', 'albums', 'posts', 'users'];
return new Promise((resolve, reject) => {
    db.serialize(() => {
    tables.forEach(table => {
        db.run(`DELETE FROM ${table}`, (err) => {
        if (err) return reject(err);
        });
    });
    resolve();
    });
});
};

const getStoredDataSummary = () => {
const tables = ['users', 'posts', 'comments', 'albums', 'photos', 'todos'];
const promises = tables.map(table => {
    return new Promise((resolve, reject) => {
    db.get(`SELECT COUNT(*) as count FROM ${table}`, (err, row) => {
        if (err) return reject(err);
        resolve({ table, count: row.count });
    });
    });
});
return Promise.all(promises);
};

module.exports = { db, initDb, clearAllData, getStoredDataSummary };