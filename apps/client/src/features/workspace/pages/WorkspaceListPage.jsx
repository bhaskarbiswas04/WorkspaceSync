
import { useEffect } from "react";
import { FolderKanban, Plus, Users } from "lucide-react";

import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../hooks/useAppSelector";

import { fetchMyWorkspaces } from "../workspaceSlice";

function WorkspaceListPage() {
  const dispatch = useAppDispatch();

  const { workspaces, isLoading, error } = useAppSelector(
    (state) => state.workspace
  );

  useEffect(() => {
    dispatch(fetchMyWorkspaces());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10 sm:px-10">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-sm font-medium text-indigo-600">
              WORKSPACE MANAGEMENT
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Your Workspaces
            </h1>

            <p className="mt-2 text-slate-500">
              Manage your teams and organize your work in one place.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              // We'll connect workspace creation next.
            }}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-medium text-white shadow-sm transition hover:bg-indigo-700"
          >
            <Plus size={19} />
            Create Workspace
          </button>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center py-20">
            <div className="h-9 w-9 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
          </div>
        )}

        {/* Error */}
        {!isLoading && error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-5">
            <p className="font-medium text-red-700">{error}</p>

            <button
              onClick={() => dispatch(fetchMyWorkspaces())}
              className="mt-3 text-sm font-semibold text-red-700 underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && workspaces.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <FolderKanban size={30} />
            </div>

            <h2 className="mt-6 text-xl font-semibold text-slate-900">
              No workspaces yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Create your first workspace to start organizing projects,
              managing tasks, and collaborating with your team.
            </p>

            <button
              type="button"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-medium text-white hover:bg-indigo-700"
              onClick={() => {
                // We'll connect workspace creation next.
              }}
            >
              <Plus size={18} />
              Create your first workspace
            </button>
          </div>
        )}

        {/* Workspace cards */}
        {!isLoading && !error && workspaces.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {workspaces.map((item) => {
              const workspace = item.workspace;

              return (
                <div
                  key={workspace._id}
                  className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                      <FolderKanban size={23} />
                    </div>

                    <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold capitalize text-indigo-700">
                      {item.role}
                    </span>
                  </div>

                  <h2 className="mt-5 truncate text-lg font-semibold text-slate-900">
                    {workspace.name}
                  </h2>

                  <p className="mt-2 min-h-10 text-sm leading-5 text-slate-500">
                    {workspace.description || "No description provided."}
                  </p>

                  <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Users size={16} />
                      <span className="capitalize">{item.role}</span>
                    </div>

                    <button
                      type="button"
                      className="text-sm font-semibold text-indigo-600 transition group-hover:text-indigo-700"
                      onClick={() => {
                        // Workspace selection will be implemented next.
                      }}
                    >
                      Open Workspace →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default WorkspaceListPage;