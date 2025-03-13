$(document).ready(function() {
    // Notification Features
    function addNotification(message, type = 'default') {
        const notificationList = $('#notificationList');
        
        // Check for duplicate notifications with the same message
        if (notificationList.find('.notification span').filter(function() {
            return $(this).text() === message;
        }).length > 0) {
            return; // A notification with the same message exists; do not add another.
        }
        
        const notification = $(`
            <div class="notification notification-${type}">
                <span>${message}</span>
                <button class="dismiss-notification">✕</button>
            </div>
        `);
    
        // Attach click handler for dismiss button
        notification.find('.dismiss-notification').click(function() {
            $(this).closest('.notification').fadeOut(300, function() {
                $(this).remove();
            });
        });
    
        notificationList.prepend(notification);
    }
    
    

    // Product detailed operation modal box
    function showProductActionModal(productId) {
        const modal = $('#productActionModal');
        const modalProductName = $('#modalProductName');
        const modalProductActions = $('#modalProductActions');
    
        // Assume we have the product details in the inventory
        const product = window.inventoryManager && window.inventoryManager.inventory[productId];
        if (!product) {
            modalProductName.text("Product not found");
            return;
        }
    
        modalProductName.text(product.name);
        modalProductActions.html(`
            <div class="product-actions">
                <div class="stock-management">
                    <h4>Stock Management</h4>
                    <p>Current Stock: ${product.quantity}</p>
                    <div class="stock-controls">
                        <input type="number" id="stockAdjustment" placeholder="Adjust Stock">
                        <button id="addStockBtn">Add Stock</button>
                        <button id="removeStockBtn">Remove Stock</button>
                    </div>
                </div>
                <div class="product-visibility">
                    <h4>Product Visibility</h4>
                    <label>
                        <input type="checkbox" id="productVisibilityToggle"> 
                        Temporarily Hide Product
                    </label>
                </div>
                <div class="security-notification">
                    <h4>Security Notification</h4>
                    <textarea id="securityNote" placeholder="Discretely describe any issues"></textarea>
                    <button id="notifySecurityBtn">Notify Security</button>
                </div>
            </div>
        `);
    
        // Stock Adjustment Events: (Here you may add calls to inventoryManager.addStock or reduceStock)
        $('#addStockBtn').click(function() {
            const adjustment = parseInt($('#stockAdjustment').val());
            if (!isNaN(adjustment) && adjustment > 0) {
                // For now, just show notification; later, integrate a PATCH call
                addNotification(`Added ${adjustment} units to ${product.name}`, 'warning');
            }
        });
    
        $('#removeStockBtn').click(function() {
            const adjustment = parseInt($('#stockAdjustment').val());
            if (!isNaN(adjustment) && adjustment > 0) {
                addNotification(`Removed ${adjustment} units from ${product.name}`, 'critical');
            }
        });
    
        // Security Notification Events
        $('#notifySecurityBtn').click(function() {
            const note = $('#securityNote').val().trim();
            if (note) {
                addNotification(`Security notified about ${product.name}: ${note}`, 'critical');
            }
        });
    
        // Product Visibility Toggle Event
        $('#productVisibilityToggle').change(function() {
            const isHidden = $(this).is(':checked');
            addNotification(
                `${product.name} is now ${isHidden ? 'hidden' : 'visible'}`, 
                isHidden ? 'warning' : 'default'
            );
        });
    
        modal.show();
    }    

    // Table order management
    function updateTableOrderDetails(tableNumber) {
        const orderDetails = $('#tableOrderDetails');
        
        // Simulate order data
        const mockOrders = {
            'Table 1': [
                { item: 'Mojito', quantity: 2, status: 'Pending' },
                { item: 'Chicken Wings', quantity: 1, status: 'Preparing' }
            ],
            'Table 2': [
                { item: 'Margarita', quantity: 3, status: 'Served' }
            ]
        };

        const tableOrders = mockOrders[tableNumber] || [];

        const orderHtml = tableOrders.map(order => `
            <div class="order-item ${order.status.toLowerCase()}">
                <span>${order.item}</span>
                <span>Qty: ${order.quantity}</span>
                <span>Status: ${order.status}</span>
                <select class="order-status-change">
                    <option>Pending</option>
                    <option>Preparing</option>
                    <option>Served</option>
                    <option>Canceled</option>
                </select>
            </div>
        `).join('');

        orderDetails.html(`
            <h3>Orders for ${tableNumber}</h3>
            ${orderHtml}
        `);
    }

    // Initialize event listeners
    function initializeEventListeners() {
        // Close the modal
        $('.close').click(function() {
            $(this).closest('.modal').hide();
        });

        // Table selection event
        $('#tableSelect').change(function() {
            const selectedTable = $(this).val();
            updateTableOrderDetails(selectedTable);
        });

        // Initialize the first table
        updateTableOrderDetails('Table 1');

        // Product details button
        $(document).on('click', '.details-product', function() {
            const productId = $(this).data('id');
            showProductActionModal(productId);
        });
    }

    function initializePage() {
        initializeEventListeners();
        
        addNotification('Welcome to Waiter Management System', 'default');
    }

    initializePage();
    window.addNotification = addNotification;
});
