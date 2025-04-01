interface Nurse {
  firstName: string;
  lastName: string;
  email: string;
}

export interface NurseType {
  employeeId: number;
  firstName: string;
  lastName: string;
  email: string;
  ward: {
    wardId: number;
    wardColor: string;
    wardName: string;
  };
}

export interface NurseCreateUpdatePayload extends Nurse {
  wardId: number;
}

export interface NurseInputFormData extends Nurse {
  wardName: string;
  wardColor: string;
}

export interface NurseColumnHeader extends NurseInputFormData {
  id: number;
}

export interface PaginationDetails {
  page: number;
  pageSize: number;
}

export interface UserDataType {
  id: number;
  email: string;
  role: string;
  token: string;
}

export interface UserContextType {
  user: UserDataType | null;
  setUser: (user: UserDataType | null) => void;
}
