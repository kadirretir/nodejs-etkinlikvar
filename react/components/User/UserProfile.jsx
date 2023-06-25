import React, {useState} from 'react'
import styles from './userprofile.module.css';

const UserProfile = ({userData, eventsData}) => {
    const [activeTab, setActiveTab] = useState('etkinliklerim');

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
  
    return (
      <div className="mb-5">
        <h1 className="display-6 text-center">Profilim</h1>
        <hr />
        <div className="container pt-5">
          <div className="row">
            <div className="col-lg-3">
              <div className="row">
                <div className="col-lg-12">
                <ul className={`${styles.listStyle}`}>
                  <li className={`list-group-item ${activeTab === 'etkinliklerim' ? 'active' : ''}`}>
                    <a href="#" onClick={() => handleTabClick('etkinliklerim')}>
                      Etkinliklerim
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
  
            <div className="col-lg-9">
                {activeTab === 'etkinliklerim' && <EventsComp eventGroups={eventGroups} />}
            {activeTab === 'profilim' && <Profile /> }
            {activeTab === 'mesajlarim' && <div className="tab-pane fade" id="list-messages" role="tabpanel" aria-labelledby="list-messages-list">...</div>}
            {activeTab === 'ayarlar' && <div className="tab-pane fade" id="list-settings" role="tabpanel" aria-labelledby="list-settings-list">...</div>}
            {activeTab === 'premium' && <h1>premium</h1>}
            </div>
          </div>
        </div>
      </div>
    );
}

const Profile = () => {
    return (
        <h1>PROFİLE</h1>
    )
}


const EventsComp = ({eventGroups}) => {
    return (
        <>
        
        {Object.entries(eventGroups).map(([date, events]) => (
                    <div key={date}>
                      <h2 className="fs-4">{date}</h2>
                      <hr />
                      {events.map((event) => (
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
                    </div>
                  ))}
              
                <div className="tab-pane fade" id="list-profile" role="tabpanel" aria-labelledby="list-profile-list">
                  ...
                </div>
                <div className="tab-pane fade" id="list-messages" role="tabpanel" aria-labelledby="list-messages-list">
                  ...
                </div>
                <div className="tab-pane fade" id="list-settings" role="tabpanel" aria-labelledby="list-settings-list">
                  ...
                </div>
        </>
    )
}

export default UserProfile