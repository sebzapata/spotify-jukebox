const ErrorDisplay = ({ error }) => {
  if (!error) return null;

  return (
    <div>
      <h2>Error info</h2>
      <table>
        <tbody>
          <tr>
            <td>Status</td>
            <td>{error.status}</td>
          </tr>
          <tr>
            <td>Message</td>
            <td>{error.message}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ErrorDisplay;
