export interface UserModeleGet {
    id: number;
    name: string;
    lastname:string;
    email:string;
    phone: string;
    password: string;
    image?: string;
    created_at: string;
    updated_at: string;
    notification_token?:string;
}

export interface UserModelPost {
    name: string;
    lastname:string;
    email:string;
    phone: string;
    password: string;
    image?: string;
    notification_token?:string;
}
