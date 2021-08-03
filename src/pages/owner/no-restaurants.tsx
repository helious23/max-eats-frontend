import { Link } from "react-router-dom";
import { PageTitle } from "../../components/page-title";
import routes from "../../routes";

export const NoRestaurants: React.FC = () => (
  <div className="mt-64 flex flex-col items-center justify-center">
    <PageTitle title={"등록된 식당이 없습니다"} />
    <h2 className="font-semibold text-2xl mb-3">등록된 식당이 없습니다</h2>
    <h4 className="font-medium text-base mb-5">
      자신이 운영하는 식당을 등록하세요!
    </h4>
    <Link className="link" to={routes.addRestaurant}>
      식당 등록하러 가기 &rarr;
    </Link>
  </div>
);
