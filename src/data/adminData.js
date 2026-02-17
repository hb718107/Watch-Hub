export const mockOrders = [
    {
        id: "ORD-001",
        customer: "John Doe",
        date: "2024-02-15",
        total: 25000,
        status: "Delivered",
        items: 2
    },
    {
        id: "ORD-002",
        customer: "Jane Smith",
        date: "2024-02-16",
        total: 12500,
        status: "Processing",
        items: 1
    },
    {
        id: "ORD-003",
        customer: "Robert Brown",
        date: "2024-02-17",
        total: 45000,
        status: "Pending",
        items: 3
    },
    {
        id: "ORD-004",
        customer: "Alice Johnson",
        date: "2024-02-17",
        total: 8900,
        status: "Cancelled",
        items: 1
    }
];

export const mockStats = {
    totalRevenue: 125000,
    totalOrders: 45,
    totalProducts: 12,
    totalCustomers: 38
};

export const recentActivity = [
    { type: "order", message: "New order #ORD-003 from Robert Brown", time: "2 hours ago" },
    { type: "review", message: "New 5-star review on 'Cosmograph Daytona'", time: "5 hours ago" },
    { type: "user", message: "New user registration: Sarah Connor", time: "1 day ago" }
];

export const mockReviews = [
    {
        id: "REV-001",
        productId: "1", // Use generic IDs, will map later or use real IDs if known
        user: "Alice J.",
        rating: 5,
        comment: "Absolutely stunning watch. The finish is impeccable.",
        date: "2024-02-10"
    },
    {
        id: "REV-002",
        productId: "1",
        user: "Mark T.",
        rating: 4,
        comment: "Great watch but the strap is a bit stiff at first.",
        date: "2024-02-12"
    },
    {
        id: "REV-003",
        productId: "2",
        user: "Sarah C.",
        rating: 5,
        comment: "Best investment I've made. Looks worth double the price.",
        date: "2024-02-14"
    }
];
