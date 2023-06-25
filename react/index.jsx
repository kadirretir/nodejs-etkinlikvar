import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import ProgressBar from './components/ProgressBar/ProgressBar.jsx';
import Events from './components/Events/Events.jsx';
import Login from './components/Login/Login.jsx';
import UserProfile from './components/User/UserProfile.jsx';

const pathname = window.location.pathname;

if (pathname === '/events/newevent' || pathname === '/events/newevent/') {
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
} else if (pathname === '/events' || pathname === '/events/') {
  const eventsNode = document.getElementById('myEvents');
  const eventsRoot = createRoot(eventsNode);
  const eventsData = JSON.parse(eventsNode.getAttribute('data-events'));
  const userData = JSON.parse(eventsNode.getAttribute('data-user'));
  const searchresults = JSON.parse(eventsNode.getAttribute('search-results'));
  const categoryData = JSON.parse(eventsNode.getAttribute("category-data"))
  eventsRoot.render(
    <StrictMode>
      <Events 
      eventsData={eventsData} 
      searchresults={searchresults} 
      categoryData={categoryData}
      userData={userData} />
    </StrictMode>
  );
}  else if (pathname === '/login' || pathname === '/login/') {
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
} else if (pathname === '/user/profile' || pathname === '/user/profile/') {
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
}