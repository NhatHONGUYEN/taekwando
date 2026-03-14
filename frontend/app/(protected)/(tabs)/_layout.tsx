import { Tabs, usePathname } from 'expo-router';
import { Home, Dumbbell, ListMusic, CalendarCheck, User } from 'lucide-react-native';

const icons = {
  home: Home,
  exercises: Dumbbell,
  playlists: ListMusic,
  sessions: CalendarCheck,
  profile: User,
};

const BRAND = '#E8622A';
const INACTIVE = '#4B5563';
const TAB_BG = '#0D0905';

export default function TabsLayout() {
  const pathname = usePathname();

  return (
    <Tabs
      screenOptions={({ route }) => {
        const Icon = icons[route.name as keyof typeof icons];
        const isActive = pathname?.startsWith('/' + route.name);
        return {
          headerShown: false,
          tabBarIcon: ({ size }) => <Icon color={isActive ? BRAND : INACTIVE} size={size ?? 24} />,
          tabBarActiveTintColor: BRAND,
          tabBarInactiveTintColor: INACTIVE,
          tabBarStyle: {
            backgroundColor: TAB_BG,
            borderTopColor: '#2D2015',
            borderTopWidth: 1,
            paddingTop: 8,
            height: 80,
          },
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '700',
            letterSpacing: 0.8,
          },
        };
      }}>
      <Tabs.Screen name="home" options={{ title: 'HOME' }} />
      <Tabs.Screen name="exercises" options={{ title: 'WORKOUTS' }} />
      <Tabs.Screen name="playlists" options={{ title: 'PLAYLISTS' }} />
      <Tabs.Screen name="sessions" options={{ title: 'STATS' }} />
      <Tabs.Screen name="profile" options={{ title: 'PROFILE' }} />
    </Tabs>
  );
}
