import React from "react";
import { useForm } from "react-hook-form";
import { useLoginMutation } from "src/generated/graphql";
import LoginWrapper from "./Login.style";

interface Inputs {
  username: string;
  password: string;
}

function Login() {
  const [login, { error }] = useLoginMutation();
  const { register, handleSubmit, errors } = useForm<Inputs>();

  const onSubmit = (data: Inputs) => {
    login({ variables: data })
      .then(() => {
        console.log("logged in");
      })
      .catch(console.log);
  };

  if (error) return <p>{error.message}</p>;

  return (
    <LoginWrapper>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="text" name="username" ref={register({ required: true })} />
        {errors.username && <span>Invalid username</span>}

        <input
          type="password"
          name="password"
          ref={register({ required: true })}
        />
        {errors.password && <span>Invalid password</span>}

        <button type="submit">Login</button>
      </form>
    </LoginWrapper>
  );
}

export default Login;
