import React from 'react';

import AppBar from './components/AppBar/AppBar';
import WebRTCVideoChat from './components/WebRTCVideoChat/WebRTCVideoChat';
import './App.css';

function App() {
  return (
    <div className="App">
      <AppBar />
      <WebRTCVideoChat />
    </div>
  );
}

export default App;
