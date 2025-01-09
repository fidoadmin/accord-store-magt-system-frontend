"use client";
import {
  AddCircleOutlineRounded,
  CloseRounded,
  DeleteForeverRounded,
  DeleteRounded,
  EditRounded,
  RemoveCircleOutlineRounded,
} from "@mui/icons-material";
import Dropdown from "./Dropdown";
import { useState, FormEvent } from "react";
import { useGenerateCheckoutList } from "@/app/hooks/checkouts/useGenerateCheckoutList";
import emptyImg from "../../public/assets/images/empty.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  CheckoutOverlayProps,
  GenerateCheckoutListRequestInterface,
} from "@/types/CheckoutInterface";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { useCompanyList } from "@/app/hooks/companies/useCompanyList";
import { getCookie } from "cookies-next";
import ExceedQuantityComponent from "./ExceedQuantityComponent";

const CheckoutListOverlay: React.FC<CheckoutOverlayProps> = ({
  onOverlayClose,
  checkoutList,
  transfereeList,
  onUpdateCheckoutList,
}) => {
  const authKey = getCookie("authKey") as string;
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(0);
  const [buttonClicked, setButtonClicked] = useState<boolean>(false);
  const [checkoutError, setCheckoutError] = useState<string[] | null>(null);
  const [relays, setRelays] = useState<{ id: string; name: string }[]>([]);
  const [isDataVerifed, setIsDataVerified] = useState(false);
  const [showExceedQuantityPopup, setShowExceedQuantityPopup] = useState(false);
  const [isPreCheckInRequest, setIsPreCheckInRequest] = useState(false);
  const [isPreCheckInClicked, setIsPreCheckInClicked] = useState(false);
  const [poNumber, setPoNumber] = useState<string | null>(null);
  const [remarks, setRemarks] = useState<string | null>(null);
  const [customer, setCustomer] = useState<
    { id: string; name: string } | undefined
  >(undefined);
  const generateCheckoutListMutation = useGenerateCheckoutList();
  const router = useRouter();
  const [editableIndex, setEditableIndex] = useState<number | undefined>(undefined);
  const [editedItem, setEditedItem] = useState<{
    quantity: number | undefined;
    foc: number | undefined;
    specificDate: string | undefined;
    isPreCheckInRequest: boolean | undefined;
  }>({
    quantity: undefined,
    foc: undefined,
    specificDate: undefined,
    isPreCheckInRequest: undefined,
  });
  var targetItem;

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const handleSetOpenDropdown = (dropdownId: string) => {
    setOpenDropdown((prev) => (prev === dropdownId ? null : dropdownId));
  };

  var CheckoutCompanyId = checkoutList[0]?.CompanyId;
  var CheckoutBranchId = checkoutList[0]?.BranchId;

  let {
    data: customerData,
    error: customerError,
    isLoading: customerLoading,
  } = useCompanyList(authKey || "", {
    page,
    limit,
    iscustomer: "true",
  });

  customerData = customerData?.filter((item) => item.Id !== CheckoutCompanyId) || [];
  transfereeList = transfereeList?.filter((item) => item.Id !== CheckoutCompanyId )|| [];

  const handleRemoveFromCheckout = (
    id: string,
    companyId: string,
    branchId: string
  ) => {
    const updatedCheckoutList = checkoutList.filter(
      (item) =>
        !(
          item.Id === id &&
          item.CompanyId === companyId &&
          item.BranchId === branchId
        )
    );
    onUpdateCheckoutList(updatedCheckoutList);
  };

  const handleSaveEdit = (id: string, companyId: string, branchId: string) => {
    if ((editedItem.quantity || 0) <= 0 && (editedItem.foc || 0) <= 0) {
      toast.error("Quantity or FOC Quantity must be greater than 0");
      return;
    }

    targetItem = checkoutList.find(
      (item) =>
        item.Id === id &&
        item.CompanyId === companyId &&
        item.BranchId === branchId
    );

    if (
      targetItem &&
      targetItem.AvailableQuantity !== undefined &&
      ((editedItem.quantity || 0) + (editedItem.foc || 0 )) > targetItem.AvailableQuantity &&
      !isPreCheckInClicked &&
      !editedItem.isPreCheckInRequest
    ) {
      setShowExceedQuantityPopup(true);
      return;
    }

    const updatedCheckoutList = checkoutList.map((item) => {
      if (
        item.Id === id &&
        item.CompanyId === companyId &&
        item.BranchId === branchId
      ) {
        return {
          ...item,
          Quantity: editedItem.quantity || undefined,
          FocQuantity: editedItem.foc || undefined,
          IsFoc: editedItem.foc ? true : false,
          SpecificExpiryDate:
            editedItem.specificDate || item.SpecificExpiryDate,
          IsPrecheckInRequest: editedItem.isPreCheckInRequest
            ? editedItem.isPreCheckInRequest
            : false,
        };
      }
      return item;
    });

    for (const item of checkoutList) {
      if ((item.Quantity || 0) <= 0 && (item.FocQuantity || 0) <= 0) {
        setIsDataVerified(false);
      }
    }

    onUpdateCheckoutList(updatedCheckoutList);
    setEditableIndex(undefined);
    setIsPreCheckInRequest(false);
    setIsPreCheckInClicked(false);
  };

  const handleClearAll = () => {
    onUpdateCheckoutList([]);
    setRelays([]);
  };

  useEffect(() => {
    for (const item of checkoutList) {
      if ((item.Quantity || 0) <= 0 && (item.FocQuantity || 0) <= 0) {
        setIsDataVerified(true);
      } else {
        setIsDataVerified(false);
      }
    }
  }, []);

  const handleCheckoutError = () => {
    let checkoutError: string[] = [];
    if (!!relays.length && !relays.at(-1)?.id) {
      checkoutError.push("Relay");
    }
    setCheckoutError(checkoutError);

    return checkoutError;
  };

  const handleAddRelay = () => {
    setRelays((prevRelays) => [...prevRelays, { id: "", name: "" }]);
  };

  const handleRemoveRelay = (relayId: string) => {
    setRelays((prevRelays) =>
      prevRelays.filter((relay) => relay.id !== relayId)
    );
  };

  const handleRelaySelect = (
    index: number,
    option: { id: string; name: string }
  ) => {
    setRelays((prevRelays) =>
      prevRelays.map((relay, i) => (i === index ? option : relay))
    );
  };

  const handleCustomerSelect = (option: { id: string; name: string }) => {
    setCustomer(option);
  };

  // const handleNotifyRestock = () => {
  //   setIsPreCheckInClicked(true);
  //   setShowExceedQuantityPopup(false);
  // };

  const handleNotifyRestock = (): any => {
    setEditedItem((prev) => ({
      ...prev,
      isPreCheckInRequest: isPreCheckInRequest ? false : true,
    }));
    setIsPreCheckInClicked(true);
    setShowExceedQuantityPopup(false);
  };

  

  useEffect(() => {
    setIsPreCheckInRequest(isPreCheckInClicked);
  }, [isPreCheckInClicked]);

  const getAvailableOptions = () => {
    return (
      transfereeList?.filter(
        (transferee) => !relays.some((relay) => relay.id === transferee.Id)
      ) ?? []
    );
  };

  useEffect(() => {
    if (editableIndex !== undefined) {
      setEditedItem((prev) => ({
        ...prev,
        isPreCheckInRequest:
        isPreCheckInRequest  && ((prev.quantity || 0) + (prev.foc || 0)) > (checkoutList[editableIndex]?.AvailableQuantity || 0),
      }));
    }
  }, [editedItem.quantity, editedItem.foc]);
  

  const handleGenerateCheckoutList = async (e: FormEvent) => {
    e.preventDefault;
    setButtonClicked(true);

    const isValidQuantityOrFoc = checkoutList.every(
      (item) =>
        (item.Quantity && item.Quantity > 0) ||
        (item.FocQuantity && item.FocQuantity > 0)
    );

    if (!isValidQuantityOrFoc) {
      toast.error("Each item must have either Quantity or FOC greater than 0.");
      setButtonClicked(false);
      return;
    }

    const CheckoutRelay = relays.map((relay) => {
      return { CompanyId: relay.id };
    });

    const DescriptionDetails = checkoutList.map((item) => {
      return {
        DescriptionId: item.Id,
        Quantity: item.Quantity,
        SpecificExpiryDate: item.SpecificExpiryDate,
        IsPrecheckInRequest: item.IsPrecheckInRequest,
        IsFoc: item.IsFoc,
        FocQuantity: item.FocQuantity,
      };
    });

    const BuyerId = customer?.id;
    const PoNumber = poNumber!;
    const Remarks = remarks!;

    const CheckoutPayload: GenerateCheckoutListRequestInterface = {
      DescriptionDetails,
      CheckoutRelay,
      CheckoutBranchId,
      CheckoutCompanyId,
      BuyerId,
      PoNumber,
      Remarks,
    };

    if (handleCheckoutError()?.length) return;

    try {
      const response = await generateCheckoutListMutation.mutateAsync(
        CheckoutPayload
      );
      setCustomer(undefined);

      if (response.result) {
        handleClearAll();
        router.push(`/checkout/${response.result}`);
      } else {
        toast.error(response.error);
        router.push(`/checkout`);
      }
      onOverlayClose();
      return;
    } catch (error) {
      console.error("Failed to generate checkout list", error);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 h-screen flex items-center justify-center bg-black bg-opacity-20 backdrop-blur-md z-20"
        onClick={onOverlayClose}
      />
      <div className="fixed w-2/3 md:w-1/2 p-6 top-10 right-1/2 translate-x-2/3 text-xs md:text-sm bg-white border border-grey text-text rounded-3xl z-40 space-y-2 overflow-y-auto max-h-screen scrollbar-thin">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-lg mb-2 flex-1 text-center">
            Checkout Items
          </h3>
          <button className="text-error" onClick={onOverlayClose}>
            <CloseRounded />
          </button>
        </div>
        {checkoutList.length ? (
          <div className="mainContent space-y-4">
            <div className="customerSelector space-y-4">
              <div className="tableDiv">
                <table className="w-full outline outline-grey text-center rounded-lg">
                  <thead className="bg-white text-black">
                    <tr>
                      <th className="lg:px-2">Short Name</th>
                      <th className="lg:px-2">Available Quantity</th>
                      <th className="lg:px-2">Quantity</th>
                      <th className="lg:px-2">FOC</th>
                      <th className="lg:px-2">Specific Date</th>
                      <th className="lg:px-2">Notify When Restocked</th>
                      <th className="lg:px-2"></th>
                      <th className="lg:px-2">
                        <button
                          className="text-error"
                          title="Remove all items from checkout"
                          onClick={() => onUpdateCheckoutList([])}
                        >
                          <DeleteForeverRounded className="hover:text-errorAccent" />
                        </button>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {checkoutList.map((item, index) => (
                      <tr key={index} className="my-2">
                        <td
                          className="lg:px-2 text-center truncate"
                          title={item.ShortName}
                        >
                          {item.ShortName}
                        </td>
                        <td className="lg:px-2 text-center">
                          {item.AvailableQuantity}
                        </td>
                        <td className="lg:px-2 text-center">
                          {editableIndex === index ? (
                            <input
                              type="number"
                              value={editedItem.quantity}
                              onChange={(e) =>
                                setEditedItem((prev) => ({
                                  ...prev,
                                  quantity: e.target.value
                                    ? Number(e.target.value)
                                    : undefined,
                                }))
                              }
                              className="border rounded p-1 w-20"
                              onFocus={(e) => e.target.select()}
                            />
                          ) : (
                            item.Quantity
                          )}
                        </td>
                        <td className="lg:px-2 text-center">
                          {editableIndex === index ? (
                            <input
                              type="number"
                              value={editedItem.foc}
                              onChange={(e) =>
                                setEditedItem((prev) => ({
                                  ...prev,
                                  foc: e.target.value
                                    ? Number(e.target.value)
                                    : undefined,
                                }))
                              }
                              className="border rounded p-1 w-20"
                              onFocus={(e) => e.target.select()}
                            />
                          ) : (
                            item.FocQuantity
                          )}
                        </td>
                        <td className="lg:px-2 text-center">
                          {editableIndex === index ? (
                            <input
                              type="date"
                              value={editedItem.specificDate || ""}
                              onChange={(e) =>
                                setEditedItem((prev) => ({
                                  ...prev,
                                  specificDate: e.target.value,
                                }))
                              }
                              className="border rounded p-1"
                              onFocus={(e) => e.target.select()}
                            />
                          ) : (
                            item.SpecificExpiryDate
                          )}
                        </td>
                        <td className="lg:px-2 text-center">
                          {editableIndex === index ? (
                            <input
                            type="checkbox"
                            checked={editedItem.isPreCheckInRequest}
                            onChange={(e) => {
                              const checkedValue = e.target.checked;
                              setEditedItem((prev) => ({
                                ...prev,
                                isPreCheckInRequest: checkedValue,
                              }));
                            }}
                            className="border rounded p-1"
                            disabled={
                              ((editedItem.quantity ? editedItem.quantity : 0) + (editedItem.foc ? editedItem.foc : 0)) <= (item.AvailableQuantity ? item.AvailableQuantity : 0)
                            }
                          />
                          
                          ) : (
                            <input
                              type="checkbox"
                              checked={item.IsPrecheckInRequest}
                              disabled
                              className="border rounded p-1"
                            />
                          )}
                        </td>

                        <td className="">
                          {editableIndex === index ? (
                            <button
                              className="text-success"
                              title="Save item"
                              onClick={() =>
                                handleSaveEdit(
                                  item.Id,
                                  item.CompanyId,
                                  item.BranchId
                                )
                              }
                            >
                              Save
                            </button>
                          ) : (
                            <button
                              className="flex w-full justify-center text-error"
                              title="Edit item"
                              onClick={() => {
                                setEditableIndex(index);
                                setEditedItem({
                                  quantity: item.Quantity
                                    ? item.Quantity
                                    : undefined,
                                  foc: item.FocQuantity
                                    ? item.FocQuantity
                                    : undefined,
                                  specificDate:
                                    item.SpecificExpiryDate || undefined,
                                  isPreCheckInRequest:
                                    item.IsPrecheckInRequest || undefined,
                                });
                              }}
                            >
                              <EditRounded
                                style={{ color: "green" }}
                                className="hover:text-errorAccent"
                              />
                            </button>
                          )}
                        </td>
                        <td className="">
                          <button
                            className="flex w-full justify-center text-error"
                            title="Remove item from checkout"
                            onClick={() =>
                              handleRemoveFromCheckout(
                                item.Id,
                                item.CompanyId,
                                item.BranchId
                              )
                            }
                          >
                            <DeleteRounded className="hover:text-errorAccent" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="customer flex items-center gap-2 mt-2">
                <Dropdown
                  label="Company"
                  showLabel={false}
                  options={
                    customerData?.map((customer) => ({
                      id: customer.Id,
                      name: customer.Name,
                    })) || []
                  }
                  search
                  isOpen={openDropdown === "customer"}
                  setIsOpen={() => handleSetOpenDropdown("customer")}
                  required
                  value={customer ? customer.name : "Select a customer"}
                  onSelect={handleCustomerSelect}
                  placeholder="Select a customer"
                  disabled={isDataVerifed}
                />
              </div>

              <div className="relay">
                {customer && (
                  <button
                    className="flex gap-2 items-center text-success hover:text-successAccent disabled:text-text disabled:opacity-60"
                    onClick={handleAddRelay}
                    disabled={
                      !customer.id ||
                      (!!customer.id && !!relays.length && !relays.at(-1)?.id)
                    }
                  >
                    <AddCircleOutlineRounded />
                    <span>Add a relay</span>
                  </button>
                )}

                {relays.map((relay, index) => (
                  <div key={index} className="flex items-center gap-2 mt-2">
                    <div className="w-full">
                      <Dropdown
                        label="Company"
                        showLabel={false}
                        options={getAvailableOptions().map((transferee) => ({
                          id: transferee.Id,
                          name: transferee.Name,
                          external: transferee.IsExternal,
                        }))}
                        isOpen={openDropdown === `relay${index}`}
                        setIsOpen={() => handleSetOpenDropdown(`relay${index}`)}
                        required
                        onSelect={(option) => handleRelaySelect(index, option)}
                        value={relay.name}
                        placeholder={
                          checkoutError?.includes("Relay") && !relays[index].id
                            ? " Cannot be empty"
                            : "Select a relay company"
                        }
                        error={
                          checkoutError?.includes("Relay") && !relays[index].id
                        }
                      />
                    </div>
                    <RemoveCircleOutlineRounded
                      className="cursor-pointer text-error"
                      onClick={() => handleRemoveRelay(relay.id)}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full">
              <label className="block text-xs text-text">
                Checking out against PO Number?
              </label>
              <input
                type="string"
                autoComplete="off"
                name="PurchaseOrderNumber"
                disabled={isDataVerifed}
                onChange={(e: any) => {
                  setPoNumber(e.target.value);
                }}
                className="input w-full rounded-xl px-4 py-2 bg-transparent text-sm text-text placeholder:text-text border border-grey   focus:ring-0 focus:outline-none"
                placeholder="PO Number"
              />
            </div>

            <div>
              <textarea
                placeholder="Remarks"
                disabled={isDataVerifed}
                className="input w-full rounded-xl px-4 py-2 bg-transparent text-sm text-text placeholder:text-text border border-grey   focus:ring-0 focus:outline-none scrollbar-thin"
                onChange={(e: any) => {
                  setRemarks(e.target.value);
                }}
              />
            </div>
            <div className="flex justify-end">
              <button
                className="bg-success hover:opacity-80 disabled:border disabled:bg-transparent disabled:border-grey disabled:opacity-40 disabled:text-primary text-white rounded-3xl px-4 py-2"
                disabled={
                  !checkoutList.length ||
                  !customer?.id ||
                  (!!customer.id && !!relays.length && !relays.at(-1)?.id) ||
                  buttonClicked
                }
                onClick={handleGenerateCheckoutList}
              >
                Generate Checkout List
              </button>
            </div>

            {showExceedQuantityPopup && (
              <ExceedQuantityComponent
                onNotifyRestock={handleNotifyRestock}
                onClose={() => {
                  setShowExceedQuantityPopup(false);
                  setIsPreCheckInClicked(true);
                }}
              />
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Image
              src={emptyImg}
              alt="Empty Checkout List"
              width={100}
              height={100}
              className="mb-4"
            />
            <p className="text-lg">No Items in Checkout</p>
          </div>
        )}
      </div>
    </>
  );
};

export default CheckoutListOverlay;
