import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { markSessionExpired } from './authSlice';

const rawBaseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || 'https://codearena-backend-g0bt.onrender.com',
    credentials: 'include'
});

// A 401 from any API call while logged in means the session ended (the JWT lasts one hour).
// Plain-text error bodies are reported by RTK as PARSING_ERROR with the real status in originalStatus.
// The reducer ignores this when nobody is logged in, so visitors are never told "session expired".
const baseQuery = async (args, api, extraOptions) => {
    const result = await rawBaseQuery(args, api, extraOptions);
    const status = result.error?.originalStatus ?? result.error?.status;
    if (status === 401) api.dispatch(markSessionExpired());
    return result;
};

export const apiSlice=createApi({
    reducerPath:'api',
    baseQuery,
    tagTypes:['AllProblems','Profile','Submission'],
    endpoints:(builder)=>({
        getProblems:builder.query({
            query:(params={})=>({ url:'/problem/getAllProblem', params }),
            providesTags:['AllProblems']
        }),
        getSolvedProblems:builder.query({
            query:()=>'/problem/ProblemSolvedByUser',
            providesTags:['AllProblems']
        }),
        getProblemById:builder.query({
            query:(problemId)=>`/problem/ProblemById/${problemId}`,
            providesTags:(result,error,id)=>[{type:'AllProblems',id}],
        }),
        getProfile:builder.query({
            query:()=>({
                url:'/user/getProfile',
                method:'POST'
            }),
            providesTags:['Profile']
        }),
        runCode:builder.mutation({
            query:({problemId,code,language})=>({
                url:`/submission/run/${problemId}`,
                method:"POST",
                body:{code,language},
            }),
        }),
        submitCode:builder.mutation({
            // Enqueue the submission, then poll until the worker finishes judging it.
            async queryFn({problemId,code,language}, _api, _extra, baseQuery){
                const queued = await baseQuery({
                    url:`/submission/submit/${problemId}`,
                    method:'POST',
                    body:{code,language},
                });
                if (queued.error) return { error: queued.error };

                const { submissionId } = queued.data;
                const deadline = Date.now() + 90000; // give up after 90s
                let delay = 800;

                while (Date.now() < deadline) {
                    await new Promise((r) => setTimeout(r, delay));
                    delay = Math.min(delay * 1.3, 2500);

                    const res = await baseQuery(`/submission/status/${submissionId}`);
                    if (res.error) return { error: res.error };
                    if (res.data.status !== 'pending') return { data: res.data };
                }

                return {
                    error: {
                        status: 'TIMEOUT',
                        data: 'Judging is taking longer than expected. Check your submissions tab.',
                    },
                };
            },
            invalidatesTags:['AllProblems','Profile','Submission']
        }),
        submissionForProblemByUser:builder.query({
          query:(problemId)=>`/problem/submittedProblem/${problemId}`  ,
          providesTags:['Submission']
        })
    }),
});
export const {
  useGetProblemsQuery,
  useGetSolvedProblemsQuery,
  useGetProblemByIdQuery,
  useSubmissionForProblemByUserQuery,
  useGetProfileQuery,
  useRunCodeMutation,
  useSubmitCodeMutation,
} = apiSlice;