import { useEffect, useRef, useState } from 'react';
import avatarDefault from '../assets/avatar-default.svg';
import { useSendLogoutMutation } from '../redux/services/auth-api';
import { useModal } from '../hooks/useModal';
import ModalSettings from './ModalSettings';

const ProfileAvatar = ({ profileUrl }) => {
  const [dropDown, setDropDown] = useState(false);

  const { showModal } = useModal();

  const divRef = useRef(null);
  const [logout, { isLoading, isSuccess }] = useSendLogoutMutation();
  const toggleDropdown = () => setDropDown(prev => !prev);

  const handleClickOutside = event => {
    if (divRef.current && !divRef.current.contains(event.target)) {
      setDropDown(false);
    }
  };

  const handleLogout = async () => {
    try {
      logout().unwrap();
    } catch (error) {}
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      if (isSuccess) {
        document.removeEventListener('click', handleClickOutside);
      }
    };
  }, []);

  return (
    <div className="relative">
      <img
        ref={divRef}
        className="h-8 w-8 cursor-pointer rounded-full"
        onClick={toggleDropdown}
        src={profileUrl || avatarDefault}
        alt="profile user"
      />
      {dropDown && (
        <div className="bg-darkness text-secondary absolute top-10 right-0 z-30 rounded-md shadow-lg">
          <button onClick={() => showModal(<ModalSettings />)} className="hover:bg-primary hover:text-darkness cursor-pointer px-4 py-2">
            settings
          </button>
          <button onClick={handleLogout} className="hover:bg-primary hover:text-darkness cursor-pointer px-4 py-2">
            logout
          </button>
        </div>
      )}
    </div>
  );
};
export default ProfileAvatar;
