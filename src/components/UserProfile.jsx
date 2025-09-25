const UserProfile = ({ user }) => {
  if (!user) return null;

  return (
    <div id="main">
      <h1>Logged in as {user.display_name}</h1>
      <table>
        <tbody>
          <tr>
            <td>Display name</td>
            <td>{user.display_name}</td>
          </tr>
          <tr>
            <td>Id</td>
            <td>{user.id}</td>
          </tr>
          <tr>
            <td>Email</td>
            <td>{user.email}</td>
          </tr>
          <tr>
            <td>Spotify URI</td>
            <td>
              <a
                href={user.external_urls.spotify}
                target="_blank"
                rel="noopener noreferrer"
              >
                {user.external_urls.spotify}
              </a>
            </td>
          </tr>
          <tr>
            <td>Link</td>
            <td>
              <a href={user.href} target="_blank" rel="noopener noreferrer">
                {user.href}
              </a>
            </td>
          </tr>
          <tr>
            <td>Profile Image</td>
            <td>
              {user.images && user.images[0] && (
                <a
                  href={user.images[0].url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {user.images[0].url}
                </a>
              )}
            </td>
          </tr>
          <tr>
            <td>Country</td>
            <td>{user.country}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default UserProfile;
