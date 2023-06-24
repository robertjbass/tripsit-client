import { useState } from "react";
import { IoLogoGoogle } from "react-icons/io";
import { FcGoogle } from "react-icons/fc";
import useFirebase from "@/hooks/useFirebase";

const Login = () => {
  const { signIn } = useFirebase();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div>
      <button
        onClick={signIn}
        className="flex items-center justify-center bg-white text-gray-600 text-2xl rounded-full shadow px-4 py-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="my-auto">
          {isHovered ? <FcGoogle /> : <IoLogoGoogle />}
        </div>
        <span className="my-auto ml-2">Login</span>
      </button>
    </div>
  );
};

export default Login;
