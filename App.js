import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

// Importar pantallas
import ResumenScreen from './src/screens/ResumenScreen';
import HistorialScreen from './src/screens/HistorialScreen';
import RegistrosScreen from './src/screens/RegistrosScreen';
import CrearCajaScreen from './src/screens/CrearCajaScreen';

// Importar contexto
import { CajasProvider } from './src/context/CajasContext';

// Tema personalizado
const theme = {
  colors: {
    primary: '#4CAF50',
    accent: '#FF5722',
    background: '#F5F5F5',
    surface: '#FFFFFF',
    text: '#333333',
  },
};

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <CajasProvider>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <StatusBar style="auto" />
          <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Resumen') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'Historial') {
                iconName = focused ? 'time' : 'time-outline';
              } else if (route.name === 'Registros') {
                iconName = focused ? 'archive' : 'archive-outline';
              } else if (route.name === 'Crear') {
                iconName = focused ? 'add-circle' : 'add-circle-outline';
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#4CAF50',
            tabBarInactiveTintColor: 'gray',
            headerStyle: {
              backgroundColor: '#4CAF50',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          })}
        >
          <Tab.Screen 
            name="Resumen" 
            component={ResumenScreen} 
            options={{ title: 'Cuenta de Cajas' }}
          />
          <Tab.Screen 
            name="Historial" 
            component={HistorialScreen} 
            options={{ title: 'Historial de Conteos' }}
          />
          <Tab.Screen 
            name="Registros" 
            component={RegistrosScreen} 
            options={{ title: 'Registros Archivados' }}
          />
          <Tab.Screen 
            name="Crear" 
            component={CrearCajaScreen} 
            options={{ title: 'Crear Caja' }}
          />
          </Tab.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </CajasProvider>
  );
}