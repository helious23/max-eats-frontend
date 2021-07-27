interface IButtonProps {
  canClick: boolean;
  loading: boolean;
  actionText: string;
}

export const Button: React.FC<IButtonProps> = ({
  canClick,
  loading,
  actionText,
}) => (
  <button
    className={`text-white py-3 transition-colors text-lg font-medium focus:outline-none ${
      canClick
        ? "bg-lime-600 hover:bg-lime-700 "
        : "bg-gray-300 pointer-events-none"
    }`}
  >
    {loading ? "로딩중..." : actionText}
  </button>
);
