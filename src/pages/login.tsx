import { gql, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { FormError } from "../components/form-error";
import {
  loginMutation,
  loginMutationVariables,
} from "../__generated__/loginMutation";

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
  const [loginMutation, { data }] = useMutation<
    loginMutation,
    loginMutationVariables
  >(LOGIN_MUTATION);
  const onSubmit = () => {
    const { email, password } = getValues();
    loginMutation({
      variables: {
        loginInput: {
          email,
          password,
        },
      },
    });
  };
  return (
    <div className="h-screen flex items-center justify-center bg-gray-800">
      <div className="bg-white w-full max-w-lg pt-10 pb-7 rounded-lg text-center">
        <h3 className="text-3xl text-gray-800">Log In</h3>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-3 mt-5 px-5"
        >
          <input
            {...register("email", { required: "이메일 주소가 필요합니다" })}
            name="email"
            type="email"
            required
            placeholder="E-mail"
            className=" input mb-3 "
          />
          {errors.email?.message && (
            <FormError errorMessage={errors.email?.message} />
          )}
          <input
            {...register("password", {
              required: "패스워드가 필요합니다",
              // minLength: 10,
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
          {/* {errors.password?.type === "minLength" && (
            <FormError errorMessage="패스워드는 10글자 이상입니다" />
          )} */}
          <button className="btn mt-3">로그인</button>
        </form>
      </div>
    </div>

    // <div className="h-screen flex justify-center bg-white">
    //   <div className="bg-white rounded-lg text-center w-full max-w-lg py-10">
    //     <div>
    //       <h3 className="text-5xl text-gray-800 mb-10 mt-10">
    //         <span>Max</span>
    //         <span className="ml-3 font-bold text-green-500">Eats</span>
    //       </h3>
    //     </div>
    //     <div className="flex items-start flex-col">
    //       <h4 className="text-3xl ml-5"> 돌아오신 것을 환영합니다</h4>
    //       <span className="text-l ml-5 mt-10">이메일 주소로 로그인하세요</span>
    //       <form className="flex flex-col items-start mt-5 px-5 w-full">
    //         <input
    //           placeholder="E-MAIL"
    //           className="bg-gray-100 shadow-inner focus:outline-none focus:border-green-600 border-2 focus:border-opacity-60 py-3 px-5 rounded-lg mb-3 w-full"
    //         />
    //         <input
    //           placeholder="PASSWORD"
    //           className="bg-gray-100 shadow-inner focus:outline-none focus:border-green-600 border-2 focus:border-opacity-60 py-3 px-5 rounded-lg w-full"
    //         />
    //       </form>
    //       <div className="flex w-full item-center justify-center">
    //         <button className="py-3 px-5 bg-green-500 text-white text-lg rounded-lg mt-3 focus:outline-none hover:bg-green-700 w-full mx-5">
    //           로그인
    //         </button>
    //       </div>
    //     </div>
    //   </div>
    //   <footer className="absolute bg-gray-900 w-full h-16 bottom-0 flex items-center justify-between px-20 text-white text-xs">
    //     <div>&#169; {new Date().getFullYear()} Max Eats</div>
    //     <div>
    //       <span>개인정보 보호정책</span>
    //       <span> | </span>
    //       <span>이용약관</span>
    //     </div>
    //   </footer>
    // </div>
  );
};
