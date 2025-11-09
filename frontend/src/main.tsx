import { createRoot } from 'react-dom/client';
import './index.scss';
import App from './app.tsx';
import { TablesContextProvider } from './contexts/tables-context.tsx';

createRoot(document.getElementById('root')!).render(
  <TablesContextProvider>
    <App />
  </TablesContextProvider>
);
