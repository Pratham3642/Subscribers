import { useState } from "react";
import axios from "axios";

export default function Email() {
    const [email, setEmail] = useState("");

    const validateEmail = (email) => {
        const re = /^(?:[a-zA-Z0-9._%+-]+)@(?:[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
        return re.test(String(email).toLowerCase());
    };
    

    const handleSubscribe = async () => {
        if (!validateEmail(email)) {
            alert("Please enter a valid email address.");
            return;
        }

        try {
            const response = await axios.post('http://localhost:3000/save', { email });
            alert(response.data);
        } catch (error) {
            console.error("Subscription Failed", error.response?.data || error.message);
            alert(error.response?.data || "Subscription Failed");
        }
    };

    const handleUnsubscribe = async () => {
        if (!validateEmail(email)) {
            alert("Please enter a valid email address.");
            return;
        }

        try {
            const response = await axios.delete('http://localhost:3000/unsave', { data: { email } });
            alert(response.data);
        } catch (error) {
            console.error("Unsubscription Failed", error.response?.data || error.message);
            alert(error.response?.data || "Unsubscription Failed");
        }
    };

    return (
        <div className="container">
            <h1>Email Subscription</h1>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
            />
            <br />
            <button className="btn" onClick={handleSubscribe}>Subscribe</button>
            <button className="btn" onClick={handleUnsubscribe}>Unsubscribe</button>
        </div>
    );
}
