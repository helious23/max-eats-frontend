interface ILogoFile {
  logoFile: string;
  size: string;
}

export const Logo: React.FC<ILogoFile> = ({ logoFile, size }) => (
  <img src={logoFile} alt="logo" className={`${size} mb-10 lg:mb-16`} />
);
