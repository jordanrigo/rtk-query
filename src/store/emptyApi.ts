import {
  createApi,
  FetchArgs,
  fetchBaseQuery,
  retry,
} from "@reduxjs/toolkit/query/react";
import { RootState } from "./store";

import { Mutex } from "async-mutex";

const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
  baseUrl: "https://petstore3.swagger.io/api/v3",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const staggeredBaseQueryWithBailOut = retry(
  async (args: string | FetchArgs, api, extraOptions) => {
    await mutex.waitForUnlock();
    let result = await baseQuery(args, api, extraOptions);

    // bail out of re-tries immediately if unauthorized,
    // because we know successive re-retries would be redundant
    if (result.error && result.error.status === 401) {
      if (!mutex.isLocked()) {
        const release = await mutex.acquire();
        try {
          const refreshResult = await baseQuery(
            "/refreshToken",
            api,
            extraOptions
          );
          if (refreshResult.data) {
            // api.dispatch(setCredentials(refreshResult.data ));
            // retry the initial query
            result = await baseQuery(args, api, extraOptions);
          } else {
            // LOGOUT
          }
        } finally {
          // release must be called once the mutex should be released again.
          release();
          retry.fail(result.error);
        }
      } else {
        // wait until the mutex is available without locking it
        await mutex.waitForUnlock();
        result = await baseQuery(args, api, extraOptions);
      }
    }

    return result;
  },
  {
    maxRetries: 5,
  }
);

// initialize an empty api service that we'll inject endpoints into later as needed
export const emptySplitApi = createApi({
  reducerPath: "emptySplitApi",
  baseQuery: staggeredBaseQueryWithBailOut,
  endpoints: () => ({}),
});
