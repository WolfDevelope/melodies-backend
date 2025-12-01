import User from '../models/User.js';

/**
 * Get all users with filtering, search, and pagination
 */
export const getAllUsers = async (filters = {}) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      role = '',
      isActive = '',
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = filters;

    // Build query
    const query = {};

    // Search by name or email
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by role
    if (role) {
      query.role = role;
    }

    // Filter by active status
    if (isActive !== '') {
      query.isActive = isActive === 'true';
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Sort options
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query
    const users = await User.find(query)
      .select('-password -emailVerificationOTP -otpExpires') // Exclude sensitive fields
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
    const total = await User.countDocuments(query);

    return {
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    throw new Error(`Error fetching users: ${error.message}`);
  }
};

/**
 * Get user by ID
 */
export const getUserById = async (userId) => {
  try {
    const user = await User.findById(userId).select('-password -emailVerificationOTP -otpExpires');
    
    if (!user) {
      throw new Error('User not found');
    }

    return user;
  } catch (error) {
    throw new Error(`Error fetching user: ${error.message}`);
  }
};

/**
 * Update user role (Admin only)
 */
export const updateUserRole = async (userId, role) => {
  try {
    if (!['user', 'admin'].includes(role)) {
      throw new Error('Invalid role. Must be "user" or "admin"');
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true, runValidators: true }
    ).select('-password -emailVerificationOTP -otpExpires');

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  } catch (error) {
    throw new Error(`Error updating user role: ${error.message}`);
  }
};

/**
 * Update user active status (Admin only)
 */
export const updateUserStatus = async (userId, isActive) => {
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { isActive },
      { new: true, runValidators: true }
    ).select('-password -emailVerificationOTP -otpExpires');

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  } catch (error) {
    throw new Error(`Error updating user status: ${error.message}`);
  }
};

/**
 * Delete user (Admin only)
 */
export const deleteUser = async (userId) => {
  try {
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      throw new Error('User not found');
    }

    return { message: 'User deleted successfully' };
  } catch (error) {
    throw new Error(`Error deleting user: ${error.message}`);
  }
};

/**
 * Get user statistics
 */
export const getUserStatistics = async () => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const inactiveUsers = await User.countDocuments({ isActive: false });
    const adminUsers = await User.countDocuments({ role: 'admin' });
    const regularUsers = await User.countDocuments({ role: 'user' });
    const verifiedUsers = await User.countDocuments({ isEmailVerified: true });

    // Get recent users (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentUsers = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    });

    return {
      total: totalUsers,
      active: activeUsers,
      inactive: inactiveUsers,
      admins: adminUsers,
      regular: regularUsers,
      verified: verifiedUsers,
      recentSignups: recentUsers,
    };
  } catch (error) {
    throw new Error(`Error fetching user statistics: ${error.message}`);
  }
};
