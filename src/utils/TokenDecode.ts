import { JwtPayload, jwtDecode } from 'jwt-decode';

interface CustomJwtPayload extends JwtPayload {
    sub?: string; // Username dalam JWT token
}

/**
 * Memeriksa apakah token JWT sudah expired
 * @returns true jika token expired atau tidak ada, false jika token masih valid
 */
export const checkTokenExpiration = (): boolean => {
    const token = localStorage.getItem('app-token');

    if (!token) {
        return true; // Tidak ada token, anggap expired
    }

    try {
        const decoded = jwtDecode<CustomJwtPayload>(token);
        const currentTime = Date.now() / 1000; // Waktu saat ini dalam detik

        // Jika waktu expiration kurang dari waktu saat ini, token sudah expired
        if (decoded.exp && decoded.exp < currentTime) {
            // Hapus token dari localStorage karena sudah expired
            localStorage.removeItem('app-token');
            return true;
        }

        return false; // Token masih valid
    } catch (error) {
        console.error('Error decoding token:', error);
        localStorage.removeItem('app-token'); // Hapus token yang tidak valid
        return true;
    }
};

/**
 * Mengambil username dari token JWT
 * @returns username atau null jika token tidak valid
 */
export const getUsernameFromToken = (): string | null => {
    const token = localStorage.getItem('app-token');

    if (!token) {
        return null;
    }

    try {
        const decoded = jwtDecode<CustomJwtPayload>(token);
        return decoded.sub || null;
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};