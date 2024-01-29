import { useState, useCallback } from "react";
import { Card, TextContainer, Text, AccountConnection } from "@shopify/polaris";
import { Toast } from "@shopify/app-bridge-react";
import { useTranslation } from "react-i18next";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";

export function ProductsCard() {
  const fetch = useAuthenticatedFetch();
  const { t } = useTranslation();

  const emptyToastProps = { content: null };
  const [isLoading, setIsLoading] = useState(true);
  const [toastProps, setToastProps] = useState(emptyToastProps);
  const [connected, setConnected] = useState(false);
  const [accountName, setAccountName] = useState("");
  const [koreconnection, setKoreconnection] = useState(false);

  const buttonText = connected ? "Disconnect" : "Connect";
  const details = connected ? "Account connected" : "No account connected";

  const toastMarkup = toastProps.content && (
    <Toast {...toastProps} onDismiss={() => setToastProps(emptyToastProps)} />
  );

  /*********************
  
  * Purpose: Fetch basic shop information and set context
  * Description: Fetch session data to set store name and check toggle account connection
  * Params: NA
  * Response: NA[Setting properties only]
  
  **********************/

  const fetchsession = async () => {
    setIsLoading(true);
    const response = await fetch("/api/fetchsession");
    try {
      const responseData = await response.json();
      // Update accessTokenState with the accessToken value
      console.log(responseData);
      setAccountName(responseData.shop);

      if (connected) {
        deleteconnection(responseData.shop);
      } else {
        setconnection(responseData.shop, responseData.accessToken);
      }
      setIsLoading(false);
    } catch (error) {
      //setIsLoading(false);
      setToastProps({
        content: t("kore.errorReceivingSession"),
        error: true,
      });
      console.error("Error parsing JSON:", error.message);
    } finally {
      //setIsLoading(false);
    }
  };

  /*********************
  
  * Purpose: Get current connection status
  * Description: To check if Shopify app has shared token with Kore.ai backend platform
  * Params: NA
  * Response: NA[Setting properties only]
  
  **********************/

  const getconnection = async () => {
    setIsLoading(true);
    const response = await fetch("/api/fetchsession");

    try {
      const responseData = await response.json();
      // Update accessTokenState with the accessToken value
      // console.log(responseData);
      setAccountName(responseData.shop);

      const apiUrl =
        "https://retailassist-poc.kore.ai/datatables/shopifyApp/getData/query";

      const queryParameters = {
        query: {
          expressions: [
            {
              field: "storeName",
              operand: "=",
              value: responseData.shop,
            },
          ],
          operator: "or",
        },
      };

      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(queryParameters),
      };

      try {
        const responseConnection = await fetch(apiUrl, requestOptions);

        const responseConnectionData = await responseConnection.json();

        if (
          Array.isArray(responseConnectionData) &&
          responseConnectionData.length > 0
        ) {
          console.log("Response data contains at least one element.");
          setConnected(true);
          setIsLoading(false);
        } else {
          console.log("Response data is empty or not an array.");
          setConnected(false);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error:", error.message);
        throw error; // Re-throw the error
      }
    } catch (error) {
      console.error("Error:", error.message);
      throw error; // Re-throw the error
    }
  };

  /*********************
  
  * Purpose: Set connection with Kore.ai
  * Description: To pass shopname and token to Kore.ai backend platform
  * Params: Shope Name, Shopify Token
  * Response: NA[Setting properties only]
  
  **********************/

  const setconnection = async (shopName, shopToken) => {
    const apiUrl =
      "https://retailassist-poc.kore.ai/datatables/shopifyApp/upsertData"; // Replace with your API endpoint

    const requestData = {
      data: {
        storeName: shopName,
        token: shopToken,
        version: "v4.1",
      },
    };

    const requestHeaders = {
      "Content-Type": "application/json",
    };

    const requestOptions = {
      method: "PUT", // Change the method to "PUT"
      headers: new Headers(requestHeaders),
      body: JSON.stringify(requestData),
    };

    try {
      const responsekore = await fetch(apiUrl, requestOptions);

      if (!responsekore.ok) {
        throw new Error(`HTTP error! Status: ${responsekore.status}`);
      }

      const responseDataKore = await responsekore.json();

      if (responseDataKore.nModified) {
        //console.log("Access information is already available with Kore.ai");
        setToastProps({
          content: t("kore.setConnection"),
        });
      } else {
        //console.log("Access information has been shared with Kore.ai");
        setToastProps({
          content: t("kore.setConnection"),
        });
      }
      setConnected(true);
      setKoreconnection(true);
      /* This means app is connected and user is asking to disconnect */
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  /*********************
  
  * Purpose: Delete Kore.ai
  * Description: To delete token Kore.ai backend platform
  * Params: Shope Name
  * Response: NA[Setting properties only]
  
  **********************/

  const deleteconnection = async (shopName) => {
    const apiUrl =
      "https://retailassist-poc.kore.ai/datatables/shopifyApp/deleteData";

    const requestData = {
      appName: shopName,
    };

    const requestOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    };

    try {
      const responseDelete = await fetch(apiUrl, requestOptions);

      if (!responseDelete.ok) {
        throw new Error(`HTTP error! Status: ${responseDelete.status}`);
      }

      const responseDeleteData = await responseDelete.json();

      setConnected(false);
      setToastProps({
        content: t("kore.deleteConnection"),
      });
    } catch (error) {
      console.error("Error:", error.message);
      setToastProps({
        content: t("kore.someError"),
      });
    }
  };

  /* Check the connection status with Kore.ai */
  if (!koreconnection) {
    getconnection();
    setKoreconnection(true); /* Setting property to avoid multiple calls */
  }

  return (
    <>
      {toastMarkup}
      <AccountConnection
        accountName={accountName}
        roundedAbove="lg"
        connected={connected}
        title={t("kore.title")}
        action={{
          content: buttonText,
          onAction: fetchsession,
          loading: isLoading,
        }}
        details={details}
        termsOfService={t("kore.description")}
      />
      <p>&nbsp;</p>
    </>
  );
}
