import { toast } from "react-toastify";
import { SaveRounded, CancelRounded } from "@mui/icons-material";
import { getCookie } from "cookies-next";
import { useState, FormEvent, useEffect } from "react";
import { AddOrUpdateCompanyPayloadInterface } from "@/types/CompanyInterface";
import { useAddOrUpdateCompaniesMaintenance } from "@/app/hooks/company/useCompanyAddOrUpdate";
import { useClientList } from "@/app/hooks/client/useClientList";
import Dropdown from "@/components/Dropdown";
import { ClientDetailInterface } from "@/types/ClientInterface";
import { useBranchList } from "@/app/hooks/branches/useBranchList";
import { useCompanyTypeList } from "@/app/hooks/companies/useCompanyTypeList";

const CompanyAddOverlay = ({
  onOverlayClose,
}: {
  onOverlayClose: () => void;
}) => {
  const [formData, setFormData] = useState<AddOrUpdateCompanyPayloadInterface>({
    Id: "",
    Name: "",
    Address: "",
    EmailAddress: "",
    PhoneNumber: "",
    PanNumber: "",
    BranchId: [],
    ClientId: "",
    CompanyTypeId: [],
  });
  const [authKey, setAuthKey] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 20;

  const { mutate: addOrUpdateCompany } = useAddOrUpdateCompaniesMaintenance();
  const { data: clientList, isLoading: clientLoading } = useClientList(
    authKey || "",
    { page: currentPage, limit: itemsPerPage }
  );
  const { data: branchData } = useBranchList(authKey || "", {
    page: 0,
    limit: 0,
  });
  const { data: companytypeslist } = useCompanyTypeList(authKey || "", {
    page: 0,
    limit: 0,
  });

  useEffect(() => {
    const key = getCookie("authKey") as string;
    setAuthKey(key);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  console.log();

  const handleSetOpenDropdown = (dropdownId: string) => {
    setOpenDropdown((prev) => (prev === dropdownId ? null : dropdownId));
  };

  const handleSelectClient = (option: { id: string }) => {
    setFormData((prevData) => ({
      ...prevData,
      ClientId: option.id,
    }));
  };

  const handleSelectBranch = (option: { id: string }) => {
    setFormData((prevData) => ({
      ...prevData,
      BranchId: [...prevData.BranchId, option.id],
    }));
  };

  const handleSelectCompanyType = (option: { id: string }) => {
    setFormData((prevData) => {
      const updatedCompanyTypeIds = new Set([...prevData.CompanyTypeId]);

      if (updatedCompanyTypeIds.has(option.id)) {
        updatedCompanyTypeIds.delete(option.id);
      } else {
        updatedCompanyTypeIds.add(option.id);
      }

      return {
        ...prevData,
        CompanyTypeId: Array.from(updatedCompanyTypeIds),
      };
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.ClientId) {
      toast.error("Client Name is required.", { position: "top-right" });
      return;
    }
    if (formData.BranchId.length === 0) {
      toast.error("At least one Branch must be selected.", {
        position: "top-right",
      });
      return;
    }
    if (formData.CompanyTypeId.length === 0) {
      toast.error("At least one Company Type must be selected.", {
        position: "top-right",
      });
      return;
    }

    const emailAddresses = formData.EmailAddress.split(",")
      .map((e) => e.trim())
      .join(",");
    const phoneNumbers = formData.PhoneNumber.split(",")
      .map((p) => p.trim())
      .join(",");

    const payload = {
      ...formData,
      EmailAddress: emailAddresses,
      PhoneNumber: phoneNumbers,
    };

    try {
      await addOrUpdateCompany(payload);
      toast.success("Company saved successfully!", { position: "top-right" });
      onOverlayClose();
    } catch (error) {
      toast.error("An error occurred while saving the company.", {
        position: "top-right",
      });
    }
  };

  return (
    <div
      className="fixed inset-0 h-screen flex items-center justify-center bg-black bg-opacity-20 backdrop-blur-md z-20"
      onClick={onOverlayClose}
    >
      <div
        className="fixed w-1/2 min-h-96 top-10 right-1/2 translate-x-2/3 p-6 bg-white border border-primary text-text rounded-3xl z-40 max-h-screen scrollbar-thin overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h1 className="text-lg text-primary text-center font-bold">
          Add Company
        </h1>

        <div className="mb-4">
          <label className="text-sm text-text">
            Name: <span className="text-error">*</span>
          </label>
          <input
            name="Name"
            value={formData.Name}
            onChange={handleChange}
            className="w-full inner-border-2 inner-border-primary rounded-xl p-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="text-sm text-text">
            Address: <span className="text-error">*</span>
          </label>
          <input
            name="Address"
            value={formData.Address}
            onChange={handleChange}
            className="w-full inner-border-2 inner-border-primary rounded-xl p-2"
            required
          />
        </div>

        <div className="mb-4">
          <label className="text-sm text-text">
            Email Address: <span className="text-error">*</span>
          </label>
          <input
            name="EmailAddress"
            value={formData.EmailAddress}
            onChange={handleChange}
            className="w-full inner-border-2 inner-border-primary rounded-xl p-2"
            required
          />
        </div>

        <div className="mb-4">
          <label className="text-sm text-text">Phone Number:</label>
          <input
            name="PhoneNumber"
            value={formData.PhoneNumber}
            onChange={handleChange}
            className="w-full inner-border-2 inner-border-primary rounded-xl p-2"
          />
        </div>
        <div className="mb-4">
          <label className="text-sm text-text">Pan Number:</label>
          <input
            name="PanNumber"
            value={formData.PanNumber}
            onChange={handleChange}
            className="w-full inner-border-2 inner-border-primary rounded-xl p-2"
          />
        </div>

        <Dropdown
          label="Client"
          showLabel
          options={
            clientList?.data?.map((client: ClientDetailInterface) => ({
              id: client.Id!,
              name: client.Name!,
            })) ?? []
          }
          isOpen={openDropdown === "clients"}
          setIsOpen={() => handleSetOpenDropdown("clients")}
          onSelect={handleSelectClient}
          placeholder="Select a client"
          required
        />

        <div className="mb-4">
          <label className="text-sm text-text">
            Branch: <span className="text-error">*</span>
          </label>
          <div className="w-full inner-border-2 inner-border-primary rounded-xl p-2">
            {branchData?.data?.map((branch) => (
              <div key={branch.Id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`branch-${branch.Id}`}
                  value={branch.Id}
                  checked={formData.BranchId.includes(branch.Id)}
                  onChange={(e) => {
                    let newBranchIds = [...formData.BranchId];

                    if (e.target.checked && !newBranchIds.includes(branch.Id)) {
                      newBranchIds.push(branch.Id);
                    } else if (!e.target.checked) {
                      const index = newBranchIds.indexOf(branch.Id);
                      if (index > -1) newBranchIds.splice(index, 1);
                    }

                    newBranchIds = Array.from(new Set(newBranchIds));

                    setFormData((prevData) => ({
                      ...prevData,
                      BranchId: newBranchIds,
                    }));
                  }}
                />
                <label htmlFor={`branch-${branch.Id}`} className="ml-2">
                  {branch.Name}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="text-sm text-text">
            Company Type: <span className="text-error">*</span>
          </label>
          <div className="w-full inner-border-2 inner-border-primary rounded-xl p-2">
            {companytypeslist?.data
              ?.filter(
                (type, index, self) =>
                  index === self.findIndex((t) => t.Id === type.Id)
              )
              .map((type) => {
                const isCustomerOrInternalSelected =
                  formData.CompanyTypeId.some(
                    (id) => id === "Customer" || id === "Internal"
                  );

                const canSelectManufacturerAndSupplier =
                  formData.CompanyTypeId.includes("Manufacturer") ||
                  formData.CompanyTypeId.includes("Supplier");

                const isCustomerSelected =
                  formData.CompanyTypeId.includes("Customer");
                const isInternalSelected =
                  formData.CompanyTypeId.includes("Internal");

                const isDisabled =
                  (isCustomerOrInternalSelected &&
                    type.Name !== "Customer" &&
                    type.Name !== "Internal") ||
                  (canSelectManufacturerAndSupplier &&
                    type.Name !== "Manufacturer" &&
                    type.Name !== "Supplier");

                const isLimitToOneForCustomerInternal =
                  (isCustomerSelected || isInternalSelected) &&
                  type.Name !== "Customer" &&
                  type.Name !== "Internal" &&
                  formData.CompanyTypeId.length > 1;

                const isLimitToTwo =
                  formData.CompanyTypeId.length >= 2 &&
                  !formData.CompanyTypeId.includes(type.Id);

                return (
                  <div key={`type-${type.Id}`} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`companytype-${type.Id}`}
                      value={type.Id}
                      checked={formData.CompanyTypeId.includes(type.Id)}
                      onChange={(e) => {
                        setFormData((prevData) => {
                          let newCompanyTypeIds = new Set([
                            ...prevData.CompanyTypeId,
                          ]);

                          if (e.target.checked) {
                            newCompanyTypeIds.add(type.Id);
                          } else {
                            newCompanyTypeIds.delete(type.Id);
                          }

                          if (
                            type.Name === "Customer" ||
                            type.Name === "Internal"
                          ) {
                            newCompanyTypeIds = new Set([type.Id]);
                          }

                          if (canSelectManufacturerAndSupplier) {
                            newCompanyTypeIds = new Set(
                              Array.from(newCompanyTypeIds).filter(
                                (id) =>
                                  id === "Manufacturer" || id === "Supplier"
                              )
                            );
                          }

                          return {
                            ...prevData,
                            CompanyTypeId: Array.from(newCompanyTypeIds),
                          };
                        });
                      }}
                      disabled={
                        isDisabled ||
                        isLimitToOneForCustomerInternal ||
                        isLimitToTwo
                      }
                    />
                    <label htmlFor={`companytype-${type.Id}`} className="ml-2">
                      {type.Name}
                    </label>
                  </div>
                );
              })}
          </div>
        </div>

        <div className="flex gap-4 justify-center mt-5">
          <button
            className="bg-success rounded-xl p-2 w-40 flex items-center justify-center gap-4 text-white"
            onClick={handleSubmit}
          >
            <SaveRounded /> Save
          </button>
          <button
            className="bg-error rounded-xl p-2 w-40 flex items-center justify-center gap-4 text-white"
            onClick={onOverlayClose}
          >
            <CancelRounded /> Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyAddOverlay;
