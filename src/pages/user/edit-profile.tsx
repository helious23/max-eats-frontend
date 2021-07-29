import { Button } from "../../components/button";
import { useMe } from "../../hooks/useMe";
import { useForm } from "react-hook-form";
import { PageTitle } from "../../components/page-title";
import { FormError } from "../../components/form-error";
import { gql, useMutation, useApolloClient } from "@apollo/client";
import { useHistory } from "react-router-dom";
import routes from "../../routes";
import {
  editProfile,
  editProfileVariables,
} from "../../__generated__/editProfile";

const EDIT_PROFILE_MUTATION = gql`
  mutation editProfile($input: EditProfileInput!) {
    editProfile(input: $input) {
      ok
      error
    }
  }
`;

interface IFormProps {
  email?: string;
  password?: string;
}

export const EditProfile = () => {
  const history = useHistory();
  const { data: userData } = useMe();
  const client = useApolloClient();
  const { register, formState, handleSubmit, getValues } = useForm<IFormProps>({
    mode: "onChange",
    defaultValues: {
      email: userData?.me.email,
    },
  });

  const onCompleted = (data: editProfile) => {
    const {
      editProfile: { ok },
    } = data;
    if (ok && userData) {
      // update cache
      // 현재 email 과 password 둘 다 변경시, 동일 password 변경 시  validation 안됨
      // 이후 백엔드에서 editPassword 생성 후 route 분리하여 관리해야 될듯
      if (Boolean(getValues("email")) && Boolean(getValues("password"))) {
        alert("프로필 변경이 완료되었습니다");
      } else if (Boolean(getValues("password"))) {
        alert("패스워드 변경이 완료되었습니다");
      } else if (Boolean(getValues("email"))) {
        alert("이메일 변경이 완료되었습니다. 이메일 인증을 해주세요.");
      }
      const {
        me: { email: prevEmail, id },
      } = userData;
      const { email: newEmail } = getValues();
      if (prevEmail !== newEmail && newEmail !== "") {
        client.writeFragment({
          id: `User:${id}`,
          fragment: gql`
            fragment EditedUser on User {
              email
              verified
            }
          `,
          data: {
            email: newEmail,
            verified: false,
          },
        });
      }
      history.push(routes.home);
    }
  };

  const [editProfileMutation, { data: editProfileMutationResult, loading }] =
    useMutation<editProfile, editProfileVariables>(EDIT_PROFILE_MUTATION, {
      onCompleted,
    });

  const onSubmit = (data: IFormProps) => {
    const { email, password } = data;
    if (!loading) {
      editProfileMutation({
        variables: {
          input: {
            ...(email !== "" && { email }),
            ...(password !== "" && { password }),
          },
        },
      });
    }
  };
  return (
    <div className="mt-64 flex flex-col justify-center items-center">
      <PageTitle title={"프로필 수정"} />
      <h4 className="font-semibold text-2xl mb-3">프로필 수정</h4>
      <form
        className="grid gap-3 mt-5 max-w-screen-sm w-full mb-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        <input
          className={`input ${
            formState.errors.email?.message
              ? "focus:border-red-500"
              : "focus:border-gray-700"
          }`}
          type="email"
          placeholder="이메일"
          {...register("email", {
            pattern: {
              value:
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
              message: "유효한 이메일 주소가 아닙니다",
            },
          })}
        />
        {formState.errors.email?.message && (
          <FormError errorMessage={formState.errors.email?.message} />
        )}
        <input
          className={`input ${
            formState.errors.password?.message
              ? "focus:border-red-500"
              : "focus:border-gray-700"
          }`}
          type="password"
          placeholder="패스워드"
          {...register("password")}
        />
        {formState.errors.password?.message && (
          <FormError errorMessage={formState.errors.password?.message} />
        )}
        <Button
          canClick={formState.isValid}
          loading={loading}
          actionText="프로필 저장"
        />
        {editProfileMutationResult?.editProfile.error && (
          <FormError
            errorMessage={editProfileMutationResult.editProfile.error}
          />
        )}
      </form>
    </div>
  );
};
