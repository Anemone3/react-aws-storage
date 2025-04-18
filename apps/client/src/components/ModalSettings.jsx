import { useSelector } from 'react-redux';
import { useState } from 'react';
import { useModal } from '../hooks/useModal';
import UserSettings from './UserSettings';
import { useUpdateUserMutation } from '../redux/services/user-api';

const ModalSettings = () => {
  const { hideModal } = useModal();

  const [updateUser, { isLoading, error, isSuccess }] = useUpdateUserMutation();
  const { id, profileUrl, username, firstname, lastname, email } = useSelector(state => state.auth?.user);
  const [formState, setFormState] = useState({
    profile: profileUrl,
    correo: email,
    firstname: firstname,
    lastname: lastname,
    username: username,
  });

  const onClose = () => {
    hideModal();
  };

  const onHandleChange = ({ target }) => {
    const { name, value } = target;

    setFormState(p => ({
      ...p,
      [name]: value,
    }));
  };

  const saveData = async () => {
    try {
      const form = new FormData();

      for (const key in formState) {
        const value = formState[key];
        if (key === 'profile') {
          form.append('file', value);
        } else {
          form.append(key, value);
        }
      }
      const user = await updateUser({ args: form, userId: id }).unwrap();

      if (user) {
        hideModal();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={() => handleOpenChange(false)} />

      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-[500px] max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">Configuración de Usuario</h2>
            <p className="text-gray-500 text-sm">Actualiza tu información personal y preferencias</p>
          </div>

          <UserSettings handleChange={onHandleChange} user={formState} setFormState={setFormState} />

          <div className="p-6 border-t flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="cursor-pointer px-4 py-2 border border-gray-300 rounded-md text-sm font-medium shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Cancelar
            </button>
            <button
              onClick={saveData}
              disabled={isLoading}
              type="submit"
              className="px-4 py-2 bg-gray-900 text-white rounded-md text-sm font-medium shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              {isLoading ? 'Guardando..' : ' Guardar cambios'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalSettings;
