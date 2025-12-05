import AppLayout from "../../Layouts/AppLayout";
import { PackageIcon, TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import UserPlaceholder from "../../Components/UserPlaceholder";
import ErrorBoundary from "@/resources/js/Components/ErrorBoundary";
import { HomeIcon } from "@heroicons/react/24/outline";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import ProductVelocityChart from "../../Components/ProductVelocityChart";

export default function Dashboard({ summary, chartData, topCustomers, topProducts, summaryUser, slowProducts, salesSummary }) {
    const lineChartConfig = {
        orders: {
            label: "Orders",
            color: "#14532d",
        },
    };

    const renderProductCard = (title, count, description, color) => (
        <Card className="flex-grow">
            <CardContent className="flex items-center h-full">
                <div className="flex-grow">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
                    <div className="flex items-baseline">
                        <span className="text-3xl font-semibold text-gray-900">{count}</span>
                    </div>
                    <p className={`text-xs ${color} mt-2 flex items-center`}>
                        <span>{description}</span>
                    </p>
                </div>
            </CardContent>
        </Card>
    );

    return (
        <AppLayout>
  <ErrorBoundary>
    {/* Breadcrumb */}
    <Breadcrumb className="mt-4 p-4 bg-white shadow-sm rounded-md mb-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/"><HomeIcon className="w-4 h-4" /></BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem><BreadcrumbPage>Dashboard</BreadcrumbPage></BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>

    {/* Top KPIs: Products and Users */}
    <h1>Products Information</h1>
     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {renderProductCard("Total Products", summary.totalProducts, "Combined number of products", "text-green-900")}
        {renderProductCard("Active", summary.activeProducts, "Active products", "text-green-900")}
        {renderProductCard("Inactive", summary.inactiveProducts, "Inactive products", "text-red-600")}
        {renderProductCard("Out of stock", summary.outOfStockProducts, "Out of stock", "text-red-600")}
        </div>

      <div className="flex gap-4 my-4 flex-col sm:flex-row justify-between items-center">
        {/* <a 
          href="/reports/sales/excel" 
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Export Excel
        </a> */}
        <h1>Sales Overview</h1>
        <a 
          href="/reports/sales/pdf" 
          className="px-4 py-2 bg-red-600 text-white rounded"
        >
          Export all in PDF
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

        {renderProductCard(
          "Total Products Sold",
          salesSummary.total_products_sold ?? 0,
          "All-time quantity sold",
          "text-green-900"
        )}

        {renderProductCard(
          "Total Revenue",
          `₱${Number(salesSummary.total_revenue ?? 0).toLocaleString()}`,
          "Total earnings",
          "text-green-900"
        )}

        {renderProductCard(
          "Total Orders",
          salesSummary.total_orders ?? 0,
          "Completed orders",
          "text-green-900"
        )}

        {renderProductCard(
          "Average Order Value",
          `₱${Number(salesSummary.average_order_value ?? 0).toLocaleString()}`,
          "Revenue per order",
          "text-green-900"
        )}

      </div>


        <h1>TOP & SLOW PRODUCTS</h1>
    <div className="grid grid-cols-2 gap-4 mb-4">
      {/* Top Products */}
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Top Products</CardTitle>
          <CardDescription>Last 6 Months</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 max-h-100 overflow-y-auto scrollbar-thin">
          {topProducts?.length ? topProducts.map(p => (
            <div key={p.product_id} className="flex items-center gap-2 p-1 rounded hover:bg-green-50 border-l-2 border-green-200">
              {p.product_image ? (
                <img src={`/storage/${p.product_image}`} alt={p.product_name} className="w-10 h-10 object-cover rounded-md" />
              ) : (
                <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center">
                  <PackageIcon className="h-6 w-6 text-gray-400" />
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-sm text-gray-700 font-medium truncate">{p.product_name}</span>
                <span className="text-xs text-gray-500">
                  Sold: {p.total_quantity} 
                  {/* | {p.days_since_last_sale === 999 ? "Never sold" : `Last sold: ${p.days_since_last_sale} days ago`} */}
                </span>
              </div>
            </div>
          )) : <Placeholder />}
        </CardContent>
      </Card>
    
    
      {/* Slow Products */}
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Slow Products</CardTitle>
          <CardDescription>Last 6 Months</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 max-h-100 overflow-y-auto scrollbar-thin">
          {slowProducts?.length ? slowProducts.map(p => (
            <div key={p.product_id} className="flex items-center gap-2 p-1 rounded hover:bg-red-50 border-l-2 border-red-200">
              {p.product_image ? (
                <img src={`/storage/${p.product_image}`} alt={p.product_name} className="w-10 h-10 object-cover rounded-md" />
              ) : (
                <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center">
                  <PackageIcon className="h-6 w-6 text-gray-400" />
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-sm text-gray-700 font-medium truncate">{p.product_name}</span>
                <span className="text-xs text-gray-500">
                  Sold: {p.total_quantity_sold}
                </span>
              </div>
            </div>
          )) : <Placeholder />}
        </CardContent>
      </Card>

    </div>

            <h1>Users KPI</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-6">
        {renderProductCard("Total Users", summaryUser.totalUsers, "Users", "text-green-900")}
        {renderProductCard("Active Users", summaryUser.activeUsers, "Users", "text-green-900")}
        {/* {renderProductCard("Inactive Users", summaryUser.inactiveUsers, "Users", "text-red-600")} */}
      </div>
     
          <h1>Orders</h1>
    {/* Orders Chart */}
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Monthly Orders</CardTitle>
        <CardDescription>Last 6 Months</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer style={{ width: "100%", aspectRatio: "20/9" }} config={lineChartConfig}>
          <LineChart data={chartData} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={val => val.slice(0,3)} />
            <ChartTooltip
              cursor={false}
              content={props => (
                <ChartTooltipContent
                  {...props}
                  labelFormatter={label => `Month: ${label}`}
                  formatter={value => [`${value} orders`, ""]}
                />
              )}
            />
            <Line dataKey="orders" stroke="var(--color-orders)" strokeWidth={2} dot activeDot={{ r: 4 }} />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          {chartData?.length >= 2 && (() => {
            const current = chartData[chartData.length-1].orders;
            const prev = chartData[chartData.length-2].orders;
            const percent = prev === 0 ? 100 : ((current - prev)/prev*100).toFixed(1);
            const isUp = current >= prev;
            return (
              <>
                <span>{isUp ? "Trending up" : "Trending down"} by {Math.abs(percent)}%</span>
                <TrendingUp className={`h-4 w-4 ${!isUp ? "rotate-180" : ""}`} />
              </>
            );
          })()}
        </div>
        <div className="text-muted-foreground">Showing total orders for the last 6 months</div>
      </CardFooter>
    </Card>

    {/* Product Performance Section */}
    
  </ErrorBoundary>
</AppLayout>

    );
}

const Placeholder = () => (
    <div className="w-16 h-16 rounded-md border-yellow-400 border-2 flex-shrink-0 bg-gray-100 flex items-center justify-center">
        <PackageIcon className="h-8 w-8 text-gray-400" />
    </div>
);
