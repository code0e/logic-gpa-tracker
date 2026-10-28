import { useDispatch, useSelector } from "react-redux";
import { setCurrentLevel } from "../features/academic/academicSlice";

function Navbar() {
  const dispatch = useDispatch();
  const { currentLevel = 400 } = useSelector((state) => state.academic);

  return (
    <header className="flex flex-wrap items-center justify-between gap-5 border-b border-white/10 pb-7 lg:pb-9">
      <a
        href="#top"
        className="text-2xl font-black tracking-tight sm:text-3xl lg:text-4xl"
      >
        LOGIC<span className="text-[#39ff88]">.</span>
      </a>

      <div className="flex items-center gap-3">
        <span className="text-xs font-bold tracking-wide text-gray-400 sm:text-sm">
          UNIZIK <span className="text-[#39ff88]">/</span>
        </span>

        <select
          aria-label="Current academic level"
          value={currentLevel}
          onChange={(event) =>
            dispatch(setCurrentLevel(Number(event.target.value)))
          }
          className="rounded-full border border-white/10 bg-[#111] px-4 py-2.5 text-xs font-bold text-[#39ff88] outline-none focus:border-[#39ff88]/60 sm:text-sm"
        >
          {[100, 200, 300, 400].map((level) => (
            <option key={level} value={level} className="bg-[#111]">
              {level} Level
            </option>
          ))}
        </select>
      </div>
    </header>
  );
}

export default Navbar;
