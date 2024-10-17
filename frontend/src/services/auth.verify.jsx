import { useContext, useEffect } from "react";
import AuthServices from "./auth.service";
import { AuthenticateContext } from "./Context";
import userServices from "./user.service";
import axios from "axios";

const AuthVerify = () => {
  const auth = useContext(AuthenticateContext);

  const exec = async () => {
    const user = userServices.getCurrentUser();
    if (user) {
      const token_is_valid = await AuthServices.Check_token();

      if (token_is_valid) {
        if (
          window.location.pathname === "/login" ||
          window.location.pathname === "/"
        ) {
          window.location.href = "/home";
        }

        auth.setAutenticated(true);
        return;
      }

      auth.setAutenticated(false);
      axios.defaults.headers.common["Authorization"] = null;
    }

    if (window.location.pathname !== "/login") AuthServices.Logout();
  };

  useEffect(() => {
    exec();
    return;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return;
};

// const decodedJwt = parseJwt(user.token);

// if (decodedJwt.exp * 1000 > Date.now()) {
//     if (window.location.pathname === "/login" ||  window.location.pathname === "/" ) {
//         auth.setAutenticated(true)
//         window.location.href = "/home"
//     }
//     return
// }
export default AuthVerify;
