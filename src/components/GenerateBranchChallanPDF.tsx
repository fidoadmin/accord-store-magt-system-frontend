"use client";
import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Svg,
  Line,
  Font,
} from "@react-pdf/renderer";
import NepaliDate from "nepali-date-converter";
import {
  CheckoutBranchDetailsInterface,
  CheckoutCompanyDetailsInterface,
  CheckoutInventoryDescriptionInterface,
} from "@/types/CheckoutInterface";

Font.register({
  family: "OpenSans",
  fonts: [
    { src: "../../assets/fonts/OpenSans/OpenSans-Regular.ttf" },
    { src: "../../assets/fonts/OpenSans/OpenSans-Light.ttf", fontWeight: 300 },
    { src: "../../assets/fonts/OpenSans/OpenSans-Medium.ttf", fontWeight: 500 },
    {
      src: "../../assets/fonts/OpenSans/OpenSans-SemiBold.ttf",
      fontWeight: 600,
    },
    { src: "../../assets/fonts/OpenSans/OpenSans-Bold.ttf", fontWeight: 700 },
    {
      src: "../../assets/fonts/OpenSans/OpenSans-ExtraBold.ttf",
      fontWeight: 800,
    },
  ],
});
// Define styles with meaningful names
const styles = StyleSheet.create({
  page: {
    fontFamily: "OpenSans",
    padding: 30,
  },
  companySection: {
    marginBottom: 15,
    textAlign: "center",
  },
  companyName: {
    fontSize: 16,
    fontWeight: 800,
  },
  companyAddress: {
    fontSize: 12,
    fontWeight: 300,
  },
  companyVAT: {
    fontSize: 12,
    fontWeight: 500,
    marginBottom: 20,
  },
  title: {
    fontSize: 14,
    fontWeight: 700,
    textAlign: "center",
    marginBottom: 20,
  },
  detailsContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  column: {
    flex: 1,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 5,
    flexWrap: "wrap",
  },
  label: {
    fontSize: 10,
    fontWeight: 700,
  },
  value: {
    fontSize: 10,
    fontWeight: 400,
    textAlign: "left",
  },
  table: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#000",
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: "row",
  },
  headerRow: {
    backgroundColor: "#f2f2f2",
    fontWeight: 700,
  },
  tableCell: {
    fontSize: 8,
    padding: 5,
    textAlign: "center",
  },
  productCell: {
    flex: 1,
    textAlign: "left",
  },
  smallCell: {
    width: "5%",
  },
  mediumCell: {
    width: "12%",
  },
  descriptionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 10,
    backgroundColor: "#c2c2c2",
    padding: 5,
  },
  descriptionText: { fontWeight: 600 },
  remarksSection: {
    fontSize: 10,
    position: "absolute",
    bottom: 120,
    left: "12%",
  },
  signatureSection: {
    position: "absolute",
    bottom: "50",
    left: "12%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  signatureBlock: {
    width: "20%",
    alignItems: "center",
    borderTop: "1 solid black",
    paddingTop: 5,
    marginRight: 10,
  },
  signatureText: {
    fontSize: 10,
  },
});

const GenerateBranchChallanPDF = ({
  companyDetails,
  branchDetails,
  checkoutList,
  remarks,
  poNumber,
}: {
  companyDetails: CheckoutCompanyDetailsInterface | undefined;
  branchDetails: CheckoutBranchDetailsInterface | undefined;
  checkoutList: CheckoutInventoryDescriptionInterface[] | undefined;
  poNumber: string;
  remarks?: string;
}) => {
  let serialNumber = 1;
  const englishDateRaw = new Date();
  const formatter = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const englishDate = formatter.format(englishDateRaw);

  const nepaliDateRaw = new NepaliDate(englishDateRaw).getBS();
  const nepaliDate = `${nepaliDateRaw.date < 10 ? 0 : ""}${
    nepaliDateRaw.date
  }/${nepaliDateRaw.month < 10 && 0}${nepaliDateRaw.month + 1}/${
    nepaliDateRaw.year
  }`;

  return (
    <Document title={branchDetails?.ChallanNumber} pageLayout="singlePage">
      <Page size="A4" style={styles.page}>
        <View style={styles.companySection}>
          <Text style={styles.companyName}>{companyDetails?.CompanyFrom}</Text>
          <Text style={styles.companyAddress}>Tinkune, Kathmandu</Text>
          <Text style={styles.companyVAT}>
            Phone: {branchDetails?.BranchFromPhoneNumber}
          </Text>
        </View>
        <Text style={styles.title}>Branch Transfer Challan</Text>
        <Svg height="10" width="800">
          <Line
            x1="0"
            y1="5"
            x2="540"
            y2="5"
            strokeWidth={2}
            stroke="rgb(0,0,0)"
          />
        </Svg>

        <View style={styles.detailsContainer}>
          <View style={styles.column}>
            <View style={styles.detailRow}>
              <Text style={styles.label}>From Branch: </Text>
              <Text style={styles.value}>{branchDetails?.BranchFrom}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>To Branch: </Text>
              <Text style={styles.value}>{branchDetails?.BranchTo}</Text>
            </View>
          </View>
          <View style={styles.column}>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Date: </Text>
              <Text style={styles.value}>{englishDate}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Miti: </Text>
              <Text style={styles.value}>{nepaliDate}</Text>
            </View>
          </View>
        </View>

        {/* Products Table */}
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.headerRow]}>
            <Text style={[styles.tableCell, styles.smallCell]}>S.N.</Text>
            <Text style={[styles.tableCell, styles.productCell]}>Products</Text>
            <Text style={[styles.tableCell, styles.mediumCell]}>Batch No.</Text>
            <Text style={[styles.tableCell, styles.mediumCell]}>
              Expiry Date
            </Text>
            <Text style={[styles.tableCell, styles.mediumCell]}>Qty</Text>
            <Text style={[styles.tableCell, styles.mediumCell]}>UoM</Text>
          </View>
          {checkoutList?.map((items, index) => (
            <View key={index}>

              {items.SelectedInventories.map((inventory, invIndex) => (
                <View key={invIndex} style={styles.tableRow}>
                  <Text style={[styles.tableCell, styles.smallCell]}>
                    {serialNumber++}
                  </Text>
                  <Text style={[styles.tableCell, styles.productCell]}>
                    {items.Description}({items.ShortName})
                  </Text>
                  <Text style={[styles.tableCell, styles.mediumCell]}>
                    {inventory.BatchNumber}
                  </Text>
                  <Text style={[styles.tableCell, styles.mediumCell]}>
                    {inventory.ExpiryDate}
                  </Text>
                  <Text style={[styles.tableCell, styles.mediumCell]}>
                    {inventory.Quantity}.00
                  </Text>
                  <Text style={[styles.tableCell, styles.mediumCell]}>
                    {inventory.ContainerType}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </View>
        <View style={styles.remarksSection}>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Remarks: </Text>
            <Text style={styles.value}>{remarks}</Text>
          </View>
          {/* <View style={styles.detailRow}>
            <Text style={styles.label}>PO: </Text>
            <Text style={styles.value}>{poNumber}</Text>
          </View> */}
        </View>
        {/* Signature Section */}
        <View style={styles.signatureSection}>
          <View style={styles.signatureBlock}>
            <Text style={styles.signatureText}>Prepared By</Text>
          </View>
          <View style={styles.signatureBlock}>
            <Text style={styles.signatureText}>Packing Verified By</Text>
          </View>
          <View style={styles.signatureBlock}>
            <Text style={styles.signatureText}>Authorized By</Text>
          </View>
          <View style={styles.signatureBlock}>
            <Text style={styles.signatureText}>Received By</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default GenerateBranchChallanPDF;
