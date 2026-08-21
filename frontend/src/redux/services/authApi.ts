import { api } from './api'
import type { loginRequest } from '../../types/auth'

export const authApi = api.injectEndpoints({
    endpoints: (builder) => ({
        register: builder.mutation<void, loginRequest>({
            query: (body) => ({
                url: '/auth/register',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['User'],
        }),

        login: builder.mutation<void, loginRequest>({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                body: credentials,
            }),
            invalidatesTags: ['User'],
        }),

        logout: builder.mutation<void, void>({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
            }),
        }),
    }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
    useRegisterMutation,
    useLoginMutation,
    useLogoutMutation,
} = authApi