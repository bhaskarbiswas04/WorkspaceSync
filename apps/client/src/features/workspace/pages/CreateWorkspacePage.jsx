import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, FolderKanban, Loader2 } from "lucide-react";

import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../hooks/useAppSelector";

import { createWorkspace, clearWorkspaceError } from "../workspaceSlice";

function CreateWorkspacePage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { isCreating, error } = useAppSelector((state) => state.workspace);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [validationError, setValidationError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setValidationError("");

    if (error) {
      dispatch(clearWorkspaceError());
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const name = formData.name.trim();
    const description = formData.description.trim();

    if (name.length < 2 || name.length > 100) {
      setValidationError(
        "Workspace name must be between 2 and 100 characters.",
      );
      return;
    }

    if (description.length > 500) {
      setValidationError("Description cannot exceed 500 characters.");
      return;
    }

    const result = await dispatch(
      createWorkspace({
        name,
        description,
      }),
    );

    if (createWorkspace.fulfilled.match(result)) {
      navigate("/dashboard", { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10 sm:px-10">
      <div className="mx-auto max-w-3xl">
        <Link
          to="/dashboard"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-indigo-600"
        >
          <ArrowLeft size={17} />
          Back to Workspaces
        </Link>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
          <div className="mb-8">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <FolderKanban size={28} />
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Create a workspace
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Set up a dedicated space for your team, projects, and
              collaboration.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Workspace name <span className="text-red-500">*</span>
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Acme Product Team"
                maxLength={100}
                required
                disabled={isCreating}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:bg-slate-50"
              />

              <p className="mt-2 text-xs text-slate-400">2–100 characters</p>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="description"
                  className="text-sm font-semibold text-slate-700"
                >
                  Description
                </label>

                <span className="text-xs text-slate-400">
                  {formData.description.length}/500
                </span>
              </div>

              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="What is this workspace for?"
                rows={4}
                maxLength={500}
                disabled={isCreating}
                className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:bg-slate-50"
              />

              <p className="mt-2 text-xs text-slate-400">
                Optional, maximum 500 characters.
              </p>
            </div>

            {(validationError || error) && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {validationError || error}
              </div>
            )}

            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
              <Link
                to="/dashboard"
                className="rounded-xl border border-slate-200 px-5 py-3 text-center text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={isCreating}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isCreating ? (
                  <>
                    <Loader2 size={17} className="animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Workspace"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateWorkspacePage;