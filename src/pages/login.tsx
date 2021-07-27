import { gql, useMutation } from "@apollo/client";
import Helmet from "react-helmet";
import { useForm } from "react-hook-form";
import { FormError } from "../components/form-error";
import {
  loginMutation,
  loginMutationVariables,
} from "../__generated__/loginMutation";
import maxeatsLogo from "../images/maxeats.png";
import { Button } from "../components/button";
import { Link } from "react-router-dom";

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
  const { register, getValues, formState, handleSubmit } = useForm<ILoginForm>({
    mode: "onChange",
  });
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
    <div className="h-full flex items-center flex-col mt-3 lg:mt-20">
      <Helmet>
        <title>Login | MaxEats</title>
      </Helmet>
      <div className="w-full max-w-screen-sm flex flex-col px-5 items-center">
        <img src={maxeatsLogo} alt="logo" className="w-44 mb-10 lg:mb-16" />
        <h4 className="w-full text-left text-2xl mb-5 font-medium lg:text-3xl">
          돌아오신 것을 환영합니다
        </h4>
        <div className="w-full mt-5">이메일 주소로 로그인하세요</div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-3 mt-3 w-full mb-3"
        >
          <input
            {...register("email", { required: "이메일 주소가 필요합니다" })}
            name="email"
            type="email"
            required
            placeholder="이메일"
            className="input"
          />
          {formState.errors.email?.message && (
            <FormError errorMessage={formState.errors.email?.message} />
          )}
          <input
            {...register("password", {
              required: "패스워드가 필요합니다",
            })}
            name="password"
            type="password"
            required
            placeholder="패스워드"
            className=" input"
          />
          {formState.errors.password?.message && (
            <FormError errorMessage={formState.errors.password?.message} />
          )}
          <Button
            canClick={formState.isValid}
            loading={loading}
            actionText={"로그인"}
          />
          {loginMutationResult?.login.error && (
            <FormError errorMessage={loginMutationResult.login.error} />
          )}
        </form>
        <div className="mt-3">
          Max Eats는 처음이신가요?{" "}
          <Link to="/create-account" className="text-lime-600 hover:underline">
            계정 만들기
          </Link>
        </div>
      </div>
      <footer className="absolute bottom-0 w-full h-24 lg:h-16 bg-gray-900 text-white text-xs flex items-center justify-between">
        <div className="ml-3 lg:ml-20">
          &copy; {new Date().getFullYear()} Max Technologies, Inc.
        </div>
        <div className="mr-3 lg:mr-20">개인정보 보호정책 | 이용약관</div>
      </footer>
    </div>
  );
};
