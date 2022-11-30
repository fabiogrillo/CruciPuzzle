const BASEURL = '/api';


async function getLetters(difficulty) {
    //call: GET /api/letters/:difficulty
    const response = await fetch(BASEURL + '/letters/' + difficulty);
    const lettersJson = await response.json();
    if (response.ok) {
        return lettersJson;
    } else {
        throw lettersJson;
    }
};

async function getWord(word) {
    //call: GET /api/words/:word
    const response = await fetch(BASEURL + '/words/' + word);
    const wordJson = await response.json();
    if (response.ok) {
        return wordJson;
    } else {
        throw wordJson;
    }
};

async function getScores() {
    //call: GET /api/scores/
    const response = await fetch(BASEURL + '/scores');
    const scoresJson = await response.json();
    if (response.ok) {
        return scoresJson;
    } else {
        throw scoresJson;
    }
};

async function getMyScores(id) {
    //call: GET /api/scores/:id
    const response = await fetch(BASEURL + '/scores/' + id);
    const myScoresJson = await response.json();
    if (response.ok) {
        return myScoresJson;
    } else {
        throw myScoresJson;
    }
};

async function addScore(id, score) {
    //call: POST /api/scores

    return new Promise((resolve, reject) => {
        fetch(BASEURL + '/scores', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: id, score: score }),
        }).then((response) => {
            if (response.ok) {
                resolve(null);
            } else {
                response.json()
                    .then((message) => { reject(message); })
                    .catch(() => { reject({ error: "Cannot parse server response." }) });
            }
        }).catch(() => { reject({ error: "Cannot communicate with the server." }) });
    });
}

async function logIn(credentials) {
    let response = await fetch(BASEURL + '/sessions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });
    if (response.ok) {
        const user = await response.json();
        return user.name;
    }
    else {
        try {
            const errDetail = await response.json();
            throw errDetail.message;
        }
        catch (err) {
            throw err;
        }
    }
}

async function logOut() {
    await fetch(BASEURL + '/sessions/current', { method: 'DELETE' });
}

async function getUserInfo() {
    return new Promise((resolve, reject) => {
        fetch(BASEURL + '/sessions/current')
            .then((response) => {
                if (response.ok) {
                    response.json().then((obj) => resolve(obj));
                } else {
                    response.json().then((err) => reject(err));
                }
            })
            .catch((err) => {
                reject({ errors: [{ param: 'Server', msg: 'Cannot communicate' }] });
            });
    });
}

const API = { getLetters, logIn, logOut, getUserInfo, getWord, getScores, addScore, getMyScores };
export default API;