import { useState } from "react";
import { useRegisterMutation } from "../redux/services/auth-api";
import { useDispatch } from "react-redux";
import { setAuthenticate } from "../redux/features/auth-slice";
import { useModal } from "../hooks/useModal";
import { Mail, Lock, User, ArrowRight, Eye, EyeOffIcon } from "lucide-react";
import InputField from "./InputField";

function RegisterModal() {
  const { hideModal } = useModal();

  const [formState, setFormState] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [register, { isLoading }] = useRegisterMutation();

  const dispatch = useDispatch();

  const [errorField, setErrorField] = useState({
    email: "",
    password: "",
    firstname: "",
    lastname: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const { firstname, lastname, email, password, confirmPassword } = formState;

  const onInputChange = ({ target }) => {
    const { name, value } = target;

    setFormState((p) => ({
      ...p,
      [name]: value,
    }));
  };

  const handlePassword = () => {
    setShowPassword((p) => !p);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    Object.keys(formState).forEach((key) => {
      console.log(key);
      if (formState[key] === "") {
        setErrorField((p) => ({
          ...p,
          [key]: `${key} is required`,
        }));
      }
    });

    if (password.length < 6) {
      setErrorField((p) => ({
       ...p,
        password: "La contraseña debe tener al menos 6 caracteres",
      }));
      return;
    }

    if (password !== confirmPassword) {
      setErrorField((p) => ({
        ...p,
        confirmPassword: "Las contraseñas no coinciden",
      }));
      return;
    }

    try {
      const response = await register({
        email,
        password,
        firstname,
        lastname,
      }).unwrap();

      if (!response) return;

      dispatch(
        setAuthenticate({
          accessToken: response.accessToken,
          user: response.data,
        }),
      );
      setFormState({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      hideModal();
    } catch (error) {
      console.log(error);
      setErrorField((p) => ({
        ...p,
        confirmPassword: "Error al registrar",
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-row gap-x-3">
        <InputField
          label="First name"
          name="firstname"
          type="text"
          icon={User}
          value={firstname}
          onChange={onInputChange}
        />
        <InputField
          label="Last name"
          name="lastname"
          type="text"
          icon={User}
          value={lastname}
          onChange={onInputChange}
        />
      </div>
      {errorField.firstname && (
        <p className="text-sm text-red-500">{errorField.firstname}</p>
      )}
      {errorField.lastname && (
        <p className="text-sm text-red-500">{errorField.lastname}</p>
      )}
      <InputField
        label="Correo electrónico"
        name="email"
        type="email"
        icon={Mail}
        value={email}
        onChange={onInputChange}
      />
      {errorField.email && (
        <p className="text-sm text-red-500">{errorField.email}</p>
      )}

      <InputField
        label="Contraseña"
        name="password"
        type="password"
        icon={Lock}
        value={password}
        onChange={onInputChange}
      />
      {errorField.password && (
        <p className="text-sm text-red-500">{errorField.password}</p>
      )}

      <div className="relative">
        <InputField
          label="Confirmar contraseña"
          name="confirmPassword"
          type={showPassword ? "text" : "password"}
          icon={Lock}
          value={confirmPassword}
          onChange={onInputChange}
        />

        <div className="absolute right-3 bottom-0 -translate-y-3 transform cursor-pointer">
          {showPassword ? (
            <Eye className="text-gray-400" size={18} onClick={handlePassword} />
          ) : (
            <EyeOffIcon
              className="text-gray-400"
              size={18}
              onClick={handlePassword}
            />
          )}
        </div>
      </div>
      {errorField.confirmPassword && (
        <p className="text-sm text-red-500">{errorField.confirmPassword}</p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-gradient-to-r from-blue-500 to-blue-600 py-2.5 font-medium text-white shadow-md transition-all hover:from-blue-600 hover:to-blue-700 hover:shadow-lg"
      >
        Crear cuenta
        <ArrowRight size={18} />
      </button>
    </form>
  );
}
export default RegisterModal;
