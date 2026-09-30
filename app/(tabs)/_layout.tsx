import React from 'react';
import { Tabs } from 'expo-router';
import { useColorScheme, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DarkColors, LightColors } from '../../src/constants/theme';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

interface TabConfig {
  name: string;
  title: string;
  icon: IconName;
  iconActive: IconName;
}

const TABS: TabConfig[] = [
  { name: 'index',      title: 'Today',      icon: 'home-outline',       iconActive: 'home' },
  { name: 'timetable', title: 'Schedule',   icon: 'calendar-outline',   iconActive: 'calendar' },
  { name: 'tasks',     title: 'Tasks',      icon: 'checkbox-outline',   iconActive: 'checkbox' },
  { name: 'attendance',title: 'Attendance', icon: 'bar-chart-outline',  iconActive: 'bar-chart' },
  { name: 'profile',   title: 'Profile',    icon: 'person-outline',     iconActive: 'person' },
];

export default function TabsLayout() {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? DarkColors : LightColors;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.tabIconActive,
        tabBarInactiveTintColor: colors.tabIconInactive,
        tabBarStyle: {
          backgroundColor: colors.tabBarBg,
          borderTopColor: colors.tabBarBorder,
          borderTopWidth: 1,
          paddingBottom: Platform.OS === 'ios' ? 24 : 8,
          paddingTop: 8,
          height: Platform.OS === 'ios' ? 84 : 64,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontFamily: 'Inter_500Medium',
          marginTop: -2,
        },
      }}
    >
      {TABS.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons
                name={focused ? tab.iconActive : tab.icon}
                size={size - 2}
                color={color}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
