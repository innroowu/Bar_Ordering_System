$(document).ready(function () {
    console.log("Waiter controller initialized");

    // Check if waiter is logged in
    function checkWaiterAuthentication() {
        const isLoggedIn = sessionStorage.getItem('waiterLoggedIn') === 'true';
        if (!isLoggedIn) {
            window.location.href = 'index.html';
            return false;
        }
        const waiterName = sessionStorage.getItem('waiterName');
        if (waiterName) {
            $('#waiterNameDisplay').text(`Waiter: ${waiterName}`);
        }
        return true;
    }

    if (!checkWaiterAuthentication()) {
        return;
    }

    // Setup logout button
    $('#logoutBtn').click(function () {
        console.log("Waiter logout button clicked");
        sessionStorage.removeItem('waiterLoggedIn');
        sessionStorage.removeItem('waiterName');
        window.location.href = 'index.html';
    });

    const inventoryManager = new InventoryManager();

    // Check for low stock products and send notifications
    function checkLowStockNotifications() {
        const inventory = inventoryManager.getInventoryList();
        inventory.forEach(item => {
            if (item.quantity < 5) {
                // Call the addNotification function from waiterView.js
                // (Make sure addNotification is available globally; you might attach it to window)
                window.addNotification(`${item.name} is running low (only ${item.quantity} left)`, 'warning');
            }
        });
    }


    // Load all inventory across categories
    // Loading initial inventory on page load
    async function loadInventory() {
        const categories = ['wines', 'beers', 'cocktails', 'foods'];
        // Clear previous inventory
        inventoryManager.inventory = {};
        for (let category of categories) {
            await inventoryManager.loadInventoryFromJson(category);
        }
        renderInventoryTable();
        updateProductSelect();
        checkLowStockNotifications();
    }

    loadInventory();


    // Render the inventory table in the waiter dashboard
    function renderInventoryTable() {
        const inventoryList = $('#inventoryList');
        inventoryList.empty();

        const inventory = inventoryManager.getInventoryList();
        inventory.forEach(item => {
            // Set the button text depending on the hidden flag.
            const removeButtonText = item.hidden ? "Show" : "Hide";
            const row = $(`
                <tr class="${item.quantity <= 3 ? 'low-stock' : ''}">
                    <td>${item.name}</td>
                    <td>${item.category.charAt(0).toUpperCase() + item.category.slice(1)}</td>
                    <td>${item.quantity}</td>
                    <td>
                        <button class="remove-product" data-id="${item.id}">${removeButtonText}</button>
                    </td>
                </tr>
            `);


            inventoryList.append(row);
        });
    }



    // Populate the product dropdown for price adjustments
    function updateProductSelect() {
        const productSelect = $('#productSelect');
        productSelect.empty();
        const inventory = inventoryManager.getInventoryList().filter(item => !item.hidden);
        inventory.forEach(item => {
            productSelect.append(`<option value="${item.id}">${item.name}</option>`);
        });
    }

    // Remove product event
    $(document).on('click', '.remove-product', async function () {
        const productId = $(this).data('id');
        const product = inventoryManager.inventory[productId];
        if (!product) return;

        // If the product is currently hidden, unhide it; otherwise, hide it.
        const newVisibility = product.hidden ? false : true;
        await inventoryManager.toggleProductVisibility(productId, newVisibility);
        await loadInventory(); // Refresh the inventory display to update button text and listing
    });



    // Adjusting Prices event
    $('#adjustPriceBtn').click(async function () {
        const productId = $('#productSelect').val();
        const newPrice = parseFloat($('#newPrice').val());
        const reason = $('#adjustmentReason').val();
        const comment = $('#adjustmentComment').val();

        if (isNaN(newPrice)) {
            console.error('Please enter a valid new price.');
            return;
        }

        try {
            await inventoryManager.adjustProductPrice(productId, newPrice, comment, reason);
            // Show a notification (using waiterView's addNotification if needed)
            // For example, using jQuery:
            $('<div class="temp-notification">Price adjusted for product ' + productId + ' to $' + newPrice + '</div>')
                .appendTo('body').fadeOut(3000, function () { $(this).remove(); });
            await loadInventory(); // Refresh inventory
        } catch (error) {
            console.error('Price adjustment error:', error);
        }
    });


    // Loading initial inventory on page load
    loadInventory();

    // Expose loadInventory function for use by other modules (if needed)
    window.loadInventory = loadInventory;
});
