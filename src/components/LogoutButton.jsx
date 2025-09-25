const LogoutButton = ({ onLogout }) => {
  return (
    <button id="logout-button" onClick={onLogout}>
      Logout
    </button>
  );
};

export default LogoutButton;
