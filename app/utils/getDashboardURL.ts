export default function getDashboardURL(userRole: string): string {
  let dashbordRedirectPath = "";

  switch (userRole) {
    case "USER":
      dashbordRedirectPath = "/dashboard/user";
      break;
    case "REVIEWER":
      dashbordRedirectPath = "/dashboard/reviewer";
      break;
    case "ADMIN":
      dashbordRedirectPath = "/dashboard/admin";
      break;
    default:
      dashbordRedirectPath = "/";
  }

  return dashbordRedirectPath;
}
