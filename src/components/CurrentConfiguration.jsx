import { useSelector } from "react-redux";

function CurrentConfiguration() {
  const { gradingScale, currentLevel = 400 } = useSelector(
    (state) => state.academic,
  );

  return (
    <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 lg:mt-10 lg:p-9">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 sm:text-sm">
        Current configuration
      </p>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        <div>
          <p className="text-sm text-gray-500">University</p>
          <p className="mt-2 text-base font-bold sm:text-lg">
            Nnamdi Azikiwe University
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Grading scale</p>
          <p className="mt-2 text-base font-bold sm:text-lg">
            {gradingScale}-point
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Current level</p>
          <p className="mt-2 text-base font-bold text-[#39ff88] sm:text-lg">
            {currentLevel} Level
          </p>
        </div>
      </div>
    </section>
  );
}

export default CurrentConfiguration;
