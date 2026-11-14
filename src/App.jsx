import { useApp, AppProvider } from './context/AppContext.jsx';
import AuthScreen from './screens/AuthScreen.jsx';
import VerifyEmailScreen from './screens/VerifyEmailScreen.jsx';
import MainShell from './screens/MainShell.jsx';
import {
  BannedScreen,
  MaintenanceScreen,
  ProfileErrorScreen,
  SplashScreen,
} from './screens/StatusScreens.jsx';

function Gate() {
  const { authUser, profile, config, isAdmin } = useApp();

  if (authUser === undefined) return <SplashScreen />;
  if (!authUser) return <AuthScreen />;
  if (!authUser.emailVerified) return <VerifyEmailScreen />;
  if (profile === undefined) return <SplashScreen />;
  if (profile === null) return <ProfileErrorScreen />;
  if (profile.banned) return <BannedScreen />;
  if (config.maintenanceMode && !isAdmin) return <MaintenanceScreen />;
  return <MainShell />;
}

export default function App() {
  return (
    <AppProvider>
      <Gate />
    </AppProvider>
  );
}
