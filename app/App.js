import { useState } from "react";
import BottomTab from "./src/navigation/bottomnavigation/BottomTab";
import Login from "./src/screens/Login";

export default function App() {
  const [login, setLogin] = useState(true);
  return (login ? <BottomTab /> : <Login />);
}
