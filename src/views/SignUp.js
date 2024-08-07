import React, { useState } from "react";
import { Button, Container, Form, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { setDoc, doc } from "firebase/firestore";

export default function SignUpPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function addUser(uid) {
    try {
      await setDoc(doc(db, "score", `${username}`), { score: 0 });
      navigate("/");
    } catch (error) {
      console.error("Error adding user to Firestore: ", error);
      setError("Error adding user data.");
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!username || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, username, password);
      const uid = userCredential.user.uid;

      await addUser(uid);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Container>
      <h1 className="my-3">Sign up for an account</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Form.Text className="text-muted">
            <a href="/login">Have an existing account? Login here.</a>
          </Form.Text>
        </Form.Group>
        
        {error && <Alert variant="danger">{error}</Alert>}

        <Button
          variant="primary"
          type="submit"
        >
          Sign Up
        </Button>
      </Form>
    </Container>
  );
}
