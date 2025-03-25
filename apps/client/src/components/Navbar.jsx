import { NavLink } from "react-router";

const ItemsNav = [
  { path: "/", name: "Home" },
  { path: "collections", name: "Collections" },
  { path: "/profile", name: "Profile" },
];

function Navbar() {
  return (
    <nav>
      <div className="container mx-auto flex items-center justify-between py-4 min-[1630px]:mx-10">
        <img src="/Logo.svg" alt="" />
        <ul className="flex space-x-8">
          {ItemsNav.map((item, index) => (
            <NavLink
              className={({ isActive }) =>
                (isActive ? "bg-primary text-darkness" : "text-secondary") +
                " rounded-sm px-5 py-1.5 text-center text-sm"
              }
              to={item.path}
              key={index}
            >
              {item.name}
            </NavLink>
          ))}
        </ul>
      </div>
    </nav>
  );
}
export default Navbar;
