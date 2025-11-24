import { OnboardingDialog } from './components/onBoardingDiaglog';
import UserBubblesContainer from './components/userBubbleContainer';
import { useGetCurrentUser } from './hook/user/useGetCurrentUser';
import { useSocket } from './hook/useSocket';
import { usePresence } from './hook/usePresence';
import './index.css'

function App() {
  const { data: currentUser, isLoading } = useGetCurrentUser();
  const { isConnected } = useSocket();
  usePresence();

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className='bg-black min-h-screen flex items-center justify-center'>
        <div className="text-center space-y-4">
          <div className="text-4xl">⏳</div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-black min-h-screen'>
      {/* Connection indicator (optional) */}
      {currentUser && (
        <div className="fixed top-4 right-4 z-50">
          <div className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm ${isConnected
              ? 'bg-green-500/20 text-green-400'
              : 'bg-red-500/20 text-red-400'
            }`}>
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'
              }`} />
            {isConnected ? 'Connected' : 'Disconnected'}
          </div>
        </div>
      )}

      {!currentUser && <OnboardingDialog />}
      {currentUser && <UserBubblesContainer />}
    </div>

  );
}

export default App;
