import React, {useState, useEffect, useContext} from 'react'
import eventSubCategories from '../../../../models/eventSubCategories'
import styles from './interest.module.css';
import {useInterestsContext} from '../InterestsProvider'
import { useLocation } from 'react-router-dom';
const baseURL = process.env.REACT_APP_API_URL;

const Interests = ({userData}) => {
  const {interests, updateInterests } = useInterestsContext();
  const location = useLocation();

  const handleSubCategoryChange = (e) => {
    const subCategory = e.target.value;
    if (subCategory) {
      updateInterests((prevInterests) => {
        const isSubCategoryPresent = prevInterests.buttons.includes(subCategory);
        const newButtons = isSubCategoryPresent
          ? prevInterests.buttons.filter(button => button !== subCategory)
          : [...prevInterests.buttons, subCategory];
  
        const hasChanged = isSubCategoryPresent || !prevInterests.buttons.includes(subCategory);
  
        return {
          ...prevInterests,
          buttons: newButtons,
          isChanged: hasChanged,
          selectedCategory: '',
          subCategories: []
        };
      });
    }
  };
  

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    updateInterests({
      selectedCategory: category,
      subCategories: eventSubCategories[category] || []
    });
  };
  

  const handleButtonClick = (index) => {
    updateInterests((prevInterests) => {
      const updatedButtons = prevInterests.buttons.filter((_, i) => i !== index);
      let hasChanged = !arraysEqual(userData.interests, updatedButtons);
      // userData.interests ile güncellenmiş buton listesi karşılaştırılıyor
       // Yeni butonlar geldiyse ve hasChanged daha önce false ise kontrol edilmeli
       if (interests.newFetchedButtons && !prevInterests.isSubmitted) {
        hasChanged = !arraysEqual(interests.newFetchedButtons, updatedButtons);
      }

        return {
          ...prevInterests,
          buttons: updatedButtons,
          isChanged: hasChanged
        };
   
   
    });
  };
  

  function arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) return false;
    }
    return true;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
 
    if (interests.isChanged) {
      updateInterests({isLoading: true})
      const selectedContents = interests.buttons;
      fetch(baseURL + '/user/interests', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ selectedContents: selectedContents })
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Sunucu yanıtı başarısız.');
        }
        return response.json();
      })
      .then(data => {
        updateInterests({isLoading: false})
        updateInterests({isSubmitted: true})
        handleNotification(data.message)
      })
      .catch(error => {
        updateInterests({isLoading: false})
        handleNotification(error.message)
      })
  
    } 
  };

  const closeNotification = () => {
    updateInterests({showNotification: false})
  };
  
  const handleNotification = (message) => {
    updateInterests({notification: message})
    updateInterests({showNotification: true})
    setTimeout(() => {
      updateInterests({showNotification: false})
    }, 3000); // 3 saniye sonra bildirimi gizle
  };

  useEffect(() => {
    if(interests.newFetchedButtons) {
      updateInterests({ buttons: interests.newFetchedButtons });
    }  else {
      updateInterests({ buttons: userData.interests });
    } 
  }, [])

  useEffect(() => {
    // Rotada herhangi bir değişiklik olduğunda bildirimi gizle
    updateInterests({ showNotification: false });
    if(interests.isSubmitted) {
      updateInterests({ isLoading: true })
      fetch(baseURL + "/user/interests", {
        method: "GET",
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then((response) => {
        return response.json()
      }).then((data) => {
        updateInterests({ buttons: data.interests})
        updateInterests({ isSubmitted: false })
        updateInterests({ newFetchedButtons: data.interests })
       
      })
      .finally(() => {
        updateInterests({ isLoading: false })
      })
    } 

  }, [location]); // location değiştiğinde useEffect tetikleni


  return (
    <div className="container">
      <div className="row">
        <div className="col-12 col-lg-8">
          <h1 className='fs-3 mb-3'>İlgilerim</h1>

       <form onSubmit={handleSubmit} action="/user/interests" method='POST'>

        <select onChange={handleCategoryChange} value={interests.selectedCategory} className={`form-control ${styles.select}`}>
              <option value="">Kategori Seçiniz</option>
              {Object.keys(eventSubCategories).map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <select onChange={handleSubCategoryChange} value="" className={`form-control ${styles.select}`} disabled={!interests.selectedCategory}>
              <option value="">İlgilerinizi Seçiniz</option>
              {interests.subCategories.map((subCategory) => (
                <option key={subCategory} value={subCategory}>{subCategory}</option>
              ))}
            </select>
            <div className="mt-3">
            {!interests.isLoading ? (
              interests.buttons.map((buttonLabel, index) => (
                <button type='button' key={index} onClick={() => handleButtonClick(index)} className='btn btn-info me-2 my-1'>
                  {buttonLabel} <span className={styles.btnDeleteicon}>×</span>
                </button>
              ))
            ) : null}

            </div>
            <button type="submit" className='btn btn-dark mt-5 float-end' disabled={interests.isLoading ? true : false}>Kaydet</button>
            
       </form>
       {interests.isLoading && <div className="spinner-border text-primary" role="status">
        <span className="sr-only">Yükleniyor...</span>
      </div>}
      {interests.showNotification && (
      <>    
<h5 className={styles.notification}>
  <span className={styles.notificationMessage}>{interests.notification}</span>
  <button onClick={closeNotification} className={styles.closeNotification}>×</button>
</h5>

      </>
 
      )}
  
        </div>
      </div>
    </div>
  );
};

export default Interests