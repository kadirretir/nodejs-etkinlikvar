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
      const userInfo = JSON.parse(progressNode.getAttribute("user-info"))
      progressRoot.render(
        <StrictMode>
          <ProgressBar
          eventCategories={eventCategories}
          userInfo={userInfo}
          />
        </StrictMode>
      );
      break;
    case "/events":
    case "/events/":
      const eventsNode = document.getElementById('myEvents');
      const eventsRoot = createRoot(eventsNode);
      const usersData = JSON.parse(eventsNode.getAttribute('data-user'));
      const searchresults = JSON.parse(eventsNode.getAttribute('search-results'));
      const categoryData = JSON.parse(eventsNode.getAttribute("category-data"));
      const createdEventMessage = JSON.parse(eventsNode.getAttribute("created-event-message"))
      const trendingEvents = JSON.parse(eventsNode.getAttribute("trending-events"))
      const popularCategories = JSON.parse(eventsNode.getAttribute("trending-categories"))
      const userEvents = JSON.parse(eventsNode.getAttribute("user-events"))
      eventsRoot.render(
        <StrictMode>
          <Events 
          userEvents={userEvents}
          createdEventMessage={createdEventMessage}
          searchresults={searchresults} 
          categoryData={categoryData}
          trendingEvents={trendingEvents}
          popularCategories={popularCategories}
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
      const cancelledMessage = JSON.parse(userNode.getAttribute("cancelled-event-message"))
      userRoot.render(
        <StrictMode>
          <UserProfile 
          userData={userData}
          eventsData={eventsData}
          cancelledMessage={cancelledMessage}
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