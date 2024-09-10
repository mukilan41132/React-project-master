import './App.css';
import React, { useState } from 'react';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { IconButton } from '@mui/material';
import SavingModule from './component/SavingSegmentModule'
function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = (open) => () => {
    setIsDrawerOpen(open);
  };
  return (
    <div className="App">
      <header className="App-header">
        <div className='View-Audiece'>
          <IconButton  >
            <ChevronLeftIcon
              style={{
                fontSize: 40,
                color: "white"
              }}
            />
          </IconButton>
          <span id='cursor'>View Audience</span>
        </div>
      </header>
      <div className='btn-main'>
        <button className='btn-style' onClick={toggleDrawer(true)}>
          Save Segment
        </button>
      </div>
      <SavingModule open={isDrawerOpen} onClose={toggleDrawer(false)} />
    </div>
  );
}

export default App;
