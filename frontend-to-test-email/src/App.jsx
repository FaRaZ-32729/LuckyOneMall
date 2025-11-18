import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SetupPassword from "./pages/SetupPassword";
import VerifyOTP from "./pages/VerifyOTP";
import Success from "./pages/Success";
import DeviceMonitor from "./pages/DeviceMonitor";

const App = () => {
  // return (
  //   <DeviceMonitor />
  // )
  return (
    <Router>
      <Routes>
        <Route path="/setup-password/:token" element={<SetupPassword />} />
        <Route path="/verify-otp/:token" element={<VerifyOTP />} />
        <Route path="/success" element={<Success />} />
      </Routes>
    </Router>
  );
};

export default App;
