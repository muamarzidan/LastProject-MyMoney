import { HelmetProvider, Helmet } from "react-helmet-async";

const PageMeta = ({
  title,
  description,
  keywords,
  author,
  robots,
  ogTitle,
  ogDescription,
  ogImage,
  ogUrl
}: {
  title: string;
  description: string;
  keywords?: string;
  author?: string;
  robots?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string; 
}) => (
  <Helmet>
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta name="keywords" content={keywords} />
    <meta name="author" content={author} />
    <meta name="robots" content={robots} />
    <meta property="og:title" content={ogTitle} />
    <meta property="og:description" content={ogDescription} />
    <meta property="og:image" content={ogImage} />
    <meta property="og:url" content={ogUrl} />
  </Helmet>
);

export const AppWrapper = ({ children }: { children: React.ReactNode }) => (
  <HelmetProvider>{children}</HelmetProvider>
);

export default PageMeta;
