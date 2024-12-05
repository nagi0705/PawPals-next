// components/LogoutButton.js
import { signOut } from "next-auth/react";

const LogoutButton = () => {
  const handleLogout = () => {
    signOut({ callbackUrl: "/" }); // ログアウト後、トップページにリダイレクト
  };

  return (
    <button onClick={handleLogout}>
      ログアウト
    </button>
  );
};

export default LogoutButton;