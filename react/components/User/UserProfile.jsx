import React, {useState, useEffect} from 'react'
import styles from './userprofile.module.css';
import ContentLoader from "react-content-loader"

const UserProfile = ({userData, eventsData, cancelledMessage}) => {
  const queryString = window.location.search;
  const queryWithoutQuestionMark = queryString.replace('?', '');
   const replaceActiveTab = queryWithoutQuestionMark ? queryWithoutQuestionMark : "profilim"

    const [activeTab, setActiveTab] = useState(replaceActiveTab);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
      };

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
  
    return (
      <div className="mb-5">
        <h1 className="display-6 text-center">Profilim</h1>
        <hr />
        <div className="container pt-5">
            {cancelledMessage.length > 0 ? 
            <h1 onAnimationEnd={handleAnimationEnd} className={`fs-4 text-center ${styles.alertMessage}`}>{cancelledMessage}</h1> 
            : null}
          <div className="row">
            <div className="col-lg-3">
              <div className="row">
                <div className="col-lg-12">
                <ul className={`${styles.listStyle}`}>
                {userData.membershipLevel === "premium" && (
                    <>
                    <h1 className='fs-4 text-center mb-4 border border-1 py-3'><i className="fa-solid fa-crown fa-lg" style={{color: "var(--first-color)"}}></i> Premium Üye <p>({userData.username})</p> </h1>
                    </>
                  )}
                  <li className={`list-group-item ${activeTab === 'etkinliklerim' ? 'active' : ''}`}>
                    <a href="#" onClick={() => handleTabClick('etkinliklerim')}>
                      Geçmiş Etkinliklerim
                    </a>
                  </li>
                  <li className={`list-group-item ${activeTab === 'profilim' ? 'active' : ''}`}>
                    <a href="#" onClick={() => handleTabClick('profilim')}>
                      Profilim
                    </a>
                  </li>
                  <li className={`list-group-item ${activeTab === 'mesajlarim' ? 'active' : ''}`}>
                    <a href="#" onClick={() => handleTabClick('mesajlarim')}>
                      Mesajlarım
                    </a>
                  </li>
                  <li className={`list-group-item ${activeTab === 'ayarlar' ? 'active' : ''}`}>
                    <a href="#" onClick={() => handleTabClick('ayarlar')}>
                      Ayarlar
                    </a>
                  </li>
                  <li className={`list-group-item ${activeTab === 'premium' ? 'active' : ''}`}>
                    <a href="#" onClick={() => handleTabClick('premium')}>
                      Premium
                    </a>
                  </li>
                </ul>
                </div>
              </div>
            </div>
  
            <div className="col-lg-9 bg-light-subtle">
                {activeTab === 'etkinliklerim' && <EventsComp userData={userData} eventGroups={eventGroups} />}
            {activeTab === 'profilim' && <Profile userData={userData} /> }
            {activeTab === 'mesajlarim' && <div className="tab-pane fade" id="list-messages" role="tabpanel" aria-labelledby="list-messages-list">...</div>}
            {activeTab === 'ayarlar' && <div className="tab-pane fade" id="list-settings" role="tabpanel" aria-labelledby="list-settings-list">...</div>}
            {activeTab === 'premium' && <h1>premium</h1>}
            </div>
          </div>
        </div>
      </div>
    );
}

const Profile = ({userData}) => {
const [showPicSuccess, setShowPicSuccess] = useState(false)
const [imageFile, setImageFile] = useState("");

  const checkFileSize = (event) => {
    const file = event.target.files[0];
    const maxSize = 2 * 1024 * 1024; // Maksimum 2MB (2 * 1024 * 1024 bayt)
  
    if (file && file.size > maxSize) {
      alert("Dosya boyutu 2MB'dan büyük olamaz.");
      // Dosyayı yüklemeyi engellemek için input değerini sıfırla
      event.target.value = "";
      setImageFile("")
    }

    if(event.target.files.length > 0) {
        setImageFile(event.target.value)
        setShowPicSuccess(true)
    } else {
      setImageFile("")
      setShowPicSuccess(false)
    }

  };

  useEffect(() => {
    console.log(imageFile)
  }, [imageFile])

  const cancelImageUpload = (e) => {
    e.preventDefault();
    setImageFile("")
    setShowPicSuccess(false)
  }

  const handleForm = (e) => {
    if(imageFile === "") {
      e.preventDefault()
      
    }
  }

    return (
        <>
        <div className="container">
          <div className="row border border-1 py-2">
            <div className="col text-center">
              <h1 className='fs-4 mb-4'>Profil Fotoğrafımı Değiştir</h1>
              <form onSubmit={handleForm} action='/user/changeprofilePicture' method="post" encType="multipart/form-data">
                
              <div className='row border border-1 py-2 my-4'>
                <label htmlFor="profilePictureInput" style={{cursor: "pointer"}}>
                  <img src={`./${userData.profileImage}`}  className="rounded-circle" width={100} alt="" />
              </label>
                <input
                value={imageFile}
                  type="file"
                  id="profilePictureInput"
                  name="newUserPhoto"
                  style={{ display: 'none' }}
                  onChange={checkFileSize}
                  accept="image/png, image/jpeg, image/jpg"
                />
                   {showPicSuccess && (
                    <> 
                    <b className='text-success fs-5 my-3'>Resim başarıyla yüklendi!</b>
                    <button type='submit' className='btn btn-danger w-25 py-2 mx-auto' onClick={cancelImageUpload}>İptal</button>
                </>
              )}
              </div>
           
                <div className="row">
                  <div className="col text-end">
                   <button className='btn btn-dark px-4 py-2' type='submit'>Kaydet</button>
                  </div>
                </div>
           
              </form>
            </div>
          </div>
        </div>
        </>
    )
}


const EventsComp = ({ eventGroups, userData }) => {
  const [visibleEvents, setVisibleEvents] = useState(7);
  const [loading, setLoading] = useState(false);
  const allEvents = Object.entries(eventGroups).reduce((acc, [date, events]) => [...acc, ...events], []);

  const handleScroll = () => {
    const scrolledToBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight;
    if (scrolledToBottom && visibleEvents < allEvents.length && !loading) {
      setLoading(true);
      setTimeout(() => {
        setVisibleEvents((prevVisibleEvents) => prevVisibleEvents + 7);
        setLoading(false);
      }, 1000);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);


  if(userData.membershipLevel === "free" && allEvents.length === 0) {
    return (
      <>
       <div className='text-center'>
            <h1 className='fs-2 text-center mb-4'>Siz de etkinlik oluşturmak ister miydiniz?</h1>
            <a href="/pricing">
              <button className='btn btn-primary border-0 p-2' style={{background: "var(--first-color)"}}>Etkinliğimi Oluştur</button>
            </a> 
        </div>
           <h2 className='fs-4 mt-5'>Henüz bir etkinlik oluşturmadınız...</h2>
      </>
      )

  } else if (userData.membershipLevel === "premium" && allEvents.length === 0) {
    return <h1 className='fs-4 mt-4'>Henüz bir etkinlik oluşturmadınız...</h1>
  }

  return (
    <>
      {allEvents.slice(0, visibleEvents).map((event) => (
        <div className="card mb-3 rounded-0 border-0" style={{ maxWidth: '640px' }} key={event._id}>
        <a href={`/events/${event._id}`}>
          <div className="row g-0">
            <div className="col-md-4">
              <img src={`../${event.eventImage}`} className="img-fluid rounded-start" alt="..." />
            </div>
            <div className="col-md-8">
              <div className="card-body">
                <h5 className="card-title fs-3">{event.title}</h5>
                <p className="card-text fs-4 fw-light">{event.description}</p>
                <p className="card-text">
                  <b className="text-body-secondary">Bugün</b>
                </p>
                <small>{event.attendees.length} Katılımcı</small>
              </div>
            </div>
          </div>
        </a>
      </div>
      ))}

      {loading && visibleEvents < allEvents.length && (
       <div className="d-flex flex-column gap-4">
       {new Array(2).fill().map((_,index) => 
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
       </div>
      )}
    </>
  );
};


export default UserProfile

