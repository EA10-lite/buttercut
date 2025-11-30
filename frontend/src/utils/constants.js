import { Dimensions, Platform } from 'react-native';

export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const VIDEO_WIDTH = SCREEN_WIDTH - 32;
export const VIDEO_HEIGHT = (VIDEO_WIDTH * 9) / 16;

// API Configuration
// For physical devices, replace with your computer's IP address
// Find your IP: macOS/Linux: ifconfig | grep "inet " | grep -v 127.0.0.1
// Windows: ipconfig (look for IPv4 Address)
const getApiUrl = () => {
  // IMPORTANT: If using a physical device, change this to your computer's IP address
  // Find your IP: macOS/Linux: ifconfig | grep "inet " | grep -v 127.0.0.1
  // Windows: ipconfig (look for IPv4 Address)
  // Example: 'http://172.20.10.2:8000'
  const USE_PHYSICAL_DEVICE_IP = true; // Set to true if using a physical device, false for simulator
  const PHYSICAL_DEVICE_IP = '172.20.10.2'; // Your computer's IP address
  
  let url;
  
  if (Platform.OS === 'android') {
    // Android emulator uses special IP
    url = 'http://10.0.2.2:8000';
  } else if (USE_PHYSICAL_DEVICE_IP) {
    // For physical devices, use your computer's IP
    url = `http://${PHYSICAL_DEVICE_IP}:8000`;
  } else {
    // For iOS simulator or web, use localhost
    url = 'http://localhost:8000';
  }
  
  // Log the URL being used for debugging
  console.log(`[API Config] Platform: ${Platform.OS}, Using URL: ${url}`);
  
  return url;
};

export const API_CONFIG = {
  BASE_URL: getApiUrl(),
  POLLING_INTERVAL: 2000, // 2 seconds
};

// Log the final config
console.log('[API Config] Final BASE_URL:', API_CONFIG.BASE_URL);

// Overlay Defaults
export const OVERLAY_DEFAULTS = {
  text: {
    content: 'Sample Text',
    fontSize: 24,
    color: '#ffffff',
    width: 200,
    height: 50,
  },
  image: {
    width: 150,
    height: 100,
  },
  video: {
    width: 150,
    height: 100,
  },
};

// Processing Status
export const PROCESSING_STATUS = {
  IDLE: 'idle',
  UPLOADING: 'uploading',
  QUEUED: 'queued',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
};