import {User} from "../models/uerModel.js";
import bcrypt from "bcryptjs"
import {generateToken} from "../utils/generateToken.js";
import asyncHandler from "express-async-handler";

export const authUser = async (req, res) => {
	const {email, password} = req.body

	const user = await User.findOne({email})

	if (!user) {
		res.status(200).json({message: "Пользователь не найден"})
	}

	const passwordEqual = await bcrypt.compare(password, user.password);
	if (user && passwordEqual) {
		generateToken(res, user._id)
		res.status(201).json({
			_id: user._id,
			name: user.name,
			email: user.email
		})
	} else {
		res.status(200).json({message: "Пароль или email не совпадает"})
	}

}


export const registerUser = async (req, res) => {
	const {name, password, email} = req.body

	const userExist = await User.findOne({email})

	if (userExist) {
		res.status(400)
		throw new Error("User already exist")
	}

	const salt = await bcrypt.genSalt(10)
	const hashPassword = await bcrypt.hash(password, salt)

	const user = await User.create({
		name,
		email,
		password: hashPassword
	})

	if (user) {
		generateToken(res, user._id)
		res.status(201).json({
			_id: user._id,
			name: user.name,
			email: user.email
		})
	} else {
		res.stats(400)
		throw new Error("invalid user data")
	}
}

export const logoutUser = async (req, res) => {
	res.cookie('jwt', '', {
		httpOnly: true,
		expiresIn: new Date(0)
	})
	res.status(200).json({message: "User logout"})
}

export const getUserProfile = async (req, res) => {
	const user = {
		_id: req.user._id,
		name: req.user.name,
		email: req.user.email
	}
	res.status(200).json(user)
}

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user._id);

	if (user) {
		user.name = req.body.name || user.name;
		user.email = req.body.email || user.email;

		if (req.body.password) {
			user.password = req.body.password;
		}

		const updatedUser = await user.save();

		res.json({
			_id: updatedUser._id,
			name: updatedUser.name,
			email: updatedUser.email,
		});
	} else {
		res.status(404);
		throw new Error('User not found');
	}
});