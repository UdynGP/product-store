import { requireAdmin } from "@/lib/auth-guard";

const AdminProductsPage = async () => {
  await requireAdmin();
  return <>Admin Products</>;
};

export default AdminProductsPage;
