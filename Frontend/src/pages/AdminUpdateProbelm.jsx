// src/pages/UpdateProblem.jsx
import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axiosClient from "../utils/axiosClient";
import { useNavigate } from "react-router";

const problemSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  difficulty: z.enum(["easy", "medium", "hard"]),
  tags: z
    .array(z.enum(["array", "linkedlist", "dp", "graph"]))
    .min(1, "At least one tag is required"),
  visibleTestCases: z
    .array(
      z.object({
        input: z.string().min(1, "Input must be given"),
        output: z.string().min(1, "Output is required"),
        explanation: z.string().min(1, "Explanation required"),
      })
    )
    .min(1, "At least 1 test case required"),
  hiddenTestCases: z.array(
    z.object({
      input: z.string().min(1, "Input must be given"),
      output: z.string().min(1, "Output is required"),
    })
  ),
  startCode: z
    .array(
      z.object({
        language: z.enum(["c++", "java", "javascript"]),
        boilerplate: z.string().min(1, "Boilerplate required"),
      })
    )
    .length(3, "All three starter codes required"),
  referenceSolution: z
    .array(
      z.object({
        language: z.enum(["c++", "java", "javascript"]),
        completeCode: z.string().min(1, "Complete code is required"),
      })
    )
    .length(3, "All three reference solutions required"),
});

const defaultValues = {
  title: "",
  description: "",
  difficulty: "easy",
  tags: ["array"],
  visibleTestCases: [
    {
      input: "",
      output: "",
      explanation: "",
    },
  ],
  hiddenTestCases: [],
  startCode: [
    { language: "c++", boilerplate: "" },
    { language: "java", boilerplate: "" },
    { language: "javascript", boilerplate: "" },
  ],
  referenceSolution: [
    { language: "c++", completeCode: "" },
    { language: "java", completeCode: "" },
    { language: "javascript", completeCode: "" },
  ],
};

function UpdateProblem() {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [selectedProblemId, setSelectedProblemId] = useState("");

  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues,
  });

  // field arrays
  const {
    fields: visibleFields,
    append: appendVisible,
    remove: removeVisible,
  } = useFieldArray({
    control,
    name: "visibleTestCases",
  });

  const {
    fields: hiddenFields,
    append: appendHidden,
    remove: removeHidden,
  } = useFieldArray({
    control,
    name: "hiddenTestCases",
  });

  // fetch problems list
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        console.log("Hello")
        const { data } = await axiosClient.get("/problem/getAllProblem");
        console.log("Hello world")
        setProblems(data);
      } catch (err) {
        console.error("Error fetching problems:", err);
      }
    };
    fetchProblems();
  }, []);

  // ensure default tag
  useEffect(() => {
    setValue("tags", ["array"]);
  }, [setValue]);

  const loadProblem = async (id) => {
    if (!id) {
      reset(defaultValues);
      setValue("tags", ["array"]);
      return;
    }

    try {
      console.log("Yo");
      const { data } = await axiosClient.get(`/problem/ProblemById/${id}`);
      const p = data;

      reset({
        title: p.title || "",
        description: p.description || "",
        difficulty: p.difficulty || "easy",
        tags: p.tags && p.tags.length ? p.tags : ["array"],
        visibleTestCases:
          p.visibleTestCases && p.visibleTestCases.length
            ? p.visibleTestCases
            : [
                {
                  input: "",
                  output: "",
                  explanation: "",
                },
              ],
        hiddenTestCases: p.hiddenTestCases || [],
        startCode:
          p.startCode && p.startCode.length
            ? p.startCode
            : defaultValues.startCode,
        referenceSolution:
          p.referenceSolution && p.referenceSolution.length
            ? p.referenceSolution
            : defaultValues.referenceSolution,
      });
    } catch (err) {
      console.error("Error loading problem:", err);
      alert(
        `Error loading problem: ${
          err.response?.data?.message ? err.response.data.message : err.message
        }`
      );
    }
  };

  const handleSelectChange = (e) => {
    const id = e.target.value;
    setSelectedProblemId(id);
    loadProblem(id);
  };

  const onSubmit = async (data) => {
    if (!selectedProblemId) {
      alert("Please select a problem to update.");
      return;
    }

    try {
      console.log("Updating problem:", selectedProblemId, data);
      const res = await axiosClient.put(
        `/problem/update/${selectedProblemId}`,
        data
      );
      console.log("Update response:", res.data);
      alert("Problem updated successfully");
      navigate("/admin");
    } catch (error) {
      console.error("Update problem error:", error.response || error);
      alert(
        `Error: ${
          error.response?.data?.message
            ? error.response.data.message
            : error.message
        }`
      );
    }
  };

  return (
    <div className="min-h-screen bg-base-200 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-base-content">
              Update Problem
            </h1>
            <p className="text-sm text-base-content/60 mt-1">
              Select a problem and modify its details.
            </p>
          </div>
          <button
            className="btn btn-ghost btn-sm"
            type="button"
            onClick={() => navigate("/admin")}
          >
            Back to Admin Home
          </button>
        </div>

        {/* Select problem */}
        <div className="card bg-base-100 shadow-md mb-6">
          <div className="card-body">
            <label className="label">
              <span className="label-text font-medium">
                Select problem to update
              </span>
            </label>
            <select
              className="select select-bordered w-full"
              value={selectedProblemId}
              onChange={handleSelectChange}
            >
              <option value="">-- Select problem --</option>
              {problems.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Form */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title mb-2">Edit Problem</h2>
            <p className="text-sm text-base-content/70 mb-4">
              Update fields and save your changes.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Title</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    {...register("title")}
                  />
                  {errors.title && (
                    <span className="text-error text-sm mt-1">
                      {errors.title.message}
                    </span>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Difficulty</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    {...register("difficulty")}
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                  {errors.difficulty && (
                    <span className="text-error text-sm mt-1">
                      {errors.difficulty.message}
                    </span>
                  )}
                </div>

                <div className="form-control md:col-span-2 md:max-w-xs">
                  <label className="label">
                    <span className="label-text font-medium">Primary Tag</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    onChange={(e) => setValue("tags", [e.target.value])}
                    value={(Array.isArray && undefined) || undefined}
                  >
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Description</span>
                </label>
                <textarea
                  className="textarea textarea-bordered w-full h-32"
                  {...register("description")}
                />
                {errors.description && (
                  <span className="text-error text-sm mt-1">
                    {errors.description.message}
                  </span>
                )}
              </div>

              {/* Visible Test Cases */}
              <div className="border-t border-base-300 pt-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-base-content">
                    Visible Test Cases
                  </h3>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() =>
                      appendVisible({
                        input: "",
                        output: "",
                        explanation: "",
                      })
                    }
                  >
                    + Add Visible Test Case
                  </button>
                </div>

                <div className="space-y-4">
                  {visibleFields.map((field, index) => (
                    <div
                      key={field.id}
                      className="rounded-xl border border-base-300 p-4 bg-base-200/40"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">
                          Test Case #{index + 1}
                        </span>
                        {visibleFields.length > 1 && (
                          <button
                            type="button"
                            className="btn btn-ghost btn-xs text-error"
                            onClick={() => removeVisible(index)}
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text text-xs font-semibold">
                              Input
                            </span>
                          </label>
                          <textarea
                            className="textarea textarea-bordered textarea-sm w-full"
                            {...register(`visibleTestCases.${index}.input`)}
                          />
                        </div>

                        <div className="form-control">
                          <label className="label">
                            <span className="label-text text-xs font-semibold">
                              Output
                            </span>
                          </label>
                          <textarea
                            className="textarea textarea-bordered textarea-sm w-full"
                            {...register(`visibleTestCases.${index}.output`)}
                          />
                        </div>

                        <div className="form-control">
                          <label className="label">
                            <span className="label-text text-xs font-semibold">
                              Explanation
                            </span>
                          </label>
                          <textarea
                            className="textarea textarea-bordered textarea-sm w-full"
                            {...register(
                              `visibleTestCases.${index}.explanation`
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hidden Test Cases */}
              <div className="border-t border-base-300 pt-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-base-content">
                    Hidden Test Cases
                  </h3>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => appendHidden({ input: "", output: "" })}
                  >
                    + Add Hidden Test Case
                  </button>
                </div>

                <div className="space-y-4">
                  {hiddenFields.map((field, index) => (
                    <div
                      key={field.id}
                      className="rounded-xl border border-base-300 p-4 bg-base-200/40"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">
                          Hidden Test Case #{index + 1}
                        </span>
                        <button
                          type="button"
                          className="btn btn-ghost btn-xs text-error"
                          onClick={() => removeHidden(index)}
                        >
                          Remove
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text text-xs font-semibold">
                              Input
                            </span>
                          </label>
                          <textarea
                            className="textarea textarea-bordered textarea-sm w-full"
                            {...register(`hiddenTestCases.${index}.input`)}
                          />
                        </div>

                        <div className="form-control">
                          <label className="label">
                            <span className="label-text text-xs font-semibold">
                              Output
                            </span>
                          </label>
                          <textarea
                            className="textarea textarea-bordered textarea-sm w-full"
                            {...register(`hiddenTestCases.${index}.output`)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Starter Code */}
              <div className="border-t border-base-300 pt-4">
                <h3 className="font-semibold text-base-content mb-2">
                  Starter Code
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {["c++", "java", "javascript"].map((lang, idx) => (
                    <div
                      key={lang}
                      className="form-control bg-base-200/40 rounded-xl p-3 border border-base-300"
                    >
                      <div className="mb-1">
                        <span className="text-sm font-semibold capitalize">
                          {lang}
                        </span>
                      </div>

                      <textarea
                        className="textarea textarea-bordered textarea-sm w-full h-40"
                        {...register(`startCode.${idx}.boilerplate`)}
                      />

                      <input
                        type="hidden"
                        value={lang}
                        {...register(`startCode.${idx}.language`)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Reference Solutions */}
              <div className="border-t border-base-300 pt-4">
                <h3 className="font-semibold text-base-content mb-2">
                  Reference Solutions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {["c++", "java", "javascript"].map((lang, idx) => (
                    <div
                      key={lang}
                      className="form-control bg-base-200/40 rounded-xl p-3 border border-base-300"
                    >
                      <div className="mb-1">
                        <span className="text-sm font-semibold capitalize">
                          {lang}
                        </span>
                      </div>

                      <textarea
                        className="textarea textarea-bordered textarea-sm w-full h-40"
                        {...register(
                          `referenceSolution.${idx}.completeCode`
                        )}
                      />

                      <input
                        type="hidden"
                        value={lang}
                        {...register(
                          `referenceSolution.${idx}.language`
                        )}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <div className="card-actions justify-end pt-2">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => navigate("/admin")}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Updating..." : "Update Problem"}
                </button>
              </div>
            </form>
          </div>
        </div>

        <p className="mt-4 text-xs text-base-content/60 text-center">
          Admin tools powered by React, react-hook-form, zod, Tailwind CSS, and
          daisyUI.
        </p>
      </div>
    </div>
  );
}

export default UpdateProblem;