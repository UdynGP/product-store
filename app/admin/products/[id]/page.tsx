import { requireAdmin } from "@/lib/auth-guard";

const AdminProductUpdatePage = async () => {
  await requireAdmin();
  return <>Update Product</>;
};

export default AdminProductUpdatePage;
