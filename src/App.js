import React, { useState } from 'react';
import WelcomePage from './WelcomePage';
import SpotifyWrappedShowcase1 from './SpotifyWrappedShowcase1';
import SpotifyWrappedShowcase2 from './SpotifyWrappedShowcase2';
import SpotifyWrappedShowcase3 from './SpotifyWrappedShowcase3';

function App() {
  const [currentPage, setCurrentPage] = useState(0);

  const pages = [
    <WelcomePage key="welcome" onStart={() => setCurrentPage(1)} />,
    <SpotifyWrappedShowcase1 key="disk-puzzle" onNext={() => setCurrentPage(2)} />,
    <SpotifyWrappedShowcase2 key="blocks" onNext={() => setCurrentPage(3)} />,
    <SpotifyWrappedShowcase3 key="waves" />
  ];

  return pages[currentPage];
}

export default App;