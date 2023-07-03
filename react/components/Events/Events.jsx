import React, { useState, useRef, useEffect } from "react";
import styles from './events.module.css'
import SingleEvents from "./SingleEvents";
import getDates from './getDates'

const Events = ({ eventsData, userData, searchresults, categoryData }) => {
  const [filteredEvents, setFilteredEvents] = useState([])
  const [newFilteredEvents, setNewFilteredEvents] = useState([])
  const [loading, setLoading] = useState(false);
  const [loadingFilter, setLoadingFilter] = useState(false)
  const [selectedDate, setSelectedDate] = useState("Bugün")
  const [selectedCategory, setSelectedCategory] = useState("Kategori")
  const [searchAPI, setSearchAPI] = useState([])

  const [search, setSearch] = useState("")
  const [searchResults, setSearchResults] = useState([])

// get dates
const {getDate, getTomorrowDate, getWeekRange, getWeekendRange} = getDates

// const getUserLocation = userData.location ? userData.location.replace(/^\w/, (c) => c.toUpperCase()) : "";

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
        const getDistrictsNames = data.data.map((data) => data.districts.map((names) => names.name));
        const districtsArray = getDistrictsNames.flat();
         
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
      const filterResults = searchAPI.filter((names) => names.toLowerCase().includes(search.toLowerCase()));
      setSearchResults(filterResults);
    } else {
      setSearchResults([])
    }
  }, [search, searchAPI]);




  // FILTER BY DATES
  useEffect(() => {
    const fetchData = async () => {
      setLoadingFilter(true); // Filtreleme işlemi başladığında loadingFilter'ı true olarak ayarla
  
      try {
        const fetchMyData = await fetch("/events/requestedevents");
        const data = await fetchMyData.json();
      
        let filteredData = [];
  
        if (selectedDate === "Bugün") {
          const formattedDate = getDate();
          filteredData = data.filter((event) => event.date.includes(formattedDate));
        } else if (selectedDate === "Yarın") {
          const formattedDate = getTomorrowDate();
          filteredData = data.filter((event) => event.date.includes(formattedDate));
        } else if (selectedDate === "Bu Hafta") {
          const { startOfWeek, endOfWeek } = getWeekRange();
          filteredData = data.filter((event) => {
            const eventDate = new Date(event.date);
            return eventDate >= startOfWeek && eventDate <= endOfWeek;
          });
        } else if (selectedDate === "Bu Haftasonu") {
          const { startOfWeekend, endOfWeekend } = getWeekendRange();
          filteredData = data.filter((event) => {
            const eventDate = new Date(event.date);
            return eventDate >= startOfWeekend && eventDate <= endOfWeekend;
          });
        }
  
        if (selectedCategory !== "Kategori") {
          const filterByCategory = filteredData.filter((event) => event.eventCategory === selectedCategory);
          setFilteredEvents(filterByCategory);
        } else {
          setFilteredEvents(filteredData);
        }
      } catch (error) {
        // Hata durumunda gerekli işlemleri yapabilirsiniz
        console.error(error);
      } finally {
        setLoadingFilter(false); // Filtreleme işlemi tamamlandığında loadingFilter'ı false olarak ayarla
      }
    };
  
    fetchData();
  }, [selectedDate, selectedCategory]);
  
  
  useEffect(() => {
    const fetchData = async () => {
      setLoadingFilter(true); // Filtreleme işlemi başladığında loadingFilter'ı true olarak ayarla
  
      try {
        const fetchMyData = await fetch("/events/requestedevents");
        const data = await fetchMyData.json();
  
        const filterByCategory = data.filter((event) => event.eventCategory === selectedCategory);
  
        // Yeni eşleşen etkinlikleri bul
        const newMatchingEvents = filterByCategory.filter((event) => filteredEvents.some((filteredEvent) => filteredEvent._id === event._id));
  
        setFilteredEvents((prevFilteredEvents) => {
          // Mevcut filteredEvents dizisini kopyala
          const updatedFilteredEvents = [...prevFilteredEvents];
  
          // Yeni eşleşen etkinlikleri tek tek kontrol et
          newMatchingEvents.forEach((newEvent) => {
            // Yalnızca filteredEvents içinde olmayanları ekle
            if (!updatedFilteredEvents.some((filteredEvent) => filteredEvent._id === newEvent._id)) {
              updatedFilteredEvents.push(newEvent);
            }
          });
  
          return updatedFilteredEvents;
        });
  
        console.log("çalıştı");
      } catch (error) {
        // Hata durumunda gerekli işlemleri yapabilirsiniz
        console.error(error);
      } finally {
        setLoadingFilter(false); // Filtreleme işlemi tamamlandığında loadingFilter'ı false olarak ayarla
      }
    };
  
    if (selectedCategory !== "Kategori") {
      fetchData();
    }
  }, [selectedCategory]);
  
  
  
  



  // FIRSTLY, GET TODAYS EVENTS
  useEffect(() => {
    const formattedDate = getDate();
const filterByToday = eventsData.filter((event) => event.date.includes(formattedDate));
setFilteredEvents(filterByToday);
  }, [])

  const handleReset = () => {
    setSelectedCategory("Kategori")
    setSelectedDate("Bugün")
  }
  
  return (
    <>
      <section id={styles.eventsId}  >
      <div className="container">
          <div className="row">
            <div className="col-lg-10 offset-lg-1">
                <div className="d-flex justify-content-between align-items-center">
                <h1 className="fs-2 text-primary-emphasis">Etkinliklere Göz Atın</h1>
                <h1 className="fs-5 text-primary-emphasis"><a href="/pricing">Sen de Etkinlik Oluştur(10 Gün Deneme)  <i className="fa-solid fa-crown" style={{color: "var(--first-color)"}} /></a></h1>
                </div>
              <hr className="mb-3" />

              <div className="d-flex justify-content-start gap-2 mb-5">
                <div className={styles.searchContainer}>
                  <input type="text" className="form-control" value={search}  onChange={(e) => setSearch(e.target.value)} placeholder="İstanbul, Ankara, İzmir..." />
                  {isTyping && (
                      <div className={styles.searchResults}> 
                        {searchResults && loading === false && searchResults.map((provinces, index) => {
                          return (
                            <div className={styles.searchResultsItems} key={index}>
                              {provinces}
                            </div>
                          )
                        })}
                        {searchResults && loading && (
                          <div className={styles.resultNotFound}>
                            <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        </div>
                         
                        )}
                        {searchResults.length === 0 && loading === false && (
                          <div className={styles.resultNotFound}>
                            "{search}" ile bağlantılı bir ilçe bulamadık
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                <div className="dropdown-center">
                    <button className="btn btn-outline-secondary py-2 px-5 dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                      {selectedDate}
                    </button>
                    <ul className="dropdown-menu">
                      <li onClick={handleClickDate}><a className="dropdown-item" href="#">Bugün</a></li>
                      <li onClick={handleClickDate}><a className="dropdown-item" href="#">Yarın</a></li>
                      <li onClick={handleClickDate}><a className="dropdown-item" href="#">Bu Hafta</a></li>
                      <li onClick={handleClickDate}><a className="dropdown-item" href="#">Bu Haftasonu</a></li>
                    </ul>
                </div>

                <div className="dropdown-center">
                    <button className="btn btn-outline-secondary py-2 px-5 dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
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

                <button onClick={handleReset} className="btn btn-light">Sıfırla</button>
              </div>
              {/* {loading ? (
                <>
                     <h2 className="placeholder col-12 placeholder-xs"></h2>
                     <hr className="border border-2 border-secondary" />
                  <div className="card mb-3 rounded-0 border-0" style={{ maxWidth: "640px" }}>
                  <a href="#">
                    <div className="row g-0">
                      <div className="col-md-4">
                        <img src="/img-placeholder.png" className="img-fluid rounded-start card-img-top" alt="..." />
                      </div>
                      <div className="col-md-8">
                        <div className="card-body">
                          <h5 className="card-title placeholder-glow col-6"></h5>
                          <p className="card-text placeholder col-6"></p>
                          <p className="card-text placeholder-glow col-6">
                            <b className="text-body-secondary placeholder col-6"></b>
                          </p>
                          <small></small>
                        </div>
                      </div>
                    </div>
                  </a>
                </div>

                <div className="card mb-3 rounded-0 border-0" style={{ maxWidth: "640px" }}>
                  <a href="#">
                    <div className="row g-0">
                      <div className="col-md-4">
                        <img src="/img-placeholder.png" className="img-fluid rounded-start card-img-top" alt="..." />
                      </div>
                      <div className="col-md-8">
                        <div className="card-body">
                          <h5 className="card-title placeholder-glow col-6"></h5>
                          <p className="card-text placeholder col-6"></p>
                          <p className="card-text placeholder-glow col-6">
                            <b className="text-body-secondary placeholder col-6"></b>
                          </p>
                          <small></small>
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
                </>
               ) :    <SingleEvents
               filteredEvents={filteredEvents}
               /> } */}
                 <SingleEvents
                 loadingFilter={loadingFilter}
                 newFilteredEvents={newFilteredEvents}
               filteredEvents={filteredEvents} />
         
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
export default Events;
