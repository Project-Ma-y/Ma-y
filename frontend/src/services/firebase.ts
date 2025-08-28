// Import the functions you need from the Firebase SDKs
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// 이 부분의 YOUR_xxx 값을 실제 Firebase 프로젝트 설정으로 교체해주세요.
const firebaseConfig = {
            apiKey: "AIzaSyALislKfX7MQeh1IteqWiiaxYGJ_KrNZN4",
            authDomain: "ma-y-b1fa6.firebaseapp.com",
            databaseURL: "https://ma-y-b1fa6-default-rtdb.firebaseio.com",
            projectId: "ma-y-b1fa6",
            storageBucket: "ma-y-b1fa6.firebasestorage.app",
            messagingSenderId: "48645617538",
            appId: "1:48645617538:web:23d556cdd2c5b223b2019b",
            measurementId: "G-8CPE7B7PLN",
        };
// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

// Export the initialized services as named exports
// 'default' export를 사용하지 않고, 필요한 서비스들만 명확하게 내보냅니다.
export { app, auth, db };
