import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import BoardList from "./components/BoardList";
import axios from "axios";
import Home from "./pages/HomePage";

function App() {
  return (
    <div className="h-screen">
      <Outlet />
    </div>
  );
}

export default App;
