export interface Post {
    id: string;
    title: string;
    topic: string;
    content: string;
    image_url: string;
    created_at: string;
    // Add any other attributes as needed
}

export interface User {
    id: string;
    email?: string;
    // other user attributes if necessary
}
