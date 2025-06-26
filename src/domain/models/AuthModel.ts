export interface LoginModel {
    email: string;
    password: string;
}

export interface RegisterModel {
    name: string;
    lastname:string;
    email:string;
    phone: string;
    password: string;
    image?: string;
    notification_token?:string;
}