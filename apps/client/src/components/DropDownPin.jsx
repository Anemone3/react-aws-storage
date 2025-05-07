import { Edit, Share2, Trash2 } from 'lucide-react';
import { useRemovePinToCollectionMutation } from '../redux/services/collection-api';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';

const DropDownPin = ({ pin, closeAllMenus, collectionId }) => {
  const [removePin, {}] = useRemovePinToCollectionMutation();
  const user = useSelector(state => state.auth?.user);
  const handleRemovePin = async () => {
    console.log('Editar pin:', pin.id);

    try {
      await removePin({ collectionId, pinId: pin.id, userId: user.id }).unwrap();

      toast.success(`pin ${pin.title} was remove from collection`);
    } catch (error) {
      toast.error('Error to delete pin');
    } finally {
      closeAllMenus();
    }
  };

  return (
    <div
      className="absolute right-0 bottom-full mb-1 w-40 bg-white rounded-lg shadow-lg py-1 z-10 border border-gray-200"
      onClick={e => e.stopPropagation()}
    >
      <button
        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
        onClick={() => {
          toast.message('still in proccess');
          closeAllMenus();
        }}
      >
        <Edit className="h-4 w-4 mr-2 text-gray-500" />
        Editar
      </button>
      <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center" onClick={handleRemovePin}>
        <Trash2 className="h-4 w-4 mr-2 text-red-500" />
        Eliminar
      </button>
      <button
        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
        onClick={() => {
          console.log('Compartir pin:', pin.id);
          closeAllMenus();
        }}
      >
        <Share2 className="h-4 w-4 mr-2 text-gray-500" />
        Compartir
      </button>
    </div>
  );
};
export default DropDownPin;
