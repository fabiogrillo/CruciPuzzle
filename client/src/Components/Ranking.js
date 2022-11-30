import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Table, Button, Container, Toast } from 'react-bootstrap';
import { TrophyFill, ArrowRight } from 'react-bootstrap-icons';
import API from '../API';

function RankTable(props) {

    const [scores, setScores] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const getScores = async () => {
            const scores = await API.getScores();
            setScores(scores);

        }
        getScores().catch(err => {
            setMessage({ msg: "impossible retrieve list of scores. Try again later!", type: 'danger' });
            console.error(err);
        });
    }, []);

    return (
        <Container fluid>
            <br />
            <div>
            <Toast bg={"danger"} show={message !== ''} onClose={() => setMessage('')} delay={2000} autohide>
              <Toast.Body className={"text-white"}>{message?.msg}</Toast.Body>
            </Toast>
          </div>
            <br />
            <Table variant="" className="text-center" striped bordered hover responsive>
                <thead>
                    <tr>
                        <th><TrophyFill /></th>
                        <th>Name</th>
                        <th>Score</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: scores.length }).map((_, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{scores[index].name}</td>
                            <td>{scores[index].score}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <br/>
            <div className="righted">
                <Link to={'/'} >
                    <Button variant="warning"  >
                        Next <ArrowRight/> 
                    </Button>
                </Link>
            </div>
        </Container>
    )
}

export { RankTable };
