import { Navbar as BNavbar, Nav, Container, Form } from "react-bootstrap";
import { PuzzleFill, PersonCircle, BoxArrowRight } from 'react-bootstrap-icons';

export const Navbar = (props) => {
    const { notInGame, inGame, loggedIn, user } = props;

    return (
        <>
            <BNavbar bg="warning" expand="sm">
                <Container fluid>
                    <BNavbar.Brand href="/">
                        <PuzzleFill className="rotated" size={25} />
                        Crucipuzzle
                    </BNavbar.Brand>
                    {notInGame === false && inGame === true ? null : (
                        <>
                            <Nav className="me-auto" >
                                <Nav.Link href="/halloffame">Hall of Fame</Nav.Link>
                            </Nav>

                            <Nav className="ml-md-auto">
                                <BNavbar.Text className="mx-2">
                                    {user && user.name && `Welcome, ${user?.name}!`}
                                </BNavbar.Text>
                                <Form inline="true" className="mx-2">
                                    {loggedIn ? (
                                            <Nav.Link href="/">
                                                <BoxArrowRight size={25} onClick={props.logout} />
                                            </Nav.Link>
                                    ) : (
                                        <Nav.Link href="/login">
                                            <PersonCircle size={25} />
                                            Login
                                        </Nav.Link>
                                    )}
                                </Form>
                            </Nav>
                        </>
                    )}
                </Container>
            </BNavbar>
        </>
    );
};

export default Navbar;
