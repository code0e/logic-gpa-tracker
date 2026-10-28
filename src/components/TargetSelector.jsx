import { useDispatch, useSelector } from "react-redux";
import { setTargetClass } from "../features/academic/academicSlice";
import { classificationThresholds } from "../utils/academicConstants";

function TargetSelector() {
  const dispatch = useDispatch();
  const { targetClass } = useSelector((state) => state.academic);

  return (
    <section className="mt-8 rounded-2xl border border-white/10 bg-[#0e0e0e] p-6 sm:p-8 lg:mt-10 lg:p-9">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#39ff88] sm:text-sm">
        Your academic goal
      </p>

      <h2 className="mt-3 text-2xl font-black sm:text-3xl">
        Choose your target
        <span className="text-[#39ff88]">.</span>
      </h2>

      <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-400 sm:text-base">
        Choose the degree classification you're working towards. Use your
        results to understand your options and plan your next move.
      </p>

      <div className="mt-6">
        <label
          htmlFor="target-class"
          className="mb-3 block text-sm font-bold text-gray-300"
        >
          Target degree classification
        </label>

        <select
          id="target-class"
          value={targetClass}
          onChange={(event) => dispatch(setTargetClass(event.target.value))}
          className="w-full rounded-xl border border-white/10 bg-[#111] px-5 py-4 font-medium text-white outline-none transition focus:border-[#39ff88]/60 sm:max-w-md"
        >
          {Object.keys(classificationThresholds).map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-7 rounded-xl border border-[#39ff88]/15 bg-[#39ff88]/[0.05] p-5 sm:p-6">
        <p className="font-bold text-[#39ff88]">
          Your current result is not your whole story.
        </p>

        <p className="mt-2 text-sm leading-7 text-gray-300 sm:text-base">
          Aim high, stay consistent, and learn from every result. Your goal
          should challenge you, not discourage you.
        </p>
      </div>
    </section>
  );
}

export default TargetSelector;
