import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ActiveScreen } from './src/screens/ActiveScreen';
import { EntryScreen } from './src/screens/EntryScreen';
import { HistoryScreen } from './src/screens/HistoryScreen';
import { ConfigScreen } from './src/screens/ConfigScreen';

// Import NativeWind styles removed


const Tab = createBottomTabNavigator();

import { Image, TouchableOpacity } from 'react-native';

export default function App() {
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={{
                    headerShown: true,
                    headerStyle: {
                        backgroundColor: '#f8fafc',
                        elevation: 0,
                        shadowOpacity: 0,
                        borderBottomWidth: 1,
                        borderBottomColor: '#f1f5f9',
                    },
                    headerTitleStyle: {
                        fontWeight: 'bold',
                        fontSize: 20,
                        color: '#1e293b',
                    },
                    headerRight: () => (
                        <Image
                            source={require('./assets/logo.png')}
                            style={{ width: 32, height: 32, marginRight: 16 }}
                            resizeMode="contain"
                        />
                    ),
                    tabBarActiveTintColor: '#4f46e5',
                    tabBarInactiveTintColor: '#94a3b8',
                    tabBarStyle: {
                        borderTopWidth: 1,
                        borderTopColor: '#f1f5f9',
                        height: 60,
                        paddingBottom: 8,
                        paddingTop: 8,
                    },
                }}
            >
                <Tab.Screen
                    name="Activos"
                    component={ActiveScreen}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="car-multiple" size={size} color={color} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Ingreso"
                    component={EntryScreen}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="plus-circle" size={size} color={color} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Historial"
                    component={HistoryScreen}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="history" size={size} color={color} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Config"
                    component={ConfigScreen}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="cog" size={size} color={color} />
                        ),
                    }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
}
