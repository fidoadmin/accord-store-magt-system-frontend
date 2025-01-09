// "use client";
// import { useState } from "react";
// import {
//   CloseRounded,
//   MenuRounded,
//   MoveToInboxRounded,
//   OutboxRounded,
// } from "@mui/icons-material";
// import CheckInOverview from "@/components/CheckInOverview";
// import CheckoutOverview from "@/components/CheckoutOverview";
// import DashboardCalendar from "@/components/DashboardCalendar";
// import DashboardTaskList from "@/components/DashboardTaskList";
// import Button from "@/components/Button";
// import ProductDetails from "@/components/ProductDetails";
// import { useFetchDashboard } from "../hooks/dashboard/useFetchDashboard";
// import { getCookie } from "cookies-next";
// import CategoryChart from "@/components/CategoryChart";

// export default function Dashboard() {
//   const [isDrawerOpen, setDrawerOpen] = useState(false);
//   const authKey = getCookie("authKey") as string;
//   const toggleDrawer = () => {
//     setDrawerOpen(!isDrawerOpen);
//   };

//   const {
//     data: dashboardData,
//     error: dashboardError,
//     isLoading: dashboardLoading,
//   } = useFetchDashboard();

//   return (
//     <div className="dashboard pb-6 flex flex-col lg:h-full">
//       {/* Dashboard content */}
//       <div className="quickLinks flex flex-col items-center justify-center">
//         <div className="quickContent w-full flex flex-col md:flex-row items-center justify-between">
//           <div className="title mb-2 md:m-0">Quick Links</div>
//             {/* <div className="btnDiv flex flex-col md:flex-row gap-2 justify-around md:justify-end font-bold text-center">
//               <Button
//                 href="/check-in"
//                 text="Check-in Inventory"
//                 Icon={MoveToInboxRounded}
//                 className="bg-success hover:opacity-90 text-white"
//               />
//               <Button
//                 href="/checkout"
//                 text="Checkout Inventory"
//                 Icon={OutboxRounded}
//                 className="bg-error hover:opacity-80 text-white"
//               />
//             </div> */}
//         </div>
//         <hr className="w-3/4 border-secondary my-3 rounded-full" />
//       </div>

//       <div className="dashboardContent flex-1 flex gap-4 lg:overflow-y-auto">
//         <div className="w-full flex-1 flex flex-col justify-around">
//           <div className="flex flex-col lg:flex-row w-full justify-between gap-4">
//             <CheckoutOverview
//               checkoutOverviewData={dashboardData?.CheckoutOverview!}
//             />
//             <CheckInOverview
//               checkInOverviewData={dashboardData?.CheckInOverview!}
//             />
//           </div>
//           <div className="flex flex-col lg:flex-row w-full justify-between items-center gap-4">
//             <ProductDetails
//               productDetailsData={dashboardData?.ProductDetails!}
//             />
//             <CategoryChart categoryChartData={dashboardData?.CategoryChart!} />
//           </div>
//         </div>

//         {/* Pull Tab Drawer */}
//         <div
//           className={`fixed top-0 right-0 h-full z-40 p-4 transition-transform transform duration-300 overflow-y-auto scrollbar-thin bg-surface w-72 ${
//             isDrawerOpen ? "translate-x-0" : "translate-x-full"
//           } xl:hidden`}
//         >
//           <button className="text-error" onClick={toggleDrawer}>
//             <CloseRounded />
//           </button>
//           <DashboardCalendar />
//           <DashboardTaskList />
//         </div>

//         {/* Component for larger screens */}
//         <div className="hidden xl:block p-4 h-full overflow-y-auto scrollbar-thin w-full max-w-72 rounded-xl bg-surface">
//           <DashboardCalendar />
//           <DashboardTaskList />
//         </div>

//         {/* Teardrop Pull Tab */}
//         <div
//           className={`fixed top-1/2 transform -translate-y-1/2 p-4 rounded-l-full shadow-lg text-white cursor-pointer z-50 transition-all duration-300 xl:hidden ${
//             isDrawerOpen ? "bg-error right-72" : "bg-success  right-0"
//           }`}
//           onClick={toggleDrawer}
//         >
//           {!isDrawerOpen ? <MenuRounded /> : <CloseRounded />}
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";
export default function Dashboard() {
  return (
    <>
      <div className="flex flex-col lg:flex-row w-full justify-between gap-4 text-center mt-60 pl-48">
        <h1 className="text-5xl font-bold text-amber-900">
          DASHBOARD UNDER CONSTRUCTION !
          <p className="text-4xl mt-6">Coming Soon .......</p>
        </h1>
      </div>
    </>
  );
}
[];
