export const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB chunks
export const MAX_CHUNK_SIZE = 5 * 1024 * 1024; // 5MB maximum chunk size (AWS S3 requirement)
export const MIN_CHUNK_SIZE = 5 * 1024 * 1024; // 5MB minimum for multipart upload
export const MAX_RETRIES = 3; // Maximum number of retry attempts for failed chunks