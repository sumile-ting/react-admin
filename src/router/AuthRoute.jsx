import {Navigate} from 'react-router-dom'
import { getToken } from "@/utils/auth";

const AuthRoute = ({children}) => {
  const token = getToken()
  if(token) {
    return <>{children}</> 
  } else {
    return <Navigate to={'/login'} replace/>
  }
   
}
export default AuthRoute