import HomePage from "./pages/HomePage";
import Lobby from "./pages/Lobby";
import ConfigureRoom from "./pages/ConfigureRoom";
import Play from "./pages/Play";
import Result from "./pages/Result";
import SignInForm from "./components/Forms/SignInForm";
import JoinRoomForm from "./components/Forms/JoinRoomForm";

const routes = [
  {
    path: "/",
    element: <HomePage />,
    children: [
      {
        path: "/invite/:roomId",
        element: <JoinRoomForm />,
      },
      {
        path: "/",
        element: <SignInForm />,
      },
    ],
  },
  {
    path: "/lobby/:roomId",
    element: <Lobby />,
  },
  {
    path: "/configure/:roomId",
    element: <ConfigureRoom />,
  },
  {
    path: "/play/:roomId",
    element: <Play />,
  },
  {
    path: "/result/:roomId",
    element: <Result />,
  },
];

export default routes;
