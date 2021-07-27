import { gql, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { FormError } from "../components/form-error";
import {
  loginMutation,
  loginMutationVariables,
} from "../__generated__/loginMutation";
import maxeatsLogo from "../images/maxeats.png";

const LOGIN_MUTATION = gql`
  mutation loginMutation($loginInput: LoginInput!) {
    login(input: $loginInput) {
      ok
      token
      error
    }
  }
`;

interface ILoginForm {
  email: string;
  password: string;
}

export const Login = () => {
  const {
    register,
    getValues,
    formState: { errors },
    handleSubmit,
  } = useForm<ILoginForm>();
  const onCompleted = (data: loginMutation) => {
    const {
      login: { ok, token },
    } = data;
    if (ok) {
      console.log(token);
    }
  };

  const [loginMutation, { data: loginMutationResult, loading }] = useMutation<
    loginMutation,
    loginMutationVariables
  >(LOGIN_MUTATION, {
    onCompleted,
  });
  const onSubmit = () => {
    const { email, password } = getValues();
    if (!loading) {
      // 로딩중일때 mutation 실행되지 않게 함
      loginMutation({
        variables: {
          loginInput: {
            email,
            password,
          },
        },
      });
    }
  };
  return (
    <div className="h-screen  flex items-center flex-col mt-3 lg:mt-20">
      <div className="w-full max-w-screen-sm flex flex-col px-5 items-center">
        <img src={maxeatsLogo} alt="logo" className="w-44 mb-10 lg:mb-16" />
        <h4 className="w-full text-left text-2xl mb-5 font-medium lg:text-3xl">
          돌아오신 것을 환영합니다
        </h4>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-3 mt-5 w-full"
        >
          <input
            {...register("email", { required: "이메일 주소가 필요합니다" })}
            name="email"
            type="email"
            required
            placeholder="E-mail"
            className="input"
          />
          {errors.email?.message && (
            <FormError errorMessage={errors.email?.message} />
          )}
          <input
            {...register("password", {
              required: "패스워드가 필요합니다",
            })}
            name="password"
            type="password"
            required
            placeholder="Password"
            className=" input"
          />
          {errors.password?.message && (
            <FormError errorMessage={errors.password?.message} />
          )}
          <button className="btn">{loading ? "로딩중..." : "로그인"}</button>
          {loginMutationResult?.login.error && (
            <FormError errorMessage={loginMutationResult.login.error} />
          )}
        </form>
      </div>
    </div>
  );
};
