import "./App.css";
import { Outlet } from "react-router-dom";
import { AuthProvider } from "./components/context/AuthContext";
import { RefreshProvider } from "./context/RefreshContext";
import { useEffect } from "react";

function App() {

  useEffect(() => {
    const script = document.createElement("script");
    script.async = true;
    script.setAttribute("data-id", "1488878153");
    script.setAttribute("id", "chatling-embed-script");
    script.setAttribute("type", "text/javascript");
    script.src = "https://chatling.ai/js/embed.js";

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);
  return (
    <AuthProvider>
      <RefreshProvider>
        <Outlet />
      </RefreshProvider>
    </AuthProvider>
  );
}

export default App;
