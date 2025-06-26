export interface LoginModel {
    email: string;
    password: string;
}

export interface RegisterModel {
    name: string;
    lastname: string;
    email: string;
    password: string;
    phone: number;
    image?: string;
}