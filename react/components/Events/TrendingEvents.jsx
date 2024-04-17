import React from 'react';

function TrendingEvents ({trendingEvents}) {

    return (
      <div className="container">
    <div className="row my-5">
       <div className="col-12">
       {(trendingEvents !== null && Object.keys(trendingEvents).length > 0) && (
            <React.Fragment>
              <h1 className="text-start text-emphasis fs-5">Trend Etkinlikler</h1>
         <hr />
         {trendingEvents && trendingEvents.map((singular, id) => {
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
                          <h5 className="card-title mt-2 text-dark">{singular.title}</h5>
                          <p className="card-text"><small className="text-body-secondary">
                          <svg xmlns="https://www.w3.org/2000/svg" width="16" height="16"  fill="currentColor" style={{color: "var(--first-color)"}} className="bi bi-geo-alt-fill me-1" viewBox="0 0 16 16">
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
            </React.Fragment>
         )}
    
       </div>
    </div>   
    </div>
 
    )
    }


export default TrendingEvents;