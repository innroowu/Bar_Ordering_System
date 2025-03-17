class InventoryManager {
    constructor() {
        this.inventory = {};
    }

    // Load initial inventory from JSON
    async loadInventoryFromJson(category) {
        try {
            const response = await fetch(`/data/${category}.json`);
            const products = await response.json();
            
            products.forEach(product => {
                this.inventory[product.id] = {
                    name: product.name,
                    quantity: product.initialStock || 10  // Default initial stock
                };
            });
        } catch (error) {
            console.error(`Inventory load error for ${category}:`, error);
        }
    }

    // Reduce stock
    reduceStock(productId, quantity = 1) {
        if (this.inventory[productId]) {
            this.inventory[productId].quantity -= quantity;
        }
    }

    // Add stock
    addStock(productId, quantity = 1) {
        if (this.inventory[productId]) {
            this.inventory[productId].quantity += quantity;
        }
    }

    // Check if stock is low
    isLowStock(productId, threshold = 3) {
        return this.inventory[productId] && 
               this.inventory[productId].quantity <= threshold;
    }

    // Get complete inventory list
    getInventoryList() {
        return Object.entries(this.inventory).map(([id, details]) => ({
            id,
            name: details.name,
            quantity: details.quantity
        }));
    }
}