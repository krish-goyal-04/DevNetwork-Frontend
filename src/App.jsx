import NavBar from "./NavBar";
import Login from "./Login";
import { BrowserRouter, Routes, Route } from "react-router";
import Body from "./Body";
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
