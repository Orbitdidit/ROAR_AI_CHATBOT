import { useState } from 'react';
import Layout from './components/Layout';
import ChatScreen from './components/ChatScreen';
import StudyTools from './components/StudyTools';
import SupportPage from './components/SupportPage';
import AdminDashboard from './components/AdminDashboard';
import { Screen } from './types';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<Screen>('chat');

  const renderScreen = () => {
    switch (activeScreen) {
      case 'chat':
        return <ChatScreen />;
      case 'study':
        return <StudyTools />;
      case 'support':
        return <SupportPage />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <ChatScreen />;
    }
  };

  return (
    <Layout activeScreen={activeScreen} setActiveScreen={setActiveScreen}>
      {renderScreen()}
    </Layout>
  );
}
