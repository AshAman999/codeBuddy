import "./App.css";

import { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import LandingPage from "./pages/LandingPage/LandingPage";
import NamePrompt from "./pages/NamePrompt/NamePrompt";
import UserNameCheck from "./pages/NamePrompt/UserNameCheck";

function App() {
  return (
    <>
      <div>
        <Toaster position="top-right"></Toaster>
      </div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/x" element={<LandingPage />} />
          <Route path="/y" element={<NamePrompt />} />
          <Route path="/editorHome" element={<UserNameCheck />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
