import React, { createContext, useState , useContext } from 'react';

// UserContext ko create karte hain
export const UserContext = createContext();

// UserProvider component jo context value provide karega
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);



    return (
        <UserContext.Provider value={{ user,setUser}}>
            {children}
        </UserContext.Provider>
    );
};

