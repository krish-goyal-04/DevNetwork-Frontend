import NavBar from "./components/NavBar";
import Login from "./components/Login";
import { BrowserRouter, Routes, Route } from "react-router";
import Body from "./components/Body";
import Profile from "./components/Profile";
import Feed from "./components/Feed";
import Connections from "./components/Connections";
import Requests from "./components/Requests";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Body />}>
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/connections" element={<Connections />} />
            <Route path="/requests" element={<Requests />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
