"use client";

import { useState } from "react";
import { useAuth } from "../components/providers/AuthProvider";

export default function Login() {
  const {
    user,
    loading,
    loginWithGoogle,
    loginWithCredentials,
    logout,
    fetchAuthenticatedData,
  } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleCredentialsLogin = async () => {
    try {
      await loginWithCredentials(email, password);
      console.log("Logged in successfully!");
    } catch (error) {
      console.error("Failed to log in:", error);
    }
  };

  const fetchData = async () => {
    try {
      const data = await fetchAuthenticatedData("/api/recipes/1");
      console.log("Data:", data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {!user ? (
        <>
          <h1>Login</h1>
          <button onClick={loginWithGoogle}>Login with Google</button>
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleCredentialsLogin}>Login</button>
          </div>
        </>
      ) : (
        <>
          <h1>Welcome, {user.email}!</h1>
          <button onClick={logout}>Logout</button>
          <button onClick={fetchData}>Fetch Authenticated Data</button>
        </>
      )}
    </div>
  );
}
