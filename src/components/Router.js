import {Route, BrowserRouter, Routes } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import Dashboard from "../pages/Dashboard";
import PrivateRoutes from "../components/PrivateRoutes";
import Error404 from "../pages/Error404";
import Users from "../pages/Users";
import Navbar  from "./Navbar";
export default function Router() {

    

  return (
    <div>
        <div>
        <BrowserRouter>
        <Navbar/>
          <Routes>
            {/* <Route element={<PrivateRoutes />}> */}
              <Route path="/dashboard" element={<Dashboard />} />
            {/* </Route> */}
            <Route path="/" element={<LoginPage />} />
            <Route path="/users" element={<Users />} />
            <Route path="*" element={<Error404 />} />
          </Routes>
        </BrowserRouter>
        </div>
  </div>
  );
}