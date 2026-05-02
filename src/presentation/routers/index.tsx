import { BrowserRouter, Route, Routes } from "react-router";
import LoginPage from "../pages/login/LoginPage";

export default function Index() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}
