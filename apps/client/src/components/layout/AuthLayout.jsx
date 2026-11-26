import { Link } from "react-router-dom";
import { CheckCircle2, Layers } from "lucide-react";

function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between bg-[#111827] p-12 text-white">
        <Link to="/login" className="flex items-center gap-3">
          <div className="bg-indigo-500 p-2 rounded-xl">
            <Layers size={25} />
          </div>
          <span className="text-2xl font-bold tracking-tight">WorkSpace</span>
        </Link>

        <div className="max-w-lg">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-indigo-200 mb-8">
            <span className="h-2 w-2 rounded-full bg-indigo-400" />
            Your team's workspace
          </div>

          <h1 className="text-5xl font-bold leading-tight">
            Bring your team's work together.
          </h1>

          <p className="text-slate-400 mt-6 text-lg leading-8">
            Plan projects, manage tasks and collaborate with your team — all in
            one place.
          </p>

          <div className="mt-10 space-y-4">
            {[
              "Organize projects effortlessly",
              "Keep everyone aligned",
              "Track progress in real time",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 text-slate-300"
              >
                <CheckCircle2 size={19} className="text-indigo-400" />
                {item}
              </div>
            ))}
          </div>
        </div>

        <p className="text-sm text-slate-500">
          © 2026 WorkSpace. All rights reserved.
        </p>
      </div>

      {/* Right panel */}
      <div className="flex items-center justify-center px-6 py-12 sm:px-12">
        <div className="w-full max-w-md">
          <Link to="/login" className="lg:hidden flex items-center gap-2 mb-12">
            <Layers className="text-indigo-600" size={28} />
            <span className="text-xl font-bold">WorkSpace</span>
          </Link>

          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            {title}
          </h2>

          <p className="mt-2 text-gray-500">{subtitle}</p>

          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;