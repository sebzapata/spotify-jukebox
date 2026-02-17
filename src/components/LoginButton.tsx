type LoginButtonProps = {
  onLogin: () => Promise<void>;
  loading: boolean;
};

const LoginButton = ({ onLogin, loading }: LoginButtonProps) => {
  return (
    <button onClick={onLogin} disabled={loading} className="w-3/4">
      {loading ? "Logging in..." : "Log in with Spotify"}
    </button>
  );
};

export default LoginButton;
