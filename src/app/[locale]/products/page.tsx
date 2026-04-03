import ProductsModule from "@/modules/products/page";

export default async function Page(props: { searchParams: Promise<{ category?: string, q?: string }> }) {
  const searchParams = await props.searchParams;
  return <ProductsModule searchParams={searchParams} />;
}
