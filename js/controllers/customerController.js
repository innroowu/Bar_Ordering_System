$(document).ready(function() {
    // All product categories
    const categories = ['wines', 'beers', 'cocktails', 'foods'];
    
    // Array to store all products
    let allProducts = [];
    
    // Current displayed product category, initially 'all'
    let currentCategory = 'all';
    
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
            $('.close').click(function() {
                $(this).closest('.modal').hide();
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
                    const response = await fetch(`data/${category}.json`);
                    if (!response.ok) {
                        console.error(`Unable to load ${category}: HTTP ${response.status}`);
                        continue;
                    }
                    
                    const data = await response.json();
                    const products = data[category] || [];
                    
                    // Convert to Product objects and add to total product list
                    const productObjects = products.map(item => 
                        new Product(
                            item.id, 
                            item.name, 
                            item.price, 
                            item.category, 
                            item.details
                        )
                    );
                    
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
        $('#alcoholRange').on('input', function() {
            $('#alcoholValue').text(`${this.value}%`);
            filterProducts();
        });
        $('#tanninRange').on('input', function() {
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

        $('.product-item').each(function() {
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
        $(document).on('mousedown', '.product-item', function() {
            $(this).attr('draggable', 'true');
        });
        
        // When drag starts
        $(document).on('dragstart', '.product-item', function(event) {
            const productId = $(this).data('id');
            event.originalEvent.dataTransfer.setData('text/plain', productId);
        });
        
        // Allow order area to receive drag and drop
        $('.order-list').on('dragover', function(event) {
            event.preventDefault();
            $(this).addClass('drag-over');
        });
        
        // Leave order area
        $('.order-list').on('dragleave', function() {
            $(this).removeClass('drag-over');
        });
        
        // Handle drop
        $('.order-list').on('drop', function(event) {
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
    $('#loginBtn').click(async function() {
        const username = $('#username').val();
        const password = $('#password').val();
        
        if (!username || !password) {
            $('#loginStatus').text('Please enter username and password');
            return;
        }
        
        // There should be actual login logic here, now just simulating success
        $('#loginStatus').text(`Welcome, ${username}`);
        
        // If there's a User class with login method, you can use the code below
        /*
        const user = await User.login(username, password);
        if (user) {
            $('#loginStatus').text(`Welcome, ${user.name}`);
        } else {
            $('#loginStatus').text('Login failed');
        }
        */
    });

    // Bill split functionality
    $('#billSplitBtn').click(function() {
        $('#billSplitModal').show();
    });

    $('#startSplitBtn').click(function() {
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
    });

    // Checkout button handling
    $('#checkoutBtn').click(function() {
        const itemCount = $('.order-item').length;
        if (itemCount === 0) {
            alert('Your order is empty, please add items first');
            return;
        }
        
        const total = $('#totalPrice').text();
        alert(`Thank you for your purchase! Your total is $${total}.`);
        
        // Clear the order
        $('#orderList').empty();
        updateTotal();
    });

    // Initialize application
    initializeProducts();
});