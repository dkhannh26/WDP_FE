import "./App.css";
import { Outlet } from "react-router-dom";
import { AuthProvider } from "./components/context/AuthContext";
import { RefreshProvider } from "./context/RefreshContext";

function App() {
  return (
    <AuthProvider>
      <RefreshProvider>
        <Outlet />
      </RefreshProvider>
    </AuthProvider>
  );
}

export default App;
