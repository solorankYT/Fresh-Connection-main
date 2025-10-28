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

export default function Dashboard({ summary, chartData, topCustomers, topProducts, summaryUser }) {
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
                <Breadcrumb className="mt-18 p-4 bg-white shadow-sm rounded-md mb-4">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/"><HomeIcon className="w-4 h-4" /></BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Dashboard</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <h1 className="text-lg font-bold mb-2">Product Status</h1>
                <div className="flex gap-x-4 mb-4">
                    {renderProductCard("Total Products", summary.totalProducts, "Combined number of products", "text-green-900")}
                    {renderProductCard("Active", summary.activeProducts, "Total number of active products", "text-green-900")}
                    {renderProductCard("Inactive", summary.inactiveProducts, "Total number of inactive products", "text-red-600")}
                    {renderProductCard("Out of stock", summary.outOfStockProducts, "Number of products that are out of stock", "text-red-600")}
                </div>

                <h1 className="text-lg font-bold mb-2">Order Summary</h1>
                <div className="flex gap-x-4 mb-4">
                    <Card className="w-3/5">
                        <CardHeader>
                            <CardTitle>Monthly Orders</CardTitle>
                            <CardDescription>Last 6 Months</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer className="px-4 py-2" style={{ width: '100%', aspectRatio: '20/9' }} config={lineChartConfig}>
                                <LineChart data={chartData} margin={{ left: 12, right: 12 }}>
                                    <CartesianGrid vertical={false} />
                                    <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value.slice(0, 3)} />
                                    <ChartTooltip
                                        cursor={false}
                                        content={(props) => (
                                            <ChartTooltipContent {...props} labelFormatter={(label) => `Month: ${label}`} formatter={(value) => [`${value} orders`, ""]} />
                                        )}
                                    />
                                    <Line dataKey="orders" stroke="var(--color-orders)" strokeWidth={2} dot={true} activeDot={{ r: 4 }} />
                                </LineChart>
                            </ChartContainer>
                        </CardContent>
                        <CardFooter className="flex-col items-start gap-2 text-sm">
                            <div className="flex gap-2 font-medium leading-none">
                                {chartData?.length >= 2 && (() => {
                                    const currentMonth = chartData[chartData.length - 1].orders;
                                    const previousMonth = chartData[chartData.length - 2].orders;
                                    const percentChange = previousMonth === 0 ? 100 : ((currentMonth - previousMonth) / previousMonth * 100).toFixed(1);
                                    const isUp = currentMonth >= previousMonth;

                                    return (
                                        <>
                                            <span>{isUp ? "Trending up" : "Trending down"} by {Math.abs(percentChange)}% this month</span>
                                            <TrendingUp className={`h-4 w-4 ${!isUp ? 'rotate-180' : ''}`} />
                                        </>
                                    );
                                })()}
                            </div>
                            <div className="leading-none text-muted-foreground">Showing total orders for the last 6 months</div>
                        </CardFooter>
                    </Card>

                    <div className="flex flex-col gap-y-4 w-2/5">
                        <Card className="h-1/2">
                            <CardHeader>
                                <CardTitle>Top 5 Customers</CardTitle>
                                <CardDescription>Last 6 Months</CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-row justify-between scrollbar-thin">
                                {topCustomers?.length ? topCustomers.map((customer, index) => (
                                    <HoverCard key={customer.id}>
                                        <HoverCardTrigger asChild>
                                            <div className={`w-18 h-18 rounded-md flex-shrink-0 ${index === 0 ? 'border-yellow-400 border-2' : ''}`}>
                                                {customer.user_image ? (
                                                    <img src={`/storage/${customer.user_image}`} alt={`${customer.first_name} ${customer.last_name}`} className="h-full w-full bg-white object-cover rounded-md" />
                                                ) : (
                                                    <UserPlaceholder size="md" bgColor="bg-white" border="" rounded="rounded-md" className="h-full w-full" />
                                                )}
                                                <div className="text-center text-xs text-gray-700 p-1">{customer.first_name} {customer.last_name}</div>
                                            </div>
                                        </HoverCardTrigger>
                                        <HoverCardContent className="w-72 p-4">
                                        </HoverCardContent>
                                    </HoverCard>
                                )) : <Placeholder />}
                            </CardContent>
                        </Card>

                        <Card className="h-1/2">
                            <CardHeader>
                                <CardTitle>Top 5 Products</CardTitle>
                                <CardDescription>Last 6 Months</CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-row justify-between scrollbar-thin">
                                {topProducts?.length ? topProducts.map((product, index) => (
                                    <HoverCard key={product.product_id}>
                                        <HoverCardTrigger asChild>
                                            <div className={`w-18 h-18 rounded-md flex-shrink-0 ${index === 0 ? 'border-yellow-400 border-2' : ''}`}>
                                                {product.product_image ? (
                                                    <img src={`/storage/${product.product_image}`} alt={product.product_name} className="h-full w-full bg-white object-cover rounded-md" />
                                                ) : (
                                                    <div className="h-full w-full bg-white rounded-md flex items-center justify-center"><PackageIcon className="h-8 w-8 text-gray-400" /></div>
                                                )}
                                                <div className="text-center text-xs text-gray-700 p-1">{product.product_name}</div>
                                            </div>
                                        </HoverCardTrigger>
                                        <HoverCardContent className="w-72 p-4">
                                        </HoverCardContent>
                                    </HoverCard>
                                )) : <Placeholder />}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <h1>Users</h1>
                <header className="flex gap-x-4 mb-4">
                    {renderProductCard("Total Users", summaryUser.totalUsers, "users", "text-green-900")}
                    {renderProductCard("Active Users", summaryUser.activeUsers, "users", "text-green-900")}
                    {renderProductCard("Inactive Users", summaryUser.inactiveUsers, "users", "text-red-600")}
                </header>
            </ErrorBoundary>
        </AppLayout>
    );
}

const Placeholder = () => (
    <div className="w-16 h-16 rounded-md border-yellow-400 border-2 flex-shrink-0 bg-gray-100 flex items-center justify-center">
        <PackageIcon className="h-8 w-8 text-gray-400" />
    </div>
);
