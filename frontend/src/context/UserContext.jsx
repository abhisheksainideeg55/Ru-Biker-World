import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedBike, setSelectedBike] = useState(null);

  const value = {
    profile,
    setProfile,
    addresses,
    setAddresses,
    selectedBike,
    setSelectedBike,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
