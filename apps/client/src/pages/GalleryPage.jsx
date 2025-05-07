import { useSelector } from 'react-redux';
import ImageCardList from '../components/ImageCardList';
import { useGetPinsQuery } from '../redux/services/pin-api';

const GalleryPage = () => {
  const accessToken = useSelector(state => state.auth.accessToken);
  const { data: Pins, isLoading } = useGetPinsQuery(accessToken, {
    refetchOnMountOrArgChange: true,
  });

  return (
    <div className="container mx-auto mt-6 mb-16 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {isLoading ? <p>Cargando imágenes...</p> : Pins ? Pins.data?.map(pin => <ImageCardList key={pin.id} {...pin} />) : <p>No images list</p>}
    </div>
  );
};
export default GalleryPage;
