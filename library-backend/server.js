const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const { addDays } = require('date-fns');


const app = express();

// ✅ Middleware
app.use(cors()); // Allow all origins for local testing
app.use(express.json());

// ✅ Firebase Admin SDK initialization from JSON file
let db;
try {
  const serviceAccount = require('./serviceAccountKey.json');
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log('✅ Firebase initialized!');
  }
  db = admin.firestore(); // Only after successful Firebase init
} catch (err) {
  console.error('🔥 Firebase initialization error:', err);
  process.exit(1); // Stop server if Firebase can't initialize!
}

// ✅ Default route
app.get('/', (req, res) => {
  res.send('📚 Library Backend is running successfully!');
});

// ===================== BOOKS CRUD =====================

// Get all books
app.get('/api/books', async (req, res) => {
  try {
    const { search, available } = req.query;
    const snapshot = await db.collection('books').get();
    let books = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    if (search) {
      const searchLower = search.toLowerCase();
      books = books.filter(
        (b) =>
          b.title.toLowerCase().includes(searchLower) ||
          b.author.toLowerCase().includes(searchLower) ||
          b.isbn.includes(search)
      );
    }

    if (available === 'true') {
      books = books.filter((b) => b.availableCopies > 0);
    }

    res.json(books);
  } catch (err) {
    res.json([]); // Always return an array on error to prevent frontend crash
  }
});

// Get single book
app.get('/api/books/:id', async (req, res) => {
  try {
    const doc = await db.collection('books').doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ error: 'Book not found' });
    res.json({ id: doc.id, ...doc.data() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create book
app.post('/api/books', async (req, res) => {
  try {
    const { title, author, isbn, category, totalCopies } = req.body;
    const bookData = {
      title,
      author,
      isbn,
      category,
      totalCopies: parseInt(totalCopies),
      availableCopies: parseInt(totalCopies),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    const docRef = await db.collection('books').add(bookData);
    res.status(201).json({ id: docRef.id, ...bookData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update book
app.put('/api/books/:id', async (req, res) => {
  try {
    const { title, author, isbn, category, totalCopies } = req.body;
    const bookRef = db.collection('books').doc(req.params.id);
    const doc = await bookRef.get();

    if (!doc.exists) return res.status(404).json({ error: 'Book not found' });

    const currentData = doc.data();
    const borrowed = currentData.totalCopies - currentData.availableCopies;

    const updateData = {
      title,
      author,
      isbn,
      category,
      totalCopies: parseInt(totalCopies),
      availableCopies: parseInt(totalCopies) - borrowed,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await bookRef.update(updateData);
    res.json({ id: req.params.id, ...updateData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete book
app.delete('/api/books/:id', async (req, res) => {
  try {
    const bookRef = db.collection('books').doc(req.params.id);
    const doc = await bookRef.get();

    if (!doc.exists) return res.status(404).json({ error: 'Book not found' });

    const bookData = doc.data();
    if (bookData.availableCopies < bookData.totalCopies)
      return res.status(400).json({ error: 'Cannot delete book with active borrows' });

    await bookRef.delete();
    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===================== USERS CRUD =====================

// Get all users
app.get('/api/users', async (req, res) => {
  try {
    const { search } = req.query;
    const snapshot = await db.collection('users').get();
    let users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    if (search) {
      const searchLower = search.toLowerCase();
      users = users.filter(
        (u) =>
          u.name.toLowerCase().includes(searchLower) ||
          u.email.toLowerCase().includes(searchLower) ||
          u.memberId.includes(search)
      );
    }

    res.json(users);
  } catch (err) {
    res.json([]); // Always return an array on error
  }
});

// Get single user
app.get('/api/users/:id', async (req, res) => {
  try {
    const doc = await db.collection('users').doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ error: 'User not found' });
    res.json({ id: doc.id, ...doc.data() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create user
app.post('/api/users', async (req, res) => {
  try {
    const { name, email, phone, memberId } = req.body;
    const userData = {
      name,
      email,
      phone,
      memberId,
      status: 'active',
      borrowedBooks: 0,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    const docRef = await db.collection('users').add(userData);
    res.status(201).json({ id: docRef.id, ...userData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update user
app.put('/api/users/:id', async (req, res) => {
  try {
    const { name, email, phone, status } = req.body;
    const userRef = db.collection('users').doc(req.params.id);
    const doc = await userRef.get();

    if (!doc.exists) return res.status(404).json({ error: 'User not found' });

    const updateData = {
      name,
      email,
      phone,
      status,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await userRef.update(updateData);
    res.json({ id: req.params.id, ...updateData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete user
app.delete('/api/users/:id', async (req, res) => {
  try {
    const userRef = db.collection('users').doc(req.params.id);
    const doc = await userRef.get();

    if (!doc.exists) return res.status(404).json({ error: 'User not found' });

    const userData = doc.data();
    if (userData.borrowedBooks > 0)
      return res.status(400).json({ error: 'Cannot delete user with borrowed books' });

    await userRef.delete();
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===================== TRANSACTIONS =====================

// Get all transactions
app.get('/api/transactions', async (req, res) => {
  try {
    const { userId, bookId, status } = req.query;
    let query = db.collection('transactions');

    if (userId) query = query.where('userId', '==', userId);
    if (bookId) query = query.where('bookId', '==', bookId);
    if (status) query = query.where('status', '==', status);

    const snapshot = await query.orderBy('borrowDate', 'desc').get();
    const transactions = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    res.json(transactions);
  } catch (err) {
    res.json([]); // Always return an array on error
  }
});

// Borrow book
app.post('/api/transactions/borrow', async (req, res) => {
  try {
    const { userId, bookId } = req.body;
    const bookRef = db.collection('books').doc(bookId);
    const userRef = db.collection('users').doc(userId);
    const [bookDoc, userDoc] = await Promise.all([bookRef.get(), userRef.get()]);

    if (!bookDoc.exists) return res.status(404).json({ error: 'Book not found' });
    if (!userDoc.exists) return res.status(404).json({ error: 'User not found' });

    const bookData = bookDoc.data();
    const userData = userDoc.data();

    if (bookData.availableCopies <= 0) return res.status(400).json({ error: 'No copies available' });
    if (userData.status !== 'active') return res.status(400).json({ error: 'User account is not active' });

    // USE FIRESTORE TIMESTAMP FOR BOTH DATES!
    const NOW = admin.firestore.Timestamp.now();
    const FIFTEEN_DAYS = 15 * 24 * 60 * 60; // 15 days in seconds

    const transactionData = {
      userId,
      bookId,
      userName: userData.name,
      bookTitle: bookData.title,
      borrowDate: NOW,
      dueDate: new admin.firestore.Timestamp(NOW.seconds + FIFTEEN_DAYS, NOW.nanoseconds),
      status: 'borrowed',
    };

    const transactionRef = await db.collection('transactions').add(transactionData);

    await Promise.all([
      bookRef.update({ availableCopies: admin.firestore.FieldValue.increment(-1) }),
      userRef.update({ borrowedBooks: admin.firestore.FieldValue.increment(1) }),
    ]);

    res.status(201).json({ id: transactionRef.id, ...transactionData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Return book
app.post('/api/transactions/return/:transactionId', async (req, res) => {
  try {
    const transactionRef = db.collection('transactions').doc(req.params.transactionId);
    const transactionDoc = await transactionRef.get();

    if (!transactionDoc.exists) return res.status(404).json({ error: 'Transaction not found' });

    const transactionData = transactionDoc.data();
    if (transactionData.status === 'returned') return res.status(400).json({ error: 'Book already returned' });

    const bookRef = db.collection('books').doc(transactionData.bookId);
    const userRef = db.collection('users').doc(transactionData.userId);

    await transactionRef.update({
      status: 'returned',
      returnDate: admin.firestore.FieldValue.serverTimestamp(),
    });

    await Promise.all([
      bookRef.update({ availableCopies: admin.firestore.FieldValue.increment(1) }),
      userRef.update({ borrowedBooks: admin.firestore.FieldValue.increment(-1) }),
    ]);

    res.json({ message: 'Book returned successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===================== ANALYTICS =====================
app.get('/api/analytics', async (req, res) => {
  try {
    const [booksSnapshot, usersSnapshot, transactionsSnapshot] = await Promise.all([
      db.collection('books').get(),
      db.collection('users').get(),
      db.collection('transactions').where('status', '==', 'borrowed').get(),
    ]);

    const books = booksSnapshot.docs.map((doc) => doc.data());
    const totalBooks = books.reduce((sum, b) => sum + b.totalCopies, 0);
    const availableBooks = books.reduce((sum, b) => sum + b.availableCopies, 0);

    res.json({
      totalBooks,
      availableBooks,
      borrowedBooks: totalBooks - availableBooks,
      totalUsers: usersSnapshot.size,
      activeTransactions: transactionsSnapshot.size,
      categories: [...new Set(books.map((b) => b.category))],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ 404 handler
app.use((req, res) => {
  res.status(404).send('❌ Route not found');
});

// ✅ Start server on safe port 8080
const PORT = 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
