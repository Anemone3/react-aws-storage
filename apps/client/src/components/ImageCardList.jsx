import { useEffect, useState } from "react";
const ImageCardList = ({ imageUrl, title, description, user, createdAt }) => {
  const formatDate = (dateString) => {
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
      return "ayer";
    } else if (diffDays < 7) {
      return `hace ${diffDays} días`;
    } else {
      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      return date.toLocaleDateString("es-ES", options);
    }
  };
  const isSaved = false;
  const [imageError, setImageError] = useState(false);
  const [formattedDate, setFormattedDate] = useState(() =>
    formatDate(createdAt),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setFormattedDate(formatDate(createdAt));
    }, 60000);

    return () => clearInterval(interval);
  }, [createdAt]);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleSave = () => {
    // Lógica para guardar la imagen
  };

  return (
    <div className="w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="relative">
        {/* Contenedor con relación de aspecto fija */}
        <div
          className="aspect-square w-full overflow-hidden"
          style={{
            background: "#f5f5f5",
            display: "block",
            position: "relative",
          }}
        >
          <img
            src={
              imageError ? "/placeholder.svg?height=500&width=500" : imageUrl
            }
            alt={title}
            onError={handleImageError}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
            }}
            className="transition-transform duration-300 hover:scale-105"
          />
        </div>
        <button
          className="absolute top-2 right-2 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm hover:bg-white/90"
          onClick={handleSave}
          aria-label={isSaved ? "Quitar de guardados" : "Guardar imagen"}
        >
          {isSaved ? (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#e11d48"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path>
              <polyline points="9 11 12 14 16 10"></polyline>
            </svg>
          ) : (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path>
            </svg>
          )}
        </button>
      </div>
      <div className="p-4">
        <h3 className="mb-1 text-lg font-semibold">{title}</h3>
        <p className="mb-4 text-sm text-gray-500">{description}</p>
      </div>
      <div className="flex items-center justify-between px-4 pb-4">
        <div className="flex items-center gap-2">
          <div
            className="relative h-8 w-8 overflow-hidden rounded-full"
            style={{ background: "#f5f5f5" }}
          >
            <img
              src={user.profileUrl || "/placeholder.svg?height=100&width=100"}
              alt={user.username}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              onError={(e) => {
                e.target.src = "/placeholder.svg?height=100&width=100";
              }}
            />
          </div>
          <div>
            <p className="text-sm font-medium">{user.username}</p>
            <p className="text-xs text-gray-500">{formattedDate}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ImageCardList;
