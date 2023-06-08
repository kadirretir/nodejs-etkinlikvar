import React, {StrictMode} from 'react'
import { createRoot } from 'react-dom/client';
import ProgressBar from './components/ProgressBar/ProgressBar.jsx';
import Events from './components/Events/Events.jsx';
const pathname = window.location.pathname;


if (pathname === '/events/newevent' || pathname === '/events/newevent/') {
    const progressNode = document.getElementById('progress-root');
    const progressRoot = createRoot(progressNode);
    progressRoot.render(
      <StrictMode>
        <ProgressBar />
      </StrictMode>
    );
    } else if (pathname === '/events/' || pathname === '/events') {
        const eventsNode = document.getElementById('myEvents');
        const eventsRoot = createRoot(eventsNode);
        const parsedData = JSON.parse(eventsNode.getAttribute("data-events"))
        eventsRoot.render(
          <StrictMode>
            <Events deneme={parsedData}/>
          </StrictMode>
        );
      }



