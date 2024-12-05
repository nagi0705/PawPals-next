// lib/auth.js
export const signUp = async (email, password) => {
  const res = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    throw new Error('サインアップに失敗しました');
  }
  return res.json();
};

export const signIn = async (email, password) => {
  const res = await fetch('/api/auth/signin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    throw new Error('サインインに失敗しました');
  }
  return res.json();
};