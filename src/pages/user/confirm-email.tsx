import { gql, useApolloClient, useMutation } from "@apollo/client";
import { useQueryParam } from "../../hooks/useQueryParam";
import { useMe } from "../../hooks/useMe";
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
  const { data: userData } = useMe();
  const client = useApolloClient(); // client 불러옴
  const onCompleted = (data: verifyEmail) => {
    const {
      verifyEmail: { ok },
    } = data;

    if (ok && userData?.me.id) {
      client.writeFragment({
        id: `User:${userData?.me.id}`, // apollo cache 의 User:1 과 똑같이 기재햐야됨
        // User entity 의 verified 만 fragment 로 수정
        fragment: gql`
          fragment VerifiedUser on User {
            verified
          }
        `,
        data: {
          // 수정할 data
          verified: true,
        },
      });
    }
  };

  const [verifyEmailMutation] = useMutation<verifyEmail, verifyEmailVariables>(
    VERIFY_EMAIL_MUTATION,
    {
      onCompleted,
    }
  );
  const param = useQueryParam();
  const code = param.get("code");
  if (code) {
    verifyEmailMutation({ variables: { input: { code } } });
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
