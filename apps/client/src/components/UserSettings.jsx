import { useRef, useState } from 'react';
import { validateFile } from '../shared/validateImage';

const UserSettings = ({ user, handleChange, setFormState }) => {
  const { profile: profileUrl, username, firstname, lastname, correo: email } = user;
  const [activeTab, setActiveTab] = useState('perfil');

  const [imagePreview, setImagePreview] = useState(null);

  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };
  const handleFileChange = e => {
    const file = e.target.files[0];
    if (file) {
      const valid = validateFile(file);
      if (!valid) return;
      setFormState(p => ({
        ...p,
        profile: file,
      }));
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-6">
      <div className="flex border-b mb-4">
        {['perfil', 'information', 'notificaciones', 'privacidad'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium capitalize ${
              activeTab === tab ? 'border-b-2 border-gray-900 text-gray-900' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {/* Perfil Tab */}
        {activeTab === 'perfil' && (
          <div className="space-y-4">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <div className="h-24 w-24 rounded-full bg-gray-200 overflow-hidden relative">
                  <img src={imagePreview || profileUrl} alt="Foto de perfil" className="object-cover h-full w-full" />
                </div>
                <button
                  onClick={handleButtonClick}
                  className="cursor-pointer absolute bottom-0 right-0 rounded-full h-8 w-8 bg-gray-100 flex items-center justify-center border border-gray-300 hover:bg-gray-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </button>
                <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
              </div>
            </div>
            <div className="grid gap-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="usuario" className="text-right text-sm font-medium text-gray-700">
                  username
                </label>
                <input
                  id="usuario"
                  defaultValue={username}
                  disabled
                  className="col-span-3 px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-500 opacity-70 cursor-not-allowed focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="firstname" className="text-right text-sm font-medium text-gray-700">
                  firstname
                </label>
                <input
                  id="firstname"
                  name="firstname"
                  defaultValue={firstname}
                  onChange={handleChange}
                  className="col-span-3 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="lastname" className="text-right text-sm font-medium text-gray-700">
                  lastname
                </label>
                <input
                  id="lastname"
                  name="lastname"
                  defaultValue={lastname}
                  onChange={handleChange}
                  className="col-span-3 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'information' && (
          <div className="grid gap-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="correo" className="text-right text-sm font-medium text-gray-700">
                correo
              </label>
              <input
                id="correo"
                name="correo"
                type="email"
                defaultValue={email}
                onChange={handleChange}
                className="col-span-3 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="password" className="text-right text-sm font-medium text-gray-700">
                password
              </label>
              <input
                id="password"
                name="password"
                defaultValue={'********'}
                type="password"
                className="col-span-3 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
              />
            </div>
          </div>
        )}

        {/* Notificaciones Tab */}
        {activeTab === 'notificaciones' && (
          <div className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label htmlFor="email-notif" className="text-sm font-medium text-gray-700">
                    Notificaciones por correo
                  </label>
                  <p className="text-sm text-gray-500">Recibe actualizaciones sobre tus colecciones</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" id="email-notif" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label htmlFor="new-coll" className="text-sm font-medium text-gray-700">
                    Nuevas colecciones
                  </label>
                  <p className="text-sm text-gray-500">Notificaciones sobre nuevas colecciones destacadas</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" id="new-coll" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label htmlFor="comments" className="text-sm font-medium text-gray-700">
                    Comentarios
                  </label>
                  <p className="text-sm text-gray-500">Notificaciones sobre comentarios en tus fotos</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" id="comments" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-600"></div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Privacidad Tab */}
        {activeTab === 'privacidad' && (
          <div className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label htmlFor="profile-public" className="text-sm font-medium text-gray-700">
                    Perfil público
                  </label>
                  <p className="text-sm text-gray-500">Permite que otros usuarios vean tu perfil</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" id="profile-public" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label htmlFor="show-collections" className="text-sm font-medium text-gray-700">
                    Mostrar colecciones
                  </label>
                  <p className="text-sm text-gray-500">Hacer tus colecciones visibles para otros usuarios</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" id="show-collections" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label htmlFor="data-usage" className="text-sm font-medium text-gray-700">
                    Uso de datos
                  </label>
                  <p className="text-sm text-gray-500">Permitir el uso de datos para mejorar la experiencia</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" id="data-usage" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-600"></div>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default UserSettings;
