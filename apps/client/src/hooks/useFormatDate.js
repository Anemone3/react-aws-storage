import { useEffect, useState } from 'react';
const formatDate = dateString => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    if (diffHours === 0) {
      const diffMinutes = Math.floor(diffTime / (1000 * 60));
      return `hace ${diffMinutes} minutos`;
    }
    return `hace ${diffHours} horas`;
  } else if (diffDays === 1) {
    return 'ayer';
  } else if (diffDays < 7) {
    return `hace ${diffDays} días`;
  } else {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return date.toLocaleDateString('es-ES', options);
  }
};
export const useFormtDate = createdAt => {
  const [formattedDate, setFormattedDate] = useState(() => formatDate(createdAt));

  useEffect(() => {
    const interval = setInterval(() => {
      setFormattedDate(formatDate(createdAt));
    }, 60000);

    return () => clearInterval(interval);
  }, [createdAt]);

  return {
    formattedDate,
  };
};
