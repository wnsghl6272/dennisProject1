'use client';
import Image from 'next/image';
import Link from 'next/link';

const SignUp: React.FC = () => {
  const handleGoogleSignUp = () => {
    window.location.href = '/api/auth/google'; // Redirect to the Google OAuth 2.0 route
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Sign Up</h1>
        <p className="text-sm text-gray-600">
          Already got an account?{' '}
          <Link href="/login" className="text-blue-500 hover:underline">
            Log in
          </Link>
        </p>
      </div>

      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <button
          onClick={handleGoogleSignUp}
          className="w-full flex items-center justify-center py-2 px-4 mb-4 border border-gray-300 rounded-lg hover:bg-gray-100"
        >
          <Image
            src="/googleicon.webp"
            alt="Google Icon"
            width={24}
            height={24}
            className="mr-2"
          />
          Continue with Google
        </button>

        <div className="flex items-center my-4">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="mx-4 text-gray-500">or</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        <Link href="/signup-email" passHref>
          <div className="w-full py-2 px-4 border border-gray-300 rounded-lg text-blue-500 hover:bg-gray-100 text-center cursor-pointer">
            Continue with Email
          </div>
        </Link>
      </div>
    </div>
  );
};

export default SignUp;
