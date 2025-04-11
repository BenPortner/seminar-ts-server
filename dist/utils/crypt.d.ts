export declare function generateRandomPassword(length?: number, saltRounds?: number): string;
export declare function validate(venue: string, name: string, hash: string, secret: string, callback?: (error?: string) => void): boolean;
