import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="MyMoney - Sign In"
        description="My Money is a dashboard personal finance management application that helps you track your income and expenses, set budgets, and manage your finances effectively."
        keywords="MyMoney, Sign In, Personal Finance, Dashboard"
        author="MyMoney Team"
        robots="index, follow"
        ogTitle="MyMoney - Sign In"
        ogDescription="My Money is a dashboard personal finance management application that helps you track your income and expenses, set budgets, and manage your finances effectively."
        ogImage="/images/og-image.png"
        ogUrl="https://mymoney.com/signin"
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
};