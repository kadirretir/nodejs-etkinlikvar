import React, { useState, useEffect, useRef } from 'react';
import debounce from 'lodash.debounce';
import styles from './indexfilter.module.css';

const IndexFilter = () => {
    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const searchRef = useRef(); 
    const searchResultsRef = useRef();

    useEffect(() => {
        const getProvinces = async () => {
            try {
                const response = await fetch("https://turkiyeapi.cyclic.app/api/v1/provinces?fields=name,districts");
                const data = await response.json();
                const getProvincesToArray = data.data.map((names) => names.name);
                const districts = data.data.map((data) =>
                    data.districts.map((names) => ({
                        name: names.name,
                        city: data.name
                    }))
                );

                const districtsArray = districts.flat();
                getProvincesToArray.push(districtsArray);


                const districtsWithCity = districtsArray.map((district) => `${district.name}, ${district.city}`);
                const provinceNames = getProvincesToArray.slice(0, getProvincesToArray.length - 1);

                const combinedArray = provinceNames.concat(districtsWithCity);
                const filterResults = combinedArray.filter((names) => names.toLocaleUpperCase('TR').includes(search.toLocaleUpperCase('TR')));
                setSearchResults(filterResults);
            } catch (error) {
                throw new Error(error);
            } 

        }

        const debouncedGetProvinces = debounce(getProvinces, 300); // 300 milisaniyelik gecikme
        if (search.trim().length > 0) {
            debouncedGetProvinces();
        }

        return () => {
            debouncedGetProvinces.cancel(); // Temizleme işlevi bileşen yeniden yüklenirken çalışır.
        }

    }, [search]);


    // close the search result window

    useEffect(() => {
      document.addEventListener("mousedown", handleClickOutside)

      return () => {
          document.removeEventListener("mousedown", handleClickOutside)
      }
}, [])

const handleClickOutside = (e) => {
  if (
      searchRef.current &&
      searchResultsRef.current &&
      !(searchRef.current.contains(e.target) || searchResultsRef.current.contains(e.target)) &&
      !e.target.closest(`.${styles.searchResults}`)
  ) {
      setSearchResults([]);
  }
}


    const handleInputChange = (e) => {
        setSearch(e.target.value);
    }

    const handleProvinceClick = (e) => {
      e.preventDefault(); // Formun otomatik olarak gönderilmesini engelle

      const areaName = e.currentTarget.querySelector("#areaName").textContent;
      setSearchResults("");


  
      const form = searchRef.current.closest('form');
      if (form) {
        const input = form.querySelector('[name="searchforeventlocation"]');
        if (input) {
            input.value = areaName; // Inputun değerini areaName olarak ayarla
            form.submit();
        }
    }
    }

    return (
        <>
            <div className={styles.searchContainer}>
                <div className={styles.InputContainer}>
                    <input
                        type="search"
                        ref={searchRef}
                        className={`form-control ${search.trim().length > 0 ? styles.typing : null}`}
                        name="searchforeventlocation"
                        onChange={handleInputChange}
                        id="searchforeventlocation"
                        placeholder="İl veya İlçe Arayın..."
                    />
                    <div className={styles.iconContainer}>
                        <i className={`fa fa-search ${styles.iconDefault}`}></i>
                    </div>
                </div>

                {search.trim().length > 0 && searchResults.length > 0 && (
                    <div className={`${styles.searchResults} `} onClick={handleProvinceClick}>
                        {searchResults.map((provinces, index) => (
                            <div ref={searchResultsRef} className={`d-flex flex-row align-items-center ${styles.searchResultsItems}`} key={index}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="var(--first-color)" style={{ marginRight: "0.3rem" }} className="bi bi-geo-alt-fill" viewBox="0 0 16 16">
                                    <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
                                </svg>
                                <div id='areaName'>{provinces}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

export default IndexFilter;
