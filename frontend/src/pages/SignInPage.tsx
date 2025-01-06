import { useState } from "react";
import SignUpContainer from "../components/SignUpContainer";
import LoginContainer from "../components/LoginContainer";

const SignInPage = () => {
  const [toggleLogin, setToggleLogin] = useState(false);
  return (
    <div>
      {toggleLogin ? (
        <LoginContainer />
      ) : (
        <SignUpContainer setToggleLogin={setToggleLogin} />
      )}
    </div>
  );
};

export default SignInPage;
