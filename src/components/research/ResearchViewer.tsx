"use client";

import ResearchDocViewer from "./ResearchDocViewer";
import type { ResearchItem } from "@/types";

interface Props {
  researchItems: ResearchItem[];
}

export default function ResearchViewer({ researchItems }: Props) {
  return <ResearchDocViewer researchItems={researchItems} />;
}

