interface ILogoProps {
  logoFile: string;
  option?: string;
}

export const Logo: React.FC<ILogoProps> = ({ logoFile, option }) => (
  <img src={logoFile} alt="logo" className={`${option}`} />
);
