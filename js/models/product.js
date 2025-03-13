class Product {
    constructor(id, name, price, category, details) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.category = category;
        this.details = details || {};
        
        // Ensure properties exist in details
        if (!this.details.allergens) this.details.allergens = [];
        if (!this.details.alcoholContent) this.details.alcoholContent = 0;
        if (!this.details.tannins) this.details.tannins = 0;
        if (!this.details.description) this.details.description = "";
    }

    // Check allergens
    hasAllergen(allergen) {
        return this.details.allergens.includes(allergen);
    }

    // Get alcohol content
    getAlcoholContent() {
        return this.details.alcoholContent || 0;
    }

    // Get tannin value (wine only)
    getTannins() {
        return this.details.tannins || 0;
    }
    
    // Get product description
    getDescription() {
        return this.details.description || "No description";
    }
    
    // Check if product has specific property
    hasProperty(property) {
        return this.details[property] !== undefined;
    }
}

// Note: This function has been replaced by the version in customerController.js
// Kept for backward compatibility
async function loadProducts(category) {
    try {
        const response = await fetch(`data/${category}.json`);
        const data = await response.json();
        return data[category] || [];
    } catch (error) {
        console.error(`Error loading ${category} products:`, error);
        return [];
    }
}