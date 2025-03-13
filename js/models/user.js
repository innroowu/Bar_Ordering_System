class User {
    constructor(username, password, name) {
        this.username = username;
        this.password = password;
        this.name = name;
    }

    // Simple login verification
    static async login(username, password) {
        try {
            const response = await fetch('http://localhost:3000/users');
            const data = await response.json();
            
            const user = data.vipUsers.find(
                u => u.username === username && u.password === password
            );

            return user ? new User(user.username, user.password, user.name) : null;
        } catch (error) {
            console.error('Login error:', error);
            return null;
        }
    }
}