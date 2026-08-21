import { api } from './api'
import type { UserData, UserUpdateRequest } from '../../types/user'
import type { ApiResponse } from '../../types/api'

export const userApi = api.injectEndpoints({
    endpoints: (builder) => ({

        getUser: builder.query<UserData, void>({
            query: () => '/user',
            transformResponse: (response: ApiResponse<UserData>) => response.data,
            providesTags: ['User'],
        }),

        updateUser: builder.mutation<void, UserUpdateRequest>({
            query: (body) => ({
                url: `/user`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: ['User'],
        }),
    }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
    useGetUserQuery,
    useUpdateUserMutation,
} = userApi