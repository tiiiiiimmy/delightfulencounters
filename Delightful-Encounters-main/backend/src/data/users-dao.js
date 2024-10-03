
import { getDatabase } from "./database.js";
import bcrypt from 'bcrypt';
import * as yup from 'yup';



export async function getUserWithCredentials(username, password) {
  const db = await getDatabase();
  const user = await db.get(
    "SELECT * from User WHERE username = ?",
    username
  );
  if (!user) {
    return null; // User not found
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return null; // Password does not match
  }
  return user; // Return the user object if credentials are valid
}

export async function getUserId(username) {
  const db = await getDatabase();
  return await db.get("SELECT user_id  FROM User WHERE username = ?", username);
}


// get user with username
export async function getUserWithUsername(username) {
  const db = await getDatabase();
  return await db.get("SELECT * from User WHERE username = ?", username);
}


const userSchema = yup.object({
  username: yup.string()
    .min(5, 'Username must be at least 5 characters')
    .max(20, 'Username must be at most 20 characters')
    .matches(/^[a-zA-Z0-9]+$/, 'Username can only contain letters and numbers')
    .required('Username is required'),
  password: yup.string()
    .min(5, 'Password must be at least 5 characters')
    .required('Password is required'),
  fname: yup.string()
    .min(1, 'First name must be at least 1 characters')
    .max(20, 'First name must be at most 20 characters')
    .required('First name is required'),
  lname: yup.string()
    .min(1, 'Last name must be at least 1 characters')
    .max(20, 'Last name must be at most 20 characters')
    .required('Last name is required'),
  description: yup.string()
    .min(1, 'Description must be at least 1 character')
    .max(1000, 'Description must be at most 1000 characters')
    .optional(),
  date_of_birth: yup.date()
    .typeError('Birthdate must be a valid date')
    .required('Birthdate is required'),
  avatar: yup.string().optional(),
  admin: yup.boolean().default(false)
 
  
}).required();

async function validateUser(user) {
  return userSchema.validate(user, { abortEarly: false });
}


//singup
export async function createUser(userInfo) {
  const db = await getDatabase();
 
  const validation=await validateUser(userInfo);
 
  try {
    await validateUser(userInfo);
  } catch (validationError) {
    return { success: false, message: validationError.errors.join(', ') };
  }
  console.log(validation);
  // Check if the username already exists
  const sql1 = "SELECT 1 FROM User WHERE username = ?";
  const result1 = await db.get(sql1, [userInfo.username]);
  if (result1) {
    console.log("Username already exists");
    return { success: false, message: 'Username already exists' };
  }
  // Encrypt the password
  const hashedPassword = await bcrypt.hash(userInfo.password, 10);
  console.log(hashedPassword);
  // Insert the new user with the encrypted password
  const sql = "INSERT INTO User(username, password, fname, lname, date_of_birth, description, avatar,admin) VALUES (?, ?, ?, ?, ?, ?, ?,?)";
  const result = await db.run(sql, [
    userInfo.username,
    hashedPassword,
    userInfo.fname,
    userInfo.lname,
    userInfo.date_of_birth,
    userInfo.description,
    userInfo.avatar,
    userInfo.admin
  ]);

  if (result && result.changes > 0) {
    console.log("User created successfully");
    return { success: true, message: "User created successfully" };
  } else {
    console.log("Failed to create user");
    return { success: false, message: "Failed to create user" };
  }
}

const updateUserSchema = yup.object({
  username: yup.string()
    .min(5, 'Username must be at least 5 characters')
    .max(20, 'Username must be at most 20 characters')
    .matches(/^[a-zA-Z0-9]+$/, 'Username can only contain letters and numbers')
    .required('Username is required'),
  fname: yup.string()
    .min(3, 'First name must be at least 3 characters')
    .max(20, 'First name must be at most 20 characters')
    .required('First name is required'),
  lname: yup.string()
    .min(3, 'Last name must be at least 3 characters')
    .max(20, 'Last name must be at most 20 characters')
    .required('Last name is required'),
  description: yup.string()
    .min(1, 'Description must be at least 1 character')
    .max(1000, 'Description must be at most 1000 characters')
    .optional(),
  date_of_birth: yup.date()
    .typeError('Birthdate must be a valid date')
    .required('Birthdate is required'),
  avatar: yup.string().optional()
}).required();

async function validateUpdate(user) {
  try {
    await updateUserSchema.validate(user, { abortEarly: false });
    return { success: true };
  } catch (validationError) {
    return {
      success: false,
      message: validationError.errors.join(', ')
    };
  }
}

//update user information
export async function updateUser(userId, userInfo) {
  const db = await getDatabase();

  const validation = await validateUpdate(userInfo);

  if (!validation.success) {
    return { success: false, message: validation.message };
  }

  const sql = "UPDATE User SET username=?, fname=?, lname=?, date_of_birth=?, description=?, avatar=? WHERE user_id = ?";
  const result = await db.run(sql, [
    userInfo.username,
    userInfo.fname,
    userInfo.lname,
    userInfo.date_of_birth,
    userInfo.description,
    userInfo.avatar,
    userId
  ]);

  if (result && result.changes > 0) {
    return { success: true, message: "User updated successfully" };
  } else {
    return { success: false, message: "Failed to update user" };
  }
}




export async function getUesrInfo (userId) {
  const db = await getDatabase();
  const query = `SELECT * FROM User WHERE user_id = ?`;
  return await db.get(query, [userId]);
}


//Check if the username can be used
export async function checkUsername(username) {
 
    const db = await getDatabase();
    const sql = "SELECT 1 FROM User WHERE username = ?";
    const result = await db.get(sql, [username]);
    // If the result is undefined or null, it means the username does not exist, which can be used
    return result !== undefined && result !== null;

}

//delete user
export async function deleteUser(userId) {
  const db = await getDatabase();
  const result = await db.run('DELETE FROM User WHERE user_id = ?', [userId]);
  if (result && result.changes > 0) {
    return true;
  } else {
    return false;
  }
}

//get all users
export async function getAllUsers() {
  const db = await getDatabase();
  const query = `
        SELECT *
        FROM User
    `;
  return await db.all(query);
}