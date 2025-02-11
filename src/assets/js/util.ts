const isTouchDevice = (): boolean => {
  try {
    document.createEvent("TouchEvent");
    return true;
  } catch {
    return false;
  }
};

const isMobileDevice = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export { isTouchDevice, isMobileDevice }