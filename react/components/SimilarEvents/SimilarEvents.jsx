import React from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block" }}
      onClick={onClick}
    />
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block" }}
      onClick={onClick}
    />
  );
}


const settings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 4,
  nextArrow: <SampleNextArrow />,
  prevArrow: <SamplePrevArrow />,
  responsive: [
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
        infinite: true,
        dots: false
      }
    },
    {
      breakpoint: 992,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        initialSlide: 2
      }
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
  dots: true
      }
    }
  ]
};
const SimilarEvents = ({ similarEventsInfo }) => {

  return (
    <div className={`slider-container`}>
  
      {similarEventsInfo.length > 0 && (
        <React.Fragment>
       <h1 className="fs-4 mt-5 mb-3 fw-bolder">Benzer Etkinlikler</h1>
            <hr />
        
          <Slider {...settings}>
          {similarEventsInfo.map((event) => (
            <div key={event._id} className="col-xxl-3 col-xl-4 col-lg-4 col-md-6 my-2">
              <a draggable={false} href={event._id} className="w-100  d-flex justify-content-center align-items-center">
                <div className="card" style={{ width: "20rem", minHeight: "22rem" }}>
                  <img src={`../${event.eventImage}`} className="card-img-top img-fluid" alt="..." />
                  <div className="card-body d-flex flex-column">
                  
                    <p className="text-secondary">{new Date(event.date).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric", hour: "numeric", minute: "numeric" })}</p>
                <small style={{fontFamily: "var(--second-font)"}} className="fs-5 fw-bold my-2 d-inline-block text-capitalize">{event.title}</small>
                <span className="text-body-secondary location-span my-2 text-capitalize">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-geo" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M8 1a3 3 0 1 0 0 6 3 3 0 0 0 0-6M4 4a4 4 0 1 1 4.5 3.969V13.5a.5.5 0 0 1-1 0V7.97A4 4 0 0 1 4 3.999zm2.493 8.574a.5.5 0 0 1-.411.575c-.712.118-1.28.295-1.655.493a1.3 1.3 0 0 0-.37.265.3.3 0 0 0-.057.09V14l.002.008.016.033a.6.6 0 0 0 .145.15c.165.13.435.27.813.395.751.25 1.82.414 3.024.414s2.273-.163 3.024-.414c.378-.126.648-.265.813-.395a.6.6 0 0 0 .146-.15l.015-.033L12 14v-.004a.3.3 0 0 0-.057-.09 1.3 1.3 0 0 0-.37-.264c-.376-.198-.943-.375-1.655-.493a.5.5 0 1 1 .164-.986c.77.127 1.452.328 1.957.594C12.5 13 13 13.4 13 14c0 .426-.26.752-.544.977-.29.228-.68.413-1.116.558-.878.293-2.059.465-3.34.465s-2.462-.172-3.34-.465c-.436-.145-.826-.33-1.116-.558C3.26 14.752 3 14.426 3 14c0-.599.5-1 .961-1.243.505-.266 1.187-.467 1.957-.594a.5.5 0 0 1 .575.411"/>
                          </svg>
                          {event.cityName}
                        </span>
                        <h4 className="text-secondary location-span my-2">{event.eventCategory}</h4>

                            <div className="w-50 attendees-container d-flex flex-row align-items-center justify-content-start align-self-end">
                          <h5 className="text-secondary me-2 ">{(event.attendees.length <= 1) ? event.attendees.length + ' Katılımcı' : 'Katılımcılar'}</h5>
                        </div>
                
                  </div>
                </div>
              </a>
            </div>
          ))}
        </Slider>
</React.Fragment>
      )}
    
    </div>
  );
};

export default SimilarEvents;
