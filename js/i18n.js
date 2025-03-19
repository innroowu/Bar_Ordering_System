// Define language packs
const translations = {
    // English (default language)
    en: {
        // Category buttons
        "allBtn": "All Products",
        "winesBtn": "Wines",
        "beersBtn": "Beers",
        "cocktailsBtn": "Cocktails",
        "foodBtn": "Food",
        
        // Search and filter
        "searchPlaceholder": "Search products...",
        "allergenFilter": "Allergen Filter:",
        "alcoholContent": "Alcohol Content:",
        "tanninLevel": "Tannin Level:",
        
        // Drag instruction
        "dragInstruction": "Click items to view details, or drag and drop to the right to add to order",
        
        // VIP login
        "vipLogin": "VIP Login",
        "usernamePlaceholder": "Username",
        "passwordPlaceholder": "Password",
        "loginBtn": "Login",
        "logoutBtn": "Logout",
        "specialDrinksBtn": "Special Drinks",
        "loginFailed": "Login failed",
        "pleaseEnterCredentials": "Please enter username and password",
        
        // Order area
        "yourOrder": "Your Order",
        "dropItemsHere": "(Drop items here)",
        "emptyOrderMessage": "Drag products from the left to add to your order",
        "total": "Total:",
        "undoBtn": "Undo",
        "redoBtn": "Redo",
        "billSplitBtn": "Split Bill",
        "checkoutBtn": "Checkout",
        
        // Checkout related
        "orderEmpty": "Your order is empty, please add items first",
        "insufficientBalance": "You do not have enough balance to complete this purchase.",
        "thankYouPurchase": "Thank you for your purchase! Your total is $",
        
        // Bill splitting
        "billSplitting": "Bill Splitting",
        "numberOfParticipants": "Number of participants",
        "startSplitBtn": "Start Split",
        "participantAmount": "Participant",
        "amount": "Amount:",
        "confirmSplitBtn": "Confirm Split",
        "enterValidParticipants": "Please enter a valid number of participants",
        "waiterSettleBill": "The waiter will come to the table to settle the bill",
        
        // Other
        "welcome": "Welcome,",
        "balance": "Balance:",
        "backBtn": "Back",
        "loading": "Loading products...",
        
        // Product details
        "price": "Price",
        "details": "Details",
        "description": "Description",
        "noDescription": "No description available",
        "nutritionInfo": "Nutrition and Allergen Information",
        "allergens": "Allergens",
        "none": "None",
        "alcoholContent": "Alcohol Content",
        "tanninContent": "Tannin Content",
        "addToOrder": "Add to Order"
    },
    
    // Chinese
    zh: {
        // Category buttons
        "allBtn": "所有產品",
        "winesBtn": "葡萄酒",
        "beersBtn": "啤酒",
        "cocktailsBtn": "雞尾酒",
        "foodBtn": "食物",
        
        // Search and filter
        "searchPlaceholder": "搜索產品...",
        "allergenFilter": "過敏原篩選:",
        "alcoholContent": "酒精含量:",
        "tanninLevel": "單寧水平:",
        
        // Drag instruction
        "dragInstruction": "點擊查看詳情，或托放到右側以添加到訂單",
        
        // VIP login
        "vipLogin": "貴賓登入",
        "usernamePlaceholder": "用戶名",
        "passwordPlaceholder": "密碼",
        "loginBtn": "登入",
        "logoutBtn": "登出",
        "specialDrinksBtn": "特色飲品",
        "loginFailed": "登入失败",
        "pleaseEnterCredentials": "請輸入用戶名和密碼",
        
        // Order area
        "yourOrder": "您的訂單",
        "dropItemsHere": "(拖放至此)",
        "emptyOrderMessage": "從左側拖放產品以添加到訂單",
        "total": "總計:",
        "undoBtn": "撤銷",
        "redoBtn": "恢復",
        "billSplitBtn": "分帳",
        "checkoutBtn": "結帳",
        
        // Checkout related
        "orderEmpty": "您的訂單為空，請先添加商品",
        "insufficientBalance": "您的餘額不足",
        "thankYouPurchase": "感謝您的購買！總計是 $",
        
        // Bill splitting
        "billSplitting": "帳單拆分",
        "numberOfParticipants": "分帳人數",
        "startSplitBtn": "開始分帳",
        "participantAmount": "參與者",
        "amount": "金額:",
        "confirmSplitBtn": "確認分帳",
        "enterValidParticipants": "請輸入有效的人數",
        "waiterSettleBill": "服務員將前來結帳",
        
        // Other
        "welcome": "歡迎，",
        "balance": "餘額:",
        "backBtn": "返回",
        "loading": "正在加載商品...",
        
        // Product details
        "price": "價格",
        "details": "詳情",
        "description": "描述",
        "noDescription": "暫無描述",
        "nutritionInfo": "營養與過敏原訊息",
        "allergens": "過敏原",
        "none": "無",
        "alcoholContent": "酒精含量",
        "tanninContent": "單寧含量",
        "addToOrder": "添加到訂單"
    },
    
    // Swedish
    sv: {
        // Category buttons
        "allBtn": "Alla Produkter",
        "winesBtn": "Viner",
        "beersBtn": "Öl",
        "cocktailsBtn": "Cocktails",
        "foodBtn": "Mat",
        
        // Search and filter
        "searchPlaceholder": "Sök produkter...",
        "allergenFilter": "Allergenfilter:",
        "alcoholContent": "Alkoholhalt:",
        "tanninLevel": "Tanninnivå:",
        
        // Drag instruction
        "dragInstruction": "Klicka för att visa detaljer eller dra och släpp till höger för att lägga till i beställningen",
        
        // VIP login
        "vipLogin": "VIP Inloggning",
        "usernamePlaceholder": "Användarnamn",
        "passwordPlaceholder": "Lösenord",
        "loginBtn": "Logga in",
        "logoutBtn": "Logga ut",
        "specialDrinksBtn": "Speciella Drycker",
        "loginFailed": "Inloggning misslyckades",
        "pleaseEnterCredentials": "Vänligen ange användarnamn och lösenord",
        
        // Order area
        "yourOrder": "Din Beställning",
        "dropItemsHere": "(Släpp objekt här)",
        "emptyOrderMessage": "Dra produkter från vänster för att lägga till i din beställning",
        "total": "Totalt:",
        "undoBtn": "Ångra",
        "redoBtn": "Gör om",
        "billSplitBtn": "Dela Nota",
        "checkoutBtn": "Betala",
        
        // Checkout related
        "orderEmpty": "Din beställning är tom, lägg till varor först",
        "insufficientBalance": "Du har inte tillräckligt med saldo för att slutföra detta köp.",
        "thankYouPurchase": "Tack för ditt köp! Ditt totala belopp är $",
        
        // Bill splitting
        "billSplitting": "Dela Nota",
        "numberOfParticipants": "Antal deltagare",
        "startSplitBtn": "Börja Dela",
        "participantAmount": "Deltagare",
        "amount": "Belopp:",
        "confirmSplitBtn": "Bekräfta Delning",
        "enterValidParticipants": "Ange ett giltigt antal deltagare",
        "waiterSettleBill": "Servitören kommer till bordet för att göra upp notan",
        
        // Other
        "welcome": "Välkommen,",
        "balance": "Saldo:",
        "backBtn": "Tillbaka",
        "loading": "Laddar produkter...",
        
        // Product details
        "price": "Pris",
        "details": "Detaljer",
        "description": "Beskrivning",
        "noDescription": "Ingen beskrivning tillgänglig",
        "nutritionInfo": "Närings- och allergeninformation",
        "allergens": "Allergener",
        "none": "Inga",
        "alcoholContent": "Alkoholhalt",
        "tanninContent": "Tanninhalt",
        "addToOrder": "Lägg till i order"
    }
};

// Get current language or set default language
function getCurrentLanguage() {
    return localStorage.getItem('barOrderingLanguage') || 'en';
}

// Set language
function setLanguage(lang) {
    localStorage.setItem('barOrderingLanguage', lang);
    applyTranslations();
}

// Apply translations
function applyTranslations() {
    const currentLang = getCurrentLanguage();
    const langData = translations[currentLang] || translations.en;
    
    // Update button text
    $('#allBtn').text(langData.allBtn);
    $('#winesBtn').text(langData.winesBtn);
    $('#beersBtn').text(langData.beersBtn);
    $('#cocktailsBtn').text(langData.cocktailsBtn);
    $('#foodBtn').text(langData.foodBtn);
    
    // Update search and filter
    $('#productSearch').attr('placeholder', langData.searchPlaceholder);
    $('.allergen-filter label').text(langData.allergenFilter);
    $('.alcohol-filter label').html(`${langData.alcoholContent} <span id="alcoholValue">${$('#alcoholRange').val()}%</span>`);
    $('.tannin-filter label').html(`${langData.tanninLevel} <span id="tanninValue">${$('#tanninRange').val()}</span>/10`);
    
    // Update drag instruction
    $('.drag-instruction').text(langData.dragInstruction);
    
    // Update VIP login area
    $('.vip-login h3').text(langData.vipLogin);
    $('#username').attr('placeholder', langData.usernamePlaceholder);
    $('#password').attr('placeholder', langData.passwordPlaceholder);
    
    // Update login button text based on login status
    if ($('#loginBtn').text() === 'Login' || $('#loginBtn').text() === '登录' || $('#loginBtn').text() === 'Logga in') {
        $('#loginBtn').text(langData.loginBtn);
    } else {
        $('#loginBtn').text(langData.logoutBtn);
    }
    
    $('#SpecialDBtn').text(langData.specialDrinksBtn);
    
    // Update order area
    $('.order-section h3').html(`${langData.yourOrder} <small>${langData.dropItemsHere}</small>`);
    $('.empty-order-message').text(langData.emptyOrderMessage);
    $('.order-summary p').html(`${langData.total} $<span id="totalPrice">${$('#totalPrice').text()}</span>`);
    $('#undoBtn').text(langData.undoBtn);
    $('#redoBtn').text(langData.redoBtn);
    $('#billSplitBtn').text(langData.billSplitBtn);
    $('#checkoutBtn').text(langData.checkoutBtn);
    
    // Update bill split modal
    $('#billSplitModal h3').text(langData.billSplitting);
    $('#participantCount').attr('placeholder', langData.numberOfParticipants);
    $('#startSplitBtn').text(langData.startSplitBtn);
    $('#confirmSplitBtn').text(langData.confirmSplitBtn);
    
    // Update back button
    $('#backBtn').text(langData.backBtn);
    
    // Update loading text
    $('.loading').text(langData.loading);
    
    // If there is a logged-in user, update welcome message
    if ($('#loginStatus').html().includes('Welcome') || 
        $('#loginStatus').html().includes('歡迎') || 
        $('#loginStatus').html().includes('Välkommen')) {
        
        const userName = $('#loginStatus').html().split(',')[1]?.split('<br>')[0] || '';
        const balance = $('#loginStatus').html().split('$')[1] || '';
        
        if (userName && balance) {
            $('#loginStatus').html(`${langData.welcome}${userName}<br>${langData.balance} $${balance}`);
        }
    }
    
    // Update existing participant input labels (if any)
    $('.participant-amount').each(function(index) {
        const label = $(this).prev('label');
        if (label.length) {
            label.text(`${langData.participantAmount} ${index + 1} ${langData.amount}`);
        }
    });
}

// Initialize language selector
function initLanguageSelector() {
    const currentLang = getCurrentLanguage();
    $('#language-select').val(currentLang);
    
    // Apply current language
    applyTranslations();
    
    // Add language change event
    $('#language-select').change(function() {
        const selectedLang = $(this).val();
        setLanguage(selectedLang);
    });
}

window.i18n = {
    getCurrentLanguage,
    setLanguage,
    applyTranslations,
    initLanguageSelector,
    translate: function(key) {
        const currentLang = getCurrentLanguage();
        const langData = translations[currentLang] || translations.en;
        return langData[key] || key;
    }
};