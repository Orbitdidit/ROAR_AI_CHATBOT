import { useState, useEffect } from 'react';
import Layout from './components/Layout';
import ChatScreen from './components/ChatScreen';
import StudyTools from './components/StudyTools';
import SupportPage from './components/SupportPage';
import AdminDashboard from './components/AdminDashboard';
import Onboarding from './components/Onboarding';
import { Screen, Source, UserProfile, SourceType, UserRole } from './types';

export default function App() {
  // One-time version migration check
  const currentVer = localStorage.getItem('roar_app_version');
  if (currentVer !== '2.0') {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('roar_')) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
    
    localStorage.setItem('roar_app_version', '2.0');
    window.location.reload();
    return null; // Stop rendering
  }

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [consent, setConsent] = useState<{ agreed: boolean; timestamp: string } | null>(null);
  const [activeScreen, setActiveScreen] = useState<Screen>('chat');
  const [activeSources, setActiveSources] = useState<Source[]>([]);
  const [sharedActiveSourceId, setSharedActiveSourceId] = useState("");
  const [sharedStudyMode, setSharedStudyMode] = useState<'cards' | 'quiz' | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Load persistent data
  useEffect(() => {
    const savedUniqueId = localStorage.getItem('roar_unique_id');
    const savedConsent = localStorage.getItem('roar_consent');
    const savedProfile = localStorage.getItem('roar_student_profile');
    const savedSources = localStorage.getItem('roar_active_sources');
    
    const hasAllThree = savedUniqueId && savedConsent && savedProfile;
    
    if (hasAllThree) {
      try {
        const parsedConsent = JSON.parse(savedConsent);
        const parsedProfile = JSON.parse(savedProfile);
        
        if (parsedConsent && parsedConsent.agreed && parsedProfile) {
          if (!parsedProfile.role) {
            parsedProfile.role = 'student';
          }
          setConsent(parsedConsent);
          setUserProfile(parsedProfile);
          const isRoleAdmin = ['faculty', 'admin', 'staff'].includes(parsedProfile.role);
          setActiveScreen(isRoleAdmin ? 'admin' : 'chat');
        } else {
          setConsent(null);
          setUserProfile(null);
        }
      } catch (e) {
        setConsent(null);
        setUserProfile(null);
      }
    } else {
      setConsent(null);
      setUserProfile(null);
    }
    
    if (savedSources) {
      try {
        setActiveSources(JSON.parse(savedSources));
      } catch (e) {
        setActiveSources([]);
      }
    }
    
    setIsInitialized(true);
  }, []);

  // Save profile changes
  useEffect(() => {
    if (userProfile) {
      localStorage.setItem('roar_student_profile', JSON.stringify(userProfile));
    }
  }, [userProfile]);

  // Save source changes
  useEffect(() => {
    localStorage.setItem('roar_active_sources', JSON.stringify(activeSources));
  }, [activeSources]);

  const handleOnboardingComplete = (profile: UserProfile) => {
    setUserProfile(profile);
    // Refresh consent state as it should have been saved during onboarding
    const savedConsent = localStorage.getItem('roar_consent');
    if (savedConsent) {
      setConsent(JSON.parse(savedConsent));
    }
    import('./lib/analytics').then(({ trackEvent }) => {
      trackEvent('onboarding_complete', profile);
    });
    const isRoleAdmin = ['faculty', 'admin', 'staff'].includes(profile.role);
    setActiveScreen(isRoleAdmin ? 'admin' : 'chat');
  };

  const addSource = (source: Source) => {
    setActiveSources(prev => [...prev, source]);
    if (userProfile) {
      import('./lib/analytics').then(({ trackEvent }) => {
        if (source.type === 'pack') {
          trackEvent('study_pack_selected', userProfile, { packId: source.id, packTitle: source.name });
        } else {
          trackEvent('source_added', userProfile, { sourceType: source.type, sourceName: source.name });
        }
      });
    }
  };

  const removeSource = (id: string) => {
    setActiveSources(prev => prev.filter(s => s.id !== id));
  };

  const resetDemo = () => {
    localStorage.removeItem('roar_student_profile');
    localStorage.removeItem('roar_active_sources');
    localStorage.removeItem('roar_consent');
    setUserProfile(null);
    setConsent(null);
    setActiveSources([]);
    setActiveScreen('chat');
    // Force reload to completely clear all internal component states
    window.location.reload();
  };

  const withdrawConsent = () => {
    const consentObj = {
      agreed: false,
      timestamp: new Date().toISOString(),
      student_id: userProfile?.id || 'demo_user',
      consent_version: 'v1.0_pending_legal'
    };
    localStorage.setItem('roar_consent', JSON.stringify(consentObj));
    setConsent(consentObj);
    // Profile is kept but they are logged out of the app access
    setActiveScreen('welcome');
    // Force reload to ensure clean state
    window.location.reload();
  };

  const handleSignOut = () => {
    localStorage.removeItem('roar_unique_id');
    localStorage.removeItem('roar_role');
    localStorage.removeItem('roar_student_profile');
    localStorage.removeItem('roar_consent');
    setUserProfile(null);
    setConsent(null);
    setActiveSources([]);
    setActiveScreen('chat');
    window.location.reload();
  };

  const switchRole = (role: UserRole) => {
    if (!userProfile) return;
    const isNowAdmin = ['faculty', 'admin', 'staff'].includes(role);
    const updatedProfile: UserProfile = { 
      ...userProfile, 
      role,
      email: isNowAdmin ? 'roar.admin@demo.com' : (userProfile.email.includes('@student.tsu.edu') ? userProfile.email : 'demo.student@tsu.edu'),
      firstName: isNowAdmin ? 'ROAR' : userProfile.firstName,
      lastName: isNowAdmin ? 'Admin' : userProfile.lastName,
    };
    setUserProfile(updatedProfile);
    // Explicitly set screen if switching to admin or back to student to avoid invalid states
    if (isNowAdmin) {
      setActiveScreen('admin');
    } else {
      setActiveScreen('chat');
    }
  };

  const toggleSource = (source: Source) => {
    const exists = activeSources.find(s => s.id === source.id);
    if (exists) {
      removeSource(source.id);
    } else {
      addSource(source);
    }
  };

  const handleUpload = (type: SourceType, name: string, format?: Source['format']) => {
    if (!userProfile) return;
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            const newSource: Source = {
              id: 'custom-' + Date.now(),
              type: type,
              name: name,
              format: format || (type === 'link' ? 'link' : type === 'note' ? 'note' : 'pdf'),
              details: type === 'pack' ? 'Institutional Library' : 
                       type === 'spreadsheet' ? 'Data Sheet' :
                       type === 'drive' ? 'Cloud Doc' : 'Student Upload',
              size: type === 'link' ? 'URL' : '4.2 MB',
              addedAt: new Date().toISOString()
            };
            addSource(newSource);
          }, 800);
          return 100;
        }
        return prev + 25;
      });
    }, 150);
  };

  const renderScreen = () => {
    const hasAgreed = consent?.agreed === true;

    if (!userProfile || !hasAgreed || activeScreen === 'welcome') {
      return <Onboarding onComplete={handleOnboardingComplete} />;
    }

    switch (activeScreen) {
      case 'chat':
        return (
          <ChatScreen 
            userProfile={userProfile} 
            activeSourceId={sharedActiveSourceId}
            setActiveSourceId={setSharedActiveSourceId}
            setActiveScreen={setActiveScreen}
            setStudyMode={setSharedStudyMode}
          />
        );
      case 'study':
        return (
          <StudyTools 
            userProfile={userProfile}
            activeSourceId={sharedActiveSourceId}
            setActiveSourceId={setSharedActiveSourceId}
            studyMode={sharedStudyMode}
            setStudyMode={setSharedStudyMode}
          />
        );
      case 'support':
        return <SupportPage userProfile={userProfile} />;
      case 'admin':
        if (userProfile.role && ['faculty', 'admin', 'staff'].includes(userProfile.role)) {
          return <AdminDashboard userProfile={userProfile} />;
        }
        return (
          <ChatScreen 
            userProfile={userProfile} 
            activeSourceId={sharedActiveSourceId}
            setActiveSourceId={setSharedActiveSourceId}
            setActiveScreen={setActiveScreen}
            setStudyMode={setSharedStudyMode}
          />
        );
      default:
        return (
          <ChatScreen 
            userProfile={userProfile} 
            activeSourceId={sharedActiveSourceId}
            setActiveSourceId={setSharedActiveSourceId}
            setActiveScreen={setActiveScreen}
            setStudyMode={setSharedStudyMode}
          />
        );
    }
  };

  if (!isInitialized) return null;

  if (!userProfile) {
    return (
      <div className="bg-surface min-h-screen">
        {renderScreen()}
      </div>
    );
  }

  return (
    <Layout 
      activeScreen={activeScreen} 
      setActiveScreen={setActiveScreen} 
      userProfile={userProfile}
      isUploading={isUploading}
      uploadProgress={uploadProgress}
      onResetDemo={resetDemo}
      onWithdrawConsent={withdrawConsent}
      onSwitchRole={switchRole}
      onSignOut={handleSignOut}
    >
      {renderScreen()}
    </Layout>
  );
}
