import { useState } from "react";
import Login from "./Login";
import Register from "./Register";

export default function Auth({ setUser, syncUser }) {
  const [mode, setMode] = useState("login");

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      {mode === "login" ? (
        <Login
          setUser={setUser}
          setAuthPage={setMode}
          syncUser={syncUser}
        />
      ) : (
        <Register
          setAuthPage={setMode}
          syncUser={syncUser}
        />
      )}
    </div>
  );
}
