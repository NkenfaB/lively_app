import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:3000',
  }),
  endpoints: (builder) => ({
    ping: builder.query<{ ok: boolean }, void>({
      query: () => '/ping',
    }),
  }),
});

export const { usePingQuery } = baseApi;

