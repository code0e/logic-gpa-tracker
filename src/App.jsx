import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import AcademicOverview from "./components/AcademicOverview";
import SemesterBreakdown from "./components/SemesterBreakdown";
import TargetSelector from "./components/TargetSelector";
import AcademicCoach from "./components/AcademicCoach";
import CurrentConfiguration from "./components/CurrentConfiguration";
import CourseManager from "./components/CourseManager";
import Footer from "./components/Footer";

function App() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#0a0a0a] px-5 py-8 text-white sm:px-8 sm:py-10 lg:px-12 lg:py-12 xl:px-16">
      <div className="mx-auto w-full max-w-[1600px]">
        <Navbar />
        <Hero />
        <AcademicOverview />
        <SemesterBreakdown />
        <TargetSelector />
        <AcademicCoach />
        <CurrentConfiguration />

        <section id="course-manager" className="mt-12 scroll-mt-8 lg:mt-16">
          <CourseManager />
        </section>

        <Footer />
      </div>
    </main>
  );
}

export default App;
