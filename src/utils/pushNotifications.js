export const requestPushPermission = async () => {
  if (typeof Notification === 'undefined') {
    return false;
  }
  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (e) {
    return false;
  }
};

export const showLocalPush = (title, options = {}) => {
  if (typeof Notification === 'undefined' || Notification.permission !== 'granted') {
    return;
  }
  new Notification(title, options);
};

