const LogoutButton = ({ onLogout }) => {
  return (
    <button
      onClick={onLogout}
      // className="rounded-lg border border-transparent px-5 py-2.5 text-base font-medium bg-gray-500 cursor-pointer transition-colors duration-250 hover:border-gray-600 disabled:cursor-not-allowed"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
