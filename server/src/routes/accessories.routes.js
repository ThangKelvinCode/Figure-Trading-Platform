import { Router } from 'express'
import { accessoriesController } from '../controllers/accessories.controller.js'
import { wrapAsync } from '../utils/handler.js'
import { productValidator } from '../middlewares/product.middlewares.js'
//tạo Router
const accessoriesRouter = Router()

accessoriesRouter.post(
  '/postAccessories' /*  #swagger.tags = ['Accessories']
    #swagger.summary = 'Post a new accessory'
    #swagger.description = 'Creates a new accessory listing'
    #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    required: ["name", "description", "type", "price", "photo", "owner"],
                    properties: {
                        name: { type: "string", example: "1000% bag" },
                        description: { type: "string", example: "Big bag for 1000%" },
                        type: { type: "string", example: "67c91d9583ff104caa240546" },
                        price: { type: "number", example: 59.99 },
                        photo: { type: "array", format: "url", example: "https://example3.com" },
                        status: { type: "string", example: "" },
                        date_added: { type: "string", format: "date-time", example: "" },
                        owner: { type: "string", example: "67bca3f6207e4b98d3665a9f" }
                    }
                }
            }
        }
    }
    #swagger.responses[201] = {
        description: "Accessory posted successfully"
    }
    #swagger.responses[400] = {
        description: "Invalid request"
    }
*/,
  productValidator.AccessoriesValidator,
  wrapAsync(accessoriesController.postAccessories)
)

// accessoriesRouter.put('/:id/edit', wrapAsync(accessoriesController.editAccessories))

accessoriesRouter.put(
  '/:id/edit',
  /*  #swagger.tags = ['Accessories']
      #swagger.summary = 'Edit an existing accessory'
      #swagger.description = 'Updates the details of an existing accessory by its ID'
      #swagger.parameters['id'] = { 
          description: "Accessory ID", 
          type: "string", 
          required: true, 
          example: "67dfcb5138afc23bf8cff336" 
      }
      #swagger.requestBody = {
          required: true,
          content: {
              "application/json": {
                  schema: {
                      type: "object",
                      required: ["name", "description", "type", "price", "photo", "owner"],
                      properties: {
                          name: { type: "string", example: "1000% bag" },
                          description: { type: "string", example: "Big bag for 1000%" },
                          type: { type: "string", example: "67c91d9583ff104caa240546" },
                          price: { type: "number", example: 59.99 },
                          photo: { type: "array", format: "url", example: "https://example3.com" },
                          status: { type: "string", example: "" },
                          date_added: { type: "string", format: "date-time", example: "" },
                          owner: { type: "string", example: "67bca3f6207e4b98d3665a9f" }
                      }
                  }
              }
          }
      }
      #swagger.responses[200] = {
          description: "Accessory updated successfully"
      }
      #swagger.responses[400] = {
          description: "Invalid request"
      }
      #swagger.responses[404] = {
          description: "Accessory not found"
      }
  */
  wrapAsync(accessoriesController.editAccessories)
)


// Create a new accessory category
accessoriesRouter.post(
  '/newCategory',
  /*  #swagger.tags = ['Accessories']
        #swagger.summary = 'Create a new category'
        #swagger.description = 'Creates a new accessory category'
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        required: ["type", "description"],
                        properties: {
                            type: { type: "string", example: "handbag" },
                            description: { type: "string", example: "Bag to hang the dolls with various sizes" }
                        }
                    }
                }
            }
        }
        #swagger.responses[201] = { description: "Category created successfully" }
        #swagger.responses[400] = { description: "Invalid request" }
    */
  productValidator.CategoriesValidator,
  wrapAsync(accessoriesController.newCategory)
)

// Get all accessories
accessoriesRouter.get(
  '/allAccessories',
  /*  #swagger.tags = ['Accessories']
        #swagger.summary = 'Get all accessories'
        #swagger.description = 'Retrieves a list of all available accessories'
        #swagger.responses[200] = { description: "List of accessories retrieved successfully" }
    */
  wrapAsync(accessoriesController.getAllAccessories)
)

// Get all categories
accessoriesRouter.get(
  '/allCategories',
  /*  #swagger.tags = ['Accessories']
        #swagger.summary = 'Get all categories'
        #swagger.description = 'Retrieves a list of all accessory categories'
        #swagger.responses[200] = { description: "List of categories retrieved successfully" }
    */
  wrapAsync(accessoriesController.getAllCategories)
)

// Get a specific accessory by ID
accessoriesRouter.get(
  '/:id',
  /*  #swagger.tags = ['Accessories']
        #swagger.summary = 'Get an accessory by ID'
        #swagger.description = 'Retrieves details of a specific accessory'
        #swagger.parameters['id'] = { description: "Accessory ID", type: "string", required: true, example: "67c91dad83ff104caa240547" }
        #swagger.responses[200] = { description: "Accessory details retrieved successfully" }
        #swagger.responses[404] = { description: "Accessory not found" }
    */
  wrapAsync(accessoriesController.getAccessory)
)

// Get a category by ID
accessoriesRouter.get(
  '/categories/:id',
  /*  #swagger.tags = ['Accessories']
        #swagger.summary = 'Get a category by ID'
        #swagger.description = 'Retrieves details of a specific accessory category'
        #swagger.parameters['id'] = { description: "Category ID", type: "string", required: true, example: "67c91d9583ff104caa240546" }
        #swagger.responses[200] = { description: "Category details retrieved successfully" }
        #swagger.responses[404] = { description: "Category not found" }
    */
  wrapAsync(accessoriesController.getCategory)
)

// Delete an accessory by ID
accessoriesRouter.delete(
  '/:id',
  /*  #swagger.tags = ['Accessories']
        #swagger.summary = 'Delete an accessory'
        #swagger.description = 'Deletes a specific accessory by its ID'
        #swagger.parameters['id'] = { description: "Accessory ID", type: "string", required: true, example: "67bca3f6207e4b98d3665a9f" }
        #swagger.responses[200] = { description: "Accessory deleted successfully" }
        #swagger.responses[404] = { description: "Accessory not found" }
    */
  wrapAsync(accessoriesController.deleteAccessory)
)

// Get all reviews for an accessory
accessoriesRouter.get(
  '/:id/reviews',
  /*  #swagger.tags = ['Accessories']
        #swagger.summary = 'Get all reviews for an accessory'
        #swagger.description = 'Retrieves all reviews for a specific accessory'
        #swagger.parameters['id'] = { description: "Accessory ID", type: "string", required: true, example: "67bca3f6207e4b98d3665a9f" }
        #swagger.responses[200] = { description: "Reviews retrieved successfully" }
    */
  wrapAsync(accessoriesController.getAllReview)
)

accessoriesRouter.post(
  '/:id/purchase',
  /*  #swagger.tags = ['Accessories']
        #swagger.summary = 'Purchase an accessory'
        #swagger.description = 'Handles the purchase of an accessory'
        #swagger.parameters['id'] = { description: "Accessory ID", type: "string", required: true, example: "67bca3f6207e4b98d3665a9f" }
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        required: ["quantity", "userID"],
                        properties: {
                            quantity: { type: "number", example: 1 },
                            userID: { type: "string", example: "67af6d45efd963779dfa5f84" }
                        }
                    }
                }
            }
        }
        #swagger.responses[200] = { description: "Accessory purchased successfully" }
        #swagger.responses[400] = { description: "Invalid purchase request" }
    */
  wrapAsync(accessoriesController.buyAccessory)
)

// Write a new review for an accessory
accessoriesRouter.post(
  '/:id/newReview',
  /*  #swagger.tags = ['Accessories']
        #swagger.summary = 'Write a review for an accessory'
        #swagger.description = 'Allows a user to submit a review for an accessory'
        #swagger.parameters['id'] = { description: "Accessory ID", type: "string", required: true, example: "67bca3f6207e4b98d3665a9f" }
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        required: ["rating", "comment"],
                        properties: {
                            rating: { type: "number", example: 5 },
                            comment: { type: "string", example: "Great accessory! Highly recommended." }
                        }
                    }
                }
            }
        }
        #swagger.responses[201] = { description: "Review submitted successfully" }
        #swagger.responses[400] = { description: "Invalid review submission" }
    */
  wrapAsync(accessoriesController.writeReview)
)

export default accessoriesRouter
