"use client";
import { useState } from "react";
import { useAddChangePasswordRequest } from "../hooks/forgotpassword/useAddPasswordChangeRequest";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSuccessful, setIsSuccessful] = useState(false);
  const passwordChangeRequestMutation = useAddChangePasswordRequest();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await passwordChangeRequestMutation.mutateAsync(email);

    if (response.Emailaddress) {
      setIsSuccessful(true);
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="h-screen w-screen flex flex-col  justify-center items-center border-dashed border-white  ">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input md:w-1/4 h-10 rounded-3xl p-3"
            required
          />
          {!isSuccessful && (
            <button
              type="submit"
              onSubmit={handleSubmit}
              className="saveBtn bg-success text-white rounded-3xl py-2 px-4 md:w-1/6 m-3"
            >
              Send Link
            </button>
          )}
          {isSuccessful && (
            <p className="py-2 px-4 md:w-1/4 m-3">Please Check your email</p>
          )}
        </div>
      </form>
    </>
  );
}
