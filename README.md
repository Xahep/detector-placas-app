# 🚗 ParkingApp

Una aplicación móvil moderna para la gestión de parqueaderos en Colombia, con integración de Inteligencia Artificial para el reconocimiento automático de placas vehiculares.

## 📋 Descripción

ParkingApp es una solución completa para administrar el ingreso, salida y cobro de vehículos en parqueaderos. Incluye detección automática de placas mediante IA, cálculo automático de tarifas y persistencia local de datos.

## 📱 Descargar APK (Android)

Puedes descargar la última versión de la aplicación directamente desde Expo:

[**Descargar ParkingApp APK**](https://expo.dev/accounts/xahepg/projects/parking-app/builds/e7addf4c-b17d-45c1-bec3-60a89866c083)

> **Nota:** Esta versión es un "Preview Build" generado con EAS.

## ⚠️ Configuración de Red (HTTP)

La aplicación está configurada para permitir tráfico **HTTP (texto plano)**. Esto es necesario porque el backend de pruebas se encuentra en una instancia EC2 con IP pública sin certificado SSL (`http://IP:PUERTO`).

Esta configuración se maneja a través del plugin `expo-build-properties` en `app.json`, habilitando `usesCleartextTraffic` para Android y `NSAllowsArbitraryLoads` para iOS.

## ✨ Características

- 🤖 **Detección de Placas con IA**: Escaneo automático de placas usando cámara o galería
- 💰 **Cálculo Automático de Tarifas**: Precios diferenciados para carros y motos
- 📊 **Gestión en Tiempo Real**: Visualización de vehículos activos con tiempo transcurrido
- 📜 **Historial Completo**: Registro de todos los servicios finalizados
- 💾 **Persistencia Local**: Datos guardados con AsyncStorage
- ✅ **Validación Inteligente**: Validación de formatos de placas colombianas con modo flexible
- 🎨 **UI/UX Moderna**: Interfaz limpia y profesional

## 🛠️ Stack Tecnológico

- **Framework**: React Native con Expo SDK 52
- **Lenguaje**: TypeScript
- **Navegación**: React Navigation (Bottom Tabs)
- **Estilos**: StyleSheet nativo
- **Persistencia**: AsyncStorage
- **Cámara/Galería**: expo-image-picker
- **Iconos**: @expo/vector-icons (MaterialCommunityIcons)

## 📱 Funcionalidades por Pantalla

### 🏠 Activos
- Lista de vehículos estacionados actualmente
- Buscador por placa en tiempo real
- Visualización de tiempo transcurrido
- Modal de cobro y finalización de servicio

### ➕ Ingreso
- Captura de foto con cámara o selección desde galería
- Detección automática de placas con IA
- Selección de tipo de vehículo (Carro/Moto)
- Validación flexible de formatos de placas
- Registro manual como alternativa

### 📚 Historial
- Registro completo de servicios finalizados
- Visualización de costos y fechas
- Ordenamiento cronológico

### ⚙️ Configuración
- Configuración de IP del servidor de IA
- Persistencia de configuración

## 💵 Tarifas

- **Carros**: $3.600 COP/hora
- **Motos**: $1.500 COP/hora
- Cálculo proporcional por minuto para mayor precisión

## 🔐 Validación de Placas

### Formatos Válidos (Colombia)
- **Carros**: 3 letras + 3 números (Ej: ABC123)
- **Motos**: 3 letras + 2 números + 1 letra (Ej: AAA12A)

### Validación Flexible
La app permite guardar placas con formato no estándar mostrando una advertencia, útil para casos especiales o errores de detección de la IA.

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js (v16 o superior)
- npm o yarn
- Expo CLI
- Cuenta de Expo (para builds)

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/Xahep/detector-placas-app.git
cd detector-placas-app

# Instalar dependencias
npm install

# Iniciar en modo desarrollo
npx expo start
```

### Configuración del Servidor de IA

1. Ve a la pestaña **Configuración**
2. Ingresa la IP de tu servidor de detección de placas
3. El servidor debe exponer el endpoint: `POST http://{IP}:8080/predict`

#### Formato de Request
```
Content-Type: multipart/form-data
Body: { file: <imagen> }
```

#### Formato de Response
```json
{
  "success": true,
  "placas": ["ABC123", "XYZ789"],
  "num_placas": 2,
  "image": "base64_string...",
  "message": "OK"
}
```

## 📦 Generar APK/IPA

### Android (APK)

```bash
# Instalar EAS CLI
npm install -g eas-cli

# Iniciar sesión
eas login

# Generar APK de prueba
eas build -p android --profile preview
```

### iOS

```bash
# Generar IPA (requiere cuenta de desarrollador Apple)
eas build -p ios
```

## 📂 Estructura del Proyecto

```
detector-placas-app/
├── src/
│   ├── components/       # Componentes reutilizables
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Layout.tsx
│   │   └── VehicleCard.tsx
│   ├── screens/          # Pantallas principales
│   │   ├── ActiveScreen.tsx
│   │   ├── EntryScreen.tsx
│   │   ├── HistoryScreen.tsx
│   │   └── ConfigScreen.tsx
│   ├── services/         # Servicios externos
│   │   └── api.ts
│   ├── types/            # Definiciones TypeScript
│   │   └── index.ts
│   └── utils/            # Utilidades
│       ├── logic.ts      # Lógica de negocio
│       └── storage.ts    # Persistencia
├── assets/               # Recursos estáticos
├── App.tsx              # Punto de entrada
├── app.json             # Configuración Expo
├── eas.json             # Configuración EAS Build
└── package.json         # Dependencias
```

## 🎨 Paleta de Colores

- **Primario**: Indigo (#4f46e5)
- **Fondo**: Slate 50 (#f8fafc)
- **Texto**: Slate 800 (#1e293b)
- **Bordes**: Slate 200 (#e2e8f0)
- **Advertencia**: Amber 500 (#f59e0b)
- **Error**: Red 500 (#ef4444)

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 👨‍💻 Autor

**Xahep**
- GitHub: [@Xahep](https://github.com/Xahep)

## 🙏 Agradecimientos

- Expo Team por el excelente framework
- Comunidad de React Native
- Modelo de IA para detección de placas

---

⭐ Si este proyecto te fue útil, considera darle una estrella en GitHub
