import { NavLink } from "react-router-dom";
import { useModal } from "../hooks/useModal";
import { useSelector } from "react-redux";
import { useMemo } from "react";
import AuthModal from "./AuthModal";
import avatarDefault from "../assets/avatar-default.svg";

const ItemsNav = [
  { path: "/", name: "Home" },
  { path: "collections", name: "Collections" },
];

function Navbar() {
  const { authenticate, user } = useSelector((state) => state.auth);
  const { showModal } = useModal();

  const isLogged = useMemo(
    () => authenticate === "authenticate",
    [authenticate],
  );

  const handleShowAuthModal = () => showModal(<AuthModal />);

  return (
    <nav>
      <div className="container mx-auto flex items-center justify-between py-4 min-[1630px]:mx-10">
        <img src="/Logo.svg" alt="Logo" />
        <ul className="flex space-x-8">
          {ItemsNav.map(({ path, name }) =>
            isLogged || path === "/" ? (
              // Enlace dinámico para "Collections" con el userId
              <NavLink
                key={path}
                to={path === "collections" ? `/collections/${user.id}` : path} // Si el usuario está logueado, agregamos el userId
                className={({ isActive }) =>
                  `${isActive ? "bg-primary text-darkness" : "text-secondary"} rounded-sm px-5 py-1.5 text-center text-sm`
                }
              >
                {name}
              </NavLink>
            ) : null,
          )}
          {isLogged && (
            <div>
              <img
                className="h-8 w-8 rounded-full"
                src={user.profileUrl ? user.profileUrl : avatarDefault}
                alt="profile user"
              />
            </div>
          )}
          {!isLogged && (
            <button
              className="hover:bg-primary hover:text-darkness rounded-sm px-5 py-1.5 text-center text-sm"
              onClick={handleShowAuthModal}
            >
              Sign in
            </button>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
