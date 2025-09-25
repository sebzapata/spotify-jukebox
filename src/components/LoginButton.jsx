const LoginButton = ({ onLogin, loading }) => {
  return (
    <button onClick={onLogin} disabled={loading}>
      {loading ? "Logging in..." : "Log in with Spotify"}
    </button>
  );
};

export default LoginButton;
