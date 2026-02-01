import { useAuth } from '../hooks/useAuth';

export default function ProfileView() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12 text-slate-500">
        Loading profile...
      </div>
    );
  }

  const displayName = user.displayName || 'Unnamed User';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="glass-card p-10 rounded-[2.5rem] text-center space-y-6">
        {/* Profile Image */}
        <div className="relative w-32 h-32 mx-auto">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt="User Avatar"
              className="w-full h-full rounded-full border-4 border-primary object-cover"
            />
          ) : (
            <div className="w-full h-full rounded-full border-4 border-border bg-dark flex items-center justify-center text-4xl font-bold text-slate-500 uppercase">
              {initial}
            </div>
          )}
        </div>

        {/* User Info */}
        <div>
          <h2 className="text-3xl font-bold text-white">{displayName}</h2>
          <p className="text-slate-400 font-medium">{user.email}</p>
        </div>

        {/* Status Grid */}
        <div className="pt-8 border-t border-border grid grid-cols-2 gap-4 text-left">
          <div className="p-4 bg-dark/50 rounded-2xl">
            <p className="text-xs text-slate-500 font-bold uppercase mb-1">Status</p>
            <p className="text-green-500 font-bold">Active User</p>
          </div>
          <div className="p-4 bg-dark/50 rounded-2xl">
            <p className="text-xs text-slate-500 font-bold uppercase mb-1">Security</p>
            <p className="text-slate-300 font-bold">Verified</p>
          </div>
        </div>
      </div>
    </div>
  );
}
