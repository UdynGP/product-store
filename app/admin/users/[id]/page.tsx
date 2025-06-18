import { requireAdmin } from "@/lib/auth-guard";

const AdminUserUpdatePage = async () => {
  await requireAdmin();
  return <>Update User</>;
};

export default AdminUserUpdatePage;
