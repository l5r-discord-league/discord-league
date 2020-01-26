import React from "react";
import "./App.css";
import { SeasonView } from "./views/SeasonView";

export default function App() {
  return (
    <div className="App">
      <header className="App-header">
        Upcoming Seasons
        <SeasonView/>
      </header>
    </div>
  );
}
