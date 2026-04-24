import NavBar from "./NavBar";
import { Outlet } from "react-router";
import Footer from "./Footer";

const Body = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <mian className="grow bg-red-200">
        <Outlet />
      </mian>

      <Footer />
    </div>
  );
};
export default Body;
