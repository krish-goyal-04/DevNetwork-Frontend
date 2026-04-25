import NavBar from "./components/NavBar";
import Login from "./components/Login";
import { BrowserRouter, Routes, Route } from "react-router";
import Body from "./components/Body";
const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Body />}>
            <Route path="/login" element={<Login />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
