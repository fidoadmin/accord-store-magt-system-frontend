export interface LoginRequest {
  EmailAddress: string;
  Password: string;
  Source: string;
}
export interface LoginResponse {
  UserId: string;
  AuthKey: string;
  FirstName: string;
  LastName: string;
  EmailAddress: string;
  RoleId: string | null;
  ClientName: string;
}

export interface PasswordChangeInterface {
  Emailaddress?: string;
}
export interface VerifyAndUpdatePassword {
  Emailaddress?: string;
}
