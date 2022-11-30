'use strict'

const { authenticate } = require('passport');
const sqlite = require('sqlite3');
const db = require('./db');

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

//get n letters depending on difficulty selected
exports.listLetters = (n) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM letters';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            if (rows == undefined) {
                resolve({ error: "Error with retrieving letters. " })
            } else {

                const letters = rows.map((e) => ({ letter: e.letter, frequency: e.frequency }));
                let freqLetters = [];
                letters.forEach((arr) => {
                    for (let i = 0; i <= arr.frequency * 100; i++) {
                        freqLetters.push(arr.letter);
                    }
                });


                shuffleArray(freqLetters);
                freqLetters = freqLetters.slice(0, n * n * 6 * 4);

                resolve(freqLetters);
            }
        });
    });
};

//get a word
exports.getWord = (word) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT word FROM words WHERE word = ?';
        db.get(sql, [word], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            if (row === undefined) {
                resolve({ error: 'Word Not Found!' });
            } else {
                const word = { word: row.word };
                resolve(word);
            }
        });
    });
};

//get 5 best scores
exports.getScores = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT name, score FROM scores LEFT JOIN users ON scores.id = users.id ORDER BY score DESC, name LIMIT 5'
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            if (rows === undefined) {
                resolve({ error: 'Impossible to retrieve best 5 scores!' });
            } else {
                const scores = rows.map((e) => ({ name: e.name, score: e.score }));
                resolve(scores);
            }
        });
    });
};

//GET current user score list
exports.getMyScores = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT score FROM scores WHERE id = ?'
        db.all(sql, [id], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            if (rows === undefined) {
                resolve({ error: 'Impossible to retrieve personal scores!' });
            } else {
                const myScores = rows.map((e) => ({ score: e.score }));
                resolve(myScores);
            }
        });
    });
};

//add a new score
exports.createScore = (id, score) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO scores(id, score) VALUES(?, ?)';
        db.run(sql, [id, score], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    });
};