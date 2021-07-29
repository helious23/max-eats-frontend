import { gql, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { FormError } from "../components/form-error";
import {
  loginMutation,
  loginMutationVariables,
} from "../__generated__/loginMutation";
import maxeatsLogo from "../images/maxeats.png";
import { Button } from "../components/button";
import { Link, useLocation } from "react-router-dom";
import { logUserIn } from "../apollo";
import routes from "../routes";
import { PageTitle } from "../components/page-title";
import { Logo } from "./logo";

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
  message?: string;
}

export const Login = () => {
  const location = useLocation<ILoginForm>();
  const { register, formState, handleSubmit } = useForm<ILoginForm>({
    mode: "onChange",
    defaultValues: {
      email: location?.state?.email || "",
      password: location?.state?.password || "",
    },
  });
  const onCompleted = (data: loginMutation) => {
    const {
      login: { ok, token },
    } = data;
    if (ok && token) {
      logUserIn(token);
    }
  };

  const [loginMutation, { data: loginMutationResult, loading }] = useMutation<
    loginMutation,
    loginMutationVariables
  >(LOGIN_MUTATION, {
    onCompleted,
  });
  const onSubmit = (data: ILoginForm) => {
    const { email, password } = data;
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
      <PageTitle title={"로그인"} />
      <div className="w-full max-w-screen-sm flex flex-col px-5 items-center">
        <Logo logoFile={maxeatsLogo} option="w-44 mb-10 lg:mb-16" />
        <h4 className="w-full text-left text-2xl mb-5 font-medium lg:text-3xl">
          돌아오신 것을 환영합니다
        </h4>
        <div className="w-full mt-5">이메일 주소로 로그인하세요</div>
        <div
          className={`${
            location.state?.message ? "text-lime-600 mt-5 font-medium" : ""
          }`}
        >
          {location.state?.message ? location.state.message : ""}
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-3 mt-3 w-full mb-3"
        >
          <input
            {...register("email", {
              required: "이메일 주소가 필요합니다",
              pattern: {
                value:
                  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                message: "유효한 이메일 주소가 아닙니다",
              },
            })}
            name="email"
            type="email"
            required
            placeholder="이메일"
            className={`input ${
              formState.errors.email?.message
                ? "focus:border-red-500"
                : "focus:border-gray-700"
            }`}
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
            className={`input ${
              formState.errors.password?.message
                ? "focus:border-red-500"
                : "focus:border-gray-700"
            }`}
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
          <Link
            to={routes.createAccount}
            className="text-lime-600 hover:underline"
          >
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
