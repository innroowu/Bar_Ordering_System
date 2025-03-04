$(document).ready(function() {
    const inventoryManager = new InventoryManager();

    // Load all inventory
    async function loadInventory() {
        const categories = ['wines', 'beers', 'cocktails', 'foods'];
        for(let category of categories) {
            await inventoryManager.loadInventoryFromJson(category);
        }
        renderInventoryTable();
    }

    // Rendering the inventory table
    function renderInventoryTable() {
        const inventoryList = $('#inventoryList');
        inventoryList.empty();

        const inventory = inventoryManager.getInventoryList();
        inventory.forEach(item => {
            const row = $(`
                <tr class="${item.quantity <= 3 ? 'low-stock' : ''}">
                    <td>${item.name}</td>
                    <td>${item.id.includes('wine') ? 'Wine' : 
                           item.id.includes('beer') ? 'Beer' : 
                           item.id.includes('cocktail') ? 'Cocktail' : 'Food'}</td>
                    <td>${item.quantity}</td>
                    <td>
                        <button class="remove-product" data-id="${item.id}">Remove</button>
                        <button class="details-product" data-id="${item.id}">Details</button>
                    </td>
                </tr>
            `);
            inventoryList.append(row);
        });
    }

    // Loading initial inventory
    loadInventory();

    // Remove Products
    $(document).on('click', '.remove-product', function() {
        const productId = $(this).data('id');
        inventoryManager.removeProduct(productId);
        renderInventoryTable();
    });

    // Adjusting Prices
    $('#adjustPriceBtn').click(function() {
        const productId = $('#productSelect').val();
        const newPrice = parseFloat($('#newPrice').val());
        const reason = $('#adjustmentReason').val();
        const comment = $('#adjustmentComment').val();

        // TODO: Implement price adjustment logic
        console.log('Price Adjustment:', {
            productId, 
            newPrice, 
            reason, 
            comment
        });
    });
});
