import React from "react";
import "./App.css";
import RenderMembers from "./RenderMembers";

function App() {
  return (
    <>
      <h1 className="center-div mt-3">Assignment 6: JSON Server w/Modals</h1>
      {/* component to render the ember members */}
      <RenderMembers/>
    </>
  );
}
export default App;
