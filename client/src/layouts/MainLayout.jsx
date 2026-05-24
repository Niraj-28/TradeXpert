import Navbar from "../components/Navbar/Navbar";

const MainLayout = ({ children }) => {

  return (

    <div className="min-h-screen bg-[#F8FAFC]">

      {/* Top Navbar */}

      <Navbar />

      {/* Main Content */}

      <main className="p-8">

        {children}

      </main>

    </div>

  );
};

export default MainLayout;