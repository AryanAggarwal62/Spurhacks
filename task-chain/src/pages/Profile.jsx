export default function Profile({ onLogout }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      <p>Profile page content goes here.</p>
      <button className="btn btn-outline mt-8" onClick={onLogout}>Logout</button>
    </div>
  );
}
