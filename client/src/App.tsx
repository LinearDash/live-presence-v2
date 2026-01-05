import { OnboardingDialog } from './components/onBoardingDiaglog';
import UserBubblesContainer from './components/userBubbleContainer';
import MessageBubble from './components/messageBubble';
import MessageSidebar from './components/messageSidebar';
import { useGetCurrentUser } from './hook/user/useGetCurrentUser';
import { useSocket } from './hook/useSocket';
import { usePresence } from './hook/usePresence';
import './index.css'
import LoadingPage from './components/common/loadingPage';
import ConnectionIndicator from './components/common/connectionIndicator';
import { Switch } from './components/ui/switch';
import { useState } from 'react';

function App() {

  const { data: currentUser, isLoading } = useGetCurrentUser();
  const [showAllUsers, setShowAllUsers] = useState(false);
  const [messageSidebarOpen, setMessageSidebarOpen] = useState(false);

  const { isConnected } = useSocket();
  usePresence();
  if (isLoading) {
    return (
      <LoadingPage message="Checking authentication..." />
    );
  }
  return (
    <div className='bg-black min-h-screen'>
      {currentUser && (
      <div className="fixed m-4 top-4 left-4 z-50">
        <Switch onClick={() => setShowAllUsers(!showAllUsers)} />
        <label className="ml-2 text-white select-none">{showAllUsers ? "All Users" : "Active Users"}</label>
      </div>
      )}
      {currentUser && <ConnectionIndicator isConnected={isConnected} />}
      {!currentUser && <OnboardingDialog />}
      {currentUser && <UserBubblesContainer showAllUsers={showAllUsers} />}
      {currentUser && (
        <div className="fixed m-4 bottom-4 left-4 z-40">
          <MessageBubble onClick={() => setMessageSidebarOpen(true)} />
        </div>
      )}
      {messageSidebarOpen && (
        <MessageSidebar onClose={() => setMessageSidebarOpen(false)} />
      )}
    </div>

  );
}

export default App;
