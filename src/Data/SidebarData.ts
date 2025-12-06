import {
  BarChart3,
  FileText,
  LayoutDashboard,
  LifeBuoy,
  Package,
  Send,
  Settings,
  ShoppingCart,
  Users
} from "lucide-react";
export const SidebarLinks = {
  user: {
    name: "RTECH",
    email: "rtech@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "RTECH",
      logo: ShoppingCart,
      plan: "Mart",
    }
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Billing & Sales",
      url: "#",
      icon: ShoppingCart,
      items: [
        {
          title: "Sales Overview", 
          url: "/sales/overview",  
        },
        {
          title: "New Sale (Scan & Bill)",
          url: "/sales/new",
        },
        {
          title: "Saved Bills",
          url: "/sales/saved",
        },
        {
          title: "Sales History",
          url: "/sales/history",
        },
        {
          title: "Reprint Invoice",
          url: "/sales/reprint",
        },
      ],
    },
    {
      title: "Invoices",
      url: "#",
      icon: FileText,
      items: [
        {
          title: "All Invoices",
          url: "/invoices/all",
        },
        {
          title: "Create Invoice",
          url: "/invoices/create",
        },
        {
          title: "Pending Payments",
          url: "/invoices/pending",
        },
        {
          title: "Paid Invoices",
          url: "/invoices/paid",
        },
        {
          title: "Refunded Invoices",
          url: "/invoices/refunded",
        },
        {
          title: "Suspended Invoices",
          url: "/invoices/suspended"
        },
      ],
    },
    {
      title: "Inventory",
      url: "#",
      icon: Package,
      items: [
        {
          title: "Stock Overview",
          url: "/inventory/overview",
        },
        {
          title: "Add New Product",
          url: "/inventory/add",
        },
        {
          title: "Price Updates",
          url: "/inventory/price-update",
        },
        {
          title: "Low Stock Alerts",
          url: "/inventory/alerts",
        },
      ],
    },
    {
      title: "Customers",
      url: "#",
      icon: Users,
      items: [
        {
          title: "New Customer",
          url: "/customers/add",
        },
        {
          title: "Customer List",
          url: "/customers/list",
        },
        {
          title: "Loyalty Points & Discounts",
          url: "/customers/loyalty",
        },
      ],
    },
    {
      title: "Reports",
      url: "#",
      icon: BarChart3,
      items: [
        {
          title: "Daily Sales Report",
          url: "/reports/daily",
        },
        {
          title: "Monthly Sales Report",
          url: "/reports/monthly",
        },
        {
          title: "Inventory Report",
          url: "/reports/inventory",
        },
        {
          title: "Tax & Revenue Report",
          url: "/reports/tax",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings,
      items: [
        {
          title: "General",
          url: "/settings/general",
        },
        {
          title: "Team",
          url: "/settings/team",
        },
        {
          title: "Billing",
          url: "/settings/billing",
        },
        {
          title: "Limits",
          url: "/settings/limits",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
};