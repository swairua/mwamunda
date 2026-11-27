import ProductPage from "@/components/site/ProductPage";
import { getProduct } from "@/content/products";

export default function DebtAdviceServices() {
  return <ProductPage product={getProduct("debt-advice-services")} />;
}
