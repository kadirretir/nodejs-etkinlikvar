import React, { useState, useRef, useEffect } from "react";
import styles from './events.module.css'
import SingleEvents from "./SingleEvents";


const Events = ({ eventsData, userData, searchresults }) => {
  const [filteredEvents, setFilteredEvents] = useState(eventsData)
  const searchInput = useRef()

  const handleEventSearch = (e) => {
    e.preventDefault()
    const inputContent = e.target.value.toLowerCase()
    const getFiltered = eventsData.filter(event => event.title.toLowerCase().includes(inputContent))
    setFilteredEvents(getFiltered)
  }

  useEffect(() => {
    if(typeof searchresults.searchforevent !== 'undefined') {
      searchInput.current.value = searchresults.searchforevent;
      const getFiltered = eventsData.filter(event => event.title.toLowerCase().includes(searchInput.current.value.toLowerCase()))
      setFilteredEvents(getFiltered)
    } 
  
}, []);

  return (
    <>
      <section id={styles.eventsId}  >
        <div className="container">
          <div className="row">
            <div className="col-lg-3">
            <div className="container">

        </div>
            </div>
            <div className="col-lg-9">
                <h1 className="fs-3 mt-5 mb-4" style={{fontFamily: 'var(--second-font)'}}>Neler yapmak istersin?</h1>
              <div className="input-group w-100 input-group-lg mb-5">
                <input type="search" ref={searchInput} onChange={(e) => handleEventSearch(e)} className="form-control" aria-label="Sizing example input" placeholder="Etkinlik Ara..." aria-describedby="inputGroup-sizing-default" />
              </div>
            <SingleEvents
            filteredEvents={filteredEvents}
            />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
export default Events;
