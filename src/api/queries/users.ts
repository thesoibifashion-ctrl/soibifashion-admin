// import { apiRequestWithParams } from "../query";

import { apiRequestWithParams } from "../query";

// export type FormType = "contact" | "get-involved" | "internship" | "donate" | "partnership";

// // api/queries/users.ts
// export function fetchSubmissions(params: {
//   formType?: FormType;
//   page?: number;
//   limit?: number;
//   search?: string;
//   status?: string;
// }) {
//   if (params.search) {
//     // searching — search everything, no pagination
//     return apiRequestWithParams("/submissions", {
//       formType: params.formType,
//       search: params.search,
//       status: params.status,
//     });
//   }

//   // no search — normal paginated browsing
//   return apiRequestWithParams("/submissions", {
//     formType: params.formType,
//     page: params.page ?? 1,
//     limit: params.limit ?? 5,
//     status: params.status,
//   });
// }

export function fetchSomething() {
    return apiRequestWithParams("/submissions", {});
  }