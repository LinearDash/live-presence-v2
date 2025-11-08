import './index.css'
import { useGetAllUsers } from './hook/user/useGetAllUsers';
import { useCreateUser } from './hook/user/useCreateUser';
import { useState } from 'react';
import type { User } from './types/user';

function App() {
  const { data: users, isLoading, error } = useGetAllUsers();
  const { mutate: createUser, isPending } = useCreateUser();
  const [formData, setFormData] = useState({ name: '', email: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createUser(formData);
    setFormData({ name: '', email: '' });
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        {/* Create User Form */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Create User</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isPending ? 'Creating...' : 'Create'}
            </button>
          </form>
        </div>

        {/* All Users List */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">All Users</h2>
          {isLoading && <p className="text-gray-500">Loading...</p>}
          {error && <p className="text-red-500">Error: {error.message}</p>}
          <ul className="space-y-2">
            {users?.map((user: User) => (
              <li key={user.id} className="p-4 bg-gray-50 rounded-lg">
                <p className="font-semibold">{user.name}</p>
                <p className="text-gray-600">{user.email}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
