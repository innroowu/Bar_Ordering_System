$(document).ready(function () {
    // All product categories
    $('#backBtn').click(function () {
        window.history.back(); // Return to previous page
    });
    const categories = ['wines', 'beers', 'cocktails', 'foods'];

    // Array to store all products
    let allProducts = [];

    // Current displayed product category, initially 'all'
    let currentCategory = 'all';

    // Current logged in user
    let currentUser = null;

    // Undo and redo stacks
    let undoStack = [];
    let redoStack = [];

    // Load data for all product categories
    async function initializeProducts() {
        try {
            // Load products from all categories
            await loadAllProducts();

            // Set category button click events
            $('#allBtn').click(() => filterByCategory('all'));
            $('#winesBtn').click(() => filterByCategory('wines'));
            $('#beersBtn').click(() => filterByCategory('beers'));
            $('#cocktailsBtn').click(() => filterByCategory('cocktails'));
            $('#foodBtn').click(() => filterByCategory('foods'));

            // Set filter event listeners
            setupFilterListeners();

            // Set up drag and drop functionality
            setupDragAndDrop();

            // Set modal close button
            $('.close').click(function () {
                $(this).closest('.modal').hide();
            });

            // Click outside modal to close
            $('.modal').click(function (event) {
                if ($(event.target).is('.modal')) {
                    $(this).hide();
                }
            });

            // Set up category button highlighting
            $('.category-buttons button').click(function () {
                $('.category-buttons button').removeClass('active');
                $(this).addClass('active');
            });
        } catch (error) {
            console.error('Initialization failed:', error);
        }
    }

    // Load products from all categories
    async function loadAllProducts() {
        try {
            console.log('Starting to load all product categories...');

            // Clear product list
            allProducts = [];

            // Show loading indicator
            $('#productList').html('<div class="loading">Loading products...</div>');

            // Load each category one by one
            for (const category of categories) {
                console.log(`Loading ${category} category...`);

                try {
                    const response = await fetch(`http://localhost:3000/${category}`);
                    if (!response.ok) {
                        console.error(`Unable to load ${category}: HTTP ${response.status}`);
                        continue;
                    }

                    const products = await response.json();

                    // Convert to Product objects and add to total product list.
                    // IMPORTANT: Store baseline stock value (initialStockBaseline) for later recalculation.
                    const productObjects = products.map(item => {
                        if (item.details && item.details.initialStock !== undefined) {
                            item.details.initialStockBaseline = item.details.initialStock;
                        }
                        return new Product(
                            item.id,
                            item.name,
                            item.price,
                            item.category,
                            item.details,
                            item.hidden || false
                        );
                    });

                    allProducts = [...allProducts, ...productObjects];
                    console.log(`Loaded ${productObjects.length} ${category} products`);

                } catch (categoryError) {
                    console.error(`Error occurred while loading ${category}:`, categoryError);
                }
            }

            console.log(`Total of ${allProducts.length} products loaded`);

            // Render all products
            renderProductList(allProducts);

        } catch (error) {
            console.error('Failed to load products:', error);
            $('#productList').html(`<p>Unable to load product data: ${error.message}</p>`);
        }
    }

    // Filter products by category
    function filterByCategory(category) {
        currentCategory = category;

        // Control tannin filter visibility
        if (category === 'wines' || category === 'all') {
            $('#tanninFilterContainer').show();
        } else {
            $('#tanninFilterContainer').hide();
        }

        if (category === 'all') {
            // Show all products
            renderProductList(allProducts);
        } else {
            // Show products of the specified category
            const filteredProducts = allProducts.filter(product => product.category === category);
            renderProductList(filteredProducts);
        }
    }

    // Set up filter event listeners
    function setupFilterListeners() {
        $('#productSearch').on('input', filterProducts);
        $('#allergenSelect').on('change', filterProducts);
        $('#alcoholRange').on('input', function () {
            $('#alcoholValue').text(`${this.value}%`);
            filterProducts();
        });
        $('#tanninRange').on('input', function () {
            $('#tanninValue').text($(this).val());
            filterProducts();
        });
    }

    // Filter products
    function filterProducts() {
        const searchTerm = $('#productSearch').val().toLowerCase();
        const selectedAllergens = $('#allergenSelect').val() || [];
        const alcoholContent = parseInt($('#alcoholRange').val());
        const tanninLevel = parseInt($('#tanninRange').val());

        $('.product-item').each(function () {
            const product = $(this).data('product');

            if (!product) return;

            // First check if the product belongs to the currently selected category
            let categoryMatch = currentCategory === 'all' || product.category === currentCategory;

            // Then check name match
            const nameMatch = product.name.toLowerCase().includes(searchTerm);

            // Check allergen match (if allergens are selected)
            let allergenMatch = true;
            if (selectedAllergens.length > 0) {
                allergenMatch = selectedAllergens.some(allergen =>
                    product.details.allergens && product.details.allergens.includes(allergen)
                );
            }

            // Check alcohol content match (only for beverage categories)
            let alcoholMatch = true;
            if (product.category !== 'foods') {
                alcoholMatch = !product.details.alcoholContent ||
                    Math.abs(product.details.alcoholContent - alcoholContent) <= 10;
            }

            // Check tannin value match (only for wine category)
            let tanninMatch = true;
            if (product.category === 'wines' && product.details.tannins) {
                tanninMatch = Math.abs(product.details.tannins - tanninLevel) <= 2;
            }

            // Show or hide product
            $(this).toggle(categoryMatch && nameMatch && allergenMatch && alcoholMatch && tanninMatch);
        });

        // Update displayed product count
        updateProductCount();
    }

    // Update displayed product count
    function updateProductCount() {
        const visibleCount = $('.product-item:visible').length;
        const countText = visibleCount === 0 ? 'No matching products' : `Showing ${visibleCount} products`;

        // If count element doesn't exist, create it, otherwise update existing element
        if ($('.product-count').length === 0) {
            $('#productList').append(`<div class="product-count">${countText}</div>`);
        } else {
            $('.product-count').text(countText);
        }
    }

    // Set up drag and drop functionality
    function setupDragAndDrop() {
        // Make product items draggable
        $(document).on('mousedown', '.product-item', function () {
            $(this).attr('draggable', 'true');
        });

        // When drag starts
        $(document).on('dragstart', '.product-item', function (event) {
            const productId = $(this).data('id');
            event.originalEvent.dataTransfer.setData('text/plain', productId);
        });

        // Allow order area to receive drag and drop
        $('.order-list').on('dragover', function (event) {
            event.preventDefault();
            $(this).addClass('drag-over');
        });

        // Leave order area
        $('.order-list').on('dragleave', function () {
            $(this).removeClass('drag-over');
        });

        // Handle drop
        $('.order-list').on('drop', function (event) {
            event.preventDefault();
            $(this).removeClass('drag-over');

            const productId = event.originalEvent.dataTransfer.getData('text/plain');
            const $productElem = $(`.product-item[data-id="${productId}"]`);
            const product = $productElem.data('product');

            if (product) {
                addToOrder(product);
            }
        });
    }

    // VIP login handling
    $('#loginBtn').click(async function () {
        const username = $('#username').val();
        const password = $('#password').val();

        if (!username || !password) {
            $('#loginStatus').text(window.i18n.translate('pleaseEnterCredentials'));
            return;
        }

        const user = await User.login(username, password);
        if (user) {
            currentUser = user;
            $('#loginStatus').html(`Welcome, ${user.name}<br>Balance: $${user.balance}`);
            $('#loginBtn').text('Logout').off('click').click(logout);
            $('#SpecialDBtn').show();

            // Hide the username, password input fields, and login button
            $('#username').hide();
            $('#password').hide();
            $('#vipLoginTitle').hide();
        } else {
            $('#loginStatus').text('Login failed');
        }
    });

    // Logout handling
    function logout() {
        currentUser = null;
        $('#loginStatus').text('');
        $('#loginBtn').text(window.i18n.translate('loginBtn')).off('click').click(async function () {
            const username = $('#username').val();
            const password = $('#password').val();

            if (!username || !password) {
                $('#loginStatus').text('Please enter username and password');
                return;
            }

            const user = await User.login(username, password);
            if (user) {
                currentUser = user;
                $('#loginStatus').html(`Welcome, ${user.name}<br>Balance: $${user.balance}`);
                $('#loginBtn').text('Logout').off('click').click(logout);
                $('#SpecialDBtn').show();
            } else {
                $('#loginStatus').text('Login failed');
            }
        });

        // Show the username, password input fields, and login button again
        $('#username').show();
        $('#password').show();
        $('#loginBtn').show();

        // Hide special drinks button upon logout
        $('#SpecialDBtn').hide();
    }

    // Special drinks handling
    $('#SpecialDBtn').click(async function () {
        try {
            const response = await fetch('data/special.json');
            const data = await response.json();
            const specialProducts = data.special_drinks.map(item =>
                new Product(
                    item.id,
                    item.name,
                    item.price,
                    item.category,
                    item.details
                )
            );

            renderProductList(specialProducts);
        } catch (error) {
            console.error('Failed to load special drinks:', error);
            $('#productList').html(`<p>Unable to load special drinks: ${error.message}</p>`);
        }
    });

    // Save current order state for undo
    function saveOrderState() {
        const currentOrder = [];
        $('.order-item').each(function () {
            const product = $(this).data('product');
            const quantity = parseInt($(this).find('.item-quantity').text());
            currentOrder.push({ ...product, quantity });
        });
        undoStack.push(currentOrder);
    }

    // --- New function: Recalculate stock based on current order ---
    function recalcStockBasedOnOrder() {
        // Build a mapping: productId => total quantity ordered
        const orderCounts = {};
        $('.order-item').each(function () {
            const product = $(this).data('product');
            const qty = parseInt($(this).find('.item-quantity').text(), 10);
            if (product) {
                orderCounts[product.id] = (orderCounts[product.id] || 0) + qty;
            }
        });
        // For each product in allProducts, recalc current stock using baseline stock
        allProducts.forEach(product => {
            if (product.details && product.details.initialStockBaseline !== undefined) {
                const orderedQty = orderCounts[product.id] || 0;
                product.details.initialStock = product.details.initialStockBaseline - orderedQty;
                updateProductStockDisplay(product);
            }
        });
    }
    // Expose the recalculation function for use in other modules (e.g., customerView.js)
    window.recalcStockBasedOnOrder = recalcStockBasedOnOrder;

    // --- Function to add a product to the order ---
    function addToOrder(product) {
        // Save current state for undo
        saveOrderState();

        // Remove empty order message
        $('.empty-order-message').remove();

        const orderList = $('#orderList');

        // Check if the same product is already in the order
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

            // Add delete button event
            orderItemElement.find('.remove-item').click(function () {
                saveOrderState();
                const orderItem = $(this).closest('.order-item');
                const quantityElement = orderItem.find('.item-quantity');
                let quantity = parseInt(quantityElement.text());
                if (quantity > 1) {
                    quantity -= 1;
                    quantityElement.text(quantity);
                } else {
                    orderItem.remove();
                }
                // After removal, recalc stock and update total
                recalcStockBasedOnOrder();
                updateTotal();
                if ($('.order-item').length === 0) {
                    orderList.html(`<p class="empty-order-message">${window.i18n.translate('emptyOrderMessage')}</p>`);
                }
            });

            orderList.append(orderItemElement);
        }

        // Decrease stock immediately via existing function (if needed)
        decreaseStock(product);
        updateTotal();
        recalcStockBasedOnOrder();

        // Clear redo stack after a new action
        redoStack = [];
    }

    // Update order list (used in undo/redo)
    function updateOrderList(orderState) {
        const orderList = $('#orderList');
        orderList.empty();

        if (!orderState || orderState.length === 0) {
            orderList.html(`<p class="empty-order-message">${window.i18n.translate('emptyOrderMessage')}</p>`);
            updateTotal();
            return;
        }

        orderState.forEach(item => {
            const orderItemElement = $(`
                <div class="order-item" data-id="${item.id}">
                    <span class="item-name">${item.name}</span>
                    <span class="item-quantity">${item.quantity}</span>
                    <span class="item-price">${item.price}</span>
                    <button class="remove-item">x</button>
                </div>
            `);

            orderItemElement.data('product', item);

            orderItemElement.find('.remove-item').click(function () {
                saveOrderState();
                $(this).closest('.order-item').remove();
                updateTotal();
                if ($('.order-item').length === 0) {
                    orderList.html('<p class="empty-order-message">' + window.i18n.translate('emptyOrderMessage') + '</p>');
                }
                recalcStockBasedOnOrder();
            });

            orderList.append(orderItemElement);
        });

        updateTotal();
    }

    // Undo function
    $('#undoBtn').click(function () {
        if (undoStack.length > 0) {
            // Save current state for redo
            const currentOrder = [];
            $('.order-item').each(function () {
                const product = $(this).data('product');
                const quantity = parseInt($(this).find('.item-quantity').text());
                currentOrder.push({ ...product, quantity });
            });
            redoStack.push(currentOrder);

            // Revert to previous state
            const previousState = undoStack.pop();
            updateOrderList(previousState);
            recalcStockBasedOnOrder();
        }
    });

    // Redo function
    $('#redoBtn').click(function () {
        if (redoStack.length > 0) {
            // Save current state for undo
            const currentOrder = [];
            $('.order-item').each(function () {
                const product = $(this).data('product');
                const quantity = parseInt($(this).find('.item-quantity').text());
                currentOrder.push({ ...product, quantity });
            });
            undoStack.push(currentOrder);

            // Apply redo operation
            const redoState = redoStack.pop();
            updateOrderList(redoState);
            recalcStockBasedOnOrder();
        }
    });

    // Bill split functionality
    $('#billSplitBtn').click(function () {
        $('#billSplitModal').show();
        // Reset the form state
        $('#participantCount').val('');
        $('#splitParticipants').empty();
        $('#confirmSplitSection').hide();
    });

    $('#startSplitBtn').click(function () {
        const participantCount = parseInt($('#participantCount').val()) || 0;
        if (participantCount <= 0) {
            alert('Please enter a valid number of participants');
            return;
        }

        const totalPrice = parseFloat($('#totalPrice').text()) || 0;
        const splitAmount = (totalPrice / participantCount).toFixed(2);

        let participantsHtml = '';
        for (let i = 0; i < participantCount; i++) {
            participantsHtml += `
                <div>
                    <label>Participant ${i + 1} Amount:</label>
                    <input type="number" class="participant-amount" data-index="${i}" value="${splitAmount}">
                </div>
            `;
        }

        $('#splitParticipants').html(participantsHtml);

        // Show the confirmation section after participants are added
        $('#confirmSplitSection').show();
    });

    // Add handler for the confirm split button
    $('#confirmSplitBtn').click(function () {
        // Show alert message
        alert('The waiter will come to the table to settle the bill');

        // Close the modal
        $('#billSplitModal').hide();
    });

    // Checkout Button Handling
    $('#checkoutBtn').click(function () {
        const itemCount = $('.order-item').length;
        if (itemCount === 0) {
            alert(window.i18n.translate('orderEmpty'));
            return;
        }

        const total = parseFloat($('#totalPrice').text());

        // Check if user is VIP (logged in)
        if (currentUser) {
            // VIP user - Check balance
            if (currentUser.balance >= total) {
                // Sufficient balance, deduct and complete checkout
                currentUser.balance -= total;
                $('#loginStatus').html(`${window.i18n.translate('welcome')} ${currentUser.name}<br>${window.i18n.translate('balance')} $${currentUser.balance}`);
                alert(`${window.i18n.translate('thankYouPurchase')}${total}.`);

                // Clear order and update total
                $('#orderList').empty();
                $('#orderList').html(`<p class="empty-order-message">${window.i18n.translate('emptyOrderMessage')}</p>`);
                updateTotal();
                recalcStockBasedOnOrder();
            } else {
                // Insufficient balance
                alert(window.i18n.translate('insufficientBalance'));
            }
        } else {
            // Non-VIP user - Direct checkout, no need to check balance
            alert(`${window.i18n.translate('thankYouPurchase')}${total}.`);

            // Clear order and update total
            $('#orderList').empty();
            $('#orderList').html(`<p class="empty-order-message">${window.i18n.translate('emptyOrderMessage')}</p>`);
            updateTotal();
            recalcStockBasedOnOrder();
        }
    });

    // Update total price
    function updateTotal() {
        let total = 0;

        // Calculate total from all order items
        $('.order-item').each(function () {
            const price = parseFloat($(this).find('.item-price').text());
            const quantity = parseInt($(this).find('.item-quantity').text());
            total += price * quantity;
        });

        // Update the displayed total price
        $('#totalPrice').text(total.toFixed(2));
    }

    // Decrease stock function (existing)
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

    // Increase stock function (existing)
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

    // Update product stock display in the UI
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

    // Initialize application
    initializeProducts();

    // When language select changes, reload the view
    $('#language-select').change(function () {
        // Reload the category view
        if (currentCategory) {
            filterByCategory(currentCategory);
        }
    });

    // Helper function to update stock based on state differences
    async function updateStockOnUndoRedo(currentState, newState) {
        // Build maps: key = product id, value = quantity in order
        const currentMap = {};
        currentState.forEach(item => {
            currentMap[item.id] = item.quantity;
        });
        const newMap = {};
        newState.forEach(item => {
            newMap[item.id] = item.quantity;
        });

        // Get union of product ids
        const allIds = new Set([...Object.keys(currentMap), ...Object.keys(newMap)]);
        for (let id of allIds) {
            const currentQty = currentMap[id] || 0;
            const newQty = newMap[id] || 0;
            const diff = newQty - currentQty;
            // Find the product object (from newState if available, else currentState)
            let product = newState.find(item => item.id == id) || currentState.find(item => item.id == id);
            if (product) {
                if (diff > 0) {
                    // New state has more items: decrease stock diff times
                    for (let i = 0; i < diff; i++) {
                        await decreaseStock(product);
                    }
                } else if (diff < 0) {
                    // New state has fewer items: increase stock by -diff times
                    for (let i = 0; i < (-diff); i++) {
                        await increaseStock(product);
                    }
                }
            }
        }
    }

    // Undo handler (make the click handler async)
    $('#undoBtn').click(async function () {
        if (undoStack.length > 0) {
            // Capture current order state from the DOM
            const currentOrder = [];
            $('.order-item').each(function () {
                const product = $(this).data('product');
                const quantity = parseInt($(this).find('.item-quantity').text());
                currentOrder.push({ ...product, quantity });
            });
            // Save current state for redo
            redoStack.push(currentOrder);

            // Pop the previous state from the undo stack
            const previousState = undoStack.pop();
            // Update stock based on the difference between current and previous states
            await updateStockOnUndoRedo(currentOrder, previousState);
            // Update the DOM to reflect the previous state
            updateOrderList(previousState);
        }
    });

    // Redo handler (make the click handler async)
    $('#redoBtn').click(async function () {
        if (redoStack.length > 0) {
            // Capture current order state
            const currentOrder = [];
            $('.order-item').each(function () {
                const product = $(this).data('product');
                const quantity = parseInt($(this).find('.item-quantity').text());
                currentOrder.push({ ...product, quantity });
            });
            // Save current state for undo
            undoStack.push(currentOrder);

            // Get the redo state from the redo stack
            const redoState = redoStack.pop();
            // Update stock based on differences
            await updateStockOnUndoRedo(currentOrder, redoState);
            // Update the DOM
            updateOrderList(redoState);
        }
    });

});


