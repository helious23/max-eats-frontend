import { Link } from "react-router-dom";

interface IMenuProps {
  id: number;
}

export const NoOrders: React.FC<IMenuProps> = ({ id }) => (
  <div className="mt-20 flex flex-col items-center justify-center">
    <h2 className="font-semibold text-2xl mb-3">주문이 들어오지 않았습니다</h2>
    <h4 className="font-medium text-base mb-5">
      아직 주문이 들어오지 않았습니다. 색다른 메뉴를 추가해보세요!
    </h4>
    <Link className="link" to={`/restaurant/${id}/add-dish`}>
      메뉴 등록하러 가기 &rarr;
    </Link>
  </div>
);
