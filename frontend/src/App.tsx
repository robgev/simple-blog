import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Login from "./pages/Login";
import Posts from "./pages/Posts";
import EditPost from "./pages/EditPost";
import CreatePost from "./pages/CreatePost";
import SinglePost from "./pages/SinglePost";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Posts />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/post/create" element={<CreatePost />} />
          <Route path="/post/:id" element={<SinglePost />} />
          <Route path="/post/:id/edit" element={<EditPost />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
