import Header from "./Header";
import Footer from "./Footer";

const MasterLayout = ({ children }) => {
  return (
    <>
      <Header />

      <main className="p-6">
        {children}
      </main>

      <Footer />
    </>
  );
};

export default MasterLayout;
