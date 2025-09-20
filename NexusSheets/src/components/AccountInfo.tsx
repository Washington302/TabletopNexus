import React from "react";

interface AccountInfoProps {
  user?: {
    name: string;
    email: string;
    joined: string;
  };
}

const AccountInfo: React.FC<AccountInfoProps> = ({ user }) => {
  if (!user) {
    return (
      <div style={{ color: 'var(--color-text-muted)', marginBottom: 24 }}>
        <strong>User:</strong> Guest (Sign in to personalize)
      </div>
    );
  }
  return (
    <div style={{ marginBottom: 24 }}>
        <strong>User:</strong> {user.name}<br />
        <strong>Email:</strong> {user.email}<br />
        <strong>Joined:</strong> {user.joined}
        </div>
  );
};

export default AccountInfo;
