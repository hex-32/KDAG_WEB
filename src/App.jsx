import { Routes, Route, Navigate } from "react-router-dom";
import Footer from "./components/footer";
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import { useEffect } from "react";


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/posts/:id" element={<BlogDetail />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;