// Placeholder services to mock backend interactions

export const AuthService = {
  signInAnonymously: async () => {
    // Mock delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { uid: 'mock-uid-' + Math.random().toString(36).substr(2, 9) };
  },

  verifyInviteCode: async (code: string) => {
    // Mock check
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return code === 'LOVE'; // Simple mock
  }
};

export const HeartbeatService = {
  sendHeartbeat: async (from: string, to: string) => {
    console.log(`Sending heartbeat from ${from} to ${to}`);
    // Mock network request
    await new Promise((resolve) => setTimeout(resolve, 300));
    return true;
  }
};

export const NotificationService = {
  registerForPushNotifications: async () => {
    console.log('Requesting push notification permissions...');
    return 'mock-push-token';
  }
};
