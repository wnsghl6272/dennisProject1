// pages/sign-up.tsx
import Image from 'next/image';
import Link from 'next/link';

const SignUp: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      {/* Icon and Title */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Sign Up</h1>
        <p className="text-sm text-gray-600">
          Already got an account?{' '}
          <Link href="/login" className="text-blue-500 hover:underline">
            Log in
          </Link>
        </p>
      </div>

      {/* Sign Up Options */}
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        {/* Continue with Google */}
        <button className="w-full flex items-center justify-center py-2 px-4 mb-4 border border-gray-300 rounded-lg hover:bg-gray-100">
          <Image
            src="/icons/google-icon.png" // Replace with Google icon path
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
            src="/icons/apple-icon.png" // Replace with Apple icon path
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


        {/* Continue with Email */}
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
