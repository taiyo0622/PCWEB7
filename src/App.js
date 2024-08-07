import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./views/Login";
import Add from "./views/Add";
import HomePage from "./views/Home";
import SignUpPage from "./views/SignUp";
import Question from "./views/Questions";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/add" element={<Add />} />
        <Route path="/question/:subjectId/:questionId" element={<Question />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;