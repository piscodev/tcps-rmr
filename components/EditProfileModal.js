// components/EditProfileModal.js
'use client';
import { useState } from 'react';

const EditProfileModal = ({ user, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    contact_num: user.contact_num,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/updateProfile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to update profile');

      const updatedUser = await response.json();
      onUpdate(updatedUser);
      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Edit Profile</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            required
          />
          <input
            name="contact_num"
            value={formData.contact_num}
            onChange={handleChange}
            placeholder="Contact Number"
            required
          />
          <button type="submit">Save Changes</button>
          <button onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
