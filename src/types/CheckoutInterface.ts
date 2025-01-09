import { BranchInterface } from "./BranchInterface";
import { CompanyInterface } from "./CompanyInterface";
import { InventoryDescriptionInterface } from "./InventoryInterface";

export interface CheckoutCompanyDetailsInterface {
  SaleChallanNumber: string | null;
  FocChallanNumber: string | null;
  CompanyFromPanNumber: string | null;
  CompanyToPanNumber: string | null;
  CompanyFrom: string;
  CompanyTo: string;
  CompanyFromAddress: string;
  CompanyToAddress: string;
  CompanyFromPhoneNumber: string;
  CompanyToPhoneNumber: string;
  CompanyFromId: string;
  CompanyToGUId: string;
}

export interface CheckoutInventoryDescriptionDetailInterface {
  Status: string;
  PartNumber: string;
  ModelName: string;
  Id: string;
  Description: string;
  ManufacturerName: string;
  Stock: number;
  ShortName: string;
  CategoryName: string;
  CategoryId: string;
  AvailableQty: number;
  OnHold: number;
  BranchName: string;
  CompanyName: string;
  CompanyId: string;
  BranchId: string;
}
// export interface CheckoutInventoryDescriptionDetailInterface {
//   DescriptionId: string;
//   Quantity: number;
//   Id: string;
//   Description: string;
//   ManufacturerName: string;
//   Stock: number;
//   ShortName: string;
//   CategoryName: string;
//   CategoryId: string;
//   AvailableQty: number;
//   OnHold: number;
//   BranchName: string;
//   CompanyName: string;
//   CompanyId: string;
//   BranchId:string;
// }

export interface CheckoutBranchDetailsInterface {
  SaleChallanNumber: string;
  BranchFrom: string;
  BranchTo: string;
  BranchFromAddress: string;
  BranchToAddress: string;
  BranchFromPhoneNumber: string;
  BranchToPhoneNumber: string;
  BranchFromId: string;
  BranchToGUId: string;
  ChallanNumber: string;
}

export interface SelectedInventoryDetailInterface {
  InventoryId: string;
  ExpiryDate: string;
  PartNumber: string;
  BatchNumber: string;
  ContainerType: string;
  PackSize: string;
  Quantity: number;
}

export interface CheckoutInventoryDescriptionInterface {
  Description: string;
  Quantity: string;
  ShortName: string;
  SelectedInventories: SelectedInventoryDetailInterface[];
}

export interface CheckoutDetailInterface {
  CheckoutNumber: string;
  CheckoutType: string;
  HasFoc: boolean;
  HasSale: boolean;
  DateCreated: string;
  NepaliDate: string;
  BranchDetails: CheckoutBranchDetailsInterface[];
  CompanyDetails: CheckoutCompanyDetailsInterface[];
  SelectedInventories: CheckoutInventoryDescriptionInterface[];
  PurchaseOrderNumber: string;
  Remarks?: string;
}

export interface CheckoutToAndForDetailInterface {
  CheckoutNumber: string;
  CheckoutType: string;
  BranchDetails: CheckoutBranchDetailsInterface[];
  UpdatedDate: string | null;
  StatusCode: string;
  CompanyDetails: CheckoutCompanyDetailsInterface[];
}
export interface BranchTransferDetailInterface {
  CheckoutNumber: string;
  CheckoutType: string;
  BranchDetails: CheckoutBranchDetailsInterface[];
  CompanyDetails: CheckoutCompanyDetailsInterface[];
  SelectedInventories: CheckoutInventoryDescriptionInterface[];
}

export interface ChallanPreviewPageProps {
  params: { checkoutinventories: string };
}

export interface CheckoutTabContentProps {
  activeTab: "checkout" | "branch";
}

export interface AddToCheckoutOverlayProps {
  onOverlayClose: () => void;
  inventory: InventoryDescriptionInterface;
  handleAddToCheckout: (
    Id: string,
    quantity: number,
    isOpenBox: boolean,
    hasFoc?: boolean,
    complementaryQuantity?: number | null,
    specificExpiryDate?: string,
    isPreCheckInRequest?: boolean
  ) => void;
  companyDetails?: { id?: string; name?: string };
  branchDetails?: { id?: string; name?: string };
}

export interface BranchCheckoutOverlayProps {
  onOverlayClose: () => void;
  checkoutList: CheckoutListInterface[];
  branchList: BranchInterface[] | undefined;
  onUpdateCheckoutList: (updatedList: CheckoutListInterface[]) => void;
}

export interface CheckoutOverlayProps {
  onOverlayClose: () => void;
  checkoutList: CheckoutListInterface[];
  transfereeList: CompanyInterface[] | undefined;
  onUpdateCheckoutList: (updatedList: CheckoutListInterface[]) => void;
}
export interface CheckoutListInterface {
  Id: string;
  CompanyId: string;
  BranchId: string;
  BranchName: string;
  Quantity?: number;
  AvailableQuantity?: number;
  ShortName: string;
  SpecificExpiryDate?: string;
  IsPrecheckInRequest?: boolean;
  IsFoc?: boolean;
  FocQuantity?: number | null;
}

export interface VerifyCheckoutRequestInterface {
  Id: string;
}
export interface VerifyCheckoutResponseInterface {
  Id: string;
}
export interface GenerateCheckoutListRequestInterface {
  DescriptionDetails?: CheckoutDescriptionDetailInterface[];
  CheckoutRelay?: CheckoutRelayInterface[];
  CheckoutBranchId?: string;
  CheckoutCompanyId?: string;
  BuyerId?: string;
  BranchId?: string;
  PoNumber?: string;
  Remarks?: string;
}

export interface CheckoutDescriptionDetailInterface {
  DescriptionId: string;
  Quantity?: number | null;
  SpecificExpiryDate?: string;
  HasFoc?: number;
  IsFoc?: boolean;
  IsPrecheckInRequest?: boolean;
}

export interface CheckoutRelayInterface {
  CompanyId: string;
}
export interface CheckoutsResponseInterface {
  CheckoutNumber: string;
  CheckoutStartedBy: string;
  CheckoutCompletedBy: string | null;
  Status: string;
  ReturnReason: string;
  CheckoutType: string;
  StatusCode: string;
  Created: string;
  Modified: string | null;
  Deleted: string | null;
}

export interface CheckoutDetailsInterface {
  Scanned: number;
  Required: number;
  AvailableQuantity: string;
  DataReferenceType: "expirationdate" | "createddate";
  ExpiryDate: string;
  Location: string;
  PackSize: string;
}

export interface CheckoutInventoryDetailInterface {
  Name: string;
  TotalRequired: string;
  TotalScanned: string;
  CheckoutTypeName: string;
  StatusCode: string;
  CheckoutNumber: string;
  ScannedBarcode: string[];
  Details: CheckoutDetailsInterface[];
}
