import React, { useState, useRef, useEffect } from "react";
import styles from './events.module.css'
import SingleEvents from "./SingleEvents";
import debounce from "lodash/debounce";
import axios from 'axios';

const Events = ({ eventsData, userData, searchresults, categoryData }) => {
  const [filteredEvents, setFilteredEvents] = useState(eventsData)
  const [loading, setLoading] = useState(false);

  const searchInput = useRef();
  const handleEventSearch =  async (e) => {
    e.preventDefault()
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3000/events/requestedevents/${e.target.value}`);
      const event = response.data;

      const inputContent = e.target.value.toLowerCase();
      // const getFiltered = eventsData.filter((event) => event.title.toLowerCase().includes(inputContent));
      setFilteredEvents(event);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const debouncedOnChange = debounce(handleEventSearch, 800);

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
            <div className="col-lg-3">
          <div className="container">
            <div className={styles.gridContainer}>
              {categoryData.map((category, index) => (
                <div className={styles.gridItem} key={index}>
                  <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
                    <input type="radio" className="btn-check" name="btnradio" id={`btnradio${index}`} autoComplete="off" />
                    <label className="btn btn-outline-primary" htmlFor={`btnradio${index}`}>{category}</label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
            </div>
          </div>
            <div className="col-lg-9">
                <h1 className="fs-3 mt-5 mb-4" style={{fontFamily: 'var(--second-font)'}}>Neler yapmak istersin?</h1>
              <div className="input-group w-100 input-group-lg mb-5">
                <input type="search" ref={searchInput} onChange={debouncedOnChange} className="form-control" aria-label="Sizing example input" placeholder="Etkinlik Ara..." aria-describedby="inputGroup-sizing-default" />
              </div>
              {loading ? (
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
               /> }
         
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
export default Events;
