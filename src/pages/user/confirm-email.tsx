import { gql, useMutation } from "@apollo/client";
import { useQueryParam } from "../../hooks/useQueryParam";
import {
  verifyEmail,
  verifyEmailVariables,
} from "../../__generated__/verifyEmail";

const VERIFY_EMAIL_MUTATION = gql`
  mutation verifyEmail($input: VerifyEmailInput!) {
    verifyEmail(input: $input) {
      ok
      error
    }
  }
`;

export const ConfirmEmail = () => {
  const [verifyEmail, { loading: verifyingEmail }] = useMutation<
    verifyEmail,
    verifyEmailVariables
  >(VERIFY_EMAIL_MUTATION);
  const param = useQueryParam();
  const code = param.get("code");
  if (code) {
    verifyEmail({ variables: { input: { code } } });
  }
  return (
    <div className=" mt-64 flex flex-col items-center justify-center">
      <h2 className="text-lg mb-2 font-medium">이메일 확인 중...</h2>
      <h4 className="text-gray-700 text-sm">
        이 페이지를 닫지 말고 기다려주세요
      </h4>
    </div>
  );
};
