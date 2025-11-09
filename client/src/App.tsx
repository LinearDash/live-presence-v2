import { OnboardingDialog } from './components/onBoardingDiaglog';
import UserBubblesContainer from './components/userBubbleContainer';
import './index.css'

function App() {


  return (
    <div className='bg-black min-h-screen'>
      <OnboardingDialog />
      <UserBubblesContainer />
    </div>
  );
}

export default App;
