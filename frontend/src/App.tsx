import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Login from "./pages/Login";
import Posts from "./pages/Posts";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Posts />} />
          <Route path="/dashboard" element={<Posts />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
