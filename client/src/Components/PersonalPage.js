import { useEffect, useState } from 'react';
import { Container, Table, Button, Toast } from 'react-bootstrap';
import { ArrowLeft } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import API from '../API';

function PersonalTable(props) {

    const [myScores, setMyScores] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const getMyScores = async () => {
            const myScores = await API.getMyScores();
            setMyScores(myScores);
        }
        getMyScores().catch(err => {
            setMessage({ msg: "impossible to access to personal scores. Try again later!", type: "danger" });
            console.error(err);
        });
    }, []);

    return (
        <>
            {props.loggedIn ? (
                <Container fluid>
                    <br />
                    <div>
                        <Toast bg={"danger"} show={message !== ''} onClose={() => setMessage('')} delay={2000} autohide>
                            <Toast.Body className={"text-white"}>{message?.msg}</Toast.Body>
                        </Toast>
                    </div>
                    <Table variant="" className='text-center' striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>Game #</th>
                                <th>Personal Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.from({ length: myScores.length }).map((_, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{myScores[index].score}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <br />
                    <div className="lefted">
                        <Link to={'/'} >
                            <Button variant="warning"  >
                                <ArrowLeft />{' '}Back
                            </Button>
                        </Link>
                    </div>
                </Container>
            ) : null }
        </>
    )
}

export { PersonalTable };