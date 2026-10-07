import { useState } from "react";
import {
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Building2,
} from "lucide-react";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || "Login failed");
        return;
      }

      if (data.access_token) {
        localStorage.setItem("netra_token", data.access_token);
        localStorage.setItem(
          "netra_officer",
          JSON.stringify(data.officer)
        );

        console.log("LOGIN SUCCESS:", data);

        onLogin(data.officer);
      } else {
        setError(data.message || "Invalid email or password");
      }
    } catch (error) {
      setError("Unable to connect to NETRA server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* LEFT SIDE */}
      <div className="login-brand-section">

        <div className="brand-content">

          <div className="brand-logo-large">
            <ShieldCheck size={34} strokeWidth={2.2} />
          </div>

          <div className="brand-title">
            <h1>NETRA</h1>
            <span>Government Transparency Portal</span>
          </div>

          <div className="brand-description">
            <h2>
              Transparent governance.
              <br />
              Smarter administration.
            </h2>

            <p>
              A centralized platform for monitoring government
              construction projects, inspections, budgets and
              public complaints.
            </p>
          </div>

          <div className="brand-features">

            <div className="brand-feature">
              <div className="feature-icon">
                <Building2 size={18} />
              </div>

              <div>
                <strong>Project Monitoring</strong>
                <span>
                  Track government projects in one place
                </span>
              </div>
            </div>

            <div className="brand-feature">
              <div className="feature-icon">
                <ShieldCheck size={18} />
              </div>

              <div>
                <strong>Secure Access</strong>
                <span>
                  Protected access for authorized officers
                </span>
              </div>
            </div>

          </div>

        </div>

        <div className="brand-footer">
          Government Administration System
        </div>

      </div>


      {/* RIGHT SIDE */}
      <div className="login-form-section">

        <div className="login-form-container">

          {/* MOBILE LOGO */}
          <div className="mobile-logo">

            <div className="mobile-logo-icon">
              <ShieldCheck size={25} />
            </div>

            <div>
              <strong>NETRA</strong>
              <span>Government Portal</span>
            </div>

          </div>


          {/* HEADING */}
          <div className="login-heading">

            <span className="welcome-label">
              WELCOME BACK
            </span>

            <h2>Sign in to your account</h2>

            <p>
              Enter your official credentials to access the
              NETRA administration portal.
            </p>

          </div>


          {/* FORM */}
          <form onSubmit={handleLogin}>

            {/* EMAIL */}
            <div className="login-input-group">

              <label>Official Email</label>

              <div className="login-input-wrapper">

                <Mail size={18} />

                <input
                  type="email"
                  placeholder="officer@department.gov.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

              </div>

            </div>


            {/* PASSWORD */}
            <div className="login-input-group">

              <label>Password</label>

              <div className="login-input-wrapper">

                <Lock size={18} />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>

            </div>


            {/* ERROR */}
            {error && (
              <div className="login-error">
                <span>!</span>
                {error}
              </div>
            )}


            {/* LOGIN BUTTON */}
            <button
              type="submit"
              className="login-submit"
              disabled={loading}
            >

              <span>
                {loading ? "Signing in..." : "Sign in"}
              </span>

              {!loading && <ArrowRight size={19} />}

            </button>

          </form>


          {/* SECURITY NOTICE */}
          <div className="security-notice">

            <ShieldCheck size={17} />

            <div>
              <strong>Authorized access only</strong>

              <span>
                This portal is restricted to authorized
                government personnel.
              </span>
            </div>

          </div>


          {/* FOOTER */}
          <div className="login-bottom">

            <span>NETRA v1.0.0</span>
            <span>•</span>
            <span>Government Administration</span>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;