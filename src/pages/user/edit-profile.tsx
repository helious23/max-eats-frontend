import { Button } from "../../components/button";
import { useMe } from "../../hooks/useMe";

export const EditProfile = () => {
  const { data: userData } = useMe();
  return (
    <div className="mt-64 flex flex-col justify-center items-center">
      <h4 className="font-semibold text-2xl mb-3">프로필 수정</h4>
      <form className="grid gap-3 mt-5 max-w-screen-sm w-full mb-5">
        <input className="input" type="email" placeholder="이메일" />
        <input className="input" type="password" placeholder="패스워드" />
        <Button canClick={true} loading={false} actionText="프로필 저장" />
      </form>
    </div>
  );
};
