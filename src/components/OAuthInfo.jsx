const OAuthInfo = ({ accessToken, refreshToken, expiresAt }) => {
  if (!accessToken) return null;

  return (
    <div id="oauth">
      <h2>oAuth info</h2>
      <table>
        <tbody>
          <tr>
            <td>Access token</td>
            <td>{accessToken}</td>
          </tr>
          <tr>
            <td>Refresh token</td>
            <td>{refreshToken}</td>
          </tr>
          <tr>
            <td>Expires at</td>
            <td>{new Date(parseInt(expiresAt, 10)).toLocaleString()}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default OAuthInfo;
