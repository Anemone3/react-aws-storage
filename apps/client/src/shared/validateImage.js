export const validateFile = file => {
  const MAX_SIZE_MB = 1;
  const validTypes = ['image/png', 'image/jpeg', 'image/webp'];

  if (!validTypes.includes(file.type)) {
    return false;
  }

  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    return false;
  }
  return true;
};
