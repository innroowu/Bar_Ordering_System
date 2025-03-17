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
        case 'special': return 'Special Drink';
        default: return category;
    }
}

function showProductDetails(product) {
    const modal = $('#productDetailModal');
    const detailsContent = $('#productDetails');

    let detailsHTML = `
        <h2>${product.name}</h2>
        <p class="product-category-label ${product.category}">${getCategoryLabel(product.category)}</p>
        <p>${window.i18n.translate('price')}: $${product.price}</p>
        
        <h3>${window.i18n.translate('details')}:</h3>
        <p>${window.i18n.translate('description')}: ${product.details.description || window.i18n.translate('noDescription')}</p>
        
        <h4>${window.i18n.translate('nutritionInfo')}:</h4>
        <ul>
    `;
    
    // Allergens
    if (product.details.allergens && product.details.allergens.length > 0) {
        detailsHTML += `<li>${window.i18n.translate('allergens')}: ${product.details.allergens.join(', ')}</li>`;
    } else {
        detailsHTML += `<li>${window.i18n.translate('allergens')}: ${window.i18n.translate('none')}</li>`;
    }


    // Alcohol content (only for beverages)
    if (product.details.alcoholContent) {
        detailsHTML += `<li>${window.i18n.translate('alcoholContent')}: ${product.details.alcoholContent}%</li>`;
    }

    // Tannins (only for wines)
    if (product.details.tannins) {
        detailsHTML += `<li>${window.i18n.translate('tanninContent')}: ${product.details.tannins}/10</li>`;
    }
    
    detailsHTML += `
        </ul>
        
        <button id="addToOrderBtn" class="btn" data-id="${product.id}">${window.i18n.translate('addToOrder')}</button>
    `;

    detailsContent.html(detailsHTML);

    // Add to order event
    $('#addToOrderBtn').click(() => {
        addToOrder(product);
        modal.hide();
    });

    modal.show();
}