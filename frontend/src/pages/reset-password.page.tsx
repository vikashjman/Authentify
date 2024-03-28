import React, { useState } from 'react';
import { resetPassword } from '../api/api';

const ResetPassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetMessage, setResetMessage] = useState('');

  const handleResetPassword = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Validation: Ensure old password and new password are not empty
    if (!oldPassword.trim() || !newPassword.trim()) {
      setResetMessage('Please enter both old and new passwords.');
      return;
    }

    // Reset message on form submission
    setResetMessage('');

    // Add your password reset logic here
    // Example: Call an API endpoint to reset the password
    const id = JSON.parse(localStorage.getItem('user')).id
    await resetPassword(id,{newPassword,oldPassword})

    // Clear the input fields after successful reset
    setOldPassword('');
    setNewPassword('');

    // Display success message or handle UI changes as needed
    setResetMessage('Password reset successful!');
  };

  return (
    <div>
      <h1>Reset Password</h1>
      <form onSubmit={handleResetPassword}>
        <input
          type="password"
          name="oldPassword"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          placeholder="Enter old password"
        />
        <input
          type="password"
          name="newPassword"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter new password"
        />
        <button type="submit">Reset</button>
      </form>
      {resetMessage && <p>{resetMessage}</p>}
    </div>
  );
};

export default ResetPassword;
