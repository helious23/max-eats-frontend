import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface IPagenationProps {
  page: number;
  totalPages: number;
  onPrevPageClick: () => void;
  onNextPageClick: () => void;
}

export const Pagination: React.FC<IPagenationProps> = ({
  page,
  totalPages,
  onPrevPageClick,
  onNextPageClick,
}) => {
  return (
    <div className="grid grid-cols-3 text-center max-w-md items-center justify-center mx-auto mt-10">
      {page > 1 ? (
        <div className="flex justify-center">
          <FontAwesomeIcon
            icon={faChevronLeft}
            className="focus:outline-none text-xl cursor-pointer"
            onClick={onPrevPageClick}
          />
        </div>
      ) : (
        <div></div>
      )}
      <span className="flex justify-center">
        Page {page} of {totalPages}
      </span>
      {page !== totalPages ? (
        <div className="flex justify-center">
          <FontAwesomeIcon
            icon={faChevronRight}
            className="focus:outline-none text-xl cursor-pointer"
            onClick={onNextPageClick}
          />
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};
