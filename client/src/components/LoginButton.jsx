import { NavLink } from "react-router-dom";

export const LoginButton = () => {
  return (
    <NavLink className="signin" to="/login">
      Sign in
    </NavLink>
  );
};
