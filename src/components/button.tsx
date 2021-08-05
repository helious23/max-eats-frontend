interface IButtonProps {
  canClick: boolean;
  loading: boolean;
  actionText: string;
  disabled?: boolean;
}

export const Button: React.FC<IButtonProps> = ({
  canClick,
  loading,
  actionText,
  disabled,
}) => (
  <button
    disabled={disabled}
    className={`text-white py-3 transition-colors text-lg font-medium focus:outline-none ${
      canClick
        ? "bg-lime-600 hover:bg-lime-700 "
        : "bg-gray-300 pointer-events-none"
    }`}
  >
    {loading ? "로딩중..." : actionText}
  </button>
);
