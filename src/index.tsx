import { render } from "react-dom";
import './index.css';
import App from './components/App';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import CreateGame from "./components/CreateGame";
import Game from "./components/Game";
const rootElement = document.getElementById("root");

render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route path="/" element={<Game />} />
        <Route path="open" element={<Game />} />
        <Route path="create" element={<CreateGame />} />
        <Route path="*" element={<Navigate replace to="/" />} />
      </Route>
    </Routes>
  </BrowserRouter>,
  rootElement
);
