$(document).ready(function() {
    // Modal close logic
    $('.close').click(function() {
        $(this).closest('.modal').hide();
    });

    // Save product changes
    $('#saveProductChangesBtn').click(function() {
        const updatedProduct = {
            name: $('#editProductName').val(),
            price: parseFloat($('#editProductPrice').val()),
            description: $('#editProductDescription').val(),
            allergens: $('#editProductAllergens').val().split(','),
            stock: parseInt($('#editProductStock').val())
        };

        // Check if low stock
        const isLowStock = updatedProduct.stock <= 5;
        
        // If low stock, show confirmation dialog
        if (isLowStock) {
            if (confirm(`WARNING: This product has low stock (${updatedProduct.stock} remaining). Do you want to add more stock or continue with current amount?`)) {
                // User chooses to continue
                console.log('Updated Product (Low Stock):', updatedProduct);
            } else {
                // User chooses to cancel, return to editing
                return;
            }
        } else {
            console.log('Updated Product:', updatedProduct);
        }
        
        // TODO: Implement save logic, update corresponding JSON file
        $('#editProductModal').hide();
    });

    // Product visibility toggle
    $(document).on('click', '.toggle-visibility', function() {
        const productItem = $(this).closest('.product-item');
        productItem.toggleClass('hidden');
        
        const isHidden = productItem.hasClass('hidden');
        $(this).text(isHidden ? 'Show' : 'Hide');
    });

    // Add hover effect
    $('.product-item').hover(
        function() {
            // Low stock items maintain their unique background color
            if (!$(this).hasClass('low-stock')) {
                $(this).css('background-color', '#f1f1f1');
            }
        },
        function() {
            // Low stock items maintain their unique background color
            if (!$(this).hasClass('low-stock')) {
                $(this).css('background-color', 'transparent');
            }
        }
    );
    
    // Monitor stock changes
    $('#editProductStock').on('input', function() {
        const stockValue = parseInt($(this).val());
        if (stockValue <= 5 && stockValue >= 0) {
            $(this).addClass('low-stock-input');
            $('.stock-warning').remove();
            $(this).after('<div class="stock-warning">Warning: Low stock level!</div>');
        } else {
            $(this).removeClass('low-stock-input');
            $('.stock-warning').remove();
        }
    });
    
    // Set up periodic check for low stock items
    setInterval(function() {
        // Update visual indicator for low stock items
        $('.low-stock').each(function() {
            $(this).find('.stock-display').fadeOut(500).fadeIn(500);
        });
    }, 5000);
});