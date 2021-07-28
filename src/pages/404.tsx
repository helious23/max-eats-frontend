import { Link } from "react-router-dom";
import routes from "../routes";

export const NotFound: React.FC = () => (
  <div className="mt-64 flex flex-col items-center justify-center">
    <h2 className="font-semibold text-2xl mb-3">페이지를 찾을 수 없습니다</h2>
    <h4 className="font-medium text-base mb-5">
      페이지가 존재하지 않거나 이동했습니다.
    </h4>
    <Link className="hover:underline text-lime-600" to={routes.home}>
      홈 화면으로 돌아가기 &rarr;
    </Link>
  </div>
);
