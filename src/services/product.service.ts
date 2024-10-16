import { Prisma, PrismaClient, product as Product, film as Film, book as Book, music as Music, ProductType } from '../../prisma/generated';
import { getPrismaError } from '../utils/helpers';
import {
  BookCreationInput,
  createBook,
  createFilm,
  createMusic,
  FilmCreationInput,
  fromStringToProductType,
  mapFinalProduct,
  MusicCreationInput,
} from '../utils/product.utils';

const prisma = new PrismaClient(); // Initialize Prisma Client

/**
 * Creates a new product in the database.
 *
 * @param {FilmCreationInput | BookCreationInput | MusicCreationInput} data - An object containing product data.
 * @returns {Promise<Prisma.product>} - A promise that resolves to the created product.
 * @throws {Error} - Throws an error if the creation operation fails.
 */
export const createProduct = async (data: FilmCreationInput | BookCreationInput | MusicCreationInput): Promise<Product> => {
  const { type } = data; // Extract the type from the input data

  // Define the product data
  const productData: Prisma.productCreateInput = {
    title: data.title,
    type: data.type,
    genre_category: data.genre_category,
    image: data.image,
  };

  try {
    // Step 1: Create the product and add to transaction
    const product = await prisma.$transaction(async (tx) => {
      const createdProduct = await tx.product.create({
        data: productData,
      });

      // Step 2: Create the additional fields in the corresponding table
      switch (type) {
        case ProductType.FILM:
          await createFilm(tx, data as FilmCreationInput, createdProduct.id);
          break;
        case ProductType.BOOK:
          await createBook(tx, data as BookCreationInput, createdProduct.id);
          break;
        case ProductType.MUSIC:
          await createMusic(tx, data as MusicCreationInput, createdProduct.id);
          break;
        default:
          throw new Error('Invalid product type');
      }

      return createdProduct; // Return the created product
    });

    // Step 3: Return the created product
    return product;
  } catch (error) {
    const errorMessage = getPrismaError(error);
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Retrieves a product by its ID.
 *
 * @param {number} id - The ID of the product to retrieve.
 * @returns {Promise<(Product & (Partial<Film> | Partial<Book> | Partial<Music>)) | null>} -
 *          A promise that resolves to the product object if found, or null if no product with the given ID exists.
 * @throws {Error} - Throws an error if the retrieval operation fails due to database errors or other issues.
 */
export const getProductById = async (id: number): Promise<(Product & (Partial<Film> | Partial<Book> | Partial<Music>)) | null> => {
  try {
    // Attempt to find a unique product in the database based on the provided ID.
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        film: true, // Include film details if needed
        book: true, // Include book details if needed
        music: true, // Include music details if needed
      },
    });

    if (!product) return null; // If no product is found, return null to indicate absence

    // Map the final product to the desired output format (if necessary)
    return mapFinalProduct(product);
  } catch (error) {
    const errorMessage = getPrismaError(error);
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Retrieves products based on the specified product type.
 *
 * @param {string} productType - The type of product to retrieve. It can be either 'FILM', 'BOOK', or 'MUSIC'.
 * @returns {Promise<(Product & (Partial<Film> | Partial<Book> | Partial<Music>))[] | []>}
 * A promise that resolves to an array of products of the specified type. If no products are found, an empty array is returned.
 *
 * @throws {Error} Throws an error if there is an issue retrieving products from the database.
 */
export const getProductsByType = async (productType: string): Promise<(Product & (Partial<Film> | Partial<Book> | Partial<Music>))[] | []> => {
  const upperCaseType = productType.toUpperCase(); // Convert the product type to uppercase for consistency in comparison
  try {
    // Query the database to find products matching the specified type
    const products = await prisma.product.findMany({
      where: { type: fromStringToProductType(upperCaseType) },
      include: {
        film: upperCaseType === ProductType.FILM, // Include film details if the type is FILM
        book: upperCaseType === ProductType.BOOK, // Include book details if the type is BOOK
        music: upperCaseType === ProductType.MUSIC, // Include music details if the type is MUSIC
      },
    });

    // If no products found, return an empty array
    if (!products.length) return [];

    // Map through the products and transform them
    return products.map(mapFinalProduct);
  } catch (error) {
    const errorMessage = getPrismaError(error);
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
};
