
export const storage = {
  get: <T,>(key: string, defaultValue: T): T => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  },
  set: <T,>(key: string, data: T): void => {
    localStorage.setItem(key, JSON.stringify(data));
  },
  remove: (key: string): void => {
    localStorage.removeItem(key);
  }
};

export const STORAGE_KEYS = {
  ATTENDANCE: 'ai_smart_attendance_data',
  LEAVES: 'ai_smart_attendance_leaves',
  PERMISSIONS: 'ai_smart_attendance_permissions',
  USERS: 'ai_smart_attendance_users',
  CURRENT_USER: 'ai_smart_attendance_current_session'
};
