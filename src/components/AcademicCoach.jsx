import { useSelector } from "react-redux";
import { calculateCGPA } from "../utils/calculateCGPA";
import { classificationThresholds } from "../utils/academicConstants";

function AcademicCoach() {
  const {
    gradingScale,
    targetClass,
    academicYears,
    currentLevel = 400,
  } = useSelector((state) => state.academic);

  const currentCGPA = calculateCGPA(academicYears, currentLevel);
  const projectedCGPA = calculateCGPA(academicYears, currentLevel, true);

  const targetThreshold = classificationThresholds[targetClass];

  const higherTargets = Object.entries(classificationThresholds)
    .filter(([, threshold]) => threshold > (targetThreshold ?? 0))
    .sort((a, b) => a[1] - b[1]);

  const nextTarget = higherTargets[0];

  const completedResultsExist = currentCGPA != null;
  const projectedResultsExist = projectedCGPA != null;

  const targetAlreadyReached =
    completedResultsExist &&
    targetThreshold !== undefined &&
    currentCGPA >= targetThreshold;

  const projectedTargetReached =
    projectedResultsExist &&
    targetThreshold !== undefined &&
    projectedCGPA >= targetThreshold;

  const targetAdvice = (() => {
    if (!completedResultsExist) {
      return {
        title: "Your journey starts here.",
        message:
          "Add your completed course results to discover your current CGPA. Every result gives you a clearer picture of your academic progress.",
      };
    }

    if (projectedTargetReached) {
      if (nextTarget) {
        return {
          title: "You're on track. Can you aim higher?",
          message: `Your projected CGPA meets your ${targetClass} target. Keep pushing! Your next milestone is ${nextTarget[0]}.`,
        };
      }

      return {
        title: "Keep protecting your progress.",
        message:
          "Your projected CGPA meets your selected target, which is already the highest classification in this list. Keep working consistently to maintain your performance.",
      };
    }

    if (targetAlreadyReached) {
      return {
        title: "You've reached your target. Keep going!",
        message:
          "Your current CGPA meets your selected classification. Keep aiming for strong results so you can maintain or improve your standing.",
      };
    }

    return {
      title: "There's still room to grow.",
      message: projectedResultsExist
        ? `Your projected CGPA is currently below your ${targetClass} target. Focus on your upcoming courses, strengthen your understanding of difficult topics, and keep working towards better results.`
        : `Your current CGPA is below your ${targetClass} target. Keep entering your results and working consistently. Your next results can help you move closer to your goal.`,
    };
  })();

  return (
    <section className="mt-8 rounded-2xl border border-[#39ff88]/20 bg-[#0e0e0e] p-6 sm:p-8 lg:p-9">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#39ff88]">
        Your next move
      </p>

      <h2 className="mt-3 text-2xl font-black sm:text-3xl">
        Academic Improvement Coach
        <span className="text-[#39ff88]">.</span>
      </h2>

      <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-400 sm:text-base">
        Your academic progress, automatically tracked. Know where you stand and
        discover your next milestone.
      </p>

      <div className="mt-7 grid gap-4 sm:grid-cols-2">
        <article className="rounded-xl border border-white/10 bg-[#111] p-5 sm:p-6">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Current CGPA
          </p>

          <p className="mt-3 text-4xl font-black text-white">
            {currentCGPA == null ? "--" : currentCGPA.toFixed(2)}
            <span className="ml-2 text-sm font-medium text-gray-500">
              / {gradingScale}.00
            </span>
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Based on completed results
          </p>
        </article>

        <article className="rounded-xl border border-[#39ff88]/20 bg-[#39ff88]/[0.05] p-5 sm:p-6">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Projected CGPA
          </p>

          <p className="mt-3 text-4xl font-black text-[#39ff88]">
            {projectedCGPA == null ? "--" : projectedCGPA.toFixed(2)}
            <span className="ml-2 text-sm font-medium text-gray-500">
              / {gradingScale}.00
            </span>
          </p>

          <p className="mt-2 text-sm text-gray-400">Includes expected grades</p>
        </article>
      </div>

      <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
        <p className="text-sm font-bold text-gray-400">Your selected target</p>

        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-xl font-black text-white sm:text-2xl">
            {targetClass}
          </h3>

          <span className="rounded-full border border-[#39ff88]/20 bg-[#39ff88]/10 px-3 py-1.5 text-sm font-bold text-[#39ff88]">
            {targetThreshold?.toFixed(2) ?? "--"} / {gradingScale}.00
          </span>
        </div>

        <p className="mt-3 text-sm leading-6 text-gray-400">
          {projectedResultsExist
            ? projectedTargetReached
              ? "Your projection currently meets this target."
              : "Your projection has not reached this target yet."
            : "Add course results to see how your academic performance compares with this target."}
        </p>
      </div>

      <div className="mt-5 rounded-xl border border-[#39ff88]/20 bg-[#39ff88]/[0.05] p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#39ff88]/10 text-xl text-[#39ff88]">
            ↗
          </span>

          <div>
            <h3 className="text-lg font-black text-[#39ff88] sm:text-xl">
              {targetAdvice.title}
            </h3>

            <p className="mt-3 text-sm leading-7 text-gray-300 sm:text-base">
              {targetAdvice.message}
            </p>
          </div>
        </div>
      </div>

      {nextTarget && (
        <div className="mt-5 rounded-xl border border-white/10 bg-[#111] p-5 sm:p-6">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Look beyond your target
          </p>

          <h3 className="mt-2 text-xl font-black text-white">
            {nextTarget[0]}
          </h3>

          <p className="mt-2 text-sm leading-6 text-gray-400">
            Your next classification milestone is {nextTarget[0]}, with a
            reference threshold of {nextTarget[1].toFixed(2)}. Keep improving
            your results and check your progress as new grades come in.
          </p>
        </div>
      )}

      <p className="mt-5 text-xs leading-5 text-gray-600">
        Projections depend on the results recorded and the calculation rules
        currently implemented. Classification thresholds are provisional until
        verified against the regulations applicable to your programme.
      </p>
    </section>
  );
}

export default AcademicCoach;
