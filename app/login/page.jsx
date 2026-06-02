"use client";

import React from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

import { auth } from "../../config/firebaseConfig.js";
import { ToastContainer, toast } from 'react-toastify';
import { useRouter } from "next/navigation.js";
const LoginPage = () => {
  const router = useRouter();
  const notifyError = (text) => toast.error(text, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
    transition: Bounce,
  });
  const provider = new GoogleAuthProvider();

  async function login() {
    try {
      const result = await signInWithPopup(
        auth,
        provider
      );
      if (result.user.email == "sharmaeducation2024@gmail.com" || result.user.email == "jnkr2409@gmail.com") {
       router.back();
      }
      else {
        notifyError("You are not an authorized admin");
      }
      console.log(result.user.email);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
            S
          </div>

          <h1 className="mt-4 text-3xl font-bold text-gray-900">
            Sharma Education
          </h1>

          <p className="text-gray-600 mt-1">
            IGNOU Admin Panel
          </p>
        </div>

        <div className="mt-8">
          <button
            onClick={login}
            className="w-full flex items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-700 font-medium hover:bg-gray-50 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              className="h-5 w-5"
            >
              <path
                fill="#FFC107"
                d="M43.611 20.083H42V20H24v8h11.303C33.652 32.657 29.233 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.275 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
              />
              <path
                fill="#FF3D00"
                d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.275 4 24 4c-7.682 0-14.347 4.337-17.694 10.691z"
              />
              <path
                fill="#4CAF50"
                d="M24 44c5.177 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.144 35.091 26.659 36 24 36c-5.212 0-9.617-3.329-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
              />
              <path
                fill="#1976D2"
                d="M43.611 20.083H42V20H24v8h11.303c-.793 2.239-2.231 4.166-4.084 5.57l.003-.002 6.19 5.238C36.971 38.485 44 33 44 24c0-1.341-.138-2.65-.389-3.917z"
              />
            </svg>

            Sign in with Google
          </button>
        </div>

        <div className="mt-8 border-t pt-4">
          <p className="text-center text-sm text-gray-500">
            Authorized administrators only
          </p>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      
      />

    </div>
  );
};

export default LoginPage;
