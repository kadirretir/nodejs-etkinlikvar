import React, {useState, useEffect, useRef} from 'react'
import styles from './indexfilter.module.css'


const IndexFilter = () => {
    const [search, setSearch] = useState("")
    const [loading, setLoading] = useState(false)
    const [searchResults, setSearchResults] = useState([])
    const [searchAPI, setSearchAPI] = useState([])


    const searchRef = useRef()
    const searchResultsRef = useRef()



    const isTyping = search.replace(/\s+/, '').length > 0;
    useEffect(() => {
        const getProvinces = async () => {
          setLoading(true);
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
           
            const flattenedProvincesDistricts = [...getProvincesToArray.flat()];
           setSearchAPI(flattenedProvincesDistricts);
          } catch (error) {
            throw new Error(error);
          } finally {
            setLoading(false);
          }
        
        }
      
        if(isTyping) {
            getProvinces();
        } 
    
      }, [search]);


      useEffect(() => {
        if (isTyping) {
      
          const districtsWithCity = searchAPI.slice(81, 1053).map((district) => `${district.name}, ${district.city}`);
          const provinceNames = searchAPI.filter((names) => {return names}).slice(0,81)
    
          const combinedArray = provinceNames.concat(districtsWithCity);
          const filterResults = combinedArray.filter((names) => names.toLocaleUpperCase('TR').includes(search.toLocaleUpperCase('TR')));
          setSearchResults(filterResults);
        } else {
          setSearchResults([]);
        }
      }, [search, searchAPI]);

      useEffect(() => {
            document.addEventListener("mousedown", handleClickOutside)

            return () => {
                document.removeEventListener("mousedown", handleClickOutside)
            }
      }, [])

      const handleClickOutside = (e) => {
        if(searchRef.current && searchResultsRef.current && !(searchRef.current.contains(e.target) || searchResultsRef.current.contains(e.target))) {
          setSearchResults("");

        }
      }

      const handleProvinceClick = (e) => {
        const areaName = e.currentTarget.querySelector("#areaName").textContent;
        searchRef.current.value = areaName
        setSearchResults("");

        const form = searchRef.current.closest('form');
        if (form) {
          form.submit()
        }

      }


  return (
    <>
            <div className={styles.searchContainer}>
         
           
              <div className={styles.InputContainer}>
                
              <input
                type="search"
                ref={searchRef}
                className={`form-control ${isTyping ? styles.typing : null}`}
                name="searchforeventlocation"
                onChange={(e) => setSearch(e.target.value)}
                id="searchforeventlocation"
                placeholder="İl veya İlçe Arayın..."
              />

            <div className={styles.iconContainer}>
            <i className={`fa fa-search ${styles.iconDefault}`}></i>
            </div>
              </div>

 
                  {isTyping && typeof searchResults !== "string" && (
                      <div ref={searchResultsRef} className={styles.searchResults}> 
                    
                    <div className="fs-5 text-left py-3">
                        {searchResults.length > 0 && isTyping && loading === false ? (
                          <>
                            {searchResults.slice(0,10).map((provinces, index) => (
                                <div className={`d-flex flex-row align-items-center ${styles.searchResultsItems}`} onClick={handleProvinceClick} key={index}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="var(--first-color)" style={{marginRight: "0.3rem"}} className="bi bi-geo-alt-fill" viewBox="0 0 16 16">
                                    <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
                                  </svg>
                              <div id='areaName'>
                               {provinces}
                              </div>
                              </div>
                            ))}
                          </>
                        ) : null}
                     </div>
                     
                        {searchResults && loading && (
                          <div className={styles.resultNotFound}>
                            <div className="spinner-border" role="status">
                            <span className="visually-hidden">Yükleniyor...</span>
                        </div>
                        </div>
                         
                        )}
                        {searchResults.length <= 0 && typeof searchResults !== "string" && loading === false && (
                          <div className={styles.resultNotFound}>
                            "{search}" ile bağlantılı bir bölge bulamadık
                          </div>
                        )}
                      </div>
                    )}
                  </div>
    </>
  
  )
}

export default IndexFilter