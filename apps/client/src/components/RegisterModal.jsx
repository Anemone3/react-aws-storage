import { useState } from "react";
import passwordHidden from "../assets/password-hidden.svg";
import passwordShow from "../assets/password-show.svg";
import { useRegisterMutation } from "../redux/services/auth-api";
import { useDispatch } from "react-redux";
import { setAuthenticate } from "../redux/features/auth-slice";
import { useModal } from "../hooks/useModal";

function RegisterModal() {
  const { hideModal } = useModal();

  const [formState, setFormState] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [register, { isLoading, isError, error }] = useRegisterMutation();

  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);

  const { firstname, lastname, email, password, confirmPassword } = formState;

  const onInputChange = ({ target }) => {
    const { name, value } = target;

    setFormState((p) => ({
      ...p,
      [name]: value,
    }));
  };

  const handleClick = () => {
    setShowPassword((p) => !p);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || !firstname || !lastname) {
      console.log("Todos los campos son obligatorios");
      return;
    }

    if (password !== confirmPassword) {
      console.log("Las contraseñas no coinciden");
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
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-y-4">
      <h3>Login</h3>
      <label>Account</label>
      <div className="flex w-full gap-x-4">
        <input
          className="flex-1 border border-gray-400 p-3"
          type="text"
          name="firstname"
          placeholder="Firstname"
          onChange={onInputChange}
          value={firstname}
        />
        <input
          className="flex-1 border border-gray-400 p-3"
          type="text"
          placeholder="Lastname"
          name="lastname"
          onChange={onInputChange}
          value={lastname}
        />
      </div>
      <input
        className="border border-gray-400 p-3"
        type="email"
        placeholder="Email"
        name="email"
        onChange={onInputChange}
        value={email}
      />

      <div className="flex w-full gap-x-4">
        <input
          className="border border-gray-400 p-3"
          type="password"
          placeholder="Password 6 characters"
          name="password"
          onChange={onInputChange}
          value={password}
        />
        <div className="relative flex w-full items-center">
          <input
            className="border border-gray-400 p-3"
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            onChange={onInputChange}
            value={confirmPassword}
          />
          <span className="absolute right-3 cursor-pointer bg-transparent text-center">
            <img
              onClick={handleClick}
              src={showPassword ? passwordShow : passwordHidden}
              className="h-4 w-4"
              alt={`icon password is ${showPassword ? "show" : "hidden"}`}
            />
          </span>
        </div>
      </div>
      <a>Register</a>
      <button
        disabled={isLoading}
        type="submit"
        className="mt-auto cursor-pointer justify-items-end bg-cyan-400 p-2"
      >
        {isLoading ? "Cargando..." : "Iniciar sesión"}
      </button>
    </form>
  );
}
export default RegisterModal;
