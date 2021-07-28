import maxeatslogo from "../images/maxeats.png";
import { Logo } from "../pages/logo";

export const Header: React.FC = () => (
  <header className="py-4">
    <div className="w-full max-w-screen-2xl mx-auto ">
      <Logo logoFile={maxeatslogo} size="w-36" />
    </div>
  </header>
);
