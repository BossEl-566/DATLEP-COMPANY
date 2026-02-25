import express from "express";
import { createUserAddress, deleteUserAddress, getSingleUserAddress, getUserAddresses, updateUserAddress } from "../controllers/user.controller";
import isUserAuthenticated from '../../../../packages/middleware/isUserAuthenticated';


const router = express.Router();

router.post('/:userId/addresses/create-address', isUserAuthenticated, createUserAddress);
router.get('/:userId/addresses/get-addresses', isUserAuthenticated, getUserAddresses);
router.get('/:userId/addresses/:addressId', isUserAuthenticated, getSingleUserAddress);
router.delete('/:userId/addresses/:addressId', isUserAuthenticated, deleteUserAddress);
router.patch('/:userId/addresses/:addressId', isUserAuthenticated, updateUserAddress);

export default router;