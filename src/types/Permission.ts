export interface RolePermission {
  userole: string;
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
}

export interface PermissionItem {
  sn: number;
  url: string;
  roles: RolePermission[];
}

export interface AddOrUpdatePermissionPayloadInterface {
  userole: string;
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
}

export interface AddOrUpdatePermissionResponseInterface {
  id: string;
}
