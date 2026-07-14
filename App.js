import './global.css';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFonts, PirataOne_400Regular } from '@expo-google-fonts/pirata-one';
import { View, ActivityIndicator } from 'react-native';

import { WatchlistProvider } from './src/context/WatchlistContext';
import { SettingsProvider } from './src/context/SettingsContext';
import DashboardScreen from './src/screens/DashboardScreen';
import LocatorScreen from './src/screens/LocatorScreen';
import ScannerScreen from './src/screens/ScannerScreen';
import WatchlistScreen from './src/screens/WatchlistScreen';
import MerchantsScreen from './src/screens/MerchantsScreen';
import { colors } from './src/theme/colors';

const Tab = createBottomTabNavigator();

const OceanTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colors.aqua400,
    background: colors.ocean950,
    card: colors.ocean900,
    text: colors.parchment,
    border: colors.ocean700,
    notification: colors.gold400,
  },
};

function TabIcon({ route, color, size }) {
  switch (route.name) {
    case 'Dashboard':
      return <Ionicons name="compass" size={size} color={color} />;
    case 'Locator':
      return <Ionicons name="map" size={size} color={color} />;
    case 'Scanner':
      return <Ionicons name="barcode-outline" size={size} color={color} />;
    case 'Watchlist':
      return <MaterialCommunityIcons name="treasure-chest" size={size} color={color} />;
    case 'Merchants':
      return <Ionicons name="storefront-outline" size={size} color={color} />;
    default:
      return null;
  }
}

export default function App() {
  const [fontsLoaded] = useFonts({ PirataOne_400Regular });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.ocean950, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={colors.aqua400} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <WatchlistProvider>
          <NavigationContainer theme={OceanTheme}>
            <StatusBar style="light" />
            <Tab.Navigator
              screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ color, size }) => <TabIcon route={route} color={color} size={size} />,
                tabBarActiveTintColor: colors.gold400,
                tabBarInactiveTintColor: colors.aqua700,
                tabBarStyle: {
                  backgroundColor: colors.ocean900,
                  borderTopColor: colors.ocean700,
                },
              })}
            >
              <Tab.Screen name="Dashboard" component={DashboardScreen} />
              <Tab.Screen name="Locator" component={LocatorScreen} />
              <Tab.Screen name="Scanner" component={ScannerScreen} />
              <Tab.Screen name="Watchlist" component={WatchlistScreen} />
              <Tab.Screen name="Merchants" component={MerchantsScreen} />
            </Tab.Navigator>
          </NavigationContainer>
        </WatchlistProvider>
      </SettingsProvider>
    </SafeAreaProvider>
  );
}
