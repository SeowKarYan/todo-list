import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import './App.css'
import Login from "./page/Login";
import List from "./page/List";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/list" element={<List />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
