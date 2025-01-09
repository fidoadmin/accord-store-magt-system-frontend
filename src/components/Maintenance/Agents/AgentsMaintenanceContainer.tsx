// import { useAgentList } from "@/app/hooks/agents/useAgentList";
// import { AddRounded } from "@mui/icons-material";
// import { getCookie } from "cookies-next";
// import { useState } from "react";
// import AgentsMaintenanceDetail from "./AgentsMaintenanceDetail";

// export default function AgentsMaintenanceContainer() {
//   const authKey = getCookie("authKey") as string;

//   const [addButton, setAddButton] = useState<boolean>(false);
//   const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);

//   const {
//     data: agentData,
//     error: agentError,
//     isLoading: agentLoading,
//   } = useAgentList(authKey || "", {
//     page: 0,
//     limit: 0,
//   });

//   const handleSelectAgent = (option: { id: string; name: string }) => {

//     setSelectedAgentId(option.id);
//   };

//   return (
//     <div className="w-full h-full flex flex-col">
//       <div className="py-1 flex justify-end">
//         <button
//           className="btn bg-success rounded-xl px-4 py-1 text-white flex items-center justify-around"
//           type="button"
//           onClick={() => setAddButton(!addButton)}
//         >
//           Add
//           <AddRounded />
//         </button>
//       </div>

//       <h3 className="font-bold mb-4">Select Agent</h3>
//       <div className="flex-1 flex bg-surface rounded-xl">
//         {agentLoading ? (
//           <div>Loading agents...</div>
//         ) : agentError ? (
//           <div>Error loading agents: {agentError.message}</div>
//         ) : (
//           <ul className="h-full w-80 rounded-xl bg-surface border border-primary flex flex-col gap-6 p-4">
//             {agentData && agentData.length > 0 ? (
//               agentData.map((agents) => (
//                 <li
//                   key={agents.Id}
//                   className="bg-background rounded-xl w-full hover:bg-primary hover:text-white px-4 py-1 cursor-pointer"
//                   onClick={() =>
//                     handleSelectAgent({ id: agents.Id, name: agents.Name })
//                   }
//                 >
//                   {agents.Name}
//                 </li>
//               ))
//             ) : (
//               <li>No agents found</li>
//             )}
//           </ul>
//         )}
//         {selectedAgentId && (
//           <AgentsMaintenanceDetail
//             id={selectedAgentId}
//             clearSelected={() => setSelectedAgentId(null)}
//           />
//         )}
//       </div>
//     </div>
//   );
// }
import React, { useState } from "react";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { AddRounded, DeleteRounded } from "@mui/icons-material";
import { useAgentList } from "@/app/hooks/agents/useAgentList";
import SearchInput from "../../SearchBox";
import { getCookie } from "cookies-next";
import AgentsAddOverlay from "./AgentsMaintenanceAddOverlay";

function AgentsMaintenanceContainer() {
  const authKey = getCookie("authKey") as string;
  const [addButton, setAddButton] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [editableAgents, setEditableAgents] = useState<Record<string, boolean>>(
    {}
  );
  const [agentData, setAgentData] = useState<any[]>([]);

  const {
    data: fetchedAgentData,
    error: agentError,
    isLoading: agentLoading,
  } = useAgentList(authKey || "", {
    page: 0,
    limit: 0,
  });

  React.useEffect(() => {
    if (fetchedAgentData) {
      setAgentData(fetchedAgentData);
    }
  }, [fetchedAgentData]);

  const handleFieldChange = (id: string, field: string, value: string) => {
    const updatedData = agentData.map((agent) =>
      agent.Id === id ? { ...agent, [field]: value } : agent
    );
    setAgentData(updatedData);
  };

  const handleOverlayClose = () => {
    setAddButton(false);
  };

  const toggleEdit = (id: string) => {
    setEditableAgents((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const handleSave = (id: string) => {
    toggleEdit(id);
  };

  const handleCancel = (id: string) => {
    toggleEdit(id);
  };

  return (
    <div className="w-full px-8 mt-4">
      <div className="flex items-center gap-4 mt-[-56px] pl-48">
        <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>
      <div className="flex justify-end mb-4">
        <button
          className="flex items-center px-4 py-2 border-2 bg-success rounded-xl hover:opacity-80"
          onClick={() => setAddButton(!addButton)}
        >
          <AddRounded style={{ color: "green" }} className="mr-2" /> ADD
        </button>
      </div>

      <div className="overflow-x-auto border-2 rounded-lg">
        <table className="w-full border-collapse table-auto">
          <thead>
            <tr className="bg-tablehead border-b-2 text-left">
              <th className="p-4">Name</th>
              <th className="p-4">Address</th>
              <th className="p-4">Email Address</th>
              <th className="p-4">Phone Number</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {agentData && agentData.length > 0 ? (
              agentData.map((agent) => (
                <tr
                  key={agent.Id}
                  className="border-b hover:bg-gray-50 cursor-pointer"
                >
                  <td className="p-4">
                    {editableAgents[agent.Id] ? (
                      <input
                        type="text"
                        value={agent.Name}
                        onChange={(e) =>
                          handleFieldChange(agent.Id, "Name", e.target.value)
                        }
                        className="border p-2 rounded"
                      />
                    ) : (
                      agent.Name
                    )}
                  </td>
                  <td className="p-4">
                    {editableAgents[agent.Id] ? (
                      <input
                        type="text"
                        value={agent.Address}
                        onChange={(e) =>
                          handleFieldChange(agent.Id, "Address", e.target.value)
                        }
                        className="border p-2 rounded"
                      />
                    ) : (
                      agent.Address
                    )}
                  </td>
                  <td className="p-4">
                    {editableAgents[agent.Id] ? (
                      <input
                        type="email"
                        value={agent.Emailaddress}
                        onChange={(e) =>
                          handleFieldChange(
                            agent.Id,
                            "Emailaddress",
                            e.target.value
                          )
                        }
                        className="border p-2 rounded"
                      />
                    ) : (
                      agent.Emailaddress
                    )}
                  </td>
                  <td className="p-4">
                    {editableAgents[agent.Id] ? (
                      <input
                        type="text"
                        value={agent.Phonenumber}
                        onChange={(e) =>
                          handleFieldChange(
                            agent.Id,
                            "Phonenumber",
                            e.target.value
                          )
                        }
                        className="border p-2 rounded"
                      />
                    ) : (
                      agent.Phonenumber
                    )}
                  </td>
                  <td className="p-4 flex gap-2">
                    {!editableAgents[agent.Id] && (
                      <>
                        <EditRoundedIcon
                          style={{ color: "green" }}
                          className="border-transparent cursor-pointer"
                          onClick={() => toggleEdit(agent.Id)}
                        />
                        <DeleteRounded
                          style={{ color: "red" }}
                          className="border-transparent cursor-pointer"
                        />
                      </>
                    )}
                    {editableAgents[agent.Id] && (
                      <>
                        <button
                          onClick={() => handleSave(agent.Id)}
                          className="bg-error text-white px-4 py-2 rounded-xl hover:opacity-40"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => handleCancel(agent.Id)}
                          className="bg-success text-white px-4 py-2 rounded-xl hover:opacity-40"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-4 text-center">
                  No agents found
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {addButton && <AgentsAddOverlay onOverlayClose={handleOverlayClose} />}
      </div>
    </div>
  );
}

export default AgentsMaintenanceContainer;
