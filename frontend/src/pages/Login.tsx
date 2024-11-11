import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosClient } from "../utils/axios";
import { endpoints } from "../utils/endpoints";
import { TokenProvider } from "../utils/tokenProvider";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event: React.FormEvent) => {
    try {
      event.preventDefault();
      setLoading(true);
      setError(null);

      const { data } = await axiosClient.post(endpoints.auth.login, {
        email,
        password,
      });
      console.log(data);
      TokenProvider.set(data.access_token);

      setLoading(false);
      navigate("/dashboard");
    } catch (e) {
      const error = e as Error;
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="w-1/2 my-0 mx-auto p-4">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className="mb-4">
          <label>Email</label>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2"
          />
        </div>
        <div className="mb-4">
          <label>Password</label>
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2"
          />
        </div>
        {error && <p className="text-red">{error}</p>}
        <button type="submit" disabled={loading} className="w-full p-2">
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
