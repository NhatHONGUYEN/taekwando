import { Tabs, usePathname } from 'expo-router';
import { Home, Dumbbell, ListMusic, CalendarCheck, User } from 'lucide-react-native';

const icons = {
  home: Home,
  exercises: Dumbbell,
  playlists: ListMusic,
  sessions: CalendarCheck,
  profile: User,
};

export default function TabsLayout() {
  const pathname = usePathname();

  return (
    <Tabs
      screenOptions={({ route }) => {
        const Icon = icons[route.name as keyof typeof icons];
        // Vérifie si le pathname commence par le nom de la route
        const isActive = pathname?.startsWith('/' + route.name);
        return {
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon color={isActive ? '#007AFF' : color} size={size ?? 24} />
          ),
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: '#888',
        };
      }}>
      <Tabs.Screen name="home" options={{ title: 'Home' }} />
      <Tabs.Screen name="exercises" options={{ title: 'Exercises' }} />
      <Tabs.Screen name="playlists" options={{ title: 'Playlists' }} />
      <Tabs.Screen name="sessions" options={{ title: 'Sessions' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
