import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import LoginScreen from './components/screens/Loginscreen';
import RegisterScreen from './components/screens/Registerscreen';
import Homescreen from './components/screens/Homescreen';
import MangaReader from './components/screens/MangaReader';
import BookmarkScreen from './components/screens/BookmarkScreen';
import HistoryScreen from './components/screens/HistoryScreen';
import PageViewer from './components/screens/PageViewer';
import LocalApiScreen from './components/screens/LocalApiScreen';
import MangaDexScreen from './components/screens/MangaDexScreen';
import OfflineScreen from './components/screens/OfflineScreen';
import ProfileScreen from './components/screens/ProfileScreen';
import ChangePasswordScreen from './components/screens/ChangePasswordScreen';
import LightNovelScreen from './components/screens/LightNovelScreen';
import LightNovelEditorScreen from './components/screens/LightNovelEditor';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: '#1e1b2e' },
        tabBarActiveTintColor: '#a78bfa',
        tabBarInactiveTintColor: '#aaa',
        tabBarIcon: ({ color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Homescreen':
              iconName = 'home';
              break;
            case 'BookmarkScreen':
              iconName = 'bookmark';
              break;
            case 'HistoryScreen':
              iconName = 'time';
              break;
            case 'LocalAPI':
              iconName = 'laptop';
              break;
            case 'MangaDex':
              iconName = 'globe';
              break;
            case 'Offline':
              iconName = 'download';
              break;
            default:
              iconName = 'ellipse';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Homescreen" component={Homescreen} />
      <Tab.Screen name="BookmarkScreen" component={BookmarkScreen} />
      <Tab.Screen name="HistoryScreen" component={HistoryScreen} />
      <Tab.Screen name="LocalAPI" component={LocalApiScreen} />
      <Tab.Screen name="MangaDex" component={MangaDexScreen} />
      <Tab.Screen name="Offline" component={OfflineScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="MangaReader" component={MangaReader} />
        <Stack.Screen
          name="PageViewer"
          component={PageViewer}
          options={{ title: 'Page Viewer', headerShown: true }}
        />
        <Stack.Screen
          name="ProfileScreen"
          component={ProfileScreen}
          options={{ title: 'Profile', headerShown: true }}
        />
        <Stack.Screen
          name="ChangePasswordScreen"
          component={ChangePasswordScreen}
          options={{ title: 'Change Password', headerShown: true }}
        />
        <Stack.Screen
          name="LightNovelScreen"
          component={LightNovelScreen}
          options={{ title: 'Light Novel', headerShown: true }}
        />
        <Stack.Screen
          name="LightNovelEditorScreen"
          component={LightNovelEditorScreen}
          options={{ title: 'Light Novel Editor', headerShown: true }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
