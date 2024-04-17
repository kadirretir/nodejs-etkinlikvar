import React, {useState, useEffect, useRef} from 'react'
const baseURL = process.env.REACT_APP_API_URL

const Notification = ({notificationData}) => {
    const [unSeenNotifications, setUnSeenNotifications] = useState()
    const [unSeenLength, setUnSeenLength] = useState()
  const [notifButton, setNotifButton] = useState(false)

  const dropdownRef = useRef(null);
  const dropdownMenu = useRef(null);

  const bounceGrowAnimation = {
    animationName: 'bounce-grow',
    animationDuration: '0.2s',
    animationIterationCount: '1',
    animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
    transform: 'scale(1)'
  };

  // @keyframes tanımlamasını global stylesheet'e ekle
  const styleSheet = document.styleSheets[0];
  styleSheet.insertRule(`
    @keyframes bounce-grow {
      0%, 100% {
        transform: scale(1);
        animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
      }
      50% {
        transform: scale(1.1);
        animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
      }
    }
  `, styleSheet.cssRules.length);

    const handleClicked = async () => {
        const getNotifId = unSeenNotifications.map(notif => {
            return notif[2]
        })
       
        if(unSeenLength > 0) {
            for (let i = 0; i < getNotifId.length; i++) {
                await fetch(baseURL + `/events/notifications/${getNotifId[i]}`, {
                 method: 'GET',
                 headers: {
                   'Content-Type': 'application/json'
                 },
               });
               // İsteğe ilişkin diğer işlemler veya iş akışı burada devam edebilir
             }

             getFreshNotifications()
        } 
    }

    
    useEffect(() => {
        const getUnSeenNotifLength = notificationData.filter((notif) => {
            return notif.includes(false)
        })
        setUnSeenLength(getUnSeenNotifLength.length)
        setUnSeenNotifications(notificationData);
      }, []);


     async function getFreshNotifications () {
       const response = await fetch(baseURL + `/events/notifications/`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            },
          })
         const data = await response.json()
         const getUnseenNumber = data.filter((notif) => !notif.isNotificationSeen);
         setUnSeenLength(getUnseenNumber.length)
         
      }

  // Dropdown dışına tıklama olayını dinle
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && !dropdownMenu.current.contains(event.target)) {
        setNotifButton(false); // Dropdown'ı kapat
      }
    };

    // Event listener'ı ekle
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup fonksiyonu
    return () => {
      // Event listener'ı kaldır
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [notifButton]);

  const toggleNotificationSvg = () => {
    setNotifButton(!notifButton);
  }

    return (
        <div className="dropdown dropdown-center mt-2 me-3" onClick={handleClicked}>
          <button type="button" 
          ref={dropdownRef}
          style={notifButton ? bounceGrowAnimation : null}
           onClick={toggleNotificationSvg} 
           className="btn border-0" 
           data-bs-toggle="dropdown" 
           aria-expanded={notifButton}  
           data-bs-auto-close="outside">

          {notifButton ? (
          // Dropdown açıkken doldurulmuş zil ikonu
          <svg xmlns="https://www.w3.org/2000/svg" width="23" height="23" fill="currentColor" className="bi bi-bell-fill" viewBox="0 0 16 16">
          <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2m.995-14.901a1 1 0 1 0-1.99 0A5 5 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901"/>
        </svg>
        ) : (
          <svg xmlns="https://www.w3.org/2000/svg" width="23" height="23" fill="currentColor" className="bi bi-bell" viewBox="0 0 16 16">
          <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2M8 1.918l-.797.161A4 4 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4 4 0 0 0-3.203-3.92zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5 5 0 0 1 13 6c0 .88.32 4.2 1.22 6"/>
        </svg>
        )}
            {unSeenLength > 0 && (
              <>
                <span className="text-white position-absolute top-25 start-75 w-50 translate-middle rounded-pill bg-danger" 
                style={{fontSize: "0.9rem"}}>
                  {unSeenLength}
                  <span className="visually-hidden">Okunmamış Mesajlar</span>
                </span>
              </>
            )}
          </button>
          <div className="dropdown-menu p-0" ref={dropdownMenu} style={{ width: '300px' }}>
            <div className="list-group border-0">
              {/* {console.log(unSeenNotifications)} */}
            {typeof unSeenNotifications !== 'undefined' && unSeenNotifications.length > 0 ? (
                <>
                    {unSeenNotifications.slice(0, 4).map((notif, index) => (
                   
                    <a key={index} className="list-group-item list-group-item-action p-3" href="/events">
                         {notif[0]}
                    </a>
                    ))}
                    {unSeenNotifications.length > 4 && (
                    <a href="/events" className='text-center py-2'>Tümünü Gör</a>
                    )}
                </>
                ) : <h2 className='text-center py-3'>Henüz bildiriminiz yok</h2>
                
                }
            </div>
          </div>
        </div>
      );
}

export default Notification