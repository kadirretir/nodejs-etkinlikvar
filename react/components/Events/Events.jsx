import React, { useState, useEffect, useRef, useCallback, memo, lazy } from "react";
import styles from './events.module.css'
import useStickyOnTop from "./FiltersIntersection";
const SingleEvents = lazy(() => import("./SingleEvents/SingleEvents"));
const TrendingEvents = lazy(() => import("./TrendingEvents"));
const TrendingCategories = lazy(() => import("./TrendingCategories"));

const Events = memo(({ userEvents,
   userData,
    generalSearchResults, 
    usercity, 
    interestsearch,
     searchresults, 
     categoryData, 
     createdEventMessage,
      trendingEvents, 
      popularCategories }) => {
  const [filteredEvents, setFilteredEvents] = useState([])
  const [loading, setLoading] = useState(false);
  const [loadingFilter, setLoadingFilter] = useState(false)
  const [selectedDate, setSelectedDate] = useState("Bugün")
  // GET SEARCHED STRING FROM URL
  // const interestCategory = interestsearch.interest ? interestsearch.interest : "Kategori";
  const [selectedCategory, setSelectedCategory] = useState("Kategori")

  const getIndexSearchData = typeof searchresults === "object" && typeof searchresults.searchforeventlocation === "string" ?  searchresults.searchforeventlocation : ""
  const selectProvinceIf = getIndexSearchData === "" && usercity !== "Not found" ? usercity : getIndexSearchData;


  const [selectedProvince, setSelectedProvince] = useState(selectProvinceIf)
  const [searchAPI, setSearchAPI] = useState([])

  const [search, setSearch] = useState("")
  const [searchResults, setSearchResults] = useState([])

// INFINITE SCROLL STATES
 
  const [page, setPage] = useState(1);
  const [hasMorePage, setHasMorePage] = useState(true);
 

  // Search REFS
  const searchRef = useRef()
  const searchResultsRef = useRef() 

  // INTERSECTION API FOR PAGES
  const observer = useRef()
  const lastEventElementRef = useCallback(node => {
    if (loadingFilter) return 
    if(observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
        if(entries[0].isIntersecting && hasMorePage && filteredEvents.length >= 20) {
            setPage(prevPage => prevPage + 1)
        }
  })
  if(node) observer.current.observe(node)
  }, [hasMorePage, loadingFilter]);



  // INTERSECTION API FOR FILTERS STICKY

  const { elementRef, isSticky } = useStickyOnTop();
 
// get dates
// const {getDate, getTomorrowDate, getWeekRange, getWeekendRange, getNextWeekRange} = getDates

  const handleClickDate = (e) => {
    setSelectedDate(e.target.innerHTML)
  }

  const handleClickCategory = (e) => {
    setSelectedCategory(e.target.innerHTML)
  }
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
      }
      setLoading(false);
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
      setSearchResults([])
    }
  }, [search, searchAPI]);
  const handleCategoryLeft = (event) => {
    setSelectedCategory(event)
    // window.scrollTo({ top: 0, behavior: 'smooth' });
  }

 
const fetchDataByFilterGeneral = async (page, eventsIds, specificDate, category, province) => {
  try {
      const response = await fetch('/events/requestedevents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ page, eventsIds, specificDate, category, province })
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);

      }
  
      const filteredEvents = await response.json();
      return filteredEvents;
  } catch (error) {
      throw new Error(error);
  }
};

const fetchCallBack = async (page, category, province) => {
  try {
    let resultsIds = [];
    if(generalSearchResults.length > 0) {
      resultsIds = generalSearchResults.map((result) => {
        return result._id;
      });
    }

    let filteredData = [];

    switch (selectedDate) {
      case "Bugün":
         filteredData = await fetchDataByFilterGeneral(page, resultsIds, "Bugün", category, province)
         break;
      case "Yarın":
        filteredData = await fetchDataByFilterGeneral(page, resultsIds, "Yarın", category, province);
        break;
      case "Bu Hafta":
        filteredData = await fetchDataByFilterGeneral(page, resultsIds, "Bu Hafta", category, province);
        break;
      case "Bu Haftasonu":
        filteredData = await fetchDataByFilterGeneral(page, resultsIds, "Bu Haftasonu", category, province);
        break;
      case "Önümüzdeki Hafta":
        filteredData = await fetchDataByFilterGeneral(page, resultsIds, "Önümüzdeki Hafta", category, province);
        break;
      default:
        return []; // Varsayılan olarak boş bir dizi döndür
    }
    return filteredData;
  } catch (error) {
    throw new Error(error)
  }
}
const fetchDataFromMain = async () => {
  setLoadingFilter(true)
  try {
    let filteredData = [];
      if(selectedCategory !== "Kategori" && selectedProvince !== "") {
        filteredData = await fetchCallBack(page, selectedCategory, selectedProvince);
      } else if (selectedCategory !== "Kategori") {
        filteredData = await fetchCallBack(page, selectedCategory, undefined);
      } else if(selectedProvince !== "") {
        filteredData = await fetchCallBack(page, undefined, selectedProvince)
      } else {
        filteredData = await fetchCallBack(page)
      }
      
      console.log(filteredData)
   
        
      setFilteredEvents(filteredData);


 
  } catch (error) {
    throw new Error(error)
  } finally {
      setLoadingFilter(false);
  }
}


useEffect(() => {
  // selectedDate, selectedCategory veya selectedProvince değiştiğinde page'i 1'e ayarla
  setHasMorePage(true);
  setPage(1);
  setFilteredEvents([]); // Etkinlikleri temizle
}, [selectedDate, selectedCategory, selectedProvince]);


useEffect(() => {
  if (page === 4) {
    setHasMorePage(false);
  } else {
    setHasMorePage(true)
  }
}, [page])

useEffect(() => {
  if ((page <= 4 && hasMorePage)) {
    console.log("useeffect worked", page)
    fetchDataFromMain();
  } 
}, [page, selectedCategory, selectedDate, selectedProvince])



// useEffect(() => {
//   // Page değiştiğinde sadece fetchDataFromMain'i çağır
//   if (didMountRef.current) {
//     fetchDataFromMain();
//   } else {
//     didMountRef.current = true;
//   }
// }, [page]);











//   const filterData = (fetchedData) => {
//       // if (selectedCategory !== "Kategori" && selectedProvince !== "") {
//       //   // Hem kategoriye hem de province'e göre filtreleme yapılacak
//       //   const getNewFilteredArray = fetchedData.filter((event) => {
//       //     // Kategoriye göre filtreleme
//       //     const categoryMatches = event.eventCategory === selectedCategory;
//       //     // Province'e göre filtreleme
//       //     const selectedParts = selectedProvince.split(",").map(s => s.trim());
//       //     const selectedCity = selectedParts.length === 2 ? selectedParts[1].toLocaleUpperCase('TR') : selectedParts[0].toLocaleUpperCase('TR');
//       //     const selectedDistrict = selectedParts.length === 2 ? selectedParts[0].toLocaleUpperCase('TR') : "";
      
//       //     const provinceMatches = event.cityName && event.cityName.toLocaleUpperCase('TR') === selectedCity;
//       //     const districtMatches = event.districtName && event.districtName.toLocaleUpperCase('TR').includes(selectedDistrict);
      
//       //     return categoryMatches && provinceMatches && (selectedDistrict ? districtMatches : true);
//       //   });
//       //   setFilteredEvents(getNewFilteredArray);
//       // } 
//       // else if (selectedCategory !== "Kategori") {
//       //   const filterByCategory = fetchedData.filter((event) => event.eventCategory === selectedCategory);
//       //   setFilteredEvents(filterByCategory);
//       // }
     
// }

// useEffect(() => {
//   if(selectedDate !== "Bugün" || selectedCategory !== "Kategori" || selectedProvince !== "") {
//     setIsFiltersChanged(true)
//   }
// }, [selectedDate, selectedCategory, selectedProvince])



// useEffect(() => { 
//   // if(isFiltersChanded && page > 1) {
//   //   setPage(1)
//   //   setHasMorePage(true)
//   //   console.log("PAGE 1'DEN BÜYÜK VE SELECTEDDATE BUGÜN DEĞİL")
//   // }
//   console.log("ortadaki main useEffecti. Page ve sethasmore ayarlanıyor")
// }, [selectedDate, selectedProvince, selectedCategory, isFiltersChanded]);



// FILTERING CATEGORY 
// const fetchDataByOnlyCategory = async (category, data) => {
//   try {

//     const filterByCategory = data.filter((event) => event.eventCategory === selectedCategory);

//         const newMatchingEvents = filterByCategory.filter(newEvent => 
//           !category.some(filteredEvent => filteredEvent._id === newEvent._id)
//         );

//         return newMatchingEvents;
     
//   } catch (error) {
//     // Hata durumunda gerekli işlemleri yapabilirsiniz
//     console.error(error);
//   } 
// };


  useEffect(() => {
// SET SEARCH INPUT IF USER SEARCHED FROM MAIN PAGE 
if(typeof getIndexSearchData === "string" && getIndexSearchData !== "") {
  searchRef.current.value = getIndexSearchData
}
  }, [])

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
  
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    }
  }, [])
  
  const handleOutsideClick = (event) => {
    if (searchRef.current && searchResultsRef.current && !(searchRef.current.contains(event.target) || searchResultsRef.current.contains(event.target))) {
      setSearchResults("");
    }
  };
  
  const handleReset = () => {
    setSelectedCategory("Kategori")
    setSelectedDate("Bugün")
    searchRef.current.value = ""
    setSelectedProvince("")
  }
  
  const handleProvinceClick = (e) => {
    // Tıklanan elemanın içindeki 'areaName' id'sine sahip elemanı bul
    const areaNameElement = e.currentTarget.querySelector('#areaName');
    // 'areaName' id'sine sahip elemanın metin içeriğini al
    const areaName = areaNameElement ? areaNameElement.textContent : '';
  
    // Eğer bir 'areaName' bulunamazsa, fonksiyonu sonlandır
    if (!areaName) return;
  
    // Arama kutusunun değerini güncelle
    searchRef.current.value = areaName;
    // Arama sonuçlarını temizle
    setSearchResults("");
    // Seçilen bölgeyi güncelle
    setSelectedProvince(areaName);
  }

 const handleAnimationEnd  = (e) => {
  e.target.style.display = 'none';
 }
// KULLANICI VAR MI YOK MU TESPIT ET
 const isUserRegistered = Object.keys(userData).length !== 0;

 // ARAMA ISMINI AL
// URL'deki sorgu dizesini al
const queryString = window.location.search;

// URLSearchParams nesnesi ile sorgu parametrelerini işle
const urlParams = new URLSearchParams(queryString);

// 'searchquery' parametresinin değerini al
const searchQuery = urlParams.get('searchquery');

  return (
    <>
      <section id={styles.eventsId}  >
      <div className="container">
          <div className="d-flex flex-column mb-5">
              
              {Object.keys(userData).length !== 0 ? (
                    <h1 className={`fs-2 text-primary-emphasis text-capitalize ${styles.eventsTitle}`}>Hoş Geldin {userData.username} &nbsp;
                    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="currentColor" className="bi bi-emoji-smile" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                    <path d="M4.285 9.567a.5.5 0 0 1 .683.183A3.5 3.5 0 0 0 8 11.5a3.5 3.5 0 0 0 3.032-1.75.5.5 0 1 1 .866.5A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1-3.898-2.25.5.5 0 0 1 .183-.683M7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5m4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5"/>
                  </svg></h1>
              ) : (
                <h1 className={`fs-2 text-primary-emphasis text-end text-capitalize ${styles.eventsTitle}`}>Hoş Geldin Misafir &nbsp;
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="currentColor" className="bi bi-emoji-smile" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                <path d="M4.285 9.567a.5.5 0 0 1 .683.183A3.5 3.5 0 0 0 8 11.5a3.5 3.5 0 0 0 3.032-1.75.5.5 0 1 1 .866.5A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1-3.898-2.25.5.5 0 0 1 .183-.683M7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5m4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5"/>
              </svg></h1>
              )}

              {searchQuery && (
                  <div className="d-flex justify-content-center">
                    <h1 className="fs-4 align-self-center mb-2 text-secondary"><span className="text-dark">{searchQuery}</span> ile Alakalı Sonuçlar Görüntüleniyor</h1>
                  </div>
                )}
              </div>
          <div className="row rounded-right-top rounded-right-bottom">
             {/* Kullanıcı girişi yaptıysa */}
            {isUserRegistered && (
               <>
                <div className="col-lg-4">
                <div className="container">
                      <div className="row my-5">
                        <div className="col-12">
                          {Object.keys(userData).length !== 0 && (
                                <div className={styles.yourEventsBackground}>
                                <h1 className="fs-5 text-center py-3">Yaklaşan Etkinlikleriniz</h1>
                                <p className="mx-auto text-center ">
                                  <a className="fs-6 link-dark link-offset-2 link-underline-opacity-75 link-underline-opacity-100-hover" href="/user/profile?etkinliklerim">Hepsini Gör</a>
                                </p>
                                <div className={styles.yourEventsInside}>
                                  
                                  {userEvents && userEvents.length > 0 ? (
                                    
                                      <>
                                      {userEvents.map((singular, id) => {
                                        
                                        const eventDate = new Date(singular.date).setHours(0, 0, 0, 0);
                                        const today = new Date().setHours(0, 0, 0, 0);
                                        const oneDay = 24 * 60 * 60 * 1000; // milisaniyeler cinsinden bir gün
                                        
                                        const dayDifference = (eventDate - today) / oneDay;
                                        
                                        let displayDate;
                                        if (dayDifference === 0) {
                                          displayDate = "Bugün";
                                        } else if (dayDifference === 1) {
                                          displayDate = "Yarın";
                                        } else if (dayDifference === -1) {
                                          displayDate = "Dün";
                                        } else {
                                          displayDate = new Date(singular.date).toLocaleDateString("tr-TR", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                          });
                                        }
                                        

                                       return (
                                        
                                        <div className="card mb-2" key={id} style={{maxWidth: "540px"}}>
                                        <a className='link-opacity-100-hover' href={`/events/${singular._id}`}>
                                        <div className="row g-0">
                                          <div className="col-md-4">
                                            <img src={`../${singular.eventImage}`} className="img-fluid rounded-start" alt="eventImage" />
                                          </div>
                                          <div className="col-md-8">
                                            <div className="card-body">
                                            <p className="card-text"><small className="text-secondary" style={{fontSize: "1rem"}}>{displayDate}</small></p>
                                              <h5 className="card-title mt-2 text-secondary-emphasis">Akşam sabah kahvaltısı yapacağız</h5>
                                              <p className="card-text"><small className="text-body-secondary">
                                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"  fill="currentColor" style={{color: "var(--first-color)"}} className="bi bi-geo-alt-fill me-1" viewBox="0 0 16 16">
                                                <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
                                              </svg>
                                                {singular.cityName + ',' + ' ' + singular.districtName}
                                                </small></p>
                                            </div>
                                          </div>
                                        </div>
                                        </a>

                                      </div>
                                      )})}
                                      </>
                                  ) : (
                                    <>
                                         <p className="text-secondary text-center py-1">Henüz bir etkinliğe katılmadınız.</p>
                                      <p className="text-center py-1">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-view-stacked" viewBox="0 0 16 16">
                                        <path d="M3 0h10a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2m0 1a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zm0 8h10a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2m0 1a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1z"/>
                                      </svg>
                                      </p>
                                      <p className="text-center py-1 text-secondary">Katıldığınız ve yaklaşan etkinlikleriniz burada gözükür.</p>
                                    </>
                                  )}
                                 
                                </div>
                          </div>
                          )}
                        </div>
                      </div>
                      <div className="row">
                      <div className="col-12"> 
                               <TrendingCategories 
                               popularCategories={popularCategories}
                               handleCategoryLeft={handleCategoryLeft}
                               />
                        </div>
                      </div>
                      {userData.membershipLevel === "free" && (
                            <div className="row">
                            <div className="col-12">
                            <div className={styles.marketingBackground}>
                                <p className={`text-start p-3 text-light ${styles.directPremium}`}><span className={styles.badge}>etkinlikdolu+</span> Üyesi ol,<br/> İlgini Paylaştığın İnsanlarla Buluş!</p>
                                <a href="/pricing" type="button" className="btn btn-warning ms-3">Ücretsiz Denemeni Başlat</a>
                            </div>
                            </div>
                      </div>
                      )}    
                </div>
              </div>

             
              </>
            )}
{/* 
className={`${isUserRegistered ? 'col-lg-8' : 'col-lg-9'} pb-5`}            */}
            
            <div className="pb-5 col-lg-8" >
            {Object.keys(createdEventMessage).length !== 0 ? (
            <h1 
            onAnimationEnd={handleAnimationEnd} 
            className={`fs-5 alert alert-success ${styles.alertMessage}`}>
               {createdEventMessage}
            </h1>
            ) : null }
              <div ref={elementRef} 
              className={`d-flex flex-column flex-md-row justify-content-start gap-2 mb-5 ${styles.stickyFilters} ${isSticky ? styles.sticky : ""}`}>
                <div className={styles.searchContainer}>
                  <input type="search" className={` ${styles.searchInput}`} ref={searchRef}  onChange={(e) => setSearch(e.target.value)} placeholder="Şehir, İlçe..." autoComplete="off" />
                    <span className={styles.searchIcon}><i className="fas fa-search"></i></span>
                  {isTyping && typeof searchResults !== "string" && (
                      <div className={styles.searchResults} ref={searchResultsRef}> 
                    
                    <div className="fs-5 text-center py-3">
                        {searchResults.length > 0 && isTyping && loading === false ? (
                          <>
                            <div>Lütfen Seçiniz...</div>
                            <hr />
                     
                            {searchResults.slice(0,10).map((provinces, index) => (
                                    <div className={`d-flex flex-row align-items-center ${styles.searchResultsItems}`} onClick={handleProvinceClick} key={index} style={{paddingTop: "1.1rem", paddingBottom:"1.1rem"}}>
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
                        {searchResults.length === 0 && typeof searchResults !== "string" && loading === false && (
                          <div className={styles.resultNotFound}>
                            "{search}" ile bağlantılı bir bölge bulamadık
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                <div className={`dropdown-center ${styles.searchElements}`}>
                    <button className={`btn px-5 w-100 dropdown-toggle ${isSticky ? "btn-light" : "btn-outline-secondary"}`} style={{padding: "0.6rem 0"}} type="button" data-bs-toggle="dropdown" aria-expanded="false">
                      {selectedDate}
                    </button>
                    <ul className="dropdown-menu">
                      <li onClick={handleClickDate}><a className="dropdown-item"  style={{cursor: "pointer"}}>Bugün</a></li>
                      <li onClick={handleClickDate}><a className="dropdown-item" style={{cursor: "pointer"}}>Yarın</a></li>
                      <li onClick={handleClickDate}><a className="dropdown-item"  style={{cursor: "pointer"}}>Bu Hafta</a></li>
                      <li onClick={handleClickDate}><a className="dropdown-item"  style={{cursor: "pointer"}}>Bu Haftasonu</a></li>
                      <li onClick={handleClickDate}><a className="dropdown-item"  style={{cursor: "pointer"}}>Önümüzdeki Hafta</a></li>
                    </ul>
                </div>

                <div className={`dropdown-center ${styles.searchElements}`}>
                    <button className={`btn w-100 px-5 dropdown-toggle ${isSticky ? "btn-light" : "btn-outline-secondary"}`} style={{padding: "0.6rem 0"}} type="button" data-bs-toggle="dropdown" aria-expanded="false">
                      {selectedCategory}
                    </button>
                    <ul className={`dropdown-menu ${styles.scrollableMenu}`}>
                      {categoryData.map((category, index) => {
                        return (
                          <li key={index} onClick={handleClickCategory}><a className="dropdown-item" href="#">{category}</a></li>
                        )
                      })}
                    </ul>
                </div>

                {(selectedCategory !== "Kategori" || selectedDate !== "Bugün" || selectedProvince !== "" ) && (
                  <button onClick={handleReset} className="btn btn-light">Sıfırla</button>
                )}
              </div>
              {(selectedDate !== "Bugün" || selectedCategory !== "Kategori" || selectedProvince !== "") && !loadingFilter && (
                  <h1 className="fs-5 my-2">Filtreleriniz:</h1>
              )}
             <div className="my-2 d-inline-flex align-items-center justify-content-start">
              {selectedDate !== "Bugün" && !loadingFilter && (
                    <button onClick={() => setSelectedDate("Bugün")} className={`${styles.cancelFilterButtons} me-1`} type="button">{selectedDate}</button>
              )}
              {selectedCategory !== "Kategori" && !loadingFilter && (
                   <button onClick={() => setSelectedCategory("Kategori")} className={`${styles.cancelFilterButtons} me-1`} type="button">{selectedCategory}</button>
              )}
              {selectedProvince !== "" && !loadingFilter && (
                  <button onClick={() => {setSelectedProvince(""); searchRef.current.value = ""}} className={`${styles.cancelFilterButtons} me-1`} type="button">{selectedProvince}</button>
              )}

             </div>
         
                 <SingleEvents
                 lastEventElementRef={lastEventElementRef}
                 selectedDate={selectedDate}
                 loadingFilter={loadingFilter}
               filteredEvents={filteredEvents} />
         
            </div>

          
                {/* KULLANICI GİRİŞİ YAPILMADI ISE TREND OLAN EVENTLERI VE KATEGORİLERİ SAYFANIN SAĞINDA GOSTER */}
            {!isUserRegistered && (
                  <div className="col-lg-4">
                       <div className="container">
                          <div className="row my-5">
                             <div className="col-12">
                                        <TrendingEvents
                                          trendingEvents={trendingEvents}
                                           />
                                           <TrendingCategories 
                                           handleCategoryLeft={handleCategoryLeft}
                                           popularCategories={popularCategories}
                                           />
                              </div>
                            </div>
                        </div>
           
            </div>
            )}
           
          

   
          </div>
        </div>
      </section>
    </>
  )});


export default Events;
