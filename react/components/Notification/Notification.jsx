import React, {useState, useEffect} from 'react'

const Notification = ({notificationData}) => {
    const [unSeenNotifications, setUnSeenNotifications] = useState()
    const [unSeenLength, setUnSeenLength] = useState()
 
    const handleClicked = async () => {
        const getNotifId = unSeenNotifications.map(notif => {
            return notif[2]
        })
       
        if(unSeenLength > 0) {
            for (let i = 0; i < getNotifId.length; i++) {
                await fetch(`/events/notifications/${getNotifId[i]}`, {
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
       const response = await fetch(`/events/notifications/`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            },
          })
         const data = await response.json()
         const getUnseenNumber = data.filter((notif) => !notif.isNotificationSeen);
         setUnSeenLength(getUnseenNumber.length)
         
      }
    return (
        <div className="dropdown dropdown-center mt-2 me-3" onClick={handleClicked}>
          <button type="button" className="btn border-0" data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside">
            {unSeenLength > 0 ? (
              <>
                <i className="fa-solid fa-bell fa-xl"></i>
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {unSeenLength}
                  <span className="visually-hidden">Okunmamış Mesajlar</span>
                </span>
              </>
            ) : (
              <i className="fa-regular fa-bell fa-xl"></i>
            )}
          </button>
          <div className="dropdown-menu p-0" style={{ width: '300px' }}>
            <div className="list-group border-0">
            {typeof unSeenNotifications !== 'undefined' && unSeenNotifications.length > 0 ? (
                <>
                    {unSeenNotifications.slice(0, 7).map((notif, index) => (
                    <a key={index} className="list-group-item list-group-item-action p-3" href="#">
                         {notif[0]}
                    </a>
                    ))}
                    {unSeenNotifications.length > 7 && (
                    <a href="#" className='text-center fs-5 py-2'>Tümünü Gör</a>
                    )}
                </>
                ) : <h1 className='fs-5 text-center py-3'>Henüz bildiriminiz yok</h1>
                
                }
            </div>
          </div>
        </div>
      );
}

export default Notification