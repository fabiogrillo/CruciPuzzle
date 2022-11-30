import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import { Navbar } from './Components/Navbar.js';
import { GameTable } from './Components/Game.js';
import { RankTable } from './Components/Ranking.js';
import { PersonalTable } from './Components/PersonalPage';
import StartPage from './Components/StartPage';
import { Container, Toast } from 'react-bootstrap';
import { LoginForm } from './Components/Login.js';
import API from './API';

function App() {

  const [diffSelected, setDiffSelected] = useState(false);
  const [difficulty, setDifficulty] = useState(undefined);
  const [letters, setLetters] = useState([]);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [message, setMessage] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  // User info if already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await API.getUserInfo();
        setUser(user);
        setLoggedIn(true);
      } catch (err) {
        console.log(err);
      }
    };
    checkAuth()
      .then(() => setLoading(false))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    setDirty(true);
  }, []);

  useEffect(() => {
    const getLetters = async () => {
      const letters = await API.getLetters(difficulty);
      setLetters(letters);
    }
    if (dirty && diffSelected) {
      try {
        getLetters().then(() => {
          setStarted(true);
        });
      }
      catch (err) {
        setMessage({ msg: "Impossible to load puzzle! Please, try again", type: 'danger' });
        handleErrors(err);
        console.error(err);
      }
    }
  }, [diffSelected, difficulty, dirty]);

  const doLogIn = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setUser(user);
      setLoggedIn(true);
      return true;
    } catch (err) {
      return console.log(err);
    }
  };

  const doLogOut = () => {
    API.logOut()
      .then(() => setLoggedIn(false))
      .then(setUser({}))
      .catch((err) => console.log(err));
  };

  const handleErrors = (err) => {
    setMessage({ msg: err.error, type: 'danger' });
    console.log(err);
  }

  return (
    <div className='App'>
      <Router>

        <Navbar
          notInGame={finished}
          inGame={started} user={user}
          loggedIn={loggedIn} logout={doLogOut}
        />

        <Container fluid>
          <div>
            <Toast bg={"danger"} show={message !== ''} onClose={() => setMessage('')} delay={2000} autohide>
              <Toast.Body className={"text-white"}>{message?.msg}</Toast.Body>
            </Toast>
          </div>
          <Switch>

            <Route exact path='/' render={() =>
              <StartPage loggedIn={loggedIn}/>} />

            <Route path='/game' render={() =>
              <GameTable
                started={started}
                finished={finished}
                updateFinished={setFinished}
                updateStarted={setStarted}
                diffSelected={diffSelected}
                updateSelected={setDiffSelected}
                updateDifficulty={setDifficulty}
                level={difficulty}
                letters={letters}
                user={user}
                loggedIn={loggedIn}
              />}
            />

            <Route path='/login' render={() =>
              loggedIn ?
                <Redirect to="/" /> :
                <LoginForm
                  loading={loading}
                  login={doLogIn} />}
            />

            <Route path='/hallOfFame' render={() =>
              <RankTable />}
            />
            <Route path='/myScores' render={() =>
              <PersonalTable loggedIn={loggedIn} />}
            />
          </Switch>
        </Container>

      </Router >
    </div>
  );
};

export default App;