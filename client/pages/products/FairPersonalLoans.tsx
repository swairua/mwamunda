import ProductPage from "@/components/site/ProductPage";
import { getProduct } from "@/content/products";

export default function FairPersonalLoans() {
  return <ProductPage product={getProduct("fair-personal-loans")} />;
}
