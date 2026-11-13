import { validateRequest } from './validation';
import { buildResponse } from '../utils/helpers';
import { ENTITIES, ACTIONS, RESPONSE_CODES } from '../config/config';

import {
  createClothingItem,
  getClothingItem,
  getAllClothingItems,
  updateClothingItem,
  deleteClothingItem,
} from './clothing_actions';

import {
  createWishlistItem,
  getWishlistItem,
  getAllWishlistItems,
  updateWishlistItem,
  deleteWishlistItem,
  markWishlistItemAsBought,
} from './wishlist_actions';

import {
  createOutfit,
  getOutfit,
  getAllOutfits,
  updateOutfit,
  deleteOutfit,
} from './outfit_actions';

import {
  createProfile,
  getProfile,
  updateProfile,
  deleteProfile,
} from './profile_actions';

export async function router(request){
    const validate = validateRequest(request);
    if (validate) {
        return validate;
    }

    try {
        if (request.entity === ENTITIES.clothing) {
            switch (request.action) {
                case ACTIONS.create:
                    return await createClothingItem(request);
                case ACTIONS.get_one:
                    return await getClothingItem(request);
                case ACTIONS.get_all:
                    return await getAllClothingItems(request);
                case ACTIONS.update:
                    return await updateClothingItem(request);
                case ACTIONS.delete:
                    return await deleteClothingItem(request);
                default:
                    return buildResponse(RESPONSE_CODES.bad_request, `Invalid action for clothing: ${request.action}`);
            }
        } else if (request.entity === ENTITIES.wishlist) {
            switch (request.action) {
                case ACTIONS.create:
                    return await createWishlistItem(request);
                case ACTIONS.get_one:
                    return await getWishlistItem(request);
                case ACTIONS.get_all:
                    return await getAllWishlistItems(request);
                case ACTIONS.update:
                    return await updateWishlistItem(request);
                case ACTIONS.delete:
                    return await deleteWishlistItem(request);
                case ACTIONS.mark_as_bought:
                    return await markWishlistItemAsBought(request);
                default:
                    return buildResponse(RESPONSE_CODES.bad_request, `Invalid action for wishlist: ${request.action}`);
            }
        } else if (request.entity === ENTITIES.outfit) {
            switch (request.action) {
                case ACTIONS.create:
                    return await createOutfit(request);
                case ACTIONS.get_one:
                    return await getOutfit(request);
                case ACTIONS.get_all:
                    return await getAllOutfits(request);
                case ACTIONS.update:
                    return await updateOutfit(request);
                case ACTIONS.delete:
                    return await deleteOutfit(request);
                default:
                    return buildResponse(RESPONSE_CODES.bad_request, `Invalid action for outfit: ${request.action}`);
            }
        } else if (request.entity === ENTITIES.profile) {
            switch (request.action) {
                case ACTIONS.create:
                    return await createProfile(request);
                case ACTIONS.get_one:
                    return await getProfile(request);
                case ACTIONS.update:
                    return await updateProfile(request);
                case ACTIONS.delete:
                    return await deleteProfile(request);
                default:
                    return buildResponse(RESPONSE_CODES.bad_request, `Invalid action for profile: ${request.action}`);
            }
        }
        else {
            return buildResponse(RESPONSE_CODES.bad_request, `Invalid entity: ${request.entity}`);
        }
    }
    catch (error) {
        console.error('Error in router:', error);
        return buildResponse(RESPONSE_CODES.server_error, 'An unexpected error occurred');
    }
}