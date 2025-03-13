class InventoryManager {
    constructor() {
        this.inventory = {}; // products keyed by id
    }

    // Load inventory from JSON for a given category
    async loadInventoryFromJson(category) {
        try {
            const response = await fetch(`http://localhost:3000/${category}`);
            const products = await response.json();
            products.forEach(product => {
                // Use a conditional check so 0 is accepted
                this.inventory[product.id] = {
                    name: product.name,
                    quantity: (product.details.initialStock !== undefined) ? product.details.initialStock : 10,
                    category: category,
                    price: product.price,
                    hidden: product.hidden || false
                };
            });
        } catch (error) {
            console.error(`Inventory load error for ${category}:`, error);
        }
    }
    

    // Hide a product by updating JSON (set hidden to true)
    async removeProduct(productId) {
        const item = this.inventory[productId];
        if (!item) return;
        try {
            await fetch(`http://localhost:3000/${item.category}/${productId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ hidden: true })
            });
            // Update local inventory object
            this.inventory[productId].hidden = true;
        } catch (error) {
            console.error(`Failed to hide product ${productId}:`, error);
        }
    }

    // Adjust product price
    async adjustProductPrice(productId, newPrice, comment, reason) {
        const item = this.inventory[productId];
        if (!item) return;
        try {
            await fetch(`http://localhost:3000/${item.category}/${productId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ price: newPrice })
            });
            // Optionally log comment and reason; for now, update local price
            this.inventory[productId].price = newPrice;
        } catch (error) {
            console.error(`Failed to adjust price for product ${productId}:`, error);
        }
    }

    // Other methods (reduceStock, addStock, etc.) remain the same…
    reduceStock(productId, quantity = 1) {
        if (this.inventory[productId]) {
            this.inventory[productId].quantity -= quantity;
        }
    }

    addStock(productId, quantity = 1) {
        if (this.inventory[productId]) {
            this.inventory[productId].quantity += quantity;
        }
    }

    isLowStock(productId, threshold = 3) {
        return this.inventory[productId] && this.inventory[productId].quantity <= threshold;
    }

    getInventoryList() {
        return Object.entries(this.inventory).map(([id, details]) => ({
            id,
            name: details.name,
            quantity: details.quantity,
            category: details.category,
            price: details.price,
            hidden: details.hidden
        }));
    }

    // New method to toggle product visibility
    async toggleProductVisibility(productId, newVisibility) {
        const item = this.inventory[productId];
        if (!item) return;
        try {
            await fetch(`http://localhost:3000/${item.category}/${productId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ hidden: newVisibility })
            });
            // Update local inventory flag
            this.inventory[productId].hidden = newVisibility;
        } catch (error) {
            console.error(`Failed to update product visibility for ${productId}:`, error);
        }
    }

}
