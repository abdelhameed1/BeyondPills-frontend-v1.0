import {  useSelector } from "react-redux";
import {  Navigate } from "react-router-dom";


 function PrivateRoute({Component}) {
    const { islogged } = useSelector((state) => state.auth);
   
    return islogged ? <Component/>: <Navigate to="/login" />;;
}
export default PrivateRoute;








