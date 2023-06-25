import React from 'react';

const SingleEvents = ({ filteredEvents }) => {
  const currentDate = new Date();

  // Etkinlikleri tarihe göre sıralama ve filtreleme
  const sortedEvents = filteredEvents
    .filter(event => {
      const eventDate = new Date(event.date);
      return eventDate >= currentDate;
    })
    .sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA.getTime() - dateB.getTime();
    });

  // Etkinlikleri tarih gruplarına ayırma
  const groupedEvents = {};
  sortedEvents.forEach(event => {
    const date = new Date(event.date);
    const formattedDate = date.toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const displayDate = date.toDateString() === currentDate.toDateString() ? "Bugün" : formattedDate;

    if (!groupedEvents[displayDate]) {
      groupedEvents[displayDate] = [];
    }
    groupedEvents[displayDate].push(event);
  });

  // Filtreye uygun herhangi bir öğe bulunmazsa "Sonuç bulunamadı" bildirimi gösterme
  if (Object.keys(groupedEvents).length === 0) {
    return <h1 className='fs-4'>Arama kriterinize göre bir etkinlik bulamadık</h1>;
  }

  return (
    <>
      {Object.keys(groupedEvents).map((date) => (
        <div key={date}>
          <h2 className="fs-4 fw-semi">{date}</h2>
          <hr className="border border-2 border-secondary" />
          {groupedEvents[date].map((event, index) => {
            const imagePath = event.eventImage;
            const smallImagePath = imagePath.includes('uploads')
              ? imagePath.replace('uploads', 'uploads_little')
              : imagePath;
  
            return (
              <div
                className="card mb-3 rounded-0 border-0"
                key={index}
                style={{ maxWidth: "640px" }}
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
                          {event.location}
                        </p>
                        <p className="card-text">
                          <b className="text-body-secondary">{date}</b>
                        </p>
                        <small>{event.attendees.length} Katılımcı</small>
                      </div>
                    </div>
                  </div>
                </a>
              </div>
            );
          })}
        </div>
      ))}
    </>
  );
};

export default SingleEvents;