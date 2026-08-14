import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice=createApi({
    reducerPath:'api',
    baseQuery:fetchBaseQuery({
        baseUrl:'https://codearena-backend-g0bt.onrender.com',
        credentials:'include'
    }),
    tagTypes:['AllProblems','Profile','Submission'],
    endpoints:(builder)=>({
        getProblems:builder.query({
            query:()=>'/problem/getAllProblem',
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
            query:({problemId,code,language})=>({
               url:`/submission/submit/${problemId}` ,
               method:'POST',
               body:{code,language},
            }),
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