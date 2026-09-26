import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Link,
  useNavigate,
} from "react-router-dom";
import axios from "axios";
import "./App.css";

const API_URL = "http://localhost:5001/api";

interface User {
  id: number;
  name: string;
  email: string;
}

interface Wallet {
  id: number;
  balance: string;
}

interface Transaction {
  id: number;
  amount: string;
  type: string;
  status: string;
  direction: "INCOMING" | "OUTGOING";
  reference: string;
  counterparty: {
    id: number;
    name: string;
    email: string;
  } | null;
  createdAt: string;
}

/* =========================
   LOGIN
========================= */

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${API_URL}/auth/login`,
        {
          email,
          password,
        }
      );

      localStorage.setItem(
        "payflow_token",
        response.data.token
      );

      localStorage.setItem(
        "payflow_user",
        JSON.stringify(response.data.user)
      );

      navigate("/dashboard");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message ||
            "Login failed. Please try again."
        );
      } else {
        setError("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <div className="login-card">
        <div className="brand">
          <div className="brand-icon">P</div>
          <h1>PayFlow</h1>
        </div>

        <p className="login-subtitle">
          Login to your account
        </p>

        <form
          onSubmit={handleLogin}
          className="login-form"
        >
          <div className="form-group">
            <label htmlFor="login-email">
              Email
            </label>

            <input
              id="login-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="login-password">
              Password
            </label>

            <input
              id="login-password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="register-text">
          Don't have an account?{" "}
          <Link to="/register">
            Create account
          </Link>
        </p>
      </div>
    </main>
  );
}

/* =========================
   REGISTER
========================= */

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleRegister(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!name || !email || !password) {
      setError(
        "Name, email and password are required"
      );
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters"
      );
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${API_URL}/auth/register`,
        {
          name,
          email,
          password,
        }
      );

      setSuccess(
        response.data.message ||
          "Registration successful"
      );

      setName("");
      setEmail("");
      setPassword("");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message ||
            "Registration failed"
        );
      } else {
        setError("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="register-page">
      <div className="simple-card">
        <div className="brand">
          <div className="brand-icon">P</div>
          <h1>PayFlow</h1>
        </div>

        <p className="login-subtitle">
          Create your account
        </p>

        <form
          onSubmit={handleRegister}
          className="login-form"
        >
          <div className="form-group">
            <label htmlFor="register-name">
              Full Name
            </label>

            <input
              id="register-name"
              type="text"
              placeholder="Adhiraj Singh"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              autoComplete="name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="register-email">
              Email
            </label>

            <input
              id="register-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="register-password">
              Password
            </label>

            <input
              id="register-password"
              type="password"
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              autoComplete="new-password"
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {success && (
            <div className="action-message">
              {success}
            </div>
          )}

          <button
            type="submit"
            className="primary-button"
            disabled={loading}
          >
            {loading
              ? "Creating account..."
              : "Create Account"}
          </button>
        </form>

        <p className="register-text">
          Already have an account?{" "}
          <Link to="/login">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}

/* =========================
   DASHBOARD
========================= */

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] =
    useState<User | null>(null);

  const [wallet, setWallet] =
    useState<Wallet | null>(null);

  const [transactions, setTransactions] =
    useState<Transaction[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [actionLoading, setActionLoading] =
    useState(false);

  const [error, setError] = useState("");

  const [showTransfer, setShowTransfer] =
    useState(false);

  const [showDeposit, setShowDeposit] =
    useState(false);

  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const [receiverEmail, setReceiverEmail] =
    useState("");

  const [transferAmount, setTransferAmount] =
    useState("");

  const [depositAmount, setDepositAmount] =
    useState("");

  const [actionMessage, setActionMessage] =
    useState("");

  const token =
    localStorage.getItem("payflow_token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const savedUser =
      localStorage.getItem("payflow_user");

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem(
          "payflow_user"
        );
      }
    }

    fetchDashboard();
  }, []);

  async function fetchDashboard() {
    try {
      setLoading(true);
      setError("");

      const authHeaders = {
        Authorization: `Bearer ${token}`,
      };

      const [
        walletResponse,
        transactionResponse,
      ] = await Promise.all([
        axios.get(`${API_URL}/wallet`, {
          headers: authHeaders,
        }),

        axios.get(
          `${API_URL}/transactions/history`,
          {
            headers: authHeaders,
          }
        ),
      ]);

      setWallet(
        walletResponse.data.wallet
      );

      setTransactions(
        transactionResponse.data.transactions
      );
    } catch (error) {
      console.error(error);

      if (
        axios.isAxiosError(error) &&
        error.response?.status === 401
      ) {
        handleLogout();
        return;
      }

      setError(
        axios.isAxiosError(error)
          ? error.response?.data?.message ||
              "Failed to load dashboard"
          : "Failed to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleTransfer(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setActionMessage("");

    if (
      !receiverEmail ||
      !transferAmount
    ) {
      setActionMessage(
        "Receiver email and amount are required."
      );
      return;
    }

    const amount =
      Number(transferAmount);

    if (
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      setActionMessage(
        "Amount must be greater than 0."
      );
      return;
    }

    try {
      setActionLoading(true);

      const response =
        await axios.post(
          `${API_URL}/transactions/transfer`,
          {
            receiverEmail,
            amount,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      setActionMessage(
        response.data.message ||
          "Transfer successful"
      );

      setReceiverEmail("");
      setTransferAmount("");
      setShowTransfer(false);

      await fetchDashboard();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setActionMessage(
          error.response?.data?.message ||
            "Transfer failed"
        );
      } else {
        setActionMessage(
          "Transfer failed"
        );
      }
    } finally {
      setActionLoading(false);
    }
  }

  async function handleDeposit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setActionMessage("");

    const amount =
      Number(depositAmount);

    if (
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      setActionMessage(
        "Amount must be greater than 0."
      );
      return;
    }

    try {
      setActionLoading(true);

      const response =
        await axios.post(
          `${API_URL}/wallet/deposit`,
          {
            amount,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      setActionMessage(
        response.data.message ||
          "Money deposited successfully"
      );

      setDepositAmount("");
      setShowDeposit(false);

      await fetchDashboard();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setActionMessage(
          error.response?.data?.message ||
            "Deposit failed"
        );
      } else {
        setActionMessage(
          "Deposit failed"
        );
      }
    } finally {
      setActionLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem(
      "payflow_token"
    );

    localStorage.removeItem(
      "payflow_user"
    );

    navigate("/login");
  }

  function formatCurrency(
    amount: string
  ) {
    return new Intl.NumberFormat(
      "en-IN",
      {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
      }
    ).format(Number(amount));
  }

  function formatDate(
    date: string
  ) {
    return new Date(date).toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  }

  function getTransactionName(
    transaction: Transaction
  ) {
    if (transaction.counterparty) {
      return transaction.counterparty.name;
    }

    return transaction.type === "CREDIT"
      ? "Wallet Deposit"
      : "Transaction";
  }

  if (loading) {
    return (
      <main className="dashboard-page">
        <div className="dashboard-loading">
          Loading PayFlow...
        </div>
      </main>
    );
  }

  return (
    <main className="dashboard-page">
      <div className="dashboard-container">

        {/* HEADER */}

        <header className="dashboard-header">
          <div className="dashboard-brand">
            <div className="brand-icon">
              P
            </div>

            <div>
              <h1>PayFlow</h1>
              <p>Digital Wallet</p>
            </div>
          </div>

          <div className="header-right">
            <div className="user-info">
              <strong>
                {user?.name || "User"}
              </strong>

              <span>
                {user?.email || ""}
              </span>
            </div>

            <button
              className="logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </header>

        {/* ERRORS */}

        {error && (
          <div className="dashboard-error">
            {error}
          </div>
        )}

        {actionMessage && (
          <div className="action-message">
            {actionMessage}
          </div>
        )}

        {/* BALANCE */}

        <section className="balance-card">
          <div>
            <p className="balance-label">
              Available Balance
            </p>

            <h2>
              {wallet
                ? formatCurrency(
                    wallet.balance
                  )
                : "₹0.00"}
            </h2>
          </div>

          <div className="wallet-id">
            Wallet #{wallet?.id}
          </div>
        </section>

        {/* ACTIONS */}

        <section className="action-grid">
          <button
            className="action-card"
            onClick={() =>
              setShowTransfer(true)
            }
          >
            <span className="action-icon">
              ↑
            </span>

            <div>
              <strong>
                Send Money
              </strong>

              <p>
                Transfer money to another user
              </p>
            </div>
          </button>

          <button
            className="action-card"
            onClick={() =>
              setShowDeposit(true)
            }
          >
            <span className="action-icon">
              +
            </span>

            <div>
              <strong>
                Add Money
              </strong>

              <p>
                Deposit money into your wallet
              </p>
            </div>
          </button>
        </section>

        {/* TRANSACTIONS */}

        <section className="transactions-section">
          <div className="section-heading">
            <div>
              <h2>
                Recent Transactions
              </h2>

              <p>
                Your latest wallet activity
              </p>
            </div>

            <button
              className="refresh-button"
              onClick={fetchDashboard}
            >
              Refresh
            </button>
          </div>

          {transactions.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                ₹
              </div>

              <h3>
                No transactions yet
              </h3>

              <p>
                Your transactions will appear
                here.
              </p>
            </div>
          ) : (
            <div className="transaction-list">
              {transactions.map(
                (transaction) => (
                  <button
                    className="transaction-item"
                    key={transaction.id}
                    type="button"
                    onClick={() =>
                      setSelectedTransaction(
                        transaction
                      )
                    }
                  >
                    <div
                      className={`transaction-icon ${
                        transaction.direction ===
                        "INCOMING"
                          ? "incoming"
                          : "outgoing"
                      }`}
                    >
                      {transaction.direction ===
                      "INCOMING"
                        ? "↓"
                        : "↑"}
                    </div>

                    <div className="transaction-main">
                      <strong>
                        {getTransactionName(
                          transaction
                        )}
                      </strong>

                      <span>
                        {transaction.direction ===
                        "INCOMING"
                          ? "Money received"
                          : "Money sent"}
                      </span>

                      <small>
                        {formatDate(
                          transaction.createdAt
                        )}
                      </small>
                    </div>

                    <div className="transaction-right">
                      <strong
                        className={
                          transaction.direction ===
                          "INCOMING"
                            ? "amount-incoming"
                            : "amount-outgoing"
                        }
                      >
                        {transaction.direction ===
                        "INCOMING"
                          ? "+"
                          : "-"}
                        {formatCurrency(
                          transaction.amount
                        )}
                      </strong>

                      <span className="status-badge">
                        {transaction.status}
                      </span>
                    </div>
                  </button>
                )
              )}
            </div>
          )}
        </section>
      </div>

      {/* =========================
          TRANSFER MODAL
      ========================= */}

      {showTransfer && (
        <div
          className="modal-overlay"
          onClick={() =>
            !actionLoading &&
            setShowTransfer(false)
          }
        >
          <div
            className="modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="modal-header">
              <div>
                <h2>
                  Send Money
                </h2>

                <p>
                  Transfer money to a PayFlow user
                </p>
              </div>

              <button
                className="close-button"
                onClick={() =>
                  setShowTransfer(false)
                }
                disabled={actionLoading}
              >
                ×
              </button>
            </div>

            <form
              onSubmit={handleTransfer}
              className="modal-form"
            >
              <div className="form-group">
                <label>
                  Receiver Email
                </label>

                <input
                  type="email"
                  placeholder="rahul@test.com"
                  value={receiverEmail}
                  onChange={(event) =>
                    setReceiverEmail(
                      event.target.value
                    )
                  }
                />
              </div>

              <div className="form-group">
                <label>
                  Amount
                </label>

                <input
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="100"
                  value={transferAmount}
                  onChange={(event) =>
                    setTransferAmount(
                      event.target.value
                    )
                  }
                />
              </div>

              <button
                type="submit"
                className="primary-button"
                disabled={actionLoading}
              >
                {actionLoading
                  ? "Sending..."
                  : "Send Money"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* =========================
          DEPOSIT MODAL
      ========================= */}

      {showDeposit && (
        <div
          className="modal-overlay"
          onClick={() =>
            !actionLoading &&
            setShowDeposit(false)
          }
        >
          <div
            className="modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="modal-header">
              <div>
                <h2>
                  Add Money
                </h2>

                <p>
                  Add money to your PayFlow wallet
                </p>
              </div>

              <button
                className="close-button"
                onClick={() =>
                  setShowDeposit(false)
                }
                disabled={actionLoading}
              >
                ×
              </button>
            </div>

            <form
              onSubmit={handleDeposit}
              className="modal-form"
            >
              <div className="form-group">
                <label>
                  Amount
                </label>

                <input
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="1000"
                  value={depositAmount}
                  onChange={(event) =>
                    setDepositAmount(
                      event.target.value
                    )
                  }
                />
              </div>

              <button
                type="submit"
                className="primary-button"
                disabled={actionLoading}
              >
                {actionLoading
                  ? "Processing..."
                  : "Add Money"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* =========================
          TRANSACTION DETAILS MODAL
      ========================= */}

      {selectedTransaction && (
        <div
          className="modal-overlay"
          onClick={() =>
            setSelectedTransaction(null)
          }
        >
          <div
            className="modal transaction-details-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="modal-header">
              <div>
                <h2>
                  Transaction Details
                </h2>

                <p>
                  Complete information about this transaction
                </p>
              </div>

              <button
                className="close-button"
                onClick={() =>
                  setSelectedTransaction(null)
                }
              >
                ×
              </button>
            </div>

            {/* AMOUNT */}

            <div
              className={`transaction-detail-amount ${
                selectedTransaction.direction ===
                "INCOMING"
                  ? "detail-incoming"
                  : "detail-outgoing"
              }`}
            >
              <span>
                {selectedTransaction.direction ===
                "INCOMING"
                  ? "+"
                  : "-"}
              </span>

              {formatCurrency(
                selectedTransaction.amount
              )}
            </div>

            {/* STATUS */}

            <div className="transaction-detail-status">
              <span className="detail-label">
                Status
              </span>

              <span className="status-badge large">
                {selectedTransaction.status}
              </span>
            </div>

            {/* DETAILS */}

            <div className="transaction-details-list">

              <div className="detail-row">
                <span className="detail-label">
                  Transaction ID
                </span>

                <strong>
                  #{selectedTransaction.id}
                </strong>
              </div>

              <div className="detail-row">
                <span className="detail-label">
                  Reference
                </span>

                <strong className="reference-value">
                  {selectedTransaction.reference ||
                    "N/A"}
                </strong>
              </div>

              <div className="detail-row">
                <span className="detail-label">
                  Transaction Type
                </span>

                <strong>
                  {selectedTransaction.type}
                </strong>
              </div>

              <div className="detail-row">
                <span className="detail-label">
                  Direction
                </span>

                <strong>
                  {selectedTransaction.direction ===
                  "INCOMING"
                    ? "Incoming"
                    : "Outgoing"}
                </strong>
              </div>

              <div className="detail-row">
                <span className="detail-label">
                  Date & Time
                </span>

                <strong>
                  {formatDate(
                    selectedTransaction.createdAt
                  )}
                </strong>
              </div>

              <div className="detail-row">
                <span className="detail-label">
                  Counterparty
                </span>

                <strong>
                  {selectedTransaction.counterparty
                    ? selectedTransaction
                        .counterparty.name
                    : "Wallet Deposit"}
                </strong>
              </div>

              {selectedTransaction.counterparty && (
                <div className="detail-row">
                  <span className="detail-label">
                    Counterparty Email
                  </span>

                  <strong>
                    {
                      selectedTransaction
                        .counterparty.email
                    }
                  </strong>
                </div>
              )}

              {selectedTransaction.counterparty && (
                <div className="detail-row">
                  <span className="detail-label">
                    Counterparty ID
                  </span>

                  <strong>
                    #
                    {
                      selectedTransaction
                        .counterparty.id
                    }
                  </strong>
                </div>
              )}

            </div>

            <button
              className="primary-button detail-close-button"
              onClick={() =>
                setSelectedTransaction(null)
              }
            >
              Done
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

/* =========================
   APP ROUTES
========================= */

function App() {
  const token =
    localStorage.getItem(
      "payflow_token"
    );

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Navigate
              to={
                token
                  ? "/dashboard"
                  : "/login"
              }
              replace
            />
          }
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;