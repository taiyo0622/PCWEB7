import React, { useState } from "react";
import { Container, Dropdown, Button, Alert, Navbar, Nav } from "react-bootstrap";
import { collection, getDocs, query, where, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";

export default function HomePage() {
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const levels = ["PSLE", "O-Level", "A-Level"];
  const subjects = ["Math", "English", "Science"];

  const handleSearch = async () => {
    setError("");
    if (!selectedLevel || !selectedSubject) {
      setError("Please select both dropdown options.");
      return;
    }

    const combinedSubject = `${selectedLevel.toLowerCase()}${selectedSubject.toLowerCase()}`;
    console.log(`${combinedSubject}`)
    
    try {
        const subjectCollectionRef = collection(db, "Subjects");
        const q = query(subjectCollectionRef, where("__name__", "==", combinedSubject));
        const querySnapshotSubject = await getDocs(q);

        if (!querySnapshotSubject.empty) {
            const subjectDocRef = doc(subjectCollectionRef, combinedSubject);
            const questionsCollectionRef = collection(subjectDocRef, "questions");
            const querySnapshotQuestion = await getDocs(questionsCollectionRef);
            const questionIDs = querySnapshotQuestion.docs.map(doc => doc.id)
            if (questionIDs.length > 0) {
                const randomIndex = Math.floor(Math.random() * questionIDs.length);
                const questionId = questionIDs[randomIndex];
                navigate(`/question/${combinedSubject}/${questionId}`);
              } else {
                console.log("No documents found in the collection.");
              }
              
        } else {
            setError("Subject not found.");
      }
    } catch (error) {
      setError("Error fetching documents.");
      console.error("Error fetching documents: ", error);
    }
  };



  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="/">Community of Education</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link href="/add">Add Questions</Nav.Link>
              <Nav.Link onClick={() => signOut(auth)}>Logout</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="my-3">
        <h1>Search for Subjects</h1>

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

        <Button variant="primary" onClick={handleSearch}>
          Search
        </Button>

        {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
      </Container>
    </>
  );
}
