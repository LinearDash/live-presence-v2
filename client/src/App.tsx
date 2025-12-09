import { OnboardingDialog } from './components/onBoardingDiaglog';
import UserBubblesContainer from './components/userBubbleContainer';
import { useGetCurrentUser } from './hook/user/useGetCurrentUser';
import { useSocket } from './hook/useSocket';
import { usePresence } from './hook/usePresence';
import './index.css'
import LoadingPage from './components/common/loadingPage';
import ConnectionIndicator from './components/common/connectionIndicator';

function App() {

  const { data: currentUser, isLoading } = useGetCurrentUser();

  const { isConnected } = useSocket();
  usePresence();
  if (isLoading) {
    return (
      <LoadingPage message="Checking authentication..." />
    );
  }
  return (
    <div className='bg-black min-h-screen'>
      {/* Connection indicator (optional) */}
      {currentUser && ConnectionIndicator(isConnected)}
      {!currentUser && <OnboardingDialog />}
      {currentUser && <UserBubblesContainer />}
      
    </div>

  );
}

export default App;
