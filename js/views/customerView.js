function renderProductList(products) {
    // Filter out products marked as hidden (if hidden is undefined, it's treated as false)
    const visibleProducts = products.filter(product => !product.hidden);
    
    const productList = $('#productList');
    productList.empty();

    if (visibleProducts.length === 0) {
        productList.html('<div class="no-products">No products found</div>');
        return;
    }

    visibleProducts.forEach(product => {
        // Check stock using the correct field from details
        const outOfStock = product.details.initialStock <= 0;
        const productElement = $(`
            <div class="product-item ${outOfStock ? 'out-of-stock' : ''}" data-id="${product.id}" data-category="${product.category}" draggable="${!outOfStock}">
                <span class="product-category">${getCategoryLabel(product.category)}</span>
                <h4>${product.name}</h4>
                <p>$${product.price}</p>
                ${outOfStock ? '<span class="stock-info">Out of Stock</span>' : ''}
            </div>
        `);

        productElement.data('product', product);
        
        if (!outOfStock) {
            productElement.click(() => showProductDetails(product));
            productElement.on('dragstart', function(e) {
                e.originalEvent.dataTransfer.setData('text/plain', product.id);
            });
        }
        
        productList.append(productElement);
    });
    
    // Display product count
    const countText = `Showing ${visibleProducts.length} products`;
    $('.product-count').remove();
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
        
        <button type="button" id="addToOrderBtn" class="btn" data-id="${product.id}">Add to Order</button>
    `;

    detailsContent.html(detailsHTML);

    // Add to order event
    $('#addToOrderBtn').click((event) => {
        event.preventDefault();
        addToOrder(product);
        modal.hide();
    });

    modal.show();
}

function addToOrder(product) {
    // Remove empty order message
    $('.empty-order-message').remove();
    const orderList = $('#orderList');

    // Check if the product already exists in the order
    const existingItem = orderList.find(`.order-item[data-id="${product.id}"]`);
    
    if (existingItem.length) {
        // Increase quantity if exists
        const quantityElement = existingItem.find('.item-quantity');
        let quantity = parseInt(quantityElement.text());
        quantity += 1;
        quantityElement.text(quantity);
    } else {
        // Create new order item if not exists
        const orderItemElement = $(`
            <div class="order-item" data-id="${product.id}">
                <span class="item-name">${product.name}</span>
                <span class="item-quantity">1</span>
                <span class="item-price">${product.price}</span>
                <button class="remove-item">x</button>
            </div>
        `);
        orderItemElement.data('product', product);

        // Remove button event: decrease quantity or remove item
        orderItemElement.find('.remove-item').click(async function() {
            const orderItem = $(this).closest('.order-item');
            const quantityElement = orderItem.find('.item-quantity');
            let quantity = parseInt(quantityElement.text());
            if (quantity > 1) {
                quantity -= 1;
                quantityElement.text(quantity);
            } else {
                orderItem.remove();
            }
            await increaseStock(product);
            updateTotal();
            if ($('.order-item').length === 0) {
                orderList.html('<p class="empty-order-message">Drag products from the left to add to your order</p>');
            }
        });

        orderList.append(orderItemElement);
    }
    
    // After adding the product, decrease its stock
    decreaseStock(product);
    updateTotal();
}



// update the total price of order
function updateTotal() {
    let total = 0;
    
    // Calculate total from all order items
    $('.order-item').each(function() {
        const price = parseFloat($(this).find('.item-price').text());
        const quantity = parseInt($(this).find('.item-quantity').text());
        total += price * quantity;
    });
    
    // Update the displayed total price
    $('#totalPrice').text(total.toFixed(2));
}

async function decreaseStock(product) {
    if (product.details.initialStock > 0) {
        const newStock = product.details.initialStock - 1;
        product.details.initialStock = newStock; // update local product object

        try {
            const updatedDetails = { ...product.details, initialStock: newStock };
            await fetch(`http://localhost:3000/${product.category}/${product.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ details: updatedDetails })
            });
            updateProductStockDisplay(product);
        } catch (error) {
            console.error('Error decreasing stock:', error);
        }
    }
}

async function increaseStock(product) {
    const newStock = product.details.initialStock + 1;
    product.details.initialStock = newStock; // update local product object

    try {
        const updatedDetails = { ...product.details, initialStock: newStock };
        await fetch(`http://localhost:3000/${product.category}/${product.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ details: updatedDetails })
        });
        updateProductStockDisplay(product);
    } catch (error) {
        console.error('Error increasing stock:', error);
    }
}

function updateProductStockDisplay(product) {
    const productElem = $(`.product-item[data-id="${product.id}"]`);
    if (product.details.initialStock <= 0) {
        productElem.addClass('out-of-stock');
        if (productElem.find('.stock-info').length === 0) {
            productElem.append('<span class="stock-info">Out of Stock</span>');
        }
        productElem.off('click');
        productElem.attr('draggable', 'false');
    } else {
        productElem.removeClass('out-of-stock');
        productElem.find('.stock-info').remove();
    }
}
