import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import ProgressBar from './components/ProgressBar/ProgressBar.jsx';
import Events from './components/Events/Events.jsx';
import Login from './components/Login/Login.jsx';
import UserProfile from './components/User/UserProfile.jsx';
import Notification from './components/Notification/Notification.jsx';
import IndexFilter from './components/IndexFilterLocation/IndexFilter.jsx';

var pathname = window.location.pathname;

function checkValue (val) {
  switch (pathname) {
    case "/events/newevent":
    case "/events/newevent/":
      const progressNode = document.getElementById('progress-root');
      const progressRoot = createRoot(progressNode);
      const eventCategories = JSON.parse(progressNode.getAttribute("event-categories"))
      progressRoot.render(
        <StrictMode>
          <ProgressBar
          eventCategories={eventCategories}
          />
        </StrictMode>
      );
      break;
    case "/events":
    case "/events/":
      const eventsNode = document.getElementById('myEvents');
      const eventsRoot = createRoot(eventsNode);
      const eventData = JSON.parse(eventsNode.getAttribute('data-events'));
      const usersData = JSON.parse(eventsNode.getAttribute('data-user'));
      const searchresults = JSON.parse(eventsNode.getAttribute('search-results'));
      const categoryData = JSON.parse(eventsNode.getAttribute("category-data"))
      eventsRoot.render(
        <StrictMode>
          <Events 
          eventsData={eventData} 
          searchresults={searchresults} 
          categoryData={categoryData}
          userData={usersData} />
        </StrictMode>
      );
      break;
    case "/login":
    case "/login/":
      const loginNode = document.getElementById('login');
      const loginRoot = createRoot(loginNode);
      const errorMessage = JSON.parse(loginNode.getAttribute("error-message"));
      loginRoot.render(
        <StrictMode>
          <Login 
          errorMessage={errorMessage}
          />
        </StrictMode>
      );
      break;
    case "/user/profile":
    case "/user/profile/":
      const userNode = document.getElementById('userProfile');
      const userRoot = createRoot(userNode);
      const userData = JSON.parse(userNode.getAttribute("user-data"));
      const eventsData = JSON.parse(userNode.getAttribute("event-data"));
      userRoot.render(
        <StrictMode>
          <UserProfile 
          userData={userData}
          eventsData={eventsData}
          />
        </StrictMode>
      );
      break;
      case "/":
        const searchNode = document.getElementById('searchBoxLocation');
      const searchRoot = createRoot(searchNode);
      searchRoot.render(
        <StrictMode>
          <IndexFilter 
          />
        </StrictMode>
      );
    default:
      
      break;
      
  }
  return true;
}

if (checkValue(pathname)) {
          // Diğer durumlar için işlemler
          const notificationNode = document.getElementById("notificationNode");
              if(notificationNode !== null) {
                const notificationRoot = createRoot(notificationNode);
                const notificationData = JSON.parse(notificationNode.getAttribute("notification-data"));
        
                  notificationRoot.render(
                    <StrictMode>
                      <Notification
                        notificationData={notificationData}
                      />
                    </StrictMode>
                  );
              }

      
       

}