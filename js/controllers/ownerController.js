$(document).ready(function() {
    console.log("Owner controller initialized");
    
    // Set up logout button click event
    $('#logoutBtn').click(function() {
        console.log("Logout button clicked");
        // Clear owner login session
        sessionStorage.removeItem('ownerLoggedIn');
        sessionStorage.removeItem('ownerName');
        
        // Redirect to index page
        window.location.href = 'index.html';
    });
    
    // Check if owner is logged in
    function checkOwnerAuthentication() {
        const isLoggedIn = sessionStorage.getItem('ownerLoggedIn') === 'true';
        if (!isLoggedIn) {
            // If not logged in, redirect to index page
            window.location.href = 'index.html';
            return false;
        }
        return true;
    }

    // Check authentication on page load
    if (!checkOwnerAuthentication()) {
        return; // Stop executing the rest of the code
    }

    let currentCategory = 'wines';
    const inventoryManager = new InventoryManager();
    const LOW_STOCK_THRESHOLD = 5; // Low stock threshold

    // Load product list
    async function loadProducts(category) {
        try {
            const response = await fetch(`http://localhost:3000/${category}`);
            const products = await response.json();
            renderProductList(products);
            updateFinancialOverview(products);
            checkLowStockItems(products);
        } catch (error) {
            console.error('Failed to load products:', error);
        }
    }
    
    // Render product list
    function renderProductList(products) {
        const productList = $('#productList');
        productList.empty();

        products.forEach(product => {
            const stock = product.details.initialStock;
            const isLowStock = stock <= LOW_STOCK_THRESHOLD;
            
            const productElement = $(`
                <div class="product-item ${isLowStock ? 'low-stock' : ''}" data-id="${product.id}">
                    ${isLowStock ? '<div class="warning-indicator"><span class="warning-icon">⚠️</span></div>' : ''}
                    <h4>${product.name}</h4>
                    <p>Price: ${product.price}</p>
                    <p class="stock-display ${isLowStock ? 'low-stock-text' : ''}">
                        Remaining: ${stock} ${isLowStock ? '(LOW STOCK!)' : ''}
                    </p>
                    <div class="actions">
                        <button class="edit-product">Edit</button>
                        <button class="delete-product">Delete</button>
                        <button class="toggle-visibility">Hide</button>
                    </div>
                </div>
            `);

            productList.append(productElement);
        });
    }

    // Check low stock items and display notification
    function checkLowStockItems(products) {
        const lowStockItems = products.filter(p => (p.details.initialStock || 10) <= LOW_STOCK_THRESHOLD);
        
        if (lowStockItems.length > 0) {
            showLowStockNotification(lowStockItems);
        }
    }

    // Display low stock notification
    function showLowStockNotification(items) {
        // Clear existing notifications
        $('#lowStockNotification').remove();
        
        const itemNames = items.map(item => item.name).join(', ');
        const notification = $(`
            <div id="lowStockNotification" class="notification">
                <span class="close-notification">&times;</span>
                <h3>⚠️ Low Stock Alert</h3>
                <p>The following items are running low (less than ${LOW_STOCK_THRESHOLD}):</p>
                <p>${itemNames}</p>
            </div>
        `);
        
        $('body').append(notification);
        
        // Close notification
        $('.close-notification').click(function() {
            $(this).parent().fadeOut();
        });
    }

    // Update financial overview
    function updateFinancialOverview(products) {
        const totalRevenue = products.reduce((sum, product) => sum + product.price, 0);
        const totalProducts = products.length;
        const lowStockItems = products.filter(p => (p.details.initialStock || 10) <= LOW_STOCK_THRESHOLD).length;

        $('#totalRevenue').text(`$${totalRevenue.toLocaleString()}`);
        $('#totalProducts').text(totalProducts);
        $('#lowStockItems').text(lowStockItems);
        
        // Update low stock indicator
        if (lowStockItems > 0) {
            $('#lowStockItems').parent().addClass('alert');
        } else {
            $('#lowStockItems').parent().removeClass('alert');
        }

        renderSalesChart(products);
    }


    // Category selection events
    $('.category-btn').click(function() {
        $('.category-btn').removeClass('active');
        $(this).addClass('active');
        currentCategory = $(this).data('category');
        loadProducts(currentCategory);
    });

    // Add product event
    $('#addProductBtn').click(async function() {
        const newProduct = {
            id: `${currentCategory}${Date.now()}`,  // Generates a unique id; adjust as needed
            name: $('#newProductName').val(),
            price: parseFloat($('#newProductPrice').val()),
            category: currentCategory,
            details: {
                description: $('#newProductDescription').val(),
                allergens: $('#newProductAllergens').val().split(','),
                initialStock: parseInt($('#newProductStock').val())
            }
        };
    
        try {
            await fetch(`http://localhost:3000/${currentCategory}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newProduct)
            });
            // Reload product list after successful addition
            loadProducts(currentCategory);
        } catch (error) {
            console.error('Failed to add product:', error);
        }
    });
    

    // Edit product modal
    $(document).on('click', '.edit-product', function() {
        const productElement = $(this).closest('.product-item');
        const productId = productElement.data('id');
        const category = currentCategory;
        
        // Store these on the modal for later use
        $('#editProductModal').data('productId', productId);
        $('#editProductModal').data('category', category);
        
        // Optionally, populate the modal fields with existing product data (this may require an additional fetch or using data already in the DOM)
        // For now, we'll assume the modal is filled manually.
        $('#editProductModal').show();
    });
    

    // Delete product event
    $(document).on('click', '.delete-product', async function() {
        const productId = $(this).closest('.product-item').data('id');
        try {
            await fetch(`http://localhost:3000/${currentCategory}/${productId}`, {
                method: 'DELETE'
            });
            loadProducts(currentCategory);
        } catch (error) {
            console.error('Failed to delete product:', error);
        }
    });
    

    // Initial load
    loadProducts(currentCategory);
});