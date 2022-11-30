import { useState, useEffect } from 'react';
import { Button, Col, Row, Table, Alert, Container, Toast } from 'react-bootstrap';
import { ArrowCounterclockwise, HouseFill } from 'react-bootstrap-icons';
import API from '../API';

function DifficultyButtons(props) {

    return (
        <Col className="d-grid gap-3 below-nav">
            <Row className="main-font">SELECT DIFFICULTY:</Row>
            {["level 1", "level 2", "level 3", "level 4", "level 5"].map(
                (level, idx) => (
                    <Button
                        variant="warning"
                        size="lg"
                        key={idx}
                        active
                        onClick={() => {
                            props.updateDifficulty(idx + 1);
                            props.updateSelected(true);
                        }}
                    >
                        {level}{" "}
                    </Button>
                )
            )}
        </Col>
    );
}

function GameTable(props) {

    const started = props.started;
    const updateStarted = props.updateStarted;
    const rows = props.level * 4;
    const columns = props.level * 6;
    const letters = props.letters;
    const [first, setFirst] = useState(false);
    const [second, setSecond] = useState(false);
    const [timeoutId, setTimeoutId] = useState(undefined);
    const [rowFirst, setRowFirst] = useState(undefined);
    const [colFirst, setColFirst] = useState(undefined);
    const [word, setWord] = useState(undefined);
    const [words, setWords] = useState([]);
    const [cells, setCells] = useState([]);
    const [message, setMessage] = useState('');
    const [score, setScore] = useState(0);
    const [showScore, setShowScore] = useState(false);

    useEffect(() => {
        const getWord = async () => {
            await API.getWord(word);
        };
        if (word)
            getWord()
                .then(() => {
                    if (words.includes(word) === false) {
                        setWords(words => [...words, word]);
                        setScore((score) => (score + word.length * 100 * props.level));
                    };
                    setWord('');
                })
                .catch((err) => {
                    setCells((cells) => {
                        const next = [...cells]
                        for (let z = 0; z < word.length; z++) {
                            next.pop();
                        }
                        return next;

                    })
                    setFirst(false);
                    setSecond(false);
                    setRowFirst(false);
                    setColFirst(false);
                    setMessage({
                        msg: "The selected word does not exist",
                        type: "danger",
                    });
                    console.error(err);
                });
    }, [word, props.level]);


    useEffect(() => {
        const addScore = async () => {
            await API.addScore(props.user.id, score);
        };
        if (props.loggedIn && showScore) {
            addScore().then().catch((err) => {
                setMessage({
                    msg: "Impossible to add the score. Try later.",
                    type: "danger",
                });
                console.error(err);
            });
        };
    }, [showScore, props.user.id, score, props.loggedIn]);

    useEffect(() => {
        if (!timeoutId && !started) {

            const id = setTimeout(() => {
                console.log(id);
                updateStarted(false);
                setShowScore(true);

            }, 60000);
            setTimeoutId(id);
        }
    }, [started, timeoutId, updateStarted, props.level]);


    function composeWord(i_first, j_first, i_last, j_last) {
        let direction = '';

        if (i_first === i_last && j_first <= j_last)
            direction = 'horizontalRight';
        if (i_first === i_last && j_first > j_last)
            direction = 'horizontalLeft';
        if (i_first <= i_last && j_first === j_last)
            direction = 'verticalDown';
        if (i_first > i_last && j_first === j_last)
            direction = 'verticalUp';
        if (i_first <= i_last && j_first <= j_last && Math.abs(i_first - i_last) === Math.abs(j_first - j_last))
            direction = 'oblRightDown';
        if (i_first > i_last && j_first <= j_last && Math.abs(i_first - i_last) === Math.abs(j_first - j_last))
            direction = 'oblRightUp';
        if (i_first <= i_last && j_first > j_last && Math.abs(i_first - i_last) === Math.abs(j_first - j_last))
            direction = 'oblLeftDown';
        if (i_first > i_last && j_first > j_last && Math.abs(i_first - i_last) === Math.abs(j_first - j_last))
            direction = 'oblLeftUp';

        let wordProv = '';
        let cellProv = [];
        switch (direction) {

            case 'horizontalRight':
                for (let i = 0; i < j_last - j_first + 1; i++) {
                    wordProv += letters[i_first * columns + j_first + i];
                    cellProv.push(i_first * columns + j_first + i);
                };
                break;

            case 'horizontalLeft':
                for (let i = j_first - j_last; i >= 0; i--) {
                    wordProv += letters[i_first * columns + j_last + i];
                    cellProv.push(i_first * columns + j_last + i);
                }
                break;

            case 'verticalDown':
                for (let j = 0; j < i_last - i_first + 1; j++) {
                    wordProv += letters[(i_first + j) * columns + j_first];
                    cellProv.push((i_first + j) * columns + j_first);
                }
                break;
            case 'verticalUp':
                for (let j = i_first - i_last; j >= 0; j--) {
                    wordProv += letters[(i_last + j) * columns + j_first];
                    cellProv.push((i_last + j) * columns + j_first);
                }
                break;
            case 'oblRightDown':
                for (let i = 0; i < j_last - j_first + 1; i++) {
                    wordProv += letters[(i_first + i) * columns + j_first + i];
                    cellProv.push((i_first + i) * columns + j_first + i);
                }
                break;
            case 'oblRightUp':
                for (let i = j_last - j_first; i >= 0; i--) {
                    wordProv += letters[(i_last + i) * columns + j_last - i];
                    cellProv.push((i_last + i) * columns + j_last - i);
                }
                break;
            case 'oblLeftDown':
                for (let i = 0; i < j_first - j_last + 1; i++) {
                    wordProv += letters[(i_first + i) * columns + j_first - i];
                    cellProv.push((i_first + i) * columns + j_first - i);
                }
                break;
            case 'oblLeftUp':
                for (let i = j_first - j_last; i >= 0; i--) {
                    wordProv += letters[(i_last + i) * columns + j_last + i];
                    cellProv.push((i_last + i) * columns + j_last + i);
                }
                break;
            default:
                break;
        }

        setCells((cells) => {
            for (let el of cellProv) {
                if (cells.includes(el) === false)
                    cells.push(el);
            }
            return cells;
        });
        setWord(wordProv);
    }

    function handleColor(i, j) {
        for (let el of cells) {
            if (el === (i * columns + j)) {
                return "success";
            }
        }
        if (first === false) {
            return "warning";
        }
        if (first === true) {
            if (i === rowFirst && j === colFirst) {
                return "info";
            }
        }

        return "warning";
    }

    const handleSelect = (i, j) => async (event) => {
        //first letter being selected
        if (first === false && second === false) {
            setFirst(true);
            setRowFirst(i);
            setColFirst(j);
        }
        //last letter selected
        else if (first === true && second === false) {
            setSecond(true);

            composeWord(rowFirst, colFirst, i, j);
            setFirst(false);
            setSecond(false);
        }
    }


    const handleFinished = (event) => {
        props.updateSelected(false);
        props.updateStarted(false);
        setCells([]);
        setShowScore(false);
        setScore(0);
    }

    return (
        <>
            {!props.diffSelected ? (
                <DifficultyButtons
                    level={props.difficulty}
                    diffSelected={props.diffSelected}
                    updateSelected={props.updateSelected}
                    updateDifficulty={props.updateDifficulty}
                />
            ) : (!showScore ?
                <>
                    <br />
                    <div>
                        <Toast bg={"danger"} show={message !== ''} onClose={() => setMessage('')} delay={3000} autohide>
                            <Toast.Body className={"text-white"}>{message?.msg}</Toast.Body>
                        </Toast>
                    </div>
                    <Table borderless className="below-nav" responsive="sm">
                        <tbody>
                            {Array.from({ length: rows }).map((_, row_index) => (
                                <tr key={row_index}>
                                    {Array.from({ length: columns }).map((_, column_index) => (
                                        <td key={column_index}>
                                            <Button
                                                variant={handleColor(row_index, column_index)}
                                                onClick={handleSelect(row_index, column_index)}
                                            >
                                                {letters[row_index * columns + column_index]}
                                            </Button>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>

                    </Table>
                    <div className='centered'>
                        <Button
                            variant="outline-danger"
                            size="lg"
                            onClick={() => {
                                setShowScore(true);
                                props.updateStarted(false);
                                clearTimeout(timeoutId);
                                setTimeoutId(null);
                            }} >
                            QUIT
                        </Button>
                    </div>
                </> : <>
                    <br /><br />
                    <Container className="centered" >

                        <div fluid="true" className="text-center text-warning">
                            <Alert variant="warning" >
                                <Alert.Heading>Your score:<br /><br />
                                    <h1>{score}</h1>
                                </Alert.Heading>
                                <hr />
                                <div>
                                    <Button onClick={handleFinished} variant="outline-primary">
                                        <ArrowCounterclockwise /> Restart
                                    </Button>{' '}
                                    <Button href='/' variant="outline-success">
                                        <HouseFill /> Main Menu
                                    </Button>
                                </div>
                            </Alert>
                        </div>

                    </Container>
                </>
            )}
        </>
    );
}

export { GameTable, DifficultyButtons };