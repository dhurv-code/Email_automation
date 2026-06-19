import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import Campaigns from './pages/Campaigns';
import Conversations from './pages/Conversations';
import EmailLogs from './pages/EmailLogs';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/conversations" element={<Conversations />} />
          <Route path="/email-logs" element={<EmailLogs />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
                
