const express = require('express');
const morgan = require('morgan');

const gameDao = require('./game-dao');
const userDao = require('./user-dao');
const { check, validationResult, body, oneOf } = require('express-validator');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session'); 

passport.use(new LocalStrategy(
  function (username, password, done) {
    userDao.getUser(username, password).then((user) => {
      if (!user)
        return done(null, false, { message: 'Incorrect username and/or password.' });

      return done(null, user);
    })
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  userDao.getUserById(id)
    .then((user) => {
      done(null, user); // this will be available in req.user
    }).catch((err) => {
      done(err, null);
    });
});

// init express
const app = new express();
const port = 3001;

app.use(morgan('dev'));
app.use(express.json());

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated())
    return next();

  return res.status(401).json({ error: 'not authenticated' });
}

app.use(session({
  secret: 'secret sentence not to be shared',
  resave: false,
  saveUninitialized: false
}));

// then, init passport
app.use(passport.initialize());
app.use(passport.session());


/***API ***/

//GET /api/letters/:difficulty
app.get('/api/letters/:difficulty',
  [check('difficulty').isInt({ min: 1, max: 5 }),
  ],
  async (req, res) => {
    try {
      const letters = await gameDao.listLetters(req.params.difficulty);
      if (letters.error)
        res.status(404).json(letters);
      else
        res.json(letters);
    } catch (err) {
      res.status(500).end();
    };
  });

//GET /api/words/:word
app.get('/api/words/:word',
  [
    check('word').isAlpha(),
    check('word').isUppercase(),
    check('word').isLength({ min: 1, max: 30 })
  ],
  async (req, res) => {
    try {
      const result = await gameDao.getWord(req.params.word);
      if (result.error)
        res.status(404).json(result);
      else
        res.json(result);
    } catch (err) {
      res.status(500).end();
    }
  });

//GET /api/scores
app.get('/api/scores', async (req, res) => {
  try {
    const scores = await gameDao.getScores();
    if (scores.err)
      res.status(404).json(scores)
    else
      res.json(scores);
  } catch (err) {
    res.status(500).end();
  };
});

//GET /api/scores
app.get('/api/scores/:id', isLoggedIn,
  [check('id').isInt()],
  async (req, res) => {
    try {
      const myScores = await gameDao.getMyScores(req.user.id);
      if (myScores.err)
        res.status(404).json(myScores)
      else
        res.json(myScores);
    } catch (err) {
      res.status(500).end();
    };
  });

//POST /api/scores
app.post('/api/scores', isLoggedIn, [
  check('score').isInt({ min: 0, max: 1000000 }),
  check('id').isInt()
], async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  try {
    await gameDao.createScore(req.user.id, req.body.score);
    res.status(201).end();
  } catch (err) {
    res.status(503).json({ error: `Server error during the creation of score ${req.body.score}.` });
  }
});

/*** Users APIs ***/

/* login */
app.post('/api/sessions', function (req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json(info);
    }
    req.login(user, (err) => {
      if (err) return next(err);

      return res.json(req.user);
    });
  })(req, res, next);
});

/* logout */
app.delete('/api/sessions/current', (req, res) => {
  req.logout();
  res.end();
});

/* check whether the user is logged in or not */
app.get('/api/sessions/current', (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
  } else res.status(401).json({ error: 'Unauthenticated user!' });
});

/* Activate the server */
app.listen(port, () => console.log(`Server running on http://localhost:${port}/`));
