import React, { useState } from 'react';
import WelcomePage from './WelcomePage';
import ValentinesWrappedShowcase1 from './ValentinesWrappedShowcase1';
import ValentinesWrappedShowcase2 from './ValentinesWrappedShowcase2';
import ValentinesWrappedShowcase3 from './ValentinesWrappedShowcase3';

function App() {
  const [currentPage, setCurrentPage] = useState(0);

  const pages = [
    <WelcomePage key="welcome" onStart={() => setCurrentPage(1)} />,
    <ValentinesWrappedShowcase1 key="disk-puzzle" onNext={() => setCurrentPage(2)} />,
    <ValentinesWrappedShowcase2 key="blocks" onNext={() => setCurrentPage(3)} />,
    <ValentinesWrappedShowcase3 key="waves" />
  ];

  return pages[currentPage];
}

export default App;