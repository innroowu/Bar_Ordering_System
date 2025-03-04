function renderProductList(products) {
    const productList = $('#productList');
    productList.empty();

    if (products.length === 0) {
        productList.html('<div class="no-products">No products found</div>');
        return;
    }

    products.forEach(product => {
        // Create product element, add category identifier
        const productElement = $(`
            <div class="product-item" data-id="${product.id}" data-category="${product.category}" draggable="true">
                <span class="product-category">${getCategoryLabel(product.category)}</span>
                <h4>${product.name}</h4>
                <p>$${product.price}</p>
            </div>
        `);

        // Store product data on the element for filtering and drag & drop
        productElement.data('product', product);
        
        // Add click event
        productElement.click(() => showProductDetails(product));
        
        // Add drag event
        productElement.on('dragstart', function(e) {
            e.originalEvent.dataTransfer.setData('text/plain', product.id);
        });
        
        productList.append(productElement);
    });
    
    // Display product count
    const countText = `Showing ${products.length} products`;
    
    // Remove old count element (if exists)
    $('.product-count').remove();
    
    // Add new count element
    productList.append(`<div class="product-count">${countText}</div>`);
}

// Get display label for category
function getCategoryLabel(category) {
    switch(category) {
        case 'wines': return 'Wine';
        case 'beers': return 'Beer';
        case 'cocktails': return 'Cocktail';
        case 'foods': return 'Food';
        default: return category;
    }
}

function showProductDetails(product) {
    const modal = $('#productDetailModal');
    const detailsContent = $('#productDetails');

    let detailsHTML = `
        <h2>${product.name}</h2>
        <p class="product-category-label ${product.category}">${getCategoryLabel(product.category)}</p>
        <p>Price: $${product.price}</p>
        
        <h3>Details:</h3>
        <p>Description: ${product.details.description || 'No description available'}</p>
        
        <h4>Nutrition and Allergen Information:</h4>
        <ul>
    `;
    
    // Allergens
    if (product.details.allergens && product.details.allergens.length > 0) {
        detailsHTML += `<li>Allergens: ${product.details.allergens.join(', ')}</li>`;
    } else {
        detailsHTML += `<li>Allergens: None</li>`;
    }
    
    // Alcohol content (only for beverages)
    if (product.details.alcoholContent) {
        detailsHTML += `<li>Alcohol Content: ${product.details.alcoholContent}%</li>`;
    }
    
    // Tannins (only for wines)
    if (product.details.tannins) {
        detailsHTML += `<li>Tannin Content: ${product.details.tannins}/10</li>`;
    }
    
    detailsHTML += `
        </ul>
        
        <button id="addToOrderBtn" class="btn" data-id="${product.id}">Add to Order</button>
    `;

    detailsContent.html(detailsHTML);

    // Add to order event
    $('#addToOrderBtn').click(() => {
        addToOrder(product);
        modal.hide();
    });

    modal.show();
}

function addToOrder(product) {
    // First remove empty order message
    $('.empty-order-message').remove();
    
    const orderList = $('#orderList');
    
    // Check if the same product is already in the order
    const existingItem = orderList.find(`.order-item[data-id="${product.id}"]`);
    
    if (existingItem.length) {
        // If exists, increase quantity
        const quantityElement = existingItem.find('.item-quantity');
        let quantity = parseInt(quantityElement.text());
        quantity += 1;
        quantityElement.text(quantity);
    } else {
        // If not exists, create new order item
        const orderItemElement = $(`
            <div class="order-item" data-id="${product.id}">
                <span class="item-name">${product.name}</span>
                <span class="item-quantity">1</span>
                <span class="item-price">${product.price}</span>
                <button class="remove-item">x</button>
            </div>
        `);

        // Save product data to element for later use
        orderItemElement.data('product', product);

        // Add delete button event
        orderItemElement.find('.remove-item').click(function() {
            $(this).closest('.order-item').remove();
            updateTotal();
            
            // If order becomes empty, add prompt
            if ($('.order-item').length === 0) {
                orderList.html('<p class="empty-order-message">Drag products from the left to add to your order</p>');
            }
        });

        orderList.append(orderItemElement);
    }
    
    updateTotal();
}