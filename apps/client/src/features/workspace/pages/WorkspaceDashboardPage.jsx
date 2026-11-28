import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FolderKanban, CalendarDays, Users, ArrowUpRight } from "lucide-react";

import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../hooks/useAppSelector";

import { fetchWorkspaceById } from "../workspaceSlice";
import WorkspaceLayout from "../../../components/layout/WorkspaceLayout";

function WorkspaceDashboardPage() {
  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { selectedWorkspace, isFetchingSelected, selectedWorkspaceError } =
    useAppSelector((state) => state.workspace);

  useEffect(() => {
    dispatch(fetchWorkspaceById(workspaceId));
  }, [dispatch, workspaceId]);

  if (isFetchingSelected) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f7fb]">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  if (selectedWorkspaceError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f7fb] px-6">
        <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            Unable to open workspace
          </h2>

          <p className="mt-2 text-sm text-red-600">{selectedWorkspaceError}</p>

          <button
            onClick={() => navigate("/dashboard")}
            className="mt-6 rounded-xl bg-indigo-600 px-5 py-3 font-medium text-white hover:bg-indigo-700"
          >
            Back to Workspaces
          </button>
        </div>
      </div>
    );
  }

  if (!selectedWorkspace) return null;

  return (
    <WorkspaceLayout workspace={selectedWorkspace}>
      {/* Welcome section */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-indigo-600">
            WORKSPACE OVERVIEW
          </p>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Welcome to {selectedWorkspace.name}
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Here's what's happening in your workspace today.
          </p>
        </div>

        <button
          onClick={() => navigate("/dashboard")}
          className="self-start rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-indigo-200 hover:text-indigo-600"
        >
          Switch workspace
        </button>
      </div>

      {/* Statistics cards - placeholders until APIs are integrated */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Total Projects",
            value: "—",
            icon: FolderKanban,
            color: "bg-indigo-50 text-indigo-600",
          },
          {
            label: "Active Tasks",
            value: "—",
            icon: CalendarDays,
            color: "bg-blue-50 text-blue-600",
          },
          {
            label: "Team Members",
            value: "—",
            icon: Users,
            color: "bg-violet-50 text-violet-600",
          },
          {
            label: "Completed Tasks",
            value: "—",
            icon: ArrowUpRight,
            color: "bg-emerald-50 text-emerald-600",
          },
        ].map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.color}`}
                >
                  <Icon size={21} />
                </div>

                <span className="text-xs text-slate-400">Workspace</span>
              </div>

              <p className="mt-5 text-2xl font-bold text-slate-900">
                {stat.value}
              </p>

              <p className="mt-1 text-sm text-slate-500">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Main dashboard content */}
      <div className="mt-7 grid gap-6 xl:grid-cols-3">
        {/* Projects section */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Projects</h2>
              <p className="mt-1 text-sm text-slate-500">
                Manage and track your workspace projects.
              </p>
            </div>

            <FolderKanban className="text-indigo-500" size={21} />
          </div>

          <div className="mt-8 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-5 py-12 text-center">
            <FolderKanban className="mx-auto text-slate-300" size={32} />

            <h3 className="mt-4 font-semibold text-slate-800">
              Your projects will appear here
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Start by creating your first project.
            </p>

            <button
              onClick={() => navigate(`/workspaces/${workspaceId}/projects`)}
              className="mt-5 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Explore Projects
            </button>
          </div>
        </div>

        {/* Workspace information */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">
            Workspace Details
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Basic information about this workspace.
          </p>

          <div className="mt-7 space-y-5">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                Workspace name
              </p>
              <p className="mt-1 font-semibold text-slate-800">
                {selectedWorkspace.name}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                Description
              </p>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                {selectedWorkspace.description || "No description provided."}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                Created on
              </p>
              <p className="mt-1 text-sm font-medium text-slate-700">
                {new Date(selectedWorkspace.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </WorkspaceLayout>
  );
}

export default WorkspaceDashboardPage;