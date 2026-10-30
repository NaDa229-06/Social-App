import RootLayout from "./components/RootLayout";
import Feed from "./pages/Feed";
import NotFound from "./pages/NotFound";
import RouteAuth from "./pages/RouteAuth";
import {createBrowserRouter, RouterProvider} from "react-router-dom"
import { ToastContainer} from 'react-toastify';
import PostDetails from "./features/posts/PostDetails";
import Profile from "./pages/Porfile";
import ChangePassword from "./features/auth/ChangePassword";
import Notifications from "./pages/Notifications";

export default function App() {
 const router = createBrowserRouter([
   { path:"/", element: <RouteAuth /> }, 
  {
    element: <RootLayout />,
    errorElement: <NotFound />, 
    children: [
      { path: '/feed', element: <Feed/> },
      { path: "/profile", element: <Profile /> },
      { path: "/notifications", element: <Notifications /> },
      { path: "/profile/:id", element: <Profile /> },
      { path: "/change-password", element: <ChangePassword /> },
      { path: '/posts/:id', element: <PostDetails/> },
    ],
  },
  {
    path: '*',
    element: <NotFound />,}
]);

  return (
    <div>
       <ToastContainer />
      <RouterProvider router={router}></RouterProvider>
    </div>
  )
}

