import React, { useState } from 'react';
import { userStore } from './UserStore';
import { User } from './types';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Input } from '../../components/Input';

export const AddUserForm = () => {
  // Local form state
  const [formData, setFormData] = useState({ name: '', email: '' });

  // Action access
  const addUser = userStore.use(actions => actions.addUser);

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim()) {
      alert('Please fill in all fields');
      return;
    }

    if (!formData.email.includes('@')) {
      alert('Please enter a valid email');
      return;
    }

    const newUser: User = {
      id: Date.now(),
      name: formData.name.trim(),
      email: formData.email.trim(),
      active: true,
    };

    addUser(newUser);
    setFormData({ name: '', email: '' });
  };

  const handleAddSampleUsers = () => {
    const sampleUsers: User[] = [
      {
        id: Date.now() + Math.floor(Math.random() * 1000),
        name: 'John Doe',
        email: 'john@example.com',
        active: true,
      },
      {
        id: Date.now() + Math.floor(Math.random() * 1000),
        name: 'Jane Smith',
        email: 'jane@example.com',
        active: true,
      },
      {
        id: Date.now() + Math.floor(Math.random() * 1000),
        name: 'Bob Johnson',
        email: 'bob@example.com',
        active: false,
      },
      {
        id: Date.now() + Math.floor(Math.random() * 1000),
        name: 'Alice Brown',
        email: 'alice@example.com',
        active: true,
      },
      {
        id: Date.now() + Math.floor(Math.random() * 1000),
        name: 'Charlie Wilson',
        email: 'charlie@example.com',
        active: false,
      },
    ];

    sampleUsers.forEach(user => addUser(user));
  };

  return (
    <Card title="Add New User">
      <form onSubmit={handleAddUser} className={'formGrid'}>
        <Input
          label="Name"
          type="text"
          value={formData.name}
          onChange={e =>
            setFormData(prev => ({ ...prev, name: e.target.value }))
          }
          placeholder="Enter name"
          required
        />
        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={e =>
            setFormData(prev => ({ ...prev, email: e.target.value }))
          }
          placeholder="Enter email"
          required
        />
        <Button type="submit" variant="primary">
          Add User
        </Button>
      </form>

      <Button
        onClick={handleAddSampleUsers}
        variant="success"
        style={{ width: '100%' }}
      >
        Add Sample Users
      </Button>
    </Card>
  );
};
