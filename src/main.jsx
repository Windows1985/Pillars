import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
import * as Tooltip from '@radix-ui/react-tooltip';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Tooltip.Provider delayDuration={300}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Tooltip.Provider>
  </StrictMode>
);
