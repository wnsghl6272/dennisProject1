// pages/login.tsx
import Image from 'next/image';
import Link from 'next/link';

const Login: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      {/* Icon and Title */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Log In</h1>
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <Link href="/signup" className="text-blue-500 hover:underline">
            Sign up
          </Link>
        </p>
      </div>

      {/* Login Options */}
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        {/* Continue with Google */}
        <button className="w-full flex items-center justify-center py-2 px-4 mb-4 border border-gray-300 rounded-lg hover:bg-gray-100">
          <Image
            src="/icons/google-icon.png" // Google icon
            alt="Google Icon"
            width={24}
            height={24}
            className="mr-2"
          />
          Continue with Google
        </button>

        {/* Continue with Apple */}
        <button className="w-full flex items-center justify-center py-2 px-4 mb-4 border border-gray-300 rounded-lg hover:bg-gray-100">
          <Image
            src="/icons/apple-icon.png" // Apple icon
            alt="Apple Icon"
            width={24}
            height={24}
            className="mr-2"
          />
          Continue with Apple
        </button>

        {/* Separator */}
        <div className="flex items-center my-4">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="mx-4 text-gray-500">or</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        {/* Email or Username */}
        <div className="mb-4">
          <label htmlFor="usernameOrEmail" className="block text-sm font-medium text-gray-700 mb-1">
            Email or Username
          </label>
          <input
            type="text"
            id="usernameOrEmail"
            placeholder="Enter your email or username"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {/* Forgot Password Link */}
        <div className="text-right mb-6">
          <Link href="/forgot-password" className="text-blue-500 hover:underline">
            Forgot Password?
          </Link>
        </div>

        {/* Log In Button */}
        <button className="w-full py-2 px-4 border border-black text-black rounded-lg font-bold hover:bg-gray-100">
          Log In
        </button>
      </div>
    </div>
  );
};

export default Login;
