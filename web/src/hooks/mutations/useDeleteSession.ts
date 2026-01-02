import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { ApiClient } from '@/api/client'
import type { SessionsResponse } from '@/types/api'
import { queryKeys } from '@/lib/query-keys'

export function useDeleteSession(api: ApiClient | null) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (sessionId: string) => {
            if (!api) {
                throw new Error('API client not available')
            }
            await api.deleteSession(sessionId)
            return sessionId
        },
        onSuccess: async (sessionId) => {
            // 优化缓存策略：移除相关查询，避免重复请求
            queryClient.removeQueries({ queryKey: queryKeys.session(sessionId) })
            queryClient.removeQueries({ queryKey: queryKeys.messages(sessionId) })

            // 乐观更新会话列表
            queryClient.setQueryData<SessionsResponse>(queryKeys.sessions, (old) => {
                if (!old?.sessions) return old
                return {
                    ...old,
                    sessions: old.sessions.filter((s) => s.id !== sessionId)
                }
            })

            // 只需要一次 invalidate
            await queryClient.invalidateQueries({ queryKey: queryKeys.sessions })
        },
        onError: (error) => {
            console.error('Failed to delete session:', error)
            // 错误处理由 UI 层负责显示
        }
    })
}
