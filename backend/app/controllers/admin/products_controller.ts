import type { HttpContext } from '@adonisjs/core/http'
import Product from '#models/product'
import logger from '@adonisjs/core/services/logger'
import { attachmentManager } from '@jrmc/adonis-attachment'

export default class ProductsController {
  /**
   * Get all products (including inactive)
   */
  async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page', 1)
      const limit = request.input('limit', 20)
      const search = request.input('search', '')

      const productsQuery = Product.query()

      if (search) {
        productsQuery.where((query) => {
          query
            .where('name', 'ILIKE', `%${search}%`)
            .orWhere('description', 'ILIKE', `%${search}%`)
        })
      }

      const products = await productsQuery
        .orderBy('createdAt', 'desc')
        .paginate(page, limit)

      const serialized = products.serialize()
      logger.info(`[Admin Products] Products récupérés: ${serialized.data.length}`)
      if (serialized.data.length > 0) {
        logger.info(`[Admin Products] Premier produit image: ${JSON.stringify(serialized.data[0].image)}`)
      }

      return response.ok({
        data: serialized,
        message: 'Products retrieved successfully'
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Failed to retrieve products',
        error: error.message
      })
    }
  }

  /**
   * Get a single product
   */
  async show({ params, response }: HttpContext) {
    try {
      const product = await Product.findOrFail(params.id)

      return response.ok({
        data: product,
        message: 'Product retrieved successfully'
      })
    } catch (error) {
      return response.notFound({
        message: 'Product not found'
      })
    }
  }

  /**
   * Create a new product
   */
  async store({ request, response }: HttpContext) {
    try {
      const data = request.only(['name', 'description', 'price', 'stock', 'isActive'])
      const image = request.file('image', {
        size: '5mb',
        extnames: ['jpg', 'jpeg', 'png', 'gif', 'webp']
      })

      logger.info(`[Admin Products] Création produit: ${data.name}`)
      logger.info(`[Admin Products] Image présente: ${!!image}`)

      if (image) {
        logger.info(`[Admin Products] Validation image: ${image.isValid}`)
        if (!image.isValid) {
          logger.error(`[Admin Products] Erreurs validation image: ${JSON.stringify(image.errors)}`)
        }
      }

      // Convert price and stock to numbers
      const productData = {
        ...data,
        price: Number(data.price),
        stock: Number(data.stock),
        isActive: data.isActive === 'true' || data.isActive === true
      }

      // Create product with image in one go
      const product = new Product()
      product.merge(productData)

      if (image && image.isValid) {
        product.image = await attachmentManager.createFromFile(image)
        logger.info(`[Admin Products] Image assignée au produit`)
      }

      await product.save()
      logger.info(`[Admin Products] Produit créé avec succès (ID: ${product.id})`)

      return response.created({
        data: product,
        message: 'Product created successfully'
      })
    } catch (error) {
      logger.error(`[Admin Products] Erreur création produit: ${error.message}`)
      logger.error(`[Admin Products] Stack: ${error.stack}`)
      return response.badRequest({
        message: 'Failed to create product',
        error: error.message
      })
    }
  }

  /**
   * Update a product
   */
  async update({ params, request, response }: HttpContext) {
    try {
      const product = await Product.findOrFail(params.id)
      const data = request.only(['name', 'description', 'price', 'stock', 'isActive'])
      const image = request.file('image', {
        size: '5mb',
        extnames: ['jpg', 'jpeg', 'png', 'gif', 'webp']
      })

      logger.info(`[Admin Products] Mise à jour produit ID ${params.id}: ${product.name}`)

      // Convert price and stock to numbers
      const productData = {
        ...data,
        price: Number(data.price),
        stock: Number(data.stock),
        isActive: data.isActive === 'true' || data.isActive === true
      }

      product.merge(productData)

      if (image && image.isValid) {
        product.image = await attachmentManager.createFromFile(image)
        logger.info(`[Admin Products] Nouvelle image uploadée`)
      }

      await product.save()
      logger.info(`[Admin Products] Produit mis à jour avec succès`)

      return response.ok({
        data: product,
        message: 'Product updated successfully'
      })
    } catch (error) {
      logger.error(`[Admin Products] Erreur mise à jour produit: ${error.message}`)
      return response.badRequest({
        message: 'Failed to update product',
        error: error.message
      })
    }
  }

  /**
   * Delete a product
   */
  async destroy({ params, response }: HttpContext) {
    try {
      const product = await Product.findOrFail(params.id)
      logger.info(`[Admin Products] Suppression produit ID ${params.id}: ${product.name}`)
      await product.delete()
      logger.info(`[Admin Products] Produit supprimé avec succès`)

      return response.ok({
        message: 'Product deleted successfully'
      })
    } catch (error) {
      logger.error(`[Admin Products] Erreur suppression produit: ${error.message}`)
      return response.badRequest({
        message: 'Failed to delete product',
        error: error.message
      })
    }
  }

  /**
   * Toggle product active status
   */
  async toggleActive({ params, response }: HttpContext) {
    try {
      const product = await Product.findOrFail(params.id)
      product.isActive = !product.isActive
      await product.save()

      return response.ok({
        data: product,
        message: `Product ${product.isActive ? 'activated' : 'deactivated'} successfully`
      })
    } catch (error) {
      return response.badRequest({
        message: 'Failed to toggle product status',
        error: error.message
      })
    }
  }
}
