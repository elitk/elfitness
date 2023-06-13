import MenuBar from '../MenuBar/MenuBar';

// type LayoutProps
type LayoutProps = {
  children?: React.ReactNode;
};
const Layout: React.FC<LayoutProps> = ({ children }: LayoutProps): JSX.Element => {
  return (
    <div>
      <MenuBar />
      <main>{children}</main>
    </div>
  );
};
export default Layout;
