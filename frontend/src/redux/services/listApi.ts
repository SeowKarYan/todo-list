import { api } from './api'
import type { createListRequest, getListResponse, updateListRequest } from '../../types/list';
import type { ApiResponse } from '../../types/api';

export const listApi = api.injectEndpoints({
    endpoints: (builder) => ({
        addList: builder.mutation<void, createListRequest>({
            query: (body) => ({
                url: '/list',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['List'],
        }),

        getFullList: builder.query<getListResponse[], void>({
            query: () => '/list',
            transformResponse: (response: ApiResponse<getListResponse[]>) => response.data,
            providesTags: ['List'],
        }),

        getLists: builder.query<getListResponse, number>({
            query: (id) => `/list/${id}`,
            transformResponse: (response: ApiResponse<getListResponse>) => response.data,
            providesTags: ['List'],
        }),

        updateList: builder.mutation<void, updateListRequest>({
            query: ({ id, ...body }) => ({
                url: `/list/${id}`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: ['List'],
        }),

        deleteList: builder.mutation<void, number>({
            query: (id) => ({
                url: `/list/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['List'],
        }),
    }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
    useAddListMutation,
    useGetFullListQuery,
    useGetListsQuery,
    useUpdateListMutation,
    useDeleteListMutation,
} = listApi