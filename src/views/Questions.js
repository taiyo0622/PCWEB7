import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, getDoc, updateDoc, increment, onSnapshot } from "firebase/firestore";
import { auth, db } from "../firebase"; 
import { useParams, useNavigate } from "react-router-dom";
import { Button, Alert, Container, Form, Nav, Navbar, NavbarText, Image, Dropdown } from "react-bootstrap";
import '../App';
import { signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Question() {
    const [user, loading] = useAuthState(auth);
    const { subjectId, questionId } = useParams();
    const navigate = useNavigate();
    const [questionData, setQuestionData] = useState(null);
    const [selectedOption, setSelectedOption] = useState("");
    const [feedback, setFeedback] = useState("");
    const [userEmail, setUserEmail] = useState("")
    const [userScore, setUserScore] = useState(null)

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

    useEffect(() => {
        if (loading) return;
        if (!user) return navigate("/login");
      }, [navigate, user, loading])

    useEffect(() => {
        const fetchQuestion = async () => {
        try {
            const questionDocRef = doc(db, `Subjects/${subjectId}/questions`, questionId);
            const questionDoc = await getDoc(questionDocRef);
            if (questionDoc.exists()) {
            setQuestionData(questionDoc.data());
            } else {
            setFeedback("Question not found.");
            }
        } catch (error) {
            console.error("Error fetching question: ", error);
            setFeedback("Error fetching question.");
        }
        };
        fetchQuestion();
    }, [subjectId, questionId]);

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const handleSubmit = async () => {
        console.log("Selected Option:", selectedOption);
        console.log("Correct Answer:", questionData.correct);
        if (selectedOption === questionData.correct) {
        setFeedback("Correct! +1 Point!");
        await updateDoc(doc(db, `score/${userEmail}`), { score: increment(1) });
        } else {
        setFeedback("Incorrect!");
        }

        const fetchAllQuestionIds = async () => {
        const questionsCollectionRef = collection(db, `Subjects/${subjectId}/questions`);
        const questionsSnapshot = await getDocs(questionsCollectionRef);
        return questionsSnapshot.docs.map(doc => doc.id);
        };

        const allQuestionIds = await fetchAllQuestionIds();
        const randomQuestionId = allQuestionIds[Math.floor(Math.random() * allQuestionIds.length)];

        setTimeout(() => {
            window.location.reload();
            navigate(`/question/${subjectId}/${randomQuestionId}`);
        }, 2000);
    };

    if (!questionData) {
        return <div>Loading...</div>;
    }
    

    return (
        <>
        <Navbar bg="dark" variant="dark" expand="lg">
                <Container>
                    <Navbar.Brand href="/">🤓 Community of Education</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">
                            <NavbarText style={{color:"white"}} className="ms-3">{userEmail}</NavbarText>
                            <NavbarText style={{color:"grey"}} className="ms-3">{userScore} points</NavbarText>
                            <Dropdown>
                                <Dropdown.Toggle className="ms-3" variant="secondary" id="dropdown-basic">
                                    Menu
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item href="/add">Add Questions</Dropdown.Item>
                                    <Dropdown.Item onClick={(e) => signOut(auth)}>Logout</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

        <Container className="question-container">
        <h2 className="question-title">{questionData.question}</h2>
        <Form>
            {["option1", "option2", "option3", "option4"].map((option, index) => (
            <Form.Check 
                key={index}
                type="radio"
                id={option}
                name="mcq"
                value={questionData[option]}
                label={questionData[option]}
                onChange={handleOptionChange}
                className="mb-3"
            />
            ))}
        </Form>
        <Button onClick={handleSubmit} variant="info" className="mt-3" >Submit</Button>
        </Container>
        {questionData.image !== "" && (
            <Container>
                <div class="centered">
                    
                        <Image
                            src={questionData.image}
                            style={{
                                objectFit: "fill",
                                width: "20rem",
                                height: "20rem",
                                textAlign: "center"
                        }}
                        />
                
                </div>
            </Container>
         )}
        {feedback && <Alert variant={feedback === "Correct! +1 Point!" ? "success" : "danger"} className="mt-3">{feedback}</Alert>}
        </>
    );
    }
