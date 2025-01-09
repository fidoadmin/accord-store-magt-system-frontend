const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const verifyAndUpdatePassword = async (datas: {
  passwordChangeRequestId: any;
  newPassword: any;
}) => {
  try {
    const response = await fetch(
      `${baseURL}/verifypassword/${datas.passwordChangeRequestId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ NewPassword: datas.newPassword }),
      }
    );

    if (response.status != 200) {
      const data = await response.json();
      alert(data.error);
      return data;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("An error occurred:", error);
    alert("An error occurred while updating the password");
    return [];
  }
};
