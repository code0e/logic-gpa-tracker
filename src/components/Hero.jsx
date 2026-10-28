import { useSelector } from "react-redux";

function Hero() {
  const { currentLevel = 400, gradingScale } = useSelector(
    (state) => state.academic,
  );

  return (
    <section
      id="top"
      className="mt-14 grid items-center gap-12 lg:mt-24 lg:grid-cols-2 lg:gap-14 xl:mt-28"
    >
      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#39ff88]/20 bg-[#39ff88]/[0.06] px-3.5 py-2">
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#39ff88]" />
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#39ff88] sm:text-xs">
            Academic performance
          </p>
        </div>

        <h2 className="mt-7 text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl xl:text-8xl">
          Your grades.
          <br />
          Your next
          <span className="text-[#39ff88]"> move.</span>
        </h2>

        <p className="mt-7 max-w-xl text-base leading-8 text-gray-400 sm:text-lg lg:text-xl lg:leading-9">
          Track your academic journey, calculate your CGPA, and plan your path
          towards the best classification you can achieve.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href="#course-manager"
            className="inline-flex items-center gap-3 rounded-xl bg-[#39ff88] px-5 py-3.5 text-sm font-black text-black transition hover:-translate-y-0.5 hover:bg-[#65ffa5] sm:px-6"
          >
            Manage my courses
            <span aria-hidden="true">↗</span>
          </a>

          <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5">
            <span className="h-2 w-2 rounded-full bg-[#39ff88]" />
            <span className="text-xs font-semibold text-gray-300 sm:text-sm">
              {gradingScale}-point grading scale
            </span>
          </div>
        </div>

        <p className="mt-5 text-xs tracking-wide text-gray-600">
          YOUR ACADEMIC JOURNEY, WITH CLARITY.
        </p>
      </div>

      <div className="relative mx-auto w-full max-w-2xl lg:ml-auto">
        <div className="absolute -inset-4 rounded-[2rem] bg-[#39ff88]/10 blur-3xl" />

        <div className="relative overflow-hidden rounded-2xl border border-[#39ff88]/25 bg-[#111] p-2 shadow-[0_0_60px_rgba(57,255,136,0.08)] sm:rounded-[2rem] sm:p-3">
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl sm:rounded-[1.5rem]">
            <img
              src="/school.jpg"
              alt="University campus representing your academic journey"
              className="absolute inset-0 h-full w-full object-cover object-center transition duration-700 hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/5" />
            <div className="absolute inset-0 bg-gradient-to-br from-[#39ff88]/10 via-transparent to-transparent" />

            <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/15 bg-black/50 px-3 py-2 backdrop-blur-md sm:left-6 sm:top-6">
              <span className="h-2 w-2 rounded-full bg-[#39ff88]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-white sm:text-xs">
                Built for your journey
              </span>
            </div>

            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#39ff88]">
                Every semester counts
              </p>

              <h3 className="mt-2 max-w-md text-2xl font-black leading-tight sm:text-3xl lg:text-4xl">
                Your future is built one result at a time.
              </h3>
            </div>
          </div>
        </div>

        <div className="absolute -bottom-12 left-3 max-w-[230px] rounded-xl border border-white/10 bg-[#151515]/95 p-4 shadow-2xl backdrop-blur-xl sm:-bottom-14 sm:left-7 sm:p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#39ff88]/10 text-xl text-[#39ff88]">
              ↗
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                Your current level
              </p>
              <p className="mt-1 text-sm font-black text-white">
                {currentLevel} Level
              </p>
            </div>
          </div>
        </div>

        <div className="absolute -right-2 -top-3 h-14 w-14 rounded-2xl border border-[#39ff88]/20 bg-[#39ff88]/[0.05] sm:-right-4 sm:-top-4 sm:h-20 sm:w-20" />
      </div>
    </section>
  );
}

export default Hero;
