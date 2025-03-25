import { NavLink } from "react-router-dom";

export const RegisterButton = () => {
  return (
    <NavLink className="register" to="/authpage">
      Register
    </NavLink>
  );
};
