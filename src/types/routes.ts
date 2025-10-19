export interface RouteLeg {
    mode: "walk" | "bus" | "tram" | "metro";
    line?: string;
    duration: number;
    distance?: string;
    from?: string;
    to?: string;
}

export interface Route {
    id: number;
    departureTime: string;
    arrivalTime: string;
    duration: number;
    legs: RouteLeg[];
    aiMatch: number;
    aiReason: string;
}
