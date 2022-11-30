import React from "react";
import { Button, Col } from "react-bootstrap";

function InitialPage(props) {
  return (
    <>
      <Col className="d-grid gap-3 below-nav">
        <Button
          variant="primary"
          size="lg"
          active
          href="/game"
        >
          New game
        </Button>
        <br/>
        {props.loggedIn ? (
            <Button
              variant="danger"
              size="lg"
              active
              href="/myScores"
            >
              Personal Scores
            </Button>
        ) : null}
      </Col>
    </>
  );
}

export default InitialPage;