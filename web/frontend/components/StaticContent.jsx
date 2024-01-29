import { useState } from "react";
import { Card, TextContainer, Text, List, Grid, LegacyCard } from "@shopify/polaris";
import { Toast } from "@shopify/app-bridge-react";
import { useTranslation } from "react-i18next";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";
import React from 'react';

export function StaticContent() {

  const { t } = useTranslation();


  return (
    <>
      <LegacyCard
        title="How it works?"
        roundedAbove="md"
        sectioned>
        <TextContainer spacing="loose">
          <li>{t("kore.howItWorks1")}</li>
          <li>{t("kore.howItWorks2")}</li>
          <li>{t("kore.howItWorks3")}</li>
          <li>{t("kore.howItWorks4")}</li>
        </TextContainer>
      </LegacyCard>

      <LegacyCard
        title="Key Features include:"
        roundedAbove="md"
        sectioned>
        <TextContainer spacing="loose">
        <ul className="twocolumnstructure" column-count="2">
          <li>{t("kore.keyFeatures1")}</li>
          <li>{t("kore.keyFeatures2")}</li>
          <li>{t("kore.keyFeatures3")}</li>
          <li>{t("kore.keyFeatures4")}</li>
          <li>{t("kore.keyFeatures5")}</li>
          <li>{t("kore.keyFeatures6")}</li>
          <li>{t("kore.keyFeatures7")}</li>
          <li>{t("kore.keyFeatures8")}</li>
          <li>{t("kore.keyFeatures9")}</li>
        </ul>
        </TextContainer>
      </LegacyCard>

      <LegacyCard
        title="What's coming next?"
        roundedAbove="md"
        sectioned>
        <TextContainer spacing="loose">
          <li>{t("kore.comingNext1")}</li>
          <li>{t("kore.comingNext2")}</li>
          <li>{t("kore.comingNext3")}</li>
          <li>{t("kore.comingNext4")}</li>
          <li>{t("kore.comingNext5")}</li>
        </TextContainer>
      </LegacyCard>
    </>
  );
}
