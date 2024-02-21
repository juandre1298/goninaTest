import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000" }),
  endpoints: (builder) => ({
    getOrder: builder.query({
      query: (orderId) => {
        console.log({ orderId });
        return `orders/${orderId}`;
      },
      providesTags: ["Orders"],
      transformResponse: (response, queryParams) => {
        return {
          order: {
            id: response.id,
            status: "PAID",
            amount: 10.32,
            currency: "EUR",
          },
        };
      },
    }),
    cancelOrder: builder.mutation({
      query: (orderId) => ({
        url: `/orders/${orderId}`,
        method: "DELETE",
      }),
    }),
    createOrder: builder.mutation({
      query: (newOrder) => ({
        url: `/orders`,
        method: "POST",
        body: newOrder,
      }),
    }),
  }),
});

export const {
  useGetOrderQuery,
  useCancelOrderMutation,
  useCreateOrderMutation,
} = apiSlice;
