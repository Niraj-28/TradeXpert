import Navbar from "../components/Navbar/Navbar";

const MainLayout = ({ children }) => {

  return (

    <div className="min-h-screen bg-[#F8FAFC]">

      {/* Navbar */}

      <Navbar />

      {/* Content */}

      <main className="p-6">

        {children}

      </main>

    </div>

  );
};

export default MainLayout;