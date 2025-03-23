import { NavLink } from "react-router-dom";

export const LoginButton = () => {
  return (
    <NavLink className="signin" to="/authpage">
      Sign in
    </NavLink>
  );
};
