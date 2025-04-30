import { useSelector } from 'react-redux';
import ImageCardList from '../components/ImageCardList';
import { useGetPinsQuery } from '../redux/services/pin-api';
import { useEffect } from 'react';

const GalleryPage = () => {
  const tokenExits = useSelector(state => state.auth.accessToken);
  const { data: Pins, refetch } = useGetPinsQuery();

  useEffect(() => {
    if (tokenExits) {
      refetch();
    }
  }, [refetch, tokenExits]);

  return (
    <div className="container mx-auto mt-6 mb-16 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {Pins ? Pins.data?.map(pin => <ImageCardList key={pin.id} {...pin} />) : <p>No images list</p>}
    </div>
  );
};
export default GalleryPage;
