import React, { useEffect, useState } from "react";
import styles from './events.module.css'
import SingleEvents from "./SingleEvents";

const Events = ({ eventsData, userData }) => {
  const [filteredEvents, setFilteredEvents] = useState(eventsData)

  const handleEventSearch = (e) => {
    e.preventDefault()
    const inputContent = e.target.value.toLowerCase()
    const getFiltered = eventsData.filter(event => event.title.toLowerCase().includes(inputContent))
    setFilteredEvents(getFiltered)
    console.log(filteredEvents)
  }

  return (
    <>
      <section id={styles.eventsId}  >
        <div className="container">
          <h1 className="fs-2 text-secondary my-5">İstediğiniz Etkinliği Aratabilirsiniz {userData.username.toUpperCase()}</h1>
          <div className="input-group w-50 input-group-lg mb-5">
            <input type="text" onChange={(e) => handleEventSearch(e)} className="form-control" aria-label="Sizing example input" placeholder="Etkinlik Ara..." aria-describedby="inputGroup-sizing-default" />
        </div>
        <SingleEvents
        filteredEvents={filteredEvents}
        />
        </div>
      </section>
    </>
  );
}
export default Events;
