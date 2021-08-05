import logoFile from "../images/maxeats.png";
import { useMe } from "../hooks/useMe";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faSignOutAlt,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useHistory } from "react-router-dom";
import routes from "../routes";
import { logUserOut } from "../apollo";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { UserRole } from "../__generated__/globalTypes";

export const Header: React.FC = () => {
  const history = useHistory();
  const onClick = () => {
    logUserOut();
    history.push(routes.home);
  };

  const { data } = useMe();

  return (
    <>
      {!data?.me.verified && (
        <div className="bg-lime-600 p-3 text-center text-sm text-white">
          <span>이메일 인증을 진행해 주세요</span>
        </div>
      )}
      <header className="py-8">
        <div className="w-full px-5 2xl:px-0 max-w-screen-2xl mx-auto flex justify-between items-center">
          <div className="flex">
            <FontAwesomeIcon
              icon={faBars}
              className="text-lg font-light mr-5 cursor-pointer"
            />
            <Link to={routes.home}>
              <img
                src={logoFile}
                alt="logo"
                className="w-32 relative bottom-3.5"
              />
            </Link>
          </div>
          <div>
            {data?.me.role === UserRole.Owner ? (
              <span className="text-base">
                <Link to={routes.addRestaurant}>
                  <FontAwesomeIcon icon={faPlus} className="text-xl mr-5" />
                </Link>
              </span>
            ) : null}
            <span className="text-base">
              <Link to={routes.editProfile}>
                <FontAwesomeIcon icon={faUser} className="text-xl mr-5" />
              </Link>
            </span>
            <span>
              <Link onClick={onClick} to={routes.home} role="navigation">
                <FontAwesomeIcon
                  icon={faSignOutAlt}
                  className="text-xl cursor-pointer"
                />
              </Link>
            </span>
          </div>
        </div>
      </header>
    </>
  );
};
