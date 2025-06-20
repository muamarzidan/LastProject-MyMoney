import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";

import {
  BoxCubeIcon,
  // CalenderIcon,
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  // ListIcon,
  // PageIcon,
  PieChartIcon,
  PlugInIcon,
  TableIcon,
  // UserCircleIcon,
  FolderIcon,
  DollarLineIcon,
  ShootingStarIcon
} from "../icons";
import { useSidebar } from "../context/SidebarContext";
import { getWallet } from "../resolver/wallet";


type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/",
  },
  {
    icon: <FolderIcon />,
    name: "Wallet",
    path: "/wallet",
  },
  {
    icon: <DollarLineIcon />,
    name: "Transaksi",
    subItems: [
      { name: "Income", path: "/transaction-income", pro: false },
      { name: "Outcome", path: "/transaction-outcome", pro: false },
    ],
  },
  {
    icon: <TableIcon />,
    name: "Kategori",
    path: "/category",
  },
  {
    icon: <ShootingStarIcon />,
    name: "Statistik",
    path: "/statistic",
  },
  // {
  //   icon: <CalenderIcon />,
  //   name: "Calendar",
  //   path: "/calendar",
  // },
  // {
  //   icon: <UserCircleIcon />,
  //   name: "User Profile",
  //   path: "/profile",
  // },
  // {
  //   name: "Forms",
  //   icon: <ListIcon />,
  //   subItems: [{ name: "Form Elements", path: "/form-elements", pro: false }],
  // },
  // {
  //   name: "Tables",
  //   icon: <TableIcon />,
  //   subItems: [{ name: "Basic Tables", path: "/basic-tables", pro: false }],
  // },
  // {
  //   name: "Pages",
  //   icon: <PageIcon />,
  //   subItems: [
  //     { name: "Blank Page", path: "/blank", pro: false },
  //     { name: "404 Error", path: "/error-404", pro: false },
  //   ],
  // },
];

const othersItems: NavItem[] = [
  {
    icon: <PieChartIcon />,
    name: "Charts",
    subItems: [
      { name: "Line Chart", path: "/line-chart", pro: false },
      { name: "Bar Chart", path: "/bar-chart", pro: false },
    ],
  },
  {
    icon: <BoxCubeIcon />,
    name: "UI Elements",
    subItems: [
      { name: "Alerts", path: "/alerts", pro: false },
      { name: "Avatar", path: "/avatars", pro: false },
      { name: "Badge", path: "/badge", pro: false },
      { name: "Buttons", path: "/buttons", pro: false },
      { name: "Images", path: "/images", pro: false },
      { name: "Videos", path: "/videos", pro: false },
    ],
  },
  {
    icon: <PlugInIcon />,
    name: "Authentication",
    subItems: [
      { name: "Sign In", path: "/signin", pro: false },
      { name: "Sign Up", path: "/signup", pro: false },
    ],
  },
];

const AppSidebar: React.FC = () => {
  const location = useLocation();
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const [dataWallet, setDataWallet] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchWalletData = async () => {
    setIsLoading(true);

    try {
      const response = await getWallet();
      setDataWallet(response.data);
    } catch (error) {
      console.error("Error fetching wallet data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, []);

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);

  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );

  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  useEffect(() => {
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const cekPath = location.pathname;

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
    <>
      {
        isLoading ? (
          <div className="flex items-center justify-center h-12">
            <span className="loader"></span>
          </div>
        ) : (
          <ul className="flex flex-col gap-4">
            {dataWallet.length === 0 || dataWallet === null ? (
              <>
                <li>
                  <Link to="/"  className={`menu-item group ${cekPath === "/" ? "menu-item-active" : "menu-item-inactive"}`}>
                    <span className="menu-item-icon-size menu-item-icon-active">
                      <GridIcon />
                    </span>
                    {(isExpanded || isHovered || isMobileOpen) && (
                      <span className="menu-item-text">Dashboard</span>
                    )}
                  </Link>
                </li>
                <li>
                  <Link to="/wallet" className={`menu-item group ${cekPath === "/wallet" ? "menu-item-active" : "menu-item-inactive"}`}>
                    <span className="menu-item-icon-size menu-item-icon-active">
                      <FolderIcon />
                    </span>
                    {(isExpanded || isHovered || isMobileOpen) && (
                      <span className="menu-item-text">Wallet </span>
                    )}
                  </Link>
                </li>
              </>
            ) : (
              items.map((nav, index) => (
                <li key={nav.name}>
                  {nav.subItems ? (
                    <button
                      onClick={() => handleSubmenuToggle(index, menuType)}
                      className={`menu-item group ${
                        openSubmenu?.type === menuType && openSubmenu?.index === index
                          ? "menu-item-active"
                          : "menu-item-inactive"
                      } cursor-pointer ${
                        !isExpanded && !isHovered
                          ? "lg:justify-center"
                          : "lg:justify-start"
                      }`}
                    >
                      <span
                        className={`menu-item-icon-size  ${
                          openSubmenu?.type === menuType &&
                          openSubmenu?.index === index
                            ? "menu-item-icon-active"
                            : "menu-item-icon-inactive"
                        }`}
                      >
                        {nav.icon}
                      </span>
                      {(isExpanded || isHovered || isMobileOpen) && (
                        <span className="menu-item-text">{nav.name}</span>
                      )}
                      {(isExpanded || isHovered || isMobileOpen) && (
                        <ChevronDownIcon
                          className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                            openSubmenu?.type === menuType &&
                            openSubmenu?.index === index
                              ? "rotate-180 text-brand-500"
                              : ""
                          }`}
                        />
                      )}
                    </button>
                  ) : (
                    nav.path && (
                      <Link
                        to={nav.path}
                        className={`menu-item group ${
                          isActive(nav.path)
                            ? "menu-item-active"
                            : "menu-item-inactive"
                        }`}
                      >
                        <span
                          className={`menu-item-icon-size ${
                            isActive(nav.path)
                              ? "menu-item-icon-active"
                              : "menu-item-icon-inactive"
                          }`}
                        >
                          {nav.icon}
                        </span>
                        {(isExpanded || isHovered || isMobileOpen) && (
                          <span className="menu-item-text">{nav.name}</span>
                        )}
                      </Link>
                    )
                  )}
                  {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
                    <div
                      ref={(el) => {
                        subMenuRefs.current[`${menuType}-${index}`] = el;
                      }}
                      className="overflow-hidden transition-all duration-300"
                      style={{
                        height:
                          openSubmenu?.type === menuType &&
                          openSubmenu?.index === index
                            ? `${subMenuHeight[`${menuType}-${index}`]}px`
                            : "0px",
                      }}
                    >
                      <ul className="mt-2 space-y-1 ml-9">
                        {nav.subItems.map((subItem) => (
                          <li key={subItem.name}>
                            <Link
                              to={subItem.path}
                              className={`menu-dropdown-item ${
                                isActive(subItem.path)
                                  ? "menu-dropdown-item-active"
                                  : "menu-dropdown-item-inactive"
                              }`}
                            >
                              {subItem.name}
                              <span className="flex items-center gap-1 ml-auto">
                                {subItem.new && (
                                  <span
                                    className={`ml-auto ${
                                      isActive(subItem.path)
                                        ? "menu-dropdown-badge-active"
                                        : "menu-dropdown-badge-inactive"
                                    } menu-dropdown-badge`}
                                  >
                                    new
                                  </span>
                                )}
                                {subItem.pro && (
                                  <span
                                    className={`ml-auto ${
                                      isActive(subItem.path)
                                        ? "menu-dropdown-badge-active"
                                        : "menu-dropdown-badge-inactive"
                                    } menu-dropdown-badge`}
                                  >
                                    pro
                                  </span>
                                )}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))
            )}
          </ul>
        )
      }
    </>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-center"
        }`}
      >
        <Link to="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <h1 className="text-2xl font-bold"><span className="text-blue-600">M</span>y<span className="text-blue-600">M</span>oney</h1>
            </>
          ) : (
              <h1 className="text-md font-bold">M <span className="text-blue-600">M</span></h1>
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <HorizontaLDots className="size-6" />
                )}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;