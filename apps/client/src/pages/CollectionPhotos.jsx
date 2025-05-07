import { useEffect, useRef } from 'react';
import ImageCardList from '../components/ImageCardList';
import { useGetPinsQuery } from '../redux/services/pin-api';

function CollectionPhotos() {
  const photosRef = useRef(null);
  const { isFetching, data: Pins, isLoading, isSuccess } = useGetPinsQuery();
  useEffect(() => {
    photosRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [Pins]);

  return (
    <div ref={photosRef}>
      {isLoading && <h1>Loading...</h1>}
      <div className="container mx-auto mt-6 mb-16 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {isSuccess && Pins.data?.map(pin => <ImageCardList key={pin.id} {...pin} />)}
      </div>
    </div>
  );
}
export default CollectionPhotos;
