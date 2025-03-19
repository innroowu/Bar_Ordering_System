$(document).ready(function() {
    // Navigate to customer page
    $('#customerBtn').click(function() {
        window.location.href = 'customer.html';
    });

    // Show waiter login modal
    $('#waiterBtn').click(function() {
        $('#waiterLoginModal').show();
    });

    // Show owner login modal
    $('#ownerBtn').click(function() {
        $('#ownerLoginModal').show();
    });

    // Close modal when clicking X or outside
    $('.close').click(function() {
        $(this).closest('.modal').hide();
    });

    $(window).click(function(event) {
        if ($(event.target).is('.modal')) {
            $('.modal').hide();
        }
    });

    // Owner login process
    $('#ownerLoginBtn').click(async function() {
        const username = $('#ownerUsername').val();
        const password = $('#ownerPassword').val();
        
        if (!username || !password) {
            $('#ownerLoginError').show().text('Please enter username and password');
            return;
        }
        
        try {
            const response = await fetch('data/users.json');
            const data = await response.json();
            
            // Check if owner credentials are valid
            const owner = data.ownerUsers?.find(
                u => u.username === username && u.password === password
            );
            
            if (owner) {
                // Store login info in session storage
                sessionStorage.setItem('ownerLoggedIn', 'true');
                sessionStorage.setItem('ownerName', owner.name);
                
                // Redirect to owner page
                window.location.href = 'owner.html';
            } else {
                $('#ownerLoginError').show().text('Invalid username or password');
            }
        } catch (error) {
            console.error('Login error:', error);
            $('#ownerLoginError').show().text('An error occurred during login');
        }
    });

    // Waiter login process
    $('#waiterLoginBtn').click(async function() {
        const username = $('#waiterUsername').val();
        const password = $('#waiterPassword').val();
        
        if (!username || !password) {
            $('#waiterLoginError').show().text('Please enter username and password');
            return;
        }
        
        try {
            const response = await fetch('data/users.json');
            const data = await response.json();
            
            // Check if waiter credentials are valid
            const waiter = data.waiterUsers?.find(
                u => u.username === username && u.password === password
            );
            
            if (waiter) {
                // Store login info in session storage
                sessionStorage.setItem('waiterLoggedIn', 'true');
                sessionStorage.setItem('waiterName', waiter.name);
                
                // Redirect to waiter page
                window.location.href = 'waiter.html';
            } else {
                $('#waiterLoginError').show().text('Invalid username or password');
            }
        } catch (error) {
            console.error('Login error:', error);
            $('#waiterLoginError').show().text('An error occurred during login');
        }
    });
});