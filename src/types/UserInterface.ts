export interface UserResponse {
  Id: string;
  FirstName: string;
  LastName: string;
  Address: string;
  EmailAddress: string;
  Phonenumber: string;
  Created: string;
  Modified: string | null;
}
export interface UserDetailInterface {
  Id: string;
  // Name: string;
  FirstName: string;
  LastName: string;
  Address: string;
  EmailAddress: string;
  PhoneNumber: string;
  Created: string;
  Modified: null;
}

export interface UserGetInterface {
  Id: string;
  FirstName: string;
  LastName: string;
  Address: string;
  EmailAddress: string;
  PhoneNumber: string;
  StaffNumber: string;
  ClientName: string;
  RoleName: string;
  CompanyName: string;
  Created: string;
  Modified: null;
}

export interface UserUpdateInterface {
  Id: string;
  FirstName: string;
  LastName: string;
  Address: string;
  EmailAddress: string;
  PhoneNumber: string;
  StaffNumber: string;
  ClientName: string;
  RoleName: string;
  CompanyName: string;
}
export interface UserResponseInterface {
  id: string;
}

export interface UserPasswordInterface {
  Id: string;
  CurrentPassword: string;
  ChangePassword: string;
}

export interface DeleteUserInterface {
  Id: string;
  AuthKey: string;
}
export interface AddOrUpdateUserPayloadInterface {
  Id?: string;
  FirstName?: string;
  LastName?: string;
  Address?: string;
  EmailAddress?: string;
  PhoneNumber?: string;
  ClientName?: string;
  RoleName?: string;
  Password?: string;
  RePassword?: string;
}

export interface AddOrUpdateUserResponseInterface {
  id: string;
}
