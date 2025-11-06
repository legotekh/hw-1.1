    const { db } = require('./database.js');

    const saveDataToDb = (endpoint, data) => {
    const items = Array.isArray(data) ? data : [data];
    if (items.length === 0) {
    console.log("Немає даних для збереження.");
    return Promise.resolve();
    }

    console.log(`Збереження ${items.length} елементів для ${endpoint}`);

    return new Promise((resolve, reject) => {
    db.serialize(() => {
    let stmt;
    switch (endpoint) {
    case '/users':
    stmt = db.prepare("INSERT OR IGNORE INTO users (id, name, username, email) VALUES (?, ?, ?, ?)");
    items.forEach(item => stmt.run(item.id, item.name, item.username, item.email));
    break;
    case '/posts':
    stmt = db.prepare("INSERT OR IGNORE INTO posts (id, userId, title, body) VALUES (?, ?, ?, ?)");
    items.forEach(item => stmt.run(item.id, item.userId, item.title, item.body));
    break;
    case '/comments':
    stmt = db.prepare("INSERT OR IGNORE INTO comments (id, postId, name, email, body) VALUES (?, ?, ?, ?, ?)");
    items.forEach(item => stmt.run(item.id, item.postId, item.name, item.email, item.body));
    break;
    case '/albums':
    stmt = db.prepare("INSERT OR IGNORE INTO albums (id, userId, title) VALUES (?, ?, ?)");
    items.forEach(item => stmt.run(item.id, item.userId, item.title));
    break;
    case '/photos':
    stmt = db.prepare("INSERT OR IGNORE INTO photos (id, albumId, title, url, thumbnailUrl) VALUES (?, ?, ?, ?, ?)");
    items.forEach(item => stmt.run(item.id, item.albumId, item.title, item.url, item.thumbnailUrl));
    break;
    case '/todos':
    stmt = db.prepare("INSERT OR IGNORE INTO todos (id, userId, title, completed) VALUES (?, ?, ?, ?)");
    items.forEach(item => stmt.run(item.id, item.userId, item.title, item.completed ? 1 : 0));
    break;
    default:
    return reject(new Error(`Невідомий endpoint для збереження: ${endpoint}`));
    }

    stmt.finalize((err) => {
    if (err) return reject(err);
    resolve();
    });
    });
    });
    };

    module.exports = { saveDataToDb };