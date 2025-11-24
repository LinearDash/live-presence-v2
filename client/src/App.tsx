import { OnboardingDialog } from './components/onBoardingDiaglog';
import UserBubblesContainer from './components/userBubbleContainer';
import { useGetCurrentUser } from './hook/user/useGetCurrentUser';
import './index.css'

function App() {
  const { data: currentUser, isLoading } = useGetCurrentUser();

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
      {/* Only show onboarding if no current user */}
      {!currentUser && <OnboardingDialog />}
      <UserBubblesContainer />
    </div>
  );
}

export default App;
