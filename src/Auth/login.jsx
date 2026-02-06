import React from "react";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-light/70 px-4">
      <div className="w-full max-w-md bg-peach p-8 rounded-2xl shadow-xl border border-purple/10">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-purple">Welcome Back</h2>
          <p className="text-gray-600 mt-2">
            Please enter your details to sign in.
          </p>
        </div>

        {/* Form */}
        <form className="space-y-5">
          <div>
            <label className="block text-purple font-bold mb-2 text-sm">
              Email Address
            </label>
            <input
              type="email"
              placeholder="name@company.com"
              className="w-full px-4 py-3 rounded-lg border border-purple/20 focus:outline-none focus:border-purple focus:ring-1 focus:ring-purple transition duration-200"
            />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-purple font-bold text-sm">Password</label>
              <a href="#" className="text-xs text-purple hover:underline">
                Forgot password?
              </a>
            </div>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg border border-purple/20 focus:outline-none focus:border-purple focus:ring-1 focus:ring-purple transition duration-200"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple text-peach font-bold py-3 rounded-lg hover:bg-opacity-90 transition duration-300 shadow-lg"
          >
            Sign In
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-8">
          Don't have an account?
          <Link
            to={"/"}
            state={{ scrollTo: 6 }}
            className="text-purple font-bold ml-1 hover:underline"
          >
            Request Access
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
