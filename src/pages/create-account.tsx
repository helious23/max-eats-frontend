import { gql, useMutation } from "@apollo/client";
import Helmet from "react-helmet";
import { useForm } from "react-hook-form";
import { FormError } from "../components/form-error";
import maxeatsLogo from "../images/maxeats.png";
import { Button } from "../components/button";
import { Link, useHistory } from "react-router-dom";
import { UserRole } from "../__generated__/globalTypes";
import {
  createAccountMutation,
  createAccountMutationVariables,
} from "../__generated__/createAccountMutation";

const CREATE_ACCOUNT_MUTATION = gql`
  mutation createAccountMutation($createAccountInput: CreateAccountInput!) {
    createAccount(input: $createAccountInput) {
      ok
      error
    }
  }
`;

interface ICreateAccountForm {
  email: string;
  password: string;
  role: UserRole;
}

export const CreateAccount = () => {
  const { register, getValues, formState, handleSubmit } =
    useForm<ICreateAccountForm>({
      mode: "onChange",
      defaultValues: {
        role: UserRole.Client,
      },
    });

  const history = useHistory();
  const onCompleted = (data: createAccountMutation) => {
    const { email, password } = getValues();
    const {
      createAccount: { ok },
    } = data;
    if (ok) {
      history.push("/login", {
        message: "계정이 생성되었습니다. 로그인 하세요.",
        email,
        password,
      });
    }
  };

  const [createAccountMutaion, { loading, data: createAccountMutationResult }] =
    useMutation<createAccountMutation, createAccountMutationVariables>(
      CREATE_ACCOUNT_MUTATION,
      {
        onCompleted,
      }
    );

  const onSubmit = (data: ICreateAccountForm) => {
    const { email, password, role } = data;
    if (!loading) {
      createAccountMutaion({
        variables: {
          createAccountInput: {
            email,
            password,
            role,
          },
        },
      });
    }
  };
  return (
    <div className="h-full flex items-center flex-col mt-3 lg:mt-20">
      <Helmet>
        <title> Create Account | MaxEats</title>
      </Helmet>
      <div className="w-full max-w-screen-sm flex flex-col px-5 items-center">
        <img src={maxeatsLogo} alt="logo" className="w-44 mb-10 lg:mb-16" />
        <h4 className="w-full text-left text-2xl mb-5 font-medium lg:text-3xl">
          시작하기
        </h4>
        <div className="w-full mt-5">이메일 주소로 로그인하세요</div>
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
          <select {...register("role", { required: true })} className="input">
            {Object.keys(UserRole).map((role, index) => (
              <option key={index}>{role}</option>
            ))}
          </select>
          <Button
            canClick={formState.isValid}
            loading={loading}
            actionText={"계정 만들기"}
          />
          {createAccountMutationResult?.createAccount.error && (
            <FormError
              errorMessage={createAccountMutationResult.createAccount.error}
            />
          )}
        </form>
        <div className="mt-3">
          Max Eats 계정이 있으신가요?{" "}
          <Link to="/login" className="text-lime-600 hover:underline">
            로그인 하기
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
