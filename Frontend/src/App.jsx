import { createBrowserRouter, RouterProvider, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login'
import MainLayout from './pages/MainLayout';
import NotFound from './pages/NotFound';
import Signup from './pages/Signup'
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import MessagePage from './pages/MessagePage';
import SearchPage from './pages/SearchPage';
import TrendingPage from './pages/TrendingPage';
import Notification from './pages/Notification';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/Create PublicRoute';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setOnlineUsers } from './store/chatSlice';
import { setNotification } from './store/RTNSlice';
import { connectSocket, disconnectSocket } from './lib/socket';

const browserRouter = createBrowserRouter([

  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <MainLayout />,
        children: [
          { index: true, element: <Home /> },
          { path: "profile/:id", element: <Profile /> },
          { path: "account/edit", element: <EditProfile /> },
          { path: "message", element: <MessagePage /> },
          { path: "search", element: <SearchPage /> },
          { path: "trending", element: <TrendingPage /> },
          { path: "notification", element: <Notification /> }
        ]
      }
    ]
  },

  {
    element: <PublicRoute />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <Signup /> }
    ]
  },

  { path: "*", element: <NotFound /> }
]);


function App() {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user?._id) return;

    const socket = connectSocket(user._id);

    socket.on("getOnlineUsers", (onlineUsers) => {
      dispatch(setOnlineUsers(onlineUsers));
    });

    socket.on("notification", (notification) => {
      dispatch(setNotification(notification));
    });

    return () => {
      disconnectSocket();
    };

  }, [user?._id, dispatch]);
  return (
    <>
      <RouterProvider router={browserRouter} />
    </>
  )
}
export default App
