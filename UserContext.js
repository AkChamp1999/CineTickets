import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user session from AsyncStorage when app starts
  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    };
    loadUser();
  }, []);

  // Save user session to AsyncStorage
  const login = async (userData) => {
    setUser(userData);
    await AsyncStorage.setItem("user", JSON.stringify(userData));
  };

  // Clear user session on logout
  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem("user");
  };

  // Function to update the user in context
  const updateUser = async (updatedData) => {
    setUser(updatedData);
    await AsyncStorage.setItem("user", JSON.stringify(updatedData)); // Sync with AsyncStorage
  };

  return (
    <UserContext.Provider value={{ user, setUser, login, logout, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};
