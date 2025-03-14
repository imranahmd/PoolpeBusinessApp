import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./screens/Login";
import Dashboard from "./screens/Dashboard";
import MerchantStatus from "./components/MerchantStatus";
import UserDetail from "./components/UserDetail";
import AdminSuccessApproved from "./components/AdminSuccessApproved";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/merchants" element={<MerchantStatus />} />
        <Route path="/user/:userId" element={<UserDetail />} />
        <Route path="/successapproved" element={<AdminSuccessApproved />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
