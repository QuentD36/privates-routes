import {Route, BrowserRouter, Routes } from "react-router-dom";
import LoginPage from "../pages/LoginPage";


export default function Router() {

    

  return (
    <div>
        <div>
        <BrowserRouter>            
            <Routes>
                <Route path="/" element={<LoginPage />} />

            </Routes>
        </BrowserRouter>
        </div>
  </div>
  );
}