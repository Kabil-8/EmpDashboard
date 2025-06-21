const express = require('express');
const router = express.Router();
const User = require('../models/User');

// 📊 Admin-only stats
// 📊 Admin stats (non-admin only)
router.get('/admin/stats', async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } });

    const total = users.length;
    const male = users.filter(u => u.gender === 'male').length;
    const female = users.filter(u => u.gender === 'female').length;
    const remote = users.filter(u => u.mode === 'remote').length;
    const onsite = users.filter(u => u.mode === 'onsite').length;

    const departments = {};
    users.forEach(u => {
      departments[u.department] = (departments[u.department] || 0) + 1;
    });

    const topEmployees = users
      .filter(u => typeof u.score === 'number')
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map(u => ({ name: u.name, score: u.score }));

    const salaryTrend = users.map(u => ({
      name: u.name,
      salary: u.salary || 0
    }));

    res.json({
      total, male, female, remote, onsite,
      departments, topEmployees, salaryTrend
    });
  } catch (err) {
    console.error('❌ Failed to fetch stats:', err);
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
});


// ✅ CREATE employee
router.post('/employees', async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    console.error('Create failed:', err);
    res.status(500).json({ message: 'Failed to create employee' });
  }
});

// ✅ READ all employees (admin only)
// READ all employees (non-admins only)
router.get('/employees', async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch employees' });
  }
});


// ✅ Get logged-in employee’s own profile
router.get('/employees/:id/profile', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch employee profile' });
  }
});

// ✅ UPDATE employee
router.put('/employees/:id', async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'User not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Update failed' });
  }
});

// ✅ DELETE employee
router.delete('/employees/:id', async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed' });
  }
});

module.exports = router;
