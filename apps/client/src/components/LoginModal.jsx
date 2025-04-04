import { useState } from "react";
import passwordHidden from "../assets/password-hidden.svg";
import passwordShow from "../assets/password-show.svg";
import { useLoginMutation } from "../redux/services/auth-api";
import { useDispatch } from "react-redux";
import { setAuthenticate } from "../redux/features/auth-slice";
import { useModal } from "../hooks/useModal";

function LoginModal() {
  const { hideModal } = useModal();

  const [formState, setFormState] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formState;
  const [showPassword, setShowPassword] = useState(false);

  const [login, { isLoading, isError, error }] = useLoginMutation();
  const dispatch = useDispatch();

  const [errorMessage, setErrorMessage] = useState("");

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

    if (!email || !password) {
      setErrorMessage("Todos los campos son obligatorios");
      return;
    }

    if (email.length < 4) {
      return;
    } else if (password.length < 6) {
      setErrorMessage("Password need to be 6 characters");
      return;
    }

    try {
      setErrorMessage("");

      const response = await login({
        email,
        password,
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

      setErrorMessage(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-y-4">
      <input
        className="border border-gray-400 p-3"
        type="email"
        name="email"
        placeholder="email"
        required
        onChange={onInputChange}
        value={email}
      />
      <div className="relative flex w-full items-center">
        <input
          className="w-full border border-gray-400 p-3"
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="password"
          onChange={onInputChange}
          required
          value={password}
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
      {errorMessage && <p>{errorMessage}</p>}
      <button
        type="submit"
        className="mt-auto cursor-pointer justify-items-end bg-cyan-400 p-2"
      >
        Iniciar sesión
      </button>
    </form>
  );
}
export default LoginModal;
