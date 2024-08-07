import React, { useEffect, useState } from "react";
import { Container, Form, Button, Card, Alert } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { collection, getDocs, query, where, limit, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function Question() {
  const { subjectId } = useParams(); 
  const [question, setQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [error, setError] = useState("");
  const [questionId, setQuestionId] = useState(null);
  const [score, setScore] = useState(0); // Track the score
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const questionQuery = query(
          collection(db, "Subjects", subjectId, "Questions"),
          limit(1)
        );
        const querySnapshot = await getDocs(questionQuery);
        
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          setQuestion({ id: doc.id, ...doc.data() });
          setQuestionId(doc.id); // Store the question ID
        } else {
          setError("No questions found for this subject.");
        }
      } catch (error) {
        setError("Error fetching question.");
        console.error("Error fetching question: ", error);
      }
    };

    fetchQuestion();
  }, [subjectId]);

  const handleNext = async () => {
    if (!selectedOption) {
      setError("Please select an option.");
      return;
    }

    if (question) {
      // Check if the selected option is correct
      const correctOption = question.correctOption;
      if (selectedOption === correctOption) {
        setScore(score + 1);
      }

      // Fetch the next question
      try {
        const nextQuestionQuery = query(
          collection(db, "Subjects", subjectId, "Questions"),
          where("__name__", ">", questionId),
          limit(1)
        );
        const querySnapshot = await getDocs(nextQuestionQuery);

        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          setQuestion({ id: doc.id, ...doc.data() });
          setQuestionId(doc.id); // Update the question ID
          setSelectedOption(""); // Clear selected option
          setError("");
        } else {
          // If no more questions are available, end the quiz
          alert(`Quiz finished! Your score: ${score + 1}`);
          navigate("/");
        }
      } catch (error) {
        setError("Error fetching the next question.");
        console.error("Error fetching next question: ", error);
      }
    }
  };

  return (
    <Container>
      <h1 className="my-3">Quiz for {subjectId}</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      {question ? (
        <Card>
          <Card.Body>
            <Card.Title>{question.questionText}</Card.Title>
            <Form>
              {["A", "B", "C", "D"].map((option) => (
                <Form.Check
                  key={option}
                  type="radio"
                  id={`option${option}`}
                  label={question[`option${option}`]}
                  name="quizOptions"
                  value={option}
                  checked={selectedOption === option}
                  onChange={(e) => setSelectedOption(e.target.value)}
                />
              ))}
              <Button variant="primary" onClick={handleNext}>
                {questionId ? "Next" : "Start Quiz"}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      ) : (
        <p>Loading question...</p>
      )}
    </Container>
  );
}
