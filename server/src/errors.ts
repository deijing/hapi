/**
 * Custom error types for HAPI server
 */

export class ActiveSessionError extends Error {
    constructor(message = 'Cannot delete active session. Please stop the session first.') {
        super(message)
        this.name = 'ActiveSessionError'
    }
}

export class SessionNotFoundError extends Error {
    constructor(message = 'Session not found') {
        super(message)
        this.name = 'SessionNotFoundError'
    }
}
