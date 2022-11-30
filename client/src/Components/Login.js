import { Form, Button, Alert, Modal } from 'react-bootstrap';
import { useState } from 'react';

const LoginForm = (props) => {
  const [username, setUsername] = useState('user1@polito.it');
  const [password, setPassword] = useState('password');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    const credentials = { username: username, password: password };

    let valid = true;
    if (username === '' || password === '' || password.length < 6) {
      valid = false;
      setError('Invalid');
      setShow(true);
    }

    if (valid) {
      props.login(credentials).then((logged) => {
        if (!logged) {
          setError('Wrong');
          setShow(true);
        }
      });
    }
  };

  return props.loading ? null : (
    <Modal centered show>
      <Form onSubmit={handleSubmit}>
        <Modal.Header>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert
            dismissible
            show={show}
            onClose={() => setShow(false)}
            variant={error === 'Invalid' ? 'warning' : 'danger'}>
            {`${error} username or password`}
          </Alert>
          <Form.Group controlId="username">
            <Form.Label>email</Form.Label>
            <Form.Control
              type="email"
              value={username}
              onChange={(ev) => setUsername(ev.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit">Login</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};


export { LoginForm };