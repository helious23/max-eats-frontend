import maxeatslogo from "../images/maxeats.png";
import { Logo } from "../pages/logo";
import { useMe } from "../hooks/useMe";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import routes from "../routes";

export const Header: React.FC = () => {
  const { data } = useMe();
  return (
    <>
      {!data?.me.verified && (
        <div className="bg-lime-600 p-3 text-center text-sm text-white">
          <span>이메일 인증을 진행해 주세요</span>
        </div>
      )}
      <header className="py-4">
        <div className="w-full px-5 xlg:px-0 max-w-screen-2xl mx-auto flex justify-between items-center">
          <Logo logoFile={maxeatslogo} option="w-32" />
          <span className="text-base">
            <Link to={routes.myProfile}>
              <FontAwesomeIcon icon={faUser} className="text-xl" />
            </Link>
          </span>
        </div>
      </header>
    </>
  );
};
