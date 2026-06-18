import { useEffect } from "react";
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

function AdminPanel() {
  const navigate = useNavigate();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
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
    },
  });

  useEffect(() => {
    setValue("tags", ["array"]);
  }, [setValue]);

  const {
    fields: testCaseFields,
    append: appendTestCase,
    remove: removeTestCase,
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

  const onSubmit = async (data) => {
    try {
      console.log("Creating problem with data:", data);
      const res = await axiosClient.post("/problem/create", data);
      console.log("Create response:", res.data);
      alert("Problem created successfully");
      navigate("/admin");
    } catch (error) {
      console.error("Create problem error:", error.response || error);
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
            <h1 className="text-3xl font-bold text-base-content">Admin Panel</h1>
            <p className="text-sm text-base-content/60 mt-1">
              Create a new coding problem for your platform.
            </p>
          </div>
          <button
            className="btn btn-ghost btn-sm"
            type="button"
            onClick={() => navigate("/")}
          >
            Back to Home
          </button>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title mb-2">Create Problem</h2>
            <p className="text-sm text-base-content/70 mb-4">
              Fill in the details below to add a new problem.
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
                    placeholder="Title of the problem"
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
                    defaultValue="array"
                    onChange={(e) => setValue("tags", [e.target.value])}
                  >
                    <option value="array">Array</option>
                    <option value="linkedlist">Linked List</option>
                    <option value="dp">DP</option>
                    <option value="graph">Graph</option>
                  </select>
                  {errors.tags && (
                    <span className="text-error text-sm mt-1">
                      {errors.tags.message}
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Description</span>
                </label>
                <textarea
                  className="textarea textarea-bordered w-full h-32"
                  placeholder="Describe the problem clearly, including constraints and input/output format."
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
                      appendTestCase({ input: "", output: "", explanation: "" })
                    }
                  >
                    + Add Test Case
                  </button>
                </div>

                {errors.visibleTestCases && (
                  <p className="text-error text-sm mb-2">
                    {errors.visibleTestCases.message}
                  </p>
                )}

                <div className="space-y-4">
                  {testCaseFields.map((field, index) => (
                    <div
                      key={field.id}
                      className="rounded-xl border border-base-300 p-4 bg-base-200/40"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">
                          Test Case #{index + 1}
                        </span>
                        {testCaseFields.length > 1 && (
                          <button
                            type="button"
                            className="btn btn-ghost btn-xs text-error"
                            onClick={() => removeTestCase(index)}
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
                            placeholder="5&#10;1 2 3 4 5"
                            {...register(`visibleTestCases.${index}.input`)}
                          />
                          {errors.visibleTestCases?.[index]?.input && (
                            <span className="text-error text-xs mt-1">
                              {errors.visibleTestCases[index]?.input?.message}
                            </span>
                          )}
                        </div>

                        <div className="form-control">
                          <label className="label">
                            <span className="label-text text-xs font-semibold">
                              Output
                            </span>
                          </label>
                          <textarea
                            className="textarea textarea-bordered textarea-sm w-full"
                            placeholder="15"
                            {...register(`visibleTestCases.${index}.output`)}
                          />
                          {errors.visibleTestCases?.[index]?.output && (
                            <span className="text-error text-xs mt-1">
                              {errors.visibleTestCases[index]?.output?.message}
                            </span>
                          )}
                        </div>

                        <div className="form-control">
                          <label className="label">
                            <span className="label-text text-xs font-semibold">
                              Explanation
                            </span>
                          </label>
                          <textarea
                            className="textarea textarea-bordered textarea-sm w-full"
                            placeholder="1 + 2 + 3 + 4 + 5 = 15"
                            {...register(
                              `visibleTestCases.${index}.explanation`
                            )}
                          />
                          {errors.visibleTestCases?.[index]?.explanation && (
                            <span className="text-error text-xs mt-1">
                              {
                                errors.visibleTestCases[index]?.explanation
                                  ?.message
                              }
                            </span>
                          )}
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
                            placeholder="Hidden input"
                            {...register(`hiddenTestCases.${index}.input`)}
                          />
                          {errors.hiddenTestCases?.[index]?.input && (
                            <span className="text-error text-xs mt-1">
                              {errors.hiddenTestCases[index]?.input?.message}
                            </span>
                          )}
                        </div>

                        <div className="form-control">
                          <label className="label">
                            <span className="label-text text-xs font-semibold">
                              Output
                            </span>
                          </label>
                          <textarea
                            className="textarea textarea-bordered textarea-sm w-full"
                            placeholder="Hidden output"
                            {...register(`hiddenTestCases.${index}.output`)}
                          />
                          {errors.hiddenTestCases?.[index]?.output && (
                            <span className="text-error text-xs mt-1">
                              {errors.hiddenTestCases[index]?.output?.message}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Start Code */}
              <div className="border-t border-base-300 pt-4">
                <h3 className="font-semibold text-base-content mb-2">
                  Starter Code
                </h3>
                <p className="text-xs text-base-content/60 mb-2">
                  Provide boilerplate code for each language.
                </p>

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
                        placeholder={`Starter code in ${lang}`}
                        {...register(`startCode.${idx}.boilerplate`)}
                      />

                      <input
                        type="hidden"
                        value={lang}
                        {...register(`startCode.${idx}.language`)}
                      />

                      {errors.startCode?.[idx]?.boilerplate && (
                        <span className="text-error text-xs mt-1">
                          {errors.startCode[idx]?.boilerplate?.message}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Reference Solutions */}
              <div className="border-t border-base-300 pt-4">
                <h3 className="font-semibold text-base-content mb-2">
                  Reference Solutions
                </h3>
                <p className="text-xs text-base-content/60 mb-2">
                  Provide correct solutions for each language.
                </p>

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
                        placeholder={`Reference solution in ${lang}`}
                        {...register(`referenceSolution.${idx}.completeCode`)}
                      />

                      <input
                        type="hidden"
                        value={lang}
                        {...register(`referenceSolution.${idx}.language`)}
                      />

                      {errors.referenceSolution?.[idx]?.completeCode && (
                        <span className="text-error text-xs mt-1">
                          {
                            errors.referenceSolution[idx]?.completeCode
                              ?.message
                          }
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <div className="card-actions justify-end pt-2">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => navigate("/")}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating..." : "Create Problem"}
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

export default AdminPanel;