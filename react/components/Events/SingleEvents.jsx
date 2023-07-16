import React from 'react';
import ContentLoader from "react-content-loader"

const SingleEvents = ({ filteredEvents, loadingFilter }) => {


  if (!loadingFilter && filteredEvents.length === 0) {
    return <h1 className='fs-4'>Arama kriterinize göre bir etkinlik bulamadık</h1>
    } 

  return (
  
    <>
      {filteredEvents.map((event, index) => {
        const imagePath = event.eventImage;
        const smallImagePath = imagePath.includes('uploads')
          ? imagePath.replace('uploads', 'uploads_little')
          : imagePath;

        const eventDate = new Date(event.date);
        const formattedDate = eventDate.toLocaleDateString("tr-TR", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });

        return !loadingFilter && (
          <div className="card mb-3 rounded-0 border-0" key={index} style={{ maxWidth: "640px" }}
          >
            <a href={`/events/${event._id}`}>
              <div className="row g-0">
                <div className="col-md-4">
                  <img
                    src={`../${smallImagePath}`}
                    className="img-fluid rounded-start"
                    alt="eventImage"
                  />
                </div>
                <div className="col-md-8">
                  <div className="card-body">
                    <h5 className="card-title fs-3">{event.title}</h5>
                    <p className="card-text fs-4 fw-light">
                      {event.districtName} <br /> {event.cityName} <br /> {event.location}
                    </p>
                    <p className="card-text">
                      <b className="text-body-secondary">{formattedDate}</b>
                    </p>
                    <small>{event.attendees.length} Katılımcı</small>
                    <small>{event.eventCategory}</small>
                  </div>
                </div>
              </div>
            </a>
          </div>
        )  
      })}
      {loadingFilter && (
   <div className="d-flex flex-column gap-4">
        {new Array(4).fill().map((_,index) => 
        <ContentLoader 
          key={index}
          speed={2}
          width={476}
          height={124}
          viewBox="0 0 476 124"
          backgroundColor="#d8d4d4"
          foregroundColor="#ecebeb"
        >
          <rect x="240" y="23" rx="3" ry="3" width="410" height="6" /> 
          <rect x="240" y="43" rx="3" ry="3" width="380" height="6" /> 
          <rect x="246" y="81" rx="3" ry="3" width="178" height="6" /> 
          <rect x="247" y="96" rx="3" ry="3" width="170" height="6" /> 
          <rect x="18" y="-2" rx="3" ry="3" width="213" height="142" />
  </ContentLoader>)}
      </div> )}
    </>
  );
};

export default SingleEvents;
