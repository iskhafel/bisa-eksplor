import {
  HiUser,
  HiPhotograph,
  HiTag,
  HiViewGrid,
  HiOutlineClipboardList,
  HiShoppingCart,
} from "react-icons/hi";
import { Link } from "react-router-dom";
import { Sidebar } from "flowbite-react";

export default function AdminSidebar() {
  return (
    <div>
      <Sidebar aria-label="Admin Dashboard Sidebar" className="h-full w-48">
        <Sidebar.Items>
          <Sidebar.ItemGroup>
            <Sidebar.Item icon={HiUser} to="/dashboard/user" as={Link}>
              User
            </Sidebar.Item>
            <Sidebar.Item icon={HiPhotograph} to="/dashboard/banner" as={Link}>
              Banner
            </Sidebar.Item>
            <Sidebar.Item icon={HiTag} to="/dashboard/promo" as={Link}>
              Promo
            </Sidebar.Item>
            <Sidebar.Item icon={HiViewGrid} to="/dashboard/category" as={Link}>
              Category
            </Sidebar.Item>
            <Sidebar.Item
              icon={HiOutlineClipboardList}
              to="/dashboard/activity"
              as={Link}
            >
              Activity
            </Sidebar.Item>
            <Sidebar.Item
              icon={HiShoppingCart}
              to="/dashboard/transaction"
              as={Link}
            >
              Transaction
            </Sidebar.Item>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
    </div>
  );
}
