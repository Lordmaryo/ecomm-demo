import { useState } from "react";
import { useUserStore } from "../stores/useUserStore";
import { useNavigate } from "react-router-dom";

const OtpVerification = () => {
  const [code, setCode] = useState("");
  const { verifyEmail } = useUserStore();
  const navigate = useNavigate();

  const handleVerification = () => {
    console.log(code);
    verifyEmail(code);
    navigate("/");
  };

  return (
    <div>
      OtpVerification
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <button onClick={handleVerification}>Verify email</button>
    </div>
  );
};

export default OtpVerification;
