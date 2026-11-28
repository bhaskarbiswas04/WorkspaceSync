import { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  Settings,
  ChevronDown,
  Bell,
  Search,
//   PanelLeftClose,
} from "lucide-react";

import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";

import { fetchMyWorkspaces } from "../../features/workspace/workspaceSlice";

function WorkspaceLayout({ workspace, children }) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { workspaces, isLoading } = useAppSelector((state) => state.workspace);

  useEffect(() => {
    if (workspaces.length === 0) {
      dispatch(fetchMyWorkspaces());
    }
  }, [dispatch, workspaces.length]);

  const navigation = [
    {
      label: "Workspace",
      items: [
        {
          name: "Overview",
          icon: LayoutDashboard,
          path: `/workspaces/${workspace._id}`,
          active: true,
        },
        {
          name: "Projects",
          icon: FolderKanban,
          path: `/workspaces/${workspace._id}/projects`,
          active: false,
        },
        {
          name: "Tasks",
          icon: CheckSquare,
          path: `/workspaces/${workspace._id}/tasks`,
          active: false,
        },
      ],
    },
    {
      label: "Management",
      items: [
        {
          name: "Members",
          icon: Users,
          path: `/workspaces/${workspace._id}/members`,
          active: false,
        },
        {
          name: "Settings",
          icon: Settings,
          path: `/workspaces/${workspace._id}/settings`,
          active: false,
        },
      ],
    },
  ];

  const handleWorkspaceChange = (event) => {
    const nextWorkspaceId = event.target.value;

    if (nextWorkspaceId && nextWorkspaceId !== workspace._id) {
      navigate(`/workspaces/${nextWorkspaceId}`);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f5f7fb] text-slate-800">
      {/* Sidebar */}
      <aside className="hidden w-[260px] shrink-0 flex-col border-r border-slate-800 bg-[#111827] text-slate-300 lg:flex">
        {/* Brand */}
        <div className="flex h-[76px] items-center gap-3 border-b border-white/10 px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
            <FolderKanban size={22} />
          </div>

          <div>
            <h1 className="text-lg font-bold tracking-wide text-white">
              WorkSpace
            </h1>
            <p className="text-[11px] text-slate-400">Team collaboration</p>
          </div>
        </div>

        {/* Workspace switcher */}
        <div className="border-b border-white/10 p-4">
          <label className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-slate-500">
            Current workspace
          </label>

          <div className="relative">
            <select
              value={workspace._id}
              onChange={handleWorkspaceChange}
              disabled={isLoading}
              className="w-full appearance-none rounded-xl border border-white/10 bg-white/5 px-3 py-3 pr-9 text-sm font-medium text-white outline-none transition hover:bg-white/10 focus:border-indigo-500"
            >
              <option value={workspace._id} className="bg-[#111827]">
                {workspace.name}
              </option>

              {workspaces.map((item) => {
                const current = item.workspace;

                if (current._id === workspace._id) return null;

                return (
                  <option
                    key={current._id}
                    value={current._id}
                    className="bg-[#111827]"
                  >
                    {current.name}
                  </option>
                );
              })}
            </select>

            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
          </div>

          <button
            onClick={() => navigate("/dashboard")}
            className="mt-3 w-full text-left text-xs font-medium text-indigo-400 transition hover:text-indigo-300"
          >
            + View all workspaces
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-7 overflow-y-auto px-4 py-6">
          {navigation.map((section) => (
            <div key={section.label}>
              <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                {section.label}
              </p>

              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;

                  return item.active ? (
                    <NavLink
                      key={item.name}
                      to={item.path}
                      end
                      className="flex items-center gap-3 rounded-xl bg-indigo-600 px-3 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-900/20"
                    >
                      <Icon size={18} />
                      {item.name}
                    </NavLink>
                  ) : (
                    <div
                      key={item.name}
                      title="Coming soon"
                      className="flex cursor-not-allowed items-center justify-between rounded-xl px-3 py-3 text-sm text-slate-500"
                    >
                      <span className="flex items-center gap-3">
                        <Icon size={18} />
                        {item.name}
                      </span>

                      <span className="rounded-md bg-white/5 px-2 py-1 text-[9px] font-semibold uppercase tracking-wide">
                        Soon
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Sidebar footer */}
        <div className="border-t border-white/10 p-4">
          <div className="rounded-xl bg-white/5 p-4">
            <p className="text-sm font-semibold text-white">Need a hand?</p>
            <p className="mt-1 text-xs leading-5 text-slate-400">
              Stay organized and keep your team moving forward.
            </p>
          </div>

          <p className="mt-4 text-center text-[10px] text-slate-600">
            WorkSpace © 2026
          </p>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-slate-200 bg-white/90 px-5 backdrop-blur-xl sm:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 lg:hidden">
              <FolderKanban size={20} />
            </div>

            <div className="min-w-0">
              <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                Workspace
              </p>

              <h2 className="truncate text-base font-bold text-slate-900">
                {workspace.name}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-400 md:flex">
              <Search size={16} />
              <span>Search workspace...</span>
              <kbd className="ml-5 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px]">
                /
              </kbd>
            </div>

            <button
              type="button"
              aria-label="Notifications"
              className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-indigo-600"
            >
              <Bell size={19} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-indigo-600 ring-2 ring-white" />
            </button>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-sm font-bold text-indigo-700">
              {workspace.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Mobile navigation */}
        <div className="flex gap-2 overflow-x-auto border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
          <NavLink
            to={`/workspaces/${workspace._id}`}
            end
            className={({ isActive }) =>
              `flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold ${
                isActive ? "bg-indigo-50 text-indigo-700" : "text-slate-500"
              }`
            }
          >
            <LayoutDashboard size={15} />
            Overview
          </NavLink>

          {["Projects", "Tasks", "Members", "Settings"].map((item) => (
            <span
              key={item}
              className="shrink-0 rounded-lg px-3 py-2 text-xs font-medium text-slate-400"
            >
              {item}
            </span>
          ))}
        </div>

        {/* Page content */}
        <main className="flex-1 p-5 sm:p-8 lg:p-10">
          <div className="mx-auto max-w-[1500px]">{children}</div>
        </main>
      </div>
    </div>
  );
}

export default WorkspaceLayout;