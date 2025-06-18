import { requireAdmin } from "@/lib/auth-guard";

const CreateProductPage = async () => {
  await requireAdmin();
  return <>Update Product</>;
};

export default CreateProductPage;
