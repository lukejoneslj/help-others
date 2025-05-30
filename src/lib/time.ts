export function formatTimeAgo(dateString: string): string {
  // Handle both SQLite format (YYYY-MM-DD HH:MM:SS) and ISO format
  let date: Date;
  
  if (dateString.includes('T')) {
    // ISO format (e.g., "2025-05-30T19:20:54.123Z")
    date = new Date(dateString);
  } else {
    // SQLite format (e.g., "2025-05-30 19:20:54") - add 'Z' to treat as UTC
    date = new Date(dateString + 'Z');
  }
  
  // Fallback: if date is invalid, try parsing as-is
  if (isNaN(date.getTime())) {
    date = new Date(dateString);
  }
  
  // If still invalid, return a fallback
  if (isNaN(date.getTime())) {
    return 'unknown time';
  }
  
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} week${diffInWeeks === 1 ? '' : 's'} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths === 1 ? '' : 's'} ago`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} year${diffInYears === 1 ? '' : 's'} ago`;
} 