import { PageTitle } from "../../components/page-title";
export const Notice = () => {
  return (
    <div className="mt-64 flex flex-col items-center justify-center">
      <PageTitle title={"공지사항"} />
      <h2 className="font-semibold text-2xl mb-3">
        이메일 인증 후 사용 가능합니다.
      </h2>
      <h4 className="font-medium text-base mb-5">
        이메일을 확인하여 인증해주세요.
      </h4>
    </div>
  );
};
