import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [userid, setUserid] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  function handleLogin(e) {
    e.preventDefault();
    navigate("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 via-white to-pink-200 ">
      <div className="card max-w-sm w-auto bg-white shadow-2xl text-black">
        <form className="card-body" onSubmit={handleLogin}>
          <h2 className="card-title text-3xl font-bold mb-4 justify-center text-primary">Login</h2>
          <div className="form-control mb-4">
            <label className="label">
            </label>
            <input
              type="text"
              className="input input-bordered input-primary bg-base-100 text-black"
              placeholder="User ID"
              value={userid}
              onChange={(e) => setUserid(e.target.value)}
            />
          </div>
          <div className="form-control mb-6">
            <label className="label">
            </label>
            <input
              type="password"
              className="input input-bordered input-primary bg-base-100 text-black"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="btn btn-primary w-full text-white">Login</button>
        </form>
      </div>
    </div>
  );
}
