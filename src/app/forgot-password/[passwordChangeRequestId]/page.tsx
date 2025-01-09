"use client";
import { useState } from "react";
import { useVerifyAndUpdatePassword } from "@/app/hooks/forgotpassword/useVerifyAndUpdatePassword";
import { useRouter } from "next/navigation";
export default function ForgotPassword(context: any) {
  const { params } = context;
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [doPasswordsMatch, setDoPasswordsMatch] = useState(true);
  const [confirmPasswordStarted, setConfirmPasswordStarted] = useState(false);
  const router = useRouter();

  const verifyAndUpdatePasswordMutation = useVerifyAndUpdatePassword();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await verifyAndUpdatePasswordMutation.mutateAsync({
      passwordChangeRequestId: params.passwordChangeRequestId,
      newPassword: password,
    });
    if (response.id) {
      router.push("/");
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (confirmPasswordStarted) {
      setDoPasswordsMatch(e.target.value === confirmPassword);
    }
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPasswordStarted(true);
    setConfirmPassword(e.target.value);
    setDoPasswordsMatch(e.target.value === password);
  };

  const shouldShowError =
    confirmPasswordStarted && !doPasswordsMatch && password && confirmPassword;

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="h-screen w-screen flex flex-col justify-center items-center border-dashed border-white">
          <input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={handlePasswordChange}
            className="input md:w-1/4 h-10 rounded-3xl p-3"
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            className="input md:w-1/4 h-10 rounded-3xl p-3 mt-4"
            required
          />
          {shouldShowError && <p>Password does not match</p>}
          <button
            type="submit"
            disabled={!doPasswordsMatch}
            className="saveBtn bg-success text-white rounded-3xl py-2 px-4 md:w-1/6 m-3"
          >
            Change Password
          </button>
        </div>
      </form>
    </>
  );
}
