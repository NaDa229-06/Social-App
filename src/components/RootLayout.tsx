import { Outlet } from "react-router-dom";
import { AppNavbar } from "./AppNavbar";

export default function RootLayout() {
  return (
    <div>
      <AppNavbar></AppNavbar>
       <div className="pt-15"></div>
      <Outlet/>
    </div>
  );
}
