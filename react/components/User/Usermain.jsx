import React, {useState, useEffect, useRef} from 'react'
import { BrowserRouter as Router, Route, Routes, NavLink  } from 'react-router-dom';
import styles from './userprofile.module.css';
import ContentLoader from "react-content-loader"
import Profile from './Profile/Profile'
import PersonalInfo from './Personal';
import Privacy from './Privacy/Privacy';
import Interests from './Interests/Interests';
import Subscription from './Subscription/Subscription';
import PaymentMethod from './PaymentMethod';
import { InterestsProvider } from './InterestsProvider';



const Usermain = ({userData, eventsData, cancelledMessage}) => {
  const ulList = useRef(null);

    let eventGroups = {};

    eventsData.forEach((event) => {
      const eventDate = new Date(event.date);
      const formattedDate = eventDate.toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
  
      if (!eventGroups[formattedDate]) {
        eventGroups[formattedDate] = [];
      }
  
      eventGroups[formattedDate].push(event);
    });

    const handleAnimationEnd  = (e) => {
      e.target.style.display = 'none';
     }


     // KULLANICI KAYIT TARIHINI GUN AY YILA CEVIR
    //  const date = new Date(userData.signInDate);
    //  const options = { day: 'numeric', month: 'long', year: 'numeric' };
    //  const formattedDate = date.toLocaleDateString('tr-TR', options); // 'tr-TR' Türkçe lokalizasyonu için

    return (
      <Router>
      <div className='container-fluid p-0 m-0'>
        {/* PROFILE BANNER */}
        <div className="row flex-nowrap ">
          <div className={`col-1 col-lg-2 w-auto ${styles.colWidth}`}>
              <aside className={styles.asideMenu}>
                <h1 className='fs-4 mb-2 ms-4'>Ayarlar</h1>
                  <ul className={styles.ulMenu} ref={ulList}>
                    <li>
                    <NavLink  className={({ isActive }) =>
                      isActive ? `text-secondary-emphasis active ${styles.active}` : 'text-secondary-emphasis' } to="/user/profile">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-fill" viewBox="0 0 16 16">
                        <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
                      </svg>
                   <span>Profili Düzenle</span>
                   </NavLink>
                      </li>

                      <li>
                      <NavLink className={({ isActive }) =>
                      isActive ? `text-secondary-emphasis active ${styles.active}` : 'text-secondary-emphasis' } to="/user/information" >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-badge-fill" viewBox="0 0 16 16">
                        <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2zm4.5 0a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1zM8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6m5 2.755C12.146 12.825 10.623 12 8 12s-4.146.826-5 1.755V14a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1z"/>
                      </svg>
                   <span>Kişisel Bilgiler</span>
                   </NavLink>
                      </li>

                      <li>
                      <NavLink className={({ isActive }) =>
                      isActive ? `text-secondary-emphasis active ${styles.active}` : 'text-secondary-emphasis' } to="/user/privacy" >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-lock-fill" viewBox="0 0 16 16">
                        <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2"/>
                      </svg>
                   <span>Gizlilik ve Güvenlik</span>
                   </NavLink>
                      </li>

                      <li>
                      <NavLink className={({ isActive }) =>
                      isActive ? `text-secondary-emphasis active ${styles.active}` : 'text-secondary-emphasis' } to="/user/interest" >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-star-fill" viewBox="0 0 16 16">
                        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                      </svg>
                  <span>İlgilerim</span>
                   </NavLink>
                      </li>

                      <li>
                      <NavLink   
                       className={({ isActive }) =>
                       isActive ? `text-secondary-emphasis active ${styles.active}` : 'text-secondary-emphasis' } to="/user/subscription" >
                      <span className={styles.premiumBadge}>e+</span>
                   <span>etkinlikdolu+ Aboneliği</span>
                   </NavLink>
                      </li>

                      <li>
                      <NavLink className={({ isActive }) =>
                      isActive ? `text-secondary-emphasis active ${styles.active}` : 'text-secondary-emphasis' } to="/user/paymentmethod" >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-credit-card-2-back-fill" viewBox="0 0 16 16">
                      <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v5H0zm11.5 1a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zM0 11v1a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1z"/>
                    </svg>
                  <span>Ödeme Yöntemleri</span>
                   </NavLink>
                      </li>

                      <li>
                      <a className='text-light-emphasis' href='/user/help' >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-info-circle-fill" viewBox="0 0 16 16">
                          <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2"/>
                        </svg>
                  <span>Yardım</span>
                   </a>
                      </li>

                  </ul>
              </aside>
          </div>

          <div className="col-10 bg-light rounded-3">
              <div className="container pt-5" style={{marginLeft: "0", paddingLeft: "0"}}>
                {cancelledMessage.length > 0 ? 
                <h1 onAnimationEnd={handleAnimationEnd} className={`fs-4 text-center ${styles.alertMessage}`}>{cancelledMessage}</h1> 
                : null}
              <div className="row">    
                <div className="col-12">
                  <InterestsProvider userData={userData}>
               <Routes>
            
                  <Route exact path="/user/profile" element={<Profile userData={userData}  />} />
                  <Route path="/user/information" element={<PersonalInfo userData={userData} />}  />
                  <Route path="/user/privacy" element={<Privacy   />}  />
                  <Route path="/user/interest" element={<Interests userData={userData} />}  />
                  <Route path="/user/subscription" element={<Subscription  />} />
                  <Route path="/user/paymentmethod" element={<PaymentMethod   />}  />
                
              </Routes>
                </InterestsProvider>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
      </Router>
    );
}


// const EventsComp = ({ eventGroups, userData }) => {
//   const [visibleEvents, setVisibleEvents] = useState(7);
//   const [loading, setLoading] = useState(false);
//   const allEvents = Object.entries(eventGroups).reduce((acc, [date, events]) => [...acc, ...events], []);

//   const handleScroll = () => {
//     const scrolledToBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight;
//     if (scrolledToBottom && visibleEvents < allEvents.length && !loading) {
//       setLoading(true);
//       setTimeout(() => {
//         setVisibleEvents((prevVisibleEvents) => prevVisibleEvents + 7);
//         setLoading(false);
//       }, 1000);
//     }
//   };

//   useEffect(() => {
//     window.addEventListener('scroll', handleScroll);
//     return () => {
//       window.removeEventListener('scroll', handleScroll);
//     };
//   }, []);


//   if(userData.membershipLevel === "free" && allEvents.length === 0) {
//     return (
//       <>
//        <div className='text-center'>
//             <h1 className='fs-2 text-center mb-4'>Siz de etkinlik oluşturmak ister miydiniz?</h1>
//             <a href="/pricing">
//               <button className='btn btn-primary border-0 p-2' style={{background: "var(--first-color)"}}>Etkinliğimi Oluştur</button>
//             </a> 
//         </div>
//            <h2 className='fs-4 mt-5'>Henüz bir etkinlik oluşturmadınız...</h2>
//       </>
//       )

//   } else if (userData.membershipLevel === "premium" && allEvents.length === 0) {
//     return <h1 className='fs-4 mt-4'>Henüz bir etkinlik oluşturmadınız...</h1>
//   }

//   return (
//     <>
//       {allEvents.slice(0, visibleEvents).map((event) => (
//         <div className="card mb-3 rounded-0 border-0" style={{ maxWidth: '640px' }} key={event._id}>
//         <a href={`/events/${event._id}`}>
//           <div className="row g-0">
//             <div className="col-md-4">
//               <img src={`../${event.eventImage}`} className="img-fluid rounded-start" alt="..." />
//             </div>
//             <div className="col-md-8">
//               <div className="card-body">
//                 <h5 className="card-title fs-3">{event.title}</h5>
//                 <p className="card-text fs-4 fw-light">{event.description}</p>
//                 <p className="card-text">
//                   <b className="text-body-secondary">Bugün</b>
//                 </p>
//                 <small>{event.attendees.length} Katılımcı</small>
//               </div>
//             </div>
//           </div>
//         </a>
//       </div>
//       ))}

//       {loading && visibleEvents < allEvents.length && (
//        <div className="d-flex flex-column gap-4">
//        {new Array(2).fill().map((_,index) => 
//        <ContentLoader 
//          key={index}
//          speed={2}
//          width={476}
//          height={124}
//          viewBox="0 0 476 124"
//          backgroundColor="#d8d4d4"
//          foregroundColor="#ecebeb"
//        >
//          <rect x="240" y="23" rx="3" ry="3" width="410" height="6" /> 
//          <rect x="240" y="43" rx="3" ry="3" width="380" height="6" /> 
//          <rect x="246" y="81" rx="3" ry="3" width="178" height="6" /> 
//          <rect x="247" y="96" rx="3" ry="3" width="170" height="6" /> 
//          <rect x="18" y="-2" rx="3" ry="3" width="213" height="142" />
//        </ContentLoader>)}
//        </div>
//       )}
//     </>
//   );
// };


export default Usermain

