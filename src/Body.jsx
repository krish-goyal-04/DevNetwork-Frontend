import NavBar from "./NavBar";
import { Outlet } from "react-router";
import Footer from "./Footer";

const Body = () => {
  return (
    <div className="min-h-screen flex flex-col ">
      <NavBar />
      <div className="grow ">
        <Outlet />
      </div>

      <Footer />
    </div>
  );
};
export default Body;
