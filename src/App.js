import "./App.css";
import { Outlet } from "react-router-dom";
import { AuthProvider } from "./components/context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Outlet></Outlet>
    </AuthProvider>
  );
}

export default App;
