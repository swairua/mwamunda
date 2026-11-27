import ProductPage from "@/components/site/ProductPage";
import { getProduct } from "@/content/products";

export default function FinancialCapabilityTraining() {
  return <ProductPage product={getProduct("financial-capability-training")} />;
}
