import { useState } from 'react';
import { useModal } from '../hooks/useModal';
import { useCreatePinMutation } from '../redux/services/pin-api';
import AddPinCard from './AddPinCard';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

function ModalPin({ collections, userId, collectionId: collectionIndex }) {
  const navigate = useNavigate();

  const [formState, setFormState] = useState({
    title: '',
    description: '',
    collectionId: collectionIndex || '',
    pin: null,
  });
  const [formErrors, setFormErrors] = useState({
    title: '',
    description: '',
    collectionId: '',
    pin: '',
  });
  const [createPin, { data, isLoading }] = useCreatePinMutation();
  const { title, description } = formState;
  const { hideModal } = useModal();

  const onInputChange = ({ target }) => {
    const { name, value } = target;

    setFormState(p => ({
      ...p,
      [name]: value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const { pin, collectionId, ...textType } = formState;

    const isValid = Object.values(textType).every(value => {
      if (value === null) return false;
      if (typeof value === 'string') return value.trim().length > 0;
      return true;
    });

    if (!isValid) return;
    if (!pin) return;

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    if (collectionId) {
      formData.append('collectionId', collectionId);
    }
    formData.append('file', pin);

    try {
      const result = await createPin({ userId, formData }).unwrap();

      if (result && result.message === 'Success') {
        toast.success('Pin created successfully');
        if (!collectionId) {
          navigate(`/gallery`);
          hideModal();
        } else {
          hideModal();
        }
      }
    } catch (error) {
      setFormErrors(p => ({
        ...p,
        pin: 'Error al subir la imagen',
      }));
      toast.error('Error to upload image');
    }
  };

  const onClose = () => {
    hideModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
      <div className="animate-in fade-in w-full max-w-2xl overflow-hidden rounded-lg bg-white shadow-xl duration-300">
        <div className="relative flex items-center justify-between border-b p-4">
          <h2 className="text-xl font-semibold">Agregar imagen a la galería</h2>
          <button
            type="button"
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-gray-100"
            aria-label="Cerrar"
            onClick={onClose}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M18 6 6 18"></path>
              <path d="m6 6 12 12"></path>
            </svg>
          </button>
        </div>
        <AddPinCard
          handleSubmit={handleSubmit}
          onChange={onInputChange}
          collections={collections}
          formState={formState}
          setFormState={setFormState}
          onClose={onClose}
          formErrors={formErrors}
          setFormErrors={setFormErrors}
        />
      </div>
    </div>
  );
}
export default ModalPin;
