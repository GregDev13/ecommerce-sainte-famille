import type { HttpContext } from '@adonisjs/core/http'
import Product from '#models/product'
import ProductView from '#models/product_view'

export default class ProductsController {
  /**
   * Display a list of all products
   */
  async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page', 1)
      const limit = request.input('limit', 12)
      const search = request.input('search', '')

      const productsQuery = Product.query()
        .where('isActive', true)

      if (search) {
        productsQuery.where((query) => {
          query.where('name', 'ILIKE', `%${search}%`).orWhere('description', 'ILIKE', `%${search}%`)
        })
      }

      const products = await productsQuery
        .orderBy('createdAt', 'desc')
        .paginate(page, limit)

      return response.ok({
        data: products.serialize(),
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
   * Show a specific product
   */
  async show({ params, response }: HttpContext) {
    try {
      const product = await Product.query()
        .where('id', params.id)
        .where('isActive', true)
        .firstOrFail()

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
   * Get related products for a specific product
   */
  async related({ params, response }: HttpContext) {
    try {
      const product = await Product.findOrFail(params.id)

      const relatedProducts = await Product.query()
        .where('isActive', true)
        .where('id', '!=', product.id)
        .orderBy('createdAt', 'desc')
        .limit(4)

      return response.ok({
        data: relatedProducts,
        message: 'Related products retrieved successfully'
      })
    } catch (error) {
      return response.notFound({
        message: 'Product not found'
      })
    }
  }

  /**
   * Track a product view
   */
  async trackView(ctx: HttpContext) {
    const { params, response } = ctx

    try {
      // Verify product exists and is active
      const product = await Product.query()
        .where('id', params.id)
        .where('isActive', true)
        .firstOrFail()

      // Track the view
      await ProductView.trackView(product.id, ctx)

      return response.noContent()
    } catch (error) {
      // Fail silently to not disrupt user experience
      return response.noContent()
    }
  }
}
