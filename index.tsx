import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import GiveawayApp from './giveaway domain/src/App';
import './index.css';
import './giveaway domain/src/index.css';

const isGiveawayRoute = window.location.pathname === '/giveaway' || window.location.pathname.startsWith('/giveaway/');
const RootApp = isGiveawayRoute ? GiveawayApp : App;

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <RootApp />
    </React.StrictMode>
  );
}