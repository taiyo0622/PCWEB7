import React, { useEffect, useState } from "react";
import { Button, Dropdown, Container, Form, Nav, Navbar, Alert, NavbarText } from "react-bootstrap";
import { addDoc, collection } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import '../App';

export default function Add() {
    const [user, loading] = useAuthState(auth);
    const [userEmail, setUserEmail] = useState("")
    const [error,setError] = useState("")
    const [selectedLevel, setSelectedLevel] = useState("");
    const [selectedSubject, setSelectedSubject] = useState("");
    const [question, setQuestion] = useState("");
    const [option1, setOption1] = useState("");
    const [option2, setOption2] = useState("");
    const [option3, setOption3] = useState("");
    const [option4, setOption4] = useState("");
    const [correct, setCorrect] = useState("");
    const navigate = useNavigate();
    const levels = ["PSLE", "O-Level"];
    const subjects = ["Math", "English", "Science"];

    useEffect(() => {
        if (user && user.email) {
                setUserEmail(user.email);
            } else {
                setUserEmail(`Not logged in`);
            }
        }, [user])
        
    const addQuestion = async () => {
        setError("");
        if (!selectedLevel || !selectedSubject) {
            setError("Please select both dropdown options.");
            return;
        }

        const combinedSubject = `${selectedLevel.toLowerCase()}${selectedSubject.toLowerCase()}`;
        await addDoc(collection(db, `Subjects/${combinedSubject}/questions`), { question, option1, option2, option3, option4, correct });
        navigate("/");
    };

    useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/login");
    }, [navigate, user, loading]);

    return (
        <>
            <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand href="/">Community of Education</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ms-auto">
                    <Nav.Link href="/add">Add Questions</Nav.Link>
                    <Nav.Link onClick={(e) => signOut(auth)}>Logout</Nav.Link>
                    <NavbarText style={{color:"white"}}>{userEmail}</NavbarText>
                </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    
            <Container className="my-3">
            <h1 style={{ marginBlock: "1rem" }}>Add a question to the Community!</h1>
    
            <Dropdown className="mb-3">
                <Dropdown.Toggle variant="success" id="dropdown-level">
                {selectedLevel || "Select Level"}
                </Dropdown.Toggle>
    
                <Dropdown.Menu>
                {levels.map(level => (
                    <Dropdown.Item
                    key={level}
                    onClick={() => setSelectedLevel(level)}
                    >
                    {level}
                    </Dropdown.Item>
                ))}
                </Dropdown.Menu>
            </Dropdown>
    
            <Dropdown className="mb-3">
                <Dropdown.Toggle variant="success" id="dropdown-subject">
                {selectedSubject || "Select Subject"}
                </Dropdown.Toggle>
    
                <Dropdown.Menu>
                {subjects.map(subject => (
                    <Dropdown.Item
                    key={subject}
                    onClick={() => setSelectedSubject(subject)}
                    >
                    {subject}
                    </Dropdown.Item>
                ))}
                </Dropdown.Menu>
            </Dropdown>
    
            <Container>
                    <Form>
                        <Form.Group className="mb-3" controlId="question">
                            <Form.Label>Question:</Form.Label>
                                <Form.Control
                                type="text"
                                placeholder="What is 1+1?"
                                value={question}
                                onChange={(text) => setQuestion(text.target.value)}
                                />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="question">
                            <Form.Label className="black-text">Option 1:</Form.Label>
                                <Form.Control
                                type="text"
                                placeholder="1"
                                value={option1}
                                onChange={(text) => setOption1(text.target.value)}
                                />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="question">
                            <Form.Label className="black-text">Option 2:</Form.Label>
                                <Form.Control
                                type="text"
                                placeholder="2"
                                value={option2}
                                onChange={(text) => setOption2(text.target.value)}
                                />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="question">
                            <Form.Label style={{ color: "black" }}>Option 3:</Form.Label>
                                <Form.Control
                                type="text"
                                placeholder="3"
                                value={option3}
                                onChange={(text) => setOption3(text.target.value)}
                                />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="question">
                            <Form.Label className="black-text">Option 4:</Form.Label>
                                <Form.Control
                                type="text"
                                placeholder="4"
                                value={option4}
                                onChange={(text) => setOption4(text.target.value)}
                                />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="question">
                            <Form.Label className="black-text">Correct Answer:</Form.Label>
                                <Form.Control
                                type="text"
                                placeholder="1"
                                value={correct}
                                onChange={(text) => setCorrect(text.target.value)}
                                />
                    </Form.Group>
                </Form>
            </Container>
    
            <Button variant="primary" onClick={async (e) => addQuestion()}>
                submit
            </Button>

            {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
        </Container>
        </>
        );
        }
    