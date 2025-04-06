import { NavLink } from "react-router-dom";
import { useModal } from "../hooks/useModal";
import { useSelector } from "react-redux";
import { useMemo } from "react";
import AuthModal from "./AuthModal";
import ProfileAvatar from "./ProfileAvatar";

const ItemsNav = [
  { path: "/", name: "Home" },
  { path: "gallery", name: "Gallery" },
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
          {ItemsNav.map(({ path, name }) => {
            if (!isLogged && path === "collections") return null;

            const linkTo =
              path === "collections" && isLogged
                ? `/collections/${user.id}`
                : path;

            return (
              <NavLink
                key={path}
                to={linkTo}
                className={({ isActive }) =>
                  `${isActive ? "bg-primary text-darkness" : "text-secondary"} rounded-sm px-5 py-1.5 text-center text-sm`
                }
              >
                {name}
              </NavLink>
            );
          })}
          {isLogged && <ProfileAvatar profileUrl={user.profileUrl} />}
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
