export interface InventoryDetail {
  InventoryDescription: string;
  ShortName: string;
  Quantity: number;
  Date: string;
  ExpirationDate: string;
}

export interface ReportInterface {
  Customer: string;                  
  InventoryDetails: InventoryDetail[];
}
