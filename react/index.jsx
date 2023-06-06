import React, {StrictMode} from 'react'
import { createRoot } from 'react-dom/client';
import ProgressBar from './components/ProgressBar/ProgressBar.jsx';



const progressNode  = document.getElementById('progress-root');
const progressRoot = createRoot(progressNode);
progressRoot.render(
<StrictMode>
<ProgressBar />
</StrictMode>)