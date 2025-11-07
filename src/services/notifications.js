// Notification stubs for future integration (email/SMS/push)
import { save, load } from './storage';

const KEY = 'doc:notify-settings';

export function getNotificationSettings() {
  return load(KEY, {
    email: true,
    sms: false,
    reminders: {
      appointmentLeadHours: 2,
      refillLeadDays: 3,
    },
  });
}

export function setNotificationSettings(s) {
  return save(KEY, s);
}

export async function sendReminderMock({ type, to, message }) {
  // Placeholder: simulate async delivery
  await new Promise((res) => setTimeout(res, 300));
  return { ok: true, type, to, message };
}
