const RefreshButton = ({ onRefresh, loading }) => {
  return (
    <button id="refresh-button" onClick={onRefresh} disabled={loading}>
      {loading ? "Refreshing..." : "Refresh access token"}
    </button>
  );
};

export default RefreshButton;
