import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// İlk olarak, ilgi alanları ve butonları tutacak bir context oluşturun
const InterestsContext = createContext();

export const InterestsProvider = ({ userData, children }) => {
  const [interests, setInterests] = useState({
    selectedCategory: '',
    subCategories: [],
    buttons: [],
    isChanged: false,
    isLoading: false,
    notification: '',
    showNotification: false,
    isSubmitted: false,
    newFetchedButtons: null
  });

  const updateInterests = useCallback((newInterests) => {
    // Eğer newInterests bir fonksiyon ise, bu fonksiyonu setInterests ile çağır
    if (typeof newInterests === 'function') {
      setInterests(newInterests);
    } else {
      // Eğer newInterests bir nesne ise, bu nesneyi mevcut state ile birleştir
      setInterests(prevInterests => ({ ...prevInterests, ...newInterests }));
    }
  }, [setInterests]); // Bağımlılık listesi
  


  return (
    <InterestsContext.Provider value={{ interests, updateInterests,  }}>
      {children}
    </InterestsContext.Provider>
  );
};

export const useInterestsContext = () => useContext(InterestsContext);