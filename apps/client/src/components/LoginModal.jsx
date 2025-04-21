import { useState } from 'react';
import { Mail, Lock, ArrowRight, Eye, EyeOffIcon } from 'lucide-react';
import { useLoginMutation } from '../redux/services/auth-api';
import { useDispatch } from 'react-redux';
import { setAuthenticate } from '../redux/features/auth-slice';
import { useModal } from '../hooks/useModal';
import InputField from './InputField';

function LoginModal() {
  const { hideModal } = useModal();

  const [formState, setFormState] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formState;
  const [showPassword, setShowPassword] = useState(false);

  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();

  const [errorMessage, setErrorMessage] = useState('');

  const onInputChange = ({ target }) => {
    const { name, value } = target;

    setFormState(p => ({
      ...p,
      [name]: value,
    }));
  };
  const handlePassword = () => {
    setShowPassword(p => !p);
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!email || !password) {
      setErrorMessage('Todos los campos son obligatorios');
      return;
    }

    if (email.length < 4) {
      return;
    } else if (password.length < 6) {
      setErrorMessage('Password need to be 6 characters');
      return;
    }

    try {
      setErrorMessage('');

      const response = await login({
        email,
        password,
      }).unwrap();

      dispatch(
        setAuthenticate({
          accessToken: response.accessToken,
          user: response.data,
        }),
      );
      setFormState({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        confirmPassword: '',
      });

      hideModal();
    } catch (err) {
      setErrorMessage(err.data?.message);
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <InputField name="email" label="Correo electrónico" type="email" icon={Mail} value={email} onChange={onInputChange} />

      <div className="relative">
        <InputField
          label="Contraseña"
          name="password"
          type={showPassword ? 'text' : 'password'}
          icon={Lock}
          value={password}
          onChange={onInputChange}
        />

        <div className="absolute right-3 bottom-0 -translate-y-3 transform cursor-pointer">
          {showPassword ? (
            <Eye className="text-gray-400" size={18} onClick={handlePassword} />
          ) : (
            <EyeOffIcon className="text-gray-400" size={18} onClick={handlePassword} />
          )}
        </div>
      </div>

      <div className={`min-h-[20px] transition-all duration-300`}>{errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}</div>

      <div className="flex justify-end">
        <span className="cursor-pointer text-sm text-gray-500 transition-colors hover:text-gray-700">¿Olvidaste tu contraseña?</span>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-gradient-to-r from-blue-500 to-blue-600 py-2.5 font-medium text-white shadow-md transition-all hover:from-blue-600 hover:to-blue-700 hover:shadow-lg"
      >
        Iniciar sesión
        <ArrowRight size={18} />
      </button>
      <button
        type="button"
        onClick={() => {
          window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`;
        }}
        className="cursor-pointer flex items-center justify-center gap-3 w-full max-w-sm px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg shadow hover:bg-gray-100 transition"
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1200px-Google_%22G%22_logo.svg.png"
          alt="Google Logo"
          className="w-5 h-5"
        />
        <span>Iniciar sesión con Google</span>
      </button>
    </form>
  );
}
export default LoginModal;
