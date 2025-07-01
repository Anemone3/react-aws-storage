import { useSelector } from 'react-redux';
import ImageCardList from '../components/ImageCardList';
import { useLazyGetPinsQuery } from '../redux/services/pin-api';
import { useEffect, useRef, useState } from 'react';
const GalleryPage = () => {
  const accessToken = useSelector(state => state.auth.accessToken);
  const [getPins, { data: Pins, isLoading, isUninitialized }] = useLazyGetPinsQuery();
  const [hasMore, setHasMore] = useState(true);
  const [allPins, setAllPins] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const elementRef = useRef(null);

  useEffect(() => {
    if (isUninitialized) {
      getPins({ page: currentPage });
    }
  }, [isUninitialized]);

  useEffect(() => {
    if (Pins) {
      if (Pins.data.length === 0) {
        setHasMore(false);
      } else {
        setAllPins(prev => {
          if (currentPage == 1) {
            return [...prev, ...Pins.data];
          }

          return [...prev, ...Pins.data.slice(1)];
        });
        setCurrentPage(prev => prev + 1);
      }
    }
  }, [Pins]);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      const firstEntry = entries[0];
      if (firstEntry.isIntersecting && hasMore && !isLoading) {
        getPins({ page: currentPage });
      }
    });
    if (elementRef.current) observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, [currentPage, hasMore, isLoading, getPins]);

  return (
    <div className="container mx-auto mt-6 mb-16 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {isLoading && allPins.length === 0 ? (
        <p>Cargando imágenes...</p>
      ) : allPins.length > 0 ? (
        allPins.map(pin => <ImageCardList key={pin.id} {...pin} />)
      ) : (
        <p>No images list</p>
      )}
      {hasMore && currentPage > 1 && <div ref={elementRef}>Cargando más artículos...</div>}
    </div>
  );
};
export default GalleryPage;
