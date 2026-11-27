import ProductPage from "@/components/site/ProductPage";
import { getProduct } from "@/content/products";

export default function ChamaLoans() {
  return <ProductPage product={getProduct("chama-loans")} />;
}
