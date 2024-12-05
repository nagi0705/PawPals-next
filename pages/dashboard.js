// pages/dashboard.js
import { getSession } from 'next-auth/react';

const Dashboard = ({ session }) => {
  if (!session) {
    return <p>ログインが必要です</p>;
  }

  return (
    <div>
      <h1>ダッシュボード</h1>
      <p>こんにちは、{session.user.email}さん</p>
    </div>
  );
};

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    };
  }
  return {
    props: { session },
  };
}

export default Dashboard;