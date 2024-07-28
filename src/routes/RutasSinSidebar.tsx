import { Route, Routes } from "react-router-dom";

//import ErrorPage from "../components/User/ErrorPage";
import CallbackPage from "../components/auth0/CallbackPage";
import LoginHandler from "../components/ui/LoginHandler";
import { AuthenticationGuard } from "../components/auth0/AuthenticationGuard";

const RutasSinSidebar: React.FC = () => {
  return (
    <Routes>
      <Route path="/callback" element={<CallbackPage />} />
      <Route
        path="/"
        element={<AuthenticationGuard component={LoginHandler} />}
      />
      {/* <Route path="*" element={<ErrorPage />} /> */}
    </Routes>
  );
};
export default RutasSinSidebar;
