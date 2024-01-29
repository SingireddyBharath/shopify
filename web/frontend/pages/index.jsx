import {
  Card,
  Page,
  Layout,
  TextContainer,
  Image,
  Stack,
  Link,
  Text,
  LegacyCard,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useTranslation, Trans } from "react-i18next";
import { trophyImage } from "../assets";
import { ProductsCard } from "../components";
import { StaticContent } from "../components";
import React, { useState, useEffect } from 'react';
import { useAppQuery, useAuthenticatedFetch } from "../hooks";

export default function HomePage() {

  const fetch = useAuthenticatedFetch();
  const [accessTokenState, setAccessTokenState] = useState('');

  // Define the fetchData function
  const fetchData = async () => {
    try {
      const response = await fetch("/api/shopData");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const responseData = await response.json();
      // Update accessTokenState with the accessToken value
      setAccessTokenState(responseData.data[0].name);
      //console.log('Updated accessTokenState:', accessTokenState);
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  // Use useEffect to call fetchData when the component mounts
  useEffect(() => {
    fetchData();
  }, []); // Empty dependency array ensures it only runs once on mount
  // Rest of your component logic...

  const { t } = useTranslation();
  return (
    <Page fullWidth>
      <TitleBar title={`Hi ${accessTokenState},`}
        primaryAction={null} />
      <Layout>
        <Layout.Section>
          <ProductsCard />
          <StaticContent />
        </Layout.Section>
      </Layout>
    </Page>
  );
}

