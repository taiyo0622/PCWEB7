import React, { useEffect, useState } from "react";
import { Button, Dropdown, Container, Form, Nav, Navbar, Alert, NavbarText, Image } from "react-bootstrap";
import { addDoc, collection, doc, onSnapshot, updateDoc, increment } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db, storage } from "../firebase";
import { signOut } from "firebase/auth";
import { getDownloadURL, ref, uploadBytes} from "firebase/storage";
import '../App';


export default function Add() {
    const [user, loading] = useAuthState(auth);
    const [userScore, setUserScore] = useState(null)
    const [userEmail, setUserEmail] = useState("")
    const [error,setError] = useState("")
    const [selectedLevel, setSelectedLevel] = useState("");
    const [selectedHigher, setSelectedHigher] = useState("")
    const [selectedSubject, setSelectedSubject] = useState("");
    const [question, setQuestion] = useState("");
    const [option1, setOption1] = useState("");
    const [option2, setOption2] = useState("");
    const [option3, setOption3] = useState("");
    const [option4, setOption4] = useState("");
    const [correct, setCorrect] = useState("");
    const [image, setImage] = useState("");
    const [previewImage, setPreviewImage] = useState("");
    const navigate = useNavigate();
    const levels = ["PSLE", "O-Level","A-Level"];
    const highers = ["H1", "H2", "H3"];
    const subjects = ["Math", "English", "Science", "Chemistry"];

    useEffect(() => {
        if (user && user.email) {
                setUserEmail(user.email);
            } else {
                setUserEmail(`Not logged in`);
            }
        }, [user])

    useEffect(() => {
        if (userEmail) {
            const scoreDocRef = doc(db, "score", userEmail);
            const unsubscribe = onSnapshot(scoreDocRef, (doc) => {
                if (doc.exists()) {
                    setUserScore(doc.data().score);
                } else {
                    console.log("No such document!");
                }
            });
        return () => unsubscribe();
        }
    }, [userEmail]);
    
    const addQuestion = async () => {
        setError("");
        if ((!selectedLevel || !selectedSubject) || (selectedLevel === "A-Level" ? !selectedHigher : selectedHigher)) {
            setError("Please select all dropdown options.");
            return;
        }

        const combinedSubject = `${selectedLevel.toLowerCase()}${selectedHigher.toLowerCase()}${selectedSubject.toLowerCase()}`;
        let imageUrl = "";

        if (!image.name) {
            imageUrl = "";
        } else {
            const imageReference = ref(storage, `images/${image.name}`);
            const response = await uploadBytes(imageReference, image);
            imageUrl = await getDownloadURL(response.ref);
        }
        
        await addDoc(collection(db, `Subjects/${combinedSubject}/questions`), { question, option1, option2, option3, option4, correct, image: imageUrl });
        await updateDoc(doc(db, `score/${userEmail}`), { score: increment(10) });
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
                <Navbar.Brand href="/">🤓 Community of Education</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ms-auto">
                    <Nav.Link href="/add">Add Questions</Nav.Link>
                    <Nav.Link onClick={(e) => signOut(auth)}>Logout</Nav.Link>
                    <NavbarText style={{color:"white"}} className="ms-3">{userEmail}</NavbarText>
                    <Nav className="ms-auto">
                </Nav>
                    <NavbarText style={{color:"grey"}} className="ms-3">{userScore} points</NavbarText>
                </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>

            <Container className="my-3">
                <h1 style={{ marginBlock: "1rem" }}>Add a question to the Community!</h1>
    
                <Dropdown className="mb-3">
                    <Dropdown.Toggle variant="info" id="dropdown-level">
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

                {selectedLevel === "A-Level" && (
                    <Dropdown className="mb-3">
                        <Dropdown.Toggle variant="info" id="dropdown-higher">
                            {selectedHigher || "Select Higher"}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {highers.map(higher => (
                                <Dropdown.Item
                                    key={higher}
                                    onClick={() => setSelectedHigher(higher)}
                                >
                                    {higher}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                )}

            {selectedLevel && (selectedLevel !== "A-Level" || selectedHigher) && (
                <Dropdown className="mb-3">
                    <Dropdown.Toggle variant="info" id="dropdown-subject">
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
            )}

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
                        <Image
                            src={previewImage}
                            style={{
                            objectFit: "cover",
                            width: "10rem",
                            height: "10rem",
                            }}
                        />
                        <Form.Group className="mb-3" controlId="image">
                            <Form.Label>Image</Form.Label>
                            <Form.Control
                            type="file"
                            onChange={(e) => {
                                const imageFile = e.target.files[0];
                                const previewImage = URL.createObjectURL(imageFile);
                                setImage(imageFile);
                                setPreviewImage(previewImage);
                            }}
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
    