import React from 'react';
import { createRoot } from 'react-dom/client';
import Notification from './components/Notification/Notification.jsx';
import Events from './components/Events/Events.jsx';
import IndexFilter from './components/IndexFilterLocation/IndexFilter.jsx';

const NewEvent = React.lazy(() => import('./components/NewEvent/NewEvent.jsx'));
const Login = React.lazy(() => import('./components/Login/Login.jsx'));
const Usermain = React.lazy(() => import('./components/User/Usermain.jsx'));
const GeneralSearch = React.lazy(() => import('./components/GeneralSearch/GeneralSearch.jsx'));
const App = React.lazy(() => import('./components/User/Registrationverify/App.jsx'));
const SimilarEvents = React.lazy(() => import('./components/SimilarEvents/SimilarEvents.jsx'));


var pathname = window.location.pathname;

function checkValue (val) {

  switch (true) {
    case pathname.startsWith("/events/") && pathname.slice(8).length >= 24:

  
    const similarEventsNode = document.getElementById('similarEventsRoot');
    const similarEventsRoot = createRoot(similarEventsNode);
    const similarEventsInfo = JSON.parse(similarEventsNode.getAttribute("similar-events"))

    similarEventsRoot.render(
        <SimilarEvents
        similarEventsInfo={similarEventsInfo}
        />
    );
    break;
    case pathname === "/events/newevent":
    case pathname === "/events/newevent/":
      const progressNode = document.getElementById('progress-root');
      const progressRoot = createRoot(progressNode);
      // const userInfo = JSON.parse(progressNode.getAttribute("user-info"))
      // const messages = JSON.parse(progressNode.getAttribute("messages"))
      const userInfo = JSON.parse(progressNode.getAttribute("user-info"))
      const messages = JSON.parse(progressNode.getAttribute("messages"))

      progressRoot.render(
          <NewEvent
          messages={messages}
          userInfo={userInfo}
          />
      );
      break;
    case pathname === "/events":
    case pathname === "/events/":
        const eventsNode = document.getElementById('myEvents');
        const eventsRoot = createRoot(eventsNode);
        const usersData = JSON.parse(eventsNode.getAttribute('data-user'));
        const usercity = JSON.parse(eventsNode.getAttribute("user-city"))
        const interestsearch = JSON.parse(eventsNode.getAttribute('interest-search'));
        const generalSearchResults = JSON.parse(eventsNode.getAttribute("general-search"));
        const searchresults = JSON.parse(eventsNode.getAttribute('search-results'));
        const categoryData = JSON.parse(eventsNode.getAttribute("category-data"));
        const createdEventMessage = JSON.parse(eventsNode.getAttribute("created-event-message"))
        const trendingEvents = JSON.parse(eventsNode.getAttribute("trending-events"))
        const popularCategories = JSON.parse(eventsNode.getAttribute("trending-categories"))
        const userEvents = JSON.parse(eventsNode.getAttribute("user-events"))
        eventsRoot.render(
            <Events 
            usercity={usercity}
            userEvents={userEvents}
            createdEventMessage={createdEventMessage}
            generalSearchResults={generalSearchResults}
            interestsearch={interestsearch}
            searchresults={searchresults} 
            categoryData={categoryData}
            trendingEvents={trendingEvents}
            popularCategories={popularCategories}
            userData={usersData} />
        );
      break;
    case pathname === "/login":
    case pathname === "/login/":
      const loginNode = document.getElementById('login');
      const loginRoot = createRoot(loginNode);
      const errorMessage = JSON.parse(loginNode.getAttribute("error-message"));
      loginRoot.render(
          <Login 
          errorMessage={errorMessage}
          />
      );
      break;
      case pathname === "/user/registrationverify":
      case pathname === "/user/registrationverify/":
      case pathname === "/user/registrationinterests":
      case pathname === "/user/registrationinterests/":
        const registrationverifyNode = document.getElementById('afterRegistration');
        const registrationverifyRoot = createRoot(registrationverifyNode);
        const isVerified = JSON.parse(registrationverifyNode.getAttribute('isVerified'));
        registrationverifyRoot.render(
              <App 
              isVerified={isVerified}
              />
          );
          break;
    case pathname === "/user/profile":
    case pathname === "/user/profile/":
    case pathname === "/user/information":
    case pathname === "/user/information/":
    case pathname === "/user/privacy":
    case pathname === "/user/privacy/":
    case pathname === "/user/interest":
    case pathname === "/user/interest/":
    case pathname === "/user/subscription":
    case pathname === "/user/subscription/":
    case pathname === "/user/paymentmethod":
    case pathname === "/user/paymentmethod/":
      const userNode = document.getElementById('userProfile');
      const userRoot = createRoot(userNode);
      const userData = JSON.parse(userNode.getAttribute("user-data"));
      const eventsData = JSON.parse(userNode.getAttribute("event-data"));
      const cancelledMessage = JSON.parse(userNode.getAttribute("cancelled-event-message"))
      userRoot.render(
          <Usermain 
          userData={userData}
          eventsData={eventsData}
          cancelledMessage={cancelledMessage}
          />
      );
      break;
      case pathname === "/":
        const searchNode = document.getElementById('searchBoxLocation');
      const searchRoot = createRoot(searchNode);
      searchRoot.render(
          <IndexFilter />
      );
    default:
      
      break;
      
  }
  return true;
}

if (checkValue(pathname)) {
          // Diğer durumlar için işlemler

          // NOTIFICATION KOMPONENT
          const notificationNode = document.getElementById("notificationNode");
              if(notificationNode !== null) {
                const notificationRoot = createRoot(notificationNode);
                const notificationData = JSON.parse(notificationNode.getAttribute("notification-data"));
                const addedAttendeeEventId = JSON.parse(notificationNode.getAttribute("addedAttendeeEventId"));


                  notificationRoot.render(
                      <Notification
                      addedAttendeeEventId={addedAttendeeEventId}
                        notificationData={notificationData}
                      />
                  );
              }

        
          // GENERAL SEARCH KOMPONENT
          const searchNode = document.getElementById("searchRoot");
          if(searchNode !== null) {
            const searchRoot = createRoot(searchNode);
            const searchData = JSON.parse(searchNode.getAttribute("search-value"));

            searchRoot.render(
                <GeneralSearch
                searchData={searchData}
                />
            )
          }


}

