import {
  Avatar,
  Dropdown,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarToggle,
} from "flowbite-react";
import { Link, useNavigate ,NavLink } from "react-router-dom";
import { HiHome, HiUser, HiBell } from "react-icons/hi";
import logo from "../assets/logoRoute.jpg";
import { useContext, useEffect, useState } from "react";
import { authContext } from "../contexts/auth.context";
import { toast } from "react-toastify";
import { getMyProfile } from "../apis/profile.api";
import type { UserProfile } from "../features/ProfileView";

export function AppNavbar() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const navigate = useNavigate();
   const context =useContext(authContext)

   useEffect(() => {
    async function load(){
      try{
        const profileRes = await getMyProfile();
            const profileUser= profileRes.data.user;
             setUser(profileUser);
      } catch (error: any) {
        toast.error(error?.response?.data?.message ?? "Something went wrong");
      }
    } load();},[]);

   if(!context) throw new Error("")
    const {setLogin} =context

    function handleLogOut(){
         localStorage.removeItem("tkn");
                  setLogin(null)
                  toast.success("Logged Out Succesfully")
                  navigate("/")
    }
  return (

    <Navbar fluid rounded className="bg-white shadow-sm px-0 py-2.5 fixed w-full z-20 top-0 border-b border-slate-200">
      
    <div className="mx-auto flex w-full max-w-7xl px-4 flex-wrap items-center justify-between">
        

        <NavbarBrand>
          <div className="flex items-center gap-3">
              <img className="h-10 w-10 items-center justify-center rounded-xl" src={logo} alt="logoImg"/>
            <span className="self-center whitespace-nowrap text-xl font-bold text-[#00298d]">
              Route Posts
            </span>
          </div>
        </NavbarBrand>


        <div className="flex md:order-2 items-center gap-3">
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <div className="flex items-center gap-2 cursor-pointer">
                <Avatar
                  alt="User settings"
                  img={user?.photo}
                  rounded
                  size="sm"
                />
                <span className="hidden md:inline font-bold text-sm text-slate-800">
                  {user?.name}
                </span>
              </div>
            }
          >
            <DropdownHeader>
              <span className="block text-sm font-bold text-slate-900">{user?.name}</span>
              <span className="block truncate text-xs font-medium text-slate-500">{user?.username}</span>
            </DropdownHeader>
            <DropdownItem as={Link} to="/profile">Profile</DropdownItem>
            <DropdownItem as={Link} to="/settings">Settings</DropdownItem>
            <DropdownDivider />
            <DropdownItem onClick={handleLogOut} className=" text-red-600">Log out</DropdownItem>
          </Dropdown>
          <NavbarToggle />
        </div>
        
         <NavbarCollapse>
          <div className="flex flex-col md:flex-row md:items-center md:gap-6">
            <NavLink
               to="/feed"
               className={({ isActive }) =>
               `flex items-center gap-2 py-2 px-3 text-sm font-bold transition-colors
                ${isActive ? "text-[#00298d]" : "text-slate-600 hover:text-[#00298d]"}`
              }
            >
              <HiHome className="text-lg" />
              <span>Feed</span>
            </NavLink>
            <NavLink
             to="/profile"
             className={({ isActive }) =>
             `flex items-center gap-2 py-2 px-3 text-sm font-semibold
             ${isActive ? "text-[#00298d]" : "text-slate-600 hover:text-[#00298d]"}`
             }
            >
             <HiUser className="text-lg" />
             <span>Profile</span>
            </NavLink>

            <NavLink
             to="/notifications"
             className={({ isActive }) =>
             `flex items-center gap-2 py-2 px-3 text-sm font-semibold
             ${isActive ? "text-[#00298d]" : "text-slate-600 hover:text-[#00298d]"}`
             }
            >
             <HiBell className="text-lg" />
             <span>Notifications</span>
            </NavLink>
          </div>
        </NavbarCollapse>



      </div>
    </Navbar>
  );
}