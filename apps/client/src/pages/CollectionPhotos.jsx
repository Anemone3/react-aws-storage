import { useEffect, useRef, useState } from 'react';
import ImageCardList from '../components/ImageCardList';
import { useGetPinsQuery, useLazyGetPinsQuery } from '../redux/services/pin-api';

function CollectionPhotos({ query }) {
  const photosRef = useRef(null);
  const [getPins, { data: Pins, isLoading, isUninitialized, isSuccess }] = useLazyGetPinsQuery();
  const [currentPage, setCurrentPage] = useState(1);
  const elementRef = useRef(null);
  const [hasMore, setHasMore] = useState(true);
  const [allPins, setAllPins] = useState([]);

  useEffect(() => {
    if (isUninitialized || query) {
      getPins({ page: currentPage, currentPage, query: query ?? '' });
    }
  }, [isUninitialized, query]);

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
    photosRef.current?.scrollIntoView({ behavior: 'smooth' });
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
    <div ref={photosRef}>
      {isLoading && <h1>Loading...</h1>}
      <div className="container mx-auto mt-6 mb-16 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {isSuccess && allPins?.map(pin => <ImageCardList key={pin.id} {...pin} />)}
        {hasMore && currentPage > 1 && <div ref={elementRef}>Cargando más artículos...</div>}
      </div>
    </div>
  );
}
export default CollectionPhotos;
