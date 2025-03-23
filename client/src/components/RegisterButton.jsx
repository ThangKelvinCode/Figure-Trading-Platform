import { NavLink } from "react-router-dom";

export const RegisterButton = () => {
  return (
    <NavLink className="register" to="/register">
      Register
    </NavLink>
  );
};
