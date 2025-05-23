import React, { forwardRef, useMemo, memo, useState, useEffect } from 'react';
import styles from '../events.module.css';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const areEqual = (prevProps, nextProps) => {
  return (
    prevProps.filteredSingleEvent.eventImage === nextProps.filteredSingleEvent.eventImage &&
    prevProps.filteredSingleEvent.date === nextProps.filteredSingleEvent.date
  );
};

const EventCard = memo(
  forwardRef((props, ref) => {
    const { filteredSingleEvent, loadingFilter } = props;
    const [innerWidth, setInnerWidth] = useState(window.innerWidth);

    useEffect(() => {
      const handleResize = () => {
        setInnerWidth(window.innerWidth);
      };

      let timeoutId = null;
      const debouncedHandleResize = () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          handleResize();
        }, 500);
      };

      window.addEventListener('resize', debouncedHandleResize);

      return () => {
        window.removeEventListener('resize', debouncedHandleResize);
      };
    }, []);

    const currentDate = new Date();
    const currentDay = currentDate.getDate();

    const imagePath = useMemo(() => filteredSingleEvent.eventImage, [filteredSingleEvent.eventImage]);

  
    const eventDate = new Date(filteredSingleEvent.date);
    const formattedDate = useMemo(() => {
      return eventDate.toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    }, [eventDate]);

    const isToday = eventDate.getDate() === currentDay;
    const displayDate = useMemo(() => {
      return isToday ? 'Bugün' : formattedDate;
    }, [isToday, formattedDate]);
    const MemoizedLazyLoadImage = memo(LazyLoadImage);

    return (
      !loadingFilter && (
        <div ref={ref} className="card my-4 rounded-0 border-0" style={{ maxWidth: '640px' }}>
          <a className="link-opacity-100-hover" href={`/events/${filteredSingleEvent._id}`}>
            <div className="row g-0">
              <div className="col-md-4"  style={{ height: '100%' }}>
                <MemoizedLazyLoadImage
                effect="blur"
                src={`../${imagePath}`}
                className={`img-fluid rounded-start ${innerWidth > 768 ? styles.cardImgTop : ""}`}
                alt="eventImage"
              />
              </div>

              <div className="col-md-8">
                <div
                style={{background: 'linear-gradient(to bottom, rgba(248, 248, 248, 0.9), rgba(248, 248, 248, 0.7))', height: "145px"}} 
                className="card-body p-0 ps-3 py-1 d-flex flex-column"
                >
                  <small className="fw-bolder py-1 text-secondary">{displayDate}</small>
                  <h5 className="card-title text-dark" style={{ fontSize: '1.4rem'}}>
                    {filteredSingleEvent.title}

                  </h5>

                  <div className="mt-auto text-end d-flex justify-content-between align-items-center">
                        <div className='d-flex flex-column align-items-start justify-content-start'>
                            <small className="text-secondary mt-auto">
                          <i className="fa-solid fa-table me-1" style={{ color: 'var(--first-color)' }}></i>
                          {filteredSingleEvent.eventCategory}
                          </small>
                        <p className="text-capitalize text-start fw-bold card-text fs-5 text-body-secondary">
                            <svg
                              xmlns="https://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              style={{ color: 'var(--first-color)' }}
                              className="bi bi-geo-alt-fill me-1"
                              viewBox="0 0 16 16"
                            >
                              <path
                                d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"
                              />
                            </svg>
                            {filteredSingleEvent.cityName + ', ' + filteredSingleEvent.districtName}
                        </p>
                        </div>
                    <div className={`${styles.attendeesContainer} d-flex flex-row align-items-center justify-content-end`}>
                      <h5 className="text-secondary me-2">
                        {filteredSingleEvent.attendees.length <= 1
                          ? `${filteredSingleEvent.attendees.length} Katılımcı`
                          : 'Katılımcılar'}
                      </h5>
                
                      {filteredSingleEvent.attendees.slice(0, 3).map((attendee, index) => (
                        <img
                          key={index}
                          className="rounded-circle img-fluid"
                          style={{ width: '35px', height: '35px' }}
                          src={`../${attendee.profileImage}`}
                          alt={attendee.username}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </a>
        </div>
      )
    );
  }),
  areEqual
);

export default EventCard;
