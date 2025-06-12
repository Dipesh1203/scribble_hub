"use client";
import { Menu } from "@headlessui/react";
import { useSession, signOut } from "next-auth/react";
import { ChevronDown } from "lucide-react";

export default function ProfileDropdown() {
  const { data } = useSession();
  const user = data?.user;

  return (
    <div className="relative inline-block text-left">
      <Menu>
        <Menu.Button className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-md transition">
          <img
            src={user?.image || "/default-avatar.png"}
            alt="avatar"
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="text-sm font-medium">{user?.name || "User"}</span>
          <ChevronDown className="w-4 h-4 ml-1" />
        </Menu.Button>

        <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? "bg-gray-100" : ""
                  } w-full px-4 py-2 text-sm text-gray-700 text-left`}
                  onClick={() => console.log("Profile")}
                >
                  Profile
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? "bg-gray-100" : ""
                  } w-full px-4 py-2 text-sm text-gray-700 text-left`}
                  onClick={() => console.log("Settings")}
                >
                  Settings
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? "bg-gray-100" : ""
                  } w-full px-4 py-2 text-sm text-red-600 text-left`}
                  onClick={() => signOut()}
                >
                  Logout
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Menu>
    </div>
  );
}
