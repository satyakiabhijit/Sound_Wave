// Format duration from seconds to mm:ss
export function formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Format duration for display (e.g., "3 min 45 sec")
export function formatDurationLong(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    if (mins === 0) return `${secs} sec`;
    if (secs === 0) return `${mins} min`;
    return `${mins} min ${secs} sec`;
}

// Get greeting based on time of day
export function getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
}

// Shuffle array
export function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Truncate text
export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
}

// Generate random gradient
export function getRandomGradient(): string {
    const gradients = [
        'from-purple-700 to-blue-800',
        'from-pink-600 to-purple-700',
        'from-blue-600 to-teal-500',
        'from-green-600 to-blue-600',
        'from-orange-500 to-red-600',
        'from-indigo-600 to-purple-700',
        'from-rose-500 to-pink-600',
        'from-amber-500 to-orange-600',
    ];
    return gradients[Math.floor(Math.random() * gradients.length)];
}

// Class name utility
export function cn(...classes: (string | boolean | undefined | null)[]): string {
    return classes.filter(Boolean).join(' ');
}
