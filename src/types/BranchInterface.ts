export interface BranchInterface {
  Id: string;
  Name: string;
  Address: string;
  EmailAddress: string;
  IsEntryPoint: boolean;
  PhoneNumber: string;
  Companyguid: string;
  Created: string;
  Modified: string;
}
export interface DeleteBranchDetailInterface {
  Id: string;
  AuthKey: string;
}
export interface BranchRequestInterface {
  Id?: string;
  Name: string;
  Address?: string | null;
  Emailaddress: string;
  Phonenumber?: string | null;
  Companyguid: string;
}
export interface BranchDetailInterface {
  Id: string;
  Name: string;
  Address: string;
  Emailaddress: string;
  Phonenumber: string;
  Companyguid: string;
  Created: string;
  Modified: string;
  BranchId: string;
  BranchName: string;
}
export interface BranchGetDetailInterface {
  Id: string;
  Name: string;
  Address: string;
  EmailAddress: string;
  PhoneNumber: string;
  IsEntryPoint: boolean;
  Created: string;
  Modified: string;
}

export interface AddOrUpdateBranchPayloadInterface {
  Id: string;
  Name: string;
  Address: string;
  EmailAddress: string;
  PhoneNumber: string;
  IsEntryPoint?: boolean;
}

export interface AddOrUpdateBranchResponseInterface {
  id: string;
}
