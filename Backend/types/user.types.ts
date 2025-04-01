export interface UserModelAttributes {
  id?: number;
  email: string;
  password: string;
  role: string;
}

export interface SignUpData {
  email: string;
  password: string;
  role: string;
}

export interface LoginData {
  email: string;
  password: string;
}


