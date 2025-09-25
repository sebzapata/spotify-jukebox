import LoginButton from "./LoginButton";

const LoginScreen = ({ loading, login }) => {
  return (
    <div className="flex flex-col gap-4">
      <h1>Seb's Spotify Jukebox</h1>
      <LoginButton onLogin={login} loading={loading} />
    </div>
  );
};

export default LoginScreen;
