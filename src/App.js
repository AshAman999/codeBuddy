import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { HomePage } from "./pages/Home";
import { EditorHome } from "./pages/EditorHome";
import { Toaster } from "react-hot-toast";
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
          <Route path="/" element={<HomePage />} />
          {/* <Route path="/editorHome/roomId:roomId" element={<EditorHome />} /> */}
          <Route path="/x" element={<LandingPage />} />
          <Route path="/y" element={<NamePrompt />} />
          <Route path="/editorHome" element={<UserNameCheck />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
