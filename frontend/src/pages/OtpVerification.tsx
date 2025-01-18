import { useState } from "react";
import { useUserStore } from "../stores/useUserStore";
import VerificationInput from "react-verification-input";

const OtpVerification = () => {
  const [code, setCode] = useState("");
  const { verifyEmail } = useUserStore();

  const handleVerification = (code: string) => {
    verifyEmail(code);
  };

  return (
    <div className="shadow-lg p-10 rounded-md max-w-[600px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <div className="text-center mb-4">
        <h1 className="md:text-4xl text-2xl font-semibold text-center mb-2">
          Verify Your Email
        </h1>
        <p>Enter the 6-DIGIT code sent to your Email</p>
      </div>
      <VerificationInput
        validChars="0-9"
        onComplete={handleVerification}
        placeholder="*"
        inputProps={{ autoComplete: "one-time-code" }}
        onChange={setCode}
        value={code}
        classNames={{ character: "character" }}
      />
    </div>
  );
};

export default OtpVerification;
