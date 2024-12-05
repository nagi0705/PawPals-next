   // pages/auth/signin.js
   import { useState } from 'react';

   const Signin = () => {
     const [email, setEmail] = useState('');
     const [password, setPassword] = useState('');

     const handleSignin = async (e) => {
       e.preventDefault();
       const res = await fetch('/api/auth/signin', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify({ email, password }),
       });
       console.log('Request body:', JSON.stringify({ email, password }));
       if (res.ok) {
         // サインイン成功時の処理
         console.log('サインイン成功');
       } else {
         // エラー処理
         const errorData = await res.json();
         console.error('サインインエラー:', errorData.error);
       }
     };

     return (
       <form onSubmit={handleSignin}>
         <input
           type="email"
           value={email}
           onChange={(e) => setEmail(e.target.value)}
           placeholder="メールアドレス"
           required
         />
         <input
           type="password"
           value={password}
           onChange={(e) => setPassword(e.target.value)}
           placeholder="パスワード"
           required
         />
         <button type="submit">サインイン</button>
       </form>
     );
   };

   export default Signin;