$(document).ready(function() {
    // Modal close logic
    $('.close').click(function() {
        $(this).closest('.modal').hide();
    });

    // Save product changes
    $('#saveProductChangesBtn').click(async function() {
        const updatedProduct = {
            name: $('#editProductName').val(),
            price: parseFloat($('#editProductPrice').val()),
            details: {
                description: $('#editProductDescription').val(),
                // If you want to update allergens, you might store them inside details as well
                allergens: $('#editProductAllergens').val().split(','),
                initialStock: parseInt($('#editProductStock').val())
            }
        };
    
        // Check if low stock
        const isLowStock = updatedProduct.details.initialStock <= 5;
        if (isLowStock) {
            if (!confirm(`WARNING: This product has low stock (${updatedProduct.details.initialStock} remaining). Do you want to add more stock or continue with current amount?`)) {
                return;
            }
        }
    
        // Get the product id (assume it's stored in a data attribute on the modal or a global variable)
        const productId = $('#editProductModal').data('productId');
        const category = $('#editProductModal').data('category');
    
        try {
            await fetch(`http://localhost:3000/${category}/${productId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedProduct)
            });
            $('#editProductModal').hide();
            loadProducts(category);
        } catch (error) {
            console.error('Failed to update product:', error);
        }
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