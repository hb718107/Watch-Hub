import { collection, addDoc, getDocs, query, where, writeBatch, doc } from "firebase/firestore";
import { db } from "../firebase";
import { products, categories } from "../data/products";

export const seedDatabase = async () => {
    try {
        const productsCollection = collection(db, "products");
        const categoriesCollection = collection(db, "categories");

        // Check if data exists to avoid duplicates
        const snapshot = await getDocs(productsCollection);
        if (!snapshot.empty) {
            console.log("Database already has data. Skipping seed.");
            return;
        }

        console.log("Seeding database...");
        const batch = writeBatch(db);

        // Upload Categories
        for (const cat of categories) {
            const catRef = doc(categoriesCollection); // Auto-ID
            batch.set(catRef, cat);
        }

        // Upload Products
        for (const product of products) {
            const prodRef = doc(productsCollection); // Auto-ID
            batch.set(prodRef, product);
        }

        await batch.commit();
        console.log("Database seeded successfully!");
        alert("Database seeded successfully! You can now remove the seed button.");
    } catch (error) {
        console.error("Error seeding database:", error);
        alert("Error seeding database: " + error.message);
    }
};
