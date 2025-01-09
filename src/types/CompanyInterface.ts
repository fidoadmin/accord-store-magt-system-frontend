export interface CompanyInterface {
  Id: string;
  Name: string;
  Address: string;
  EmailAddress: string;
  PhoneNumber: string;
  PanNumber: string;
  Created: string;
  Modified: null;
  IsExternal: boolean;
  BranchName: string;
  ClientName: string;
  CompanyType: string;
}

export interface AddOrUpdateCompanyRequest {
  Name: string;
  Address: string;
  Emailaddress: string;
  Phonenumber: string;
}

// Delete Company Request
export interface DeleteCompanyRequest {
  id: string;
}
export interface DeleteCompanyInterface {
  Id: string;
  AuthKey: string;
}
export interface CompanyDetailInterface {
  Id: string;
  Name: string;
  Address: string;
  EmailAddress: string;
  PhoneNumber: string;
  PanNumber: string;
  Created: string;
  Modified: null;
  IsExternal: boolean;
  BranchName: string;
  ClientName: string;
  CompanyType: string;
  BranchId: string[];
  ClientId: string;
  CompanyTypeId: string[];
}

export interface CompanyTypeDetailInterface {
  Id: string;
  Name: string;
  Code: string;
  Created: string;
  Modified: null;
}

export interface AddOrUpdateCompanyPayloadInterface {
  Id: string | null;
  Name: string;
  Address: string;
  EmailAddress: string;
  PhoneNumber: string;
  PanNumber: string;
  BranchId: string[];
  ClientId: string;
  CompanyTypeId: string[];
}

export interface AddOrCompanyResponseInterface {
  id: string;
}
