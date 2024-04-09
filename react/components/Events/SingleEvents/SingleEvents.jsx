import React, { useState, useEffect, useMemo, memo, lazy } from 'react';
import ContentLoader from "react-content-loader";

const SingleEvents = memo(
  ({ filteredEvents, loadingFilter, selectedDate, lastEventElementRef }) => {
    const [innerWidth, setInnerWidth] = useState(window.innerWidth);

    useEffect(() => {
      const handleResize = () => {
        setInnerWidth(window.innerWidth);
      };

      // Debouncing ile resize olayını optimize etme
      const debouncedHandleResize = debounce(handleResize, 250);
      window.addEventListener("resize", debouncedHandleResize);
      return () => {
        window.removeEventListener("resize", debouncedHandleResize);
      };
    }, []);

    // Etkinlikleri tarihlerine göre gruplandırma işlemini useMemo ile optimize etme
    const groupedEvents = useMemo(() => {
      if (filteredEvents.length === 0) return {};

      const sortedEvents = [...filteredEvents].sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );

      return sortedEvents.reduce((acc, event) => {
        const eventDate = new Date(event.date);
        const formattedDate = eventDate.toLocaleDateString("tr-TR", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });

        (acc[formattedDate] = acc[formattedDate] || []).push(event);
        return acc;
      }, {});
    }, [filteredEvents]);

    // Tüm tarihlerde etkinlik olup olmadığını kontrol etme
    const hasEvents = Object.values(groupedEvents).some(
      (events) => events.length > 0
    );

    return (
      <>
        {loadingFilter ? (
          innerWidth >= 576 ? (
            <div className="d-flex flex-column gap-4">
              {new Array(7)
                .fill()
                .map((_, index) => (
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
          ) : (
            <div className="d-flex flex-column align-items-center">
              <ContentLoader
                speed={2}
                width={500}
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
          )
        ) : (
          <>
            {/* Etkinlik bulunamadı mesajı */}
            {!hasEvents && !loadingFilter && (
              <h1 className="fs-4" style={{ paddingLeft: "0.7rem" }}>
                Arama kriterinize göre bir etkinlik bulamadık
              </h1>
            )}

            {/* Etkinlikleri gösterme */}
            {hasEvents &&
              (selectedDate === "Bu Hafta" ||
                selectedDate === "Bu Haftasonu" ||
                selectedDate === "Önümüzdeki Hafta" ? (
                <>
                  {Object.entries(groupedEvents).map(([date, events]) => (
                    <div key={date}>
                      <h2 className="fs-5 mt-5 text-dark fw-bold">{date}</h2>
                      <hr />
                      {events.map((event, index) => (
                        <LazyLoadedEventCard
                          ref={index === events.length - 1 ? lastEventElementRef : null}
                          filteredSingleEvent={event}
                          loadingFilter={loadingFilter}
                          key={event._id + index}
                        />
                      ))}
                    </div>
                  ))}
                </>
              ) : (
                <>
                  {filteredEvents.map((singleEvent, index) => (
                    <LazyLoadedEventCard
                      ref={
                        index === filteredEvents.length - 1
                          ? lastEventElementRef
                          : null
                      }
                      key={singleEvent._id + index}
                      index={index}
                      filteredSingleEvent={singleEvent}
                      loadingFilter={loadingFilter}
                    />
                  ))}
                </>
              ))}
          </>
        )}
      </>
    );
  }
);

const LazyLoadedEventCard = lazy(() => import('./EventCard'));
// Debouncing fonksiyonu
function debounce(func, delay) {
  let timer;
  return function (...args) {
    const context = this;
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(context, args), delay);
  };
}

export default SingleEvents;