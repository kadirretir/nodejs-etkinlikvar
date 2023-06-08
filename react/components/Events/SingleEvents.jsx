import React from 'react'

const SingleEvents = ({eventsData, filteredEvents}) => {
   return (
    <>
     {filteredEvents.map((event, index) => {
        return (

          <div className="card mb-3" key={index} style={{ maxWidth: "540px" }}>
            <div className="row g-0">
              <div className="col-md-4">
                <img src={`../${event.eventImage}`} className="img-fluid rounded-start" alt="..." />
              </div>
              <div className="col-md-8">
                <div className="card-body">
                  <h5 className="card-title">{event.title}</h5>
                  <p className="card-text">
                    {event.description}
                  </p>
                  <p className="card-text">
                    <small className="text-body-secondary">
                     {event.date}
                    </small>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </>
   )
}

export default SingleEvents;
