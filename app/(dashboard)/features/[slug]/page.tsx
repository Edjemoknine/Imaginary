import type { Metadata } from "next";
import { notFound } from "next/navigation";
import FeatureDetail from "@/components/pixelmorph/FeatureDetail";
import { features, featureBySlug } from "@/components/pixelmorph/features";

type PageProps = {
  params: { slug: string };
};

export function generateStaticParams() {
  return features.map(({ slug }) => ({ slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const feature = featureBySlug(params.slug);
  if (!feature) return { title: "Feature not found | PixelMorph AI" };

  return {
    title: `${feature.title} | PixelMorph AI`,
    description: feature.detail,
  };
}

export default function FeaturePage({ params }: PageProps) {
  const feature = featureBySlug(params.slug);
  if (!feature) notFound();

  return <FeatureDetail slug={feature.slug} />;
}
