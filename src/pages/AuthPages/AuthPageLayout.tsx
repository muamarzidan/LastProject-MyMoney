import React from "react";
import GridShape from "../../components/common/GridShape";


export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative p-6 bg-[url('/images/wave22.svg')] bg-no-repeat bg-cover bg-[0px_20px] sm:p-0">
      <div className="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900 sm:p-0">
        {children}
        <div className="items-center hidden w-full h-full lg:w-1/2 lg:grid">
          <div className="relative flex items-center justify-center z-1">
            <GridShape />
            <div className="flex flex-col items-center max-w-md">
              <h1 className="text-2xl text-white">Welcome <span className="font-bold">MyMoney</span></h1>
              <p className="text-center text-white">
                My Money is a dashboard personal finance management.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
