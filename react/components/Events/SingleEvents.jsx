import React from 'react';

const SingleEvents = ({ filteredEvents, loadingFilter }) => {
  // Filtreye uygun herhangi bir öğe bulunmazsa "Sonuç bulunamadı" bildirimi gösterme
  if (filteredEvents.length === 0) {
    return <h1 className='fs-4'>Arama kriterinize göre bir etkinlik bulamadık</h1>;
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

        return !loadingFilter ? (
          <div className="card mb-3 rounded-0 border-0" key={index} style={{ maxWidth: "640px" }}
          >
            <a href={`/events/${event._id}`}>
              <div className="row g-0">
                <div className="col-md-4">
                  <img
                    src={`../${smallImagePath}`}
                    className="img-fluid rounded-start"
                    alt="..."
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
        ) :   <div key={index}> <h2 className="placeholder col-12 placeholder-xs"></h2>
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
   </div>
      })}
    </>
  );
};

export default SingleEvents;
