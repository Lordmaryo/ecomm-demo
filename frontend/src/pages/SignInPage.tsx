import { useState } from "react";
import SignUpContainer from "../components/SignUpContainer";
import LoginContainer from "../components/LoginContainer";

const SignInPage = () => {
  const [toggleEvent, setToggleEvent] = useState(false);

  return (
    <div>
      {toggleEvent ? (
        <LoginContainer setToggleEvent={setToggleEvent} />
      ) : (
        <SignUpContainer setToggleEvent={setToggleEvent} />
      )}
    </div>
  );
};

export default SignInPage;
