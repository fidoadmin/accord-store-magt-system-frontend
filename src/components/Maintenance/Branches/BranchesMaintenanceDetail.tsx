// import { getCookie } from "cookies-next";
// import { useBranchDetails } from "@/app/hooks/branch/useBranchDetail";
// import React, { useState } from "react";
// import BranchesMaintenanceEdit from "./BranchesMaintenanceEdit"; // Assuming you have an edit component
// import { EditRounded, DeleteRounded } from "@mui/icons-material";
// import { toast } from "react-toastify";
// import { useDeleteBranchDetail } from "@/app/hooks/branch/useBranchDelete";
// import { DeleteBranchDetailInterface } from "@/types/BranchInterface";

// const BranchesMaintenanceDetail = ({
//   id,
//   clearSelected,
// }: {
//   id: string;
//   clearSelected: () => void;
// }) => {
//   const authKey = getCookie("authKey") as string;
//   const [editBranchData, setBranchEditData] = useState<boolean>(false);

//   // Call the hook to get the mutation result
//   const deleteMutation = useDeleteBranchDetail();

//   const {
//     data: branchDetail,
//     error,
//     isLoading,
//   } = useBranchDetails(authKey || "", id || "");

//   const handleDelete = async () => {
//     try {
//       // Create an object that matches the expected type
//       const deletePayload: DeleteBranchDetailInterface = {
//         Id: branchDetail?.Id as string,
//         AuthKey: authKey || "", // Ensure this matches your interface definition
//       };

//       await deleteMutation.mutateAsync(deletePayload);
//       toast.success(
//         `Successfully deleted ${branchDetail?.Name} (ID: ${branchDetail?.Id})`
//       );
//       clearSelected(); // Clear the selected item after deletion
//     } catch (error) {
//       console.error("Failed to delete branch:", error);
//       toast.error("Failed to delete branch. Please try again.");
//     }
//   };

//   if (isLoading) return <div>Loading...</div>; // Show loading state
//   if (error) return <div>Error loading branch details.</div>; // Show error state

//   return (
//     <div className="h-full w-full p-4 flex flex-col gap-4">
//       {!editBranchData ? (
//         <>
//           <div className="details text-center flex-1 flex flex-col gap-2">
//             <div className="bg-background rounded-xl p-2 h-full max-h-20 flex gap-2 items-center justify-center">
//               <p className="label w-full">Branch Name:</p>
//               <h2 className="w-full text-left font-bold">
//                 {branchDetail?.Name}
//               </h2>
//             </div>
//             <div className="bg-background rounded-xl p-2 h-full max-h-20 flex gap-2 items-center justify-center">
//               <div className="w-full space-y-1">
//                 <p className="label w-full">Address:</p>
//                 <p className="label w-full text-sm">Email Address:</p>
//               </div>
//               <div className="w-full space-y-1">
//                 <h1 className="w-full text-left font-bold">
//                   {branchDetail?.Address}
//                 </h1>
//                 <h1 className="w-full text-left text-sm">
//                   {branchDetail?.Emailaddress}
//                 </h1>
//               </div>
//             </div>
//             <div className="bg-background rounded-xl p-2 h-full max-h-20 flex gap-2 items-center justify-center">
//               <p className="label w-full">Phone Number:</p>
//               <h3 className="w-full text-left font-bold">
//                 {branchDetail?.Phonenumber}
//               </h3>
//             </div>
//           </div>

//           <div className="btnDiv flex justify-around">
//             <button
//               className="bg-success px-4 py-2 rounded-xl text-white hover:opacity-80 w-40 flex justify-center items-center gap-4"
//               onClick={() => {
//                 setBranchEditData(true);
//               }}
//             >
//               <EditRounded />
//               Edit
//             </button>
//             <button
//               className="bg-error px-4 py-2 rounded-xl text-white hover:opacity-80 w-40 flex justify-center items-center gap-4"
//               onClick={handleDelete}
//             >
//               <span>
//                 <DeleteRounded />
//               </span>
//               Delete
//             </button>
//           </div>
//         </>
//       ) : (
//         <BranchesMaintenanceEdit
//           Name={branchDetail!}
//           onSave={() => setBranchEditData(false)}
//         />
//       )}
//     </div>
//   );
// };

// export default BranchesMaintenanceDetail;

// // import { getCookie } from "cookies-next";
// // // import InventoryDescriptionMaintenanceEdit from "./InventoryDescriptionMaintenanceEdit";
// // import { DeleteRounded, EditRounded } from "@mui/icons-material";
// // import { useDeleteInventoryDescription } from "@/app/hooks/inventorydescriptions/useInventoryDescriptionDelete";
// // import { toast } from "react-toastify";
// // import { useBranchDetails } from "@/app/hooks/branch/useBranchDetail";
// // import InventoryDescriptionMaintenanceEdit from "../InventoryDescriptions/InventoryDescriptionMaintenanceEdit";
// // import React, { useState } from "react";

// // const BranchesMaintenanceContainer = ({
// //   id,
// //   clearSelected,
// // }: {
// //   id: string;
// //   clearSelected: () => void;
// // }) => {
// //   const authKey = getCookie("authKey") as string;
// //   const deleteMutation = useDeleteInventoryDescription();
// //   const [editInvDesc, setEditInvDesc] = useState<boolean>(false);
// //   const { data: branchDetail } = useBranchDetails(authKey || "", id || "");
// //   const handleDelete = async () => {
// //     try {
// //       await deleteMutation.mutateAsync({
// //         Id: branchDetail?.Id as string,
// //         AuthKey: authKey,
// //       });
// //       toast.error(
// //         `Successfully deleted ${branchDetail?.Id} NAME: ${branchDetail?.Name}`
// //       );
// //       clearSelected();
// //     } catch (error) {
// //       console.error("Failed to delete branch:", error);
// //       toast.error("Failed to delete branch. Please try again.");
// //     }
// //   };
// //   return (
// //     <>
// //     <div className="h-full w-full p-4 flex flex-col gap-4">
// //       {/* {!editInvDesc ? ( */}

// //           <div className="details text-center flex-1 flex flex-col gap-2">
// //             <div className="bg-background rounded-xl p-2 h-full max-h-20 flex gap-2 items-center justify-center">
// //               <p className="label w-full ">Name:</p>
// //               <h2 className="w-full text-left font-bold">
// //                 {branchDetail?.Name}
// //               </h2>
// //             </div>
// //             <div className="bg-background rounded-xl p-2 h-full max-h-20 flex gap-2 items-center justify-center">
// //               <div className="w-full space-y-1">
// //                 <p className="label w-full">Inventory Description:</p>
// //                 <p className="label w-full text-sm">Short Name:</p>
// //               </div>
// //               <div className="w-full space-y-1">
// //                 <h1 className="w-full text-left font-bold">
// //                   {branchDetail?.Address}
// //                 </h1>
// //                 <h1 className="w-full text-left text-sm">
// //                   {" "}
// //                   {branchDetail?.Emailaddress}
// //                 </h1>
// //               </div>
// //             </div>
// //             <div className="bg-background rounded-xl p-2 h-full max-h-20 flex gap-2 items-center justify-center">
// //               <p className="label w-full ">Category:</p>
// //               <h3 className="w-full text-left font-bold">
// //                 {branchDetail?.Phonenumber}
// //               </h3>
// //             </div>
// //             {/* {!!inventoryDescriptionDetails?.ModelName && (
// //               <div className="bg-background rounded-xl p-2 h-full max-h-20 flex gap-2 items-center justify-center">
// //                 <p className="label w-full ">Model Name:</p>
// //                 <p className="w-full text-left font-bold">
// //                   {inventoryDescriptionDetails?.ModelName}
// //                 </p>
// //               </div>
// //             )}
// //             {!!inventoryDescriptionDetails?.PartNumber && (
// //               <div className="bg-background rounded-xl p-2 h-full max-h-20 flex gap-2 items-center justify-center">
// //                 <p className="label w-full ">Part Number:</p>
// //                 <p className="w-full text-left font-bold">
// //                   {inventoryDescriptionDetails?.PartNumber}
// //                 </p>
// //               </div> */}
// //             {/* )} */}

// //           {/* </div>

// //         //   <div className="btnDiv flex justify-around"> */}
// //             {/* <button
// //               className="bg-success px-4 py-2 rounded-xl text-white hover:opacity-80 w-40 flex justify-center items-center gap-4"
// //               onClick={() => {
// //                 setEditInvDesc(true);
// //               }}
// //             >
// //               <EditRounded />
// //               Edit
// //             </button>
// //             <button
// //               className="bg-error px-4 py-2 rounded-xl text-white hover:opacity-80 w-40 flex justify-center items-center gap-4"
// //               onClick={handleDelete}
// //             >
// //               <span>
// //                 <DeleteRounded />
// //               </span>
// //               Delete
// //             </button>
// //           </div>
// //         </>
// //       ) : (
// //         <InventoryDescriptionMaintenanceEdit
// //           description={branchDetail!}
// //           onSave={() => setEditInvDesc(false)}
// //         />
// //       )}
// //     </div>
// //   );
// // }; */}
// // </>

// // </div>
// // _

// // export default BranchesMaintenanceContainer;
