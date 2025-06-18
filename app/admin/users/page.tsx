import { requireAdmin } from "@/lib/auth-guard";

const AdminUsers = async () => {
  await requireAdmin();
  return <>Admin Users</>;
};

export default AdminUsers;
