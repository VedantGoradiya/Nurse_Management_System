/**     
 * UserContext component.
 * This component is used to provide the user context to the application.
 * It is used to store the user data and the setUser function.
 * @param {UserContextType} props - The props for the user context component.
 * Props:
 * - children: The children of the user context component.
 */
import { createContext, useState } from "react";

import { UserContextType, UserDataType } from "../types/nurse.types";  

// Creating the user context with user and setUser functions to be used in the application.
const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},  
});


// UserProvider component to provide the user context to the application.
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserDataType | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>
  );
};

export default UserContext;

