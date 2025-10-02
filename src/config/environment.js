import Constants from 'expo-constants';

const ENV = {
  development: {
    apiUrl: 'http://localhost:8000/api/v1',
  },
  staging: {
    apiUrl: 'https://backend.staging.commute.ai.ender.fi/api/v1',
  },
  production: {
    apiUrl: 'https://api.commute.ai/api/v1',
  },
};

/**
 * Get environment configuration based on the EAS Update channel.
 * 
 * @returns {Object} Environment configuration containing apiUrl
 */
const getEnvVars = () => {
  // Get the update channel from EAS Update
  const channel = Constants.expoConfig?.updates?.channel;
  
  if (channel === 'development') {
    return ENV.development;
  } else if (channel === 'preview' || channel === 'staging') {
    return ENV.staging;
  } else if (channel === 'production') {
    return ENV.production;
  }
  
  // Default to development when no channel is set (local development)
  return ENV.development;
};

export default getEnvVars();
