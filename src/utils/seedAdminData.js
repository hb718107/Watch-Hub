import { collection, writeBatch, doc, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { mockOrders, mockReviews } from '../data/adminData';

export const seedAdminData = async () => {
    try {
        const ordersCollection = collection(db, "orders");
        const reviewsCollection = collection(db, "reviews");

        // Check if data exists to avoid duplicates
        const ordersSnapshot = await getDocs(ordersCollection);
        if (!ordersSnapshot.empty) {
            const confirm = window.confirm("Orders collection already has data. Do you want to overwrite/append? (Cancel to stop)");
            if (!confirm) return;
        }

        console.log("Seeding admin data...");
        const batch = writeBatch(db);

        // Upload Orders
        for (const order of mockOrders) {
            const orderRef = doc(ordersCollection, order.id); // Use ID from mock data
            batch.set(orderRef, order);
        }

        // Upload Reviews
        for (const review of mockReviews) {
            const reviewRef = doc(reviewsCollection, review.id); // Use ID from mock data
            batch.set(reviewRef, review);
        }

        await batch.commit();
        console.log("Admin data seeded successfully!");
        alert("Orders and Reviews seeded successfully!");
    } catch (error) {
        console.error("Error seeding admin data:", error);
        alert("Error seeding data: " + error.message);
    }
};
