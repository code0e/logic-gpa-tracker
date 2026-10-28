import { useSelector } from "react-redux";
import { calculateCGPA } from "../utils/calculateCGPA";

function AcademicOverview() {
  const {
    gradingScale,
    targetClass,
    academicYears,
    currentLevel = 400,
  } = useSelector((state) => state.academic);

  const currentCGPA = calculateCGPA(academicYears, currentLevel);
  const projectedCGPA = calculateCGPA(academicYears, currentLevel, true);

  const stats = [
    {
      label: "CURRENT CGPA",
      value: currentCGPA == null ? "--" : currentCGPA.toFixed(2),
      description: "Completed results only",
    },
    {
      label: "PROJECTED CGPA",
      value: projectedCGPA == null ? "--" : projectedCGPA.toFixed(2),
      description: "Includes expected grades",
    },
    {
      label: "ACADEMIC TARGET",
      value: targetClass,
      description: "Your graduation goal",
    },
  ];

  return (
    <section className="mt-24 lg:mt-32">
      <div className="mb-7">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
          Your progress
        </p>
        <h2 className="mt-2 text-xl font-bold sm:text-2xl lg:text-3xl">
          Academic overview
        </h2>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {stats.map((item) => (
          <article
            key={item.label}
            className="min-h-[180px] rounded-2xl border border-white/10 bg-[#111] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#39ff88]/40 sm:p-7 lg:p-8 xl:p-9"
          >
            <p className="text-xs font-bold tracking-[0.15em] text-gray-500 sm:text-sm">
              {item.label}
            </p>

            <p
              className={`mt-6 break-words text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl ${
                item.label === "ACADEMIC TARGET"
                  ? "text-[#39ff88]"
                  : "text-white"
              }`}
            >
              {item.value}
            </p>

            {item.label !== "ACADEMIC TARGET" && (
              <p className="mt-1 text-xs text-gray-500">
                / {gradingScale}.00 scale
              </p>
            )}

            <p className="mt-3 text-sm leading-6 text-gray-500 sm:text-base">
              {item.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default AcademicOverview;
