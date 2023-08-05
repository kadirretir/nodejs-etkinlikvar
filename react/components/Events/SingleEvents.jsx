import React, {useState, useEffect} from 'react';
import ContentLoader from "react-content-loader"

const SingleEvents = ({ filteredEvents, loadingFilter }) => {
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);

  const setScreenFunction = () => {
    setInnerWidth(window.innerWidth);
  }

    useEffect(() => {
      window.addEventListener("resize", setScreenFunction)
    
      return () => {
        window.removeEventListener("resize", setScreenFunction)
      }
    }, [])

  if (!loadingFilter && filteredEvents.length === 0) {
    return <h1 className='fs-4' style={{paddingLeft: "0.7rem"}}>Arama kriterinize göre bir etkinlik bulamadık</h1>
    } 

   const currentDate = new Date();
    const currentDay = currentDate.getDate();
   
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

        const isToday = eventDate.getDate() === currentDay;
      const displayDate = isToday ? "Bugün" : formattedDate;

        return !loadingFilter && (
          <div className="card mb-4 rounded-0 border-0" key={index}  style={{ maxWidth: "640px" }}
          >
            <a href={`/events/${event._id}`}>
              <div className="row g-0">
                <div className="col-sm-4">
                  <img
                    src={`../${(innerWidth >= 576) ? smallImagePath : imagePath}`}
                    className="img-fluid w-100 rounded-start"
                    alt="eventImage"
                  />
                </div>
                <div className="col-sm-8">
                  <div className="card-body p-0 ps-3 py-1  d-flex flex-column" style={{ background: "linear-gradient(to bottom, rgba(248, 248, 248, 0.9), rgba(248, 248, 248, 0.7))", height: "100%" }}>
                  <small className='fw-bolder py-1 mt-1' style={{color: "var(--second-color)"}}>{displayDate}</small>
                    <h5 className="card-title mt-3 py-1 fs-4 text-body">{event.title}</h5>
                    
                    <div className="mt-auto mb-2 py-1 text-end pe-2 d-flex justify-content-between align-items-center">
                    <p className="card-text fs-5 mt-auto fw-light text-body-secondary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-geo-alt-fill text-secondary" viewBox="0 0 16 16">
                    <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
                  </svg>
                      {event.cityName + ',' + ' ' + event.districtName}
                    </p>
                    <b className='card-text fs-6 fw-light text-secondary'>{event.attendees.length === 0 ? <b>Henüz katılımcı yok</b> : event.attendees.length + " Katılımcı"}</b>
                    </div>
                  </div>
                </div>
              </div>
            </a>
          </div>
        )  
      })}
  {loadingFilter && innerWidth >= 576 ? (
  <div className="d-flex flex-column gap-4">
    {new Array(4).fill().map((_, index) => (
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
      </ContentLoader>
    ))}
  </div>
) : loadingFilter && (innerWidth <= 576) ? (
  <div className="d-flex flex-column align-items-center">
  <ContentLoader 
    speed={2}
    width={350}
    height={460}
    viewBox="0 0 400 460"
    backgroundColor="#d8d4d4"
    foregroundColor="#ecebeb"
  >
    <rect x="22" y="300" rx="2" ry="2" width="350" height="10" /> 
    <rect x="22" y="287" rx="2" ry="2" width="350" height="11" /> 
    <rect x="16" y="10" rx="2" ry="2" width="400" height="256" />
  </ContentLoader>
  </div>
) : <></>}
    </>
  );
};

export default SingleEvents;
