class User {
    constructor(username, password, name, balance) {
        this.username = username;
        this.password = password;
        this.name = name;
        this.balance = balance;
    }

    // Simple login verification
    static async login(username, password) {
        try {
            const response = await fetch('data/users.json');
            const data = await response.json();
            
            const user = data.vipUsers.find(
                u => u.username === username && u.password === password
            );

            return user ? new User(user.username, user.password, user.name, user.balance) : null;
        } catch (error) {
            console.error('Login error:', error);
            return null;
        }
    }

    // Logout method
    logout() {
        this.username = null;
        this.password = null;
        this.name = null;
        this.balance = null;
    }
}