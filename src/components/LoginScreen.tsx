import LoginButton from "./LoginButton";

type LoginScreenProps = {
  loading: boolean;
  login: () => Promise<void>;
};

const LoginScreen = ({ loading, login }: LoginScreenProps) => {
  return (
    <div className="flex flex-col gap-4 items-center">
      <h1>Seb's Spotify Jukebox</h1>
      <LoginButton onLogin={login} loading={loading} />
    </div>
  );
};

export default LoginScreen;
