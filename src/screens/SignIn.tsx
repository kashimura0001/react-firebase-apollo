import React, { useState } from "react";
import firebase from "../Firebase";
import { Link, useHistory, withRouter } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";

const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    currentUser {
      id
      email
      name
    }
  }
`;

export const SignIn = withRouter((props) => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hasSignInError, setHasSignInError] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    setHasSignInError(false);

    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
    } catch (e) {
      setHasSignInError(true);
      setLoading(false);
      return;
    }

    const { error, data } = await useQuery(GET_CURRENT_USER);

    if (error) {
      await firebase.auth().signOut();
      setHasSignInError(true);
      setLoading(false);
      return;
    }

    setLoading(false);
    history.push(data ? "/" : "/profile/register");
  };

  return (
    <div>
      <div>サインイン</div>
      {hasSignInError && <div>サインインに失敗しました。</div>}
      <div>
        <input type="email" onChange={(e) => setEmail(e.target.value)} placeholder="メールアドレスを入力" />
      </div>
      <div>
        <input type="password" onChange={(e) => setPassword(e.target.value)} placeholder="パスワードを入力" />
      </div>
      <div>
        <button type="submit" onClick={handleSignIn} disabled={loading}>
          {loading ? "loading..." : "サインイン"}
        </button>
      </div>
      ---
      <div>
        <Link to="/password/reset">パスワードをお忘れの方はこちら</Link>
      </div>
      ---
      <div>
        <Link to="/signup">登録していない方はこちら</Link>
      </div>
    </div>
  );
});
