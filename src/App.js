import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Book,
  Users,
  ArrowLeftRight,
  BarChart3,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
} from "lucide-react";


// API Base URL for backend
const API_URL = "http://localhost:8080/api";

export default function LibraryManagementSystem() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [formData, setFormData] = useState({});

  const fetchData = useCallback(async () => {
    try {
      if (activeTab === "dashboard") {
        const res = await fetch(`${API_URL}/analytics`);
        setAnalytics(await res.json());
      } else if (activeTab === "books") {
        const res = await fetch(`${API_URL}/books`);
        setBooks(await res.json());
      } else if (activeTab === "users") {
        const res = await fetch(`${API_URL}/users`);
        setUsers(await res.json());
      } else if (activeTab === "transactions") {
        const res = await fetch(`${API_URL}/transactions`);
        setTransactions(await res.json());
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [activeTab]); // only depends on activeTab

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleCreate = (type) => {
    setModalType(type);
    setFormData({});
    setShowModal(true);
  };

  const handleEdit = (type, item) => {
    setModalType(type);
    setFormData(item);
    setShowModal(true);
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await fetch(`${API_URL}/${type}/${id}`, { method: "DELETE" });
      fetchData();
    } catch (error) {
      alert("Error deleting item: " + error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = formData.id
      ? `${API_URL}/${modalType}/${formData.id}`
      : `${API_URL}/${modalType}`;
    const method = formData.id ? "PUT" : "POST";
    try {
      await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      setShowModal(false);
      fetchData();
    } catch (error) {
      alert("Error saving: " + error.message);
    }
  };

  const handleBorrow = async () => {
    try {
      await fetch(`${API_URL}/transactions/borrow`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: formData.userId,
          bookId: formData.bookId,
        }),
      });
      setShowModal(false);
      fetchData();
    } catch (error) {
      alert("Error borrowing book: " + error.message);
    }
  };

  const handleReturn = async (transactionId) => {
    if (!window.confirm("Confirm book return?")) return;
    try {
      await fetch(`${API_URL}/transactions/return/${transactionId}`, {
        method: "POST",
      });
      fetchData();
    } catch (error) {
      alert("Error returning book: " + error.message);
    }
  };

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn.includes(searchTerm)
  );
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.memberId.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-rapunzel-lightlavender font-rapunzel">
      {/* NAVBAR */}
      <nav className="bg-rapunzel-purple text-rapunzel-yellow shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Book className="w-8 h-8 text-rapunzel-yellow" />
              <h1 className="text-3xl font-extrabold tracking-tight text-rapunzel-yellow">Library Management System</h1>
            </div>
          </div>
        </div>
      </nav>
      {/* TABS */}
      <div className="bg-rapunzel-green shadow font-semibold">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-1">
            {[
              { id: "dashboard", label: "Dashboard", icon: BarChart3 },
              { id: "books", label: "Books", icon: Book },
              { id: "users", label: "Users", icon: Users },
              { id: "transactions", label: "Transactions", icon: ArrowLeftRight },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 font-medium rounded-t transition ${
                  activeTab === tab.id
                    ? "text-rapunzel-purple border-b-4 border-rapunzel-yellow bg-rapunzel-lightlavender"
                    : "text-rapunzel-purple/80 hover:text-rapunzel-purple"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-8 font-rapunzel">
        {/* DASHBOARD */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <h2 className="text-3xl font-extrabold tracking-tight text-rapunzel-purple">
              Dashboard Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* CARD BLOCKS */}
              <div className="bg-rapunzel-yellow rounded-xl shadow p-6 border-4 border-rapunzel-purple">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-rapunzel-purple text-sm">Total Books</p>
                    <p className="text-3xl font-bold text-rapunzel-purple">
                      {analytics.totalBooks || 0}
                    </p>
                  </div>
                  <Book className="w-12 h-12 text-rapunzel-purple" />
                </div>
              </div>
              <div className="bg-rapunzel-green rounded-xl shadow p-6 border-4 border-rapunzel-purple">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-rapunzel-purple text-sm">Available Books</p>
                    <p className="text-3xl font-bold text-rapunzel-purple">
                      {analytics.availableBooks || 0}
                    </p>
                  </div>
                  <CheckCircle className="w-12 h-12 text-rapunzel-purple" />
                </div>
              </div>
              <div className="bg-rapunzel-yellow rounded-xl shadow p-6 border-4 border-rapunzel-purple">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-rapunzel-purple text-sm">Borrowed Books</p>
                    <p className="text-3xl font-bold text-rapunzel-purple">
                      {analytics.borrowedBooks || 0}
                    </p>
                  </div>
                  <ArrowLeftRight className="w-12 h-12 text-rapunzel-purple" />
                </div>
              </div>

              <div className="bg-rapunzel-lavender rounded-xl shadow p-6 border-4 border-rapunzel-purple">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-rapunzel-yellow text-sm">Total Users</p>
                    <p className="text-3xl font-bold text-rapunzel-yellow">
                      {analytics.totalUsers || 0}
                    </p>
                  </div>
                  <Users className="w-12 h-12 text-rapunzel-yellow" />
                </div>
              </div>
            </div>
          </div>
        )}
        {/* BOOKS */}
        {activeTab === "books" && (
          <div className="space-y-6 font-rapunzel">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-rapunzel-purple">
                Books Management
              </h2>
              <button
                onClick={() => handleCreate("books")}
                className="flex items-center space-x-2 bg-rapunzel-yellow text-rapunzel-purple px-4 py-2 rounded-lg hover:bg-rapunzel-accent transition font-semibold border-2 border-rapunzel-purple"
              >
                <Plus className="w-5 h-5" />
                <span>Add Book</span>
              </button>
            </div>
            <div className="bg-white rounded-lg shadow p-4 border-4 border-rapunzel-lavender">
              <div className="flex items-center space-x-2 mb-4">
                <Search className="w-5 h-5 text-rapunzel-purple" />
                <input
                  type="text"
                  placeholder="Search books by title, author, or ISBN..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 px-4 py-2 border border-rapunzel-yellow rounded-lg focus:outline-none focus:ring-2 focus:ring-rapunzel-yellow font-rapunzel"
                />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-rapunzel-lightlavender">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-rapunzel-purple uppercase font-rapunzel">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-rapunzel-purple uppercase font-rapunzel">Author</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-rapunzel-purple uppercase font-rapunzel">ISBN</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-rapunzel-purple uppercase font-rapunzel">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-rapunzel-purple uppercase font-rapunzel">Available</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-rapunzel-purple uppercase font-rapunzel">Total</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-rapunzel-purple uppercase font-rapunzel">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-rapunzel-lavender">
                    {filteredBooks.map((book) => (
                      <tr key={book.id} className="hover:bg-rapunzel-lightlavender">
                        <td className="px-6 py-4">{book.title}</td>
                        <td className="px-6 py-4">{book.author}</td>
                        <td className="px-6 py-4">{book.isbn}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-rapunzel-yellow text-rapunzel-purple rounded-full text-xs font-rapunzel">
                            {book.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">{book.availableCopies}</td>
                        <td className="px-6 py-4">{book.totalCopies}</td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit("books", book)}
                              className="text-rapunzel-purple hover:bg-rapunzel-lavender rounded p-2"
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDelete("books", book.id)}
                              className="text-red-600 hover:bg-rapunzel-lavender rounded p-2"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        {/* USERS */}
        {activeTab === "users" && (
          <div className="space-y-6 font-rapunzel">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-rapunzel-purple">Users Management</h2>
              <button
                onClick={() => handleCreate("users")}
                className="flex items-center space-x-2 bg-rapunzel-yellow text-rapunzel-purple px-4 py-2 rounded-lg hover:bg-rapunzel-accent transition font-semibold border-2 border-rapunzel-purple"
              >
                <Plus className="w-5 h-5" />
                <span>Add User</span>
              </button>
            </div>
            <div className="bg-white rounded-lg shadow p-4 border-4 border-rapunzel-green">
              <div className="flex items-center space-x-2 mb-4">
                <Search className="w-5 h-5 text-rapunzel-purple" />
                <input
                  type="text"
                  placeholder="Search users by name, email, or member ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 px-4 py-2 border border-rapunzel-yellow rounded-lg focus:outline-none focus:ring-2 focus:ring-rapunzel-yellow font-rapunzel"
                />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-rapunzel-lightlavender">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-rapunzel-purple uppercase font-rapunzel">Member ID</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-rapunzel-purple uppercase font-rapunzel">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-rapunzel-purple uppercase font-rapunzel">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-rapunzel-purple uppercase font-rapunzel">Phone</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-rapunzel-purple uppercase font-rapunzel">Borrowed</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-rapunzel-purple uppercase font-rapunzel">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-rapunzel-purple uppercase font-rapunzel">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-rapunzel-green">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-rapunzel-lightlavender">
                        <td className="px-6 py-4">{user.memberId}</td>
                        <td className="px-6 py-4">{user.name}</td>
                        <td className="px-6 py-4">{user.email}</td>
                        <td className="px-6 py-4">{user.phone}</td>
                        <td className="px-6 py-4">{user.borrowedBooks || 0}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-rapunzel ${
                              user.status === "active"
                                ? "bg-rapunzel-green text-rapunzel-purple"
                                : "bg-rapunzel-yellow text-rapunzel-purple"
                            }`}
                          >
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit("users", user)}
                              className="text-rapunzel-purple hover:bg-rapunzel-lavender rounded p-2"
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDelete("users", user.id)}
                              className="text-red-600 hover:bg-rapunzel-lavender rounded p-2"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        {/* TRANSACTIONS */}
        {activeTab === "transactions" && (
          <div className="space-y-6 font-rapunzel">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-rapunzel-purple">
                Borrow/Return Transactions
              </h2>
              <button
                onClick={() => {
                  setModalType("borrow");
                  setFormData({});
                  setShowModal(true);
                }}
                className="flex items-center space-x-2 bg-rapunzel-yellow text-rapunzel-purple px-4 py-2 rounded-lg hover:bg-rapunzel-accent transition font-semibold border-2 border-rapunzel-purple"
              >
                <Plus className="w-5 h-5" />
                <span>Borrow Book</span>
              </button>
            </div>
            <div className="bg-white rounded-lg shadow p-4 border-4 border-rapunzel-purple">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-rapunzel-lightlavender">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-rapunzel-purple uppercase font-rapunzel">User</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-rapunzel-purple uppercase font-rapunzel">Book</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-rapunzel-purple uppercase font-rapunzel">Borrow Date</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-rapunzel-purple uppercase font-rapunzel">Due Date</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-rapunzel-purple uppercase font-rapunzel">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-rapunzel-purple uppercase font-rapunzel">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-rapunzel-purple">
                    {transactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-rapunzel-lightlavender">
                        <td className="px-6 py-4">{transaction.userName}</td>
                        <td className="px-6 py-4">{transaction.bookTitle}</td>
                        <td className="px-6 py-4">
                          {(transaction.borrowDate && (transaction.borrowDate._seconds || transaction.borrowDate.seconds))
                            ? new Date(
                                1000 * (transaction.borrowDate._seconds || transaction.borrowDate.seconds)
                              ).toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td className="px-6 py-4">
                          {(transaction.dueDate && (transaction.dueDate._seconds || transaction.dueDate.seconds))
                            ? new Date(
                                1000 * (transaction.dueDate._seconds || transaction.dueDate.seconds)
                              ).toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-rapunzel ${
                              transaction.status === "borrowed"
                                ? "bg-rapunzel-yellow text-rapunzel-purple"
                                : "bg-rapunzel-green text-rapunzel-purple"
                            }`}
                          >
                            {transaction.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {transaction.status === "borrowed" && (
                            <button
                              onClick={() => handleReturn(transaction.id)}
                              className="flex items-center space-x-1 bg-rapunzel-purple text-rapunzel-yellow px-3 py-1 rounded hover:bg-rapunzel-yellow hover:text-rapunzel-purple font-semibold border-2 border-rapunzel-yellow transition text-sm"
                            >
                              <CheckCircle className="w-4 h-4" />
                              <span>Return</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        {/* MODAL */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 font-rapunzel">
            <div className="bg-rapunzel-lightlavender rounded-lg shadow-xl max-w-md w-full p-6 border-4 border-rapunzel-purple">
              <h3 className="text-2xl font-bold mb-4 text-rapunzel-purple">
                {modalType === "borrow"
                  ? "Borrow Book"
                  : formData.id
                  ? `Edit ${modalType.slice(0, -1)}`
                  : `Add ${modalType.slice(0, -1)}`}
              </h3>
              <form onSubmit={modalType === "borrow" ? handleBorrow : handleSubmit}>
                <div className="space-y-4">
                  {modalType === "books" && (
                    <>
                      <input
                        type="text"
                        placeholder="Title"
                        value={formData.title || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-rapunzel-yellow rounded-lg focus:outline-none focus:ring-2 focus:ring-rapunzel-yellow"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Author"
                        value={formData.author || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, author: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-rapunzel-yellow rounded-lg focus:outline-none focus:ring-2 focus:ring-rapunzel-yellow"
                        required
                      />
                      <input
                        type="text"
                        placeholder="ISBN"
                        value={formData.isbn || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, isbn: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-rapunzel-yellow rounded-lg focus:outline-none focus:ring-2 focus:ring-rapunzel-yellow"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Category"
                        value={formData.category || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-rapunzel-yellow rounded-lg focus:outline-none focus:ring-2 focus:ring-rapunzel-yellow"
                        required
                      />
                      <input
                        type="number"
                        placeholder="Total Copies"
                        value={formData.totalCopies || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, totalCopies: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-rapunzel-yellow rounded-lg focus:outline-none focus:ring-2 focus:ring-rapunzel-yellow"
                        required
                        min="1"
                      />
                    </>
                  )}
                  {modalType === "users" && (
                    <>
                      <input
                        type="text"
                        placeholder="Name"
                        value={formData.name || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-rapunzel-yellow rounded-lg focus:outline-none focus:ring-2 focus:ring-rapunzel-yellow"
                        required
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        value={formData.email || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-rapunzel-yellow rounded-lg focus:outline-none focus:ring-2 focus:ring-rapunzel-yellow"
                        required
                      />
                      <input
                        type="tel"
                        placeholder="Phone"
                        value={formData.phone || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-rapunzel-yellow rounded-lg focus:outline-none focus:ring-2 focus:ring-rapunzel-yellow"
                        required
                      />
                      {!formData.id && (
                        <input
                          type="text"
                          placeholder="Member ID"
                          value={formData.memberId || ""}
                          onChange={(e) =>
                            setFormData({ ...formData, memberId: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-rapunzel-yellow rounded-lg focus:outline-none focus:ring-2 focus:ring-rapunzel-yellow"
                          required
                        />
                      )}
                      {formData.id && (
                        <select
                          value={formData.status || "active"}
                          onChange={(e) =>
                            setFormData({ ...formData, status: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-rapunzel-yellow rounded-lg focus:outline-none focus:ring-2 focus:ring-rapunzel-yellow"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      )}
                    </>
                  )}
                  {modalType === "borrow" && (
                    <>
                      <select
                        value={formData.userId || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, userId: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-rapunzel-yellow rounded-lg focus:outline-none focus:ring-2 focus:ring-rapunzel-yellow"
                        required
                      >
                        <option value="">Select User</option>
                        {users
                          .filter((u) => u.status === "active")
                          .map((user) => (
                            <option key={user.id} value={user.id}>
                              {user.name} ({user.memberId})
                            </option>
                          ))}
                      </select>
                      <select
                        value={formData.bookId || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, bookId: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-rapunzel-yellow rounded-lg focus:outline-none focus:ring-2 focus:ring-rapunzel-yellow"
                        required
                      >
                        <option value="">Select Book</option>
                        {books
                          .filter((b) => b.availableCopies > 0)
                          .map((book) => (
                            <option key={book.id} value={book.id}>
                              {book.title} - {book.availableCopies} available
                            </option>
                          ))}
                      </select>
                    </>
                  )}
                  <div className="flex space-x-3 mt-6">
                    <button
                      type="submit"
                      className="flex-1 bg-rapunzel-purple text-rapunzel-yellow py-2 rounded-lg hover:bg-rapunzel-yellow hover:text-rapunzel-purple font-bold border-2 border-rapunzel-yellow transition"
                    >
                      {modalType === "borrow"
                        ? "Borrow"
                        : formData.id
                        ? "Update"
                        : "Create"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 bg-rapunzel-yellow text-rapunzel-purple py-2 rounded-lg hover:bg-rapunzel-accent font-bold border-2 border-rapunzel-purple transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}